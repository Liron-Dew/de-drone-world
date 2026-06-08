import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle, ChevronDown, GraduationCap, Award, Users,
  BookOpen, Clock, Shield, Zap, MapPin, Target, Star, Phone
} from 'lucide-react';
import { COURSES_DATA, COURSE_CATEGORIES } from '../data/courses';

interface Particle { x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number; max: number; }

const STATS = [
  { value: 370, suffix: '+', label: 'Pilots Trained', icon: Users },
  { value: 23, suffix: '+', label: 'Courses Offered', icon: BookOpen },
  { value: 6, suffix: ' Yrs', label: 'Industry Experience', icon: Clock },
  { value: 100, suffix: '%', label: 'DGCA Compliant', icon: Shield },
];

const WHY_US = [
  { icon: Award, title: 'DGCA Approved RPTO', desc: 'Officially authorized Remote Pilot Training Organization by the Ministry of Civil Aviation.' },
  { icon: Shield, title: 'Armed Forces Veterans', desc: 'Learn from ex-Indian Armed Forces personnel with real-world aviation expertise.' },
  { icon: Target, title: 'Guaranteed Placement', desc: 'Placement assistance with industry partners for all certified course participants.' },
  { icon: Star, title: 'Industry Recognition', desc: 'Certificates recognized by leading drone companies, survey firms, and agricultural organizations.' },
  { icon: MapPin, title: 'Multiple Centers', desc: 'Training facilities in Coimbatore and Madurai at premier engineering institutions.' },
  { icon: Zap, title: 'Modern Infrastructure', desc: 'State-of-the-art simulators, smart classrooms, and dedicated flying grounds.' },
];

const PROCESS_STEPS = [
  { step: '01', title: 'Choose Your Course', desc: 'Browse our programs and select the one that matches your goals and experience level.' },
  { step: '02', title: 'Enroll & Register', desc: 'Complete your registration online and secure your spot in the upcoming batch.' },
  { step: '03', title: 'Training & Practice', desc: 'Attend classroom sessions, simulator practice, and hands-on flight training with expert instructors.' },
  { step: '04', title: 'Get Certified', desc: 'Pass the DGCA theory and practical exams to earn your Remote Pilot Certificate.' },
  { step: '05', title: 'Launch Your Career', desc: 'Access our placement network, start your drone business, or offer professional services.' },
];

const CENTERS = [
  { name: 'Hindustan College of Engineering', location: 'Coimbatore, Tamil Nadu', tag: 'Premier Institution' },
  { name: 'Vaigai Engineering College', location: 'Madurai, Tamil Nadu', tag: 'Dedicated Facility' },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'DGCA Courses': GraduationCap,
  'Skill Courses': BookOpen,
  'Drone Workshops': Award,
  'Diploma Courses': GraduationCap,
  'Internships': Clock,
};

const CATEGORY_IMAGES: Record<string, string> = {
  'DGCA Courses': '/assets/services/diplomo-course.jpeg',
  'Skill Courses': '/assets/services/construction-service.jpeg',
  'Drone Workshops': '/assets/services/workshop-build-your-own-drone.jpeg',
  'Diploma Courses': '/assets/services/diplomo-course.jpeg',
  'Internships': '/assets/training/small-training.jpeg',
};

// ── Hooks ──
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
        const d = Math.hypot(ps[i].x-ps[j].x,ps[i].y-ps[j].y); if (d<85) { ctx.save(); ctx.globalAlpha=(1-d/85)*.09; ctx.strokeStyle='#00d4ff'; ctx.lineWidth=.5; ctx.beginPath(); ctx.moveTo(ps[i].x,ps[i].y); ctx.lineTo(ps[j].x,ps[j].y); ctx.stroke(); ctx.restore(); }
      }
      raf = requestAnimationFrame(frame);
    };
    frame();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={cv} className="absolute inset-0 pointer-events-none" />;
}

