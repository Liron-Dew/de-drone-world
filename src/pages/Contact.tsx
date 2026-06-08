import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle, ArrowRight, Facebook, Instagram, Linkedin, Youtube, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({name:'',email:'',phone:'',service:'',message:''});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = (e: React.FormEvent) => { e.preventDefault(); setBusy(true); setTimeout(() => { setBusy(false); setSent(true); }, 1500); };
  const services = ['Drone Pilot Training (DGCA)','DGCA Certification Course','Agriculture Drone Course','Technician Course','Aerial Cinematography','3D Mapping & Survey','Agriculture Solutions','Industrial Inspection','Surveillance & Security','Drone Manufacturing'];

  return (
    <div className="pt-28 pb-20 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-label">Get In Touch</span>
          <h1 className="section-title">Contact Us</h1>
          <div className="glow-line"/>
          <p className="font-inter text-gray-400 text-sm max-w-md mx-auto leading-relaxed">Enroll in a training program or inquire about our services. We respond within 24 hours.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="font-orbitron text-white text-xs font-semibold mb-5">Contact Information</h3>
              <div className="space-y-4">
                {[
                  [Phone, 'Phone', '+91 74488 00997', 'tel:+917448800997'],
                  [Mail, 'Email', 'md@thedroneworld.in', 'mailto:md@thedroneworld.in'],
                  [MapPin, 'Address', 'Coimbatore, Tamil Nadu, India', null],
                  [Clock, 'Hours', 'Mon–Sat: 10AM – 5PM', null],
                ].map(([I, label, val, href]) => {
                  const Icon = I as React.ElementType;
                  return (
                    <div key={label as string} className="flex items-start gap-4">
                      <div className="w-8 h-8 flex items-center justify-center border border-[#00d4ff]/30 bg-[#00d4ff]/5 flex-shrink-0 mt-0.5">
                        <Icon size={12} className="text-[#00d4ff]"/>
                      </div>
                      <div>
                        <div className="font-inter text-gray-500 text-[10px] uppercase tracking-wider">{label as string}</div>
                        {href ? <a href={href as string} className="font-inter text-gray-200 text-sm mt-0.5 hover:text-[#00d4ff] transition-colors block">{val as string}</a>
                          : <div className="font-inter text-gray-200 text-sm mt-0.5">{val as string}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="font-orbitron text-white text-xs font-semibold mb-3">Training Centers</h3>
              <div className="space-y-2">
                {['Coimbatore, Tamil Nadu','Madurai, Tamil Nadu'].map(loc => (
                  <div key={loc} className="flex items-center gap-3 p-3 border border-gray-800/50">
                    <MapPin size={11} className="text-[#00d4ff] flex-shrink-0"/>
                    <span className="font-inter text-gray-300 text-xs">{loc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-orbitron text-white text-xs font-semibold mb-3">Follow Us</h3>
              <div className="flex gap-3">
                {[[Facebook,'Facebook'],[Instagram,'Instagram'],[Linkedin,'LinkedIn'],[Youtube,'YouTube'],[MessageCircle,'WhatsApp']].map(([I,label]) => {
                  const Icon = I as React.ElementType;
                  return (
                    <a key={label as string} href="#" title={label as string} className="w-9 h-9 flex items-center justify-center border border-gray-700 hover:border-[#00d4ff] hover:bg-[#00d4ff]/10 text-gray-400 hover:text-[#00d4ff] transition-all duration-300">
                      <Icon size={14}/>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center p-12 border border-[#00d4ff]/20 bg-[#00d4ff]/3 min-h-[400px]" style={{clipPath:'polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,0 100%)'}}>
                <CheckCircle size={44} className="text-[#00d4ff] mb-4"/>
                <h3 className="font-orbitron text-white text-lg font-bold mb-2">Enquiry Sent!</h3>
                <p className="font-inter text-gray-300 text-sm">Our team will contact you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="neon-btn-ghost mt-6 text-[10px] px-5 py-3">Send Another</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-inter text-gray-400 text-[10px] tracking-wider uppercase block mb-2">Full Name *</label>
                    <input type="text" required placeholder="Your name" className="form-field" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="font-inter text-gray-400 text-[10px] tracking-wider uppercase block mb-2">Email *</label>
                    <input type="email" required placeholder="your@email.com" className="form-field" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))}/>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-inter text-gray-400 text-[10px] tracking-wider uppercase block mb-2">Phone *</label>
                    <input type="tel" required placeholder="+91 XXXXX XXXXX" className="form-field" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="font-inter text-gray-400 text-[10px] tracking-wider uppercase block mb-2">Interested In *</label>
                    <select required className="form-field" value={form.service} onChange={e => setForm(f=>({...f,service:e.target.value}))}>
                      <option value="">Select program / service</option>
                      {services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-inter text-gray-400 text-[10px] tracking-wider uppercase block mb-2">Message</label>
                  <textarea rows={5} placeholder="Tell us your requirements, preferred dates, or any questions..." className="form-field resize-none" value={form.message} onChange={e => setForm(f=>({...f,message:e.target.value}))}/>
                </div>
                <button type="submit" disabled={busy} className="neon-btn w-full disabled:opacity-60 disabled:cursor-not-allowed">
                  {busy ? 'Sending...' : <><ArrowRight size={13}/>Submit Enquiry</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
