import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CheckCircle, Sprout, Droplets, Eye, Target,
  BarChart3, Shield, Clock, TrendingUp
} from 'lucide-react';

interface Particle { x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number; max: number; }

const SUB_SERVICES = [
  {
    icon: Droplets, title: 'Fertilizer Spraying',
    desc: 'Precision drone-based spraying that reduces chemical usage by up to 40% while ensuring uniform coverage across your entire field. Our drones can carry up to 20L payload with intelligent flow control.',
    benefits: ['Reduces chemical waste by 40%', 'Uniform coverage across uneven terrain', 'Faster than manual spraying (10x speed)', 'GPS-guided precision application'],
  },
  {
    icon: Sprout, title: 'Seed Sowing',
    desc: 'Automated aerial seeding for quick and efficient planting across large areas. Our drones can sow seeds at precise depths and spacing, ensuring optimal germination rates.',
    benefits: ['Up to 2 acres per hour seeding speed', 'Precise depth and spacing control', 'Access to difficult terrain', 'Lower labour costs by 60%'],
  },
  {
    icon: Eye, title: 'Crop Monitoring',
    desc: 'Regular aerial surveillance with multispectral cameras to track crop health, detect diseases early, and optimize irrigation scheduling. Get NDVI maps delivered to your phone.',
    benefits: ['Early disease detection (7-10 days earlier)', 'NDVI & multispectral analysis', 'Irrigation optimization insights', 'Weekly health reports'],
  },
  {
    icon: Target, title: 'Precision Agriculture Using Drones',
    desc: 'Comprehensive precision farming solutions combining soil analysis, variable rate technology, and drone data analytics to maximize your yield while minimizing input costs.',
    benefits: ['Yield increase of 15-25%', 'Data-driven decision making', 'Variable rate application', 'Comprehensive field analytics'],
  },
];

const PROCESS = [
  { step: '01', title: 'Field Assessment', desc: 'Our agronomists visit your farm to understand crop type, field size, topography, and specific challenges.' },
  { step: '02', title: 'Drone Survey', desc: 'Multispectral and RGB drone survey to create a baseline map of your field with NDVI indices.' },
  { step: '03', title: 'Data Analysis', desc: 'Advanced processing to identify problem areas, pest hotspots, irrigation gaps, and nutrient deficiencies.' },
  { step: '04', title: 'Action Plan', desc: 'We provide a detailed action plan with spraying maps, seeding patterns, and monitoring schedules.' },
  { step: '05', title: 'Execution & Follow-up', desc: 'Our team executes the plan with precision drone operations and provides regular follow-up reports.' },
];

const BENEFITS = [
  { icon: TrendingUp, title: 'Higher Yields', desc: 'Increase crop yield by 15-25% through precision monitoring and targeted interventions.' },
  { icon: Shield, title: 'Reduce Chemical Use', desc: 'Cut pesticide and fertilizer usage by up to 40% with spot-specific application.' },
  { icon: Clock, title: 'Save Time', desc: 'Complete in hours what would take days with manual labour — covering 50+ acres per day.' },
  { icon: BarChart3, title: 'Data-Driven', desc: 'Get actionable insights with NDVI maps, health indices, and yield prediction analytics.' },
];

