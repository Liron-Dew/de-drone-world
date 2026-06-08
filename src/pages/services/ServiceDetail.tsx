import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function ServiceDetailPage({ title }: { title: string }) {
  return (
    <div className="pt-28 pb-20 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <Link to="/services" className="inline-flex items-center gap-2 text-[#00d4ff] text-xs font-inter tracking-wider uppercase mb-8 hover:underline">
          <ArrowLeft size={14}/> Back to Services
        </Link>

        <div className="p-8 border border-[#00d4ff]/20 bg-[#00d4ff]/4 mb-8" style={{clipPath:'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,0 100%)'}}>
          <h1 className="font-orbitron text-white text-2xl font-black mb-4">{title}</h1>
          <p className="font-inter text-gray-400 text-sm leading-relaxed mb-6">
            This service page is under development. Detailed information, case studies, pricing, and portfolio will be added here soon.
          </p>
          <div className="flex flex-wrap gap-4">
            {['Pan-India Coverage', 'DGCA Certified', 'Insurance Covered', 'Latest Equipment'].map(b => (
              <div key={b} className="flex items-center gap-2 px-3 py-2 border border-gray-700 bg-[#111]/50">
                <CheckCircle size={12} className="text-[#00d4ff]"/>
                <span className="font-inter text-gray-300 text-[10px] tracking-wider">{b}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 border border-gray-800/50 bg-[#111]/30 text-center">
          <p className="font-inter text-gray-400 text-sm">Content coming soon. <Link to="/contact" className="text-[#00d4ff] hover:underline">Contact us</Link> for inquiries about {title.toLowerCase()} services.</p>
        </div>
      </div>
    </div>
  );
}
