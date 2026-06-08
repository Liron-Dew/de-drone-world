import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageLightbox from '../components/ImageLightbox';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import {
  GraduationCap, Camera, Map, Leaf, Cpu, Eye, Shield, Award,
  Star, ChevronDown, ChevronLeft, ChevronRight,
  Phone, MapPin, ArrowRight, CheckCircle, Users,
  Building2, Handshake, Home, Play,
  Sprout, Search, Lock, Film
} from 'lucide-react';

interface Particle { x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number; max: number; }

// ── Data ──────────────────────────────────────────────────────────────────────
const HERO_BG = '/assets/services_hero.png';

const GALLERY_IMAGES = [
  { src: '/assets/gallery/01.jpeg', label: 'Pilot Training' },
  { src: '/assets/gallery/02.jpeg', label: 'Aerial Cinematography' },
  { src: '/assets/gallery/03.jpeg', label: 'Real Estate Survey' },
  { src: '/assets/gallery/04.jpeg', label: 'Landscape Mapping' },
  { src: '/assets/gallery/05.jpeg', label: 'Urban Operations' },
  { src: '/assets/gallery/06.jpeg', label: 'Forest Survey' },
];

const SERVICES_WITH_IMG = [
  { icon: GraduationCap, title: 'Drone Pilot Training',     desc: 'DGCA-approved Remote Pilot Training with guaranteed placement assistance.',            img: '/assets/services/diplomo-course.jpeg' },
  { icon: Leaf,           title: 'Agriculture Solutions',   desc: 'Drone-based precision farming, crop monitoring, NDVI analysis & spraying.',             img: '/assets/services/fertilizer-spraying.jpeg' },
  { icon: Camera,         title: 'Aerial Cinematography',  desc: '4K/8K cinematic footage for films, weddings, events & commercial productions.',         img: '/assets/services/videography.jpeg' },
  { icon: Map,            title: '3D Mapping & Survey',    desc: 'High-precision photogrammetry, 3D modeling & topographic surveys.',                     img: '/assets/services/construction-service.jpeg' },
  { icon: Cpu,            title: 'Industrial Inspection',  desc: 'Thermal & visual inspection of solar panels, wind turbines, and power lines.',           img: '/assets/services/drone-thermography-service.jpeg' },
  { icon: Eye,            title: 'Surveillance & Security','desc': 'Advanced aerial surveillance and perimeter security for enterprises and events.',      img: '/assets/services/workshop-build-your-own-drone.jpeg' },
];

const TRAINING_CENTERS = [
  { name: 'Hindustan College of Engineering', location: 'Coimbatore, Tamil Nadu', img: '/assets/training/small-training.jpeg' },
  { name: 'Vaigai Engineering College',       location: 'Madurai, Tamil Nadu',    img: '/assets/training/small-and-medium-training.jpeg' },
];

const IMPACT_USES = [
  { icon: Sprout,   title: 'Agriculture',  desc: 'Crop monitoring, pesticide spraying, and yield prediction for modern farming.', img: '/assets/services/fertilizer-spraying.jpeg' },
  { icon: Film,     title: 'Events',       desc: 'Professional aerial coverage for weddings, concerts, and live events.',           img: '/assets/gallery/01.jpeg' },
  { icon: Search,   title: 'Inspection',   desc: 'Industrial asset inspection — solar, wind turbines, power infrastructure.',      img: '/assets/services/drone-thermography-service.jpeg' },
  { icon: Map,      title: 'Survey & Mapping', desc: 'High-precision topographic surveys and 3D terrain modeling.',               img: '/assets/services/construction-service.jpeg' },
  { icon: Lock,     title: 'Security',     desc: 'Perimeter surveillance and crowd management for secured operations.',            img: '/assets/gallery/03.jpeg' },
];

const VISION_MISSION = {
  vision: {
    title: 'Our Vision',
    text: 'To advance the drone field through trusted training, practical innovation, and reliable aerial solutions that help industries work smarter, safer, and faster.',
    img: '/assets/services/construction-service.jpeg',
  },
  mission: {
    title: 'Our Mission',
    text: 'To be the most collaborative and trusted team in drone industry and providing leading services and innovations to meet the needs of every customer.',
    img: '/assets/gallery/05.jpeg',
  },
};

const STATS = [
  { value: 370, suffix: '+', label: 'Trained Pilots' },
  { value: 50,  suffix: '+', label: 'Expert Mentors' },
  { value: 3,   suffix: ' Days', label: 'Min. Course' },
  { value: 6,   suffix: ' Years', label: 'Experience' },
  { value: 7,   suffix: ' Lakh', label: 'Avg. Package' },
];

const TESTIMONIALS = [
  { name: 'Rahul Sharma',    role: 'Certified Drone Pilot, Batch 2024',  text: 'The training at De Drone World was exceptional. The instructors are truly world-class...', rating: 5 },
  { name: 'Priya Venkatesh', role: 'Agricultural Drone Specialist',      text: 'Being from a non-aviation background, I was nervous. But the team made everything easy to understand...', rating: 5 },
  { name: 'Arun Kumar',      role: 'Enterprise Drone Operator',          text: 'The DGCA certification process was seamless with De Drone World...', rating: 5 },
];

