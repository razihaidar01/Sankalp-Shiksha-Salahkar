import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { colleges, recruiters } from "@/data/colleges";
import {
  GraduationCap, CreditCard, Compass, Award,
  ArrowRight, ChevronDown, MapPin, CheckCircle2,
  Users, Building2, Star, TrendingUp, Phone
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo.png";
import { getGalleryPhotos, isSupabaseReady } from "@/lib/supabase";

/* ─── Animated Counter ─── */
const Counter = ({ end, suffix = "" }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true;
        const duration = 2000;
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          setCount(Math.floor(eased * end));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return <div ref={ref} className="stat-counter">{count}{suffix}</div>;
};

/* ─── Hero ─── */
const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Parallax BG */}
      <motion.div style={{ y }} className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover scale-110" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f2e]/95 via-[#0a0f2e]/80 to-[#0a0f2e]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f2e]/60 via-transparent to-transparent" />
      </motion.div>

      {/* Floating orbs */}
      <motion.div className="absolute top-1/4 right-[15%] w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsla(235,85%,60%,0.15) 0%, transparent 70%)" }}
        animate={{ scale: [1,1.4,1], x:[0,30,0], y:[0,-30,0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-1/3 right-[30%] w-56 h-56 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsla(27,100%,55%,0.12) 0%, transparent 70%)" }}
        animate={{ scale: [1,1.3,1], x:[0,-20,0], y:[0,20,0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} />

      <motion.div style={{ opacity }} className="relative w-full container-narrow px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm text-white/80 text-xs font-semibold mb-7 tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Trusted by 5000+ Students Across India
          </motion.div>

          {/* Logo */}
          <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.6, delay:0.1 }}>
            <img src={logo} alt="SSS" className="w-16 h-16 object-contain mb-5 drop-shadow-2xl" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity:0, y:40, filter:"blur(10px)" }}
            animate={{ opacity:1, y:0, filter:"blur(0px)" }}
            transition={{ duration:1, delay:0.2, ease:[0.16,1,0.3,1] }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.02] text-white"
          >
            Unlock Your<br />
            <span className="hero-gradient-text">Potential</span><br />
            Through Education
          </motion.h1>

          <motion.p
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7, delay:0.4 }}
            className="mt-6 text-base sm:text-lg text-white/65 max-w-xl leading-relaxed"
          >
            Sankalp Shiksha Salahkar — Bihar's most trusted education consultancy. 
            We connect students to 24+ top colleges, manage Bihar Student Credit Card, 
            and guide you to the right career.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7, delay:0.55 }}
            className="mt-10 flex flex-wrap gap-4">
            <Link to="/colleges"
              className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-white text-[#0a0f2e] font-bold text-sm shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:-translate-y-1">
              Explore Colleges
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact"
              className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-transparent border-2 border-white/30 text-white font-bold text-sm backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
              <Phone size={16} />
              Talk to Counselor
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9, duration:0.6 }}
            className="mt-14 flex flex-wrap gap-5">
            {[
              { icon: "🏆", text: "NAAC A++ Partner Colleges" },
              { icon: "💳", text: "Bihar Credit Card Accepted" },
              { icon: "🆓", text: "Free Counseling" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-white/60 text-xs font-medium">
                <span>{b.icon}</span> {b.text}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/40"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.5 }}>
        <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <motion.div animate={{ y:[0,7,0] }} transition={{ duration:1.5, repeat:Infinity }}>
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ─── Marquee ─── */
const Marquee = () => {
  const items = ["YOUR DREAMS. OUR GUIDANCE.", "24+ COLLEGES ACROSS INDIA.", "BIHAR STUDENT CREDIT CARD ACCEPTED.", "ADMISSIONS. SCHOLARSHIPS. CAREERS.", "FREE COUNSELING. ALWAYS."];
  const repeated = [...items, ...items, ...items];
  return (
    <section className="py-4 bg-accent overflow-hidden">
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span key={i} className="text-xs sm:text-sm font-black text-white whitespace-nowrap mx-6 tracking-[0.15em] uppercase">
            {item}<span className="mx-6 opacity-50">◆</span>
          </span>
        ))}
      </div>
    </section>
  );
};

