import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CheckCircle, Clock, Award, Users,
  BookOpen, Target, Shield, ChevronDown, Star, GraduationCap,
  Phone, DollarSign, Calendar
} from 'lucide-react';
import { getCourseByTitle, COURSES_DATA } from '../../data/courses';

interface Particle { x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number; max: number; }

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

const FAQ_DATA = [
  { q: 'When are the classes conducted?', a: 'Classes are held on weekdays from 9 AM to 5 PM. Weekend batches are available for select courses. Practical sessions are scheduled based on weather conditions and daylight hours.' },
  { q: 'Is accommodation provided?', a: 'Yes, we provide AC accommodation for outstation students at our campus locations. Healthy meals are included in the accommodation package.' },
  { q: 'What is the batch size?', a: 'We maintain limited batch sizes (8-15 students) to ensure personalized attention and adequate hands-on flying time for each participant.' },
  { q: 'Do I get a job after the course?', a: 'We provide 100% placement assistance for our certified courses. Our placement network includes drone service companies, agricultural firms, survey companies, and inspection service providers.' },
  { q: 'What equipment is provided?', a: 'All training drones, safety gear, and learning materials are provided during the course. Some workshop courses include take-home drone kits.' },
];

const INSTRUCTORS = [
  { name: 'Squadron Leader Rajesh Kumar', role: 'Chief Training Officer', exp: '20+ Years Aviation', desc: 'Former Indian Air Force pilot with extensive experience in UAV operations and drone training programs across India.', image: '' },
  { name: 'Lt Col Arvind Singh', role: 'Head of Operations', exp: '18+ Years Defense', desc: 'Retired Army officer specializing in aerial surveillance, mapping, and training curriculum development for drone operators.', image: '' },
  { name: 'Dr. Priya Venkatesh', role: 'Agriculture Specialist', exp: '12+ Years Agri-Tech', desc: 'PhD in Agricultural Sciences with expertise in precision farming, NDVI analysis, and drone-based crop monitoring solutions.', image: '' },
];

