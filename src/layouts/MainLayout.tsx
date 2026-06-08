import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Menu, X, ChevronDown, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

// ── Exact menu structure from the original site ─────────────────────────────
const TRAINING_MENU = [
  {
    category: 'DGCA Courses',
    items: [
      { label: 'Small RPC (5 Days)', path: '/training/small-rpc' },
      { label: 'Medium RPC (7 Days)', path: '/training/medium-rpc' },
      { label: 'Small + Medium RPC (10 Days)', path: '/training/small-and-medium-rpc' },
      { label: 'Inspector Development Course', path: '/training/inspector-development-course' },
    ],
  },
  {
    category: 'Skill Program',
    items: [
      { label: 'Aerial Mapping and Surveying', path: '/training/aerial-mapping-and-surveying' },
      { label: 'FPV Flying', path: '/training/fpv-flying' },
      { label: 'Agri Drone (Spray & Precision Agriculture)', path: '/training/agri-drone-spray-and-precision-agriculture' },
      { label: 'Aerial Videography and Photography', path: '/training/aerial-videography-and-photography' },
      { label: 'Drone Basics', path: '/training/drone-basics' },
      { label: 'GIS for Drone Data Processing', path: '/training/gis-for-drone-data-processing' },
      { label: 'Drone Repair and Maintenance', path: '/training/drone-repair-and-maintenance' },
      { label: 'Python for GIS', path: '/training/python-for-gis' },
      { label: 'LiDAR & GIS', path: '/training/lidar-and-gis' },
    ],
  },
  {
    category: 'Drone Workshops',
    items: [
      { label: 'Build Your Own Drone', path: '/training/build-your-own-drone' },
      { label: 'Build Your Racing Drone', path: '/training/build-your-racing-drone' },
      { label: 'Build Your Own Agri Drone', path: '/training/build-your-own-agri-drone' },
      { label: 'Drone Customization', path: '/training/drone-customization' },
    ],
  },
  {
    category: 'Diploma Courses',
    items: [
      { label: 'Advanced Diploma (6 Months)', path: '/training/drone-technician-6-months' },
    ],
  },
  {
    category: 'Internships',
    items: [
      { label: '7 Days Internship', path: '/training/7-days' },
      { label: '15 Days Internship', path: '/training/15-days' },
      { label: '30 Days Internship', path: '/training/30-days' },
    ],
  },
];

const SERVICES_MENU = [
  {
    category: 'Agriculture',
    basePath: '/services/agriculture',
    items: [
      'Fertilizer Spraying',
      'Seed Sowing',
      'Crop Monitoring',
      'Precision Agriculture Using Drones',
    ],
  },
  {
    category: 'Events',
    basePath: '/services/events',
    items: [
      'Drone Videography & Photography',
      'Drone Flower Showering',
      'Flag Towing',
      'Drone Light Show',
      'Drone LED Panel Advertisement',
    ],
  },
  {
    category: 'Inspection',
    basePath: '/services/inspection',
    items: [
      'Windmill Inspection',
      'Solar Panel Inspection',
      'Power Line Inspection',
      'Drone Thermography',
      'Construction Inspection',
      'Pipeline Inspection',
    ],
  },
  {
    category: 'Survey & Mapping',
    basePath: '/services/survey-mapping',
    items: [
      'Land Surveying',
      'Construction & Infrastructure Mapping',
      '3D Mapping & Modeling',
      'GIS & Data Analysis',
      'Mining & Stockpile Analysis',
    ],
  },
];

