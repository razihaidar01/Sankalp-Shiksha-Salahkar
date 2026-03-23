import { useState } from "react";
import { submitContactForm, isSupabaseReady } from "@/lib/supabase";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import { colleges } from "@/data/colleges";
import {
  Phone, Mail, MapPin, Globe, Send, CheckCircle2,
  Clock, MessageCircle, Users, Building2, ChevronDown
} from "lucide-react";

const courses = [
  "B.Tech / Engineering", "BBA", "BCA", "MBA", "MCA",
  "B.Pharma / D.Pharma", "LLB / BA.LLB", "B.Ed",
  "B.Sc Nursing / GNM / ANM", "Diploma / Polytechnic",
  "B.Com", "B.Sc Agriculture", "BPT / Physiotherapy",
  "BHMCT / Hotel Management", "Other",
];

const offices = [
  { city:"Raxaul", state:"Bihar (HQ)", phone:"+91 9142082026" },
  { city:"Patna", state:"Bihar", phone:"+91 9470045035" },
  { city:"Motihari", state:"Bihar", phone:"+91 9153987424" },
  { city:"Bettiah", state:"Bihar", phone:"+91 9153987422" },
  { city:"Delhi", state:"NCR", phone:"+91 9142082026" },
  { city:"Gopalganj", state:"Bihar", phone:"+91 9142082026" },
  { city:"Saharsa", state:"Bihar", phone:"+91 9142082026" },
  { city:"Katihar", state:"Bihar", phone:"+91 9142082026" },
  { city:"Madhepura", state:"Bihar", phone:"+91 9142082026" },
];

type FormState = {
  name: string; phone: string; email: string;
  city: string; course: string; college: string;
  class12Marks: string; message: string;
};

