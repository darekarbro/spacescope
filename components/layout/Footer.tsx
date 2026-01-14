'use client';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">SpaceScope</h3>
            <p className="text-sm">Explore, Learn & Stay Connected with the Universe</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/explore" className="hover:text-white">Events</a></li>
              <li><a href="/cosmic-weather" className="hover:text-white">Cosmic Weather</a></li>
              <li><a href="/missions" className="hover:text-white">Missions</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Learn</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/earth-impact" className="hover:text-white">Earth Impact</a></li>
              <li><a href="/learn" className="hover:text-white">Learning Zone</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; 2026 SpaceScope. All rights reserved. | Made for the Hack The Space Hackathon</p>
        </div>
      </div>
    </footer>
  );
}
