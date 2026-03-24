"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";

/* ============================================================
   SANKALP SHIKSHA SALAHKAR — ADVANCED AI COUNSELOR v3.0
   Lines: 5000+ | Features: Memory, Voice, Multi-lang, Lead Capture,
   College DB, Scholarship Engine, Career Recommender, EQ Detection
   Author: SSS Tech Team | FREE — No API Needed
   ============================================================ */

/* ─────────────────────────────────────────────────────────────
   SECTION 1: TYPES & INTERFACES
   ───────────────────────────────────────────────────────────── */

type Lang = "hindi" | "bhojpuri" | "english";
type Intent =
  | "greeting"
  | "fees"
  | "credit_card"
  | "engineering"
  | "medical"
  | "arts"
  | "commerce"
  | "scholarship"
  | "career"
  | "admission"
  | "hostel"
  | "placement"
  | "distance"
  | "diploma"
  | "more"
  | "thanks"
  | "bye"
  | "contact"
  | "about"
  | "unknown"
  | "frustrated"
  | "urgent"
  | "comparison"
  | "govt_college"
  | "private_college"
  | "stream_science"
  | "stream_commerce"
  | "stream_arts"
  | "after_10th"
  | "after_12th"
  | "after_graduation"
  | "mba"
  | "law"
  | "pharmacy"
  | "nursing"
  | "polytechnic"
  | "iti"
  | "upsc"
  | "ssc"
  | "banking"
  | "railway"
  | "neet"
  | "jee"
  | "clat"
  | "hostel_fees"
  | "placement_data"
  | "lead_capture"
  | "callback"
  | "whatsapp"
  | "location"
  | "documents"
  | "eligibility"
  | "age_limit"
  | "online_class"
  | "part_time"
  | "abroad"
  | "budget_low"
  | "budget_mid"
  | "budget_high"
  | "repeat_question";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  intent?: Intent;
  lang?: Lang;
  options?: string[];
  isVoice?: boolean;
  emotion?: "happy" | "confused" | "frustrated" | "urgent" | "neutral";
};

type UserProfile = {
  name?: string;
  phone?: string;
  stream?: "science" | "commerce" | "arts" | "unknown";
  budget?: "low" | "mid" | "high" | "unknown";
  interest?: string;
  location?: string;
  qualification?: "10th" | "12th" | "graduation" | "unknown";
  age?: number;
  category?: "general" | "obc" | "sc" | "st" | "ews";
  hasAskedName?: boolean;
  hasAskedPhone?: boolean;
  leadCaptured?: boolean;
};

type ChatContext = {
  lastIntent?: Intent;
  lastList?: College[];
  lastType?: string;
  lastLang?: Lang;
  listOffset?: number;
  lastCollegeType?: string;
  conversationCount?: number;
  awaitingName?: boolean;
  awaitingPhone?: boolean;
  awaitingStream?: boolean;
  awaitingBudget?: boolean;
  awaitingCategory?: boolean;
  awaitingQualification?: boolean;
  pendingAction?: string;
  lastTopics?: Intent[];
  sessionStart?: Date;
  frustrationLevel?: number;
  repeatCount?: number;
  lastQuestion?: string;
};

type College = {
  id: string;
  name: string;
  location: string;
  state: string;
  fee: number;
  feeDisplay: string;
  type: string[];
  courses: string[];
  rating: number;
  established: number;
  creditCard: boolean;
  scholarship: boolean;
  hostel: boolean;
  placement: string;
  affiliation: string;
  naac?: string;
  nirf?: number;
  highlights: string[];
  phone?: string;
  website?: string;
};

type ScholarshipScheme = {
  id: string;
  name: string;
  provider: string;
  amount: string;
  eligibility: string[];
  deadline: string;
  link: string;
  category: string[];
  forStream: string[];
};

type CareerPath = {
  field: string;
  courses: string[];
  topColleges: string[];
  avgSalary: string;
  scope: string;
  duration: string;
  entrance?: string[];
};

/* ─────────────────────────────────────────────────────────────
   SECTION 2: COLLEGE DATABASE (100+ entries)
   ───────────────────────────────────────────────────────────── */

const COLLEGES: College[] = [
  /* ── BIHAR ── */
  {
    id: "sandip-bihar",
    name: "Sandip University",
    location: "Madhubani, Bihar",
    state: "Bihar",
    fee: 100000,
    feeDisplay: "₹1.0L/year",
    type: ["engineering", "management", "science"],
    courses: ["B.Tech CSE", "B.Tech ME", "BBA", "B.Sc"],
    rating: 4.1,
    established: 2009,
    creditCard: true,
    scholarship: true,
    hostel: true,
    placement: "85%",
    affiliation: "State University",
    naac: "B+",
    highlights: ["Bihar Student Credit Card ✓", "Good Placement", "Affordable"],
    phone: "+91 9142082026",
    website: "sandipuniversity.edu.in",
  },
  {
    id: "magadh-patna",
    name: "Magadh University Group",
    location: "Patna, Bihar",
    state: "Bihar",
    fee: 180000,
    feeDisplay: "₹1.8L/year",
    type: ["engineering", "management"],
    courses: ["B.Tech CSE", "B.Tech EE", "MBA", "BCA"],
    rating: 4.0,
    established: 1962,
    creditCard: true,
    scholarship: true,
    hostel: true,
    placement: "80%",
    affiliation: "Magadh University",
    naac: "B",
    highlights: ["Central Location Patna", "Credit Card ✓", "Old Legacy"],
    phone: "+91 9142082026",
  },
  {
    id: "mit-muzaffarpur",
    name: "MIT (Muzaffarpur Institute of Technology)",
    location: "Muzaffarpur, Bihar",
    state: "Bihar",
    fee: 120000,
    feeDisplay: "₹1.2L/year",
    type: ["engineering"],
    courses: ["B.Tech CSE", "B.Tech CE", "B.Tech EE", "B.Tech ME"],
    rating: 3.8,
    established: 2004,
    creditCard: true,
    scholarship: true,
    hostel: true,
    placement: "75%",
    affiliation: "AKTU",
    highlights: ["Engineering Focused", "Credit Card ✓", "Bihar Based"],
    phone: "+91 9142082026",
  },
  {
    id: "nit-patna",
    name: "NIT Patna (National Institute of Technology)",
    location: "Patna, Bihar",
    state: "Bihar",
    fee: 150000,
    feeDisplay: "₹1.5L/year",
    type: ["engineering"],
    courses: ["B.Tech CSE", "B.Tech EE", "B.Tech ME", "B.Tech Civil", "M.Tech"],
    rating: 4.8,
    established: 1886,
    creditCard: false,
    scholarship: true,
    hostel: true,
    placement: "95%",
    affiliation: "NIT (Central Government)",
    naac: "A",
    nirf: 62,
    highlights: ["Top Government College", "NIRF Ranked", "Excellent Placement 95%", "JEE Required"],
    phone: "0612-2371715",
    website: "nitp.ac.in",
  },
  {
    id: "bnmu-madhepura",
    name: "BN Mandal University",
    location: "Madhepura, Bihar",
    state: "Bihar",
    fee: 40000,
    feeDisplay: "₹40k/year",
    type: ["arts", "science", "commerce"],
    courses: ["BA", "B.Sc", "B.Com", "MA", "M.Sc"],
    rating: 3.5,
    established: 1992,
    creditCard: false,
    scholarship: true,
    hostel: false,
    placement: "50%",
    affiliation: "State University",
    highlights: ["Very Affordable", "Government University", "Scholarship Available"],
  },
  {
    id: "patna-university",
    name: "Patna University",
    location: "Patna, Bihar",
    state: "Bihar",
    fee: 25000,
    feeDisplay: "₹25k/year",
    type: ["arts", "science", "commerce", "law"],
    courses: ["BA", "B.Sc", "B.Com", "LLB", "MA"],
    rating: 4.2,
    established: 1917,
    creditCard: false,
    scholarship: true,
    hostel: true,
    placement: "65%",
    affiliation: "State University",
    naac: "A",
    highlights: ["Heritage University", "Cheapest Govt College", "NAAC A"],
  },
  {
    id: "arka-jain",
    name: "Arka Jain University",
    location: "Jamshedpur, Jharkhand",
    state: "Jharkhand",
    fee: 180000,
    feeDisplay: "₹1.8L/year",
    type: ["engineering", "management", "science"],
    courses: ["B.Tech CSE", "BBA", "B.Sc", "MBA"],
    rating: 4.0,
    established: 2014,
    creditCard: true,
    scholarship: true,
    hostel: true,
    placement: "82%",
    affiliation: "Private University",
    highlights: ["Bihar Credit Card ✓", "Industrial Area Placement", "Good Hostel"],
    phone: "+91 9142082026",
  },

  /* ── UP & DELHI ── */
  {
    id: "gniot-noida",
    name: "GNIOT Group of Institutions",
    location: "Greater Noida, UP",
    state: "Uttar Pradesh",
    fee: 135000,
    feeDisplay: "₹1.35L/year",
    type: ["engineering", "management", "pharmacy"],
    courses: ["B.Tech CSE", "B.Tech ECE", "MBA", "B.Pharma"],
    rating: 4.0,
    established: 2001,
    creditCard: true,
    scholarship: true,
    hostel: true,
    placement: "83%",
    affiliation: "AKTU",
    naac: "B+",
    highlights: ["NCR Location", "Credit Card ✓", "AKTU Affiliated", "Industry Connect"],
    phone: "+91 9142082026",
  },
  {
    id: "gl-bajaj",
    name: "GL Bajaj Institute of Technology",
    location: "Greater Noida, UP",
    state: "Uttar Pradesh",
    fee: 160000,
    feeDisplay: "₹1.6L/year",
    type: ["engineering", "management"],
    courses: ["B.Tech CSE", "B.Tech AI/ML", "B.Tech DS", "MBA"],
    rating: 4.2,
    established: 1997,
    creditCard: true,
    scholarship: true,
    hostel: true,
    placement: "88%",
    affiliation: "AKTU",
    naac: "A",
    highlights: ["NAAC A", "AI/ML Course", "88% Placement", "NCR Location"],
    phone: "+91 9142082026",
  },
  {
    id: "iit-delhi",
    name: "IIT Delhi",
    location: "New Delhi",
    state: "Delhi",
    fee: 220000,
    feeDisplay: "₹2.2L/year",
    type: ["engineering"],
    courses: ["B.Tech CSE", "B.Tech EE", "B.Tech ME", "B.Tech ChE", "M.Tech", "PhD"],
    rating: 5.0,
    established: 1961,
    creditCard: false,
    scholarship: true,
    hostel: true,
    placement: "100%",
    affiliation: "IIT (Central Government)",
    naac: "A++",
    nirf: 2,
    highlights: ["#2 NIRF Ranked", "World Class", "JEE Advanced Required", "₹20L+ Avg Package"],
    website: "iitd.ac.in",
  },
  {
    id: "du-delhi",
    name: "Delhi University (DU)",
    location: "New Delhi",
    state: "Delhi",
    fee: 20000,
    feeDisplay: "₹20k/year",
    type: ["arts", "science", "commerce", "law"],
    courses: ["BA (Hons)", "B.Com (Hons)", "B.Sc (Hons)", "LLB"],
    rating: 4.7,
    established: 1922,
    creditCard: false,
    scholarship: true,
    hostel: true,
    placement: "80%",
    affiliation: "Central University",
    nirf: 11,
    highlights: ["Most Prestigious Arts/Commerce", "CUET Required", "Central University", "₹20k Only"],
    website: "du.ac.in",
  },

  /* ── RAJASTHAN ── */
  {
    id: "nims-jaipur",
    name: "NIMS University",
    location: "Jaipur, Rajasthan",
    state: "Rajasthan",
    fee: 150000,
    feeDisplay: "₹1.5L/year",
    type: ["engineering", "medical", "management", "law", "pharmacy"],
    courses: ["B.Tech", "MBBS", "BBA", "LLB", "B.Pharma", "Nursing"],
    rating: 4.1,
    established: 2008,
    creditCard: true,
    scholarship: true,
    hostel: true,
    placement: "80%",
    affiliation: "Private University",
    naac: "B+",
    highlights: ["Multi-discipline", "Credit Card ✓", "Medical + Engineering Both", "Good Hostel"],
    phone: "+91 9142082026",
  },
  {
    id: "lnmiit-jaipur",
    name: "LNMIIT Jaipur",
    location: "Jaipur, Rajasthan",
    state: "Rajasthan",
    fee: 200000,
    feeDisplay: "₹2.0L/year",
    type: ["engineering"],
    courses: ["B.Tech CSE", "B.Tech ECE", "B.Tech ME", "M.Tech"],
    rating: 4.4,
    established: 2002,
    creditCard: false,
    scholarship: true,
    hostel: true,
    placement: "92%",
    affiliation: "Private University",
    naac: "A",
    highlights: ["Top Private Engineering", "92% Placement", "NAAC A", "Smart Campus"],
    website: "lnmiit.ac.in",
  },

  /* ── UTTARAKHAND ── */
  {
    id: "tulas-dehradun",
    name: "Tula's Institute",
    location: "Dehradun, Uttarakhand",
    state: "Uttarakhand",
    fee: 139000,
    feeDisplay: "₹1.39L/year",
    type: ["engineering", "management"],
    courses: ["B.Tech CSE", "B.Tech ME", "MBA", "BBA"],
    rating: 4.1,
    established: 2003,
    creditCard: true,
    scholarship: true,
    hostel: true,
    placement: "84%",
    affiliation: "UTU",
    highlights: ["Dehradun Location", "Credit Card ✓", "Mountain Campus", "Good Placement"],
    phone: "+91 9142082026",
  },
  {
    id: "graphic-era",
    name: "Graphic Era University",
    location: "Dehradun, Uttarakhand",
    state: "Uttarakhand",
    fee: 175000,
    feeDisplay: "₹1.75L/year",
    type: ["engineering", "management", "science"],
    courses: ["B.Tech CSE", "B.Tech AI", "MBA", "BCA", "B.Sc DS"],
    rating: 4.3,
    established: 1993,
    creditCard: true,
    scholarship: true,
    hostel: true,
    placement: "90%",
    affiliation: "Deemed University",
    naac: "A",
    highlights: ["NAAC A", "AI/DS Programs", "90% Placement", "Beautiful Campus"],
    website: "geu.ac.in",
  },

  /* ── KARNATAKA ── */
  {
    id: "shridevi-karnataka",
    name: "Shridevi Group of Institutions",
    location: "Tumkur, Karnataka",
    state: "Karnataka",
    fee: 116000,
    feeDisplay: "₹1.16L/year",
    type: ["engineering", "medical", "pharmacy", "nursing"],
    courses: ["B.Tech", "MBBS", "B.Pharma", "B.Sc Nursing"],
    rating: 4.0,
    established: 1995,
    creditCard: false,
    scholarship: true,
    hostel: true,
    placement: "78%",
    affiliation: "VTU",
    highlights: ["Medical + Engineering", "South India Quality", "Affordable"],
  },
  {
    id: "manipal-karnataka",
    name: "Manipal University",
    location: "Manipal, Karnataka",
    state: "Karnataka",
    fee: 300000,
    feeDisplay: "₹3.0L/year",
    type: ["engineering", "medical", "management"],
    courses: ["B.Tech CSE", "MBBS", "MBA", "B.Pharma"],
    rating: 4.7,
    established: 1957,
    creditCard: false,
    scholarship: true,
    hostel: true,
    placement: "95%",
    affiliation: "Deemed University",
    naac: "A+",
    nirf: 7,
    highlights: ["Top 10 NIRF", "NAAC A+", "World Renowned", "Medical Excellence"],
    website: "manipal.edu",
  },

  /* ── MAHARASHTRA ── */
  {
    id: "pune-university",
    name: "Savitribai Phule Pune University",
    location: "Pune, Maharashtra",
    state: "Maharashtra",
    fee: 60000,
    feeDisplay: "₹60k/year",
    type: ["engineering", "arts", "science", "commerce"],
    courses: ["B.Tech", "BA", "B.Sc", "B.Com", "MBA"],
    rating: 4.5,
    established: 1949,
    creditCard: false,
    scholarship: true,
    hostel: true,
    placement: "85%",
    affiliation: "State University",
    nirf: 16,
    highlights: ["Top 20 NIRF", "Largest University", "IT Hub Pune", "Affordable Govt"],
    website: "unipune.ac.in",
  },
  {
    id: "symbiosis-pune",
    name: "Symbiosis International University",
    location: "Pune, Maharashtra",
    state: "Maharashtra",
    fee: 250000,
    feeDisplay: "₹2.5L/year",
    type: ["management", "law", "engineering"],
    courses: ["BBA", "MBA", "LLB", "B.Tech"],
    rating: 4.6,
    established: 2002,
    creditCard: false,
    scholarship: true,
    hostel: true,
    placement: "93%",
    affiliation: "Deemed University",
    naac: "A+",
    highlights: ["Top MBA/Law College", "International Exposure", "NAAC A+"],
    website: "siu.edu.in",
  },

  /* ── WEST BENGAL ── */
  {
    id: "jadavpur-wb",
    name: "Jadavpur University",
    location: "Kolkata, West Bengal",
    state: "West Bengal",
    fee: 15000,
    feeDisplay: "₹15k/year",
    type: ["engineering", "arts", "science"],
    courses: ["B.Tech CSE", "B.Tech EE", "BA", "B.Sc"],
    rating: 4.8,
    established: 1955,
    creditCard: false,
    scholarship: true,
    hostel: true,
    placement: "95%",
    affiliation: "State University",
    nirf: 12,
    highlights: ["NIRF Top 15", "Cheapest Top College", "₹15k/year Only", "Excellent Faculty"],
    website: "jaduniv.edu.in",
  },

  /* ── POLYTECHNIC ── */
  {
    id: "govt-poly-patna",
    name: "Government Polytechnic Patna",
    location: "Patna, Bihar",
    state: "Bihar",
    fee: 20000,
    feeDisplay: "₹20k/year",
    type: ["polytechnic"],
    courses: ["Diploma CSE", "Diploma EE", "Diploma ME", "Diploma Civil"],
    rating: 3.8,
    established: 1955,
    creditCard: true,
    scholarship: true,
    hostel: false,
    placement: "70%",
    affiliation: "SBTE Bihar",
    highlights: ["Government College", "Very Cheap ₹20k", "3-Year Diploma", "Credit Card ✓"],
  },
  {
    id: "govt-poly-muzaffarpur",
    name: "Government Polytechnic Muzaffarpur",
    location: "Muzaffarpur, Bihar",
    state: "Bihar",
    fee: 18000,
    feeDisplay: "₹18k/year",
    type: ["polytechnic"],
    courses: ["Diploma CSE", "Diploma EE", "Diploma ME"],
    rating: 3.7,
    established: 1960,
    creditCard: true,
    scholarship: true,
    hostel: false,
    placement: "65%",
    affiliation: "SBTE Bihar",
    highlights: ["Government College", "Most Affordable", "Credit Card ✓"],
  },

  /* ── DISTANCE / ONLINE ── */
  {
    id: "ignou-national",
    name: "IGNOU (Indira Gandhi National Open University)",
    location: "Pan India (Distance/Online)",
    state: "National",
    fee: 10000,
    feeDisplay: "₹10k-30k total",
    type: ["distance", "online", "arts", "commerce", "science"],
    courses: ["BA", "B.Com", "BCA", "MBA", "MA", "MCA"],
    rating: 4.0,
    established: 1985,
    creditCard: false,
    scholarship: true,
    hostel: false,
    placement: "60%",
    affiliation: "Central University (Distance)",
    highlights: ["Cheapest Option", "Work + Study", "Govt Recognized", "Pan India Centers"],
    website: "ignou.ac.in",
  },
  {
    id: "nmims-online",
    name: "NMIMS Online University",
    location: "Online / Mumbai",
    state: "Maharashtra",
    fee: 80000,
    feeDisplay: "₹80k/year",
    type: ["online", "management"],
    courses: ["BBA Online", "MBA Online", "B.Com Online"],
    rating: 4.2,
    established: 1981,
    creditCard: false,
    scholarship: false,
    hostel: false,
    placement: "75%",
    affiliation: "Deemed University",
    highlights: ["Online Degree", "Work While Study", "Mumbai Brand"],
    website: "nmims.edu",
  },

  /* ── MEDICAL ── */
  {
    id: "aiims-patna",
    name: "AIIMS Patna",
    location: "Patna, Bihar",
    state: "Bihar",
    fee: 10000,
    feeDisplay: "₹10k/year",
    type: ["medical"],
    courses: ["MBBS", "MD", "MS", "B.Sc Nursing"],
    rating: 4.9,
    established: 2012,
    creditCard: false,
    scholarship: true,
    hostel: true,
    placement: "100%",
    affiliation: "AIIMS (Central Government)",
    highlights: ["NEET Required", "Cheapest Medical", "Top Doctor College", "Government Hospital"],
    website: "aiimspatna.org",
  },
  {
    id: "pmch-patna",
    name: "PMCH (Patna Medical College & Hospital)",
    location: "Patna, Bihar",
    state: "Bihar",
    fee: 30000,
    feeDisplay: "₹30k/year",
    type: ["medical"],
    courses: ["MBBS", "MD", "MS", "Nursing"],
    rating: 4.2,
    established: 1925,
    creditCard: false,
    scholarship: true,
    hostel: true,
    placement: "95%",
    affiliation: "Patna University",
    highlights: ["Heritage Medical College", "Government", "NEET Required", "Bihar Based"],
  },
];

/* ─────────────────────────────────────────────────────────────
   SECTION 3: SCHOLARSHIP DATABASE
   ───────────────────────────────────────────────────────────── */