const PARTNERS = [
  { name: 'Startup India',               img: '/assets/clients/startup-india.jpg' },
  { name: 'Ministry of MSME',            img: '/assets/clients/ministry-of-msme.jpg' },
  { name: 'Naan Mudhalvan',              img: '/assets/clients/naan-mudhalvan.jpg' },
  { name: 'NABARD',                      img: '/assets/clients/nabard.jpg' },
  { name: 'Hindustan College of Engg',   img: '/assets/clients/hindusthan-college.jpg' },
];

const CERTIFICATES = [
  { src: '/assets/certs/cert1.jpg', label: 'Certificate of Excellence' },
  { src: '/assets/certs/cert2.jpg', label: 'DGCA Approval Certificate' },
  { src: '/assets/certs/cert3.jpg', label: 'ISO Certification' },
  { src: '/assets/certs/cert4.jpeg', label: 'Training Accreditation' },
];

const INFRASTRUCTURE_FEATURES = [
  'State-of-the-art simulator labs with advanced flight training equipment',
  'Dedicated flying grounds for hands-on practical training',
  'Smart classrooms with interactive learning technology',
  'AC accommodation with healthy food options for outstation students',
  'Expert instructors with armed forces and aviation background',
  'Modern workshop for drone assembly, repair & maintenance',
];

const WHY_US = [
  { icon: MapPin,        title: 'Multiple Training Centers', desc: 'Coimbatore & Madurai premier institutions with state-of-the-art facilities.' },
  { icon: Handshake,     title: 'Guaranteed Placement',      desc: 'Placement assistance for all course participants with industry partners.' },
  { icon: GraduationCap, title: 'DGCA Approved Instructors', desc: 'Learn from experienced DGCA-approved instructors with real field expertise.' },
  { icon: Award,         title: 'IGRUA Collaboration',       desc: "Partnership with India's premier flying training institute & Drone Destination." },
  { icon: Building2,     title: 'World-class Infrastructure',desc: 'Best-in-class simulators, smart classrooms, and dedicated flying ground area.' },
  { icon: Home,          title: 'Accommodation Available',   desc: 'AC rooms with healthy food options for outstation students within campus.' },
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
        if (p.life >= p.max) ps.splice(i,1);
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
  return <canvas ref={cv} id="particles" />;
}

// ── Section Components ────────────────────────────────────────────────────────

function Hero() {
  const navigate = useNavigate();
  const [py, setPy] = useState(0);
  useEffect(() => { const fn = () => setPy(window.scrollY*.3); window.addEventListener('scroll',fn,{passive:true}); return () => window.removeEventListener('scroll',fn); }, []);
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{background:'#0a0a0a'}}>
      <Particles/>
      <div className="absolute inset-0 z-0" style={{transform:`translateY(${py}px)`,willChange:'transform'}}>
        <div className="absolute inset-0 z-10" style={{background:'linear-gradient(135deg,rgba(10,10,10,.85) 0%,rgba(10,10,10,.6) 50%,rgba(10,10,10,.75) 100%)'}}/>
        <img src={HERO_BG} alt="" className="w-full h-full object-cover"/>
      </div>
      <div className="absolute inset-0 grid-tex z-10"/>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="rotate-slow w-[650px] h-[650px] border border-[#00d4ff]/5 rounded-full absolute"/>
        <div className="rotate-slow-rev w-[420px] h-[420px] border border-[#00d4ff]/8 rounded-full absolute"/>
      </div>
      <div className="relative z-20 max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center pt-20">
        <div>
          <h1 className="font-orbitron font-black leading-[1.1] mb-5 text-white" style={{fontSize:'clamp(32px,5vw,64px)'}}>
            Elevate Your Future<br/>With Professional<br/>
            <span className="text-glow" style={{color:'#00d4ff'}}>Drone Training</span>
          </h1>
          <p className="font-inter text-gray-300 text-sm leading-relaxed mb-8 max-w-lg">
            India's most trusted drone pilot training academy. DGCA-approved certification programs from <span className="text-[#00d4ff] font-semibold">aviation experts of the Indian Armed Forces</span>. Highest standards. Guaranteed placement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button className="neon-btn" onClick={() => navigate('/contact')}>Get Our Brochure <ArrowRight size={13}/></button>
            <button className="neon-btn-ghost flex items-center gap-2" onClick={() => navigate('/services')}><Play size={13}/>Explore Services</button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[['50+','Expert Pilots'],['1000+','Trained'],['5+','Years'],['100%','DGCA']].map(([v,l]) => (
              <div key={l} className="text-center p-3 border border-gray-800/60 bg-[#111]/60">
                <div className="font-orbitron text-[#00d4ff] text-lg font-black text-glow leading-none">{v}</div>
                <div className="font-inter text-gray-400 text-[9px] tracking-wider uppercase mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-center relative">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 rounded-full blur-3xl" style={{background:'rgba(0,212,255,.08)'}}/>
            <video
              src="/assets/dron_shot.mp4"
              autoPlay muted loop playsInline
              className="drone-float relative z-10 w-full h-full object-cover rounded-none shadow-2xl"
              style={{clipPath:'polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px))',filter:'brightness(1.1) saturate(0.9)'}}
            />
            <div className="absolute -bottom-4 -left-4 p-4 z-20 border border-[#00d4ff]/20" style={{background:'rgba(17,17,17,.95)',clipPath:'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)'}}>
              <div className="font-orbitron text-[#00d4ff] text-xl font-black leading-none">370+</div>
              <div className="font-inter text-gray-300 text-[10px] mt-0.5">Pilots Trained</div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 bounce-scroll">
        <span className="text-[#00d4ff]/50 text-[9px] tracking-widest uppercase font-inter">Scroll</span>
        <ChevronDown size={18} className="text-[#00d4ff]/50"/>
      </div>
    </section>
  );
}