export default function TrainingCoursePage({ title }: { title: string }) {
  const course = getCourseByTitle(title);
  const { ref: visRef, vis } = useVisible();
  const { ref: statsRef, vis: statsVis } = useVisible();
  const [py, setPy] = useState(0);
  const [activeModule, setActiveModule] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const fn = () => setPy(window.scrollY * 0.3);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  if (!course) {
    return (
      <div className="pt-28 pb-20 bg-[#0a0a0a] min-h-screen">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Link to="/training" className="inline-flex items-center gap-2 text-[#00d4ff] text-xs font-inter tracking-wider uppercase mb-8 hover:underline">
            <ArrowLeft size={14} /> Back to Training
          </Link>
          <div className="p-8 border border-[#00d4ff]/20 bg-[#00d4ff]/4 text-center" style={{ clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)' }}>
            <h1 className="font-orbitron text-white text-xl font-black mb-4">{title}</h1>
            <p className="font-inter text-gray-400 text-sm">Course content is being developed. <Link to="/contact" className="text-[#00d4ff] hover:underline">Contact us</Link> for details.</p>
          </div>
        </div>
      </div>
    );
  }

  const relatedCourses = Object.values(COURSES_DATA)
    .filter(c => c.category === course.category && c.title !== course.title)
    .slice(0, 3);

  const catImage = course.category === 'DGCA Courses' ? '/assets/services/diplomo-course.jpeg'
    : course.category === 'Skill Courses' ? '/assets/services/construction-service.jpeg'
    : course.category === 'Drone Workshops' ? '/assets/services/workshop-build-your-own-drone.jpeg'
    : '/assets/training/small-training.jpeg';

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* ── Hero ── */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <Particles />
        <div className="absolute inset-0 z-0" style={{ transform: `translateY(${py}px)`, willChange: 'transform' }}>
          <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(135deg, rgba(10,10,10,.92) 0%, rgba(10,10,10,.4) 50%, rgba(10,10,10,.8) 100%)' }} />
          <img src={catImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 grid-tex z-10" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="rotate-slow w-[500px] h-[500px] border border-[#00d4ff]/6 rounded-full absolute" />
          <div className="rotate-slow-rev w-[300px] h-[300px] border border-[#00d4ff]/10 rounded-full absolute" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-28">
          <Link to="/training" className="inline-flex items-center gap-2 text-[#00d4ff] text-xs font-inter tracking-wider uppercase mb-8 hover:underline bg-black/30 px-3 py-1.5 backdrop-blur-sm border border-[#00d4ff]/10">
            <ArrowLeft size={14} /> Back to Training
          </Link>
          <div className="grid lg:grid-cols-2 gap-10 items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 border border-[#00d4ff]/30 bg-[#00d4ff]/10 backdrop-blur-sm">
                  <span className="font-inter text-[#00d4ff] text-[9px] tracking-[.2em] uppercase">{course.category}</span>
                </span>
                <span className="font-inter text-gray-400 text-[9px] tracking-wider uppercase flex items-center gap-1">
                  <Clock size={10} /> {course.duration}
                </span>
                <span className="font-inter text-[#00d4ff] text-[9px] tracking-wider uppercase flex items-center gap-1">
                  <Award size={10} /> {course.certification.includes('DGCA') ? 'DGCA Certified' : 'Certificate'}
                </span>
              </div>
              <h1 className="font-orbitron font-black leading-[1.05] text-white" style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}>
                {course.title}
              </h1>
              <p className="font-orbitron text-[#00d4ff] text-xs md:text-sm font-semibold tracking-[.1em] mt-3">{course.subtitle}</p>
              <p className="font-inter text-gray-300 text-sm leading-relaxed mt-5 mb-8 max-w-xl">{course.description}</p>
              <div className="flex flex-wrap gap-3 items-center">
                <Link to="/contact" className="neon-btn text-xs px-6 py-3">
                  Enroll Now — Limited Seats <ArrowRight size={12} />
                </Link>
                <div className="flex items-center gap-2 text-gray-400 text-xs font-inter border border-gray-800/50 px-4 py-2.5 bg-black/40 backdrop-blur-sm">
                  <CheckCircle size={12} className="text-[#00d4ff]" />
                  <span>{course.certification.includes('DGCA') ? 'DGCA Approved' : 'Certificate Included'}</span>
                </div>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Clock, label: 'Duration', value: course.duration },
                { icon: Award, label: 'Certification', value: course.certification.includes('DGCA') ? 'DGCA Approved' : 'Professional' },
                { icon: BookOpen, label: 'Modules', value: `${course.syllabus.length} Modules` },
                { icon: Users, label: 'Format', value: 'Classroom + Practical' },
              ].map(({ icon: I, label, value }) => (
                <div key={label} className="p-4 border border-gray-800/50 bg-[#111]/80 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <I size={12} className="text-[#00d4ff]" />
                    <span className="font-inter text-gray-500 text-[9px] tracking-wider uppercase">{label}</span>
                  </div>
                  <span className="font-orbitron text-white text-xs font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 bounce-scroll">
          <span className="text-[#00d4ff]/40 text-[8px] tracking-widest uppercase font-inter">Scroll</span>
          <ChevronDown size={16} className="text-[#00d4ff]/40" />
        </div>
      </section>

      {/* ── Course Highlights Bar ── */}
      <div className="py-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d1f2d, #0a2030, #0d1f2d)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {course.highlights.map((h) => (
              <div key={h} className="flex items-center gap-2">
                <Star size={12} className="text-[#00d4ff] fill-[#00d4ff]" />
                <span className="font-inter text-gray-200 text-xs">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Overview ── */}
      <section ref={visRef} className="py-20 relative overflow-hidden" style={{ background: '#080808' }}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(0,212,255,.02)' }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className={`grid lg:grid-cols-2 gap-14 items-start ai-in ${vis ? 'ai-visible' : ''}`}>
            <div className="space-y-5">
              <span className="section-label">Course Overview</span>
              <h2 className="section-title">What You'll Learn</h2>
              <div className="w-10 h-0.5 bg-[#00d4ff]" style={{ boxShadow: '0 0 8px rgba(0,212,255,.8)' }} />
              <p className="font-inter text-gray-300 text-sm leading-relaxed">{course.longDescription}</p>

              {/* Highlights */}
              <div className="pt-4">
                <p className="font-orbitron text-[#00d4ff] text-[10px] tracking-[.2em] uppercase mb-3">Key Highlights</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {course.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-3 p-3 border border-gray-800/50 bg-[#111]/40">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" style={{ boxShadow: '0 0 6px rgba(0,212,255,.6)' }} />
                      <span className="font-inter text-gray-200 text-xs">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {/* Image */}
              <div className="relative overflow-hidden h-48" style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))' }}>
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,.06) 0%, transparent 60%)' }} />
              </div>

              {/* Who Should Attend */}
              <div className="p-5 border border-gray-800/50 bg-[#111]/40">
                <p className="font-orbitron text-[#00d4ff] text-[10px] tracking-[.2em] uppercase mb-3">
                  <Target size={12} className="inline mr-1" /> Who Should Attend
                </p>
                <div className="space-y-2">
                  {course.targetAudience.map((a) => (
                    <div key={a} className="flex items-center gap-2">
                      <CheckCircle size={10} className="text-[#00d4ff] flex-shrink-0" />
                      <span className="font-inter text-gray-300 text-xs">{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prerequisites */}
              <div className="p-5 border border-gray-800/50 bg-[#111]/40">
                <p className="font-orbitron text-[#00d4ff] text-[10px] tracking-[.2em] uppercase mb-3">
                  <BookOpen size={12} className="inline mr-1" /> Prerequisites
                </p>
                <div className="space-y-2">
                  {course.prerequisites.map((p) => (
                    <div key={p} className="flex items-center gap-2">
                      <Shield size={10} className="text-[#00d4ff] flex-shrink-0" />
                      <span className="font-inter text-gray-300 text-xs">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Syllabus ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(0,212,255,.015)' }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className={`text-center mb-14 ai-in ${vis ? 'ai-visible' : ''}`}>
            <span className="section-label">Curriculum</span>
            <h2 className="section-title">Complete Syllabus</h2>
            <div className="glow-line" />
            <p className="font-inter text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
              A carefully structured curriculum with {course.syllabus.length} modules designed by industry experts.
            </p>
          </div>

          {/* Module tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-8">
            {course.syllabus.map((module, i) => (
              <button
                key={module.module}
                onClick={() => setActiveModule(i)}
                className={`p-3 text-left border transition-all duration-300 ${
                  activeModule === i
                    ? 'border-[#00d4ff] bg-[#00d4ff]/10'
                    : 'border-gray-800/50 bg-[#111]/40 hover:border-gray-700'
                }`}
              >
                <div className={`font-orbitron text-[9px] font-bold ${activeModule === i ? 'text-[#00d4ff]' : 'text-gray-500'}`}>
                  {module.module.split(':')[0]}
                </div>
                <div className={`font-inter text-[10px] mt-1 leading-tight ${activeModule === i ? 'text-white' : 'text-gray-400'}`}>
                  {module.module.split(':')[1]?.trim() || module.module}
                </div>
              </button>
            ))}
          </div>

          {/* Active module content */}
          <div className="border border-gray-800/50 bg-[#111]/40 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 flex items-center justify-center border border-[#00d4ff]/30 bg-[#00d4ff]/8">
                <BookOpen size={14} className="text-[#00d4ff]" />
              </div>
              <div>
                <h3 className="font-orbitron text-white text-xs font-bold">{course.syllabus[activeModule].module}</h3>
                <span className="font-inter text-gray-500 text-[9px] tracking-wider">{course.syllabus[activeModule].topics.length} topics</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {course.syllabus[activeModule].topics.map((topic) => (
                <div key={topic} className="flex items-center gap-2 p-2.5 border border-gray-800/50 bg-[#0a0a0a]/60">
                  <CheckCircle size={9} className="text-[#00d4ff] flex-shrink-0" />
                  <span className="font-inter text-gray-300 text-[11px]">{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: '#080808' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className={`text-center mb-14 ai-in ${vis ? 'ai-visible' : ''}`}>
            <span className="section-label">What's Included</span>
            <h2 className="section-title">Everything You Get</h2>
            <div className="glow-line" />
            <p className="font-inter text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
              All materials, equipment, and support included in your course fee.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {course.features.map((f, i) => (
              <div key={f} className={`flex items-center gap-3 p-4 border border-gray-800/50 bg-[#111]/40 hover:border-[#00d4ff]/20 hover:-translate-y-0.5 transition-all duration-400 ai-in ${vis ? 'ai-visible' : ''} ai-d${Math.min(i + 1, 6)}`}>
                <div className="w-8 h-8 flex items-center justify-center border border-[#00d4ff]/30 bg-[#00d4ff]/8 flex-shrink-0">
                  <CheckCircle size={12} className="text-[#00d4ff]" />
                </div>
                <span className="font-inter text-gray-200 text-xs leading-snug">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instructor Section ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(0,212,255,.03)' }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className={`text-center mb-14 ai-in ${vis ? 'ai-visible' : ''}`}>
            <span className="section-label">Your Mentors</span>
            <h2 className="section-title">Learn from Experts</h2>
            <div className="glow-line" />
            <p className="font-inter text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
              Our instructors bring decades of experience from the Indian Armed Forces and industry.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {INSTRUCTORS.map(({ name, role, exp, desc }, i) => (
              <div key={name} className={`p-6 border border-gray-800/50 bg-[#111]/40 hover:border-[#00d4ff]/20 hover:-translate-y-1 transition-all duration-400 text-center ai-in ${vis ? 'ai-visible' : ''} ai-d${i + 1}`}
                style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)' }}>
                <div className="w-20 h-20 mx-auto mb-4 border-2 border-[#00d4ff] bg-[#00d4ff]/10 flex items-center justify-center"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
                  <GraduationCap size={28} className="text-[#00d4ff]" />
                </div>
                <h3 className="font-orbitron text-white text-xs font-bold mb-1">{name}</h3>
                <p className="font-orbitron text-[#00d4ff] text-[9px] tracking-[.2em] uppercase mb-1">{role}</p>
                <span className="inline-block px-2 py-0.5 border border-[#00d4ff]/20 bg-[#00d4ff]/8 text-[#00d4ff] text-[8px] font-inter tracking-wider mb-3">{exp}</span>
                <p className="font-inter text-gray-400 text-[10px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section ref={statsRef} className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d1f2d, #0a2030, #0d1f2d)' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,.04) 0%, rgba(0,212,255,.08) 50%, rgba(0,212,255,.04) 100%)' }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: course.durationDays > 30 ? 100 : 95, suffix: '%', label: 'Pass Rate' },
              { value: 370, suffix: '+', label: 'Students Trained' },
              { value: course.durationDays, suffix: course.duration.includes('Months') ? '+ Days' : ' Days', label: 'Duration' },
              { value: course.syllabus.length, suffix: '+', label: 'Core Modules' },
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

      {/* ── Pricing Section ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: '#080808' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className={`text-center mb-14 ai-in ${vis ? 'ai-visible' : ''}`}>
            <span className="section-label">Investment</span>
            <h2 className="section-title">Course Fee & Schedule</h2>
            <div className="glow-line" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Pricing Card */}
            <div className="p-6 border border-[#00d4ff]/20 bg-[#00d4ff]/5 text-center"
              style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)' }}>
              <DollarSign size={24} className="text-[#00d4ff] mx-auto mb-3" />
              <h3 className="font-orbitron text-white text-sm font-bold mb-2">Course Fee</h3>
              <p className="font-inter text-gray-400 text-xs leading-relaxed">Contact us for current pricing and available discounts for early bird, group, and student enrollments.</p>
              <Link to="/contact" className="neon-btn text-[9px] px-4 py-2 mt-4 inline-flex">
                Get Pricing <ArrowRight size={10} />
              </Link>
            </div>
            {/* Schedule Card */}
            <div className="p-6 border border-gray-800/50 bg-[#111]/40 text-center"
              style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)' }}>
              <Calendar size={24} className="text-[#00d4ff] mx-auto mb-3" />
              <h3 className="font-orbitron text-white text-sm font-bold mb-2">Schedule</h3>
              <p className="font-inter text-gray-400 text-xs leading-relaxed">{course.duration} program. Weekday batches (9AM-5PM). Weekend batches available. Next batch starts soon.</p>
              <Link to="/contact" className="neon-btn-ghost text-[9px] px-4 py-2 mt-4 inline-flex">
                Check Dates <ArrowRight size={10} />
              </Link>
            </div>
            {/* Certification Card */}
            <div className="p-6 border border-gray-800/50 bg-[#111]/40 text-center"
              style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)' }}>
              <Award size={24} className="text-[#00d4ff] mx-auto mb-3" />
              <h3 className="font-orbitron text-white text-sm font-bold mb-2">Certificate</h3>
              <p className="font-inter text-gray-400 text-xs leading-relaxed mb-2">{course.certification}</p>
              <p className="font-inter text-gray-500 text-[10px]">Recognized by industry partners and regulatory authorities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className={`text-center mb-14 ai-in ${vis ? 'ai-visible' : ''}`}>
            <span className="section-label">Questions?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="glow-line" />
          </div>
          <div className="space-y-3">
            {FAQ_DATA.map(({ q, a }, i) => (
              <div key={i} className={`border border-gray-800/50 bg-[#111]/40 overflow-hidden transition-all duration-400 ai-in ${vis ? 'ai-visible' : ''} ai-d${Math.min(i + 1, 6)}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-inter text-gray-200 text-xs font-medium pr-4">{q}</span>
                  <ChevronDown size={14} className={`text-[#00d4ff] flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-400 ${openFaq === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="px-5 pb-5 font-inter text-gray-400 text-xs leading-relaxed">{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related Courses ── */}
      {relatedCourses.length > 0 && (
        <section className="py-20 relative overflow-hidden" style={{ background: '#080808' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className={`text-center mb-14 ai-in ${vis ? 'ai-visible' : ''}`}>
              <span className="section-label">More Programs</span>
              <h2 className="section-title">Related Courses</h2>
              <div className="glow-line" />
              <p className="font-inter text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">Explore more courses in the {course.category} category.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {relatedCourses.map((rc, i) => (
                <Link
                  key={rc.title}
                  to={`/training/${rc.slug}`}
                  className={`group border border-gray-800/50 bg-[#111]/40 hover:border-[#00d4ff]/30 hover:-translate-y-1 transition-all duration-400 ai-in ${vis ? 'ai-visible' : ''} ai-d${i + 1}`}
                  style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)' }}
                >
                  <div className="relative h-32 overflow-hidden">
                    <img src={rc.image} alt={rc.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(10,10,10,.85) 100%)' }} />
                    <div className="absolute top-2 left-2 px-2 py-0.5 border border-[#00d4ff]/30 bg-black/60">
                      <span className="font-inter text-[#00d4ff] text-[7px] tracking-widest uppercase">{rc.duration}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-orbitron text-white text-[10px] font-semibold mb-1">{rc.title}</h4>
                    <p className="font-inter text-gray-400 text-[9px] leading-relaxed line-clamp-2">{rc.description}</p>
                    <div className="flex items-center gap-1 text-[#00d4ff] text-[9px] font-inter mt-2 group-hover:gap-2 transition-all duration-300">
                      <span>View Course</span><ArrowRight size={9} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: '#060606' }}>
        <div className="absolute inset-0 grid-tex opacity-20" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="p-10 md:p-14 border border-[#00d4ff]/15 bg-[#00d4ff]/3"
            style={{ clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))' }}>
            <span className="section-label block mb-4">Take the Next Step</span>
            <h2 className="font-orbitron text-white font-black mb-4" style={{ fontSize: 'clamp(22px, 4vw, 42px)' }}>
              Ready to Start Your<br />
              <span className="text-glow" style={{ color: '#00d4ff' }}>{course.title.split('(')[0].trim()}</span> Journey?
            </h2>
            <p className="font-inter text-gray-400 text-sm max-w-2xl mx-auto mb-8 leading-relaxed">
              Limited batch sizes ensure personalized attention. Expert instructors with real-world experience.
              Placement assistance for certified courses. Enroll now and transform your career.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="neon-btn">
                Enroll Now — Reserve Your Spot <ArrowRight size={13} />
              </Link>
              <a href="tel:+917448800997" className="neon-btn-ghost flex items-center gap-2">
                <Phone size={13} /> Call +91 74488 00997
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