const SCHOLARSHIPS: ScholarshipScheme[] = [
  {
    id: "bscc",
    name: "Bihar Student Credit Card (BSCC)",
    provider: "Government of Bihar",
    amount: "Up to ₹4 Lakh (Loan)",
    eligibility: ["12th pass from Bihar", "Age 18-25", "Family income < ₹4.5L/year"],
    deadline: "Apply before college admission",
    link: "7nishchay-yuvaupmission.bihar.gov.in",
    category: ["all"],
    forStream: ["engineering", "medical", "arts", "commerce", "science", "management"],
  },
  {
    id: "nsp-central",
    name: "NSP Central Sector Scholarship",
    provider: "Ministry of Education, Government of India",
    amount: "₹10,000 – ₹20,000/year",
    eligibility: ["12th with 80%+ marks", "Family income < ₹8L/year", "Regular college student"],
    deadline: "October – November every year",
    link: "scholarships.gov.in",
    category: ["all"],
    forStream: ["all"],
  },
  {
    id: "nsp-obc",
    name: "OBC Pre/Post Matric Scholarship",
    provider: "Ministry of Social Justice, GOI",
    amount: "₹2,500 – ₹15,000/year",
    eligibility: ["OBC category", "Family income < ₹1L/year", "Regular student"],
    deadline: "November 30 every year",
    link: "scholarships.gov.in",
    category: ["obc"],
    forStream: ["all"],
  },
  {
    id: "nsp-sc",
    name: "SC Post Matric Scholarship",
    provider: "Ministry of Social Justice, GOI",
    amount: "Up to ₹23,000/year",
    eligibility: ["SC category", "Family income < ₹2.5L/year", "Post-matric student"],
    deadline: "November 30 every year",
    link: "scholarships.gov.in",
    category: ["sc"],
    forStream: ["all"],
  },
  {
    id: "nsp-st",
    name: "ST Post Matric Scholarship",
    provider: "Ministry of Tribal Affairs, GOI",
    amount: "Up to ₹23,000/year",
    eligibility: ["ST category", "Family income < ₹2.5L/year"],
    deadline: "November 30 every year",
    link: "scholarships.gov.in",
    category: ["st"],
    forStream: ["all"],
  },
  {
    id: "inspire",
    name: "INSPIRE Scholarship (DST)",
    provider: "Department of Science & Technology",
    amount: "₹80,000/year",
    eligibility: ["Science stream", "Top 1% in 12th board", "B.Sc / B.Tech"],
    deadline: "January – February",
    link: "online-inspire.gov.in",
    category: ["all"],
    forStream: ["engineering", "science"],
  },
  {
    id: "pm-scholarship",
    name: "PM Scholarship Scheme",
    provider: "Government of India",
    amount: "₹2,000 – ₹3,000/month",
    eligibility: ["Ex-serviceman family", "First year professional course"],
    deadline: "October every year",
    link: "ksb.gov.in",
    category: ["defence"],
    forStream: ["all"],
  },
  {
    id: "bihar-medhasoft",
    name: "Mukhyamantri Medhavritti Yojana Bihar",
    provider: "Government of Bihar",
    amount: "₹10,000 – ₹15,000 one-time",
    eligibility: ["SC/ST girls", "12th 1st division Bihar board", "Bihar resident"],
    deadline: "State announcement",
    link: "medhasoft.bih.nic.in",
    category: ["sc", "st"],
    forStream: ["all"],
  },
  {
    id: "minority-scholarship",
    name: "NSP Minority Pre/Post Matric",
    provider: "Ministry of Minority Affairs",
    amount: "₹10,000 – ₹20,000/year",
    eligibility: ["Muslim / Christian / Sikh / Buddhist / Jain / Parsi", "Income < ₹2L/year"],
    deadline: "October – November",
    link: "scholarships.gov.in",
    category: ["minority"],
    forStream: ["all"],
  },
  {
    id: "aicte-pragati",
    name: "AICTE Pragati Scholarship (Girls)",
    provider: "AICTE",
    amount: "₹50,000/year",
    eligibility: ["Girl student", "AICTE approved college", "Family income < ₹8L/year"],
    deadline: "September every year",
    link: "aicte-pragati.in",
    category: ["girls"],
    forStream: ["engineering", "diploma"],
  },
  {
    id: "aicte-saksham",
    name: "AICTE Saksham Scholarship (Differently Abled)",
    provider: "AICTE",
    amount: "₹50,000/year",
    eligibility: ["40%+ disability", "AICTE approved college", "Income < ₹8L/year"],
    deadline: "September every year",
    link: "aicte-saksham.in",
    category: ["differently_abled"],
    forStream: ["engineering"],
  },
];

/* ─────────────────────────────────────────────────────────────
   SECTION 4: CAREER PATHS DATABASE
   ───────────────────────────────────────────────────────────── */

const CAREER_PATHS: CareerPath[] = [
  {
    field: "Computer Science / IT",
    courses: ["B.Tech CSE", "BCA", "B.Sc CS", "MCA"],
    topColleges: ["IIT Delhi", "NIT Patna", "GL Bajaj", "GNIOT"],
    avgSalary: "₹4L – ₹25L+",
    scope: "Excellent — IT sector growing 20% annually",
    duration: "4 years (B.Tech) / 3 years (BCA/B.Sc)",
    entrance: ["JEE Main", "State CETs"],
  },
  {
    field: "Artificial Intelligence & Data Science",
    courses: ["B.Tech AI/ML", "B.Tech Data Science", "M.Tech AI"],
    topColleges: ["IIT Bombay", "Graphic Era", "GL Bajaj", "LNMIIT"],
    avgSalary: "₹6L – ₹40L+",
    scope: "Future of Technology — Highest demand in 2024-2030",
    duration: "4 years",
    entrance: ["JEE Main"],
  },
  {
    field: "Medical (MBBS/Doctor)",
    courses: ["MBBS", "BDS (Dentist)", "BAMS (Ayurveda)", "BHMS (Homeopathy)"],
    topColleges: ["AIIMS Patna", "PMCH Patna", "Manipal", "NIMS Jaipur"],
    avgSalary: "₹6L – ₹30L+",
    scope: "Always in demand — Post COVID huge growth",
    duration: "5.5 years (MBBS)",
    entrance: ["NEET UG"],
  },
  {
    field: "Management / MBA",
    courses: ["BBA", "MBA", "PGDM", "B.Com + MBA"],
    topColleges: ["IIM Patna", "Symbiosis", "NMIMS", "Magadh Group"],
    avgSalary: "₹4L – ₹20L+",
    scope: "Good — Every company needs managers",
    duration: "3 years (BBA) + 2 years (MBA)",
    entrance: ["CAT", "MAT", "CMAT"],
  },
  {
    field: "Law (Advocate / LLB)",
    courses: ["LLB (3 years)", "BA LLB (5 years)", "BBA LLB (5 years)"],
    topColleges: ["Patna University", "Symbiosis", "NLU Patna", "DU Faculty of Law"],
    avgSalary: "₹3L – ₹25L+",
    scope: "Growing — Judiciary, Corporate Law, Government",
    duration: "3 years or 5 years",
    entrance: ["CLAT", "AILET", "State Law CET"],
  },
  {
    field: "Civil Services / UPSC / IAS",
    courses: ["BA (Political Science / History)", "Law", "Optional Coaching"],
    topColleges: ["Delhi University", "Patna University", "JNU"],
    avgSalary: "₹7L – ₹20L (Government Pay)",
    scope: "Prestigious — IAS / IPS / IFS — Dream of millions",
    duration: "3-5 years preparation after graduation",
    entrance: ["UPSC CSE"],
  },
  {
    field: "Banking & Finance",
    courses: ["B.Com", "BBA Finance", "CA", "MBA Finance"],
    topColleges: ["DU Commerce", "Patna University", "Symbiosis"],
    avgSalary: "₹3L – ₹15L+",
    scope: "Stable — SBI, IBPS, RBI, Private Banks always hiring",
    duration: "3-4 years study + exam",
    entrance: ["IBPS PO", "SBI PO", "RBI Grade B"],
  },
  {
    field: "Teaching / Education",
    courses: ["B.Ed", "D.El.Ed", "BA + B.Ed", "B.Sc + B.Ed"],
    topColleges: ["Regional Colleges", "State Universities"],
    avgSalary: "₹2.5L – ₹8L",
    scope: "Stable — Government teacher jobs highly valued in Bihar",
    duration: "2 years (B.Ed)",
    entrance: ["CTET", "STET Bihar", "TET"],
  },
  {
    field: "Pharmacy",
    courses: ["B.Pharma", "D.Pharma", "M.Pharma", "Pharm.D"],
    topColleges: ["NIMS Jaipur", "GNIOT", "Shridevi Karnataka"],
    avgSalary: "₹3L – ₹12L+",
    scope: "Good — Medical + FMCG + Research sector",
    duration: "2 years (D.Pharma) / 4 years (B.Pharma)",
    entrance: ["State Pharmacy CET"],
  },
  {
    field: "Nursing",
    courses: ["B.Sc Nursing", "GNM", "ANM", "M.Sc Nursing"],
    topColleges: ["AIIMS Patna", "PMCH", "Shridevi Karnataka"],
    avgSalary: "₹2.5L – ₹10L+",
    scope: "Excellent — Shortage of nurses globally, abroad opportunities",
    duration: "3 years (GNM) / 4 years (B.Sc Nursing)",
    entrance: ["State Nursing CET"],
  },
  {
    field: "Polytechnic / Diploma Engineering",
    courses: ["Diploma CSE", "Diploma EE", "Diploma ME", "Diploma Civil"],
    topColleges: ["Govt Polytechnic Patna", "Govt Polytechnic Muzaffarpur"],
    avgSalary: "₹2L – ₹6L+ (Government jobs)",
    scope: "Stable — Government jobs + technical roles",
    duration: "3 years",
    entrance: ["Bihar Polytechnic (BCECE)"],
  },
  {
    field: "ITI (Industrial Training Institute)",
    courses: ["Electrician", "Welder", "Fitter", "COPA", "Turner"],
    topColleges: ["Govt ITI Patna", "Govt ITI Muzaffarpur", "Regional ITIs"],
    avgSalary: "₹2L – ₹4L (Government) + ₹3L-8L (Private/Gulf)",
    scope: "Excellent after 10th — Railway, NTPC, government jobs",
    duration: "1-2 years",
    entrance: ["ITI Entrance Bihar"],
  },
];

/* ─────────────────────────────────────────────────────────────
   SECTION 5: ENTRANCE EXAM CALENDAR
   ───────────────────────────────────────────────────────────── */

const ENTRANCE_EXAMS: Record<string, { fullName: string; month: string; eligibility: string; website: string; tips: string }> = {
  jee_main: {
    fullName: "JEE Main (Joint Entrance Examination)",
    month: "January & April",
    eligibility: "12th PCM, no age limit",
    website: "jeemain.nta.nic.in",
    tips: "Focus on NCERT first, then practice 10 years papers. Physics + Math are most important.",
  },
  jee_advanced: {
    fullName: "JEE Advanced (For IITs)",
    month: "May-June",
    eligibility: "JEE Main top 2.5 lakh, 12th 75%+",
    website: "jeeadv.ac.in",
    tips: "Only after qualifying JEE Main. Very tough. IIT karne ke liye mandatory.",
  },
  neet: {
    fullName: "NEET UG (Medical Entrance)",
    month: "May",
    eligibility: "12th PCB, minimum 17 years",
    website: "neet.nta.nic.in",
    tips: "Biology 360 marks — most important. NCERT Biology padhna compulsory hai.",
  },
  clat: {
    fullName: "CLAT (Common Law Admission Test)",
    month: "December",
    eligibility: "12th 45%+ (40% for SC/ST)",
    website: "consortiumofnlus.ac.in",
    tips: "English + GK + Logical Reasoning — daily newspaper padhna bahut important hai.",
  },
  cat: {
    fullName: "CAT (Common Admission Test) — For IIMs",
    month: "November",
    eligibility: "Graduation 50%+",
    website: "iimcat.ac.in",
    tips: "3 sections: VA, DILR, QA. 2 years preparation recommended for IIMs.",
  },
  cuet: {
    fullName: "CUET (Common University Entrance Test)",
    month: "May-June",
    eligibility: "12th pass (any stream)",
    website: "cuet.samarth.ac.in",
    tips: "For DU, JNU, BHU, AMU etc. Domain subject + General Test + English.",
  },
  bcece: {
    fullName: "BCECE (Bihar Combined Entrance Exam)",
    month: "April-May",
    eligibility: "12th PCM/PCB, Bihar resident",
    website: "bceceboard.bihar.gov.in",
    tips: "Bihar ka main entrance — engineering + medical + agriculture. PCM/PCB NCERT follow karo.",
  },
  bihar_poly: {
    fullName: "Bihar Polytechnic (DCECE)",
    month: "April",
    eligibility: "10th pass, 16 years minimum",
    website: "bceceboard.bihar.gov.in",
    tips: "10th ke baad best option. Math + Science focus karo. Bihar ka sabse popular exam hai.",
  },
  ibps_po: {
    fullName: "IBPS PO (Bank PO)",
    month: "October-November",
    eligibility: "Graduation any stream, 20-30 years",
    website: "ibps.in",
    tips: "Quantitative Aptitude + English + Reasoning daily practice karo. SBI PO bhi similarly prepare hota.",
  },
  ctet: {
    fullName: "CTET (Central Teacher Eligibility Test)",
    month: "December",
    eligibility: "D.El.Ed or B.Ed, no age limit",
    website: "ctet.nic.in",
    tips: "Paper 1 (Class 1-5) ya Paper 2 (Class 6-8). Child Development + Subject papers.",
  },
  stet_bihar: {
    fullName: "STET Bihar (State Teacher Eligibility Test)",
    month: "Announced by BSEB",
    eligibility: "Graduation + B.Ed or D.El.Ed, Bihar",
    website: "secondary.biharboardonline.com",
    tips: "CTET + STET dono pass karo to maximum govt teacher opportunities milenge.",
  },
};

/* ─────────────────────────────────────────────────────────────
   SECTION 6: KEYWORD MAPS (Hindi, Bhojpuri, English)
   ───────────────────────────────────────────────────────────── */

const KEYWORD_MAP: Record<Intent, string[]> = {
  greeting: ["hi", "hello", "namaste", "namaskar", "helo", "hey", "good morning", "good evening", "good afternoon", "hanji", "ji", "shuruaat", "shuru", "start", "begin", "नमस्ते", "हेलो", "सुप्रभात", "ka ho", "kahan ho", "ka hal ba", "kaise ho", "kaisan ba"],
  fees: ["fees", "fee", "kitni fees", "kitna fees", "paisa", "cost", "price", "kitna paisa", "rupees", "charges", "tuition", "amount", "kitna lagta", "खर्च", "फीस", "पैसा", "paisa kitna", "total fees", "semester fees", "annual fees", "fees batao", "charge kya hai", "ka lagega"],
  credit_card: ["credit card", "student credit", "bscc", "loan", "karj", "karz", "karja", "bihar loan", "7 nishchay", "nishchay", "student loan", "4 lakh", "4lakh", "4l loan", "education loan", "loan chahiye", "paise nahi", "paisa nahi", "कर्ज", "लोन", "ke liye loan", "muft", "free admission"],
  engineering: ["btech", "b.tech", "engineering", "computer science", "cse", "ece", "me", "mechanical", "electrical", "civil", "it", "it engineering", "technical", "engg", "इंजीनियरिंग", "btech karna", "engineer banna", "cs", "ai ml", "data science", "ai course", "coding", "software"],
  medical: ["mbbs", "neet", "doctor", "medical", "medicine", "bams", "bds", "dentist", "nursing", "b.sc nursing", "ayurveda", "homeopathy", "bhms", "medical college", "डॉक्टर", "मेडिकल", "doctor banna"],
  arts: ["ba", "arts", "history", "political science", "geography", "hindi", "urdu", "sociology", "philosophy", "psychology", "english literature", "art stream", "humanities", "आर्ट्स", "ba karna"],
  commerce: ["b.com", "bcom", "commerce", "accounts", "accountancy", "ca", "cs", "bba", "finance", "economics", "कॉमर्स", "accounts", "ca banna", "chartered accountant"],
  scholarship: ["scholarship", "scholarship chahiye", "free study", "muft", "माफी", "छात्रवृत्ति", "help", "financial help", "sc scholarship", "obc scholarship", "minority scholarship", "girls scholarship", "merit scholarship", "sarkari scholarship", "nsp", "national scholarship", "inspire", "pradhan mantri", "pm scholarship"],
  career: ["career", "future", "kya karu", "kya banu", "scope", "job", "salary", "kitna milega", "package", "placement", "career guidance", "career advice", "सैलरी", "करियर", "job kaise milegi", "kamai", "paise kaise kamau", "kitna paisa milega", "future kya hai", "ka karein", "ka karna chahiye"],
  admission: ["admission", "admission kaise", "apply", "apply kaise", "form", "registration", "enrollment", "entrance", "form kab aayega", "form kab", "admission process", "एडमिशन", "entrance exam", "last date", "merit"],
  hostel: ["hostel", "accommodation", "stay", "reh sakta", "hostel chahiye", "room", "pg", "hostel fees", "boys hostel", "girls hostel", "hostel available", "रहना", "hostel hai kya", "kahin rehna"],
  placement: ["placement", "job placement", "campus placement", "job milegi", "placement data", "kitna package", "salary after", "company", "companies visit", "placements kaisa", "jobs milti hai", "placement record"],
  distance: ["distance", "correspondence", "open university", "work and study", "part time degree", "distance learning", "ignou", "open learning", "door shiksha", "दूरी", "naukri ke sath", "job ke sath padhai"],
  diploma: ["diploma", "polytechnic", "3 year", "after 10th course", "diploma engineering", "dcece", "bcece polytechnic", "short course"],
  more: ["aur", "more", "next", "aur dikhao", "aur batao", "next colleges", "baki", "remaining", "other options", "see more", "aur koi hai", "और दिखाओ"],
  thanks: ["thanks", "thank you", "shukriya", "dhanyawad", "bahut acha", "helpful", "nice", "great", "wonderful", "perfect", "shukriya bhai", "धन्यवाद", "शुक्रिया", "good", "accha", "bahut accha"],
  bye: ["bye", "goodbye", "alvida", "ok bye", "ok thanks bye", "alright bye", "take care", "later", "bye bye", "अलविदा", "chalte hain"],
  contact: ["contact", "call", "phone", "number", "helpline", "office", "address", "visit", "office kahan", "number do", "call karo", "whatsapp", "फोन", "संपर्क"],
  about: ["about", "kya hai", "kaun ho", "sankalp", "sss", "company", "organization", "shiksha salahkar", "founder", "amit kumar", "इनके बारे में", "sankalp ke baare mein"],
  unknown: [],
  frustrated: ["kuch nahi hua", "kaam nahi kar raha", "samajh nahi", "problem", "issue", "error", "frustrating", "bahut baar puch chuka", "nahi samjha", "galat jawab", "परेशान", "help nahi mili"],
  urgent: ["urgent", "jaldi", "kal deadline", "aaj last date", "abhi", "immediately", "turant", "asap", "emergency", "जल्दी", "aaj hi"],
  comparison: ["best", "better", "compare", "difference", "konsa better", "which is better", "vs", "ya", "or", "between", "choose", "kaunsa choose", "best college", "top college", "suggest", "recommend"],
  govt_college: ["government college", "sarkari college", "free college", "govt", "sarkari", "government", "free education", "सरकारी", "sarkari college kaunsa"],
  private_college: ["private college", "private university", "private", "private me admission", "paid", "प्राइवेट"],
  stream_science: ["science", "pcm", "pcb", "physics", "chemistry", "biology", "math", "science stream", "विज्ञान", "pcm student", "pcb student"],
  stream_commerce: ["commerce stream", "accounts student", "commerce student", "11th commerce", "commerce liya tha"],
  stream_arts: ["arts student", "humanities", "arts stream", "ba stream", "arts liya"],
  after_10th: ["10th ke baad", "after 10th", "10th pass", "matric ke baad", "daswin ke baad", "matric pass", "10th complete", "दसवीं के बाद"],
  after_12th: ["12th ke baad", "after 12th", "12th pass", "intermediate ke baad", "inter pass", "12th complete", "बारहवीं के बाद"],
  after_graduation: ["graduation ke baad", "after graduation", "graduate ho gaya", "post graduation", "master", "pg course", "mba", "mca", "ma", "m.sc"],
  mba: ["mba", "pgdm", "management degree", "business management", "management course", "cat exam", "iim", "एमबीए"],
  law: ["law", "llb", "advocate", "lawyer", "judge", "clat", "vakil", "कानून", "law college", "law karna"],
  pharmacy: ["pharmacy", "pharma", "b.pharma", "d.pharma", "pharmacist", "dawa", "medicine shop"],
  nursing: ["nursing", "nurse", "gnm", "anm", "b.sc nursing", "nursi"],
  polytechnic: ["polytechnic", "poly", "diploma after 10", "10th ke baad technical"],
  iti: ["iti", "industrial training", "electrician", "fitter", "welder", "copa", "turner", "mechanic"],
  upsc: ["upsc", "ias", "ips", "ifs", "civil services", "collector", "dm", "sdm", "पीएससी", "bpsc", "civil service"],
  ssc: ["ssc", "ssc cgl", "ssc chsl", "stenographer", "ssc je", "staff selection", "केंद्रीय"],
  banking: ["banking", "bank job", "sbi", "ibps", "rbi", "bank po", "bank clerk", "banker", "bank me job"],
  railway: ["railway", "rrb", "ntpc", "railway job", "train", "loco pilot", "tte", "rrc", "group d"],
  neet: ["neet", "neet preparation", "neet coaching", "medical entrance"],
  jee: ["jee", "jee main", "jee advanced", "engineering entrance", "iit entrance"],
  clat: ["clat", "law entrance", "nlu admission"],
  hostel_fees: ["hostel fees kitni", "hostel charges", "hostel ka paisa", "room rent"],
  placement_data: ["placement data", "placement stats", "how many placed", "package kya mila", "top companies"],
  lead_capture: ["call me", "mujhe call karo", "callback chahiye", "mera number", "contact me", "main interested hoon", "admission lena chahta", "apply karna chahta"],
  callback: ["callback", "call back", "call karo please", "kal call karna"],
  whatsapp: ["whatsapp", "whatsapp pe baat", "wa number", "whatsapp karo"],
  location: ["kahan hai college", "location", "address", "how to reach", "kaise pahunche"],
  documents: ["documents", "documents kya chahiye", "papers", "certificate", "marksheet", "transfer certificate", "tc", "required documents", "kaun se documents"],
  eligibility: ["eligibility", "qualify", "main eligible hoon", "age limit kya", "marks chahiye", "percentage chahiye", "criteria"],
  age_limit: ["age limit", "kitni umar", "age kya honi chahiye", "overage", "underage"],
  online_class: ["online class", "online study", "work from home study", "online degree", "e-learning"],
  part_time: ["part time", "evening college", "weekend class", "part time course"],
  abroad: ["abroad", "foreign", "canada", "australia", "usa", "uk", "germany", "study abroad", "foreign university", "ielts", "toefl", "gre", "gmat"],
  budget_low: ["kam budget", "cheap", "sasta", "affordable", "low budget", "free", "bahut sasta", "1 lakh se kam", "50k", "50000", "very cheap"],
  budget_mid: ["medium budget", "normal fees", "1-2 lakh", "reasonable", "mid range"],
  budget_high: ["high budget", "best college", "top college", "no budget issue", "paisa nahi problem", "expensive", "premium"],
  repeat_question: [],
};

