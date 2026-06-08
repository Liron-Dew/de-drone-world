import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CheckCircle, Wind, Sun, Zap, Thermometer,
  Building2, Route, Shield, Clock, TrendingUp, BarChart3
} from 'lucide-react';

interface Particle { x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number; max: number; }

const SUB_SERVICES = [
  {
    icon: Wind, title: 'Windmill Inspection',
    desc: 'Comprehensive blade and tower inspections for wind turbines using high-resolution and thermal cameras. Detect micro-cracks, erosion, and lightning damage without costly rope access.',
    benefits: ['Turbine inspection in under 30 mins', '1mm crack detection resolution', 'No tower climbing required', 'Detailed condition reports with thermal data'],
  },
  {
    icon: Sun, title: 'Solar Panel Inspection',
    desc: 'Large-scale solar farm inspection using thermal drones. Identify hot spots, malfunctioning panels, and soiling issues across thousands of panels in a single flight.',
    benefits: ['1000+ panels inspected per hour', 'Thermal anomaly detection', 'Automated report generation', 'Up to 15% efficiency recovery identified'],
  },
  {
    icon: Zap, title: 'Power Line Inspection',
    desc: 'Safe and efficient power line and transmission tower inspection. Our drones navigate complex corridors to identify vegetation growth, insulator damage, and corrosion.',
    benefits: ['5x faster than ground patrols', 'Live video feed to control room', 'Vegetation encroachment analysis', 'EMF-safe distance maintained'],
  },
  {
    icon: Thermometer, title: 'Drone Thermography',
    desc: 'Advanced aerial thermal imaging for building envelope analysis, electrical substation inspection, and industrial equipment monitoring. Detect heat loss, overheating components, and moisture intrusion.',
    benefits: ['High-sensitivity thermal camera (±0.1°C)', 'Real-time temperature mapping', 'Multi-spectral analysis', 'Comprehensive thermal reports'],
  },
  {
    icon: Building2, title: 'Construction Inspection',
    desc: 'Monitor construction progress, detect structural issues, and create as-built documentation with high-resolution aerial imagery and 3D modeling.',
    benefits: ['Weekly progress monitoring', 'Crack & settlement detection', 'As-built verification', 'Shareable 3D visualizations'],
  },
  {
    icon: Route, title: 'Pipeline Inspection',
    desc: 'Inspect oil, gas, and water pipelines for leaks, corrosion, and third-party interference. Cover hundreds of kilometers in days instead of weeks.',
    benefits: ['Right-of-way monitoring', 'Leak detection with gas sensors', 'Vegetation encroachment tracking', 'GPS-mapped defect locations'],
  },
];

const PROCESS = [
  { step: '01', title: 'Site Assessment', desc: 'Our engineers visit the site to understand assets, access constraints, safety requirements, and inspection goals.' },
  { step: '02', title: 'Flight Planning', desc: 'We create detailed flight paths with automated waypoints, obstacle avoidance, and optimal camera angles for complete coverage.' },
  { step: '03', title: 'Data Acquisition', desc: 'Certified pilots execute the inspection, capturing high-resolution visual, thermal, and multispectral data.' },
  { step: '04', title: 'AI Analysis', desc: 'Advanced AI and computer vision algorithms analyze the data to identify defects, anomalies, and areas of concern.' },
  { step: '05', title: 'Report & Recommendations', desc: 'We deliver a comprehensive inspection report with annotated findings, severity ratings, and actionable maintenance recommendations.' },
];

const BENEFITS = [
  { icon: Shield, title: 'Enhanced Safety', desc: 'Eliminate risky rope access and confined space entry — keep your team safely on the ground.' },
  { icon: Clock, title: 'Faster Inspections', desc: 'Complete in hours what takes days with traditional methods. Up to 10x faster coverage.' },
  { icon: TrendingUp, title: 'Cost Effective', desc: 'Reduce inspection costs by up to 60% while getting more comprehensive data.' },
  { icon: BarChart3, title: 'Better Data', desc: 'High-resolution thermal, visual, and multispectral data with automated defect detection.' },
];

const EQUIPMENT = [
  { name: 'DJI Matrice 300 RTK', spec: '60min flight, IP45 rated' },
  { name: 'H20T Thermal Camera', spec: '640x512 thermal, 20MP zoom' },
  { name: 'L1 LiDAR Scanner', spec: 'cm-level accuracy, 450m range' },
  { name: 'Gas Detection Payload', spec: 'Multi-gas sensor array' },
];

