import type { Mission } from '@/types/mission';

export const MISSIONS: Mission[] = [
  {
    id: 'apollo-11',
    name: 'Apollo 11',
    agency: 'NASA',
    status: 'completed',
    launch_date: '1969-07-16',
    description: "First crewed lunar landing mission. Neil Armstrong and Buzz Aldrin walked on the Moon.",
    objectives: ['Demonstrate crewed lunar landing', 'Collect lunar samples'],
    image_url: '/images/missions/apollo-11.jpg',
    banner_image: '/images/missions/apollo-11-banner.jpg',
    return_date: '1969-07-24',
    timeline: [
      { date: '1969-07-16', title: 'Launch', description: 'Saturn V launch from Kennedy Space Center.' },
      { date: '1969-07-20', title: 'Lunar Landing', description: 'Eagle lands on the Moon; Armstrong walks on the surface.' },
      { date: '1969-07-24', title: 'Splashdown', description: 'Command module returns to Earth.' },
    ],
    crew: [
      { name: 'Neil Armstrong', role: 'Commander', country: 'USA', photo: '/images/crew/armstrong.jpg' },
      { name: 'Buzz Aldrin', role: 'Lunar Module Pilot', country: 'USA', photo: '/images/crew/aldrin.jpg' },
      { name: 'Michael Collins', role: 'Command Module Pilot', country: 'USA', photo: '/images/crew/collins.jpg' },
    ],
    related_ids: ['voyager-1'],
    website_url: 'https://www.nasa.gov/mission_pages/apollo/missions/apollo11.html',
  },
  {
    id: 'voyager-1',
    name: 'Voyager 1',
    agency: 'NASA',
    status: 'active',
    launch_date: '1977-09-05',
    description: 'Exploration of the outer Solar System and now travelling in interstellar space.',
    objectives: ['Flybys of Jupiter and Saturn', 'Interstellar mission'],
    image_url: '/images/missions/voyager-1.jpg',
    banner_image: '/images/missions/voyager-1-banner.jpg',
    timeline: [
      { date: '1977-09-05', title: 'Launch', description: 'Launched on a Titan IIIE/Centaur rocket.' },
      { date: '1979-03-05', title: 'Jupiter Flyby', description: 'Provided detailed images and data of Jupiter.' },
      { date: '1980-11-12', title: 'Saturn Flyby', description: 'Completed Saturn encounter.' },
    ],
    crew: [],
    related_ids: ['voyager-1'],
    website_url: 'https://voyager.jpl.nasa.gov/',
  },
  {
    id: 'perseverance',
    name: 'Perseverance',
    agency: 'NASA',
    status: 'active',
    launch_date: '2020-07-30',
    description: 'Mars rover searching for signs of past microbial life and caching samples.',
    objectives: ['Astrobiology', 'Sample caching'],
    image_url: '/images/missions/perseverance.jpg',
    banner_image: '/images/missions/perseverance-banner.jpg',
    timeline: [
      { date: '2020-07-30', title: 'Launch', description: 'Launch aboard Atlas V from Cape Canaveral.' },
      { date: '2021-02-18', title: 'Mars Landing', description: 'Successful touchdown in Jezero Crater.' },
    ],
    crew: [],
    related_ids: ['perseverance'],
    website_url: 'https://mars.nasa.gov/mars2020/',
  },
  {
    id: 'artemis-i',
    name: 'Artemis I',
    agency: 'NASA',
    status: 'completed',
    launch_date: '2022-11-16',
    description: "Uncrewed test flight for NASA's Artemis program to return humans to the Moon.",
    objectives: ['Test Orion and SLS systems'],
    image_url: '/images/missions/artemis-i.jpg',
    banner_image: '/images/missions/artemis-i-banner.jpg',
    timeline: [
      { date: '2022-11-16', title: 'Launch', description: 'SLS and Orion launched on an uncrewed test flight.' },
      { date: '2022-11-25', title: 'Return', description: 'Orion returned near Earth after lunar flyby.' },
    ],
    crew: [],
    related_ids: ['artemis-i'],
    website_url: 'https://www.nasa.gov/artemis',
  },
];

export function getMissionById(id: string): Mission | undefined {
  return MISSIONS.find((m) => m.id === id);
}

export default MISSIONS;