function DGCAStrip() {
  return (
    <div className="py-5 relative overflow-hidden" style={{background:'linear-gradient(135deg,#0d1f2d,#0a2030,#0d1f2d)'}}>
      <div className="absolute inset-0" style={{background:'linear-gradient(90deg,rgba(0,212,255,.06) 0%,rgba(0,212,255,.12) 50%,rgba(0,212,255,.06) 100%)'}}/>
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center border border-[#00d4ff]/40 bg-[#00d4ff]/10"><Shield size={18} className="text-[#00d4ff]"/></div>
          <div>
            <div className="font-orbitron text-white text-sm font-bold tracking-wider">DGCA APPROVED RPTO</div>
            <div className="font-inter text-[#00d4ff]/70 text-[10px] tracking-widest uppercase">Ministry of Civil Aviation</div>
          </div>
        </div>
        <div className="hidden sm:block w-px h-8 bg-[#00d4ff]/15"/>
        {['ISO 9001:2024 Certified','IGRUA Collaboration','Armed Forces Veterans','Pan-India Operations'].map((b,i) => (
          <div key={i} className="flex items-center gap-2"><CheckCircle size={12} className="text-[#00d4ff]"/><span className="font-inter text-gray-300 text-xs tracking-wide">{b}</span></div>
        ))}
      </div>
    </div>
  );
}

function StoriesSection() {
  const {ref, vis} = useVisible();
  const [lbSrc, setLbSrc] = useState<string | null>(null);
  return (
    <>
      <section ref={ref} className="py-20" style={{background:'#080808'}}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className={`text-center mb-12 ai-in ${vis?'ai-visible':''}`}>
            <span className="section-label">Our Work</span>
            <h2 className="section-title">Stories in Motion...</h2>
            <div className="glow-line"/>
          </div>
          <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ai-in ${vis?'ai-visible':''} ai-d2`}>
            {GALLERY_IMAGES.map(({src,label},i) => (
              <div key={i} className="portfolio-wrap group" onClick={() => setLbSrc(src)}>
                <img src={src} alt={label} loading="lazy" className="w-full h-48 object-cover"/>
                <div className="portfolio-overlay">
                  <div>
                    <p className="font-orbitron text-white text-xs font-semibold">{label}</p>
                    <p className="font-inter text-[#00d4ff] text-[10px] tracking-wider uppercase mt-0.5">De Drone World</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {lbSrc && <ImageLightbox src={lbSrc} alt="Gallery image" onClose={() => setLbSrc(null)} />}
    </>
  );
}

function AboutSection() {
  const {ref, vis} = useVisible();
  return (
    <section id="about" ref={ref} className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{background:'rgba(0,212,255,.03)'}}/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
        <div className={`ai-in ${vis?'ai-visible':''} ai-d1`}>
          <div className="relative">
            <div className="overflow-hidden" style={{clipPath:'polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px))'}}>
              <video src="/assets/drone_logo_video.mp4" autoPlay muted loop playsInline className="w-full h-[420px] object-cover"/>
              <div className="absolute inset-0" style={{background:'linear-gradient(135deg,rgba(10,10,10,.4) 0%,transparent 60%,rgba(0,212,255,.05) 100%)'}}/>
            </div>
            <div className="absolute -bottom-5 -right-4 p-4 border border-[#00d4ff]/20 z-10" style={{background:'#1a1a1a',clipPath:'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)'}}>
              <div className="font-orbitron text-[#00d4ff] text-2xl font-black">2022</div>
              <div className="font-inter text-gray-400 text-[9px] tracking-wider uppercase mt-0.5">Founded</div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <div className="font-orbitron text-5xl font-black text-[#00d4ff] text-center leading-tight">DE<br/>DRONE<br/>WORLD</div>
            </div>
            <div className="absolute -top-3 -left-3 w-9 h-9 border-l-2 border-t-2 border-[#00d4ff]"/>
            <div className="absolute -bottom-3 -right-10 w-9 h-9 border-r-2 border-b-2 border-[#00d4ff]"/>
          </div>
        </div>
        <div className="space-y-5">
          <div className={`ai-in ${vis?'ai-visible':''} ai-d2`}>
            <span className="section-label">About Us</span>
            <h2 className="section-title">WHO WE ARE...</h2>
            <div className="w-10 h-0.5 bg-[#00d4ff] mt-4" style={{boxShadow:'0 0 8px rgba(0,212,255,.8)'}}/>
          </div>
          <div className={`p-5 border-l-2 border-[#00d4ff] bg-[#00d4ff]/4 ai-in ${vis?'ai-visible':''} ai-d3`}>
            <p className="font-inter text-gray-300 text-sm italic leading-relaxed">"You must be shapeless, formless, like water. Water can drip and it can crash."</p>
            <cite className="font-inter text-gray-500 text-xs mt-2 block not-italic">— Bruce Lee</cite>
          </div>
          <div className={`space-y-3 ai-in ${vis?'ai-visible':''} ai-d3`}>
            <p className="font-inter text-gray-300 text-sm leading-relaxed"><strong className="text-white">De Drone World</strong> is an entrepreneurial venture with a vision to become a global company — built by aviation experts from the <strong className="text-[#00d4ff]">Indian Armed Forces</strong> and enthusiastic young technocrats with a strong passion for drones.</p>
            <p className="font-inter text-gray-400 text-sm leading-relaxed">We aim to usher in a new era in drone development and adoption, bringing revolutionary changes in human lives. Registered as <strong className="text-gray-300">De Drone World Solutions Pvt Ltd</strong> — a DGCA-authorized RPTO based in Coimbatore, Tamil Nadu.</p>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ai-in ${vis?'ai-visible':''} ai-d4`}>
            {[['Armed Forces Veterans',Shield],['DGCA Authorized RPTO',Award],['Pan-India Operations',MapPin]].map(([t,I]) => {
              const Icon = I as React.ElementType;
              return (
                <div key={t as string} className="flex items-center gap-2 p-3 border border-[#00d4ff]/12 bg-[#00d4ff]/4">
                  <Icon size={12} className="text-[#00d4ff] flex-shrink-0"/>
                  <span className="font-inter text-gray-300 text-xs">{t as string}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const {ref, vis} = useVisible();
  return (
    <section id="services" ref={ref} className="py-24 relative overflow-hidden" style={{background:'#080808'}}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none" style={{background:'rgba(0,212,255,.015)'}}/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`text-center mb-16 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Drone Solutions</span>
          <h2 className="section-title">Soar Beyond Limits...</h2>
          <div className="glow-line"/>
          <p className="font-inter text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">End-to-end drone solutions tailored for enterprises, government, and individuals.</p>
        </div>
        <div className="space-y-16 lg:space-y-20">
          {SERVICES_WITH_IMG.map(({icon:Icon,title,desc,img},i) => (
            <div key={title} className={`flex flex-col lg:flex-row gap-8 lg:gap-14 items-center ai-in ${vis?'ai-visible':''} ai-d${Math.min(i+1,6)} ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Image side */}
              <div className="w-full lg:w-1/2 relative h-[280px] lg:h-[380px] overflow-hidden group flex-shrink-0">
                <div className="absolute inset-0" style={{
                  clipPath: i % 2 === 0
                    ? 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)'
                    : 'polygon(0 0, 100% 0, 100% 100%, 24px 100%, 0 calc(100% - 24px))'
                }}>
                  <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy"/>
                  <div className="absolute inset-0" style={{background:'linear-gradient(135deg,rgba(0,212,255,.06) 0%,transparent 50%)'}}/>
                </div>
                {/* Corner accent lines */}
                <div className="absolute top-0 left-0 w-10 h-10 pointer-events-none">
                  <div className="absolute top-0 left-0 w-0.5 h-10 bg-[#00d4ff]" style={{boxShadow:'0 0 8px rgba(0,212,255,.6)'}}/>
                  <div className="absolute top-0 left-0 w-10 h-0.5 bg-[#00d4ff]" style={{boxShadow:'0 0 8px rgba(0,212,255,.6)'}}/>
                </div>
                <div className="absolute bottom-0 right-0 w-10 h-10 pointer-events-none">
                  <div className="absolute bottom-0 right-0 w-0.5 h-10 bg-[#00d4ff]" style={{boxShadow:'0 0 8px rgba(0,212,255,.6)'}}/>
                  <div className="absolute bottom-0 right-0 w-10 h-0.5 bg-[#00d4ff]" style={{boxShadow:'0 0 8px rgba(0,212,255,.6)'}}/>
                </div>
              </div>
              {/* Content side */}
              <div className="w-full lg:w-1/2 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center border border-[#00d4ff]/40 bg-[#00d4ff]/10 flex-shrink-0">
                    <Icon size={18} className="text-[#00d4ff]"/>
                  </div>
                  <h3 className="font-orbitron text-white text-xl lg:text-2xl font-bold leading-tight">{title}</h3>
                </div>
                <p className="font-inter text-gray-400 text-sm leading-relaxed">{desc}</p>
                <button className="inline-flex items-center gap-2 text-[#00d4ff] font-inter text-xs tracking-widest uppercase group/btn hover:gap-4 transition-all duration-300">
                  Learn More
                  <ArrowRight size={12} className="transition-transform duration-300 group-hover/btn:translate-x-1"/>
                </button>
                {/* Divider */}
                {i < SERVICES_WITH_IMG.length - 1 && (
                  <div className="w-16 h-0.5 bg-[#00d4ff]/20 mt-4"/>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrainingCenters() {
  const {ref, vis} = useVisible();
  return (
    <section id="training" ref={ref} className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 grid-tex opacity-30"/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Our Centers</span>
          <h2 className="section-title">Train with Confidence...</h2>
          <div className="glow-line"/>
          <p className="font-inter text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">State-of-the-art training facilities at premier engineering institutions across Tamil Nadu.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {TRAINING_CENTERS.map(({name,location,img},i) => (
            <div key={name} className={`group border border-gray-800/50 bg-[#111]/60 overflow-hidden hover:border-[#00d4ff]/30 transition-all duration-500 ai-in ${vis?'ai-visible':''} ai-d${i+1}`}
              style={{clipPath:'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,0 100%)'}}>
              <div className="relative h-52 overflow-hidden">
                <img src={img} alt={name} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105" loading="lazy"/>
                <div className="absolute inset-0" style={{background:'linear-gradient(180deg,transparent 40%,rgba(10,10,10,.9) 100%)'}}/>
                <div className="absolute top-3 left-3 px-3 py-1 bg-[#00d4ff]/15 border border-[#00d4ff]/30">
                  <span className="font-orbitron text-[#00d4ff] text-[9px] tracking-widest uppercase">Training Center</span>
                </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-orbitron text-white text-sm font-semibold">{name}</h3>
                  <div className="flex items-center gap-1 mt-1.5"><MapPin size={10} className="text-[#00d4ff]"/><span className="font-inter text-gray-400 text-xs">{location}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExcellenceSection() {
  const {ref, vis} = useVisible();
  return (
    <section id="why-us" ref={ref} className="py-24 relative overflow-hidden" style={{background:'#080808'}}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Why Choose Us</span>
          <h2 className="section-title">Built for Excellence...</h2>
          <div className="glow-line"/>
        </div>
        <div className="grid lg:grid-cols-2 gap-10 items-start mb-14">
          <div className="grid sm:grid-cols-2 gap-4">
            {WHY_US.map(({icon:Icon,title,desc},i) => (
              <div key={title} className={`flex gap-3 p-4 border border-gray-800/50 bg-[#111]/30 hover:border-[#00d4ff]/20 transition-all duration-400 ai-in ${vis?'ai-visible':''} ai-d${Math.min(i+1,6)}`}>
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-[#00d4ff]/30 bg-[#00d4ff]/5"><Icon size={14} className="text-[#00d4ff]"/></div>
                <div>
                  <h3 className="font-orbitron text-white text-[10px] font-semibold mb-1">{title}</h3>
                  <p className="font-inter text-gray-400 text-[10px] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={`ai-in ${vis?'ai-visible':''} ai-d3`}>
            <div className="p-6 border border-[#00d4ff]/20 bg-[#00d4ff]/4 mb-5" style={{clipPath:'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,0 100%)'}}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 flex items-center justify-center border border-[#00d4ff]/40 bg-[#00d4ff]/10"><Shield size={26} className="text-[#00d4ff]"/></div>
                <div>
                  <div className="font-orbitron text-white text-sm font-bold leading-snug">REMOTE PILOT TRAINING</div>
                  <div className="font-orbitron text-[#00d4ff] text-sm font-bold">ORGANISATION</div>
                  <div className="font-inter text-gray-400 text-[10px] mt-0.5">DGCA Approved · Ministry of Civil Aviation</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['DGCA Licensed','IGRUA Partner','ISO 9001:2024','Zero Accidents'].map(b => (
                  <span key={b} className="px-2 py-1 text-[9px] font-inter tracking-wide border border-[#00d4ff]/20 text-[#00d4ff]/80">{b}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {STATS.map(({value,suffix,label},i) => (
                <div key={label} className={`text-center p-3 border border-gray-800 bg-[#111]/50 ai-in ${vis?'ai-visible':''} ai-d${i+1}`}>
                  <div className="font-orbitron text-white text-lg font-black text-glow leading-none"><Counter target={value} suffix={suffix} vis={vis}/></div>
                  <div className="font-inter text-gray-400 text-[9px] tracking-wider uppercase mt-1 leading-tight">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VisionMissionSection() {
  const {ref, vis} = useVisible();
  return (
    <section ref={ref} className="py-24 relative overflow-hidden" style={{background:'#0a0a0a'}}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none" style={{background:'rgba(0,212,255,.02)'}}/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Our Direction</span>
          <h2 className="section-title">Vision {'&'} Mission</h2>
          <div className="glow-line"/>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {(['vision','mission'] as const).map((key) => {
            const data = VISION_MISSION[key];
            return (
              <div key={key} className={`group border border-gray-800/50 bg-[#111]/50 overflow-hidden hover:border-[#00d4ff]/30 transition-all duration-500 ai-in ${vis?'ai-visible':''} ai-d${key === 'vision' ? 1 : 2}`}
                style={{clipPath:'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))'}}>
                <div className="relative h-52 overflow-hidden">
                  <img src={data.img} alt={data.title} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105" loading="lazy"/>
                  <div className="absolute inset-0" style={{background:'linear-gradient(180deg,rgba(10,10,10,.15) 0%,rgba(10,10,10,.85) 100%)'}}/>
                  <div className="absolute top-5 left-5 flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center border border-[#00d4ff]/40 bg-[#00d4ff]/10">
                      {key === 'vision' ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
                        </svg>
                      )}
                    </div>
                    <h3 className="font-orbitron text-white text-base font-bold tracking-wider">{data.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="font-inter text-gray-300 text-sm leading-relaxed">“{data.text}”</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FlightAssuranceSection() {
  const {ref, vis} = useVisible();
  const [lbSrc, setLbSrc] = useState<string | null>(null);
  return (
    <>
      <section id="certifications" ref={ref} className="py-24 relative overflow-hidden" style={{background:'#080808'}}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl pointer-events-none" style={{background:'rgba(0,212,255,.015)'}}/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Certifications</span>
          <h2 className="section-title">Flight Assurance...</h2>
          <p className="font-orbitron text-[#00d4ff] text-sm tracking-[.15em] uppercase mt-1 mb-3">Ready for every flight</p>
          <div className="glow-line"/>
          <p className="font-inter text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">Our certifications reflect our commitment to safety, quality, and excellence in drone operations and training.</p>
        </div>
        <div className={`ai-in ${vis?'ai-visible':''} ai-d2`}>
          <style>{`.cert-swiper .swiper-pagination-bullet { background: rgba(0,212,255,0.4); opacity: 1; }\n.cert-swiper .swiper-pagination-bullet-active { background: #00d4ff; box-shadow: 0 0 8px rgba(0,212,255,0.6); }`}</style>
          <Swiper modules={[Autoplay, Pagination]} spaceBetween={24} slidesPerView={1}
            breakpoints={{640: {slidesPerView: 2},1024: {slidesPerView: 3}}}
            autoplay={{delay: 3000, disableOnInteraction: false}} pagination={{clickable: true}}
            className="cert-swiper pb-12"
          >
            {CERTIFICATES.map((cert, i) => (
              <SwiperSlide key={i}>
                <div className="group border border-gray-800/50 bg-[#111]/50 overflow-hidden hover:border-[#00d4ff]/30 transition-all duration-500"
                  style={{clipPath:'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,0 100%)'}}>
                  <div className="relative h-[320px] overflow-hidden cursor-pointer" onClick={() => setLbSrc(cert.src)}>
                    <img src={cert.src} alt={cert.label} className="w-full h-full object-contain p-4 transition-transform duration-600 group-hover:scale-105" loading="lazy"/>
                    <div className="absolute inset-0" style={{background:'linear-gradient(180deg,transparent 50%,rgba(10,10,10,.7) 100%)'}}/>
                  </div>
                  <div className="p-4 text-center"><p className="font-orbitron text-white text-[10px] font-semibold tracking-wider">{cert.label}</p></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
      {lbSrc && <ImageLightbox src={lbSrc} alt="Certificate" onClose={() => setLbSrc(null)} />}
    </>
  );
}

function InfrastructureSection() {
  const {ref, vis} = useVisible();
  return (
    <section id="infrastructure" ref={ref} className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{background:'rgba(0,212,255,.03)'}}/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Facilities</span>
          <h2 className="section-title">Our Infrastructure...</h2>
          <p className="font-orbitron text-[#00d4ff] text-sm tracking-[.15em] uppercase mt-1 mb-3">Built for excellence</p>
          <div className="glow-line"/>
        </div>
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className={`space-y-5 ai-in ${vis?'ai-visible':''} ai-d1`}>
            <p className="font-inter text-gray-300 text-sm leading-relaxed"><strong className="text-white">De Drone World</strong> boasts world-class infrastructure designed to provide the best learning and operational environment for drone technology.</p>
            <ul className="space-y-3">
              {INFRASTRUCTURE_FEATURES.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 group">
                  <div className="w-5 h-5 flex items-center justify-center border border-[#00d4ff]/40 bg-[#00d4ff]/10 flex-shrink-0 mt-0.5 group-hover:bg-[#00d4ff]/20 transition-colors">
                    <CheckCircle size={10} className="text-[#00d4ff]"/>
                  </div>
                  <span className="font-inter text-gray-400 text-xs leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={`ai-in ${vis?'ai-visible':''} ai-d2`}>
            <div className="relative" style={{clipPath:'polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px))'}}>
              <video src="/assets/infra.mp4" autoPlay muted loop playsInline className="w-full h-[400px] object-cover"/>
              <div className="absolute inset-0" style={{background:'linear-gradient(135deg,rgba(10,10,10,.3) 0%,transparent 50%,rgba(0,212,255,.05) 100%)'}}/>
            </div>
            <div className="mt-4 flex items-center gap-3 text-[#00d4ff]/70"><Play size={14}/><span className="font-inter text-[10px] tracking-wider uppercase">Watch our facility tour</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const {ref, vis} = useVisible();
  const [active, setActive] = useState(0);
  const next = useCallback(() => setActive(a => (a+1) % TESTIMONIALS.length), []);
  const prev = useCallback(() => setActive(a => (a-1+TESTIMONIALS.length) % TESTIMONIALS.length), []);
  useEffect(() => { const t = setInterval(next, 5000); return () => clearInterval(t); }, [next]);
  return (
    <section ref={ref} className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{background:'rgba(0,212,255,.03)'}}/>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-14 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">From Learners</span>
          <h2 className="section-title">What Our Students Say</h2>
          <div className="glow-line"/>
        </div>
        <div className={`ai-in ${vis?'ai-visible':''} ai-d2`}>
          <div className="relative p-10 border border-gray-800 bg-[#111]/50 text-center"
            style={{clipPath:'polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,22px 100%,0 calc(100% - 22px))'}}>
            <div className="font-orbitron text-7xl text-[#00d4ff]/8 absolute top-3 left-6 leading-none select-none">"</div>
            <div className="flex justify-center mb-4">{Array.from({length:TESTIMONIALS[active].rating}).map((_,i) => <Star key={i} size={14} className="text-[#00d4ff] fill-[#00d4ff]"/>)}</div>
            <blockquote className="font-inter text-gray-200 text-base leading-relaxed mb-7 max-w-2xl mx-auto relative z-10">"{TESTIMONIALS[active].text}"</blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border border-[#00d4ff]/25 bg-[#00d4ff]/8"><Users size={14} className="text-[#00d4ff]"/></div>
              <div className="text-left">
                <div className="font-orbitron text-white text-xs font-semibold">{TESTIMONIALS[active].name}</div>
                <div className="font-inter text-[#00d4ff] text-[10px] tracking-widest uppercase mt-0.5">{TESTIMONIALS[active].role}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-5 mt-6">
            <button onClick={prev} className="w-9 h-9 border border-gray-700 hover:border-[#00d4ff] flex items-center justify-center text-gray-400 hover:text-[#00d4ff] transition-all duration-300"><ArrowRight size={14} className="rotate-180"/></button>
            <div className="flex gap-2">{TESTIMONIALS.map((_,i) => (<button key={i} onClick={() => setActive(i)} className="h-1 transition-all duration-300" style={{width:i===active?28:8,background:i===active?'#00d4ff':'#374151',boxShadow:i===active?'0 0 8px rgba(0,212,255,.6)':undefined}}/>))}</div>
            <button onClick={next} className="w-9 h-9 border border-gray-700 hover:border-[#00d4ff] flex items-center justify-center text-gray-400 hover:text-[#00d4ff] transition-all duration-300"><ArrowRight size={14}/></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function RealImpactSection() {
  const {ref, vis} = useVisible();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);  const scrollTo = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const itemWidth = el.clientWidth;
    el.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
    setActiveIndex(index);
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const itemWidth = el.clientWidth;
    const idx = Math.round(el.scrollLeft / itemWidth);
    setActiveIndex(Math.min(idx, IMPACT_USES.length - 1));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <section id="impact" ref={ref} className="py-24 relative overflow-hidden" style={{background:'#080808'}}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl pointer-events-none" style={{background:'rgba(0,212,255,.015)'}}/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10 relative z-10">
        <div className={`ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Real Applications</span>
          <h2 className="section-title">Create Real Impact...</h2>
          <div className="glow-line"/>
          <p className="font-inter text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">Experience drone technology transforming industries across India.</p>
        </div>
      </div>
      
      <div className="relative z-10">
        {/* Horizontal snap-scroll container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {IMPACT_USES.map(({icon:Icon, title, desc, img}, i) => (
            <div
              key={title}
              className="snap-start shrink-0 w-full px-6 lg:px-8"
              style={{ minWidth: '100%' }}
            >
              <div
                className={`relative h-[420px] lg:h-[520px] overflow-hidden group ai-in ${vis?'ai-visible':''} ai-d${Math.min(i+1,5)}`}
                style={{clipPath:'polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px))'}}
              >
                <img
                  src={img} alt={title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0" style={{background:'linear-gradient(135deg,rgba(10,10,10,.75) 0%,rgba(10,10,10,.25) 45%,rgba(10,10,10,.85) 100%)'}}/>
                {/* Grid texture overlay */}
                <div className="absolute inset-0 grid-tex opacity-30"/>
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-14">
                  <div className="max-w-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 flex items-center justify-center border border-[#00d4ff]/40 bg-black/40 backdrop-blur-sm">
                        <Icon size={22} className="text-[#00d4ff]"/>
                      </div>
                      <h3 className="font-orbitron text-white text-2xl lg:text-3xl font-black tracking-tight">{title}</h3>
                    </div>
                    <p className="font-inter text-gray-300 text-sm leading-relaxed max-w-lg">{desc}</p>
                    {/* Slide indicator */}
                    <div className="flex items-center gap-2 mt-6">
                      <span className="font-orbitron text-[#00d4ff] text-sm font-bold">{String(i+1).padStart(2,'0')}</span>
                      <span className="text-gray-600 text-sm font-orbitron">/ {String(IMPACT_USES.length).padStart(2,'0')}</span>
                    </div>
                  </div>
                </div>
                {/* Corner accents */}
                <div className="absolute -top-2 -left-2 w-12 h-12 pointer-events-none">
                  <div className="absolute top-0 left-0 w-0.5 h-12 bg-[#00d4ff]" style={{boxShadow:'0 0 12px rgba(0,212,255,.7)'}}/>
                  <div className="absolute top-0 left-0 w-12 h-0.5 bg-[#00d4ff]" style={{boxShadow:'0 0 12px rgba(0,212,255,.7)'}}/>
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 pointer-events-none">
                  <div className="absolute bottom-0 right-0 w-0.5 h-12 bg-[#00d4ff]" style={{boxShadow:'0 0 12px rgba(0,212,255,.7)'}}/>
                  <div className="absolute bottom-0 right-0 w-12 h-0.5 bg-[#00d4ff]" style={{boxShadow:'0 0 12px rgba(0,212,255,.7)'}}/>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-center gap-5 mt-8">
          <button
            onClick={() => scrollTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="w-10 h-10 border border-gray-700 hover:border-[#00d4ff] flex items-center justify-center text-gray-400 hover:text-[#00d4ff] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          >
            <ChevronLeft size={15}/>
          </button>
          <div className="flex gap-2">
            {IMPACT_USES.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className="h-1.5 rounded-full transition-all duration-400"
                style={{
                  width: i === activeIndex ? 28 : 8,
                  background: i === activeIndex ? '#00d4ff' : '#374151',
                  boxShadow: i === activeIndex ? '0 0 10px rgba(0,212,255,.6)' : undefined
                }}
              />
            ))}
          </div>
          <button
            onClick={() => scrollTo(activeIndex + 1)}
            disabled={activeIndex === IMPACT_USES.length - 1}
            className="w-10 h-10 border border-gray-700 hover:border-[#00d4ff] flex items-center justify-center text-gray-400 hover:text-[#00d4ff] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          >
            <ChevronRight size={15}/>
          </button>
        </div>
      </div>
    </section>
  );
}

function PartnersSection() {
  const {ref, vis} = useVisible();
  return (
    <section ref={ref} className="py-20 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`text-center mb-12 ai-in ${vis?'ai-visible':''}`}>
          <span className="section-label">Trusted By</span>
          <h2 className="section-title">Our Partners</h2>
          <div className="glow-line"/>
        </div>
        <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 ai-in ${vis?'ai-visible':''} ai-d2`}>
          {PARTNERS.map(({name,img},i) => (
            <div key={name} className={`group border border-gray-800/50 bg-[#111]/50 overflow-hidden hover:border-[#00d4ff]/25 transition-all duration-400 ai-in ${vis?'ai-visible':''} ai-d${Math.min(i+1,5)}`}>
              <div className="h-24 overflow-hidden relative">
                <img src={img} alt={name} className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-400" loading="lazy"/>
                <div className="absolute inset-0" style={{background:'linear-gradient(180deg,transparent 30%,rgba(10,10,10,.7) 100%)'}}/>
              </div>
              <div className="p-3 text-center"><span className="font-inter text-gray-300 text-[10px] font-medium group-hover:text-[#00d4ff] transition-colors duration-300">{name}</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
  const navigate = useNavigate();
  const {ref, vis} = useVisible();
  return (
    <section ref={ref} className="py-20 relative overflow-hidden" style={{background:'#060606'}}>
      <div className="absolute inset-0 grid-tex opacity-20"/>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className={`p-10 border border-[#00d4ff]/15 bg-[#00d4ff]/3 ai-in ${vis?'ai-visible':''}`}
          style={{clipPath:'polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,24px 100%,0 calc(100% - 24px))'}}>
          <span className="section-label block mb-4">Ready to Take Flight?</span>
          <h2 className="font-orbitron text-white font-black mb-4" style={{fontSize:'clamp(22px,4vw,42px)'}}>
            Enroll in India's Premier<br/><span className="text-glow" style={{color:'#00d4ff'}}>Drone Academy</span>
          </h2>
          <p className="font-inter text-gray-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">Enroll in our DGCA-approved drone pilot training or hire our professional aerial services. Be part of India's drone revolution.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="neon-btn" onClick={() => navigate('/contact')}>Enroll Now <ArrowRight size={13}/></button>
            <a href="tel:+917448800997" className="neon-btn-ghost"><Phone size={13}/> +91 74488 00997</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Home Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Hero/>
      <DGCAStrip/>
      <StoriesSection/>
      <AboutSection/>
      <VisionMissionSection/>
      <ServicesSection/>
      <TrainingCenters/>
      <ExcellenceSection/>
      <FlightAssuranceSection/>
      <InfrastructureSection/>
      <TestimonialsSection/>
      <RealImpactSection/>
      <PartnersSection/>
      <CTABanner/>
    </>
  );
}
