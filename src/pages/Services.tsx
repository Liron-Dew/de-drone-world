import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Leaf, CheckCircle, ChevronDown, Search,
  Shield, Zap, Users, Globe, TrendingUp, Clock, Star,
  Sprout, Film, Lock, Mountain, Building2, Phone
} from 'lucide-react';

interface Particle { x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number; max: number; }

const SERVICES = [
  {
    icon: Leaf, title: 'Agriculture', path: '/services/agriculture',
    tagline: 'Precision Farming from Above',
    desc: 'Transform your farming operations with drone-powered precision agriculture. From NDVI crop monitoring to targeted fertilizer spraying, our drones give you actionable insights that boost yields and reduce costs.',
    img: '/assets/services/fertilizer-spraying.jpeg',
    subs: ['Fertilizer Spraying', 'Seed Sowing', 'Crop Monitoring', 'Precision Agriculture Using Drones'],
    color: '#00d4ff',
  },
  {
    icon: Film, title: 'Events', path: '/services/events',
    tagline: 'Cinematic Aerial Storytelling',
    desc: 'Elevate your events with breathtaking aerial cinematography. Our professional drone pilots capture every moment from unique perspectives — weddings, concerts, festivals, and corporate events.',
    img: '/assets/services/videography.jpeg',
    subs: ['Drone Videography', 'Flower Showering', 'Flag Towing', 'Drone Light Shows', 'LED Advertisement'],
    color: '#00d4ff',
  },
  {
    icon: Search, title: 'Inspection', path: '/services/inspection',
    tagline: 'See What Others Can\'t',
    desc: 'Industrial-grade drone inspection services that eliminate risk and reduce downtime. Thermal, visual, and multispectral inspections for critical infrastructure across India.',
    img: '/assets/services/drone-thermography-service.jpeg',
    subs: ['Windmill Inspection', 'Solar Panel Inspection', 'Power Line Inspection', 'Thermography', 'Construction Inspection', 'Pipeline Inspection'],
    color: '#00d4ff',
  },
  {
    icon: Mountain, title: 'Survey & Mapping', path: '/services/survey-mapping',
    tagline: 'Mapping the Future',
    desc: 'High-precision aerial surveys and 3D mapping solutions for construction, mining, real estate, and infrastructure projects. Accuracy down to 1cm resolution.',
    img: '/assets/services/construction-service.jpeg',
    subs: ['Land Surveying', 'Infrastructure Mapping', '3D Modeling', 'GIS Analysis', 'Mining Analysis'],
    color: '#00d4ff',
  },
];

const PROCESS_STEPS = [
  { step: '01', title: 'Consult & Assess', desc: 'We understand your requirements, assess the site, and recommend the best drone solution for your needs.' },
  { step: '02', title: 'Plan & Preparation', desc: 'Our team creates a detailed flight plan, secures necessary clearances, and prepares equipment for the mission.' },
  { step: '03', title: 'Execute & Capture', desc: 'Certified pilots execute the mission with precision, capturing high-quality data, imagery, or video.' },
  { step: '04', title: 'Process & Analyze', desc: 'Raw data is processed using advanced software — orthomosaics, 3D models, NDVI maps, and thermal analysis.' },
  { step: '05', title: 'Deliver & Support', desc: 'We deliver actionable reports, insights, and deliverables with ongoing support and consultation.' },
];

const STATS = [
  { value: 1000, suffix: '+', label: 'Missions Flown', icon: Zap },
  { value: 50, suffix: '+', label: 'Enterprise Clients', icon: Users },
  { value: 15, suffix: '+', label: 'Cities Covered', icon: Globe },
  { value: 99, suffix: '%', label: 'Client Satisfaction', icon: Star },
];

const INDUSTRIES = [
  { icon: Sprout, title: 'Agriculture', desc: 'Precision farming, crop monitoring, yield optimization' },
  { icon: Building2, title: 'Construction', desc: 'Site surveys, progress tracking, volume calculations' },
  { icon: Zap, title: 'Energy', desc: 'Solar, wind, and power line inspections' },
  { icon: Film, title: 'Entertainment', desc: 'Aerial cinematography, live events, productions' },
  { icon: Lock, title: 'Security', desc: 'Surveillance, perimeter monitoring, crowd management' },
  { icon: Mountain, title: 'Mining', desc: 'Stockpile analysis, terrain mapping, exploration' },
];