function useVisible(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold });
    ob.observe(el);
    return () => ob.disconnect();
  }, [threshold]);
  return { ref, vis };
}

function Counter({ target, suffix, vis }: { target: number; suffix: string; vis: boolean }) {
  const [n, setN] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!vis || done.current) return;
    done.current = true;
    let cur = 0; const step = target / 55;
    const t = setInterval(() => { cur += step; if (cur >= target) { setN(target); clearInterval(t); } else setN(Math.floor(cur)); }, 35);
    return () => clearInterval(t);
  }, [vis, target]);
  return <>{n}{suffix}</>;
}

function Particles() {
  const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    const ps: Particle[] = [];
    let raf: number;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const frame = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      if (ps.length < 50) ps.push({ x: Math.random()*c.width, y: Math.random()*c.height, vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3, size: Math.random()*1.2+.3, alpha: Math.random()*.4+.1, life: 0, max: Math.random()*230+120 });
      for (let i = ps.length-1; i >= 0; i--) {
        const p = ps[i]; p.x += p.vx; p.y += p.vy; p.life++;
        const fade = p.life < 20 ? p.life/20 : p.life > p.max-20 ? (p.max-p.life)/20 : 1;
        ctx.save(); ctx.globalAlpha = p.alpha*fade; ctx.fillStyle='#00d4ff'; ctx.shadowBlur=4; ctx.shadowColor='#00d4ff';
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill(); ctx.restore();
      }
      for (let i=0;i<ps.length;i++) for (let j=i+1;j<ps.length;j++) {
        const d = Math.hypot(ps[i].x-ps[j].x,ps[i].y-ps[j].y); if (d<85) { ctx.save(); ctx.globalAlpha=(1-d/85)*.09; ctx.strokeStyle='#00d4ff'; ctx.lineWidth=.5; ctx.beginPath(); ctx.moveTo(ps[i].x,ps[i].y); ctx.lineTo(ps[j].x,ps[j].y); ctx.stroke(); ctx.restore(); }
      }
      raf = requestAnimationFrame(frame);
    };
    frame();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={cv} className="absolute inset-0 pointer-events-none" />;
}

