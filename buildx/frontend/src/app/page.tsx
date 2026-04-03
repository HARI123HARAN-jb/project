import React from 'react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Accelerate your <br className="hidden md:block"/>
          <span className="gradient-text">Manufacturing Vision</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          The real-time marketplace where customers shape ideas with AI and specialized vendors accept requests instantly. 
        </p>
        
        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/customer" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            I need something built
          </a>
          <a href="/vendor" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-semibold transition-all transform hover:scale-105 backdrop-blur-sm">
            I am a manufacturer
          </a>
        </div>
        
        {/* Simple mock dashboard preview */}
        <div className="mt-16 w-full h-[400px] glass-panel p-6 flex flex-col items-start text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
          
          <div className="w-full flex justify-between items-center mb-8 border-b border-white/5 pb-4 z-10">
            <h3 className="text-xl font-bold">Live Order Feed</h3>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold animate-pulse">
              Live
            </span>
          </div>
          
          {/* Mock order */}
          <div className="w-full bg-black/40 border border-white/5 rounded-lg p-4 z-10 shadow-xl space-y-3 relative group">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">Custom Robotic Arm V2</h4>
                <p className="text-sm text-gray-400">Payload: 5kg, Reach: 1.2m</p>
              </div>
              <div className="text-right">
                <span className="text-violet-400 font-mono font-bold">$12k - $15k</span>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-1 bg-white/10 rounded text-gray-300">Robotics</span>
              <span className="text-xs px-2 py-1 bg-white/10 rounded text-gray-300">AI</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