/* ─── Stats ─── */
const Stats = () => (
  <section className="py-20 bg-[#0a0f2e] relative overflow-hidden">
    <div className="absolute inset-0 opacity-30"
      style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, hsla(235,85%,60%,0.3), transparent)" }} />
    <div className="relative container-narrow px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
        {[
          { end:24, suffix:"+", label:"Partner Colleges", icon:<Building2 size={20}/> },
          { end:10, suffix:"+", label:"States Covered", icon:<MapPin size={20}/> },
          { end:5000, suffix:"+", label:"Students Guided", icon:<Users size={20}/> },
          { end:100, suffix:"+", label:"Company Recruiters", icon:<TrendingUp size={20}/> },
          { end:7, suffix:"+", label:"Years Experience", icon:<Star size={20}/> },
        ].map((stat, i) => (
          <ScrollReveal key={i} delay={i * 0.09} className="text-center">
            <div className="text-accent/60 flex justify-center mb-2">{stat.icon}</div>
            <div className="text-4xl sm:text-5xl font-black text-white mb-1">
              <Counter end={stat.end} suffix={stat.suffix} />
            </div>
            <p className="text-sm text-white/50 font-medium">{stat.label}</p>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

/* ─── About / Mission ─── */
const About = () => (
  <section className="section-padding bg-background">
    <div className="container-narrow">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <ScrollReveal direction="left">
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 blur-2xl" />
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 flex flex-col items-center justify-center gap-6 p-10 border border-border">
              <img src={logo} alt="SSS" className="w-28 h-28 object-contain drop-shadow-xl" />
              <div className="text-center">
                <p className="text-2xl font-black text-foreground">संकल्प शिक्षा सलाहकार</p>
                <p className="text-muted-foreground text-sm mt-1">Founded by Sh. Amit Kumar Upadhyay</p>
              </div>
              <div className="flex gap-3 flex-wrap justify-center">
                {["Raxaul HQ","Patna","Delhi","Motihari"].map(c => (
                  <span key={c} className="px-3 py-1 rounded-full bg-primary/8 text-primary text-xs font-semibold border border-primary/15">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <span className="inline-block text-xs font-bold text-accent uppercase tracking-widest mb-4">About Us</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground leading-tight mb-6">
            Bihar's Most Trusted <span className="gradient-text">Education Partner</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Founded by <strong className="text-foreground">Sh. Amit Kumar Upadhyay</strong>, former Deputy Manager at NIMS University Jaipur, 
            Sankalp Shiksha Salahkar has been transforming student futures since 2017. We bridge the gap between ambitious students and quality education across India.
          </p>
          <ul className="space-y-3 mb-8">
            {[
              "24/7 career guidance and admission support",
              "Bihar Student Credit Card processing — FREE",
              "Direct tie-ups with 24+ NAAC accredited colleges",
              "Scholarship identification and application help",
              "Offices in 10+ cities across Bihar and beyond",
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                {point}
              </li>
            ))}
          </ul>
          <Link to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm btn-glow shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform">
            Book Free Counseling <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

/* ─── Services ─── */
const ServicesPreview = () => {
  const services = [
    { icon: GraduationCap, title: "College Admissions", desc: "End-to-end guidance for 24+ partner colleges — application, documentation, seat confirmation.", tag: "Most Popular", color: "from-blue-500 to-blue-700" },
    { icon: CreditCard, title: "Bihar Student Credit Card", desc: "Complete free assistance with Bihar BSCC scheme — documents, application, bank follow-up.", tag: "Free Service", color: "from-green-500 to-green-700" },
    { icon: Compass, title: "Career Counseling", desc: "Aptitude-based career path guidance for students after 10th and 12th in all streams.", tag: "Expert Led", color: "from-purple-500 to-purple-700" },
    { icon: Award, title: "Scholarship Guidance", desc: "Access state & national scholarships. We identify, apply, and follow up on your behalf.", tag: "Save Money", color: "from-orange-500 to-orange-700" },
  ];
  return (
    <section className="section-padding" style={{ background: "var(--hero-gradient)" }}>
      <div className="container-narrow">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-accent uppercase tracking-widest">What We Do</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mt-3 mb-4">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From finding the right college to securing financial aid — we handle it all so you can focus on your future.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="glass-card gradient-border rounded-2xl p-6 h-full group relative overflow-hidden">
                <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${s.color}`}>{s.tag}</div>
                <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <s.icon size={22} className="text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal className="mt-10 text-center">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent transition-colors">
            Explore All Services <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

/* ─── Featured Colleges ─── */
const FeaturedColleges = () => {
  const featured = colleges.slice(0, 8);
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-accent uppercase tracking-widest">Our Network</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mt-2">
                Top <span className="gradient-text">Partner Colleges</span>
              </h2>
            </div>
            <Link to="/colleges" className="hidden sm:flex items-center gap-2 text-sm font-bold text-primary hover:text-accent transition-colors">
              View All 24 <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((college, i) => (
            <ScrollReveal key={college.id} delay={Math.min(i * 0.06, 0.35)}>
              <div className="glass-card gradient-border rounded-2xl p-5 h-full flex flex-col group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                    <Building2 size={18} className="text-primary" />
                  </div>
                  {college.naac && (
                    <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black">NAAC {college.naac}</span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-foreground leading-tight mb-1">{college.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                  <MapPin size={11} /> {college.location}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {college.courses.slice(0,2).map((c,j) => (
                    <span key={j} className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px]">{c}</span>
                  ))}
                </div>
                <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-sm font-black text-accent">From {college.feeLabel}</span>
                  {college.creditCard && <CreditCard size={13} className="text-primary/60" />}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-8 text-center">
          <Link to="/colleges"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm btn-glow shadow-lg shadow-primary/20">
            View All 24 Colleges <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

/* ─── Why Choose Us ─── */
const WhyUs = () => (
  <section className="section-padding bg-[#0a0f2e] relative overflow-hidden">
    <div className="absolute inset-0 opacity-20"
      style={{ background: "radial-gradient(ellipse 60% 60% at 80% 50%, hsla(27,100%,55%,0.4), transparent)" }} />
    <div className="relative container-narrow">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <ScrollReveal direction="left">
          <span className="text-xs font-bold text-accent uppercase tracking-widest">Why Sankalp</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-3 mb-8 leading-tight">
            We Don't Just Find Colleges.<br />
            <span className="text-accent">We Change Lives.</span>
          </h2>
          <div className="space-y-5">
            {[
              { title:"Free Guidance Always", desc:"No hidden charges. Our counseling, Credit Card help and admission support is 100% free." },
              { title:"Verified College Network", desc:"Every partner college is NAAC accredited with proven placement records." },
              { title:"Bihar-First Approach", desc:"We understand the specific needs of Bihar students — scholarships, BSCC, local language support." },
              { title:"End-to-End Support", desc:"From choosing a course to sitting in class — we're with you every step." },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={16} className="text-accent" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                  <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <div className="grid grid-cols-2 gap-4">
            {[
              { n:"24+", l:"Partner Colleges", icon:<Building2 size={24}/> },
              { n:"100%", l:"Free Service", icon:<Award size={24}/> },
              { n:"5000+", l:"Students Guided", icon:<Users size={24}/> },
              { n:"₹4L", l:"Max Credit Card", icon:<CreditCard size={24}/> },
            ].map((card, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 text-center hover:bg-white/8 transition-colors">
                <div className="text-accent/70 flex justify-center mb-3">{card.icon}</div>
                <div className="text-3xl font-black text-white mb-1">{card.n}</div>
                <div className="text-white/50 text-xs font-medium">{card.l}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

/* ─── Recruiters ─── */
const Recruiters = () => (
  <section className="section-padding" style={{ background: "var(--hero-gradient)" }}>
    <div className="container-narrow">
      <ScrollReveal>
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-accent uppercase tracking-widest">Placement</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mt-3 mb-3">
            Our Students <span className="gradient-text">Work At</span>
          </h2>
          <p className="text-muted-foreground">Top companies recruiting from our partner colleges</p>
        </div>
      </ScrollReveal>
      <ScrollReveal>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {recruiters.map((name, i) => (
            <motion.span key={i} whileHover={{ scale:1.05, y:-2 }}
              className="px-4 py-2 rounded-xl bg-card text-sm font-semibold text-muted-foreground shadow-sm hover:shadow-md hover:text-foreground hover:border-primary/20 border border-border transition-all duration-300 cursor-default">
              {name}
            </motion.span>
          ))}
        </div>
      </ScrollReveal>
    </div>
  </section>
);

/* ─── Gallery ─── */
const Gallery = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [realPhotos, setRealPhotos] = useState<{id:string;image_url:string;title:string;category:string}[]>([]);

  useEffect(() => {
    if (isSupabaseReady) {
      getGalleryPhotos()
        .then(photos => { if (photos && photos.length > 0) setRealPhotos(photos); })
        .catch(() => {});
    }
  }, []);

  const placeholders = [
    { color:"from-blue-500 to-indigo-700", emoji:"🎓", label:"Students at Orientation" },
    { color:"from-orange-400 to-orange-600", emoji:"💬", label:"Career Counseling Session" },
    { color:"from-purple-500 to-purple-700", emoji:"🏫", label:"College Visit – SRM Ghaziabad" },
    { color:"from-green-500 to-emerald-700", emoji:"💳", label:"Bihar Credit Card Camp, Patna" },
    { color:"from-pink-500 to-rose-700", emoji:"🎉", label:"Students Admission Celebration" },
    { color:"from-teal-500 to-cyan-700", emoji:"⭐", label:"Success Stories – Batch 2024" },
    { color:"from-indigo-500 to-blue-700", emoji:"🏛️", label:"Campus Tour – Sandip University" },
    { color:"from-red-500 to-rose-700", emoji:"📋", label:"Annual Counseling Event" },
    { color:"from-yellow-500 to-amber-600", emoji:"👥", label:"Team Sankalp – Motihari Office" },
  ];
  const items = placeholders;
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Gallery</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mt-3 mb-4">
              Our <span className="gradient-text">Moments</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              From counseling sessions to campus visits — glimpses of the journey we share with every student.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {items.map((item, i) => (
            <ScrollReveal key={i} delay={Math.min(i * 0.06, 0.3)}>
              <motion.div whileHover={{ scale:1.02 }} onClick={() => setSelected(i)}
                className={`relative rounded-2xl overflow-hidden cursor-pointer aspect-[4/3] bg-gradient-to-br ${item.color} flex flex-col items-center justify-center shadow-md hover:shadow-xl transition-shadow group`}>
                <span className="text-5xl sm:text-6xl">{item.emoji}</span>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs sm:text-sm font-bold">{item.label}</p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">
          📸 Have photos to add? Send to{" "}
          <a href="mailto:md.sankalpshikshasalahkar@gmail.com" className="text-primary font-medium">md.sankalpshikshasalahkar@gmail.com</a>
        </p>
      </div>
      <AnimatePresence>
        {selected !== null && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
              onClick={e => e.stopPropagation()}
              className={`relative w-full max-w-lg aspect-[4/3] rounded-3xl bg-gradient-to-br ${items[selected].color} flex flex-col items-center justify-center gap-4 shadow-2xl`}>
              <span className="text-8xl">{items[selected].emoji}</span>
              <p className="text-white text-lg font-bold text-center px-8">{items[selected].label}</p>
              <button onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors text-lg">✕</button>
              <div className="flex gap-3">
                <button onClick={() => setSelected(s => s !== null && s > 0 ? s-1 : items.length-1)}
                  className="px-4 py-2 rounded-xl bg-white/20 text-white text-sm font-bold hover:bg-white/30 transition-colors">← Prev</button>
                <button onClick={() => setSelected(s => s !== null && s < items.length-1 ? s+1 : 0)}
                  className="px-4 py-2 rounded-xl bg-white/20 text-white text-sm font-bold hover:bg-white/30 transition-colors">Next →</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* ─── Testimonials ─── */
const Testimonials = () => {
  const [active, setActive] = useState(0);
  const testimonials = [
    { name:"Ravi Kumar", college:"SRM Institute, Ghaziabad", state:"Motihari, Bihar", quote:"Sankalp ne mere admission mein bahut help ki. Puri process free mein karke diya. Aaj main SRM mein B.Tech kar raha hoon!", rating:5 },
    { name:"Priya Sharma", college:"Mewar University, Rajasthan", state:"Patna, Bihar", quote:"Bihar Student Credit Card ke liye itna guidance mila ki koi tension hi nahi hua. Sankalp team bahut helpful hai!", rating:5 },
    { name:"Amit Singh", college:"Tula's Institute, Dehradun", state:"Gopalganj, Bihar", quote:"Career counseling se lekar final admission tak sab kuch handle kiya unho ne. Bina paise ke itna support!", rating:5 },
    { name:"Sunita Kumari", college:"Sandip University, Bihar", state:"Bettiah, Bihar", quote:"Ghar ke paas hi accha college mil gaya. Sankalp Shiksha Salahkar ne sahi guidance di. Bahut shukriya!", rating:5 },
  ];
  useEffect(() => {
    const timer = setInterval(() => setActive(p => (p+1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);
  return (
    <section className="section-padding" style={{ background:"var(--hero-gradient)" }}>
      <div className="container-narrow max-w-4xl">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mt-3">
              Student <span className="gradient-text">Stories</span>
            </h2>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="relative min-h-[220px]">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={false}
                animate={{ opacity:active===i?1:0, y:active===i?0:15 }}
                transition={{ duration:0.5 }}
                className={active===i ? "relative" : "absolute inset-0 pointer-events-none"}>
                <div className="glass-card rounded-3xl p-8 sm:p-10">
                  <div className="flex gap-1 mb-5">
                    {Array(t.rating).fill(0).map((_,j) => <Star key={j} size={16} className="text-accent fill-accent" />)}
                  </div>
                  <p className="text-lg sm:text-xl text-foreground leading-relaxed italic mb-7">"{t.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-base font-black text-primary">
                      {t.name.split(" ").map(n=>n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.college}</p>
                      <p className="text-xs text-accent font-medium">{t.state}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_,i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 ${active===i ? "bg-accent w-8" : "bg-border w-2"}`} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

/* ─── CTA Banner ─── */
const CTABanner = () => (
  <section className="py-20 bg-primary relative overflow-hidden">
    <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse 80% 80% at 50% 50%, hsla(27,100%,55%,0.15), transparent)" }} />
    <div className="relative container-narrow px-4 sm:px-6 lg:px-8 text-center">
      <ScrollReveal>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5">
          Ready to Start Your Journey?
        </h2>
        <p className="text-white/65 max-w-xl mx-auto mb-10 text-lg">
          Get free counseling today. Our experts will guide you to the right college, course, and scholarship — at zero cost.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary font-bold text-sm shadow-2xl hover:-translate-y-1 transition-transform">
            Book Free Counseling <ArrowRight size={16} />
          </Link>
          <a href="tel:+919142082026"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-bold text-sm hover:bg-white/10 hover:-translate-y-1 transition-all">
            <Phone size={16} /> Call Now: +91 91420 82026
          </a>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

/* ─── Page ─── */
const Index = () => (
  <>
    <Hero />
    <Marquee />
    <Stats />
    <About />
    <ServicesPreview />
    <FeaturedColleges />
    <WhyUs />
    <Recruiters />
    <Gallery />
    <Testimonials />
    <CTABanner />
  </>
);

export default Index;