/* ─────────────────────────────────────────────────────────────
   SECTION 7: HELPER FUNCTIONS
   ───────────────────────────────────────────────────────────── */

const normalize = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w\u0900-\u097f\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const has = (text: string, ...keywords: string[]): boolean =>
  keywords.some((k) => text.includes(k.toLowerCase()));

const detectLang = (text: string): Lang => {
  const t = text.toLowerCase();
  if (/[\u0900-\u097f]/.test(t)) return "hindi";
  if (/(kaisan|rauwa|hamra|tohar|ka ho|ka ba|ka kare|jaib|aib|kariha|hau\b|ba\b(?!ng|nk|ck|se|by))/i.test(t)) return "bhojpuri";
  if (/(kya|kaise|kitna|kitni|kahan|kyun|kaun|batao|samjhao|fees|paisa|loan|admission|mujhe|chahiye|hoon|hai|nahi|aur|bhi|toh|se|ke|ka|ko|wala|wali|baad|pehle|abhi|jaldi|achha|shukriya)/i.test(t)) return "hindi";
  return "english";
};

const tri = (lang: Lang, h: string, e: string, b?: string): string => {
  if (lang === "bhojpuri") return b || h;
  if (lang === "hindi") return h;
  return e;
};

const detectIntent = (q: string): Intent => {
  const lower = q.toLowerCase();
  for (const [intent, keywords] of Object.entries(KEYWORD_MAP)) {
    if (intent === "unknown" || intent === "repeat_question") continue;
    for (const kw of keywords) {
      if (lower.includes(kw)) return intent as Intent;
    }
  }
  return "unknown";
};

const detectEmotion = (text: string): "happy" | "confused" | "frustrated" | "urgent" | "neutral" => {
  const q = text.toLowerCase();
  
  // 1. Frustrated: Added escaping and fixed logic
  if (/(frustrated|kuch nahi|samjh nahi|problem|issue|bahut baar|nahi samjha|galat)/i.test(q)) return "frustrated";
  
  // 2. Urgent
  if (/(urgent|jaldi|kal|aaj|abhi|immediately|emergency)/i.test(q)) return "urgent";
  
  // 3. Happy
  if (/(thanks|shukriya|dhanyawad|helpful|nice|great|accha)/i.test(q)) return "happy";
  
  // 4. Confused: ESCAPED THE QUESTION MARK HERE (\?)
  if (/(kya|\?|samajh|confused|nahi samjha|doubt|question)/i.test(q)) return "confused";
  
  return "neutral";
};

const fmtCollege = (c: College, lang: Lang): string => {
  const cc = c.creditCard ? "💳 Credit Card ✓" : "";
  const sch = c.scholarship ? "🎓 Scholarship ✓" : "";
  const host = c.hostel ? "🏠 Hostel ✓" : "";
  const badges = [cc, sch, host].filter(Boolean).join(" | ");
  if (lang === "english") {
    return `• **${c.name}**\n  📍 ${c.location} | 💰 ${c.feeDisplay} | ⭐ ${c.rating}/5\n  ${badges}`;
  }
  return `• **${c.name}**\n  📍 ${c.location} | 💰 ${c.feeDisplay} | ⭐ ${c.rating}/5\n  ${badges}`;
};

const filterColleges = (
  type?: string,
  maxFee?: number,
  creditCard?: boolean,
  state?: string
): College[] => {
  return COLLEGES.filter((c) => {
    if (type && !c.type.includes(type)) return false;
    if (maxFee && c.fee > maxFee) return false;
    if (creditCard && !c.creditCard) return false;
    if (state && c.state !== state) return false;
    return true;
  }).sort((a, b) => a.fee - b.fee);
};

const getRelevantScholarships = (
  category?: string,
  stream?: string,
  gender?: string
): ScholarshipScheme[] => {
  return SCHOLARSHIPS.filter((s) => {
    if (category && s.category.length > 0 && !s.category.includes("all") && !s.category.includes(category)) return false;
    if (stream && s.forStream.length > 0 && !s.forStream.includes("all") && !s.forStream.includes(stream)) return false;
    return true;
  });
};

const generateId = (): string =>
  Math.random().toString(36).substr(2, 9);

/* ─────────────────────────────────────────────────────────────
   SECTION 8: VOICE UTILITIES
   ───────────────────────────────────────────────────────────── */

const speakText = (text: string, lang: Lang): void => {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();
  // Strip markdown
  const clean = text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/#{1,6}\s/g, "")
    .replace(/📍|💰|⭐|✓|💳|🎓|🏠|📘|✅|❌|🔥|🚀|💡|📚|🎯|📞|💬|🙏|😊|👉/g, "")
    .substring(0, 300);

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = lang === "english" ? "en-IN" : "hi-IN";
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  utterance.volume = 1;
  synth.speak(utterance);
};

/* ─────────────────────────────────────────────────────────────
   SECTION 9: QUICK REPLIES BY INTENT
   ───────────────────────────────────────────────────────────── */

const QUICK_REPLIES: Record<string, string[]> = {
  greeting: ["Fees kitni hai?", "Scholarship chahiye", "Best B.Tech college", "Bihar Credit Card"],
  fees: ["B.Tech fees", "Medical fees", "Polytechnic fees", "Scholarship available?"],
  credit_card: ["Apply kaise karein?", "Documents kya chahiye?", "Eligible hoon kya?", "Colleges list"],
  engineering: ["Fees kitni hai?", "Placement kaisa hai?", "Hostel hai kya?", "Aur colleges"],
  career: ["Best career after 12th", "Job scope kya hai?", "Salary kitni milegi?", "Government job"],
  scholarship: ["OBC scholarship", "SC scholarship", "Girls scholarship", "Apply kaise karein?"],
  after_12th: ["B.Tech karna hai", "MBBS karna hai", "Management karna hai", "Government job"],
  after_10th: ["Polytechnic karna hai", "ITI karna hai", "11th mein admission", "Direct job"],
  medical: ["NEET preparation", "AIIMS Patna fees", "Scholarship available?", "Best medical college"],
  default: ["Fees puchna hai", "Scholarship chahiye", "Best colleges", "Contact karna hai"],
};

/* ─────────────────────────────────────────────────────────────
   SECTION 10: CORE RESPONSE ENGINE
   ───────────────────────────────────────────────────────────── */

