'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Calendar, 
  MapPin, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { eventService } from '@/lib/services/eventService';
import type { Event, EventType, EventStatus, CreateEventDTO, UpdateEventDTO } from '@/types/event';
import { LocationPickerMap } from '@/components/admin/location-picker-map';

const EVENT_TYPES: EventType[] = [
  'solar_eclipse',
  'lunar_eclipse',
  'meteor_shower',
  'aurora',
  'iss_pass',
  'comet',
  'conjunction',
  'transit',
];

const EVENT_STATUSES: EventStatus[] = [
  'pending',
  'approved',
  'rejected',
  'cancelled',
  'completed',
];

const STATUS_COLORS: Record<EventStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

const TYPE_LABELS: Record<EventType, string> = {
  solar_eclipse: '☀️ Solar Eclipse',
  lunar_eclipse: '🌙 Lunar Eclipse',
  meteor_shower: '🌠 Meteor Shower',
  aurora: '🌌 Aurora',
  iss_pass: '🛸 ISS Pass',
  comet: '☄️ Comet',
  conjunction: '🪐 Conjunction',
  transit: '🔭 Transit',
};

type ViewMode = 'list' | 'create' | 'edit';

export default function AdminEventsPage() {
  // State
  const [events, setEvents] = useState<Event[]>([]);
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<EventType | ''>('');
  const [filterStatus, setFilterStatus] = useState<EventStatus | ''>('');

  // Form data
  const [formData, setFormData] = useState<CreateEventDTO>({
    title: '',
    description: '',
    event_type: 'meteor_shower',
    start_time: '',
    end_time: '',
    latitude: undefined,
    longitude: undefined,
    magnitude: undefined,
    image: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  // Fetch events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: Record<string, string> = {};
      if (searchQuery) filters.search = searchQuery;
      if (filterType) filters.event_type = filterType;
      if (filterStatus) filters.status = filterStatus;

      const response = await eventService.getAll(limit, (page - 1) * limit, filters);
      setEvents(response.results);
      setTotalCount(response.count);
    } catch (err) {
      setError('Failed to load events. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, filterType, filterStatus]);

  // Fetch pending events for moderation
  const fetchPendingEvents = useCallback(async () => {
    try {
      const response = await eventService.getAll(100, 0, { status: 'pending' });
      setPendingEvents(response.results);
    } catch (err) {
      console.error('Failed to load pending events:', err);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchPendingEvents();
  }, [fetchEvents, fetchPendingEvents]);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_type: 'meteor_shower',
      start_time: '',
      end_time: '',
      latitude: undefined,
      longitude: undefined,
      magnitude: undefined,
      image: '',
      tags: [],
    });
    setTagInput('');
    setEditingEvent(null);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (viewMode === 'edit' && editingEvent) {
        // Update existing event
        await eventService.update(editingEvent.id, formData as UpdateEventDTO);
        setSuccess('Event updated successfully!');
      } else {
        // Create new event
        await eventService.create(formData);
        setSuccess('Event created successfully!');
      }
      
      resetForm();
      setViewMode('list');
      fetchEvents();
      fetchPendingEvents();
    } catch (err) {
      setError(viewMode === 'edit' ? 'Failed to update event.' : 'Failed to create event.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      event_type: event.event_type,
      start_time: event.start_time ? new Date(event.start_time).toISOString().slice(0, 16) : '',
      end_time: event.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : '',
      latitude: event.latitude,
      longitude: event.longitude,
      magnitude: event.magnitude,
      image: event.image || '',
      tags: event.tags || [],
    });
    setViewMode('edit');
  };

  // Handle delete
  const handleDelete = async (eventId: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventService.delete(eventId);
      setSuccess('Event deleted successfully!');
      fetchEvents();
      fetchPendingEvents();
    } catch (err) {
      setError('Failed to delete event.');
      console.error(err);
    }
  };

  // Handle approve/reject
  const handleModerate = async (eventId: number, status: 'approved' | 'rejected') => {
    try {
      await eventService.patch(eventId, { status });
      setSuccess(`Event ${status} successfully!`);
      fetchEvents();
      fetchPendingEvents();
    } catch (err) {
      setError(`Failed to ${status} event.`);
      console.error(err);
    }
  };

  // Handle add tag
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  // Handle remove tag
  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    });
  };

  // Handle location select from map
  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData({
      ...formData,
      latitude: lat || undefined,
      longitude: lng || undefined,
    });
  };

  // Total pages
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Event Management</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage astronomical events, approve submissions, and more
          </p>
        </div>
        {viewMode === 'list' ? (
          <Button onClick={() => { resetForm(); setViewMode('create'); }}>
            <Plus size={18} className="mr-2" />
            Create Event
          </Button>
        ) : (
          <Button variant="outline" onClick={() => { resetForm(); setViewMode('list'); }}>
            <ChevronLeft size={18} className="mr-2" />
            Back to List
          </Button>
        )}
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X size={18} />
          </button>
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <>
          {/* Pending Events / Moderation Queue */}
          {pendingEvents.length > 0 && (
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                Moderation Queue ({pendingEvents.length} pending)
              </h2>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {pendingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-500">
                        {TYPE_LABELS[event.event_type]} • 
                        {event.start_time && new Date(event.start_time).toLocaleDateString()}
                        {event.submitted_by && ` • by ${event.submitted_by.username}`}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(event)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => handleModerate(event.id, 'approved')}
                      >
                        <Check size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleModerate(event.id, 'rejected')}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as EventType | '')}
                className="px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700"
              >
                <option value="">All Types</option>
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as EventStatus | '')}
                className="px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700"
              >
                <option value="">All Statuses</option>
                {EVENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <Button variant="outline" onClick={() => { setSearchQuery(''); setFilterType(''); setFilterStatus(''); }}>
                <Filter size={18} className="mr-2" />
                Clear Filters
              </Button>
              <Button variant="outline" onClick={fetchEvents}>
                <RefreshCw size={18} />
              </Button>
            </div>
          </Card>

          {/* Events Table */}
          <Card className="overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Calendar size={48} className="mb-4 opacity-50" />
                <p>No events found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setViewMode('create')}
                >
                  Create your first event
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    {events.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {event.image && (
                              <img
                                src={event.image}
                                alt={event.title}
                                className="w-10 h-10 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium">{event.title}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {event.description ? `${event.description.substring(0, 50)}...` : 'No description'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm">{TYPE_LABELS[event.event_type]}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            {event.start_time && new Date(event.start_time).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {event.start_time && new Date(event.start_time).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {event.latitude && event.longitude ? (
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin size={14} />
                              {event.latitude.toFixed(2)}, {event.longitude.toFixed(2)}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${STATUS_COLORS[event.status]}`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(event)}
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(event.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t dark:border-slate-700">
                <div className="text-sm text-gray-500">
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalCount)} of {totalCount} events
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <span className="flex items-center px-3 text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </>
      )}

      {/* Create / Edit Form */}
      {(viewMode === 'create' || viewMode === 'edit') && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">
              {viewMode === 'edit' ? 'Edit Event' : 'Create New Event'}
            </h2>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter event title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Event Type *</label>
                  <select
                    value={formData.event_type}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value as EventType })}
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700"
                    required
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {TYPE_LABELS[type]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the astronomical event in detail..."
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700 resize-none"
                  required
                />
              </div>

              {/* Date/Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Time *</label>
                  <Input
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Time</label>
                  <Input
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  />
                </div>
              </div>

              {/* Location Picker Map */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Location (Select on Map)
                </label>
                <LocationPickerMap
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onLocationSelect={handleLocationSelect}
                />
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Magnitude</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.magnitude ?? ''}
                    onChange={(e) =>
                      setFormData({ ...formData, magnitude: e.target.value ? parseFloat(e.target.value) : undefined })
                    }
                    placeholder="e.g., 4.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <Input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag and press Enter"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Status (only for editing) */}
              {viewMode === 'edit' && editingEvent && (
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={editingEvent.status}
                    onChange={(e) => {
                      setEditingEvent({ ...editingEvent, status: e.target.value as EventStatus });
                    }}
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700"
                  >
                    {EVENT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => { resetForm(); setViewMode('list'); }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {viewMode === 'edit' ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {viewMode === 'edit' ? 'Update Event' : 'Create Event'}
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