const EQUIPMENT = [
  { name: 'DJI Agras T40', spec: '40L tank, 30m spraying width' },
  { name: 'Multispectral Camera', spec: '5-band NDVI sensor, 12MP' },
  { name: 'RTK GPS Module', spec: 'Centimeter-level accuracy' },
  { name: 'Smart Spreader', spec: '50kg capacity, variable rate' },
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

export default function AgriculturePage() {
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
          <img src="/assets/services/fertilizer-spraying.jpeg" alt="" className="w-full h-full object-cover" />
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
            <span className="section-label text-[#00d4ff] tracking-[.35em] text-[10px] mb-3 block">Agriculture Solutions</span>
            <h1 className="font-orbitron font-black leading-[1.05] text-white" style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
              Precision Farming<br />
              <span className="text-glow" style={{ color: '#00d4ff' }}>From Above</span>
            </h1>
            <p className="font-inter text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl mt-5 mb-8">
              Transform your agricultural operations with drone-powered precision.
              From NDVI crop monitoring to targeted spraying, our drones deliver
              actionable insights that boost yields and reduce costs.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/contact" className="neon-btn text-xs px-6 py-3">
                Get a Free Consultation <ArrowRight size={12} />
              </Link>
              <div className="flex items-center gap-2 text-gray-400 text-xs font-inter border border-gray-800/50 px-4 py-2.5">
                <CheckCircle size={12} className="text-[#00d4ff]" />
                <span>500+ Farms Served</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Overview ── */}
      <section ref={visRef} className="py-20 relative overflow-hidden" style={{ background: '#080808' }}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(0,212,255,.02)' }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className={`grid lg:grid-cols-2 gap-14 items-center ai-in ${vis ? 'ai-visible' : ''}`}>
            <div className="space-y-5">
              <span className="section-label">Overview</span>
              <h2 className="section-title">Farming, Reimagined</h2>
              <div className="w-10 h-0.5 bg-[#00d4ff]" style={{ boxShadow: '0 0 8px rgba(0,212,255,.8)' }} />
              <p className="font-inter text-gray-300 text-sm leading-relaxed">
                Agriculture is the backbone of India, and we're on a mission to make it smarter.
                Our drone-based agricultural solutions combine <strong className="text-white">multispectral imaging</strong>,
                <strong className="text-white"> AI-driven analytics</strong>, and <strong className="text-white">precision application</strong>
                technology to help farmers maximize yields while minimizing input costs.
              </p>
              <p className="font-inter text-gray-400 text-sm leading-relaxed">
                From the lush paddy fields of Tamil Nadu to the vast cotton farms of Gujarat,
                our drones have covered over <strong className="text-[#00d4ff]">10,000+ acres</strong> —
                helping farmers detect diseases early, optimize irrigation, and apply inputs
                with surgical precision.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[['10,000+', 'Acres Covered'], ['40%', 'Chem. Reduction'], ['25%', 'Yield Increase'], ['50+', 'Villages Served']].map(([v, l]) => (
                  <div key={l} className="p-3 border border-gray-800/50 bg-[#111]/40 text-center">
                    <div className={`font-orbitron text-[#00d4ff] text-lg font-black text-glow leading-none ${vis ? '' : ''}`}>
                      <Counter target={parseInt(v.replace(/,/g, ''))} suffix={v.includes('+') ? '+' : v.includes('%') ? '%' : ''} vis={vis} />
                    </div>
                    <div className="font-inter text-gray-400 text-[9px] tracking-wider uppercase mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden h-[380px]" style={{ clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))' }}>
                <img src="/assets/services/fertilizer-spraying.jpeg" alt="Agricultural drone" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,.06) 0%, transparent 60%)' }} />
              </div>
              <div className="absolute -bottom-4 -left-4 p-4 border border-[#00d4ff]/20 z-10" style={{ background: 'rgba(17,17,17,.95)', clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}>
                <div className="font-orbitron text-[#00d4ff] text-sm font-black">DGCA Approved</div>
                <div className="font-inter text-gray-400 text-[9px] mt-0.5">Registered Aerial Operator</div>
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
            <h2 className="section-title">Agriculture Services</h2>
            <div className="glow-line" />
          </div>

          <div className="space-y-8">
            {SUB_SERVICES.map(({ icon: Icon, title, desc, benefits }, i) => (
              <div key={title} className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-start ai-in ${vis ? 'ai-visible' : ''} ai-d${Math.min(i + 1, 6)} ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="w-full lg:w-5/12 flex-shrink-0">
                  <div className="p-6 border border-[#00d4ff]/10 hover:border-[#00d4ff]/25 transition-all duration-400 h-full"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)' }}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 flex items-center justify-center border border-[#00d4ff]/30 bg-[#00d4ff]/8">
                        <Icon size={18} className="text-[#00d4ff]" />
                      </div>
                      <h3 className="font-orbitron text-white text-sm font-bold">{title}</h3>
                    </div>
                    <p className="font-inter text-gray-400 text-xs leading-relaxed mb-4">{desc}</p>
                    <div className="space-y-2">
                      {benefits.map((b) => (
                        <div key={b} className="flex items-center gap-2">
                          <CheckCircle size={10} className="text-[#00d4ff] flex-shrink-0" />
                          <span className="font-inter text-gray-300 text-[10px]">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-7/12">
                  <div className="relative h-56 lg:h-64 overflow-hidden group">
                    <img
                      src="/assets/services/fertilizer-spraying.jpeg"
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(10,10,10,.8) 100%)' }} />
                    <div className="absolute bottom-4 left-4">
                      <span className="font-orbitron text-[#00d4ff] text-[10px] font-bold">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: '#080808' }}>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(0,212,255,.03)' }} />
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
              { value: 10000, suffix: '+', label: 'Acres Covered' },
              { value: 500, suffix: '+', label: 'Farmers Served' },
              { value: 40, suffix: '%', label: 'Chemical Saved' },
              { value: 25, suffix: '%', label: 'Yield Boost' },
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
            <h2 className="section-title">Why Agri-Drones?</h2>
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
            <span className="section-label block mb-4">Grow Smarter</span>
            <h2 className="font-orbitron text-white font-black mb-4" style={{ fontSize: 'clamp(22px, 4vw, 42px)' }}>
              Ready to Transform Your<br />
              <span className="text-glow" style={{ color: '#00d4ff' }}>Farm Operations?</span>
            </h2>
            <p className="font-inter text-gray-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
              Get in touch for a free consultation. Our agronomy team will create a
              customized drone plan for your farm.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="neon-btn">
                Get Free Consultation <ArrowRight size={13} />
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
