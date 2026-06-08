import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CheckCircle, Camera, Music, Flag, Lightbulb,
  Monitor, Star, Shield, Clock, TrendingUp
} from 'lucide-react';

interface Particle { x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number; max: number; }

const SUB_SERVICES = [
  {
    icon: Camera, title: 'Drone Videography & Photography',
    desc: 'Professional 4K/8K aerial cinematography for weddings, concerts, festivals, and corporate events. Our pilots capture cinematic angles that ground cameras simply cannot reach.',
    benefits: ['4K/8K HDR cinematic quality', 'Multiple drone setups for multi-angle coverage', 'Professional editing & color grading included', 'Same-day highlight reels available'],
  },
  {
    icon: Music, title: 'Drone Flower Showering',
    desc: 'Create magical moments with aerial flower showering at weddings and celebrations. Our drones can release thousands of flower petals in synchronized patterns.',
    benefits: ['1,000+ petals per flight', 'Custom patterns & colors', 'Perfect for outdoor ceremonies', 'Safe & completely controlled descent'],
  },
  {
    icon: Flag, title: 'Flag Towing',
    desc: 'Make a bold statement with our drone flag towing service for brand launches, sports events, and national celebrations. Fly your colors high in the sky.',
    benefits: ['Flags up to 8ft aerial display', 'Day & night operations', 'Weather-resistant setup', 'Multiple flag formats supported'],
  },
  {
    icon: Lightbulb, title: 'Drone Light Show',
    desc: 'Stunning synchronized drone light shows for grand openings, festivals, and celebrations. Replace traditional fireworks with eco-friendly illuminated drone formations.',
    benefits: ['100+ drone formations', 'Custom animations & logos', 'Environmentally friendly (no noise/no smoke)', 'Night sky choreography'],
  },
  {
    icon: Monitor, title: 'Drone LED Panel Advertisement',
    desc: 'Mobile aerial advertising with drone-mounted LED panels. Attract attention at concerts, stadiums, beaches, and high-traffic events with moving sky billboards.',
    benefits: ['High-visibility LED display', 'Custom content streaming', 'Catch attention from 1km+', 'Flexible positioning'],
  },
];

const PROCESS = [
  { step: '01', title: 'Creative Briefing', desc: 'We discuss your vision, venue, timing, and specific creative requirements to plan the perfect aerial coverage.' },
  { step: '02', title: 'Site Survey', desc: 'Our team visits the venue to assess lighting conditions, flight paths, safety zones, and optimal camera positions.' },
  { step: '03', title: 'Pre-Production', desc: 'We prepare equipment, plan shot lists, configure cameras, and coordinate with your event team.' },
  { step: '04', title: 'Live Execution', desc: 'On event day, our pilots capture every moment from stunning angles — all in real-time with on-site monitoring.' },
  { step: '05', title: 'Post-Production', desc: 'Professional editing, color grading, and delivery in your preferred format — ready to share within 48 hours.' },
];

const BENEFITS = [
  { icon: Star, title: 'Cinematic Quality', desc: 'Professional-grade 4K/8K footage with gimbal stabilization for smooth, cinematic results.' },
  { icon: Shield, title: 'Fully Insured', desc: 'All operations are fully insured with comprehensive liability coverage for your peace of mind.' },
  { icon: Clock, title: 'Quick Turnaround', desc: 'Same-day highlight reels and full delivery within 48 hours for most events.' },
  { icon: TrendingUp, title: 'Unique Perspectives', desc: 'Stand out with angles and aerial choreography that leave a lasting impression on your audience.' },
];