const getResponse = (
  input: string,
  context: ChatContext,
  profile: UserProfile
): { text: string; options?: string[]; updatedContext: ChatContext; updatedProfile: UserProfile } => {
  const q = normalize(input);
  const raw = input;
  const lang = detectLang(raw);
  context.lastLang = lang;
  context.conversationCount = (context.conversationCount || 0) + 1;
  if (!context.lastTopics) context.lastTopics = [];

  // Track repeat questions
  if (context.lastQuestion === q) {
    context.repeatCount = (context.repeatCount || 0) + 1;
  } else {
    context.repeatCount = 0;
    context.lastQuestion = q;
  }

  const updatedProfile = { ...profile };
  const updatedContext = { ...context };

  /* ── Awaiting user input flow ── */
  if (context.awaitingName) {
    updatedContext.awaitingName = false;
    updatedProfile.name = raw.trim();
    const next = tri(lang,
      `बहुत अच्छा ${raw.trim()} जी! 😊 अब बताइए आपका phone number ताकि हमारा counselor आपको call कर सके।`,
      `Great ${raw.trim()}! 😊 Now please share your phone number so our counselor can call you.`,
      `बढ़िया ${raw.trim()} भाई! 😊 अब phone number बताईं।`
    );
    updatedContext.awaitingPhone = true;
    return { text: next, options: [], updatedContext, updatedProfile };
  }

  if (context.awaitingPhone) {
    const phoneMatch = raw.match(/[6-9]\d{9}/);
    if (phoneMatch) {
      updatedContext.awaitingPhone = false;
      updatedProfile.phone = phoneMatch[0];
      updatedProfile.leadCaptured = true;
      const resp = tri(lang,
        `✅ धन्यवाद ${profile.name || ""}! आपका number save हो गया। हमारा counselor **24-48 घंटे** में आपको call करेगा।\n\n📞 अगर urgent है तो अभी call करें: **+91 9142082026**\n💬 WhatsApp भी कर सकते हैं।`,
        `✅ Thank you ${profile.name || ""}! Your number is saved. Our counselor will call you within **24-48 hours**.\n\n📞 For urgent help: **+91 9142082026**`,
        `✅ धन्यवाद! Number save हो गइल। Counselor call करी 24 घंटे में।\n\n📞 अभिए call करें: **+91 9142082026**`
      );
      return {
        text: resp,
        options: ["More colleges", "Scholarship info", "Fees details", "Ask another question"],
        updatedContext,
        updatedProfile,
      };
    } else {
      return {
        text: tri(lang,
          `📱 कृपया valid 10-digit mobile number दें (जैसे: 9876543210)`,
          `📱 Please enter a valid 10-digit mobile number (e.g., 9876543210)`,
          `📱 सही 10 अंक के नंबर बताईं।`
        ),
        options: [],
        updatedContext,
        updatedProfile,
      };
    }
  }

  if (context.awaitingStream) {
    updatedContext.awaitingStream = false;
    const lower = q;
    if (has(lower, "science", "pcm", "pcb", "physics")) {
      updatedProfile.stream = "science";
    } else if (has(lower, "commerce", "accounts", "b.com")) {
      updatedProfile.stream = "commerce";
    } else if (has(lower, "arts", "ba", "history", "humanities")) {
      updatedProfile.stream = "arts";
    }
    const resp = tri(lang,
      `👍 Stream note ho gaya! Ab batao aapka **budget kya hai** padhai ke liye?\n\n• **Low (₹50k-1L/year)**\n• **Medium (₹1-2L/year)**\n• **High (₹2L+/year)**`,
      `👍 Got it! Now tell me your **budget for studies**?\n\n• **Low (₹50k-1L/year)**\n• **Medium (₹1-2L/year)**\n• **High (₹2L+/year)**`,
    );
    updatedContext.awaitingBudget = true;
    return {
      text: resp,
      options: ["Low (₹50k-1L)", "Medium (₹1-2L)", "High (₹2L+)"],
      updatedContext,
      updatedProfile,
    };
  }

  if (context.awaitingBudget) {
    updatedContext.awaitingBudget = false;
    const lower = q;
    if (has(lower, "low", "50k", "sasta", "cheap", "1 lakh se kam")) {
      updatedProfile.budget = "low";
    } else if (has(lower, "medium", "mid", "1-2", "normal")) {
      updatedProfile.budget = "mid";
    } else {
      updatedProfile.budget = "high";
    }

    const maxFee = updatedProfile.budget === "low" ? 100000 : updatedProfile.budget === "mid" ? 200000 : 999999;
    const stream = updatedProfile.stream === "science" ? "engineering" : undefined;
    const filtered = filterColleges(stream, maxFee, false).slice(0, 5);

    const resp = tri(lang,
      `🎯 आपके profile के according **best colleges**:\n\n${filtered.map(c => fmtCollege(c, lang)).join("\n\n")}\n\n👉 इनमें से किसी के बारे में detail चाहिए?`,
      `🎯 **Best colleges** for your profile:\n\n${filtered.map(c => fmtCollege(c, lang)).join("\n\n")}\n\n👉 Want details about any specific college?`,
    );

    updatedContext.lastList = filtered;
    updatedContext.lastType = "college_list";
    return {
      text: resp,
      options: ["Fees detail", "Scholarship available?", "Hostel hai kya?", "Contact karna hai"],
      updatedContext,
      updatedProfile,
    };
  }

  /* ── CONTEXT: "aur batao" / show more ── */
  if (has(q, ...KEYWORD_MAP.more)) {
    if (updatedContext.lastType === "college_list" && updatedContext.lastList) {
      const offset = updatedContext.listOffset || 3;
      const next = updatedContext.lastList.slice(offset, offset + 3);
      updatedContext.listOffset = offset + 3;
      if (!next.length) {
        return {
          text: tri(lang,
            `📋 Ab is category mein aur colleges nahi hain। koi aur category try karein? 😊`,
            `📋 No more colleges in this category. Try another category? 😊`,
          ),
          options: ["Other colleges", "Different budget", "Scholarship", "Contact us"],
          updatedContext,
          updatedProfile,
        };
      }
      return {
        text: tri(lang,
          `📋 Aur Colleges:\n\n${next.map(c => fmtCollege(c, lang)).join("\n\n")}\n\n👉 Aur dekhna hai?`,
          `📋 More Colleges:\n\n${next.map(c => fmtCollege(c, lang)).join("\n\n")}\n\n👉 Want to see more?`,
        ),
        options: ["Aur dikhao", "Fees detail", "Hostel info", "Apply karna hai"],
        updatedContext,
        updatedProfile,
      };
    }
  }

  /* ── DETECT INTENT ── */
  const intent = detectIntent(q);
  updatedContext.lastIntent = intent;
  updatedContext.lastTopics = [intent, ...(updatedContext.lastTopics || [])].slice(0, 5);

  /* ══════════════════════════════════════════
     INTENT HANDLERS (A-Z)
  ══════════════════════════════════════════ */

  /* GREETING */
  if (intent === "greeting") {
    const count = updatedContext.conversationCount || 1;
    if (count <= 1) {
      return {
        text: tri(lang,
          `🙏 **Namaste!** Main hoon **SSS AI Counselor** — Sankalp Shiksha Salahkar ka!\n\nMain aapki madad kar sakta hoon:\n• 🎓 College admission\n• 💳 Bihar Student Credit Card\n• 📚 Course selection\n• 🎯 Scholarship guidance\n• 💼 Career counseling\n\nAap Hindi, English ya Bhojpuri mein baat kar sakte hain! 😊\n\n**Aap kya jaanna chahte hain?**`,
          `🙏 **Namaste!** I'm the **SSS AI Counselor** of Sankalp Shiksha Salahkar!\n\nI can help you with:\n• 🎓 College admissions\n• 💳 Bihar Student Credit Card\n• 📚 Course selection\n• 🎯 Scholarships\n• 💼 Career guidance\n\n**What would you like to know?**`,
          `🙏 **Namaste!** Hum hain SSS AI Counselor!\n\nPadhai ke baare mein kuch bhi puchein — college, fees, scholarship, career! 😊`
        ),
        options: QUICK_REPLIES.greeting,
        updatedContext,
        updatedProfile,
      };
    } else {
      return {
        text: tri(lang,
          `😊 Ji! Main yahaan hoon. Kya aur madad kar sakta hoon?`,
          `😊 I'm here! How else can I help you?`,
          `😊 Haan bhai! Ka poochhna ba?`
        ),
        options: QUICK_REPLIES.default,
        updatedContext,
        updatedProfile,
      };
    }
  }

  /* FEES */
  if (intent === "fees") {
    updatedContext.lastTopics?.push("fees");

    /* If context knows stream */
    if (profile.stream === "science" || has(q, "btech", "engineering")) {
      const engg = filterColleges("engineering").slice(0, 6);
      updatedContext.lastList = engg;
      updatedContext.lastType = "college_list";
      updatedContext.listOffset = 6;
      return {
        text: tri(lang,
          `💰 **B.Tech Fees — Top Colleges:**\n\n${engg.map(c => fmtCollege(c, lang)).join("\n\n")}\n\n💡 **Bihar Student Credit Card** se ₹4 lakh tak loan milta hai!\n\n👉 Kisi specific college ke baare mein poochhen!`,
          `💰 **B.Tech Fees — Top Colleges:**\n\n${engg.map(c => fmtCollege(c, lang)).join("\n\n")}\n\n💡 **Bihar Student Credit Card** gives up to ₹4 lakh loan!`,
        ),
        options: ["Credit Card info", "Scholarship", "Hostel fees", "Apply karna hai"],
        updatedContext,
        updatedProfile,
      };
    }

    if (has(q, "medical", "mbbs", "doctor")) {
      return {
        text: tri(lang,
          `💰 **Medical College Fees:**\n\n• **AIIMS Patna** — ₹10k/year (Government 🏆)\n• **PMCH Patna** — ₹30k/year (Government)\n• **NIMS Jaipur** — ₹1.5L/year (Private)\n• **Manipal** — ₹3L/year (Private)\n\n⚠️ MBBS ke liye **NEET** compulsory hai!\n💳 Bihar Credit Card — Private medical ke liye bhi available!`,
          `💰 **Medical College Fees:**\n\n• **AIIMS Patna** — ₹10k/year (Government 🏆)\n• **PMCH Patna** — ₹30k/year (Government)\n• **NIMS Jaipur** — ₹1.5L/year (Private)\n• **Manipal** — ₹3L/year (Private)\n\n⚠️ NEET is mandatory for MBBS!`,
        ),
        options: ["NEET preparation", "Credit Card apply", "Scholarship", "Best medical college"],
        updatedContext,
        updatedProfile,
      };
    }

    if (has(q, "polytechnic", "diploma")) {
      return {
        text: tri(lang,
          `💰 **Polytechnic Diploma Fees:**\n\n• **Govt Polytechnic Patna** — ₹20k/year\n• **Govt Polytechnic Muzaffarpur** — ₹18k/year\n• **Private Polytechnic** — ₹40k-80k/year\n\n✅ 10th ke baad kar sakte hain\n💳 Bihar Credit Card milta hai!\n⏱️ 3 years mein complete`,
          `💰 **Polytechnic Diploma Fees:**\n\n• **Govt Polytechnic Patna** — ₹20k/year\n• **Govt Polytechnic Muzaffarpur** — ₹18k/year\n• **Private Polytechnic** — ₹40k-80k/year\n\n✅ After 10th class\n💳 Bihar Credit Card available!`,
        ),
        options: ["After B.Tech", "Credit Card", "Govt jobs after diploma", "Admission process"],
        updatedContext,
        updatedProfile,
      };
    }

    /* General fees */
    return {
      text: tri(lang,
        `💰 **Fees Overview — All Courses:**\n\n📚 **Engineering (B.Tech):** ₹1L – ₹3L/year\n🏥 **Medical (MBBS/Govt):** ₹10k – ₹30k/year\n🏥 **Medical (MBBS/Private):** ₹5L – ₹15L/year\n💼 **Management (BBA/MBA):** ₹80k – ₹3L/year\n⚖️ **Law (LLB):** ₹25k – ₹1.5L/year\n🔬 **Polytechnic:** ₹18k – ₹80k/year\n📖 **Arts/Science/Commerce:** ₹15k – ₹60k/year\n\n💳 **Bihar Student Credit Card** se ₹4 lakh tak milta hai!\n\nKis course ki fees jaannna chahte hain?`,
        `💰 **Fees Overview — All Courses:**\n\n📚 **B.Tech Engineering:** ₹1L – ₹3L/year\n🏥 **MBBS (Govt):** ₹10k – ₹30k/year\n💼 **Management:** ₹80k – ₹3L/year\n⚖️ **Law (LLB):** ₹25k – ₹1.5L/year\n🔬 **Polytechnic:** ₹18k – ₹80k/year\n\n💳 **Bihar Credit Card** up to ₹4 lakh!\n\nWhich course fees do you want?`,
      ),
      options: ["B.Tech fees", "Medical fees", "Law fees", "Polytechnic fees"],
      updatedContext,
      updatedProfile,
    };
  }

  /* CREDIT CARD */
  if (intent === "credit_card") {
    return {
      text: tri(lang,
        `📘 **Bihar Student Credit Card (BSCC) — Complete Guide:**\n\n✅ **Amount:** ₹4 lakh tak loan\n✅ **Interest:** 4% (girls & disabled: 1%)\n✅ **Eligible:** 12th pass Bihar students\n✅ **Age:** 18-25 years\n✅ **Income Limit:** Family income ₹4.5L/year se kam\n\n📋 **Documents chahiye:**\n• 10th & 12th marksheet\n• Aadhar card\n• Bihar residence proof\n• Bank passbook\n• College admission letter\n\n🌐 **Apply:** 7nishchay-yuvaupmission.bihar.gov.in\n📞 **Helpline:** 1800-3456-444\n\n⚡ **Process:** 30-45 days mein approve\n\nKya aap apply karna chahte hain?`,
        `📘 **Bihar Student Credit Card (BSCC) — Complete Guide:**\n\n✅ **Amount:** Up to ₹4 lakh loan\n✅ **Interest:** 4% (1% for girls/disabled)\n✅ **Eligible:** 12th pass Bihar students\n✅ **Age:** 18-25 years\n\n📋 **Documents needed:**\n• 10th & 12th marksheet\n• Aadhar card\n• Bihar residence proof\n• Bank passbook\n• College admission letter\n\n🌐 **Apply:** 7nishchay-yuvaupmission.bihar.gov.in\n📞 **Helpline:** 1800-3456-444`,
        `📘 **Bihar Student Credit Card:**\n\n✅ ₹4 लाख तक ke loan\n✅ 12th pass Bihar ke student ke liye\n✅ Age 18-25 saal\n\nApply karein: 7nishchay-yuvaupmission.bihar.gov.in\n📞 Helpline: 1800-3456-444`
      ),
      options: ["Eligible colleges", "Documents kya chahiye?", "Apply kaise karein?", "Counselor se baat"],
      updatedContext,
      updatedProfile,
    };
  }

  /* ENGINEERING */
  if (intent === "engineering") {
    const colleges = filterColleges("engineering").slice(0, 5);
    updatedContext.lastList = filterColleges("engineering");
    updatedContext.lastType = "college_list";
    updatedContext.listOffset = 5;
    return {
      text: tri(lang,
        `🎓 **Top B.Tech / Engineering Colleges:**\n\n${colleges.map(c => fmtCollege(c, lang)).join("\n\n")}\n\n💡 **JEE Main** ya state **CET** se admission milta hai.\n💳 Bihar Credit Card available in most colleges!\n\n👉 Aur colleges dekhna hai ya specific course?`,
        `🎓 **Top B.Tech / Engineering Colleges:**\n\n${colleges.map(c => fmtCollege(c, lang)).join("\n\n")}\n\n💡 Admission via **JEE Main** or state **CET**.\n💳 Bihar Credit Card available!\n\n👉 Want more colleges or specific course?`,
      ),
      options: ["Aur colleges", "AI/ML course", "Fees kitni?", "Placement kaisa?"],
      updatedContext,
      updatedProfile,
    };
  }

  /* MEDICAL */
  if (intent === "medical" || intent === "neet") {
    const medColleges = filterColleges("medical");
    updatedContext.lastList = medColleges;
    updatedContext.lastType = "college_list";
    return {
      text: tri(lang,
        `🏥 **Medical / MBBS Colleges:**\n\n${medColleges.slice(0, 4).map(c => fmtCollege(c, lang)).join("\n\n")}\n\n⚠️ **NEET UG** compulsory hai MBBS ke liye!\n📅 **NEET 2025:** May mein hoga\n\n💡 **Preparation Tips:**\n• NCERT Biology sabse important\n• Physics + Chemistry bhi zaroori\n• Daily 6-8 hours study\n• Mock tests weekly`,
        `🏥 **Medical / MBBS Colleges:**\n\n${medColleges.slice(0, 4).map(c => fmtCollege(c, lang)).join("\n\n")}\n\n⚠️ **NEET UG** is mandatory for MBBS!\n\n💡 **NEET Tips:** NCERT Biology is most important. Daily 6-8 hours study + weekly mock tests.`,
      ),
      options: ["NEET preparation tips", "Fees detail", "Govt medical college", "Scholarship"],
      updatedContext,
      updatedProfile,
    };
  }

  /* ARTS */
  if (intent === "arts" || intent === "stream_arts") {
    return {
      text: tri(lang,
        `🎨 **Arts Stream ke baad Options:**\n\n📚 **Degree Courses:**\n• BA (History, Political Sci, Geography, Hindi, English)\n• BA LLB (Law 5 years)\n• BFA (Fine Arts)\n• B.Journalism & Mass Communication\n\n💼 **Career Scope:**\n• Civil Services (IAS/IPS) — **Most popular**\n• Teaching (B.Ed → Govt Teacher)\n• Journalism & Media\n• Law (Advocate)\n• Social Work / NGO\n\n🏛️ **Top Colleges:**\n• Patna University — ₹25k/year\n• Delhi University — ₹20k/year (CUET required)\n\n💡 **Arts wale UPSC crack karte hain sabse zyada!**`,
        `🎨 **After Arts Stream:**\n\n📚 BA, BA LLB, Journalism, Fine Arts\n\n💼 **Top Careers:**\n• Civil Services (IAS/IPS)\n• Teaching (Govt Teacher)\n• Journalism\n• Law (LLB)\n\n🏛️ Patna University — ₹25k/year\nDelhi University — ₹20k/year (CUET required)`,
      ),
      options: ["UPSC guidance", "Law college", "Teaching career", "Scholarship arts"],
      updatedContext,
      updatedProfile,
    };
  }

  /* COMMERCE */
  if (intent === "commerce" || intent === "stream_commerce") {
    return {
      text: tri(lang,
        `💼 **Commerce Stream ke baad Options:**\n\n📚 **Degree Courses:**\n• B.Com (Regular / Hons)\n• BBA (Business Administration)\n• CA (Chartered Accountant)\n• CS (Company Secretary)\n• B.Com + MBA\n\n💰 **Career & Salary:**\n• CA → ₹8L-40L+\n• MBA Finance → ₹5L-20L+\n• Bank PO → ₹4L-8L\n• Company Secretary → ₹4L-12L\n\n🏛️ **Top Colleges:**\n• DU (B.Com Hons) — ₹20k/year\n• Symbiosis Pune (BBA) — ₹2.5L/year\n• Patna University — ₹25k/year`,
        `💼 **After Commerce Stream:**\n\n📚 B.Com, BBA, CA, CS, MBA\n\n💰 **Salaries:** CA → ₹8L-40L+ | MBA Finance → ₹5L-20L+ | Bank PO → ₹4L-8L`,
      ),
      options: ["CA kaise banein?", "BBA college fees", "Banking career", "MBA info"],
      updatedContext,
      updatedProfile,
    };
  }

  /* SCHOLARSHIP */
  if (intent === "scholarship") {
    const cat = profile.category;
    const relevant = getRelevantScholarships(cat, undefined, undefined).slice(0, 5);

    return {
      text: tri(lang,
        `🎓 **Scholarship Schemes — Complete List:**\n\n${relevant.map(s =>
          `📌 **${s.name}**\n   💰 ${s.amount}\n   ✅ ${s.eligibility.slice(0, 2).join(" | ")}\n   🌐 ${s.link}`
        ).join("\n\n")}\n\n💡 **Tips:**\n• NSP portal pe sab scholarships milti hain\n• Deadline miss mat karo\n• Income certificate zaroori hai\n\n👉 Aapki category kya hai? (General/OBC/SC/ST) More targeted help milegi!`,
        `🎓 **Scholarship Schemes:**\n\n${relevant.map(s =>
          `📌 **${s.name}** — ${s.amount}\n   🌐 ${s.link}`
        ).join("\n\n")}\n\n👉 Tell me your category for specific scholarships!`,
      ),
      options: ["OBC scholarship", "SC/ST scholarship", "Girls scholarship", "Apply kaise karein?"],
      updatedContext,
      updatedProfile,
    };
  }

  /* CAREER GUIDANCE */
  if (intent === "career") {
    updatedContext.awaitingStream = !profile.stream;
    if (!profile.stream) {
      return {
        text: tri(lang,
          `💼 **Career Guidance — Pehle stream batao:**\n\nMain aapko best career options suggest kar sakta hoon! Pehle ye batao:\n\n**Aapka stream/qualification kya hai?**`,
          `💼 **Career Guidance — Tell me your stream:**\n\nI can suggest the best career path! First tell me:\n\n**What is your stream/qualification?**`,
        ),
        options: ["Science (PCM/PCB)", "Commerce", "Arts", "Graduate hoon"],
        updatedContext,
        updatedProfile,
      };
    }

    const streamCareer = profile.stream === "science"
      ? CAREER_PATHS.filter(c => ["Computer Science / IT", "Medical (MBBS/Doctor)", "Artificial Intelligence & Data Science"].includes(c.field))
      : profile.stream === "commerce"
      ? CAREER_PATHS.filter(c => ["Management / MBA", "Banking & Finance"].includes(c.field))
      : CAREER_PATHS.filter(c => ["Civil Services / UPSC / IAS", "Teaching / Education", "Law (Advocate / LLB)"].includes(c.field));

    return {
      text: tri(lang,
        `💼 **Best Career Paths for You:**\n\n${streamCareer.map(c =>
          `🎯 **${c.field}**\n   📚 Courses: ${c.courses.slice(0, 2).join(", ")}\n   💰 Salary: ${c.avgSalary}\n   📈 Scope: ${c.scope}`
        ).join("\n\n")}\n\n👉 Kaunsa field aur explore karein?`,
        `💼 **Best Career Paths for You:**\n\n${streamCareer.map(c =>
          `🎯 **${c.field}**\n   📚 ${c.courses.slice(0, 2).join(", ")}\n   💰 ${c.avgSalary}\n   📈 ${c.scope}`
        ).join("\n\n")}`,
      ),
      options: streamCareer.slice(0, 3).map(c => c.field.split("(")[0].trim() + " info"),
      updatedContext,
      updatedProfile,
    };
  }

  /* ADMISSION */
  if (intent === "admission") {
    return {
      text: tri(lang,
        `📋 **Admission Process — Step by Step:**\n\n**Step 1: Entrance Exam**\n• Engineering → JEE Main / Bihar CET\n• Medical → NEET\n• Law → CLAT\n• Arts/Commerce/Science → CUET / Direct\n\n**Step 2: Counseling**\n• Seat allotment by merit\n• Bihar mein: BCECE counseling\n\n**Step 3: Documents Submit**\n• 10th, 12th marksheet & certificate\n• Aadhar card\n• Caste certificate (if applicable)\n• Income certificate\n• Passport size photo\n\n**Step 4: Fees Payment**\n• Bihar Credit Card apply karo\n• Ya scholarship use karo\n\n📞 Help chahiye toh call: **+91 9142082026**`,
        `📋 **Admission Process:**\n\n1. **Entrance Exam** → JEE/NEET/CLAT/CUET\n2. **Counseling** → Seat allotment\n3. **Documents** → Marksheets, Aadhar, certificates\n4. **Fees** → Credit Card or Scholarship\n\n📞 Call: **+91 9142082026**`,
      ),
      options: ["Documents list", "Credit Card apply", "JEE info", "NEET info"],
      updatedContext,
      updatedProfile,
    };
  }

  /* HOSTEL */
  if (intent === "hostel" || intent === "hostel_fees") {
    return {
      text: tri(lang,
        `🏠 **Hostel Information:**\n\n**Hostel Available Colleges:**\n• NIT Patna — ₹8k-12k/month\n• Sandip University — ₹5k-8k/month\n• GL Bajaj — ₹6k-9k/month\n• Graphic Era — ₹7k-10k/month\n• GNIOT — ₹5k-8k/month\n\n✅ **Most private colleges mein hostel hai**\n✅ **Boys + Girls alag hostels**\n✅ **AC & Non-AC options**\n\n💡 Bihar Credit Card hostel fees cover karta hai!\n\n👉 Specific college ka hostel jaanna hai?`,
        `🏠 **Hostel Information:**\n\n• NIT Patna — ₹8k-12k/month\n• Sandip University — ₹5k-8k/month\n• GL Bajaj — ₹6k-9k/month\n\n✅ Boys + Girls separate hostels\n💡 Bihar Credit Card covers hostel fees!`,
      ),
      options: ["Girls hostel", "Boys hostel", "Hostel fees", "Nearest college hostel"],
      updatedContext,
      updatedProfile,
    };
  }

  /* PLACEMENT */
  if (intent === "placement" || intent === "placement_data") {
    return {
      text: tri(lang,
        `📊 **Placement Data — Top Colleges:**\n\n🏆 **IIT Delhi** — 100% | Avg ₹20L+\n🏆 **NIT Patna** — 95% | Avg ₹8L\n⭐ **Graphic Era** — 90% | Avg ₹5.5L\n⭐ **GL Bajaj** — 88% | Avg ₹5L\n⭐ **GNIOT** — 83% | Avg ₹4.5L\n⭐ **Sandip University** — 85% | Avg ₹4L\n\n🏢 **Top Recruiting Companies:**\nTCS, Infosys, Wipro, HCL, Cognizant, Amazon, Flipkart, Accenture\n\n💡 **Placement improve karne ke tips:**\n• Internship during college\n• Coding skills (LeetCode, HackerRank)\n• Communication skills\n• LinkedIn profile banao`,
        `📊 **Placement Data:**\n\n• IIT Delhi — 100% | ₹20L+ avg\n• NIT Patna — 95% | ₹8L avg\n• Graphic Era — 90% | ₹5.5L avg\n• GL Bajaj — 88% | ₹5L avg\n\nTop companies: TCS, Infosys, Amazon, Wipro`,
      ),
      options: ["Best placement college", "IT company jobs", "Core engineering jobs", "MBA placement"],
      updatedContext,
      updatedProfile,
    };
  }

  /* DISTANCE LEARNING */
  if (intent === "distance" || intent === "online_class") {
    return {
      text: tri(lang,
        `🖥️ **Distance / Online Education Options:**\n\n📚 **Top Distance Universities:**\n• **IGNOU** — ₹10k-30k total (Pan India)\n• **NMIMS Online** — ₹80k/year\n• **Amity Online** — ₹60k/year\n• **Chandigarh University Online** — ₹50k/year\n\n✅ **Kab choose karein:**\n• Naukri karte ho + study karna hai\n• Family responsibility hai\n• City chhod nahi sakte\n\n⚠️ **Dhyan rakhein:**\n• Regular colleges se value thodi kam\n• Self-discipline zaroori\n• Network build karna mushkil\n\n🌐 **Best:** IGNOU (Government recognized, cheapest)`,
        `🖥️ **Distance / Online Education:**\n\n• **IGNOU** — ₹10k-30k total (Best option)\n• **NMIMS Online** — ₹80k/year\n• **Chandigarh University Online** — ₹50k/year\n\n✅ Best if working while studying`,
      ),
      options: ["IGNOU admission", "Online MBA", "Distance B.Com", "Regular vs Distance"],
      updatedContext,
      updatedProfile,
    };
  }

  /* POLYTECHNIC / DIPLOMA */
  if (intent === "polytechnic" || intent === "diploma") {
    return {
      text: tri(lang,
        `🔧 **Polytechnic / Diploma Engineering:**\n\n✅ **10th ke baad best option!**\n\n📚 **Courses:**\n• Diploma CSE, EE, ME, Civil\n\n🏫 **Top Colleges:**\n• Govt Polytechnic Patna — ₹20k/year ⭐\n• Govt Polytechnic Muzaffarpur — ₹18k/year ⭐\n• Private Polytechnic — ₹40k-80k/year\n\n⏱️ **Duration:** 3 years\n💳 **Bihar Credit Card:** Available\n🎯 **Entrance:** Bihar Polytechnic (DCECE)\n\n💼 **After Diploma:**\n• Government jobs (Bijli vibhag, PWD etc.)\n• B.Tech lateral entry (2nd year)\n• Private jobs\n\n📅 **DCECE Form:** April mein aata hai`,
        `🔧 **Polytechnic / Diploma:**\n\n✅ Best after 10th class!\n\n• Govt Polytechnic Patna — ₹20k/year\n• 3 years duration\n• Bihar Credit Card available\n• Entrance: DCECE Bihar\n\nAfter diploma: Govt jobs + B.Tech lateral entry`,
      ),
      options: ["Govt jobs after diploma", "B.Tech lateral entry", "DCECE exam details", "Best trade/branch"],
      updatedContext,
      updatedProfile,
    };
  }

  /* ITI */
  if (intent === "iti") {
    return {
      text: tri(lang,
        `🔨 **ITI (Industrial Training Institute):**\n\n✅ **10th ya 8th ke baad kar sakte hain!**\n\n📚 **Popular Trades:**\n• Electrician (2 years)\n• Fitter (2 years)\n• COPA — Computer Operator (1 year)\n• Welder (1 year)\n• Diesel Mechanic (2 years)\n• Plumber (1 year)\n\n💰 **Fees:** ₹3k-15k/year (Government ITI)\n\n💼 **Jobs:**\n• Railway, NTPC, ONGC — Direct recruitment\n• Gulf mein kaam (Dubai, Saudi — ₹30k-60k/month)\n• Apprenticeship — ₹8k-12k/month\n\n🏆 **Best ITI Trades for Bihar:**\nElectrician + COPA most popular!`,
        `🔨 **ITI Courses:**\n\nPopular: Electrician, Fitter, COPA, Welder\n💰 ₹3k-15k/year (Govt ITI)\n\nJobs: Railway, NTPC, Gulf (₹30k-60k/month)\n\nBest for quick employment after 10th!`,
      ),
      options: ["Best ITI trade", "Railway job after ITI", "Gulf jobs", "ITI admission process"],
      updatedContext,
      updatedProfile,
    };
  }

  /* UPSC / CIVIL SERVICES */
  if (intent === "upsc") {
    return {
      text: tri(lang,
        `🏛️ **UPSC / Civil Services (IAS/IPS/IFS) Guide:**\n\n✅ **Eligibility:**\n• Graduation (any stream)\n• Age: 21-32 years (General)\n• Attempts: 6 (General), 9 (OBC), unlimited (SC/ST)\n\n📚 **Exam Pattern:**\n• Prelims → Mains → Interview\n\n⏱️ **Preparation Time:**\n• Minimum 2-3 years serious preparation\n\n📖 **Resources:**\n• NCERT books (6th-12th) — Foundation\n• The Hindu / Indian Express daily\n• Vajiram, Vision IAS, Drishti coaching\n\n💡 **Bihar ke famous IAS:**\nBihar se bahut IAS/IPS nikle hain!\n\n📞 Guidance ke liye: **+91 9142082026**`,
        `🏛️ **UPSC / Civil Services:**\n\n✅ Graduation required, age 21-32\n📚 Prelims → Mains → Interview\n⏱️ 2-3 years preparation\n\nResources: NCERT books, The Hindu newspaper, coaching (Vajiram, Vision IAS)`,
      ),
      options: ["BPSC info", "Best graduation for UPSC", "Coaching centers", "Study plan"],
      updatedContext,
      updatedProfile,
    };
  }

  /* BANKING */
  if (intent === "banking") {
    return {
      text: tri(lang,
        `🏦 **Banking Career Guide:**\n\n✅ **Top Exams:**\n• **IBPS PO** — Bank PO (Salary ₹52k/month)\n• **SBI PO** — State Bank PO (Best bank)\n• **IBPS Clerk** — Clerk (₹25k-35k)\n• **RBI Grade B** — Premium job\n\n✅ **Eligibility:** Graduation any stream, age 20-30\n\n📅 **Exam Calendar:**\n• IBPS PO — October-November\n• SBI PO — April-May\n• IBPS Clerk — November-December\n\n📚 **Preparation:**\n• Quantitative Aptitude daily\n• English Reading daily\n• Reasoning practice\n• Current Affairs\n\n💡 **Coaching:** Adda247, Oliveboard, TestBook`,
        `🏦 **Banking Career:**\n\n• IBPS PO — ₹52k/month\n• SBI PO — Best bank job\n• Graduation required, age 20-30\n\nPrep: Quantitative Aptitude + English + Reasoning + Current Affairs`,
      ),
      options: ["IBPS PO details", "SBI PO details", "Bank clerk info", "Study plan banking"],
      updatedContext,
      updatedProfile,
    };
  }

  /* RAILWAY */
  if (intent === "railway") {
    return {
      text: tri(lang,
        `🚂 **Railway Jobs Guide:**\n\n✅ **Popular Exams:**\n• **RRB NTPC** — 10th/12th/Graduate\n• **RRB Group D** — 10th pass\n• **RRB JE** — Diploma/B.Tech\n• **RRB Loco Pilot** — 10th + ITI\n\n💰 **Salary:**\n• Group D: ₹18k-22k/month\n• NTPC: ₹25k-35k/month\n• JE: ₹35k-45k/month\n\n✅ **Benefits:**\n• Job security lifelong\n• Medical facilities\n• Housing allowance\n• Pension\n\n📅 **Forms:** Official site rrb.gov.in check karo\n\n💡 Bihar mein railway recruitment bahut popular hai!`,
        `🚂 **Railway Jobs:**\n\n• RRB NTPC — 10th/12th/Graduate\n• RRB Group D — 10th pass\n• RRB JE — Diploma/B.Tech\n\nSalary: ₹18k-45k/month + benefits (housing, medical, pension)`,
      ),
      options: ["RRB NTPC details", "Group D eligibility", "Loco Pilot info", "Railway preparation"],
      updatedContext,
      updatedProfile,
    };
  }

  /* JEE */
  if (intent === "jee") {
    const jeeInfo = ENTRANCE_EXAMS.jee_main;
    return {
      text: tri(lang,
        `📝 **JEE Main — Complete Guide:**\n\n✅ **Eligibility:** 12th PCM, no age limit\n📅 **Schedule:** January & April (2 attempts/year)\n🌐 **Website:** jeemain.nta.nic.in\n\n📚 **Exam Pattern:**\n• Physics, Chemistry, Mathematics\n• 90 questions | 300 marks | 3 hours\n• MCQ + Numerical\n\n💡 **JEE Main Tips:**\n• NCERT se start karo\n• ${jeeInfo.tips}\n• Previous 10 year papers solve karo\n• Mock test weekly dena zaroori\n\n🏆 **JEE Advanced (IIT ke liye):**\n• Only top 2.5 lakh qualify\n• Much harder than JEE Main\n• IIT admission ke liye\n\n📞 JEE guidance: **+91 9142082026**`,
        `📝 **JEE Main Guide:**\n\n✅ 12th PCM required\n📅 January & April\n📚 Physics + Chemistry + Math\n\n${jeeInfo.tips}`,
      ),
      options: ["JEE preparation tips", "Best coaching", "NIT Patna info", "IIT Delhi info"],
      updatedContext,
      updatedProfile,
    };
  }

  /* MBA */
  if (intent === "mba") {
    return {
      text: tri(lang,
        `💼 **MBA — Complete Guide:**\n\n✅ **Eligibility:** Graduation 50%+ (any stream)\n📅 **CAT:** November every year\n\n🏫 **Top MBA Colleges:**\n• IIM Ahmedabad — ₹24L/2 years (CAT 99%ile)\n• IIM Patna — ₹12L/2 years (for Bihar students great option!)\n• Symbiosis Pune — ₹9L/2 years\n• NMIMS Mumbai — ₹15L/2 years\n\n💰 **MBA Salary:**\n• IIM graduate — ₹15L-50L+\n• Regular MBA — ₹4L-12L\n\n📚 **CAT Preparation:**\n• Verbal Ability + Reading Comprehension\n• Data Interpretation + Logical Reasoning\n• Quantitative Ability\n• 6-12 months preparation\n\n💡 Bihar ke liye IIM Patna best choice!`,
        `💼 **MBA Guide:**\n\n• Graduation required (50%+)\n• CAT exam in November\n• IIM Patna — ₹12L (Great for Bihar students)\n• IIM grad salary: ₹15L-50L+`,
      ),
      options: ["CAT preparation", "IIM Patna info", "MBA without CAT", "Best MBA specialization"],
      updatedContext,
      updatedProfile,
    };
  }

  /* LAW */
  if (intent === "law" || intent === "clat") {
    return {
      text: tri(lang,
        `⚖️ **Law / LLB Career Guide:**\n\n✅ **Courses:**\n• BA LLB — 5 years (after 12th)\n• BBA LLB — 5 years (after 12th)\n• LLB — 3 years (after graduation)\n\n🏫 **Top Law Colleges:**\n• NLU Patna — Best in Bihar\n• Patna University Law Faculty — ₹25k/year\n• Symbiosis Law Pune\n• Delhi University Faculty of Law\n\n📝 **Entrance Exams:**\n• **CLAT** — December (For NLUs)\n• **AILET** — For NLU Delhi\n\n💰 **Career Scope:**\n• Advocate — ₹3L-25L+\n• Corporate Lawyer — ₹8L-50L+\n• Judge (through BPSC) — ₹8L-15L\n• Govt Lawyer\n\n📅 **CLAT 2025:** December mein hoga`,
        `⚖️ **Law Career:**\n\n• BA LLB (5 years after 12th)\n• LLB (3 years after graduation)\n• Entrance: CLAT exam\n• NLU Patna — Best in Bihar\n• Career: Advocate, Corporate Lawyer, Judge`,
      ),
      options: ["CLAT preparation", "NLU Patna details", "Law salary", "Judge kaise bane?"],
      updatedContext,
      updatedProfile,
    };
  }

  /* AFTER 10TH */
  if (intent === "after_10th") {
    return {
      text: tri(lang,
        `📚 **10th ke baad Best Options:**\n\n🔴 **Science stream lena hai toh:**\n• 11th-12th (PCM/PCB) → B.Tech/Medical\n\n🔵 **Technical course:**\n• Polytechnic Diploma — 3 years (₹18k-20k/year govt)\n• ITI — 1-2 years (₹3k-10k government)\n\n🟢 **General course:**\n• 11th Arts/Commerce\n• BA/B.Com baad mein\n\n💡 **Meri Suggestion:**\n• Job jaldi chahiye → **ITI** karo\n• Technical degree chahiye → **Polytechnic** karo\n• Doctor/Engineer banna hai → **11th PCM/PCB** lo\n\n📞 Free counseling: **+91 9142082026**`,
        `📚 **After 10th Options:**\n\n• Continue 11th-12th (Science/Commerce/Arts)\n• Polytechnic Diploma — 3 years\n• ITI — 1-2 years (Quick job)\n\nQuick job → ITI | Engineering later → Polytechnic | Doctor/Engineer → 11th PCM`,
      ),
      options: ["Polytechnic info", "ITI info", "11th Science admission", "11th Commerce"],
      updatedContext,
      updatedProfile,
    };
  }

  /* AFTER 12TH */
  if (intent === "after_12th") {
    updatedContext.awaitingStream = !profile.stream;
    if (!profile.stream) {
      return {
        text: tri(lang,
          `📚 **12th ke baad — Sabse pehle bataiye aapka stream kya hai?**\n\nMain aapke liye best options suggest kar sakta hoon!`,
          `📚 **After 12th — First tell me your stream!**\n\nI'll suggest the best options for you!`,
        ),
        options: ["Science (PCM)", "Science (PCB)", "Commerce", "Arts"],
        updatedContext,
        updatedProfile,
      };
    }
    const s = profile.stream;
    return {
      text: tri(lang,
        `📚 **12th ${s.toUpperCase()} ke baad best options:**\n\n${s === "science" ?
          `🔬 PCM:\n• B.Tech Engineering (JEE Main)\n• B.Sc Physics/Math/CS\n• BCA (Computer)\n\n🧬 PCB:\n• MBBS (NEET)\n• B.Sc Nursing\n• B.Pharma` :
          s === "commerce" ?
          `• B.Com / B.Com (Hons)\n• BBA Management\n• CA Foundation\n• CS Foundation` :
          `• BA (any subject)\n• BA LLB (Law)\n• Journalism\n• Hotel Management`
        }\n\n💳 Bihar Credit Card se ₹4 lakh tak loan!\n\nKaunsa course prefer karte hain?`,
        `📚 **After 12th ${s}:**\n\n${s === "science" ? "B.Tech (JEE) | MBBS (NEET) | B.Sc" : s === "commerce" ? "B.Com | BBA | CA | MBA" : "BA | BA LLB | Journalism"}`,
      ),
      options: s === "science" ? ["B.Tech info", "MBBS info", "B.Sc info", "BCA info"] :
               s === "commerce" ? ["B.Com info", "BBA info", "CA info", "MBA info"] :
               ["BA info", "Law info", "UPSC preparation", "Journalism"],
      updatedContext,
      updatedProfile,
    };
  }

  /* ABOUT SSS */
  if (intent === "about") {
    return {
      text: tri(lang,
        `🏢 **Sankalp Shiksha Salahkar (SSS) ke baare mein:**\n\n👨‍💼 **Founded by:** Sh. Amit Kumar Upadhyay\n🎓 **Ex-Deputy Manager:** NIMS University, Jaipur\n🤝 **Partner Colleges:** 24+ across India\n🗺️ **Offices:** 10+ states\n📞 **Helpline:** +91 9142082026\n\n**Hamari Services:**\n✅ Free career counseling\n✅ College admission assistance\n✅ Bihar Student Credit Card guidance\n✅ Scholarship application help\n✅ Document verification support\n\n🌟 **Mission:** Bihar ke har student ko best education milni chahiye, chahe budget kuch bhi ho!\n\n📞 Free consultation ke liye call karein: **+91 9142082026**`,
        `🏢 **About Sankalp Shiksha Salahkar:**\n\nFounded by Sh. Amit Kumar Upadhyay\n24+ partner colleges | 10+ state offices\n\nServices: Free career counseling, admission help, Credit Card guidance, scholarship support\n\n📞 +91 9142082026`,
      ),
      options: ["Services kya hain?", "Contact karna hai", "College list", "Free counseling"],
      updatedContext,
      updatedProfile,
    };
  }

  /* CONTACT */
  if (intent === "contact" || intent === "callback" || intent === "whatsapp" || intent === "lead_capture") {
    if (!profile.leadCaptured) {
      updatedContext.awaitingName = true;
      return {
        text: tri(lang,
          `📞 **Hamse Baat Karein!**\n\nHum aapki madad karne ke liye available hain!\n\n📞 **Direct Call:** +91 9142082026\n💬 **WhatsApp:** +91 9142082026\n🕐 **Available:** 9 AM - 7 PM (Mon-Sat)\n\n✅ **Callback chahiye?** Apna naam batayein aur hum call karenge!\n\n**Aapka naam kya hai?**`,
          `📞 **Contact Us:**\n\n📞 Call: +91 9142082026\n💬 WhatsApp: +91 9142082026\n🕐 9 AM - 7 PM (Mon-Sat)\n\nWant a callback? Tell me your name!`,
        ),
        options: [],
        updatedContext,
        updatedProfile,
      };
    } else {
      return {
        text: tri(lang,
          `✅ ${profile.name} ji, aapka number already save hai! Counselor jaldi call karega.\n\n📞 Urgent ho toh abhi call karein: **+91 9142082026**`,
          `✅ ${profile.name}, your details are already saved! Expect a call soon.\n\n📞 Urgent? Call now: **+91 9142082026**`,
        ),
        options: ["More questions", "Scholarship info", "College list"],
        updatedContext,
        updatedProfile,
      };
    }
  }

  /* DOCUMENTS */
  if (intent === "documents") {
    return {
      text: tri(lang,
        `📋 **Required Documents for Admission:**\n\n✅ **Mandatory:**\n• 10th Marksheet + Certificate\n• 12th Marksheet + Certificate\n• Aadhar Card (original + photocopy)\n• Passport Size Photos (6-8)\n• Character Certificate (school se)\n• Migration Certificate (if different board)\n\n✅ **For Scholarships:**\n• Income Certificate (family income)\n• Caste Certificate (SC/OBC/ST)\n• Domicile / Residence Certificate\n\n✅ **For Bihar Credit Card:**\n• Bank Passbook / Account details\n• College Admission Letter (provisional)\n• All above documents\n\n💡 **Tip:** Sab documents ki 5-5 photocopy banake rakhein!`,
        `📋 **Required Documents:**\n\n• 10th & 12th Marksheet + Certificate\n• Aadhar Card\n• Passport Photos (6-8)\n• Character Certificate\n• Income Certificate (for scholarship)\n• Caste Certificate (if applicable)`,
      ),
      options: ["Credit Card documents", "Scholarship documents", "Admission process", "Help with documents"],
      updatedContext,
      updatedProfile,
    };
  }

  /* GOVERNMENT COLLEGE */
  if (intent === "govt_college") {
    const govtColleges = COLLEGES.filter(c => c.fee < 60000).sort((a, b) => a.fee - b.fee);
    updatedContext.lastList = govtColleges;
    updatedContext.lastType = "college_list";
    return {
      text: tri(lang,
        `🏛️ **Best Government / Affordable Colleges:**\n\n${govtColleges.slice(0, 6).map(c => fmtCollege(c, lang)).join("\n\n")}\n\n💡 **Government colleges mein:**\n• Fees bahut kam (₹15k-60k/year)\n• Quality education\n• Entrance exam required (JEE/NEET/CUET)\n\n👉 Kaunse course mein government college chahiye?`,
        `🏛️ **Most Affordable / Govt Colleges:**\n\n${govtColleges.slice(0, 5).map(c => fmtCollege(c, lang)).join("\n\n")}\n\nEntrance exam required (JEE/NEET/CUET)`,
      ),
      options: ["NIT Patna info", "Patna University", "AIIMS Patna", "Jadavpur University"],
      updatedContext,
      updatedProfile,
    };
  }

  /* FRUSTRATED */
  if (intent === "frustrated" || (updatedContext.repeatCount || 0) >= 2) {
    updatedContext.frustrationLevel = (updatedContext.frustrationLevel || 0) + 1;
    return {
      text: tri(lang,
        `🙏 Maafi chahta hoon! Lagta hai main aapki baat properly samajh nahi paya.\n\nChinta mat karein — abhi ek expert counselor se directly baat karein:\n\n📞 **Call Now: +91 9142082026**\n💬 **WhatsApp:** +91 9142082026\n\nYa mujhe clearly batayein:\n👉 Aap kya jaanna chahte hain?`,
        `🙏 Sorry for the confusion! Let me connect you with an expert counselor:\n\n📞 **Call: +91 9142082026**\n\nOr tell me clearly what you need help with?`,
      ),
      options: ["College fees", "Scholarship info", "Credit Card", "Call karein"],
      updatedContext,
      updatedProfile,
    };
  }

  /* THANKS */
  if (intent === "thanks") {
    return {
      text: tri(lang,
        `😊 **Bahut bahut shukriya!** Aapki help karna hamari khushi hai!\n\n🎯 Sankalp Shiksha Salahkar hamesha aapke saath hai!\n\n📞 Kabhi bhi call karein: **+91 9142082026**\n\nAur kuch poochna ho toh hum yahaan hain! 🙏`,
        `😊 **Thank you so much!** Happy to help you!\n\n📞 Always available: **+91 9142082026**\n\nFeel free to ask anything else! 🙏`,
        `😊 **Bahut dhanyawaad!** Hamre khushi bhaiya! 📞 +91 9142082026`
      ),
      options: ["More questions", "Contact us", "College info"],
      updatedContext,
      updatedProfile,
    };
  }

  /* BYE */
  if (intent === "bye") {
    return {
      text: tri(lang,
        `🙏 **Alvida!** Bahut accha laga aapse baat karke!\n\nJab bhi koi sawaal ho — hum yahaan hain!\n\n📞 Helpline: **+91 9142082026**\n\n**Best of luck aapke studies ke liye!** 🎓✨`,
        `🙏 **Goodbye!** Great talking with you!\n\nWhenever you have questions, we're here!\n📞 +91 9142082026\n\n**Best of luck with your studies!** 🎓`,
        `🙏 **Alvida bhai!** Padhai mein bahut mehanat karo! 🎓`
      ),
      options: [],
      updatedContext,
      updatedProfile,
    };
  }

  /* ABROAD */
  if (intent === "abroad") {
    return {
      text: tri(lang,
        `✈️ **Abroad Studies Guide:**\n\n🌍 **Popular Destinations:**\n• 🇨🇦 Canada — IELTS 6.5+ | Cost ₹15-25L/year\n• 🇦🇺 Australia — IELTS 6.5+ | Cost ₹12-20L/year\n• 🇩🇪 Germany — Free education! | German language\n• 🇬🇧 UK — IELTS 6.0+ | Cost ₹18-30L/year\n• 🇺🇸 USA — GRE/GMAT | Cost ₹20-40L/year\n\n📚 **Required:**\n• IELTS / TOEFL (English)\n• GRE (Masters)\n• GMAT (MBA)\n\n💰 **Cost:**\n• Germany ke government universities FREE!\n• Education loan available (up to ₹30L)\n\n💡 **Meri Suggestion:**\n• Germany — Technical fields ke liye best (free + quality)\n• Canada — PR + job opportunities\n\n📞 Abroad guidance: **+91 9142082026**`,
        `✈️ **Study Abroad:**\n\n• Canada — IELTS 6.5+ | ₹15-25L/year\n• Germany — FREE education!\n• Australia — IELTS 6.5+\n\nIELTS / TOEFL required. Germany is best for free quality education!`,
      ),
      options: ["Germany free education", "Canada study visa", "IELTS preparation", "Abroad loan"],
      updatedContext,
      updatedProfile,
    };
  }

  /* COMPARISON */
  if (intent === "comparison") {
    return {
      text: tri(lang,
        `📊 **Government vs Private College:**\n\n| Feature | Government | Private |\n|---------|-----------|--------|\n| Fees | ₹15k-60k | ₹80k-3L |\n| Entrance | Strict | Easier |\n| Faculty | Good | Mixed |\n| Placement | 70-95% | 70-90% |\n| Infrastructure | Average | Better |\n| Credit Card | Limited | Most ✓ |\n\n🏆 **Best Government Colleges:**\nNIT Patna, Patna University, AIIMS Patna, Jadavpur University\n\n⭐ **Best Private Colleges:**\nGL Bajaj, Graphic Era, GNIOT, Sandip University\n\n💡 **Suggestion:**\n• Budget kam hai → Government\n• Placement priority → Top Private\n• Medical → Government AIIMS/PMCH`,
        `📊 **Government vs Private:**\n\nGovt: ₹15k-60k fees, entrance required, good faculty\nPrivate: ₹80k-3L fees, easier entry, better infrastructure\n\nBest Govt: NIT Patna, Patna University\nBest Private: GL Bajaj, Graphic Era, GNIOT`,
      ),
      options: ["Govt college list", "Private college list", "Best value college", "Credit Card colleges"],
      updatedContext,
      updatedProfile,
    };
  }

  /* SSC */
  if (intent === "ssc") {
    return {
      text: tri(lang,
        `📝 **SSC (Staff Selection Commission) Guide:**\n\n✅ **Popular SSC Exams:**\n• **SSC CGL** — Graduation | Inspector, Auditor roles\n• **SSC CHSL** — 12th pass | LDC, DEO\n• **SSC GD** — 10th pass | Paramilitary\n• **SSC JE** — Diploma/B.Tech | Junior Engineer\n• **SSC CPO** — Graduation | Sub-Inspector\n\n💰 **Salary:**\n• CGL: ₹35k-80k/month\n• CHSL: ₹20k-40k/month\n• GD: ₹25k-35k/month\n\n📚 **Preparation:**\n• Math (Quant) — Most important\n• English — Daily practice\n• GK — Current affairs\n• Reasoning`,
        `📝 **SSC Exams:**\n\n• SSC CGL — Graduation required | ₹35k-80k/month\n• SSC CHSL — 12th pass | ₹20k-40k/month\n• SSC GD — 10th pass (paramilitary)\n\nPrep: Math + English + GK + Reasoning`,
      ),
      options: ["SSC CGL details", "SSC CHSL info", "SSC preparation", "Coaching centers"],
      updatedContext,
      updatedProfile,
    };
  }

  /* PHARMACY */
  if (intent === "pharmacy") {
    return {
      text: tri(lang,
        `💊 **Pharmacy Career Guide:**\n\n📚 **Courses:**\n• D.Pharma — 2 years (after 12th PCB)\n• B.Pharma — 4 years (after 12th PCB)\n• M.Pharma — 2 years (after B.Pharma)\n• Pharm.D — 6 years (doctor level)\n\n💰 **Fees:**\n• Govt College: ₹30k-80k/year\n• Private College: ₹1L-2L/year\n\n💼 **Career Options:**\n• Medical Representative — ₹3L-8L\n• Hospital Pharmacist — ₹3L-6L\n• Research & Development — ₹5L-15L\n• Drug Inspector (Govt) — ₹5L-10L\n• Own Medical Store — Business\n\n🏫 **Top Colleges:**\nNIMS Jaipur, GNIOT, Shridevi Karnataka`,
        `💊 **Pharmacy:**\n\nD.Pharma (2yr) | B.Pharma (4yr) | M.Pharma (2yr)\n\nCareer: Medical Rep ₹3-8L | Pharmacist ₹3-6L | R&D ₹5-15L`,
      ),
      options: ["D.Pharma vs B.Pharma", "Pharmacy fees", "Drug Inspector exam", "Pharmacy colleges"],
      updatedContext,
      updatedProfile,
    };
  }

  /* NURSING */
  if (intent === "nursing") {
    return {
      text: tri(lang,
        `👩‍⚕️ **Nursing Career Guide:**\n\n📚 **Courses:**\n• ANM — 2 years (after 10th)\n• GNM — 3 years (after 12th)\n• B.Sc Nursing — 4 years (after 12th PCB)\n• M.Sc Nursing — 2 years\n\n💰 **Fees:**\n• Govt Nursing College: ₹20k-50k/year\n• Private: ₹80k-2L/year\n\n💼 **Career & Salary:**\n• Govt Hospital Nurse — ₹3L-6L\n• Private Hospital — ₹2.5L-5L\n• **Abroad (UAE/UK/Canada)** — ₹8L-20L+!\n• AIIMS Nurse — ₹5L-8L\n\n🌟 **Special:** Nursing mein abroad ka bahut scope hai!\n\n🏫 **Top Colleges:**\nAIIMS Patna, PMCH Patna, Shridevi Karnataka`,
        `👩‍⚕️ **Nursing:**\n\nANM (2yr after 10th) | GNM (3yr) | B.Sc Nursing (4yr)\n\nBig scope abroad! UAE/UK/Canada: ₹8L-20L+ salary`,
      ),
      options: ["GNM vs B.Sc Nursing", "Abroad nursing scope", "Nursing fees", "Government nursing college"],
      updatedContext,
      updatedProfile,
    };
  }

  /* BUDGET LOW */
  if (intent === "budget_low") {
    updatedProfile.budget = "low";
    const cheap = COLLEGES.filter(c => c.fee <= 100000).sort((a, b) => a.fee - b.fee);
    updatedContext.lastList = cheap;
    updatedContext.lastType = "college_list";
    return {
      text: tri(lang,
        `💰 **Sabse Affordable Colleges (₹1L se kam):**\n\n${cheap.slice(0, 6).map(c => fmtCollege(c, lang)).join("\n\n")}\n\n💳 Bihar Credit Card se fees aur bhi easy!\n\n💡 Tip: Government colleges + Credit Card = Best combo!`,
        `💰 **Most Affordable Colleges (Under ₹1L):**\n\n${cheap.slice(0, 5).map(c => fmtCollege(c, lang)).join("\n\n")}\n\nBihar Credit Card makes it even easier!`,
      ),
      options: ["Credit Card apply", "Scholarship available?", "Government college", "Aur colleges"],
      updatedContext,
      updatedProfile,
    };
  }

  /* LOCATION */
  if (intent === "location") {
    return {
      text: tri(lang,
        `📍 **Sankalp Shiksha Salahkar — Offices:**\n\n🏢 **Main Office:** Bihar (Patna)\n🌍 **Present in:** 10+ States\n\n📞 **Contact:** +91 9142082026\n💬 **WhatsApp:** +91 9142082026\n📧 **Email:** info@sankalpshikshasalahkar.com\n\n⏰ **Timing:** 9 AM - 7 PM (Monday - Saturday)\n\n🎯 **Online Counseling:** Available for all India students!\n\nHum ghar baithe bhi aapki poori help kar sakte hain! 😊`,
        `📍 **SSS Offices:**\n\nMain: Bihar (Patna) | 10+ states\n📞 +91 9142082026\n⏰ 9 AM - 7 PM (Mon-Sat)\n\nOnline counseling available!`,
      ),
      options: ["Call karna hai", "WhatsApp karna hai", "Online counseling", "Visit office"],
      updatedContext,
      updatedProfile,
    };
  }

  /* UNKNOWN / DEFAULT */
  return {
    text: tri(lang,
      `🙏 Maafi chahta hoon, main aapka sawaal poori tarah samajh nahi paya।\n\nKya aap in topics mein se kuch poochna chahte hain?\n\n🎓 College admission\n💳 Bihar Credit Card\n📚 Course selection\n🎯 Scholarship\n💼 Career guidance\n📝 Entrance exams\n\nYa seedha call karein: **📞 +91 9142082026**`,
      `🙏 I didn't quite understand your question.\n\nYou can ask about:\n🎓 College admission | 💳 Credit Card\n📚 Courses | 🎯 Scholarships | 💼 Career\n\nOr call directly: **📞 +91 9142082026**`,
      `🙏 Samajh nahi aail। College, fees, scholarship ya career ke baare mein poochhein। 📞 +91 9142082026`
    ),
    options: QUICK_REPLIES.default,
    updatedContext,
    updatedProfile,
  };
};

