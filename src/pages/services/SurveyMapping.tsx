import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CheckCircle, Map, Mountain, Box,
  Layers, BarChart3, Clock, TrendingUp, Eye, Globe
} from 'lucide-react';

interface Particle { x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number; max: number; }

const SUB_SERVICES = [
  {
    icon: Map, title: 'Land Surveying',
    desc: 'High-precision topographic surveys for land development, real estate, and infrastructure planning. Generate accurate contour maps, elevation models, and boundary data.',
    benefits: ['1cm GSD accuracy', '10x faster than traditional survey', 'Dense point cloud data', 'Auto-generated contour maps'],
  },
  {
    icon: Mountain, title: 'Construction & Infrastructure Mapping',
    desc: 'Monitor construction progress with weekly orthomosaic maps and 3D models. Track volume changes, detect deviations, and maintain a complete digital record of your project.',
    benefits: ['Weekly progress orthomosaics', 'Volume calculation accuracy ±1%', 'As-built documentation', 'Shareable project dashboard'],
  },
  {
    icon: Box, title: '3D Mapping & Modeling',
    desc: 'Create photorealistic 3D models of buildings, structures, and terrain using advanced photogrammetry. Perfect for heritage preservation, real estate marketing, and urban planning.',
    benefits: ['Texture-rich 3D mesh models', 'Sub-centimeter resolution', 'VR/AR compatible outputs', 'Drone + ground fusion data'],
  },
  {
    icon: Layers, title: 'GIS & Data Analysis',
    desc: 'Comprehensive GIS integration and spatial analysis for informed decision-making. We process raw drone data into actionable GIS layers and insights.',
    benefits: ['ArcGIS/QGIS compatible', 'Custom GIS layer creation', 'Spatial analysis & queries', 'API integration available'],
  },
  {
    icon: BarChart3, title: 'Mining & Stockpile Analysis',
    desc: 'Accurate volume measurements, stockpile inventory, and mine site mapping. Make informed decisions with real-time data on extraction progress and material movement.',
    benefits: ['Volume accuracy within ±1%', 'Automated stockpile reports', 'Progression monitoring', 'Cost-effective surveys'],
  },
];

const PROCESS = [
  { step: '01', title: 'Project Briefing', desc: 'We understand your survey requirements, accuracy needs, deliverable formats, and site conditions.' },
  { step: '02', title: 'Flight Planning', desc: 'Using advanced mission planning software, we design optimal flight paths with proper overlap for photogrammetry.' },
  { step: '03', title: 'Aerial Capture', desc: 'Our survey-grade drones capture high-resolution imagery with RTK GPS for centimeter-level accuracy.' },
  { step: '04', title: 'Data Processing', desc: 'Advanced photogrammetry and LiDAR processing software generates orthomosaics, point clouds, and 3D models.' },
  { step: '05', title: 'Deliverables', desc: 'We deliver processed data in your preferred format — CAD, GIS, PDF reports, or interactive web viewers.' },
];

const BENEFITS = [
  { icon: Eye, title: 'Ultra-High Accuracy', desc: 'RTK GPS-enabled drones achieve 1cm accuracy — matching or exceeding traditional survey methods.' },
  { icon: Clock, title: 'Rapid Coverage', desc: 'Survey 100+ acres per day versus 10-15 acres with traditional ground-based methods.' },
  { icon: TrendingUp, title: 'Cost Effective', desc: 'Reduce survey costs by up to 70% while getting richer, more detailed data.' },
  { icon: Globe, title: 'Remote Access', desc: 'Survey hazardous or inaccessible terrain without putting personnel at risk.' },
];