const EQUIPMENT = [
  { name: 'DJI Inspire 3', spec: '8K cinema camera, full-frame' },
  { name: 'DJI Mavic 3 Pro', spec: 'Triple-camera, Hasselblad' },
  { name: 'Light Show Drones', spec: '100+ synchronized units' },
  { name: 'LED Panel Display', spec: 'High-brightness aerial screen' },
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

export default function EventsPage() {
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
          <img src="/assets/services/videography.jpeg" alt="" className="w-full h-full object-cover" />
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
            <span className="section-label text-[#00d4ff] tracking-[.35em] text-[10px] mb-3 block">Event Services</span>
            <h1 className="font-orbitron font-black leading-[1.05] text-white" style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
              Cinematic Aerial<br />
              <span className="text-glow" style={{ color: '#00d4ff' }}>Storytelling</span>
            </h1>
            <p className="font-inter text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl mt-5 mb-8">
              Elevate your events with breathtaking aerial cinematography and drone entertainment.
              From cinematic wedding coverage to spectacular light shows — we make your moments
              unforgettable from every angle.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/contact" className="neon-btn text-xs px-6 py-3">
                Book an Event <ArrowRight size={12} />
              </Link>
              <div className="flex items-center gap-2 text-gray-400 text-xs font-inter border border-gray-800/50 px-4 py-2.5">
                <CheckCircle size={12} className="text-[#00d4ff]" />
                <span>200+ Events Covered</span>
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
              <h2 className="section-title">Moments That Soar</h2>
              <div className="w-10 h-0.5 bg-[#00d4ff]" style={{ boxShadow: '0 0 8px rgba(0,212,255,.8)' }} />
              <p className="font-inter text-gray-300 text-sm leading-relaxed">
                At De Drone World, we don't just film events — we elevate them. Our team of
                <strong className="text-white"> certified aerial cinematographers</strong> brings a
                cinematic eye and technical precision to every project, ensuring your special moments
                are captured in stunning detail from perspectives never seen before.
              </p>
              <p className="font-inter text-gray-400 text-sm leading-relaxed">
                From <strong className="text-[#00d4ff]">royal weddings</strong> in Udaipur to
                <strong className="text-[#00d4ff]"> international music festivals</strong> in Goa,
                our drones have captured some of India's most spectacular events. We offer end-to-end
                aerial event services including live streaming, same-day edits, and drone entertainment.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[['200+', 'Events Covered'], ['15+', 'Cities Served'], ['48hrs', 'Delivery Time'], ['100%', 'Client Sat.']].map(([v, l]) => (
                  <div key={l} className="p-3 border border-gray-800/50 bg-[#111]/40 text-center">
                    <div className="font-orbitron text-[#00d4ff] text-lg font-black text-glow leading-none">
                      <Counter target={parseInt(v.replace(/,/g, '').replace(/[^\d]/g, '')) || 200} suffix={v.includes('+') ? '+' : v.includes('%') ? '%' : v.replace(/[\d]/g, '')} vis={vis} />
                    </div>
                    <div className="font-inter text-gray-400 text-[9px] tracking-wider uppercase mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden h-[380px]" style={{ clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))' }}>
                <img src="/assets/services/videography.jpeg" alt="Event drone coverage" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,.06) 0%, transparent 60%)' }} />
              </div>
              <div className="absolute -bottom-4 -left-4 p-4 border border-[#00d4ff]/20 z-10" style={{ background: 'rgba(17,17,17,.95)', clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}>
                <div className="font-orbitron text-[#00d4ff] text-sm font-black">4K/8K HDR</div>
                <div className="font-inter text-gray-400 text-[9px] mt-0.5">Cinematic Quality</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sub-Services ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className={`text-center mb-14 ai-in ${vis ? 'ai-visible' : ''}`}>
            <span className="section-label">Our Offerings</span>
            <h2 className="section-title">Event Services</h2>
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
              { value: 200, suffix: '+', label: 'Events Covered' },
              { value: 15, suffix: '+', label: 'Cities Served' },
              { value: 48, suffix: 'hrs', label: 'Delivery Time' },
              { value: 100, suffix: '%', label: 'Client Sat.' },
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
            <h2 className="section-title">Why Choose Us</h2>
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
            <h2 className="section-title">Our Gear</h2>
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
            <span className="section-label block mb-4">Make It Memorable</span>
            <h2 className="font-orbitron text-white font-black mb-4" style={{ fontSize: 'clamp(22px, 4vw, 42px)' }}>
              Let's Create Something<br />
              <span className="text-glow" style={{ color: '#00d4ff' }}>Spectacular</span>
            </h2>
            <p className="font-inter text-gray-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
              Whether it's a wedding, concert, festival, or corporate event — our team is
              ready to capture it from the sky.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="neon-btn">
                Book Now <ArrowRight size={13} />
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
