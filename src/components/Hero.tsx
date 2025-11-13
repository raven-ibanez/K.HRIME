import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-khrime-black via-khrime-gray-900 to-khrime-black py-24 px-4 border-b border-khrime-gray-800 overflow-hidden min-h-[600px] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <img
          src="https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763037134407-6ppy164wiji.jpg"
          alt="KHRIME"
          className="w-full h-full object-cover"
          style={{ opacity: 0.7 }}
          loading="eager"
          onError={(e) => {
            console.error('Hero image failed to load:', e);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-khrime-black/50 via-khrime-gray-900/40 to-khrime-black/50"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-gothic-decorative font-bold text-white mb-4 tracking-wider">
            KHRIME
          </h1>
          <div className="flex items-center justify-center space-x-2 text-khrime-gray-400 text-sm font-gothic tracking-widest uppercase mb-6">
            <span>clouds</span>
            <span>•</span>
            <span>ink</span>
            <span>•</span>
            <span>clothes</span>
          </div>
        </div>
        <p className="text-xl text-khrime-gray-300 mb-10 max-w-2xl mx-auto animate-slide-up font-gothic">
          Est. 2025
        </p>
        <div className="flex justify-center animate-slide-up">
          <a 
            href="#menu"
            className="bg-white text-khrime-black px-8 py-3 rounded-none hover:bg-khrime-gray-200 transition-all duration-300 transform hover:scale-105 font-gothic font-semibold border-2 border-white uppercase tracking-wider"
          >
            Explore Menu
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;