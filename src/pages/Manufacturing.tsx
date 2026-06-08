import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Shield, Award, Factory } from 'lucide-react';

export default function ManufacturingPage() {
  return (
    <div className="pt-28 pb-20 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-label">Made in India</span>
          <h1 className="section-title">Drone Manufacturing</h1>
          <div className="glow-line"/>
          <p className="font-inter text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
            Indigenous drone manufacturing with precision fabrication, carbon fiber frames, and PCB assembly for engineering and commercial applications.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {([
            [Cpu, 'Precision Fabrication', 'Advanced CNC machining and 3D printing for drone components.'],
            [Shield, 'Quality Assured', 'Every drone undergoes rigorous testing and quality checks.'],
            [Award, 'DGCA Compliant', 'All manufacturing meets DGCA standards and regulations.'],
            [Factory, 'Indigenous Manufacturing', 'Proudly designed and manufactured in India.'],
          ] as const).map(([IconC, title, desc]) => {
            const Icon = IconC as React.ElementType;
            return (
              <div key={title} className="p-5 border border-gray-800/50 bg-[#111]/50 hover:border-[#00d4ff]/20 transition-all duration-400">
                <div className="w-10 h-10 flex items-center justify-center border border-[#00d4ff]/30 bg-[#00d4ff]/5 mb-3">
                  <Icon size={16} className="text-[#00d4ff]"/>
                </div>
                <h3 className="font-orbitron text-white text-[10px] font-semibold mb-2">{title}</h3>
                <p className="font-inter text-gray-400 text-[10px] leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>

        <div className="p-8 border border-[#00d4ff]/20 bg-[#00d4ff]/4 text-center" style={{clipPath:'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,0 100%)'}}>
          <h3 className="font-orbitron text-white text-sm font-semibold mb-3">Interested in Our Drone Products?</h3>
          <p className="font-inter text-gray-400 text-xs max-w-lg mx-auto mb-5">Get in touch for custom drone manufacturing, bulk orders, and partnership inquiries.</p>
          <Link to="/contact" className="neon-btn inline-flex">Inquire Now <ArrowRight size={13}/></Link>
        </div>
      </div>
    </div>
  );
}
