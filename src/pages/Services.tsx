import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import {
  GraduationCap, CreditCard, Compass, Award, ArrowRight,
  CheckCircle2, FileText, Phone, Users, Building2,
  MapPin, Star, Clock, BadgeCheck
} from "lucide-react";
import servicesHero from "@/assets/services-hero.jpg";

const services = [
  {
    icon: GraduationCap,
    tag: "Core Service",
    tagColor: "bg-blue-500",
    title: "College Admissions",
    subtitle: "End-to-end admission support for 24+ partner colleges",
    desc: "We guide you through every single step of the college admission process — from shortlisting colleges based on your marks, budget and career goals, to filling forms, arranging documents, and confirming your seat.",
    points: [
      "Personalized college shortlisting based on your profile",
      "Complete application & documentation support",
      "Direct communication with college admission offices",
      "Seat confirmation and enrollment assistance",
      "Pre-admission counseling sessions",
      "Follow-up till you reach the campus",
    ],
    stats: [{ n:"24+", l:"Partner Colleges" }, { n:"5000+", l:"Admissions Done" }, { n:"100%", l:"Free Service" }],
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: CreditCard,
    tag: "Government Scheme",
    tagColor: "bg-green-500",
    title: "Bihar Student Credit Card",
    subtitle: "₹4 lakh education loan at minimal interest — we process it FREE",
    desc: "The Bihar Student Credit Card (BSCC) is a game-changer for students from Bihar. We handle the entire process — document preparation, online application, DRCC verification, and bank follow-up — completely free of charge.",
    points: [
      "Eligibility check and guidance",
      "Complete document preparation checklist",
      "Online portal registration and form filling",
      "DRCC office coordination",
      "Bank follow-up until disbursement",
      "Re-application support if rejected",
    ],
    stats: [{ n:"₹4L", l:"Max Loan Amount" }, { n:"Free", l:"Our Service" }, { n:"Fast", l:"Processing" }],
    color: "from-green-500 to-emerald-600",
    docs: {
      student: ["Aadhaar Card", "10th Marksheet", "12th Marksheet / Provisional", "Residential Certificate", "Bank Passbook", "2 Passport Photos"],
      parent: ["Aadhaar Card", "2 Passport Photos"],
      other: ["Bonafide Certificate (₹10,000)", "Registration Fee (₹2,000)"],
    },
  },
  {
    icon: Compass,
    tag: "Expert Counseling",
    tagColor: "bg-purple-500",
    title: "Career Counseling",
    subtitle: "Clarity on your career path — after 10th, 12th or Graduation",
    desc: "Confused about which stream, course or college to choose? Our experienced counselors use aptitude analysis, market trend data, and one-on-one sessions to help you find the career path that truly suits you.",
    points: [
      "Aptitude and interest assessment",
      "Stream selection after 10th (Science / Commerce / Arts)",
      "Course selection after 12th",
      "Career path planning after graduation",
      "Industry demand and job market analysis",
      "One-on-one mentoring sessions",
    ],
    stats: [{ n:"All", l:"Streams Covered" }, { n:"Expert", l:"Counselors" }, { n:"Free", l:"Sessions" }],
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Award,
    tag: "Financial Aid",
    tagColor: "bg-orange-500",
    title: "Scholarship Guidance",
    subtitle: "Find and apply for scholarships — state, national & institutional",
    desc: "Quality education should never be limited by finances. We help students discover and apply for the right scholarships at every level — from Bihar government schemes to national merit-based awards to college-specific fee waivers.",
    points: [
      "Bihar government scholarship schemes",
      "National Scholarship Portal (NSP) applications",
      "Post-Matric scholarship for SC/ST/OBC students",
      "Mukhyamantri Kanya Utthan Yojana",
      "Institutional scholarship applications",
      "Merit-based fee waiver negotiations",
    ],
    stats: [{ n:"10+", l:"Schemes Covered" }, { n:"50%", l:"Max Fee Waiver" }, { n:"Fast", l:"Application" }],
    color: "from-orange-500 to-amber-600",
  },
];

const associateColleges = [
  "Noida International University", "SRM University", "Uttaranchal University (NAAC A+)",
  "VIT", "Manav Rachna Vidyantariksha", "IILM University",
  "ISM Patna", "Sharda University", "CIET University",
  "Acharya Institutes", "RLT Institute", "Jagannath University", "NIT",
];

const biharColleges = [
  "Magadh University", "Vestor College", "Indu Devi College Hajipur", "Oxford Business College Patna",
];

