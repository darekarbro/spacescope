'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

interface CrewMember {
  name: string;
  role: string;
  nationality: string;
  bio: string;
  image_url?: string;
}

interface MissionFormData {
  name: string;
  agency: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled' | 'failed';
  launch_date: string;
  return_date?: string;
  description: string;
  objectives: string[];
  image_url?: string;
  banner_image?: string;
  timeline: TimelineEvent[];
  crew: CrewMember[];
  related_missions: string[];
  official_website?: string;
}

interface Mission extends MissionFormData {
  id: string;
  created_at: string;
  updated_at?: string;
}

export default function AdminMissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const emptyForm: MissionFormData = {
    name: '',
    agency: '',
    status: 'planned',
    launch_date: '',
    return_date: '',
    description: '',
    objectives: [],
    image_url: '',
    banner_image: '',
    timeline: [],
    crew: [],
    related_missions: [],
    official_website: '',
  };

  const [formData, setFormData] = useState<MissionFormData>(emptyForm);
  const [objectiveInput, setObjectiveInput] = useState('');
  const [timelineInput, setTimelineInput] = useState<TimelineEvent>({ date: '', title: '', description: '' });
  const [crewInput, setCrewInput] = useState<CrewMember>({ name: '', role: '', nationality: '', bio: '', image_url: '' });

  // Fetch missions
  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/missions/');
      if (response.ok) {
        const result = await response.json();
        setMissions(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching missions:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const url = editingId
        ? `http://127.0.0.1:8000/api/v1/missions/${editingId}/`
        : 'http://127.0.0.1:8000/api/v1/missions/';

      const method = editingId ? 'PUT' : 'POST';

      // Format dates to ISO 8601
      const payload = {
        ...formData,
        launch_date: formData.launch_date ? new Date(formData.launch_date).toISOString() : '',
        return_date: formData.return_date ? new Date(formData.return_date).toISOString() : null,
        objectives: formData.objectives.length > 0 ? formData.objectives : [],
        timeline: formData.timeline.map(t => ({
          ...t,
          date: t.date ? new Date(t.date).toISOString() : ''
        })),
        crew: formData.crew.length > 0 ? formData.crew : [],
        related_missions: formData.related_missions.length > 0 ? formData.related_missions : [],
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save mission');
      }

      setMessage({
        type: 'success',
        text: editingId ? 'Mission updated successfully!' : 'Mission created successfully!',
      });

      // Reset form and refresh list
      setFormData(emptyForm);
      setIsCreating(false);
      setEditingId(null);
      fetchMissions();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save mission. Please try again.' });
      console.error('Error saving mission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (mission: Mission) => {
    // Convert ISO dates to datetime-local format
    const formatDateTime = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toISOString().slice(0, 16);
    };

    setFormData({
      name: mission.name,
      agency: mission.agency,
      status: mission.status,
      launch_date: formatDateTime(mission.launch_date),
      return_date: mission.return_date ? formatDateTime(mission.return_date) : '',
      description: mission.description,
      objectives: mission.objectives || [],
      image_url: mission.image_url || '',
      banner_image: mission.banner_image || '',
      timeline: (mission.timeline || []).map(t => ({
        ...t,
        date: formatDateTime(t.date)
      })),
      crew: mission.crew || [],
      related_missions: mission.related_missions || [],
      official_website: mission.official_website || '',
    });
    setEditingId(mission.id);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mission?')) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/missions/${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete mission');
      }

      setMessage({ type: 'success', text: 'Mission deleted successfully!' });
      fetchMissions();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete mission. Please try again.' });
      console.error('Error deleting mission:', error);
    }
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setIsCreating(false);
    setEditingId(null);
  };

  // Helper functions for adding items to arrays
  const addObjective = () => {
    if (objectiveInput.trim()) {
      setFormData({ ...formData, objectives: [...formData.objectives, objectiveInput.trim()] });
      setObjectiveInput('');
    }
  };

  const removeObjective = (index: number) => {
    setFormData({ ...formData, objectives: formData.objectives.filter((_, i) => i !== index) });
  };

  const addTimelineEvent = () => {
    if (timelineInput.date && timelineInput.title) {
      setFormData({ ...formData, timeline: [...formData.timeline, timelineInput] });
      setTimelineInput({ date: '', title: '', description: '' });
    }
  };

  const removeTimelineEvent = (index: number) => {
    setFormData({ ...formData, timeline: formData.timeline.filter((_, i) => i !== index) });
  };

  const addCrewMember = () => {
    if (crewInput.name && crewInput.role) {
      setFormData({ ...formData, crew: [...formData.crew, crewInput] });
      setCrewInput({ name: '', role: '', nationality: '', bio: '', image_url: '' });
    }
  };

  const removeCrewMember = (index: number) => {
    setFormData({ ...formData, crew: formData.crew.filter((_, i) => i !== index) });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link href="/admin" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">
          ← Back to Admin Dashboard
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Manage Missions</h1>
        <button
          onClick={() => {
            setIsCreating(!isCreating);
            if (isCreating) handleCancel();
          }}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          {isCreating ? 'Cancel' : 'Create New Mission'}
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
          }`}
        >
          {message.text}
        </div>
      )}

      {isCreating && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Mission' : 'Create New Mission'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mission Name *</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Apollo 11"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Agency *</label>
                  <Input
                    type="text"
                    value={formData.agency}
                    onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                    required
                    placeholder="e.g., NASA"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="planned">Planned</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Launch Date *</label>
                  <Input
                    type="datetime-local"
                    value={formData.launch_date}
                    onChange={(e) => setFormData({ ...formData, launch_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Return Date</label>
                  <Input
                    type="datetime-local"
                    value={formData.return_date || ''}
                    onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe the mission in detail..."
                />
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <Input
                    type="url"
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Banner Image URL</label>
                  <Input
                    type="url"
                    value={formData.banner_image || ''}
                    onChange={(e) => setFormData({ ...formData, banner_image: e.target.value })}
                    placeholder="https://example.com/banner.jpg"
                  />
                </div>
              </div>

              {/* Official Website */}
              <div>
                <label className="block text-sm font-medium mb-2">Official Website</label>
                <Input
                  type="url"
                  value={formData.official_website || ''}
                  onChange={(e) => setFormData({ ...formData, official_website: e.target.value })}
                  placeholder="https://www.nasa.gov/mission"
                />
              </div>

              {/* Objectives */}
              <div>
                <label className="block text-sm font-medium mb-2">Objectives</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    value={objectiveInput}
                    onChange={(e) => setObjectiveInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                    placeholder="Add an objective..."
                  />
                  <button
                    type="button"
                    onClick={addObjective}
                    className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.objectives.map((obj, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-neutral-50 dark:bg-neutral-900 rounded">
                      <span className="flex-1">{obj}</span>
                      <button
                        type="button"
                        onClick={() => removeObjective(i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-sm font-medium mb-2">Timeline Events</label>
                <div className="space-y-2 mb-2 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                  <Input
                    type="datetime-local"
                    value={timelineInput.date}
                    onChange={(e) => setTimelineInput({ ...timelineInput, date: e.target.value })}
                    placeholder="Date"
                  />
                  <Input
                    type="text"
                    value={timelineInput.title}
                    onChange={(e) => setTimelineInput({ ...timelineInput, title: e.target.value })}
                    placeholder="Event Title"
                  />
                  <textarea
                    value={timelineInput.description}
                    onChange={(e) => setTimelineInput({ ...timelineInput, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950"
                    placeholder="Event Description"
                  />
                  <button
                    type="button"
                    onClick={addTimelineEvent}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Add Timeline Event
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.timeline.map((event, i) => (
                    <div key={i} className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-neutral-500">{event.date}</div>
                          <div className="text-sm">{event.description}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTimelineEvent(i)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crew */}
              <div>
                <label className="block text-sm font-medium mb-2">Crew Members</label>
                <div className="space-y-2 mb-2 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      type="text"
                      value={crewInput.name}
                      onChange={(e) => setCrewInput({ ...crewInput, name: e.target.value })}
                      placeholder="Name"
                    />
                    <Input
                      type="text"
                      value={crewInput.role}
                      onChange={(e) => setCrewInput({ ...crewInput, role: e.target.value })}
                      placeholder="Role (e.g., Commander)"
                    />
                  </div>
                  <Input
                    type="text"
                    value={crewInput.nationality}
                    onChange={(e) => setCrewInput({ ...crewInput, nationality: e.target.value })}
                    placeholder="Nationality"
                  />
                  <textarea
                    value={crewInput.bio}
                    onChange={(e) => setCrewInput({ ...crewInput, bio: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950"
                    placeholder="Bio"
                  />
                  <Input
                    type="url"
                    value={crewInput.image_url || ''}
                    onChange={(e) => setCrewInput({ ...crewInput, image_url: e.target.value })}
                    placeholder="Image URL"
                  />
                  <button
                    type="button"
                    onClick={addCrewMember}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Add Crew Member
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {formData.crew.map((member, i) => (
                    <div key={i} className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-neutral-500">{member.role}</div>
                          <div className="text-sm">{member.nationality}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCrewMember(i)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Mission' : 'Create Mission'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Missions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Missions ({missions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {fetchLoading ? (
            <div className="text-center py-8">Loading missions...</div>
          ) : missions.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">No missions found. Create your first mission!</div>
          ) : (
            <div className="space-y-4">
              {missions.map((mission) => (
                <Card key={mission.id} variant="outline">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{mission.name}</h3>
                        <p className="text-sm text-neutral-500 mb-2">
                          {mission.agency} • 
                          <span className={`ml-1 px-2 py-0.5 rounded text-xs font-medium ${
                            mission.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                            mission.status === 'active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                            mission.status === 'planned' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                            mission.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' :
                            'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100'
                          }`}>
                            {mission.status}
                          </span> • 
                          {new Date(mission.launch_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2">
                          {mission.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          {mission.objectives && mission.objectives.length > 0 && (
                            <span className="text-neutral-500">
                              📋 {mission.objectives.length} objectives
                            </span>
                          )}
                          {mission.crew && mission.crew.length > 0 && (
                            <span className="text-neutral-500">
                              👨‍🚀 {mission.crew.length} crew members
                            </span>
                          )}
                          {mission.timeline && mission.timeline.length > 0 && (
                            <span className="text-neutral-500">
                              📅 {mission.timeline.length} timeline events
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(mission)}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(mission.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