export default function MainLayout() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [trainOpen, setTrainOpen] = useState(false);
  const [servOpen, setServOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-white overflow-x-hidden min-h-screen">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'nav-scrolled' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-20">
          <Link to="/" className="flex-shrink-0">
            <img src="/assets/logo.png" alt="De Drone World" className="h-16 w-auto" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden xl:flex items-center gap-1">
            <Link to="/" className="relative text-sm tracking-widest uppercase text-gray-300 hover:text-[#00d4ff] font-inter font-medium transition-colors duration-300 group px-4 py-2">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00d4ff] group-hover:w-full transition-all duration-300" />
            </Link>

            {/* Training Mega Dropdown */}
            <div className="relative" onMouseEnter={() => setTrainOpen(true)} onMouseLeave={() => { setTrainOpen(false); }}>
              <button className="flex items-center gap-1 relative text-sm tracking-widest uppercase text-gray-300 hover:text-[#00d4ff] font-inter font-medium transition-colors duration-300 px-4 py-2">
                Training <ChevronDown size={12} className="transition-transform duration-200 group-hover/item:rotate-180" style={{ transform: trainOpen ? 'rotate(180deg)' : '' }} />
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00d4ff] transition-all duration-300" style={{ width: trainOpen ? '100%' : '0' }} />
              </button>
              {trainOpen && (
                <div className="absolute top-full left-0 bg-[#111] border border-[#00d4ff]/20 py-4 shadow-2xl min-w-[600px]" style={{ clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)' }}>
                  <div className="grid grid-cols-3 gap-4 px-4">
                    {TRAINING_MENU.map(group => (
                      <div key={group.category}>
                        <p className="font-orbitron text-[#00d4ff] text-[10px] tracking-[.2em] uppercase mb-2 pb-1 border-b border-[#00d4ff]/20">{group.category}</p>
                        <div className="flex flex-col gap-0.5">
                          {group.items.map(item => (
                            <Link key={item.path} to={item.path} className="text-gray-400 hover:text-[#00d4ff] text-xs font-inter py-1 px-1 hover:bg-[#00d4ff]/5 transition-colors rounded" onClick={() => { setTrainOpen(false); setOpen(false); }}>
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Services Mega Dropdown */}
            <div className="relative" onMouseEnter={() => setServOpen(true)} onMouseLeave={() => { setServOpen(false); }}>
              <button className="flex items-center gap-1 relative text-sm tracking-widest uppercase text-gray-300 hover:text-[#00d4ff] font-inter font-medium transition-colors duration-300 px-4 py-2">
                Services <ChevronDown size={12} className="transition-transform duration-200" style={{ transform: servOpen ? 'rotate(180deg)' : '' }} />
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00d4ff] transition-all duration-300" style={{ width: servOpen ? '100%' : '0' }} />
              </button>
              {servOpen && (
                <div className="absolute top-full left-0 bg-[#111] border border-[#00d4ff]/20 py-4 shadow-2xl min-w-[700px]" style={{ clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)' }}>
                  <div className="grid grid-cols-4 gap-4 px-4">
                    {SERVICES_MENU.map(group => (
                      <div key={group.category}>
                        <Link to={group.basePath} className="font-orbitron text-[#00d4ff] text-[10px] tracking-[.2em] uppercase mb-2 pb-1 border-b border-[#00d4ff]/20 block hover:text-white transition-colors" onClick={() => { setServOpen(false); setOpen(false); }}>
                          {group.category}
                        </Link>
                        <div className="flex flex-col gap-0.5">
                          {group.items.map(item => (
                            <Link key={item} to={group.basePath} className="text-gray-400 hover:text-[#00d4ff] text-xs font-inter py-1 px-1 hover:bg-[#00d4ff]/5 transition-colors rounded" onClick={() => { setServOpen(false); setOpen(false); }}>
                              {item}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/manufacturing" className="relative text-sm tracking-widest uppercase text-gray-300 hover:text-[#00d4ff] font-inter font-medium transition-colors duration-300 group px-4 py-2">
              Manufacturing
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00d4ff] group-hover:w-full transition-all duration-300" />
            </Link>

            <Link to="/contact" className="relative text-sm tracking-widest uppercase text-gray-300 hover:text-[#00d4ff] font-inter font-medium transition-colors duration-300 group px-4 py-2">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00d4ff] group-hover:w-full transition-all duration-300" />
            </Link>

            <Link to="/contact" className="neon-btn text-xs px-6 py-3 flex-shrink-0 ml-2">Enroll Now</Link>
          </div>

          {/* Mobile Hamburger */}
          <button className="xl:hidden text-white p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="xl:hidden border-t border-[#00d4ff]/10 max-h-[85vh] overflow-y-auto" style={{ background: 'rgba(10,10,10,.98)', backdropFilter: 'blur(20px)' }}>
            <div className="px-6 py-5 flex flex-col gap-3">
              <Link to="/" className="text-gray-200 hover:text-[#00d4ff] text-sm tracking-widest uppercase font-inter font-medium transition-colors" onClick={() => setOpen(false)}>Home</Link>

              <div className="text-gray-200 text-sm tracking-widest uppercase font-inter font-medium mt-2">Training</div>
              <div className="pl-4 border-l border-[#00d4ff]/20 space-y-3 mb-2">
                {TRAINING_MENU.map(group => (
                  <div key={group.category}>
                    <p className="font-orbitron text-[#00d4ff] text-[9px] tracking-[.2em] uppercase mb-1">{group.category}</p>
                    <div className="pl-3 flex flex-col gap-1 mb-2">
                      {group.items.map(item => (
                        <Link key={item.path} to={item.path} className="text-gray-400 hover:text-[#00d4ff] text-xs font-inter transition-colors" onClick={() => setOpen(false)}>{item.label}</Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-gray-200 text-sm tracking-widest uppercase font-inter font-medium mt-1">Services</div>
              <div className="pl-4 border-l border-[#00d4ff]/20 space-y-3 mb-2">
                {SERVICES_MENU.map(group => (
                  <div key={group.category}>
                    <Link to={group.basePath} className="font-orbitron text-[#00d4ff] text-[9px] tracking-[.2em] uppercase mb-1 block" onClick={() => setOpen(false)}>{group.category}</Link>
                    <div className="pl-3 flex flex-col gap-1 mb-2">
                      {group.items.map(item => (
                        <Link key={item} to={group.basePath} className="text-gray-400 hover:text-[#00d4ff] text-xs font-inter transition-colors" onClick={() => setOpen(false)}>{item}</Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/manufacturing" className="text-gray-200 hover:text-[#00d4ff] text-sm tracking-widest uppercase font-inter font-medium transition-colors" onClick={() => setOpen(false)}>Manufacturing</Link>
              <Link to="/contact" className="text-gray-200 hover:text-[#00d4ff] text-sm tracking-widest uppercase font-inter font-medium transition-colors" onClick={() => setOpen(false)}>Contact</Link>
              <Link to="/contact" className="neon-btn text-xs mt-2 w-full text-center" onClick={() => setOpen(false)}>Enroll Now</Link>
            </div>
          </div>
        )}
      </nav>

      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#111] border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-2">
              <Link to="/" className="inline-flex items-center gap-3 mb-4">
                <img src="/assets/logo.png" alt="De Drone World" className="h-10 w-auto" />
              </Link>
              <p className="font-inter text-gray-400 text-sm leading-relaxed max-w-xs mb-2">We invest & innovate to transform the way drones are made & utilized to bring positive and lasting change in human lives.</p>
              <p className="font-inter text-gray-500 text-xs mb-5">De Drone World Solutions Pvt Ltd</p>
              <div className="flex gap-3">
                {([['Facebook',Facebook],['Instagram',Instagram],['LinkedIn',Linkedin],['YouTube',Youtube]] as const).map(([label,Icon]) => (
                  <a key={label} href="#" title={label} className="w-9 h-9 flex items-center justify-center border border-gray-700 hover:border-[#00d4ff] hover:bg-[#00d4ff]/10 text-gray-500 hover:text-[#00d4ff] transition-all duration-300"><Icon size={15}/></a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-orbitron text-white text-xs font-semibold tracking-widest uppercase mb-5">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  ['/', 'Home'],
                  ['/training', 'Training'],
                  ['/services', 'Services'],
                  ['/manufacturing', 'Manufacturing'],
                  ['/contact', 'Contact'],
                ].map(([path, label]) => (
                  <li key={path}>
                    <Link to={path} className="font-inter text-gray-400 hover:text-[#00d4ff] text-sm transition-colors duration-300 flex items-center gap-2 group">
                      <span className="w-3 h-px bg-gray-700 group-hover:bg-[#00d4ff] group-hover:w-5 transition-all duration-300" />{label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-orbitron text-white text-xs font-semibold tracking-widest uppercase mb-5">Contact Info</h4>
              <ul className="space-y-3 text-gray-400 text-sm font-inter">
                <li>Hindusthan Engineering College Campus, Malumichampatti, Coimbatore – 641028</li>
                <li>+91 6382405660 / +91 7708757581</li>
                <li>md@thedroneworld.in</li>
                <li>Mon–Sat: 9AM – 6PM</li>
              </ul>
            </div>
          </div>
          <div className="py-5 border-t border-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-inter text-gray-500 text-xs">© 2025 De Drone World Solutions Pvt Ltd. All rights reserved.</p>
            <div className="flex gap-5">
              {['Privacy Policy', 'Terms of Service'].map(l => (
                <a key={l} href="#" className="font-inter text-gray-500 hover:text-[#00d4ff] text-xs transition-colors duration-300">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