export default function InspectionPage() {
  const { ref: visRef, vis } = useVisible();
  const { ref: statsRef, vis: statsVis } = useVisible();
  const [py, setPy] = useState(0);
  useEffect(() => {
    const fn = () => setPy(window.scrollY * 0.3);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <Particles />
        <div className="absolute inset-0 z-0" style={{ transform: `translateY(${py}px)`, willChange: 'transform' }}>
          <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(135deg, rgba(10,10,10,.9) 0%, rgba(10,10,10,.5) 40%, rgba(10,10,10,.8) 100%)' }} />
          <img src="/assets/services/drone-thermography-service.jpeg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 grid-tex z-10" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="rotate-slow w-[500px] h-[500px] border border-[#00d4ff]/6 rounded-full absolute" />
          <div className="rotate-slow-rev w-[300px] h-[300px] border border-[#00d4ff]/10 rounded-full absolute" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-28">
          <Link to="/services" className="inline-flex items-center gap-2 text-[#00d4ff] text-xs font-inter tracking-wider uppercase mb-8 hover:underline">
            <ArrowLeft size={14} /> Back to Services
          </Link>
          <div className="max-w-3xl">
            <span className="section-label text-[#00d4ff] tracking-[.35em] text-[10px] mb-3 block">Industrial Inspection</span>
            <h1 className="font-orbitron font-black leading-[1.05] text-white" style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
              See What Others<br />
              <span className="text-glow" style={{ color: '#00d4ff' }}>Can't</span>
            </h1>
            <p className="font-inter text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl mt-5 mb-8">
              Industrial-grade drone inspection services that eliminate risk and reduce downtime.
              Thermal, visual, and multispectral inspections for critical infrastructure —
              from wind farms to substations, solar fields to pipelines.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/contact" className="neon-btn text-xs px-6 py-3">
                Schedule an Inspection <ArrowRight size={12} />
              </Link>
              <div className="flex items-center gap-2 text-gray-400 text-xs font-inter border border-gray-800/50 px-4 py-2.5">
                <CheckCircle size={12} className="text-[#00d4ff]" />
                <span>300+ Assets Inspected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Overview ── */}
      <section ref={visRef} className="py-20 relative overflow-hidden" style={{ background: '#080808' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className={`grid lg:grid-cols-2 gap-14 items-center ai-in ${vis ? 'ai-visible' : ''}`}>
            <div className="space-y-5">
              <span className="section-label">Overview</span>
              <h2 className="section-title">Inspect Without Risk</h2>
              <div className="w-10 h-0.5 bg-[#00d4ff]" style={{ boxShadow: '0 0 8px rgba(0,212,255,.8)' }} />
              <p className="font-inter text-gray-300 text-sm leading-relaxed">
                Traditional industrial inspection often means sending people into dangerous
                environments — climbing wind turbines, walking across solar farms, or
                navigating confined spaces. Our drones change that.
              </p>
              <p className="font-inter text-gray-400 text-sm leading-relaxed">
                Equipped with <strong className="text-white">high-resolution thermal cameras</strong>,
                <strong className="text-white"> LiDAR scanners</strong>, and
                <strong className="text-white"> AI-powered analytics</strong>, our drones
                capture detailed inspection data while your team stays safely on the ground.
                We've inspected over <strong className="text-[#00d4ff]">300+ industrial assets</strong>
                across India including wind farms, solar plants, and power infrastructure.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[['300+', 'Assets Inspected'], ['60%', 'Cost Saving'], ['10x', 'Faster'], ['99.5%', 'Accuracy']].map(([v, l]) => (
                  <div key={l} className="p-3 border border-gray-800/50 bg-[#111]/40 text-center">
                    <div className="font-orbitron text-[#00d4ff] text-lg font-black text-glow leading-none">
                      <Counter target={parseInt(v.replace(/[^\d]/g, '')) || 300} suffix={v.includes('+') ? '+' : v.includes('%') ? '%' : v.includes('x') ? 'x' : ''} vis={vis} />
                    </div>
                    <div className="font-inter text-gray-400 text-[9px] tracking-wider uppercase mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden h-[380px]" style={{ clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))' }}>
                <img src="/assets/services/drone-thermography-service.jpeg" alt="Thermal drone inspection" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,.06) 0%, transparent 60%)' }} />
              </div>
              <div className="absolute -bottom-4 -left-4 p-4 border border-[#00d4ff]/20 z-10" style={{ background: 'rgba(17,17,17,.95)', clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}>
                <div className="font-orbitron text-[#00d4ff] text-sm font-black">±0.1°C</div>
                <div className="font-inter text-gray-400 text-[9px] mt-0.5">Thermal Sensitivity</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sub-Services ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className={`text-center mb-14 ai-in ${vis ? 'ai-visible' : ''}`}>
            <span className="section-label">Our Solutions</span>
            <h2 className="section-title">Inspection Services</h2>
            <div className="glow-line" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SUB_SERVICES.map(({ icon: Icon, title, desc, benefits }, i) => (
              <div key={title} className={`p-6 border border-gray-800/50 bg-[#111]/40 hover:border-[#00d4ff]/25 hover:-translate-y-1 transition-all duration-400 ai-in ${vis ? 'ai-visible' : ''} ai-d${Math.min(i + 1, 6)}`}
                style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center border border-[#00d4ff]/30 bg-[#00d4ff]/8">
                    <Icon size={16} className="text-[#00d4ff]" />
                  </div>
                  <h3 className="font-orbitron text-white text-xs font-bold">{title}</h3>
                </div>
                <p className="font-inter text-gray-400 text-xs leading-relaxed mb-4">{desc}</p>
                <div className="space-y-1.5">
                  {benefits.map((b) => (
                    <div key={b} className="flex items-center gap-2">
                      <CheckCircle size={9} className="text-[#00d4ff] flex-shrink-0" />
                      <span className="font-inter text-gray-300 text-[10px]">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: '#080808' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className={`text-center mb-14 ai-in ${vis ? 'ai-visible' : ''}`}>
            <span className="section-label">Our Process</span>
            <h2 className="section-title">How It Works</h2>
            <div className="glow-line" />
          </div>
          <div className="relative">
            <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-[#00d4ff] via-[#00d4ff]/30 to-transparent hidden md:block" />
            <div className="space-y-8">
              {PROCESS.map(({ step, title, desc }, i) => (
                <div key={step} className={`flex flex-col md:flex-row gap-6 md:gap-10 items-start ai-in ${vis ? 'ai-visible' : ''} ai-d${Math.min(i + 1, 6)} ${i > 0 ? 'md:mt-6' : ''}`}>
                  <div className="flex-shrink-0 relative z-10">
                    <div className="w-[46px] h-[46px] flex items-center justify-center border-2 border-[#00d4ff] bg-[#0a0a0a]" style={{ boxShadow: '0 0 20px rgba(0,212,255,.2)' }}>
                      <span className="font-orbitron text-[#00d4ff] text-xs font-bold">{step}</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-[#111]/50 border border-gray-800/50 p-6 hover:border-[#00d4ff]/20 transition-all duration-400"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)' }}>
                    <h3 className="font-orbitron text-white text-sm font-bold mb-2">{title}</h3>
                    <p className="font-inter text-gray-400 text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section ref={statsRef} className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d1f2d, #0a2030, #0d1f2d)' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,.04) 0%, rgba(0,212,255,.08) 50%, rgba(0,212,255,.04) 100%)' }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 300, suffix: '+', label: 'Assets Inspected' },
              { value: 60, suffix: '%', label: 'Cost Reduced' },
              { value: 10000, suffix: '+', label: 'Hours Saved' },
              { value: 50, suffix: '+', label: 'Industrial Clients' },
            ].map(({ value, suffix, label }, i) => (
              <div key={label} className={`text-center ai-in ${statsVis ? 'ai-visible' : ''} ai-d${i + 1}`}>
                <div className="font-orbitron text-white text-3xl md:text-4xl font-black text-glow leading-none">
                  <Counter target={value} suffix={suffix} vis={statsVis} />
                </div>
                <div className="font-inter text-gray-400 text-[10px] tracking-wider uppercase mt-2">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className={`text-center mb-14 ai-in ${vis ? 'ai-visible' : ''}`}>
            <span className="section-label">Benefits</span>
            <h2 className="section-title">Why Drone Inspection?</h2>
            <div className="glow-line" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`p-6 border border-gray-800/50 bg-[#111]/40 hover:border-[#00d4ff]/20 hover:-translate-y-1 transition-all duration-400 ai-in ${vis ? 'ai-visible' : ''} ai-d${i + 1}`}
                style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)' }}>
                <div className="w-10 h-10 flex items-center justify-center border border-[#00d4ff]/30 bg-[#00d4ff]/8 mb-4">
                  <Icon size={16} className="text-[#00d4ff]" />
                </div>
                <h3 className="font-orbitron text-white text-xs font-semibold mb-2">{title}</h3>
                <p className="font-inter text-gray-400 text-[10px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Equipment ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: '#080808' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className={`text-center mb-14 ai-in ${vis ? 'ai-visible' : ''}`}>
            <span className="section-label">Technology</span>
            <h2 className="section-title">Our Equipment</h2>
            <div className="glow-line" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EQUIPMENT.map(({ name, spec }, i) => (
              <div key={name} className={`p-5 border border-gray-800/50 bg-[#111]/40 hover:border-[#00d4ff]/20 transition-all duration-400 text-center ai-in ${vis ? 'ai-visible' : ''} ai-d${i + 1}`}>
                <div className="font-orbitron text-white text-xs font-semibold mb-1">{name}</div>
                <div className="font-inter text-gray-400 text-[10px]">{spec}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: '#060606' }}>
        <div className="absolute inset-0 grid-tex opacity-20" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className={`p-10 md:p-14 border border-[#00d4ff]/15 bg-[#00d4ff]/3`}
            style={{ clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))' }}>
            <span className="section-label block mb-4">Safety First</span>
            <h2 className="font-orbitron text-white font-black mb-4" style={{ fontSize: 'clamp(22px, 4vw, 42px)' }}>
              Ready to Make Your Inspections<br />
              <span className="text-glow" style={{ color: '#00d4ff' }}>Safer & Smarter?</span>
            </h2>
            <p className="font-inter text-gray-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
              Contact us for a free consultation and pilot inspection. See how drone technology
              can transform your asset management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="neon-btn">
                Request Inspection <ArrowRight size={13} />
              </Link>
              <Link to="/services" className="neon-btn-ghost">
                Explore Other Services <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