const Contact = () => {
  const [form, setForm] = useState<FormState>({
    name:"", phone:"", email:"", city:"",
    course:"", college:"", class12Marks:"", message:"",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Valid 10-digit phone required";
    if (!form.course) e.course = "Please select a course";
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await submitContactForm({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        city: form.city || undefined,
        course: form.course,
        college_preference: form.college || undefined,
        class12_marks: form.class12Marks || undefined,
        message: form.message || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Supabase error:", err);
      // Still show success to user — don't block on DB errors
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
    setForm({ name:"", phone:"", email:"", city:"", course:"", college:"", class12Marks:"", message:"" });
    setTimeout(() => setSubmitted(false), 6000);
  };

  const inputClass = (field: keyof FormState) =>
    `w-full px-4 py-3 rounded-xl text-sm text-foreground outline-none transition-all duration-200 border ${
      errors[field]
        ? "bg-red-50 border-red-300 focus:ring-2 focus:ring-red-200"
        : "bg-muted border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
    }`;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-[#0a0f2e] overflow-hidden">
        <div className="absolute inset-0"
          style={{ background:"radial-gradient(ellipse 80% 60% at 30% 50%, hsla(235,85%,60%,0.2), transparent)" }} />
        <div className="absolute inset-0"
          style={{ background:"radial-gradient(ellipse 60% 60% at 80% 50%, hsla(27,100%,55%,0.12), transparent)" }} />
        <div className="relative container-narrow px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <span className="inline-block text-xs font-bold text-accent uppercase tracking-widest mb-4">Talk To Us</span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.03] mb-5">
              Get In <span className="hero-gradient-text">Touch</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed mb-10">
              Ready to start your education journey? Fill the form and our counselor will call you within 24 hours — completely free.
            </p>
            {/* Quick contact pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon:<Phone size={14}/>, text:"+91 9142082026", href:"tel:+919142082026" },
                { icon:<MessageCircle size={14}/>, text:"WhatsApp Us", href:"https://wa.me/919142082026" },
                { icon:<Mail size={14}/>, text:"Email Us", href:"mailto:md.sankalpshikshasalahkar@gmail.com" },
              ].map((item, i) => (
                <a key={i} href={item.href} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/8 text-white/80 text-sm font-medium hover:bg-white/15 transition-colors">
                  {item.icon} {item.text}
                </a>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Form — 3 cols */}
            <ScrollReveal className="lg:col-span-3">
              <div className="glass-card rounded-3xl p-6 sm:p-8">
                <div className="mb-7">
                  <h2 className="text-2xl font-black text-foreground mb-1">Book Free Counseling</h2>
                  <p className="text-muted-foreground text-sm">Fill in your details and we'll get back to you within 24 hours.</p>
                </div>

                {submitted ? (
                  <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                    className="py-14 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-2">Message Sent! 🎉</h3>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                      Our counselor will contact you within 24 hours. You can also call us directly at <span className="text-primary font-semibold">+91 9142082026</span>
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Row 1 */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1.5">Full Name *</label>
                        <input name="name" value={form.name} onChange={handleChange}
                          className={inputClass("name")} placeholder="Your full name" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1.5">Phone Number *</label>
                        <input name="phone" value={form.phone} onChange={handleChange}
                          className={inputClass("phone")} placeholder="10-digit mobile number" maxLength={10} />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1.5">Email Address</label>
                        <input name="email" value={form.email} onChange={handleChange} type="email"
                          className={inputClass("email")} placeholder="your@email.com" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1.5">Your City</label>
                        <input name="city" value={form.city} onChange={handleChange}
                          className={inputClass("city")} placeholder="e.g. Motihari, Patna" />
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1.5">Course Interested In *</label>
                        <div className="relative">
                          <select name="course" value={form.course} onChange={handleChange}
                            className={`${inputClass("course")} appearance-none pr-8`}>
                            <option value="">Select a course</option>
                            {courses.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                        {errors.course && <p className="text-red-500 text-xs mt-1">{errors.course}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground mb-1.5">College Preference</label>
                        <div className="relative">
                          <select name="college" value={form.college} onChange={handleChange}
                            className={`${inputClass("college")} appearance-none pr-8`}>
                            <option value="">Any / Not sure yet</option>
                            {colleges.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Row 4 */}
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">12th Marks % (Optional)</label>
                      <input name="class12Marks" value={form.class12Marks} onChange={handleChange}
                        className={inputClass("class12Marks")} placeholder="e.g. 75%" />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1.5">Message / Question</label>
                      <textarea name="message" value={form.message} onChange={handleChange}
                        rows={4} className={`${inputClass("message")} resize-none`}
                        placeholder="Tell us about your requirements, budget, or any specific questions..." />
                    </div>

                    {/* Bihar Credit Card checkbox */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/5 border border-accent/15">
                      <div className="w-5 h-5 rounded-md bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={13} className="text-accent" />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        I may be eligible for <span className="text-accent font-bold">Bihar Student Credit Card (₹4 Lakh)</span>.
                        Please help me with the application process too.
                      </p>
                    </div>

                    <button type="submit" disabled={loading}
                      className="btn-glow w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-accent text-accent-foreground font-bold text-sm shadow-xl shadow-accent/25 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                      {loading ? (
                        <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Sending...</>
                      ) : (
                        <><Send size={16} /> Send Message — Get Free Callback</>
                      )}
                    </button>

                    <p className="text-center text-xs text-muted-foreground">
                      🔒 Your information is 100% private and secure. We never share data.
                    </p>
                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* Sidebar — 2 cols */}
            <div className="lg:col-span-2 space-y-5">
              {/* Contact Info */}
              <ScrollReveal direction="right">
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-base font-black text-foreground mb-5">Contact Details</h3>
                  <div className="space-y-4">
                    {[
                      { icon:<Phone size={15}/>, label:"Call / WhatsApp", value:"+91 9142082026", href:"tel:+919142082026" },
                      { icon:<Phone size={15}/>, label:"Alternate", value:"+91 9470045035", href:"tel:+919470045035" },
                      { icon:<Mail size={15}/>, label:"Email", value:"md.sankalpshikshasalahkar@gmail.com", href:"mailto:md.sankalpshikshasalahkar@gmail.com" },
                      { icon:<Globe size={15}/>, label:"Website", value:"sankalpshikshasalahkar.org.in", href:"https://www.sankalpshikshasalahkar.org.in" },
                      { icon:<MapPin size={15}/>, label:"Head Office", value:"Block Road, Near Hotel President Inn, Raxaul, Bihar 845305", href:"#" },
                    ].map((item, i) => (
                      <a key={i} href={item.href}
                        className="flex items-start gap-3 group hover:text-primary transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 text-primary group-hover:bg-primary/15 transition-colors">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                          <p className="text-sm font-medium text-foreground leading-snug">{item.value}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Timing */}
              <ScrollReveal direction="right" delay={0.1}>
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-base font-black text-foreground mb-4 flex items-center gap-2">
                    <Clock size={16} className="text-accent" /> Working Hours
                  </h3>
                  <div className="space-y-2">
                    {[
                      { day:"Monday – Saturday", time:"9:00 AM – 7:00 PM" },
                      { day:"Sunday", time:"10:00 AM – 4:00 PM" },
                      { day:"WhatsApp / Chat", time:"24 / 7" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <span className="text-sm text-muted-foreground">{item.day}</span>
                        <span className="text-sm font-bold text-foreground">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Why Contact Us */}
              <ScrollReveal direction="right" delay={0.15}>
                <div className="rounded-2xl bg-primary p-6 relative overflow-hidden">
                  <div className="absolute inset-0"
                    style={{ background:"radial-gradient(ellipse at 80% 20%, hsla(27,100%,55%,0.2), transparent)" }} />
                  <div className="relative">
                    <h3 className="text-base font-black text-white mb-4">Why Talk to Us?</h3>
                    <div className="space-y-3">
                      {[
                        { icon:<Users size={14}/>, text:"Expert counselors with 7+ years experience" },
                        { icon:<Building2 size={14}/>, text:"Direct contacts at 24+ colleges" },
                        { icon:<CheckCircle2 size={14}/>, text:"100% free — no commission, no hidden charges" },
                        { icon:<Clock size={14}/>, text:"Response within 24 hours guaranteed" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="text-accent mt-0.5 shrink-0">{item.icon}</div>
                          <p className="text-white/75 text-xs leading-relaxed">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="section-padding" style={{ background:"var(--hero-gradient)" }}>
        <div className="container-narrow">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-accent uppercase tracking-widest">Locations</span>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground mt-3 mb-3">
                Our <span className="gradient-text">Office Locations</span>
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Visit us at any of our offices across Bihar and beyond. Walk-ins welcome!
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {offices.map((office, i) => (
              <ScrollReveal key={i} delay={i * 0.07}>
                <div className={`glass-card gradient-border rounded-2xl p-5 flex items-start gap-4 ${i === 0 ? "ring-2 ring-accent/30 ring-offset-2" : ""}`}>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-foreground">{office.city}</p>
                      {i === 0 && <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[9px] font-bold">HQ</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{office.state}</p>
                    <a href={`tel:${office.phone.replace(/\s/g,"")}`}
                      className="text-xs text-primary font-semibold hover:text-accent transition-colors mt-1 block">
                      {office.phone}
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-72 sm:h-96 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28536.36!2d84.84!3d26.76!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39935e4e6e5e6e6d%3A0x9e5e5e5e5e5e5e5e!2sRaxaul%2C+Bihar!5e0!3m2!1sen!2sin!4v1"
          width="100%" height="100%"
          style={{ border:0, display:"block" }}
          allowFullScreen loading="lazy"
          title="Sankalp Shiksha Salahkar — Raxaul, Bihar" />
      </section>
    </>
  );
};

export default Contact;