// ── Sections ──
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
      <div className="absolute inset-0 z-0" style={{ transform: `translateY(${py}px)`, willChange: 'transform' }}>
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(135deg, rgba(10,10,10,.92) 0%, rgba(10,10,10,.5) 50%, rgba(10,10,10,.8) 100%)' }} />
        <img src="/assets/services_hero.png" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 grid-tex z-10" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="rotate-slow w-[700px] h-[700px] border border-[#00d4ff]/6 rounded-full absolute" />
        <div className="rotate-slow-rev w-[450px] h-[450px] border border-[#00d4ff]/10 rounded-full absolute" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-28">
        <div className="max-w-4xl">
          <span className="section-label text-[#00d4ff] tracking-[.35em] text-[10px] mb-4 block">DGCA Approved RPTO</span>
          <h1 className="font-orbitron font-black leading-[1.05] text-white" style={{ fontSize: 'clamp(36px, 5.5vw, 72px)' }}>
            Master the Skies<br />with Professional<br />
            <span className="text-glow" style={{ color: '#00d4ff' }}>Drone Training</span>
          </h1>
          <p className="font-inter text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl mt-6 mb-10">
            India's most comprehensive drone training academy. From DGCA-certified pilot programs
            to specialized skill courses and hands-on workshops — learn from aviation experts of
            the Indian Armed Forces.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <Link to="/contact" className="neon-btn">
              Enroll Now <ArrowRight size={13} />
            </Link>
            <div className="flex items-center gap-2 text-gray-400 text-xs font-inter">
              <CheckCircle size={12} className="text-[#00d4ff]" />
              <span>DGCA Authorized Training</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 bounce-scroll">
        <span className="text-[#00d4ff]/40 text-[8px] tracking-widest uppercase font-inter">Scroll</span>
        <ChevronDown size={16} className="text-[#00d4ff]/40" />
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

function ExpandableCategoriesSection() {
  const { ref, vis } = useVisible();
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const categoryData = COURSE_CATEGORIES.map(cat => ({
    ...cat,
    Icon: CATEGORY_ICONS[cat.name] || GraduationCap,
    courses: Object.values(COURSES_DATA).filter(c => c.category === cat.name),
    catImage: CATEGORY_IMAGES[cat.name] || '/assets/training/small-training.jpeg',
  }));

  return (
    <section ref={ref} className="py-24 relative overflow-hidden" style={{ background: '#080808' }}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(0,212,255,.015)' }} />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 ai-in ${vis ? 'ai-visible' : ''}`}>
          <span className="section-label">Our Programs</span>
          <h2 className="section-title">Training Programs</h2>
          <div className="glow-line" />
          <p className="font-inter text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
            DGCA-approved drone training programs designed for beginners, professionals, and enterprises.
            Click a category below to explore courses.
          </p>
        </div>

        <div className="space-y-5">
          {categoryData.map(({ name, desc, Icon, courses, catImage }) => {
            const isExpanded = expandedCat === name;
            return (
              <div
                key={name}
                className={`group relative border transition-all duration-500 cursor-pointer ${
                  isExpanded
                    ? 'border-[#00d4ff]/40 bg-[#111]/80'
                    : 'border-gray-800/50 bg-[#111]/50 hover:border-[#00d4ff]/20 hover:-translate-y-0.5'
                }`}
                style={{ clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)' }}
                onClick={() => setExpandedCat(isExpanded ? null : name)}
              >
                {/* ── Category Header ── */}
                <div className="relative h-44 lg:h-52 overflow-hidden">
                  <img
                    src={catImage}
                    alt={name}
                    className={`w-full h-full object-cover transition-all duration-700 ${isExpanded ? 'scale-105 brightness-50' : 'group-hover:scale-105'}`}
                  />
                  <div className="absolute inset-0" style={{
                    background: isExpanded
                      ? 'linear-gradient(180deg, rgba(10,10,10,.2) 0%, rgba(10,10,10,.9) 100%)'
                      : 'linear-gradient(180deg, rgba(10,10,10,.1) 0%, rgba(10,10,10,.7) 100%)'
                  }} />

                  <div className="absolute bottom-5 left-6 right-6 flex items-center gap-5">
                    <div className="w-14 h-14 flex items-center justify-center border-2 border-[#00d4ff] bg-black/50 backdrop-blur-sm flex-shrink-0"
                      style={{ boxShadow: '0 0 20px rgba(0,212,255,.2)' }}>
                      <Icon size={22} className="text-[#00d4ff]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-orbitron text-white text-lg md:text-xl font-bold tracking-wide">{name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="font-inter text-gray-300 text-xs">{desc}</p>
                        <span className="font-inter text-[#00d4ff] text-[10px] tracking-wider bg-[#00d4ff]/10 px-2 py-0.5 border border-[#00d4ff]/20">
                          {courses.length} Courses
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-[#00d4ff] transition-transform duration-400 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>

                {/* ── Expandable Course Grid ── */}
                <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-6 pt-5 border-t border-[#00d4ff]/10">
                    <p className="font-orbitron text-[#00d4ff] text-[9px] tracking-[.2em] uppercase mb-4">
                      Explore {name}
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {courses.map((course) => (
                        <Link
                          key={course.title}
                          to={`/training/${course.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="group/card border border-gray-800 bg-[#0a0a0a]/80 hover:border-[#00d4ff]/30 hover:-translate-y-1 transition-all duration-400"
                          style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
                        >
                          <div className="relative h-28 overflow-hidden">
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105" />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(10,10,10,.85) 100%)' }} />
                            <div className="absolute top-2 left-2 px-2 py-0.5 border border-[#00d4ff]/30 bg-black/60">
                              <span className="font-inter text-[#00d4ff] text-[7px] tracking-widest uppercase">{course.duration}</span>
                            </div>
                          </div>
                          <div className="p-3">
                            <h4 className="font-orbitron text-white text-[10px] font-semibold leading-tight mb-1">{course.title}</h4>
                            <p className="font-inter text-gray-400 text-[9px] leading-relaxed line-clamp-2">{course.description}</p>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800/50">
                              <span className="font-inter text-gray-500 text-[7px] tracking-wider">
                                {course.certification.includes('DGCA') ? 'DGCA Certified' : 'Certified'}
                              </span>
                              <span className="flex items-center gap-1 text-[#00d4ff] text-[8px] font-inter">
                                View <ArrowRight size={8} />
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom bar when collapsed */}
                {!isExpanded && (
                  <div className="px-6 py-3 flex items-center justify-between border-t border-[#00d4ff]/5">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-1.5">
                        {courses.slice(0, 4).map((c) => (
                          <div key={c.title} className="w-6 h-6 rounded-full border-2 border-[#111] bg-gray-700 flex items-center justify-center overflow-hidden">
                            <span className="text-white text-[6px] font-bold">
                              {c.title.charAt(0)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <span className="font-inter text-gray-500 text-[9px]">{courses.length} programs available</span>
                    </div>
                    <span className="font-inter text-[#00d4ff] text-[9px] tracking-wider uppercase flex items-center gap-1">
                      Click to Explore <ChevronDown size={12} />
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

function WhyUsSection() {
  const { ref, vis } = useVisible();
  return (
    <section ref={ref} className="py-24 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(0,212,255,.03)' }} />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-14 ai-in ${vis ? 'ai-visible' : ''}`}>
          <span className="section-label">Why Train With Us</span>
          <h2 className="section-title">Built for Excellence</h2>
          <div className="glow-line" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY_US.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className={`group p-6 border border-gray-800/50 bg-[#111]/40 hover:border-[#00d4ff]/25 hover:-translate-y-1 transition-all duration-400 ai-in ${vis ? 'ai-visible' : ''} ai-d${Math.min(i + 1, 6)}`}
              style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)' }}>
              <div className="w-10 h-10 flex items-center justify-center border border-[#00d4ff]/30 bg-[#00d4ff]/8 mb-4 group-hover:bg-[#00d4ff]/15 transition-colors">
                <Icon size={16} className="text-[#00d4ff]" />
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

function ProcessSection() {
  const { ref, vis } = useVisible();
  return (
    <section ref={ref} className="py-24 relative overflow-hidden" style={{ background: '#080808' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 ai-in ${vis ? 'ai-visible' : ''}`}>
          <span className="section-label">Your Journey</span>
          <h2 className="section-title">From Beginner to Pilot</h2>
          <div className="glow-line" />
          <p className="font-inter text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
            A structured pathway designed to take you from zero experience to certified drone professional.
          </p>
        </div>
        <div className="relative">
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-[#00d4ff] via-[#00d4ff]/30 to-transparent hidden md:block" />
          <div className="space-y-8">
            {PROCESS_STEPS.map(({ step, title, desc }, i) => (
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
  );
}

function CentersSection() {
  const { ref, vis } = useVisible();
  return (
    <section ref={ref} className="py-20 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`text-center mb-14 ai-in ${vis ? 'ai-visible' : ''}`}>
          <span className="section-label">Our Centers</span>
          <h2 className="section-title">Where to Find Us</h2>
          <div className="glow-line" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {CENTERS.map(({ name, location, tag }, i) => (
            <div key={name} className={`group border border-gray-800/50 bg-[#111]/50 hover:border-[#00d4ff]/30 transition-all duration-500 ai-in ${vis ? 'ai-visible' : ''} ai-d${i + 1}`}
              style={{ clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)' }}>
              <div className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center border border-[#00d4ff]/30 bg-[#00d4ff]/8 flex-shrink-0">
                  <MapPin size={18} className="text-[#00d4ff]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-orbitron text-white text-xs font-semibold">{name}</h3>
                  <p className="font-inter text-gray-400 text-xs mt-1">{location}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" style={{ boxShadow: '0 0 6px rgba(0,212,255,.6)' }} />
                    <span className="font-inter text-[#00d4ff] text-[9px] tracking-wider">{tag}</span>
                  </div>
                </div>
              </div>
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
          <span className="section-label block mb-4">Ready to Soar?</span>
          <h2 className="font-orbitron text-white font-black mb-4" style={{ fontSize: 'clamp(22px, 4vw, 42px)' }}>
            Start Your Drone Career<br />
            <span className="text-glow" style={{ color: '#00d4ff' }}>Today</span>
          </h2>
          <p className="font-inter text-gray-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Enroll in India's premier drone training academy. DGCA-certified courses with
            placement assistance. Your journey to becoming a certified drone pilot starts here.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="neon-btn">
              Enroll Now <ArrowRight size={13} />
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

// ── Main Page ──
export default function TrainingPage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ExpandableCategoriesSection />
      <WhyUsSection />
      <ProcessSection />
      <CentersSection />
      <CTASection />
    </>
  );
}