const Services = () => (
  <>
    {/* Hero */}
    <section className="relative pt-24 pb-20 overflow-hidden min-h-[50vh] flex items-end">
      <div className="absolute inset-0">
        <img src={servicesHero} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f2e]/96 via-[#0a0f2e]/85 to-[#0a0f2e]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f2e]/80 via-transparent to-transparent" />
      </div>
      <div className="relative container-narrow px-4 sm:px-6 lg:px-8 pb-16 pt-20">
        <ScrollReveal>
          <span className="inline-block text-xs font-bold text-accent uppercase tracking-widest mb-4">What We Offer</span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.03] mb-5">
            Our <span className="hero-gradient-text">Services</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl leading-relaxed">
            Comprehensive, free education consulting to guide every Bihar student toward the right college, course and career.
          </p>
        </ScrollReveal>
      </div>
    </section>

    {/* Quick Stats */}
    <section className="py-10 bg-[#0a0f2e] border-b border-white/5">
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { icon:<Users size={20}/>, n:"5000+", l:"Students Helped" },
            { icon:<Building2 size={20}/>, n:"24+", l:"Partner Colleges" },
            { icon:<BadgeCheck size={20}/>, n:"100%", l:"Free Service" },
            { icon:<Clock size={20}/>, n:"24/7", l:"Support Available" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="text-accent/70">{s.icon}</div>
              <div>
                <div className="text-xl font-black text-white">{s.n}</div>
                <div className="text-xs text-white/50">{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Service Sections */}
    {services.map((s, i) => (
      <section key={i}
        className={`section-padding ${i % 2 === 0 ? "bg-background" : ""}`}
        style={i % 2 !== 0 ? { background: "var(--hero-gradient)" } : {}}>
        <div className="container-narrow">
          <div className={`grid lg:grid-cols-2 gap-14 items-center ${i % 2 !== 0 ? "lg:grid-flow-dense" : ""}`}>

            {/* Visual side */}
            <ScrollReveal direction={i % 2 === 0 ? "left" : "right"}
              className={i % 2 !== 0 ? "lg:col-start-2" : ""}>
              <div className="relative">
                <div className={`absolute -inset-6 rounded-3xl bg-gradient-to-br ${s.color} opacity-10 blur-2xl`} />
                <div className={`relative rounded-3xl bg-gradient-to-br ${s.color} p-8 sm:p-10`}>
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {s.stats.map((stat, j) => (
                      <div key={j} className="text-center bg-white/15 backdrop-blur rounded-2xl p-4">
                        <div className="text-2xl font-black text-white">{stat.n}</div>
                        <div className="text-white/70 text-xs mt-1">{stat.l}</div>
                      </div>
                    ))}
                  </div>

                  {/* Points */}
                  <div className="space-y-3">
                    {s.points.slice(0, 4).map((p, j) => (
                      <div key={j} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                        <CheckCircle2 size={15} className="text-white shrink-0" />
                        <span className="text-white/90 text-sm font-medium">{p}</span>
                      </div>
                    ))}
                  </div>

                  {/* Documents (for Credit Card section) */}
                  {s.docs && (
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="bg-white/10 rounded-2xl p-4">
                        <p className="text-white font-bold text-xs mb-2 flex items-center gap-1.5">
                          <FileText size={12} /> Student Documents
                        </p>
                        {s.docs.student.map((d, j) => (
                          <p key={j} className="text-white/70 text-xs py-0.5">• {d}</p>
                        ))}
                      </div>
                      <div className="bg-white/10 rounded-2xl p-4">
                        <p className="text-white font-bold text-xs mb-2 flex items-center gap-1.5">
                          <Users size={12} /> Parent Documents
                        </p>
                        {s.docs.parent.map((d, j) => (
                          <p key={j} className="text-white/70 text-xs py-0.5">• {d}</p>
                        ))}
                        <p className="text-white font-bold text-xs mt-3 mb-1">Other</p>
                        {s.docs.other.map((d, j) => (
                          <p key={j} className="text-white/70 text-xs py-0.5">• {d}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Text side */}
            <ScrollReveal direction={i % 2 === 0 ? "right" : "left"}>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${s.tagColor} mb-4`}>{s.tag}</span>
              <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mb-5">
                <s.icon size={28} className="text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-2">{s.title}</h2>
              <p className="text-accent font-semibold text-sm mb-5">{s.subtitle}</p>
              <p className="text-muted-foreground leading-relaxed mb-7">{s.desc}</p>
              <ul className="space-y-3 mb-8">
                {s.points.map((p, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-foreground">
                    <CheckCircle2 size={15} className="text-accent shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
              <Link to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold btn-glow shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform">
                Get Started Free <ArrowRight size={16} />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>
    ))}

    {/* Associate Colleges */}
    <section className="section-padding bg-[#0a0f2e] relative overflow-hidden">
      <div className="absolute inset-0 opacity-20"
        style={{ background:"radial-gradient(ellipse 60% 60% at 50% 0%, hsla(235,85%,60%,0.4), transparent)" }} />
      <div className="relative container-narrow">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Our Network</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 mb-3">Associate Colleges</h2>
            <p className="text-white/50 max-w-lg mx-auto">Our extended network of trusted partner institutions across India</p>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {associateColleges.map((c, i) => (
              <motion.span key={i} whileHover={{ scale:1.05, y:-2 }}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-default">
                {c}
              </motion.span>
            ))}
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <h3 className="text-center text-lg font-bold text-white mb-5">Bihar Colleges</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {biharColleges.map((c, i) => (
              <span key={i} className="px-4 py-2.5 rounded-xl bg-accent/20 border border-accent/30 text-sm font-semibold text-accent">
                {c}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 bg-primary relative overflow-hidden">
      <div className="absolute inset-0"
        style={{ background:"radial-gradient(ellipse 80% 80% at 50% 50%, hsla(27,100%,55%,0.15), transparent)" }} />
      <div className="relative container-narrow px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/65 max-w-lg mx-auto mb-8">Talk to our counselors today — completely free. No pressure, just guidance.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary font-bold text-sm hover:-translate-y-1 transition-transform shadow-2xl">
              Book Free Session <ArrowRight size={16} />
            </Link>
            <a href="tel:+919142082026"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-bold text-sm hover:bg-white/10 hover:-translate-y-1 transition-all">
              <Phone size={16} /> +91 9142082026
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  </>
);

export default Services;