const EQUIPMENT = [
  { name: 'DJI M300 RTK + L1', spec: 'LiDAR, 450m range, 1cm acc.' },
  { name: 'P1 Full-Frame Camera', spec: '45MP, mechanical shutter' },
  { name: 'RTK Base Station', spec: 'Network RTK + PPK support' },
  { name: 'Pix4Dmatic / Metashape', spec: 'Enterprise photogrammetry suite' },
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

export default function SurveyMappingPage() {
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
          <img src="/assets/services/construction-service.jpeg" alt="" className="w-full h-full object-cover" />
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
            <span className="section-label text-[#00d4ff] tracking-[.35em] text-[10px] mb-3 block">Survey & Mapping</span>
            <h1 className="font-orbitron font-black leading-[1.05] text-white" style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
              Mapping the<br />
              <span className="text-glow" style={{ color: '#00d4ff' }}>Future</span>
            </h1>
            <p className="font-inter text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl mt-5 mb-8">
              High-precision aerial surveys and 3D mapping solutions for construction, mining,
              real estate, and infrastructure. Accuracy down to 1cm — coverage that spans
              thousands of acres in a single day.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/contact" className="neon-btn text-xs px-6 py-3">
                Request a Survey <ArrowRight size={12} />
              </Link>
              <div className="flex items-center gap-2 text-gray-400 text-xs font-inter border border-gray-800/50 px-4 py-2.5">
                <CheckCircle size={12} className="text-[#00d4ff]" />
                <span>50,000+ Acres Mapped</span>
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
              <h2 className="section-title">Survey Without Limits</h2>
              <div className="w-10 h-0.5 bg-[#00d4ff]" style={{ boxShadow: '0 0 8px rgba(0,212,255,.8)' }} />
              <p className="font-inter text-gray-300 text-sm leading-relaxed">
                Traditional surveying is limited by terrain, time, and cost. Our drone-based
                survey and mapping solutions overcome all three. Using <strong className="text-white">RTK GPS</strong>,
                <strong className="text-white"> LiDAR scanners</strong>, and
                <strong className="text-white"> photogrammetry</strong>, we deliver survey-grade
                accuracy at a fraction of the time and cost.
              </p>
              <p className="font-inter text-gray-400 text-sm leading-relaxed">
                From <strong className="text-[#00d4ff]">infrastructure projects</strong> spanning
                hundreds of kilometers to <strong className="text-[#00d4ff]">mining operations</strong>
                requiring weekly stockpile measurements — our team has mapped over
                <strong className="text-[#00d4ff]"> 50,000+ acres</strong> across India using
                enterprise-grade drone technology.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[['50K+', 'Acres Mapped'], ['1cm', 'Accuracy'], ['70%', 'Cost Saving'], ['200+', 'Projects']].map(([v, l]) => (
                  <div key={l} className="p-3 border border-gray-800/50 bg-[#111]/40 text-center">
                    <div className="font-orbitron text-[#00d4ff] text-lg font-black text-glow leading-none">
                      {v.includes('cm') ? '1cm' : <Counter target={parseInt(v.replace(/[^\d]/g, '')) || 50000} suffix={v.includes('K') ? 'K+' : v.includes('%') ? '%' : v.includes('cm') ? 'cm' : '+'} vis={vis} />}
                    </div>
                    <div className="font-inter text-gray-400 text-[9px] tracking-wider uppercase mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden h-[380px]" style={{ clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))' }}>
                <img src="/assets/services/construction-service.jpeg" alt="Drone mapping" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,.06) 0%, transparent 60%)' }} />
              </div>
              <div className="absolute -bottom-4 -left-4 p-4 border border-[#00d4ff]/20 z-10" style={{ background: 'rgba(17,17,17,.95)', clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}>
                <div className="font-orbitron text-[#00d4ff] text-sm font-black">1cm</div>
                <div className="font-inter text-gray-400 text-[9px] mt-0.5">Survey-Grade Accuracy</div>
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
            <h2 className="section-title">Survey & Mapping Services</h2>
            <div className="glow-line" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
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
              { value: 50000, suffix: '+', label: 'Acres Mapped' },
              { value: 70, suffix: '%', label: 'Cost Reduced' },
              { value: 200, suffix: '+', label: 'Projects Done' },
              { value: 1, suffix: 'cm', label: 'GSD Accuracy' },
            ].map(({ value, suffix, label }, i) => (
              <div key={label} className={`text-center ai-in ${statsVis ? 'ai-visible' : ''} ai-d${i + 1}`}>
                <div className="font-orbitron text-white text-3xl md:text-4xl font-black text-glow leading-none">
                  {suffix === 'cm' ? '1cm' : <Counter target={value} suffix={suffix} vis={statsVis} />}
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
            <h2 className="section-title">Why Drone Surveying?</h2>
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
            <span className="section-label block mb-4">Map with Precision</span>
            <h2 className="font-orbitron text-white font-black mb-4" style={{ fontSize: 'clamp(22px, 4vw, 42px)' }}>
              Ready to Map Your<br />
              <span className="text-glow" style={{ color: '#00d4ff' }}>Next Project?</span>
            </h2>
            <p className="font-inter text-gray-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
              Get in touch for a free consultation. Our survey team will design a custom
              mapping plan for your project.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="neon-btn">
                Request a Survey <ArrowRight size={13} />
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