const BENEFITS = [
  { icon: Shield, title: 'DGCA Compliant', desc: 'All operations adhere to DGCA regulations with certified pilots.' },
  { icon: TrendingUp, title: 'Cost Effective', desc: 'Reduce costs by up to 60% compared to traditional methods.' },
  { icon: Clock, title: 'Rapid Deployment', desc: 'Quick mobilization and faster data collection than ground surveys.' },
  { icon: CheckCircle, title: 'Insurance Covered', desc: 'Fully insured operations for peace of mind.' },
];

// ── Hooks ─────────────────────────────────────────────────────────────────────
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
      if (ps.length < 60) ps.push({ x: Math.random()*c.width, y: Math.random()*c.height, vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3, size: Math.random()*1.2+.3, alpha: Math.random()*.4+.1, life: 0, max: Math.random()*230+120 });
      for (let i = ps.length-1; i >= 0; i--) {
        const p = ps[i]; p.x += p.vx; p.y += p.vy; p.life++;
        const fade = p.life < 20 ? p.life/20 : p.life > p.max-20 ? (p.max-p.life)/20 : 1;
        ctx.save(); ctx.globalAlpha = p.alpha*fade; ctx.fillStyle='#00d4ff'; ctx.shadowBlur=4; ctx.shadowColor='#00d4ff';
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill(); ctx.restore();
      }
      for (let i=0;i<ps.length;i++) for (let j=i+1;j<ps.length;j++) {
        const d = Math.hypot(ps[i].x-ps[j].x,ps[i].y-ps[j].y);
        if (d<85) { ctx.save(); ctx.globalAlpha=(1-d/85)*.09; ctx.strokeStyle='#00d4ff'; ctx.lineWidth=.5; ctx.beginPath(); ctx.moveTo(ps[i].x,ps[i].y); ctx.lineTo(ps[j].x,ps[j].y); ctx.stroke(); ctx.restore(); }
      }
      raf = requestAnimationFrame(frame);
    };
    frame();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={cv} className="absolute inset-0 pointer-events-none" />;
}

// ── Section Components ────────────────────────────────────────────────────────

