import { useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { colleges, states } from "@/data/colleges";
import { CreditCard, X, ArrowRight, MapPin, Globe, RotateCcw, Building2, Search, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import collegeHero from "@/assets/college-hero.jpg";

const feeRanges = [
  { label: "All Fees", min: 0, max: Infinity },
  { label: "Under ₹3L", min: 0, max: 300000 },
  { label: "₹3L – ₹6L", min: 300000, max: 600000 },
  { label: "₹6L+", min: 600000, max: Infinity },
];

const courseTypes = [
  { label: "All Courses", value: "" },
  { label: "Engineering", value: "B.Tech" },
  { label: "Management", value: "MBA" },
  { label: "Medical", value: "Nursing" },
  { label: "Law", value: "LLB" },
  { label: "Pharmacy", value: "Pharma" },
];

const collegeFees: Record<number, { course: string; duration: string; fee: string }[]> = {
  1: [
    { course:"B.Tech (CSE/Cyber/IT/AI)", duration:"4 Year", fee:"₹5,96,000" },
    { course:"BBA", duration:"3 Year", fee:"₹3,60,000" },
    { course:"MBA / MCA", duration:"2 Year", fee:"₹3,47,000" },
    { course:"B.Pharma", duration:"4 Year", fee:"₹6,80,000" },
    { course:"BPT", duration:"4 Year", fee:"₹5,66,000" },
    { course:"B.Sc Nursing", duration:"4 Year", fee:"₹6,00,000" },
    { course:"GNM", duration:"3 Year", fee:"₹4,28,000" },
    { course:"D.Pharma", duration:"2 Year", fee:"₹2,50,000" },
  ],
  2: [
    { course:"Polytechnic", duration:"3 Year", fee:"₹3,30,000" },
    { course:"B.Tech Core Branch", duration:"4 Year", fee:"₹5,20,000" },
    { course:"BPT", duration:"4 Year", fee:"₹4,40,000" },
    { course:"BBA", duration:"3 Year", fee:"₹3,60,000" },
    { course:"B.Com / MBA", duration:"2–3 Year", fee:"₹2,60,000" },
    { course:"B.Pharma", duration:"4 Year", fee:"₹6,40,000" },
    { course:"BA.LLB", duration:"5 Year", fee:"₹7,10,000" },
    { course:"MCA", duration:"2 Year", fee:"₹3,90,000" },
  ],
  3: [
    { course:"B.Tech Civil/Mech/Electrical/Agri", duration:"4 Year", fee:"₹5,30,000" },
    { course:"B.Tech CSE & Engg.", duration:"4 Year", fee:"₹6,00,000" },
    { course:"B.Tech AI & ML", duration:"4 Year", fee:"₹6,40,000" },
    { course:"BBA/BCA", duration:"3 Year", fee:"₹4,50,000" },
    { course:"MCA", duration:"2 Year", fee:"₹2,90,000" },
    { course:"MBA", duration:"2 Year", fee:"₹3,80,000" },
    { course:"B.Ed / D.El.Ed", duration:"2 Year", fee:"₹3,10,000" },
    { course:"LLB / Polytechnic", duration:"3 Year", fee:"₹4,35,000" },
    { course:"PhD", duration:"3 Year", fee:"₹4,20,000" },
  ],
  4: [
    { course:"B.Tech CSE", duration:"4 Year", fee:"₹12,21,000" },
    { course:"B.Tech CSE (AIML)", duration:"4 Year", fee:"₹12,21,000" },
    { course:"B.Tech Data Science", duration:"4 Year", fee:"₹10,21,000" },
    { course:"B.Tech Cyber Security", duration:"4 Year", fee:"₹8,21,000" },
    { course:"B.Tech Cloud Computing", duration:"4 Year", fee:"₹8,21,000" },
    { course:"B.Tech ECE / Mechanical", duration:"4 Year", fee:"₹7,21,000" },
    { course:"Hotel Management", duration:"3 Year", fee:"₹1,96,000" },
    { course:"B.Pharma", duration:"4 Year", fee:"₹5,21,000" },
    { course:"BBA / MBA", duration:"2–3 Year", fee:"₹3,21,000–₹4,21,000" },
    { course:"BCA / MCA", duration:"2–3 Year", fee:"₹2,71,000–₹3,21,000" },
  ],
  5: [
    { course:"B.Tech CSE/AI&ML/AI&DS", duration:"4 Year", fee:"₹12,89,000" },
    { course:"B.Tech Cyber Security/Cloud", duration:"4 Year", fee:"₹10,89,000" },
    { course:"B.Tech Civil/BioMedical/EEE/ECE", duration:"4 Year", fee:"₹7,59,000" },
    { course:"M.Tech CSE/Civil", duration:"2 Year", fee:"₹2,57,000" },
    { course:"BCA / MCA", duration:"3 Year", fee:"₹3,03,000" },
    { course:"BBA", duration:"3 Year", fee:"₹3,88,000" },
    { course:"MBA", duration:"2 Year", fee:"₹4,02,000" },
  ],
  6: [
    { course:"B.Tech CSE", duration:"4 Year", fee:"₹8,48,000" },
    { course:"B.Tech ME/CE/ECE/EE", duration:"4 Year", fee:"₹7,28,000" },
    { course:"Diploma CSE/ME/CE", duration:"3 Year", fee:"₹3,90,000" },
    { course:"BCA", duration:"3 Year", fee:"₹5,01,000" },
    { course:"MCA", duration:"2 Year", fee:"₹3,44,000" },
    { course:"B.Sc Agriculture", duration:"4 Year", fee:"₹6,08,000" },
    { course:"B.Pharma", duration:"4 Year", fee:"₹7,68,000" },
    { course:"BPT", duration:"4 Year", fee:"₹6,88,000" },
    { course:"BBA / MBA Dual", duration:"2–3 Year", fee:"₹4,34,000–₹4,56,000" },
    { course:"BA.LLB", duration:"5 Year", fee:"₹7,10,000" },
  ],
  7: [
    { course:"Diploma CS/Mech/Civil", duration:"3 Year", fee:"₹2,20,000–₹3,65,000" },
    { course:"B.Tech CSE", duration:"4 Year", fee:"₹4,50,000" },
    { course:"B.Tech CSE (AI & ML)", duration:"4 Year", fee:"₹5,50,000" },
    { course:"B.Tech Mechanical/Civil", duration:"4 Year", fee:"₹5,25,000" },
    { course:"BHMCT", duration:"4 Year", fee:"₹2,80,000" },
    { course:"BCA / BBA", duration:"3 Year", fee:"₹3,85,000" },
    { course:"MCA / MBA", duration:"2 Year", fee:"₹3,50,000–₹3,75,000" },
  ],
  8: [
    { course:"PGDM", duration:"2 Year", fee:"₹8,37,000" },
    { course:"MBA", duration:"2 Year", fee:"₹4,95,000" },
    { course:"M.Tech", duration:"2 Year", fee:"₹1,35,000" },
    { course:"MCA", duration:"2 Year", fee:"₹2,83,000" },
    { course:"B.Tech", duration:"4 Year", fee:"₹7,05,000" },
    { course:"BBA / BCA", duration:"3 Year", fee:"₹3,14,000" },
    { course:"B.Sc Nursing", duration:"4 Year", fee:"₹5,16,000" },
    { course:"B.Pharma", duration:"4 Year", fee:"₹7,05,000" },
    { course:"BA.LLB", duration:"5 Year", fee:"₹6,30,000" },
  ],
  9: [
    { course:"B.Tech CSE", duration:"4 Year", fee:"₹7,90,000" },
    { course:"B.Tech ME/EE/CE/ECE", duration:"4 Year", fee:"₹7,15,000" },
    { course:"BCA", duration:"3 Year", fee:"₹5,25,000" },
    { course:"MCA / MBA", duration:"2 Year", fee:"₹3,50,000–₹4,70,000" },
    { course:"B.COM", duration:"3 Year", fee:"₹3,06,000" },
    { course:"B.SC AGRI", duration:"4 Year", fee:"₹7,15,000" },
    { course:"BJMC", duration:"3 Year", fee:"₹4,80,000" },
    { course:"B.ARCH", duration:"5 Year", fee:"₹9,87,500" },
  ],
  10:[
    { course:"BCA", duration:"3 Year", fee:"₹2,40,000" },
    { course:"BCA (AI & Deep Learning)", duration:"3 Year", fee:"₹3,00,000" },
    { course:"BCA Cyber Security", duration:"3 Year", fee:"₹3,00,000" },
    { course:"B.Tech Mech/Electrical", duration:"4 Year", fee:"₹4,40,000" },
    { course:"B.Tech CSE and AIML", duration:"4 Year", fee:"₹5,20,000" },
    { course:"B.Tech AI & DS (IBM)", duration:"4 Year", fee:"₹6,80,000" },
    { course:"MCA AI Deep Learning", duration:"2 Year", fee:"₹2,00,000" },
    { course:"BBA / MBA", duration:"2–3 Year", fee:"₹2,40,000–₹4,50,000" },
    { course:"Diploma Engineering", duration:"3 Year", fee:"₹2,10,000" },
  ],
  11:[
    { course:"B.Tech Civil/Mech/Chemical/AI", duration:"4 Year", fee:"₹6,00,000" },
    { course:"B.Tech Cyber Security", duration:"4 Year", fee:"₹6,60,000" },
    { course:"BCA / B.Sc IT", duration:"3 Year", fee:"₹4,05,000–₹4,30,000" },
    { course:"B.Sc Nursing", duration:"4 Year", fee:"₹10,86,000" },
    { course:"GNM", duration:"3 Year", fee:"₹5,20,000" },
    { course:"B.Pharma", duration:"4 Year", fee:"₹8,06,000" },
    { course:"BBA / MBA", duration:"2–3 Year", fee:"₹3,80,000–₹4,05,000" },
    { course:"B.Sc Agriculture", duration:"4 Year", fee:"₹5,60,000" },
  ],
  12:[
    { course:"B.Tech CSE", duration:"4 Year", fee:"₹5,60,000" },
    { course:"B.Tech AI&DS/CS", duration:"4 Year", fee:"₹6,00,000" },
    { course:"B.Tech Civil/ME/EE/ECE", duration:"4 Year", fee:"₹4,40,000" },
    { course:"BBA/BCA", duration:"3 Year", fee:"₹3,60,000" },
    { course:"MBA/MCA", duration:"2 Year", fee:"₹3,50,000" },
    { course:"B.Pharma", duration:"4 Year", fee:"₹5,00,000" },
    { course:"GNM / B.Sc Nursing", duration:"2–4 Year", fee:"₹3,75,000–₹5,70,000" },
    { course:"Diploma", duration:"2–3 Year", fee:"₹2,38,000–₹3,30,000" },
  ],
  13:[
    { course:"B.Tech CSE/AI&ML", duration:"4 Year", fee:"₹6,50,000" },
    { course:"B.E Civil/EE/ECE/ME", duration:"4 Year", fee:"₹5,60,000" },
    { course:"M.Tech CSE/ME", duration:"2 Year", fee:"₹3,00,000" },
    { course:"Diploma CSE/Civil/EE", duration:"3 Year", fee:"₹3,60,000" },
    { course:"MCA / MBA", duration:"2 Year", fee:"₹3,60,000–₹3,80,000" },
  ],
  14:[
    { course:"B.Tech CSE/AI&ML/IOT/DS", duration:"4 Year", fee:"₹6,20,000" },
    { course:"B.Tech Civil/EE/ME/ECE", duration:"4 Year", fee:"₹5,50,000" },
    { course:"B.Sc Hons. Agri/BPT", duration:"4 Year", fee:"₹6,00,000" },
    { course:"BCA / BBA", duration:"3 Year", fee:"₹3,60,000–₹3,75,000" },
    { course:"M.Tech CSE", duration:"2 Year", fee:"₹3,15,000" },
    { course:"MCA / MBA", duration:"2 Year", fee:"₹3,20,000–₹3,98,000" },
  ],
  15:[
    { course:"BCA / BBA / BBM", duration:"3 Year", fee:"₹2,56,500" },
    { course:"B.COM (P)", duration:"3 Year", fee:"₹2,56,500" },
    { course:"LL.B / BBA.LL.B", duration:"3–5 Year", fee:"₹3,50,000–₹5,50,000" },
    { course:"B.Pharma / D.Pharma", duration:"2–4 Year", fee:"₹2,50,000–₹9,00,000" },
    { course:"B.Sc Nursing", duration:"4 Year", fee:"₹2,50,000" },
    { course:"ANM / GNM", duration:"2 Year", fee:"₹1,70,000" },
  ],
  16:[
    { course:"B.Tech CSE", duration:"4 Year", fee:"₹8,00,000" },
    { course:"B.Tech ME/ECE/EE/Civil/Biotech", duration:"4 Year", fee:"₹5,75,000" },
    { course:"BBA / BCA / B.Com", duration:"3 Year", fee:"₹4,50,000" },
    { course:"B.Sc Agriculture", duration:"4 Year", fee:"₹8,00,000" },
    { course:"BHMCT", duration:"4 Year", fee:"₹5,60,000" },
    { course:"BPT / B.Sc Biotech", duration:"4 Year", fee:"₹8,40,000" },
    { course:"MBA / MCA", duration:"2 Year", fee:"₹4,10,000–₹4,45,000" },
  ],
  17:[
    { course:"MBA", duration:"2 Year", fee:"₹2,51,000 (scholarship: ₹30,900/sem)" },
    { course:"MCA", duration:"2 Year", fee:"₹2,45,000 (scholarship: ₹28,900/sem)" },
    { course:"BBA / BCA", duration:"3 Year", fee:"₹2,51,000 (scholarship: ₹28,900/sem)" },
    { course:"B.Pharma", duration:"4 Year", fee:"₹4,25,000" },
    { course:"D.Pharma", duration:"2 Year", fee:"₹1,80,000" },
    { course:"Diploma", duration:"3 Year", fee:"₹1,95,000" },
  ],
  18:[
    { course:"M.Tech CSE INTEGRATED", duration:"5 Year", fee:"₹6,01,000" },
    { course:"B.Tech CSE/AI&DS/AI&ML", duration:"4 Year", fee:"₹6,01,000" },
    { course:"B.Tech + MBA Integrated", duration:"5 Year", fee:"₹5,51,000" },
    { course:"B.E Agri/Aero/Biomedical", duration:"4 Year", fee:"₹4,61,000" },
    { course:"B.Tech Food Tech/Mech/Civil", duration:"4 Year", fee:"₹4,41,000" },
    { course:"MBA/MCA", duration:"2 Year", fee:"₹3,61,000" },
  ],
  19:[
    { course:"B.Tech CSE/Cyber/AI&ML", duration:"4 Year", fee:"₹10,00,000" },
    { course:"B.Tech Info Science/ECE", duration:"4 Year", fee:"₹10,00,000" },
    { course:"B.Tech EEE/Civil/Mech", duration:"4 Year", fee:"₹7,00,000" },
    { course:"MBA / MCA", duration:"2 Year", fee:"₹5,10,000" },
    { course:"Polytechnic ECE/EEE/CSE", duration:"3 Year", fee:"₹1,16,500" },
    { course:"Diploma Medical Lab", duration:"3 Year", fee:"₹1,17,500" },
  ],
  20:[
    { course:"B.Tech CSE", duration:"4 Year", fee:"₹8,32,000" },
    { course:"Diploma ME/Civil/EE", duration:"3 Year", fee:"₹3,00,000" },
    { course:"MBA", duration:"2 Year", fee:"₹3,96,000" },
  ],
  21:[
    { course:"B.Tech CSE", duration:"4 Year", fee:"₹7,28,000" },
    { course:"B.Tech ME/CE/EE", duration:"4 Year", fee:"₹5,65,000" },
    { course:"B.Pharma", duration:"4 Year", fee:"₹4,05,000" },
    { course:"B.Sc Fashion Designing", duration:"3 Year", fee:"₹3,85,000" },
    { course:"BHMCT / MBA", duration:"2–4 Year", fee:"₹3,45,000–₹5,50,000" },
  ],
  22:[
    { course:"B.Tech CSE (AIML)", duration:"4 Year", fee:"₹6,60,000" },
    { course:"B.Tech CSE IOT/Cyber", duration:"4 Year", fee:"₹6,20,000" },
    { course:"B.Tech Civil/Mech", duration:"4 Year", fee:"₹5,20,000" },
    { course:"MBA / BCA / BBA", duration:"2–3 Year", fee:"₹2,82,000–₹4,42,000" },
    { course:"B.Sc Agriculture", duration:"4 Year", fee:"₹6,20,000" },
    { course:"Polytechnic", duration:"3 Year", fee:"₹4,00,000" },
  ],
  23:[
    { course:"B.Tech CSE/AI&ML", duration:"4 Year", fee:"₹7,12,000" },
    { course:"B.Tech EC/EN/ME/Civil", duration:"4 Year", fee:"₹5,52,000" },
    { course:"MBA / MCA / BBA / BCA", duration:"2–3 Year", fee:"₹3,17,000–₹4,01,000" },
    { course:"Polytechnic", duration:"3 Year", fee:"₹3,32,000" },
  ],
  24:[
    { course:"BBA", duration:"3 Year", fee:"₹2,60,000 (₹4,04,000 with hostel)" },
    { course:"BCA", duration:"3 Year", fee:"₹2,60,000 (₹4,04,000 with hostel)" },
    { course:"BBM", duration:"3 Year", fee:"₹2,60,000 (₹4,04,000 with hostel)" },
  ],
};

const Colleges = () => {
  const [stateFilter, setStateFilter] = useState("");
  const [feeRange, setFeeRange] = useState(0);
  const [courseFilter, setCourseFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCollege, setSelectedCollege] = useState<number | null>(null);

  const filtered = colleges.filter((c) => {
    if (stateFilter && c.state !== stateFilter) return false;
    const range = feeRanges[feeRange];
    if (c.feeFrom < range.min || c.feeFrom >= range.max) return false;
    if (courseFilter && !c.courses.some(course => course.toLowerCase().includes(courseFilter.toLowerCase()))) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const detail = selectedCollege !== null ? colleges.find(c => c.id === selectedCollege) : null;
  const hasFilters = stateFilter !== "" || feeRange !== 0 || courseFilter !== "" || search !== "";
  const clearFilters = () => { setStateFilter(""); setFeeRange(0); setCourseFilter(""); setSearch(""); };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden min-h-[50vh] flex items-end">
        <div className="absolute inset-0">
          <img src={collegeHero} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f2e]/96 via-[#0a0f2e]/85 to-[#0a0f2e]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f2e]/80 via-transparent to-transparent" />
        </div>
        <div className="relative container-narrow px-4 sm:px-6 lg:px-8 pb-16 pt-20">
          <ScrollReveal>
            <span className="inline-block text-xs font-bold text-accent uppercase tracking-widest mb-4">Our Network</span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.03] mb-5">
              Find Your Perfect <span className="hero-gradient-text">College</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed">
              Explore 24+ NAAC accredited partner colleges across India. Filter by state, course, or fee range.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <section className="sticky top-16 z-30 bg-card/98 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="container-narrow px-4 sm:px-6 lg:px-8 py-3">
          {/* Search row */}
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search college or city..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            {hasFilters && (
              <button onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent/10 text-accent text-xs font-bold hover:bg-accent/20 transition-colors whitespace-nowrap">
                <RotateCcw size={13} /> Clear All
              </button>
            )}
          </div>
          {/* Filter row */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mr-1">
              <SlidersHorizontal size={13} /> Filters:
            </div>
            <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-muted text-xs font-medium text-foreground border-0 outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">All States</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="flex gap-1">
              {feeRanges.map((r, i) => (
                <button key={i} onClick={() => setFeeRange(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${feeRange === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                  {r.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {courseTypes.map((c, i) => (
                <button key={i} onClick={() => setCourseFilter(c.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${courseFilter === c.value ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                  {c.label}
                </button>
              ))}
            </div>
            <span className="ml-auto text-xs text-muted-foreground font-medium">
              <span className="text-foreground font-black">{filtered.length}</span> / 24 colleges
            </span>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-foreground font-bold text-lg mb-2">No colleges found</p>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
              <button onClick={clearFilters} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold">
                <RotateCcw size={14} /> Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((college, i) => (
                <ScrollReveal key={college.id} delay={Math.min(i * 0.04, 0.25)}>
                  <div className="glass-card gradient-border rounded-2xl p-6 h-full flex flex-col group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                        <Building2 size={18} className="text-primary" />
                      </div>
                      {college.naac && (
                        <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black">NAAC {college.naac}</span>
                      )}
                    </div>
                    <h3 className="text-sm font-black text-foreground leading-tight mb-1">{college.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                      <MapPin size={11} /> {college.location}, {college.state}
                    </p>
                    {college.creditCard && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-accent font-bold mb-3">
                        <CreditCard size={11} /> Bihar Student Credit Card Accepted
                      </span>
                    )}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {college.courses.slice(0, 3).map((c, j) => (
                        <span key={j} className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-medium">{c}</span>
                      ))}
                      {college.courses.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px]">+{college.courses.length - 3} more</span>
                      )}
                    </div>
                    <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-sm font-black text-accent">From {college.feeLabel}</span>
                      <button onClick={() => setSelectedCollege(college.id)}
                        className="text-xs font-bold text-primary hover:text-accent transition-colors flex items-center gap-1 group-hover:gap-1.5">
                        Details <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {detail && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedCollege(null)}>
            <motion.div
              initial={{ opacity:0, scale:0.95, y:20 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.95, y:20 }}
              transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}
              className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>

              {/* Modal Header */}
              <div className="sticky top-0 bg-card/98 backdrop-blur rounded-t-2xl px-6 py-5 border-b border-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 size={22} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-foreground">{detail.name}</h2>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin size={12} /> {detail.location}, {detail.state}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCollege(null)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0">
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {detail.naac && <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-black">NAAC {detail.naac}</span>}
                  {detail.creditCard && (
                    <span className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-bold flex items-center gap-1.5">
                      <CreditCard size={12} /> Bihar Student Credit Card
                    </span>
                  )}
                  {detail.website && (
                    <a href={`https://${detail.website}`} target="_blank" rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium flex items-center gap-1.5 hover:text-foreground transition-colors">
                      <Globe size={12} /> Visit Website
                    </a>
                  )}
                </div>

                {/* Fee Table */}
                <div>
                  <h3 className="text-sm font-black text-foreground mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center text-primary text-xs">₹</span>
                    Complete Fee Structure
                  </h3>
                  <div className="border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted">
                          <th className="text-left px-4 py-3 font-bold text-foreground text-xs">Course</th>
                          <th className="text-center px-3 py-3 font-bold text-foreground text-xs">Duration</th>
                          <th className="text-right px-4 py-3 font-bold text-foreground text-xs">Total Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(collegeFees[detail.id] || detail.courses.map(c => ({ course:c, duration:"—", fee:detail.feeLabel }))).map((row, i) => (
                          <tr key={i} className={`border-t border-border ${i % 2 === 0 ? "" : "bg-muted/30"}`}>
                            <td className="px-4 py-2.5 text-foreground text-xs font-medium">{row.course}</td>
                            <td className="px-3 py-2.5 text-center text-muted-foreground text-xs">{row.duration}</td>
                            <td className="px-4 py-2.5 text-right text-accent font-bold text-xs">{row.fee}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">* Fees are approximate. Contact us for exact current fees and scholarship options.</p>
                </div>

                {detail.hostelFee && (
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                    <p className="text-sm font-bold text-foreground flex items-center gap-2">🏠 Hostel Fee</p>
                    <p className="text-sm text-muted-foreground mt-1">{detail.hostelFee}</p>
                  </div>
                )}

                <Link to="/contact" onClick={() => setSelectedCollege(null)}
                  className="btn-glow w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-accent text-accent-foreground font-bold text-sm shadow-lg shadow-accent/20">
                  Apply Now for {detail.name} <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Colleges;