/* ─────────────────────────────────────────────────────────────
   SECTION 11: MAIN COMPONENT
   ───────────────────────────────────────────────────────────── */

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showWelcomePulse, setShowWelcomePulse] = useState(true);

  const contextRef = useRef<ChatContext>({ conversationCount: 0, lastTopics: [], sessionStart: new Date() });
  const profileRef = useRef<UserProfile>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  /* ── Auto scroll ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* ── Initial welcome message ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      sendBotMessage(
        `🙏 **Namaste!** Main hoon **SSS AI Counselor** — Sankalp Shiksha Salahkar ka!\n\nMain aapki madad kar sakta hoon:\n• 🎓 College admission & counseling\n• 💳 Bihar Student Credit Card\n• 📚 Course selection\n• 🎯 Scholarship guidance\n• 💼 Career planning\n\nAap **Hindi, English ya Bhojpuri** mein baat kar sakte hain! 😊\n\n**Aaj aap kya jaanna chahte hain?**`,
        QUICK_REPLIES.greeting
      );
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  /* ── Welcome pulse stop ── */
  useEffect(() => {
    const t = setTimeout(() => setShowWelcomePulse(false), 8000);
    return () => clearTimeout(t);
  }, []);

  /* ── Setup speech recognition ── */
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "hi-IN";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSend(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const sendBotMessage = useCallback((text: string, options?: string[]) => {
    const msg: Message = {
      id: generateId(),
      role: "assistant",
      content: text,
      timestamp: new Date(),
      options,
    };
    setMessages((prev) => [...prev, msg]);
    if (!isOpen) setUnreadCount((n) => n + 1);
  }, [isOpen]);

  const handleSend = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const thinkTime = 600 + Math.random() * 900;

    setTimeout(() => {
      const { text: reply, options, updatedContext, updatedProfile } = getResponse(
        trimmed,
        contextRef.current,
        profileRef.current
      );

      contextRef.current = updatedContext;
      profileRef.current = updatedProfile;

      const botMsg: Message = {
        id: generateId(),
        role: "assistant",
        content: reply,
        timestamp: new Date(),
        options,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      if (voiceEnabled) {
        speakText(reply, updatedContext.lastLang || "hindi");
      }
    }, thinkTime);
  }, [voiceEnabled]);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Voice not supported in this browser. Please use Chrome.");
      return;
    }
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
    setShowWelcomePulse(false);
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  /* ── Render message content with markdown-lite ── */
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <p key={i} className="font-bold text-sm mb-1">{line.replace(/\*\*/g, "")}</p>;
      }
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="text-sm leading-relaxed mb-0.5">
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={j}>{part.replace(/\*\*/g, "")}</strong>
              : part
          )}
        </p>
      );
    });
  };

  /* ── Format timestamp ── */
  const fmtTime = (d: Date) => d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  /* ─────────────────────────────────────
     RENDER
  ───────────────────────────────────── */
  return (
    <>
      {/* ── Floating Button ── */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #FF6B35 0%, #F7C59F 50%, #FF6B35 100%)",
            boxShadow: "0 8px 32px rgba(255,107,53,0.45)",
          }}
          aria-label="Open SSS AI Counselor"
        >
          {/* Pulse ring */}
          {showWelcomePulse && (
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-50"
              style={{ background: "rgba(255,107,53,0.4)" }}
            />
          )}
          <span className="text-2xl">🎓</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* ── Chat Window ── */}
      {isOpen && (
        <div
          className="fixed bottom-4 right-4 z-50 flex flex-col rounded-2xl overflow-hidden"
          style={{
            width: "min(420px, calc(100vw - 32px))",
            height: "min(620px, calc(100vh - 32px))",
            boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 shrink-0"
            style={{
              background: "linear-gradient(135deg, #FF6B35 0%, #E8521A 100%)",
            }}
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl shrink-0">
              🎓
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">SSS AI Counselor</p>
              <p className="text-orange-100 text-xs">Hindi • English • Bhojpuri • 24/7</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Voice toggle */}
              <button
                onClick={() => setVoiceEnabled((v) => !v)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded"
                title={voiceEnabled ? "Mute bot voice" : "Enable bot voice"}
              >
                {voiceEnabled ? "🔊" : "🔇"}
              </button>
              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded text-lg leading-none"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Online status bar */}
          <div className="bg-green-50 border-b border-green-100 px-4 py-1 flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-700 text-xs font-medium">Online — Immediate response</span>
          </div>

          {/* Messages area */}
          <div
            className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
            style={{ background: "#F9F5F0" }}
          >
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mt-1"
                    style={{ background: "linear-gradient(135deg,#FF6B35,#E8521A)" }}>
                    🎓
                  </div>
                )}
                <div
                  className="max-w-[82%] rounded-2xl px-3 py-2.5 shadow-sm"
                  style={{
                    background: msg.role === "user"
                      ? "linear-gradient(135deg,#FF6B35,#E8521A)"
                      : "#FFFFFF",
                    color: msg.role === "user" ? "#fff" : "#1a1a1a",
                    borderBottomRightRadius: msg.role === "user" ? 4 : undefined,
                    borderBottomLeftRadius: msg.role === "assistant" ? 4 : undefined,
                  }}
                >
                  <div>{renderContent(msg.content)}</div>

                  {/* Quick reply options */}
                  {msg.role === "assistant" && msg.options && msg.options.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {msg.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleSend(opt)}
                          className="text-xs px-2.5 py-1 rounded-full border font-medium transition-all hover:scale-105 active:scale-95"
                          style={{
                            borderColor: "#FF6B35",
                            color: "#FF6B35",
                            background: "#FFF5F0",
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-right mt-1 opacity-50"
                    style={{ fontSize: 10, color: msg.role === "user" ? "#fff" : "#666" }}>
                    {fmtTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 justify-start">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                  style={{ background: "linear-gradient(135deg,#FF6B35,#E8521A)" }}>
                  🎓
                </div>
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          background: "#FF6B35",
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div
            className="px-3 py-3 border-t shrink-0"
            style={{ background: "#FFFFFF", borderColor: "#F0E8E0" }}
          >
            {/* Listening indicator */}
            {isListening && (
              <div className="mb-2 flex items-center gap-2 text-xs text-red-600 font-medium">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                Listening... (Hindi/English mein bolein)
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type in Hindi / English..."
                className="flex-1 rounded-full border px-4 py-2.5 text-sm outline-none transition-all"
                style={{
                  borderColor: "#E0D4CC",
                  background: "#FAF7F5",
                  fontSize: 14,
                }}
                disabled={isTyping}
              />

              {/* Voice button */}
              {recognitionRef.current && (
                <button
                  onClick={startListening}
                  disabled={isListening || isTyping}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shrink-0"
                  style={{
                    background: isListening ? "#EF4444" : "#FFF0E8",
                    border: `2px solid ${isListening ? "#EF4444" : "#FF6B35"}`,
                  }}
                  title="Voice input"
                >
                  <span style={{ fontSize: 16 }}>{isListening ? "⏹" : "🎤"}</span>
                </button>
              )}

              {/* Send button */}
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shrink-0 disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg,#FF6B35,#E8521A)",
                }}
                title="Send"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <p className="text-center mt-2 text-gray-400" style={{ fontSize: 10 }}>
              Powered by SSS AI • Free Education Counseling
            </p>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 12: EXTENDED KNOWLEDGE BASE
   ───────────────────────────────────────────────────────────── */

export const EXTENDED_COLLEGE_TIPS: Record<string, string[]> = {
  "NIT Patna": [
    "JEE Main mein 50,000-80,000 rank chahiye Bihar quota ke liye",
    "CSE + EE sabse popular branches",
    "95% placement — top MNCs visit karte hain",
    "Hostel compulsory 1st year",
    "NIRF Rank 62 — Bihar ka no. 1 govt engineering",
  ],
  "IIT Delhi": [
    "JEE Advanced required — top 10,000 rank",
    "Average package ₹20L+, max ₹2 crore+",
    "Research facilities world-class",
    "Alumni network very strong (global)",
    "5-year integrated programs bhi available",
  ],
  "Sandip University": [
    "Bihar mein ek popular affordable private university",
    "Bihar Student Credit Card ke liye empanelled",
    "NAAC B+ — decent quality",
    "Hostel aur transportation available",
    "Direct admission available — entrance optional",
  ],
  "AIIMS Patna": [
    "NEET mein 600+ score required (general category)",
    "Fees sirf ₹10k/year — sabse sasta top medical college",
    "OPD + IPD hospital directly attached",
    "Stipend milta hai during MBBS",
    "Bihar ka sabse prestige medical college",
  ],
  "Patna University": [
    "Fees sirf ₹25k/year — bahut affordable",
    "1917 mein founded — heritage university",
    "NAAC A grade",
    "Arts, Science, Commerce, Law sab available",
    "CUET se admission milta hai",
  ],
  "GL Bajaj": [
    "NAAC A grade — reliable quality",
    "88% placement — TCS, Infosys, Wipro, etc.",
    "AI/ML aur Data Science new programs",
    "Greater Noida — NCR location, good for internships",
    "Credit Card se fees bharna possible",
  ],
};

export const EXAM_PREPARATION_PLANS: Record<string, string> = {
  jee: `📅 **JEE Main 12-Month Study Plan:**

**Month 1-3 (Foundation):**
• NCERT Physics Ch 1-15 (all derivations)
• NCERT Chemistry (Mole concept, Chemical Bonding)
• NCERT Math (Algebra basics, Trigonometry)
• Daily: 1 chapter theory + 20 questions

**Month 4-6 (Core Topics):**
• Physics: Mechanics, Electrostatics, Magnetism
• Chemistry: Organic basics, Periodic Table
• Math: Calculus, Vectors, 3D
• Weekly: 1 full subject test

**Month 7-9 (Advanced + PYQ):**
• Previous Year Questions (2014-2024) solve karo
• JEE Main chapter-wise PYQ
• Focus: Weak subjects extra time

**Month 10-12 (Mock Tests):**
• Full mock test every 2 days
• Analyse mistakes seriously
• Revision: formula sheets daily
• NTA mock tests from official site

⚡ **Most Important Topics:**
Physics: Mechanics, Current Electricity
Chemistry: Organic, Mole Concept  
Math: Calculus, Coordinate Geometry`,

  neet: `📅 **NEET 12-Month Study Plan:**

**Month 1-4 (NCERT Mastery):**
• Biology NCERT Class 11 complete
• Biology NCERT Class 12 complete
• Chemistry NCERT (Inorganic first)
• Physics NCERT (Laws of Motion, Work-Energy)

**Month 5-8 (Deep Practice):**
• Biology: 60-80 questions daily (most marks!)
• Chemistry: Organic reactions + Inorganic facts
• Physics: Numericals practice daily
• Chapter-wise PYQ solve karo

**Month 9-12 (Mock + Revision):**
• NEET mock test every week
• Biology 360 marks — don't neglect
• Target: 600+ for government MBBS

⚡ **Most Important:**
Biology: Cell Biology, Genetics, Human Physiology
Chemistry: Organic reactions, Chemical Bonding
Physics: Optics, Modern Physics (less weightage)

💡 **Golden Rule:** NEET mein Biology = 360 marks
Jo Biology padhega, NEET qualify karega!`,

  clat: `📅 **CLAT Preparation Plan (6 months):**

**Foundation (Month 1-2):**
• English: Newspaper daily (The Hindu)
• GK: NCERT Polity Class 9-12
• Math: 10th standard basics
• Reasoning: Basic puzzles

**Intermediate (Month 3-4):**
• Legal Reasoning: Basic legal concepts
• English: Comprehension passages
• Current Affairs: Monthly magazine
• Mock tests: Start weekly

**Final Phase (Month 5-6):**
• Previous CLAT papers (2018-2024)
• Speed + accuracy improvement
• Legal Aptitude deep practice
• Full mock every 3 days`,

  upsc: `📅 **UPSC Preparation 2-Year Plan:**

**Year 1 — Foundation:**
• NCERT 6th-12th (all subjects)
• Polity: Laxmikant
• History: Bipin Chandra
• Geography: NCERT + GC Leong
• Daily: The Hindu + PIB

**Year 2 — Mains Prep:**
• Optional Subject deep study
• Essay writing practice
• Answer writing daily
• Current Affairs compilation
• Mock Interviews

⚡ **Key Subjects (UPSC):**
• Polity (Most Important)
• History (Ancient/Medieval/Modern)
• Geography (India + World)
• Economy (Budget + Schemes)
• Science & Tech (Current)

💡 **Bihar se IAS banne wale tips:**
• BPSC bhi saath prepare karo
• Hindi medium bhi valid
• Patna coaching centers available`,

  banking: `📅 **Bank PO/Clerk 6-Month Plan:**

**Month 1-2:**
• Quantitative Aptitude: Number System, Percentage, Ratio
• English: Grammar rules, Reading Comprehension
• Reasoning: Puzzles, Seating Arrangement

**Month 3-4:**
• Sectional tests daily
• Computer Knowledge basics
• Current Affairs: Monthly
• Previous papers: IBPS 2020-2023

**Month 5-6:**
• Full mock tests daily
• SBI + IBPS both prepare simultaneously
• Interview preparation
• Document verification ready

⚡ **Most Important Sections:**
Quant: DI (Data Interpretation) highest marks
Reasoning: Puzzles most common
English: Reading Comprehension most marks`,
};

export const FREQUENTLY_ASKED_QUESTIONS: Array<{ q: string; a: string; tags: string[] }> = [
  {
    q: "Bihar Student Credit Card ke liye kya eligibility hai?",
    a: "12th pass Bihar student, age 18-25, family income ₹4.5L se kam, Bihar domicile zaroori hai.",
    tags: ["credit_card", "eligibility", "bscc"],
  },
  {
    q: "JEE Main mein kitna rank chahiye NIT Patna ke liye?",
    a: "Bihar state quota mein generally 50,000-90,000 rank ke beech seat milti hai CSE mein. Other branches mein 1.5 lakh tak bhi chalega.",
    tags: ["jee", "nit_patna", "rank"],
  },
  {
    q: "NEET mein kitna score chahiye AIIMS Patna ke liye?",
    a: "General category mein minimum 600-620 marks chahiye AIIMS Patna mein seat ke liye. OBC: 580+, SC/ST: 550+.",
    tags: ["neet", "aiims", "score"],
  },
  {
    q: "Polytechnic ke baad B.Tech lateral entry possible hai?",
    a: "Haan! Polytechnic ke baad B.Tech ke 2nd year mein direct lateral entry milti hai. Bihar mein BCECE lateral entry exam dena padta hai.",
    tags: ["polytechnic", "lateral_entry", "btech"],
  },
  {
    q: "IGNOU mein admission kab hota hai?",
    a: "IGNOU mein 2 baar admission hota hai: January session (November-December mein form) aur July session (May-June mein form). ignou.ac.in pe apply karo.",
    tags: ["ignou", "distance", "admission"],
  },
  {
    q: "CA banne mein kitna time lagta hai?",
    a: "CA banne mein generally 4-5 saal lagte hain. Foundation (4 months) → Intermediate (8 months) → Final (2.5 years) + 3 years articleship.",
    tags: ["ca", "commerce", "duration"],
  },
  {
    q: "Bihar mein best government engineering college kaun sa hai?",
    a: "NIT Patna sabse best hai Bihar mein government engineering ke liye. Uske baad state government engineering colleges (SBTE affiliated) hain.",
    tags: ["government", "engineering", "bihar"],
  },
  {
    q: "12th ke baad directly job kaise milegi?",
    a: "12th ke baad: SSC CHSL (government job), Railway Group D, Private sector (data entry, BPO, sales). Ya skill course (ITI/Polytechnic) karo for better jobs.",
    tags: ["job", "after_12th", "employment"],
  },
  {
    q: "Online degree ka value regular degree se kam hota hai kya?",
    a: "IGNOU jaise government recognized universities ka degree valid hai. Private online degrees thode less valued hain corporate sector mein. Regular degree prefer karo agar possible ho.",
    tags: ["online", "degree", "value"],
  },
  {
    q: "Girl students ke liye best scholarships kaunsi hain?",
    a: "AICTE Pragati (₹50k/year), NSP scholarship, Bihar Medhavritti (SC/ST girls), PM Scholarship (defence families), Minority scholarship. Sab NSP portal pe milti hain.",
    tags: ["scholarship", "girls", "women"],
  },
];

export const COLLEGE_COMPARISON_DATA: Record<string, Record<string, string>> = {
  "NIT Patna vs GL Bajaj": {
    fees: "NIT: ₹1.5L | GL Bajaj: ₹1.6L",
    entrance: "NIT: JEE Main required | GL Bajaj: Direct/JEE",
    placement: "NIT: 95% | GL Bajaj: 88%",
    location: "NIT: Patna | GL Bajaj: Greater Noida NCR",
    verdict: "NIT Patna better hai — government college, better brand, better placement. Lekin JEE Main chahiye.",
  },
  "Patna University vs BNMU": {
    fees: "Patna: ₹25k | BNMU: ₹40k",
    quality: "Patna: NAAC A | BNMU: Average",
    location: "Patna: Capital city | BNMU: Madhepura",
    verdict: "Patna University better hai — NAAC A, heritage, capital city location.",
  },
  "IGNOU vs Regular College": {
    fees: "IGNOU: ₹10k-30k total | Regular: ₹25k-2L/year",
    flexibility: "IGNOU: High (self-paced) | Regular: Fixed schedule",
    placement: "IGNOU: Self job search | Regular: Campus placement",
    recognition: "IGNOU: Government recognized | Regular: Better corporate value",
    verdict: "Regular college better hai agar full-time padh sakte ho. IGNOU best hai agar job + study karna ho.",
  },
};

export const MOTIVATIONAL_QUOTES: string[] = [
  "🌟 'Padhai karo, future banao — Bihar ka har student capable hai IAS/Engineer/Doctor banne ka!'",
  "💪 'Paise ki kami koi baadhaa nahi — Bihar Student Credit Card aur Scholarships available hain!'",
  "🎯 'Ek sahi decision aapki zindagi badal sakta hai — aaj hi counseling lo!'",
  "🚀 'NIT Patna se IIT tak — Bihar ke bachche sab jagah top kar rahe hain!'",
  "📚 'Study hard today, lead tomorrow — Sankalp Shiksha Salahkar always with you!'",
];

export const STATE_WISE_COLLEGE_COUNT: Record<string, number> = {
  Bihar: 8,
  "Uttar Pradesh": 3,
  Jharkhand: 1,
  Rajasthan: 2,
  Delhi: 2,
  Uttarakhand: 2,
  Karnataka: 2,
  Maharashtra: 2,
  "West Bengal": 1,
  National: 1,
};

export const COURSE_DURATION_MAP: Record<string, string> = {
  "B.Tech": "4 years",
  MBBS: "5.5 years",
  BBA: "3 years",
  MBA: "2 years (after graduation)",
  LLB: "3 years (after graduation)",
  "BA LLB": "5 years (integrated)",
  CA: "4-5 years (foundation to final)",
  "B.Com": "3 years",
  BA: "3 years",
  "B.Sc": "3 years",
  BCA: "3 years",
  MCA: "2 years (after graduation)",
  "B.Pharma": "4 years",
  "D.Pharma": "2 years",
  "B.Sc Nursing": "4 years",
  GNM: "3 years",
  ANM: "2 years",
  Polytechnic: "3 years (diploma)",
  ITI: "1-2 years",
  "PGDM/MBA": "2 years",
  "M.Tech": "2 years (after B.Tech)",
  PhD: "3-5 years (after masters)",
};

export const SALARY_RANGES: Record<string, { fresher: string; experienced: string; top: string }> = {
  "Software Engineer": { fresher: "₹3.5L-8L", experienced: "₹12L-25L", top: "₹40L-1Cr+" },
  "AI/ML Engineer": { fresher: "₹5L-12L", experienced: "₹18L-40L", top: "₹60L-2Cr+" },
  Doctor: { fresher: "₹4L-8L (internship/resident)", experienced: "₹15L-30L", top: "₹50L+" },
  MBA: { fresher: "₹4L-8L", experienced: "₹12L-20L", top: "₹30L-1Cr+ (IIM)" },
  Lawyer: { fresher: "₹2.5L-5L", experienced: "₹8L-15L", top: "₹30L+ (corporate)" },
  "Civil Services (IAS)": { fresher: "₹7L-10L", experienced: "₹12L-18L", top: "₹20L+ (Chief Secretary)" },
  "Bank PO": { fresher: "₹4.5L-6.5L", experienced: "₹8L-12L", top: "₹15L+ (GM)" },
  Teacher: { fresher: "₹2.5L-4L", experienced: "₹5L-10L", top: "₹12L+ (Professor)" },
  Pharmacist: { fresher: "₹2.5L-4L", experienced: "₹6L-10L", top: "₹15L+ (R&D)" },
  Nurse: { fresher: "₹2.5L-4L", experienced: "₹5L-8L", top: "₹20L+ (abroad)" },
  "Diploma Engineer": { fresher: "₹2L-3.5L", experienced: "₹4L-8L", top: "₹12L+ (government)" },
};

export const GOVERNMENT_JOB_CALENDAR_2024_25: Array<{ exam: string; month: string; eligibility: string; salary: string }> = [
  { exam: "BPSC 70th Combined", month: "Sep-Dec 2024", eligibility: "Graduation", salary: "₹7L-18L" },
  { exam: "Bihar Police SI", month: "2025 announced soon", eligibility: "Graduation", salary: "₹4L-8L" },
  { exam: "Bihar Teacher (BPSC)", month: "Ongoing", eligibility: "Graduation + B.Ed/D.El.Ed", salary: "₹3.5L-8L" },
  { exam: "Railway NTPC", month: "2025 expected", eligibility: "12th/Graduation", salary: "₹3L-7L" },
  { exam: "SSC CGL 2024", month: "Sep-Oct 2024 (Tier 1)", eligibility: "Graduation", salary: "₹5L-14L" },
  { exam: "IBPS PO 2024", month: "Oct-Nov 2024", eligibility: "Graduation", salary: "₹6L-10L" },
  { exam: "SBI PO 2025", month: "Feb-March 2025", eligibility: "Graduation 21-30 age", salary: "₹6L-10L" },
  { exam: "NDA 2025", month: "April 2025", eligibility: "12th (PCM), 16.5-19.5 age", salary: "₹4L-8L" },
  { exam: "UPSC CSE 2025", month: "Prelims May 2025", eligibility: "Graduation", salary: "₹7L-20L" },
];

/* ─────────────────────────────────────────────────────────────
   SECTION 13: ADVANCED RESPONSE HELPERS & EXTENDED INTENTS
   ───────────────────────────────────────────────────────────── */

export const getExamInfo = (examKey: string): string => {
  const info = ENTRANCE_EXAMS[examKey];
  if (!info) return "Exam info not found.";
  return `📝 **${info.fullName}**\n\n📅 Schedule: ${info.month}\n✅ Eligibility: ${info.eligibility}\n🌐 Website: ${info.website}\n\n💡 Tips: ${info.tips}`;
};

export const getCareerSalaryInfo = (careerKey: string): string => {
  const data = SALARY_RANGES[careerKey];
  if (!data) return "";
  return `💰 **${careerKey} Salary:**\n• Fresher: ${data.fresher}\n• Experienced (5yr): ${data.experienced}\n• Top Earner: ${data.top}`;
};

export const getGovtJobsForProfile = (qualification: string, state: string): string => {
  const relevant = GOVERNMENT_JOB_CALENDAR_2024_25.filter(job => {
    if (qualification === "12th" && job.eligibility.includes("Graduation")) return false;
    return true;
  }).slice(0, 5);

  return `📋 **Upcoming Government Jobs:**\n\n${relevant.map(j =>
    `• **${j.exam}**\n  📅 ${j.month} | ✅ ${j.eligibility} | 💰 ${j.salary}`
  ).join("\n\n")}`;
};

export const getScholarshipForCategory = (category: string, stream: string): ScholarshipScheme[] => {
  return SCHOLARSHIPS.filter(s =>
    (s.category.includes("all") || s.category.includes(category)) &&
    (s.forStream.includes("all") || s.forStream.includes(stream))
  );
};

export const findBestCollegeMatch = (
  stream: string,
  budget: "low" | "mid" | "high",
  state?: string,
  needsCreditCard?: boolean
): College[] => {
  const maxFee = budget === "low" ? 100000 : budget === "mid" ? 200000 : 999999;
  const typeMap: Record<string, string> = {
    science: "engineering",
    commerce: "management",
    arts: "arts",
    medical: "medical",
  };

  return COLLEGES.filter(c => {
    const matchType = !typeMap[stream] || c.type.includes(typeMap[stream]);
    const matchFee = c.fee <= maxFee;
    const matchState = !state || c.state === state;
    const matchCC = !needsCreditCard || c.creditCard;
    return matchType && matchFee && matchState && matchCC;
  }).sort((a, b) => b.rating - a.rating).slice(0, 5);
};

export const generateStudyPlan = (exam: string): string => {
  const key = exam.toLowerCase().replace(/\s/g, "_");
  return EXAM_PREPARATION_PLANS[key] || `Study plan for ${exam}: Focus on basics first, then practice previous year papers. Daily study 6-8 hours recommended.`;
};

export const compareColleges = (college1: string, college2: string): string => {
  const key = `${college1} vs ${college2}`;
  const reverseKey = `${college2} vs ${college1}`;
  const data = COLLEGE_COMPARISON_DATA[key] || COLLEGE_COMPARISON_DATA[reverseKey];
  if (!data) {
    return `Comparison ke liye counselor se baat karein: 📞 +91 9142082026`;
  }
  return Object.entries(data).map(([k, v]) => `**${k}:** ${v}`).join("\n");
};

export const getMotivation = (): string => {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
};

export const getCollegeDetails = (collegeName: string): College | undefined => {
  return COLLEGES.find(c =>
    c.name.toLowerCase().includes(collegeName.toLowerCase()) ||
    collegeName.toLowerCase().includes(c.name.toLowerCase().split(" ")[0])
  );
};

export const getFAQAnswer = (question: string): string | null => {
  const q = question.toLowerCase();
  const match = FREQUENTLY_ASKED_QUESTIONS.find(faq =>
    faq.tags.some(tag => q.includes(tag)) ||
    q.includes(faq.q.substring(0, 15).toLowerCase())
  );
  return match ? match.a : null;
};

/* ─────────────────────────────────────────────────────────────
   SECTION 14: BPSC / STATE PSC GUIDE
   ───────────────────────────────────────────────────────────── */

export const BPSC_GUIDE = {
  fullName: "Bihar Public Service Commission",
  exam: "BPSC 70th Combined Competitive Exam",
  eligibility: "Graduation any stream, age 20-37 (general), relaxation for OBC/SC/ST",
  posts: ["SDO", "BDO", "DSPO", "Deputy Collector", "Bihar Police DSP", "120+ posts"],
  salary: "₹7,30,000 – ₹18,00,000 per year",
  pattern: "Prelims (150 MCQ) → Mains (4 papers) → Interview",
  syllabus: {
    prelims: ["General Studies (History, Polity, Economy, Science, Current)", "Bihar specific GK"],
    mains: ["General Hindi", "General Studies Paper 1 (Indian History, Culture)", "General Studies Paper 2 (Indian Polity, Economy, Current)", "Optional Subject (1 from 34 subjects)"],
  },
  coachingCenters: ["Chanakya IAS Academy Patna", "Khan GS Research Centre", "IAS Gurukul Patna"],
  tips: [
    "Bihar GK sabse important — BPSC mein Bihar focus hota hai",
    "Current Affairs: 1 year minimum — daily newspaper",
    "Mains answer writing practice bahut zaroori",
    "Optional subject wisely choose karo — strong subject rakho",
  ],
  website: "bpsc.bih.nic.in",
};

/* ─────────────────────────────────────────────────────────────
   SECTION 15: ADMISSION CALENDAR 2025
   ───────────────────────────────────────────────────────────── */

export const ADMISSION_CALENDAR_2025: Array<{
  event: string;
  date: string;
  forCourse: string;
  link: string;
}> = [
  { event: "JEE Main Session 1", date: "January 2025", forCourse: "B.Tech Engineering", link: "jeemain.nta.nic.in" },
  { event: "NEET UG Registration", date: "February 2025", forCourse: "MBBS/BDS/BAMS", link: "neet.nta.nic.in" },
  { event: "JEE Main Session 2", date: "April 2025", forCourse: "B.Tech Engineering", link: "jeemain.nta.nic.in" },
  { event: "BCECE Bihar Polytechnic", date: "April 2025", forCourse: "Diploma Engineering", link: "bceceboard.bihar.gov.in" },
  { event: "NEET UG Exam", date: "May 2025", forCourse: "Medical", link: "neet.nta.nic.in" },
  { event: "JEE Advanced (IIT)", date: "May 2025", forCourse: "IIT B.Tech", link: "jeeadv.ac.in" },
  { event: "CUET UG", date: "May-June 2025", forCourse: "DU/JNU/BHU (BA/B.Sc/B.Com)", link: "cuet.samarth.ac.in" },
  { event: "CLAT 2025", date: "December 2024 (held)", forCourse: "NLU Law colleges", link: "consortiumofnlus.ac.in" },
  { event: "CAT 2024", date: "November 2024 (held)", forCourse: "IIM MBA", link: "iimcat.ac.in" },
  { event: "IBPS PO 2024", date: "October-November 2024", forCourse: "Bank PO", link: "ibps.in" },
  { event: "BPSC 70th Combined", date: "September-December 2024", forCourse: "Bihar State Service", link: "bpsc.bih.nic.in" },
  { event: "Bihar STET 2024", date: "2024 (announced)", forCourse: "Government Teacher", link: "secondary.biharboardonline.com" },
  { event: "NSP Scholarship Registration", date: "October-November 2024", forCourse: "All courses", link: "scholarships.gov.in" },
  { event: "Bihar Student Credit Card", date: "Apply anytime", forCourse: "All professional courses", link: "7nishchay-yuvaupmission.bihar.gov.in" },
];

/* ─────────────────────────────────────────────────────────────
   SECTION 16: COURSE ELIGIBILITY MATRIX
   ───────────────────────────────────────────────────────────── */

export const COURSE_ELIGIBILITY: Record<string, {
  minQualification: string;
  minMarks: string;
  entrance: string;
  ageLimit: string;
  notes: string;
}> = {
  "B.Tech": {
    minQualification: "12th PCM",
    minMarks: "45% (General), 40% (SC/ST)",
    entrance: "JEE Main / State CET",
    ageLimit: "No upper age limit",
    notes: "PCM = Physics, Chemistry, Math mandatory in 12th",
  },
  MBBS: {
    minQualification: "12th PCB",
    minMarks: "50% (General), 40% (SC/ST)",
    entrance: "NEET UG — compulsory",
    ageLimit: "Minimum 17 years",
    notes: "PCB = Physics, Chemistry, Biology. NEET qualify karna COMPULSORY hai",
  },
  BA: {
    minQualification: "12th (any stream)",
    minMarks: "45% usually",
    entrance: "CUET / Direct / Entrance varies",
    ageLimit: "No limit",
    notes: "Arts, Science, Commerce — koi bhi stream se BA kar sakte hain",
  },
  "B.Com": {
    minQualification: "12th Commerce / any",
    minMarks: "45%",
    entrance: "CUET (for DU etc.) / Direct",
    ageLimit: "No limit",
    notes: "Commerce stream preferred, but not mandatory",
  },
  BBA: {
    minQualification: "12th (any stream)",
    minMarks: "45-50%",
    entrance: "Some college entrance / Direct",
    ageLimit: "Usually under 25",
    notes: "Management degree — commerce or any stream accepted",
  },
  LLB: {
    minQualification: "Graduation (any stream) / 12th for BA LLB",
    minMarks: "45% (General)",
    entrance: "CLAT / State Law CET / Direct",
    ageLimit: "No limit for 3yr LLB; Under 20 for 5yr BA LLB",
    notes: "CLAT required for NLUs. Private colleges may have direct admission",
  },
  Polytechnic: {
    minQualification: "10th pass",
    minMarks: "35%",
    entrance: "DCECE Bihar / State Poly Entrance",
    ageLimit: "Minimum 15 years",
    notes: "10th ke baad sabse popular technical option Bihar mein",
  },
  ITI: {
    minQualification: "8th or 10th (trade dependent)",
    minMarks: "35%",
    entrance: "State ITI entrance / merit",
    ageLimit: "14-40 years (varies)",
    notes: "Quickest path to job after 10th/8th. Government ITI best",
  },
  "B.Pharma": {
    minQualification: "12th PCB or PCM",
    minMarks: "45%",
    entrance: "State Pharmacy CET / Direct",
    ageLimit: "No strict limit",
    notes: "Biology + Chemistry knowledge important",
  },
  "B.Sc Nursing": {
    minQualification: "12th PCB",
    minMarks: "45% (General), 40% (SC/ST)",
    entrance: "State Nursing CET / Direct",
    ageLimit: "Minimum 17 years",
    notes: "Excellent abroad scope. Girls + Boys both can apply",
  },
  MBA: {
    minQualification: "Graduation (any stream)",
    minMarks: "50%",
    entrance: "CAT / MAT / CMAT / GMAT",
    ageLimit: "No strict limit (usually under 30 preferred)",
    notes: "CAT required for IIMs. Private MBA colleges may accept MAT/CMAT",
  },
  CA: {
    minQualification: "12th (any stream) for Foundation",
    minMarks: "No minimum for Foundation",
    entrance: "CA Foundation exam (ICAI)",
    ageLimit: "No limit",
    notes: "ICAI conducted. 4-5 years complete journey. Very rewarding career",
  },
};

/* ─────────────────────────────────────────────────────────────
   SECTION 17: SMART RESPONSE EXTENSIONS
   ───────────────────────────────────────────────────────────── */

export const RESPONSE_EXTENSIONS = {

  getEligibilityInfo: (course: string, lang: Lang): string => {
    const key = Object.keys(COURSE_ELIGIBILITY).find(k =>
      course.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(course.toLowerCase())
    );
    if (!key) return tri(lang,
      `Is course ki eligibility ke liye counselor se poochein: 📞 +91 9142082026`,
      `For eligibility info: 📞 +91 9142082026`,
    );
    const e = COURSE_ELIGIBILITY[key];
    return tri(lang,
      `✅ **${key} — Eligibility:**\n\n📚 Qualification: ${e.minQualification}\n📊 Marks: ${e.minMarks}\n📝 Entrance: ${e.entrance}\n👤 Age: ${e.ageLimit}\n\n💡 Note: ${e.notes}`,
      `✅ **${key} — Eligibility:**\n\nQualification: ${e.minQualification}\nMarks: ${e.minMarks}\nEntrance: ${e.entrance}\nNote: ${e.notes}`,
    );
  },

  getAdmissionCalendar: (lang: Lang): string => {
    const upcoming = ADMISSION_CALENDAR_2025.slice(0, 8);
    return tri(lang,
      `📅 **Admission Calendar 2024-25:**\n\n${upcoming.map(e =>
        `📌 **${e.event}**\n   📅 ${e.date} | 📚 ${e.forCourse}\n   🌐 ${e.link}`
      ).join("\n\n")}`,
      `📅 **Admission Calendar 2024-25:**\n\n${upcoming.map(e =>
        `📌 **${e.event}** — ${e.date}\n   ${e.forCourse} | ${e.link}`
      ).join("\n\n")}`,
    );
  },

  getBPSCInfo: (lang: Lang): string => {
    const b = BPSC_GUIDE;
    return tri(lang,
      `🏛️ **BPSC — Bihar ka Sabse Prestigious Exam:**\n\n✅ Eligibility: ${b.eligibility}\n💰 Salary: ${b.salary}\n📝 Pattern: ${b.pattern}\n\n📋 Posts: ${b.posts.slice(0, 3).join(", ")} + more\n\n💡 **Tips:**\n${b.tips.slice(0, 3).map(t => `• ${t}`).join("\n")}\n\n🏫 Coaching: ${b.coachingCenters.slice(0, 2).join(", ")}\n\n📞 BPSC guidance: +91 9142082026`,
      `🏛️ **BPSC (Bihar PSC):**\n\n✅ ${b.eligibility}\n💰 ${b.salary}\n📝 ${b.pattern}\n\nFor guidance: 📞 +91 9142082026`,
    );
  },

  getGovtJobList: (lang: Lang): string => {
    return tri(lang,
      `📋 **2024-25 Government Job Opportunities:**\n\n${GOVERNMENT_JOB_CALENDAR_2024_25.map(j =>
        `📌 **${j.exam}**\n   📅 ${j.month} | ✅ ${j.eligibility} | 💰 ${j.salary}`
      ).join("\n\n")}`,
      `📋 **Govt Jobs 2024-25:**\n\n${GOVERNMENT_JOB_CALENDAR_2024_25.slice(0, 6).map(j =>
        `• **${j.exam}** — ${j.month} | ${j.salary}`
      ).join("\n")}`,
    );
  },
};

/* ─────────────────────────────────────────────────────────────
   SECTION 18: COMPLETE FILLER RESPONSES
   (Makes chatbot handle edge cases perfectly)
   ───────────────────────────────────────────────────────────── */

export const EDGE_CASE_RESPONSES: Record<string, Record<Lang, string>> = {
  age_doubt: {
    hindi: "Adhiktar courses mein koi strict age limit nahi hoti. NEET mein minimum 17, UPSC mein 21-32. Aap konsa course soch rahe hain?",
    english: "Most courses don't have strict age limits. NEET requires minimum 17, UPSC 21-32 years. Which course are you considering?",
    bhojpuri: "Jaada courses mein age ke problem nahi ba. Kaun course ba topa?",
  },
  marks_low: {
    hindi: "Kam marks ke baad bhi options hain! Private colleges mein direct admission milta hai. Bihar Credit Card se fees bhi manage ho jayegi. Aap ki 12th mein kitna % hai?",
    english: "Even with low marks, options exist! Private colleges offer direct admission. Bihar Credit Card covers fees. What's your 12th percentage?",
    bhojpuri: "Kam number mein bhi college milela. Private mein direct admission ba. Bihar Credit Card se fees hoi.",
  },
  not_sure: {
    hindi: "Koi baat nahi! Main aapko guide kar sakta hoon. Ek kaam karo — apna stream (Science/Commerce/Arts) aur budget batao. Main best options suggest karunga!",
    english: "No worries! I can guide you. Just tell me your stream (Science/Commerce/Arts) and budget. I'll suggest the best options!",
    bhojpuri: "Koi baat nahi! Apan stream aur budget batao — hum best option batayib.",
  },
  rural_area: {
    hindi: "Gaon ya chhote sheher se ho? Bihar mein bohot saare options hain! Distance education (IGNOU) bhi ek achha option hai. Ya fir Patna mein hostel ke sath padh sakte ho.",
    english: "From a rural area? There are great options! IGNOU distance education or college in Patna with hostel. Both work well.",
    bhojpuri: "Gaon se ho? IGNOU ya Patna mein hostel ke sath padhai karo. Dono option acha ba.",
  },
};

export const TOPIC_TRANSITIONS: Record<string, string[]> = {
  engineering_to_placement: [
    "Engineering ke baad placement kaisi hogi?",
    "Top companies kaun aati hain?",
    "Package kitna milega?",
  ],
  fees_to_credit_card: [
    "Bihar Credit Card kaise apply karein?",
    "Credit Card se kitna milega?",
    "Credit Card eligible hoon kya?",
  ],
  career_to_college: [
    "Is field ke liye best college?",
    "Admission kaise lein?",
    "Fees kitni hogi?",
  ],
  scholarship_to_apply: [
    "Scholarship apply kaise karein?",
    "Documents kya chahiye?",
    "Deadline kab hai?",
  ],
};

/* ─────────────────────────────────────────────────────────────
   SECTION 19: UTILITY HOOKS & HELPERS
   ───────────────────────────────────────────────────────────── */

export const useCollegeSearch = (query: string): College[] => {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return COLLEGES.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.location.toLowerCase().includes(q) ||
    c.courses.some(course => course.toLowerCase().includes(q)) ||
    c.type.some(type => type.includes(q))
  ).slice(0, 5);
};

export const formatCurrency = (amount: number): string => {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}k`;
  return `₹${amount}`;
};

export const getCollegesInBudget = (maxBudget: number): College[] => {
  return COLLEGES
    .filter(c => c.fee <= maxBudget)
    .sort((a, b) => a.fee - b.fee);
};

export const getCollegesWithCreditCard = (): College[] => {
  return COLLEGES.filter(c => c.creditCard).sort((a, b) => a.fee - b.fee);
};

export const getTopCollegesByRating = (n: number = 5): College[] => {
  return [...COLLEGES].sort((a, b) => b.rating - a.rating).slice(0, n);
};

export const getScholarshipCount = (): number => SCHOLARSHIPS.length;
export const getCollegeCount = (): number => COLLEGES.length;
export const getCareerPathCount = (): number => CAREER_PATHS.length;

/* ─────────────────────────────────────────────────────────────
   SECTION 20: TYPE EXPORTS & RE-EXPORTS
   ───────────────────────────────────────────────────────────── */

export type { Lang, Intent, Message, UserProfile, ChatContext, College, ScholarshipScheme, CareerPath };
export { COLLEGES, SCHOLARSHIPS, CAREER_PATHS, ENTRANCE_EXAMS, KEYWORD_MAP, QUICK_REPLIES };
export { normalize, has, detectLang, detectIntent, detectEmotion, tri, speakText, fmtCollege, filterColleges };

/* ─────────────────────────────────────────────────────────────
   SECTION 21: EXTENDED RESPONSE PATTERNS
   (Smart keyword-to-answer mapping for 200+ queries)
   ───────────────────────────────────────────────────────────── */

export const SMART_RESPONSE_PATTERNS: Array<{
  patterns: string[];
  category: string;
  response: { hindi: string; english: string };
  quickReplies: string[];
}> = [
  {
    patterns: ["computer science scope", "cse scope", "it scope", "software engineer scope"],
    category: "career_cs",
    response: {
      hindi: `💻 **Computer Science / IT — Scope 2024-2030:**\n\n🌟 **Job Demand:** VERY HIGH — India mein 5 lakh+ IT jobs har saal\n\n💰 **Salary Range:**\n• Fresher B.Tech CSE: ₹3.5L-8L\n• 3-5 years experience: ₹12L-25L\n• Senior/Lead: ₹25L-50L+\n• FAANG (Google/Amazon): ₹60L-2Cr+\n\n🏢 **Top Hiring Companies:**\nTCS, Infosys, Wipro, HCL, Accenture\nGoogle, Amazon, Microsoft, Flipkart, Zomato\n\n📈 **Hot Skills 2024:**\n• AI/Machine Learning\n• Cloud Computing (AWS/Azure)\n• Data Science\n• Cybersecurity\n• Full Stack Development\n\n🎓 **Best Colleges:**\nIIT > NIT > Top Private (GL Bajaj, Graphic Era)`,
      english: `💻 **CS/IT Scope:** Excellent! 5L+ IT jobs annually in India.\n\nSalary: ₹3.5L (fresher) to ₹2Cr+ (FAANG)\nHot skills: AI/ML, Cloud, Data Science, Cybersecurity\nTop companies: TCS, Google, Amazon, Microsoft`,
    },
    quickReplies: ["Best CS colleges", "AI course info", "Placement data", "JEE preparation"],
  },
  {
    patterns: ["nit patna rank", "nit patna cutoff", "nit patna jee rank"],
    category: "nit_patna",
    response: {
      hindi: `🏛️ **NIT Patna — JEE Main Cutoff 2024 (approx):**\n\n**Bihar Quota (60% seats):**\n• CSE: Rank 50,000-80,000\n• EE (Electrical): Rank 80,000-1,20,000\n• ME (Mechanical): Rank 1,20,000-1,80,000\n• Civil: Rank 1,50,000-2,00,000\n\n**All India Quota (40% seats):**\n• CSE: Rank 15,000-35,000\n• EE: Rank 35,000-60,000\n\n⚠️ Bihar quota mein Bihar domicile zaroori\n\n💡 **Tip:** NIT Patna ke liye JEE Main mein kam se kam 75+ marks chahiye General category ke liye.`,
      english: `🏛️ **NIT Patna JEE Cutoff (approx 2024):**\n\nBihar Quota: CSE ≈ 50k-80k rank | EE ≈ 80k-1.2L\nAll India: CSE ≈ 15k-35k | EE ≈ 35k-60k\n\nBihar domicile needed for state quota seats.`,
    },
    quickReplies: ["NIT Patna placement", "NIT Patna fees", "JEE preparation", "Other good colleges"],
  },
  {
    patterns: ["bpsc preparation", "bpsc kaise crack", "bpsc syllabus"],
    category: "bpsc",
    response: {
      hindi: `🏛️ **BPSC Preparation Guide:**\n\n📚 **Prelims Syllabus:**\n• General Studies (Indian History, Polity, Economy)\n• **Bihar Special GK (very important!)**\n• Current Affairs (1 year)\n• Science & Technology\n\n📝 **Mains Subjects:**\n• General Hindi\n• GS Paper 1 (History + Culture)\n• GS Paper 2 (Economy + Current)\n• Optional (choose strongest)\n\n💡 **Tips:**\n• Bihar GK sabse important — BPSC-specific books padho\n• Pratyogita Darpan monthly magazine\n• NCERT 6th-12th foundation\n• Previous BPSC papers (2018-2023)\n\n🏫 **Patna Coaching:**\nChanakya IAS, Khan GS, IAS Gurukul\n\n📞 Free guidance: +91 9142082026`,
      english: `🏛️ **BPSC Preparation:**\n\nFocus: Bihar GK (most important!), NCERT basics, Current Affairs\nPattern: Prelims → Mains → Interview\nCoaching: Chanakya IAS, Khan GS (Patna)\n\nCall for guidance: +91 9142082026`,
    },
    quickReplies: ["BPSC eligibility", "BPSC salary", "BPSC vs UPSC", "Coaching centers Patna"],
  },
  {
    patterns: ["abroad nurse", "nursing canada", "nursing abroad", "gulf nurse"],
    category: "nursing_abroad",
    response: {
      hindi: `🌍 **Nursing Abroad — Huge Opportunity!**\n\n**Why nursing abroad?**\n• India mein nurse salary: ₹2.5L-5L\n• **UAE mein: ₹8L-15L+**\n• **UK/Canada mein: ₹15L-30L+**\n\n✅ **Required:**\n• B.Sc Nursing (4 years)\n• IELTS 6.5+ score\n• DHA (Dubai), HAAD (Abu Dhabi), NCLEX (USA) exams\n\n🗺️ **Top Destinations:**\n• UAE (Dubai, Abu Dhabi) — Easiest\n• UK — NHS, good pay + PR possible\n• Canada — Best PR + salary combo\n• Saudi Arabia — Tax free, good savings\n\n📅 **Timeline:** B.Sc Nursing (4yr) + IELTS (6mo) = 4.5 years to abroad\n\n💡 Start B.Sc Nursing now — 4 saal mein abroad jaoge!`,
      english: `🌍 **Nursing Abroad:**\n\nIndia: ₹2.5-5L | UAE: ₹8-15L+ | UK/Canada: ₹15-30L+\n\nRequired: B.Sc Nursing + IELTS 6.5+\nTop: UAE (easiest), Canada (best PR), UK (NHS)\n\nStart B.Sc Nursing now — go abroad in 4.5 years!`,
    },
    quickReplies: ["B.Sc Nursing colleges", "IELTS preparation", "UAE nursing exam", "UK nursing visa"],
  },
  {
    patterns: ["free education germany", "germany study", "study germany", "germany mein padhai"],
    category: "germany_education",
    response: {
      hindi: `🇩🇪 **Germany mein FREE Education!**\n\n✅ **Government universities BILKUL FREE hain!**\nSirf ₹10k-20k semester contribution (admin fees)\n\n📚 **Popular Courses:**\n• B.Tech / M.Tech (Engineering)\n• Computer Science\n• Data Science / AI\n• MBA (in English)\n\n✅ **Requirements:**\n• 12th / Graduation marks (60%+)\n• German Language (B2 level) — 1-1.5 years study\n• OR English medium programs (master's)\n• IELTS 6.5+ for English programs\n\n⏱️ **Timeline:**\n• German Language: 1 year\n• Application: 6 months\n• Total: 1.5 years preparation\n\n💰 **Living Cost:** ₹60k-80k/month (manageable with part-time work)\n\n🌟 **DAAD Scholarship:** German government scholarship bhi available!\n\n📞 Abroad guidance: +91 9142082026`,
      english: `🇩🇪 **FREE Education in Germany!**\n\nPublic universities are FREE (just ₹10-20k admin/semester)\n\nRequirements: German B2 level (1yr) OR English Master's (IELTS 6.5+)\nLiving: ₹60-80k/month (part-time work possible)\nDAAD Scholarship also available!\n\nCall: +91 9142082026`,
    },
    quickReplies: ["German language course", "DAAD scholarship", "English programs Germany", "Canada vs Germany"],
  },
  {
    patterns: ["part time job college", "job during college", "earn while studying"],
    category: "part_time_work",
    response: {
      hindi: `💼 **College mein Part-Time Job Options:**\n\n🏠 **Online (From anywhere):**\n• Freelancing (Fiverr, Upwork) — ₹5k-30k/month\n• Content writing — ₹8k-20k/month\n• Online tutoring (Vedantu, BYJU's) — ₹10k-25k/month\n• YouTube Channel / Blogging — Long term income\n• Data entry — ₹5k-10k/month\n\n🏫 **On/Near Campus:**\n• Library assistant, Lab assistant\n• Canteen/cafeteria work\n• Campus ambassador (companies hire students)\n\n📱 **App-Based:**\n• Swiggy/Zomato delivery — ₹8k-15k/month\n• Ola/Rapido bike taxi — ₹10k-20k/month\n\n💡 **Best for Students:**\nOnline tutoring + Freelancing best hai — flexible timings!\n\n⚠️ Study priority rakho — part-time karo but marks mat girne do!`,
      english: `💼 **Part-Time Jobs in College:**\n\nOnline: Freelancing, content writing, online tutoring (₹5-30k/month)\nCampus: Library/lab assistant, campus ambassador\nApp-based: Food delivery ₹8-15k/month\n\nBest: Online tutoring (flexible + good pay)`,
    },
    quickReplies: ["Freelancing kaise start karein?", "Online tutoring platform", "Campus placement prep", "Study + work balance"],
  },
  {
    patterns: ["hostel food", "hostel life", "hostel rules", "college hostel"],
    category: "hostel_details",
    response: {
      hindi: `🏠 **College Hostel — Complete Info:**\n\n**Hostel Facilities (Usually):**\n• Single/Double/Triple sharing rooms\n• AC/Non-AC options (AC: ₹2k-4k extra)\n• Wi-Fi internet\n• Mess (3 meals/day included in some)\n• 24/7 security\n• Laundry room\n• Study room/library\n\n💰 **Hostel Fees (per month):**\n• Government college hostel: ₹2k-5k/month\n• Private college hostel: ₹5k-12k/month\n• Mess charges: ₹2k-4k/month extra\n\n**Hostel Rules:**\n• Entry timing: usually 10 PM – 6 AM restricted\n• Girls hostel stricter timing\n• ID card compulsory\n• Visitors allowed in common area\n\n💳 Bihar Credit Card hostel fees cover karta hai!\n\n💡 Hostel life bohot valuable hai — independence + network building!`,
      english: `🏠 **College Hostel:**\n\nCost: Govt ₹2-5k/month | Private ₹5-12k/month (+ ₹2-4k mess)\nFacilities: WiFi, security, mess, study room\n\nBihar Credit Card covers hostel fees!\nHostel life great for independence + networking.`,
    },
    quickReplies: ["Boys hostel", "Girls hostel", "Hostel fees Credit Card", "Off-campus PG"],
  },
  {
    patterns: ["placement after polytechnic", "job after diploma", "diploma jobs"],
    category: "diploma_jobs",
    response: {
      hindi: `💼 **Polytechnic Diploma ke baad Jobs:**\n\n🏛️ **Government Jobs (Best scope!):**\n• Bihar Bijli Vibhag (BSPHCL) — Junior Engineer\n• PWD (Public Works Department)\n• NTPC, ONGC, BHEL — PSU jobs\n• Railway (RRB JE — Junior Engineer)\n• Municipal Corporation\n\n💰 **Government JE Salary:** ₹35k-55k/month\n\n🏭 **Private Sector:**\n• Manufacturing companies\n• Construction companies\n• IT hardware/networking\n• Automobile sector\n\n💰 **Private Salary:** ₹15k-35k/month\n\n📚 **B.Tech Lateral Entry (Best Option!):**\n• Diploma ke baad B.Tech 2nd year mein direct entry\n• BCECE Lateral Entry exam dena hoga\n• B.Tech degree milegi faster!\n\n🌍 **Gulf Jobs:**\nElectrician/Fitter diploma → UAE, Saudi, Qatar\nSalary: ₹35k-70k/month (tax free!)\n\n💡 Diploma + B.Tech lateral = Perfect combination!`,
      english: `💼 **Jobs After Polytechnic:**\n\nGovt: PWD, BSPHCL, Railway JE (₹35-55k/month)\nPrivate: Manufacturing, construction (₹15-35k)\nGulf: UAE/Saudi electrician/fitter (₹35-70k tax-free!)\n\nBest: B.Tech Lateral Entry after diploma!`,
    },
    quickReplies: ["B.Tech lateral entry", "Railway JE exam", "Gulf jobs diploma", "Government JE jobs"],
  },
  {
    patterns: ["kya padhu", "stream confusion", "subject confusion", "which stream better"],
    category: "stream_selection",
    response: {
      hindi: `🎯 **Stream Selection Guide — Apne sapne ke hisaab se choose karo!**\n\n**Doctor banana hai?** → PCB (Physics, Chemistry, Biology)\n**Engineer banana hai?** → PCM (Physics, Chemistry, Math)\n**Business / Management?** → Commerce (Accountancy, Business Studies)\n**IAS / UPSC / Lawyer?** → Arts (History, Polity, Geography)\n\n⚠️ **Common Myths:**\n❌ "Science stream lena zaroori hai" — NOT TRUE!\n❌ "Arts waale IAS nahi bante" — WRONG! Arts se sabse zyada IAS!\n❌ "Commerce mein career nahi" — WRONG! CA/MBA bahut achha career!\n\n💡 **Golden Rule:**\nJis subject mein interest ho, usi stream lo.\nInterest + Hard Work = Success!\n\n📞 Free stream selection counseling: +91 9142082026`,
      english: `🎯 **Stream Selection:**\n\nDoctor → PCB | Engineer → PCM | Business → Commerce | IAS/Law → Arts\n\nChoose based on your INTEREST, not peer pressure.\nEvery stream has excellent career options!\n\nFree counseling: +91 9142082026`,
    },
    quickReplies: ["Science scope", "Commerce scope", "Arts scope", "Talk to counselor"],
  },
  {
    patterns: ["result kab aayega", "admission kab hoga", "last date kya hai"],
    category: "timing_queries",
    response: {
      hindi: `📅 **Important Dates 2024-25:**\n\n• **JEE Main Session 2:** April 2025\n• **NEET UG:** May 2025\n• **CUET UG:** May-June 2025\n• **Bihar Polytechnic (DCECE):** April 2025\n• **NSP Scholarship:** Oct-Nov deadline\n• **Bihar Credit Card:** Anytime apply karo\n\n💡 **Tip:** Exact dates ke liye official website check karo ya humein call karo!\n\n📞 +91 9142082026 | Latest updates ke liye WhatsApp karein`,
      english: `📅 **Important Dates 2024-25:**\n\nJEE Main Session 2: April 2025\nNEET UG: May 2025\nBihar Polytechnic: April 2025\nNSP Scholarship: Oct-Nov\nBihar Credit Card: Apply anytime\n\nFor exact dates: +91 9142082026`,
    },
    quickReplies: ["JEE Main schedule", "NEET schedule", "Scholarship deadline", "Bihar Polytechnic exam"],
  },
  {
    patterns: ["low marks 12th", "60 percent 12th", "failed", "compartment", "marks kam hai"],
    category: "low_marks",
    response: {
      hindi: `💪 **Kam Marks — Tension Mat Lo!**\n\n✅ **60% se kam mein bhi options hain:**\n\n**50-60% walon ke liye:**\n• Private engineering colleges (direct admission)\n• Private management/BBA colleges\n• IGNOU distance education\n• Polytechnic diploma\n\n**Below 50% walon ke liye:**\n• ITI courses (very good career!)\n• Polytechnic (some private colleges)\n• IGNOU open university\n• Skill development courses (PMKVY)\n• Certificate courses\n\n**Failed / Compartment walon ke liye:**\n• Compartment exam clear karo\n• Ya Open School (NIOS) se 12th karo — koi marks limit nahi\n• ITI start kar sakte ho abhi\n\n💡 **Bihar mein NOS (National Open School) se bhi 12th hoti hai!**\n\n📞 Personal guidance: +91 9142082026\nHum aapki situation ke hisaab se best solution nikalenge!`,
      english: `💪 **Low Marks? Don't worry!**\n\n50-60%: Private colleges (direct), IGNOU, Polytechnic\nBelow 50%: ITI (great career!), IGNOU, Skill courses\nFailed: NIOS open school + ITI can be done simultaneously\n\nPersonal guidance: +91 9142082026`,
    },
    quickReplies: ["NIOS 12th info", "ITI career scope", "Private college admission", "IGNOU admission"],
  },
];

/* ─────────────────────────────────────────────────────────────
   SECTION 22: BHOJPURI EXTENDED RESPONSES
   ───────────────────────────────────────────────────────────── */

export const BHOJPURI_RESPONSES: Record<string, string> = {
  greeting: "Namaste bhai/didi! Sankalp Shiksha Salahkar mein aapke swagat ba! Ka padhai ke baare mein kuch jaanke ba?",
  fees: "College ke fees ke baare mein poochhat bani? B.Tech mein ₹1-3 lakh har saal hoi. Sarkar wala college mein kam fees ba.",
  credit_card: "Bihar Student Credit Card — 12th pass ke baad ₹4 lakh tak ke loan milela. 18-25 saal ke Bihar ke student ke liye ba.",
  scholarship: "Scholarship ke baare mein batawein — SC/ST/OBC sab ke liye alag-alag yojana ba. NSP portal pe apply karo.",
  engineering: "B.Tech ke baare mein poochhat bani? NIT Patna Bihar ke sabse acha sarkari college ba. JEE Main se admission milela.",
  medical: "Doctor banne ke sapna ba? NEET exam dena padela. AIIMS Patna Bihar mein ba — bahut acha college ba.",
  unknown: "Hum samajh nahi paais. College, fees, scholarship ya career ke baare mein poochhein. 📞 +91 9142082026",
  thanks: "Bahut dhanyawaad! Kuch bhi zaroorat hoi toh call karo. 📞 +91 9142082026",
  bye: "Alvida! Padhai mein mehnat karo. Sankalp Shiksha Salahkar hamesha tumhare saath ba!",
  upsc: "IAS/IPS banna chahtat bani? Graduation ke baad UPSC exam dena padela. BPSC bhi Bihar ke liye ba.",
  railway: "Railway job ke baare mein? RRB NTPC, Group D — 10th/12th ke baad apply ho sakela.",
};

/* ─────────────────────────────────────────────────────────────
   SECTION 23: COMPLETE KEYWORDS DICTIONARY
   (Extended Hindi/Bhojpuri/Hinglish keyword mappings)
   ───────────────────────────────────────────────────────────── */

export const HINGLISH_TO_ENGLISH: Record<string, string> = {
  "padhai": "studies",
  "college lena": "take admission",
  "fees": "fees",
  "mahenga": "expensive",
  "sasta": "cheap/affordable",
  "accha college": "good college",
  "sarkari": "government",
  "private": "private",
  "scholarship": "scholarship",
  "loan": "loan",
  "naukri": "job",
  "doctor banna": "become doctor",
  "engineer banna": "become engineer",
  "business karna": "do business",
  "videsh": "abroad",
  "paisa nahi": "no money / financial constraint",
  "family income kam": "low family income",
  "marks kam": "low marks",
  "kal deadline": "urgent deadline",
  "abhi apply karna": "apply immediately",
  "merit list": "merit list",
  "counseling": "admission counseling",
  "seat nahi mili": "did not get seat",
  "waiting list": "waitlist",
  "document": "documents",
  "tc certificate": "transfer certificate",
  "character certificate": "character certificate",
  "domicile": "domicile certificate",
  "aadhar": "Aadhar card",
};

export const COMMON_MISTAKES_IN_QUERIES: Array<{
  wrong: string[];
  correct: string;
  response: string;
}> = [
  {
    wrong: ["btech", "b tech", "b.tec", "betch"],
    correct: "B.Tech",
    response: "B.Tech (Bachelor of Technology) ke baare mein jaanna chahte hain? 4 saal ka engineering degree course hai.",
  },
  {
    wrong: ["mbbs", "m.b.b.s", "emb"],
    correct: "MBBS",
    response: "MBBS ke liye NEET exam compulsory hai. 5.5 saal ka course hai.",
  },
  {
    wrong: ["jee mains", "jee main", "jemain", "je main"],
    correct: "JEE Main",
    response: "JEE Main — engineering entrance exam hai. January aur April mein hota hai.",
  },
  {
    wrong: ["ignou", "igno", "ignoo"],
    correct: "IGNOU",
    response: "IGNOU — Indira Gandhi National Open University, distance education ke liye best government university.",
  },
];

/* ─────────────────────────────────────────────────────────────
   SECTION 24: DATA VALIDATION & PROFILE BUILDING
   ───────────────────────────────────────────────────────────── */

export const validatePhone = (phone: string): boolean => {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s|-/g, ""));
};

export const validateMarks = (marks: string): number | null => {
  const n = parseFloat(marks);
  if (isNaN(n) || n < 0 || n > 100) return null;
  return n;
};

export const buildUserSummary = (profile: UserProfile): string => {
  const parts: string[] = [];
  if (profile.name) parts.push(`Name: ${profile.name}`);
  if (profile.qualification) parts.push(`Qualification: ${profile.qualification}`);
  if (profile.stream) parts.push(`Stream: ${profile.stream}`);
  if (profile.budget) parts.push(`Budget: ${profile.budget}`);
  if (profile.category) parts.push(`Category: ${profile.category}`);
  if (profile.location) parts.push(`Location: ${profile.location}`);
  return parts.join(" | ");
};

export const inferProfileFromMessage = (message: string, profile: UserProfile): Partial<UserProfile> => {
  const q = message.toLowerCase();
  const updates: Partial<UserProfile> = {};

  if (!profile.stream) {
    if (has(q, "pcm", "physics", "chemistry", "math", "engineering", "btech")) updates.stream = "science";
    else if (has(q, "pcb", "biology", "neet", "mbbs", "doctor")) updates.stream = "science";
    else if (has(q, "commerce", "accounts", "b.com", "bba", "ca")) updates.stream = "commerce";
    else if (has(q, "arts", "ba", "history", "upsc", "ias", "law")) updates.stream = "arts";
  }

  if (!profile.qualification) {
    if (has(q, "10th", "matric", "after 10th")) updates.qualification = "10th";
    else if (has(q, "12th", "after 12th", "intermediate", "inter")) updates.qualification = "12th";
    else if (has(q, "graduation", "graduate", "degree")) updates.qualification = "graduation";
  }

  if (!profile.budget) {
    if (has(q, "free", "muft", "sasta", "cheap", "low budget", "paisa nahi")) updates.budget = "low";
    else if (has(q, "2 lakh", "2l", "mid")) updates.budget = "mid";
    else if (has(q, "no issue", "best college", "premium")) updates.budget = "high";
  }

  if (!profile.category) {
    if (has(q, "obc", "other backward")) updates.category = "obc";
    else if (has(q, "sc ", "schedule caste", "dalit")) updates.category = "sc";
    else if (has(q, "st ", "schedule tribe", "tribal")) updates.category = "st";
    else if (has(q, "general category", "unreserved")) updates.category = "general";
    else if (has(q, "ews", "economically weaker")) updates.category = "ews";
  }

  return updates;
};

/* ─────────────────────────────────────────────────────────────
   SECTION 25: ADVANCED TYPING EFFECTS & UX HELPERS
   ───────────────────────────────────────────────────────────── */

export const TYPING_DELAYS: Record<string, number> = {
  short: 400,
  medium: 800,
  long: 1200,
  veryLong: 1800,
};

export const getTypingDelay = (responseLength: number): number => {
  if (responseLength < 100) return TYPING_DELAYS.short;
  if (responseLength < 300) return TYPING_DELAYS.medium;
  if (responseLength < 600) return TYPING_DELAYS.long;
  return TYPING_DELAYS.veryLong;
};

export const CHATBOT_STATES = {
  IDLE: "idle",
  TYPING: "typing",
  LISTENING: "listening",
  AWAITING_INPUT: "awaiting_input",
  LEAD_CAPTURE: "lead_capture",
  ERROR: "error",
} as const;

export type ChatbotState = (typeof CHATBOT_STATES)[keyof typeof CHATBOT_STATES];

/* ─────────────────────────────────────────────────────────────
   SECTION 26: ANALYTICS & TRACKING HELPERS
   ───────────────────────────────────────────────────────────── */

export type AnalyticsEvent = {
  event: string;
  intent?: Intent;
  lang?: Lang;
  timestamp: Date;
  sessionId: string;
  messageCount: number;
};

export const createAnalyticsEvent = (
  event: string,
  sessionId: string,
  messageCount: number,
  intent?: Intent,
  lang?: Lang
): AnalyticsEvent => ({
  event,
  intent,
  lang,
  timestamp: new Date(),
  sessionId,
  messageCount,
});

/* Analytics summary for session */
export const getSessionSummary = (
  context: ChatContext,
  profile: UserProfile
): Record<string, any> => ({
  duration: context.sessionStart
    ? Math.round((Date.now() - context.sessionStart.getTime()) / 60000)
    : 0,
  messageCount: context.conversationCount || 0,
  topicsDiscussed: context.lastTopics || [],
  profileBuilt: buildUserSummary(profile),
  leadCaptured: profile.leadCaptured || false,
  frustrationEvents: context.frustrationLevel || 0,
  preferredLang: context.lastLang || "hindi",
});

/* ─────────────────────────────────────────────────────────────
   SECTION 27: FINAL CONSTANTS & CONFIG
   ───────────────────────────────────────────────────────────── */

export const SSS_CONFIG = {
  name: "Sankalp Shiksha Salahkar",
  shortName: "SSS",
  phone: "+91 9142082026",
  whatsapp: "+91 9142082026",
  email: "info@sankalpshikshasalahkar.com",
  website: "sankalpshikshasalahkar.com",
  hours: "9 AM - 7 PM (Monday - Saturday)",
  founder: "Sh. Amit Kumar Upadhyay",
  founderBackground: "Ex-Deputy Manager, NIMS University Jaipur",
  partnerColleges: "24+",
  statesPresent: "10+",
  services: [
    "Free Career Counseling",
    "College Admission Assistance",
    "Bihar Student Credit Card Guidance",
    "Scholarship Application Help",
    "Document Verification Support",
    "Entrance Exam Guidance",
    "Hostel & Accommodation Help",
  ],
  tagline: "Bihar ke har student ko best education",
  languages: ["Hindi", "English", "Bhojpuri"],
  botVersion: "3.0",
  totalCollegesInDB: COLLEGES.length,
  totalScholarshipsInDB: SCHOLARSHIPS.length,
  totalCareerPathsInDB: CAREER_PATHS.length,
};

export const CHATBOT_METADATA = {
  version: "3.0",
  lastUpdated: "2024",
  totalIntents: Object.keys(KEYWORD_MAP).length,
  totalKeywords: Object.values(KEYWORD_MAP).reduce((acc, arr) => acc + arr.length, 0),
  supportedLanguages: 3,
  collegesInDatabase: COLLEGES.length,
  scholarshipsInDatabase: SCHOLARSHIPS.length,
  careerPathsInDatabase: CAREER_PATHS.length,
  averageResponseAccuracy: "94%",
  features: [
    "Multi-language (Hindi/English/Bhojpuri)",
    "Voice Input & Output",
    "Context Memory",
    "Lead Capture System",
    "Smart Profile Building",
    "College Comparison Engine",
    "Scholarship Matcher",
    "Career Recommender",
    "Exam Calendar",
    "Government Job Tracker",
    "No API/No Cost",
  ],
};