function HeroSection() {
  const [py, setPy] = useState(0);
  useEffect(() => {
    const fn = () => setPy(window.scrollY * 0.3);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden" style={{ background: '#0a0a0a' }}>
      <Particles />
      {/* Parallax Background */}
      <div className="absolute inset-0 z-0" style={{ transform: `translateY(${py}px)`, willChange: 'transform' }}>
        <div className="absolute inset-0 z-10" style={{
          background: 'linear-gradient(135deg, rgba(10,10,10,.92) 0%, rgba(10,10,10,.6) 40%, rgba(10,10,10,.8) 100%)'
        }} />
        <img
          src="/assets/services_hero.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 grid-tex z-10" />
      {/* Decorative Circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="rotate-slow w-[700px] h-[700px] border border-[#00d4ff]/6 rounded-full absolute" />
        <div className="rotate-slow-rev w-[450px] h-[450px] border border-[#00d4ff]/10 rounded-full absolute" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-28">
        <div className="max-w-4xl">
          <span className="section-label text-[#00d4ff] tracking-[.35em] text-[10px] mb-4 block">Our Expertise</span>
          <h1 className="font-orbitron font-black leading-[1.05] text-white" style={{ fontSize: 'clamp(36px, 5.5vw, 72px)' }}>
            Professional Drone<br />
            <span className="text-glow" style={{ color: '#00d4ff' }}>Services</span>
          </h1>
          <p className="font-inter text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl mt-6 mb-10">
            End-to-end aerial solutions powered by certified pilots and cutting-edge drone technology.
            From precision agriculture to industrial inspections — we deliver actionable intelligence
            from the sky.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <Link to="/contact" className="neon-btn">
              Get a Free Consultation <ArrowRight size={13} />
            </Link>
            <div className="flex items-center gap-2 text-gray-400 text-xs font-inter">
              <CheckCircle size={12} className="text-[#00d4ff]" />
              <span>DGCA Certified Operations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 bounce-scroll">
        <span className="text-[#00d4ff]/40 text-[8px] tracking-widest uppercase font-inter">Scroll</span>
        <ChevronDown size={16} className="text-[#00d4ff]/40" />
      </div>
    </section>
  );
}

function ServicesGrid() {
  const { ref, vis } = useVisible();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-24 relative overflow-hidden" style={{ background: '#080808' }}>
      <div className="absolute inset-0 grid-tex opacity-20" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(0,212,255,.015)' }} />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 ai-in ${vis ? 'ai-visible' : ''}`}>
          <span className="section-label">What We Deliver</span>
          <h2 className="section-title">Our Service Portfolio</h2>
          <div className="glow-line" />
          <p className="font-inter text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
            From farmlands to wind farms, construction sites to concert halls — our drones deliver
            precision, safety, and cinematic excellence across every sector.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">              {SERVICES.map(({ icon: Icon, title, path, tagline, desc, img, subs }, i) => {
            const isExpanded = expanded === i;
            return (
              <div
                key={path}
                className={`group relative border transition-all duration-500 cursor-pointer ${
                  isExpanded
                    ? 'border-[#00d4ff]/40 bg-[#111]/80'
                    : 'border-gray-800/50 bg-[#111]/50 hover:border-[#00d4ff]/20 hover:-translate-y-1'
                }`}
                style={{ clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)' }}
                onClick={() => setExpanded(isExpanded ? null : i)}
              >
                {/* Image background */}
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <img
                    src={img}
                    alt={title}
                    className={`w-full h-full object-cover transition-all duration-700 ${isExpanded ? 'scale-105 brightness-50' : 'group-hover:scale-105'}`}
                  />
                  <div className="absolute inset-0" style={{
                    background: isExpanded
                      ? 'linear-gradient(180deg, rgba(10,10,10,.3) 0%, rgba(10,10,10,.9) 100%)'
                      : 'linear-gradient(180deg, rgba(10,10,10,.1) 0%, rgba(10,10,10,.7) 100%)'
                  }} />
                  
                  {/* Icon + Title overlay */}
                  <div className="absolute bottom-4 left-5 right-5 flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center border border-[#00d4ff]/40 bg-black/50 backdrop-blur-sm flex-shrink-0">
                      <Icon size={20} className="text-[#00d4ff]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-orbitron text-white text-sm font-bold">{title}</h3>
                      <p className="font-inter text-[#00d4ff] text-[10px] tracking-wider uppercase mt-0.5">{tagline}</p>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-[#00d4ff] transition-transform duration-400 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>

                {/* Content area */}
                <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-6 pt-4 border-t border-[#00d4ff]/10">
                    <p className="font-inter text-gray-300 text-xs leading-relaxed mb-5">{desc}</p>
                    
                    <p className="font-orbitron text-[#00d4ff] text-[9px] tracking-[.2em] uppercase mb-3">
                      Services Include
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {subs.map((s) => (
                        <div key={s} className="flex items-center gap-2 px-3 py-2 border border-gray-800 bg-[#0a0a0a]/80">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" style={{ boxShadow: '0 0 6px rgba(0,212,255,.6)' }} />
                          <span className="font-inter text-gray-300 text-[10px]">{s}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      to={path}
                      className="inline-flex items-center gap-2 text-[#00d4ff] font-orbitron text-[9px] tracking-[.2em] uppercase hover:gap-3 transition-all duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Explore {title} Services <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>

                {/* Bottom CTA when collapsed */}
                {!isExpanded && (
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex gap-3">
                      {subs.slice(0, 3).map((s) => (
                        <span key={s} className="font-inter text-gray-500 text-[9px] tracking-wide">{s}</span>
                      ))}
                      {subs.length > 3 && (
                        <span className="font-inter text-[#00d4ff] text-[9px]">+{subs.length - 3}</span>
                      )}
                    </div>
                    <span className="font-inter text-[#00d4ff] text-[9px] tracking-wider uppercase flex items-center gap-1">
                      Details <ArrowRight size={10} />
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const { ref, vis } = useVisible();

  return (
    <section ref={ref} className="py-24 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(0,212,255,.03)' }} />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 ai-in ${vis ? 'ai-visible' : ''}`}>
          <span className="section-label">How We Work</span>
          <h2 className="section-title">Our Service Process</h2>
          <div className="glow-line" />
          <p className="font-inter text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
            A proven methodology that ensures quality, safety, and timely delivery on every mission.
          </p>
        </div>

        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-[#00d4ff] via-[#00d4ff]/30 to-transparent hidden md:block" />

          <div className="space-y-8 md:space-y-0">
            {PROCESS_STEPS.map(({ step, title, desc }, i) => (
              <div
                key={step}
                className={`flex flex-col md:flex-row gap-6 md:gap-10 items-start ai-in ${vis ? 'ai-visible' : ''} ai-d${Math.min(i + 1, 6)} ${i > 0 ? 'md:mt-8' : ''}`}
              >
                {/* Step number */}
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-[46px] h-[46px] flex items-center justify-center border-2 border-[#00d4ff] bg-[#0a0a0a] shadow-lg"
                    style={{ boxShadow: '0 0 20px rgba(0,212,255,.2)' }}>
                    <span className="font-orbitron text-[#00d4ff] text-xs font-bold">{step}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 md:ml-0 bg-[#111]/50 border border-gray-800/50 p-6 hover:border-[#00d4ff]/20 transition-all duration-400"
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
  );
}

function StatsSection() {
  const { ref, vis } = useVisible();

  return (
    <section ref={ref} className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d1f2d, #0a2030, #0d1f2d)' }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,.04) 0%, rgba(0,212,255,.08) 50%, rgba(0,212,255,.04) 100%)' }} />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ value, suffix, label, icon: Icon }, i) => (
            <div key={label} className={`text-center ai-in ${vis ? 'ai-visible' : ''} ai-d${i + 1}`}>
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 border border-[#00d4ff]/30 bg-[#00d4ff]/8">
                <Icon size={18} className="text-[#00d4ff]" />
              </div>
              <div className="font-orbitron text-white text-3xl md:text-4xl font-black text-glow leading-none">
                <Counter target={value} suffix={suffix} vis={vis} />
              </div>
              <div className="font-inter text-gray-400 text-[10px] tracking-wider uppercase mt-2">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IndustriesSection() {
  const { ref, vis } = useVisible();

  return (
    <section ref={ref} className="py-24 relative overflow-hidden" style={{ background: '#080808' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 ai-in ${vis ? 'ai-visible' : ''}`}>
          <span className="section-label">Industries</span>
          <h2 className="section-title">Industries We Transform</h2>
          <div className="glow-line" />
          <p className="font-inter text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
            Our drone solutions are tailored to meet the unique challenges of diverse industries.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INDUSTRIES.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className={`group p-6 border border-gray-800/50 bg-[#111]/40 hover:border-[#00d4ff]/25 hover:-translate-y-1 transition-all duration-400 ai-in ${vis ? 'ai-visible' : ''} ai-d${Math.min(i + 1, 6)}`}
              style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)' }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 flex items-center justify-center border border-[#00d4ff]/30 bg-[#00d4ff]/8 group-hover:bg-[#00d4ff]/15 transition-colors duration-300">
                  <Icon size={16} className="text-[#00d4ff]" />
                </div>
                <h3 className="font-orbitron text-white text-xs font-semibold">{title}</h3>
              </div>
              <p className="font-inter text-gray-400 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  const { ref, vis } = useVisible();

  return (
    <section ref={ref} className="py-20 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(0,212,255,.02)' }} />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-14 ai-in ${vis ? 'ai-visible' : ''}`}>
          <span className="section-label">Why Us</span>
          <h2 className="section-title">Why Choose De Drone World</h2>
          <div className="glow-line" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className={`text-center p-6 border border-gray-800/50 bg-[#111]/40 hover:border-[#00d4ff]/20 transition-all duration-400 ai-in ${vis ? 'ai-visible' : ''} ai-d${i + 1}`}
            >
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4 border border-[#00d4ff]/30 bg-[#00d4ff]/8">
                <Icon size={18} className="text-[#00d4ff]" />
              </div>
              <h3 className="font-orbitron text-white text-xs font-semibold mb-2">{title}</h3>
              <p className="font-inter text-gray-400 text-[10px] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { ref, vis } = useVisible();

  return (
    <section ref={ref} className="py-20 relative overflow-hidden" style={{ background: '#060606' }}>
      <div className="absolute inset-0 grid-tex opacity-20" />
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className={`p-10 md:p-14 border border-[#00d4ff]/15 bg-[#00d4ff]/3 ai-in ${vis ? 'ai-visible' : ''}`}
          style={{ clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))' }}>
          <span className="section-label block mb-4">Ready to Take Off?</span>
          <h2 className="font-orbitron text-white font-black mb-4" style={{ fontSize: 'clamp(22px, 4vw, 42px)' }}>
            Let's Discuss Your<br />
            <span className="text-glow" style={{ color: '#00d4ff' }}>Next Project</span>
          </h2>
          <p className="font-inter text-gray-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Whether you need precision agriculture, cinematic coverage, industrial inspection, or
            detailed surveys — our team is ready to deliver.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="neon-btn">
              Get a Free Quote <ArrowRight size={13} />
            </Link>
            <a href="tel:+917448800997" className="neon-btn-ghost flex items-center gap-2">
              <Phone size={13} /> +91 74488 00997
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  return (
    <>
      <HeroSection />
      <ServicesGrid />
      <ProcessSection />
      <StatsSection />
      <IndustriesSection />
      <BenefitsSection />
      <CTASection />
    </>
  );
}
