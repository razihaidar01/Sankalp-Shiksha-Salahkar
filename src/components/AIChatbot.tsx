import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User } from "lucide-react";
import logo from "@/assets/logo.png";

type Message = { role: "user" | "assistant"; content: string };

// LANGUAGE DETECTION
const detectLang = (text: string): "hindi" | "bhojpuri" | "english" => {
  if (/[\u0900-\u097f]/.test(text)) return "hindi";
  if (/(bhaiya|didi|\bba\b|hau\b|hamar|tohar|kaisan|rauwa|hamra|batao bhai|bhai sahab|bolo bhai|kaise ba|raur|milela|kariha|jaib|aib|dekha|suna|bata)/i.test(text)) return "bhojpuri";
  return "english";
};

// FUZZY KEYWORD MATCH
const has = (input: string, ...keywords: string[]): boolean => {
  const q = input.toLowerCase().replace(/[^\w\u0900-\u097f\s]/g, " ").replace(/\s+/g, " ");
  return keywords.some(kw => {
    const k = kw.toLowerCase();
    if (q.includes(k)) return true;
    const words = q.split(" ");
    return words.some(word => {
      if (Math.abs(word.length - k.length) > 2) return false;
      if (k.length < 5) return word === k;
      let matches = 0;
      for (let i = 0; i < Math.min(word.length, k.length); i++) {
        if (word[i] === k[i]) matches++;
      }
      return matches / Math.max(word.length, k.length) >= 0.75;
    });
  });
};

// ALL COLLEGE DATA
const colleges = [
  { name: "Sandip University", loc: "Bihar (Madhubani)", naac: "NAAC B+", fee: "1", courses: "B.Tech, BCA, MBA, LLB, PhD, B.Ed", credit: true, type: ["engineering","management","law","science"] },
  { name: "Shridevi Group", loc: "Karnataka", naac: "NAAC A+", fee: "1.16", courses: "B.Tech, MBA, Diploma, Medical Diplomas", credit: false, type: ["engineering","management","medical"] },
  { name: "GNIOT Group", loc: "Greater Noida, UP", naac: "NAAC A+", fee: "1.35", courses: "B.Tech, MBA, MCA, BBA, BCA, B.Pharma, LLB", credit: true, type: ["engineering","management","pharmacy","law"] },
  { name: "Tula's Institute", loc: "Dehradun", naac: "NAAC A+", fee: "1.39", courses: "B.Tech, MBA, MCA, BCA, BBA, B.Sc Agri", credit: true, type: ["engineering","management","agriculture"] },
  { name: "Magadh Group", loc: "Patna, Bihar", naac: "", fee: "1.8", courses: "MBA, MCA, BBA, BCA, B.Pharma, D.Pharma, Diploma", credit: true, type: ["management","pharmacy"] },
  { name: "Arka Jain University", loc: "Jharkhand", naac: "NAAC A", fee: "1.8", courses: "BCA, B.Tech, MCA, BBA, MBA, Diploma, B.Sc Biotech", credit: true, type: ["engineering","management","science"] },
  { name: "Khalsa College of Engineering", loc: "Punjab", naac: "NAAC A+", fee: "1.9", courses: "Diploma, B.Tech, BCA, BBA, MCA, MBA", credit: true, type: ["engineering","management"] },
  { name: "SRM Institute", loc: "Ghaziabad, UP", naac: "NAAC A++", fee: "1.96", courses: "B.Tech CSE/AIML/Data Science/Cyber Security, MBA, MCA, BBA", credit: true, type: ["engineering","management"] },
  { name: "Excel Engineering College", loc: "Tamil Nadu", naac: "NAAC A+", fee: "2.01", courses: "B.Tech, M.Tech, MBA/MCA", credit: false, type: ["engineering","management"] },
  { name: "MGM Group", loc: "Patna, Bihar", naac: "", fee: "2.1", courses: "BCA, BBA, LLB, B.Pharma, Nursing, ANM", credit: true, type: ["management","law","pharmacy","medical"] },
  { name: "Desh Bhagat University", loc: "Punjab", naac: "NAAC A+", fee: "2.38", courses: "B.Tech, LLB, B.Pharma, GNM, Diploma", credit: true, type: ["engineering","law","pharmacy","medical"] },
  { name: "SRM Sonepat", loc: "Haryana", naac: "", fee: "2.57", courses: "B.Tech CSE/AI&ML, BCA/MCA, BBA, MBA", credit: true, type: ["engineering","management"] },
  { name: "Oxford Business College", loc: "Patna, Bihar", naac: "", fee: "2.6", courses: "BBA, BCA, BBM", credit: true, type: ["management"] },
  { name: "CT Group", loc: "Punjab", naac: "NAAC A", fee: "2.8", courses: "B.Tech, MBA, MCA, Diploma", credit: true, type: ["engineering","management"] },
  { name: "Gokul Global University", loc: "Gujarat", naac: "NAAC A", fee: "3", courses: "B.Tech, BBA, MBA, B.Pharma, BPT, B.Sc Nursing, GNM", credit: true, type: ["engineering","management","pharmacy","medical"] },
  { name: "Gandhi Engineering College", loc: "Odisha", naac: "NAAC A+", fee: "3", courses: "B.Tech CSE, Diploma, MBA", credit: false, type: ["engineering","management"] },
  { name: "PP Savani University", loc: "Surat, Gujarat", naac: "NAAC A+", fee: "3.15", courses: "B.Tech, BCA, B.Pharma, GNM, B.Sc Nursing", credit: true, type: ["engineering","pharmacy","medical"] },
  { name: "Baba Farid Group", loc: "Punjab", naac: "NAAC A+", fee: "3.15", courses: "B.Tech, BCA, BBA, MBA, MCA, B.Sc Agri", credit: true, type: ["engineering","management","agriculture"] },
  { name: "Mewar University", loc: "Rajasthan", naac: "NAAC A+", fee: "3.3", courses: "B.Tech, BPT, BBA, MBA, LLB, MCA, B.Pharma", credit: true, type: ["engineering","management","law","pharmacy","medical"] },
  { name: "Kashi Institute of Technology", loc: "UP", naac: "NAAC A", fee: "3.32", courses: "B.Tech, MBA, MCA, BBA, BCA, Polytechnic", credit: true, type: ["engineering","management"] },
  { name: "Mangalaytan University", loc: "UP", naac: "NAAC A+", fee: "3.44", courses: "B.Tech, BCA, MCA, B.Pharma, BPT, BBA, MBA, LLB, B.Com", credit: true, type: ["engineering","management","pharmacy","law","medical"] },
  { name: "Amritsar Group", loc: "Punjab", naac: "NAAC A", fee: "3.45", courses: "B.Tech, MBA, B.Pharma, Nursing, Fashion Design", credit: true, type: ["engineering","management","pharmacy","medical"] },
  { name: "Vivekanand Global University", loc: "Jaipur, Rajasthan", naac: "NAAC A+", fee: "3.5", courses: "B.Tech, BCA, MCA, BBA, MBA, B.Com, B.Sc Agri", credit: true, type: ["engineering","management","agriculture","science"] },
  { name: "Maharishi Markandeshwar", loc: "Haryana", naac: "NAAC A++", fee: "4.1", courses: "B.Tech, MBA, MCA, B.Pharma, B.Sc Agri, BHMCT", credit: false, type: ["engineering","management","pharmacy","agriculture"] },
];

const fmt = (c: typeof colleges[0]) =>
  `\u2022 **${c.name}** \u2014 ${c.loc} | ${c.naac || "Approved"} | From \u20b9${c.fee}L${c.credit ? " | Credit Card \u2713" : ""}`;

const PHONE = "+91 9142082026";
const EMAIL = "md.sankalpshikshasalahkar@gmail.com";

const getResponse = (input: string, _history: Message[]): string => {
  const q = input.toLowerCase().trim();
  const lang = detectLang(input);

  const hi = (h: string, e: string, b?: string) =>
    lang === "hindi" ? h : lang === "bhojpuri" ? (b || e) : e;

  // GREETINGS
  if (has(q, "hello", "hi", "hey", "helo", "namaste", "namaskar", "pranam", "ram ram", "salaam", "kaise", "kaisa", "kya haal", "whats up", "good morning", "good evening", "good afternoon", "shubh", "\u0928\u092e\u0938\u094d\u0924\u0947", "\u0939\u0947\u0932\u094b", "\u092a\u094d\u0930\u0923\u093e\u092e", "\u0915\u0948\u0938\u0947")) {
    return hi(
      "\u0928\u092e\u0938\u094d\u0924\u0947! \uD83D\uDE4F \u0938\u0902\u0915\u0932\u094d\u092a \u0936\u093f\u0915\u094d\u0937\u093e \u0938\u0932\u093e\u0939\u0915\u093e\u0930 \u092e\u0947\u0902 \u0906\u092a\u0915\u093e \u0938\u094d\u0935\u093e\u0917\u0924 \u0939\u0948!\n\n\u092e\u0948\u0902 \u0906\u092a\u0915\u0940 \u092e\u0926\u0926 \u0915\u0930 \u0938\u0915\u0924\u093e \u0939\u0942\u0902:\n\u2022 \u0915\u0949\u0932\u0947\u091c \u090f\u0921\u092e\u093f\u0936\u0928\n\u2022 Bihar Student Credit Card\n\u2022 Course \u0938\u093f\u0932\u0947\u0915\u094d\u0936\u0928\n\u2022 Scholarship\n\n\u0915\u094d\u092f\u093e \u092a\u0942\u091b\u0928\u093e \u0939\u0948? \uD83D\uDE0A",
      "Namaste! \uD83D\uDE4F Welcome to Sankalp Shiksha Salahkar!\n\nI can help you with:\n\u2022 College admissions\n\u2022 Bihar Student Credit Card\n\u2022 Course selection\n\u2022 Scholarships\n\nWhat would you like to know? \uD83D\uDE0A",
      "Pranam bhaiya/didi! \uD83D\uDE4F Sankalp Shiksha Salahkar mein raur swagat ba!\nKa jaanna chahela? College, Credit Card, Course \u2014 sab ke baare mein batab! \uD83D\uDE0A"
    );
  }

  // WHO ARE YOU
  if (has(q, "who are you", "kaun ho", "kya ho", "bot", "ai", "robot", "introduce", "tum kaun", "\u0906\u092a \u0915\u094c\u0928", "\u0915\u094c\u0928 \u0939\u094b")) {
    return hi(
      "\u092e\u0948\u0902 Sankalp Shiksha Salahkar \u0915\u093e AI Education Counselor \u0939\u0942\u0902! \uD83C\uDF93\n\n\u2022 **\u0938\u0902\u0938\u094d\u0925\u093e\u092a\u0915**: \u0936\u094d\u0930\u0940 \u0905\u092e\u093f\u0924 \u0915\u0941\u092e\u093e\u0930 \u0909\u092a\u093e\u0927\u094d\u092f\u093e\u092f \u091c\u0940\n\u2022 NIMS University \u091c\u092f\u092a\u0941\u0930 \u0915\u0947 \u092a\u0942\u0930\u094d\u0935 Deputy Manager\n\u2022 24+ Partner Colleges\n\u2022 10+ \u0930\u093e\u091c\u094d\u092f\u094b\u0902 \u092e\u0947\u0902 \u0911\u092b\u093f\u0938\n\n\u092e\u0948\u0902 24/7 \u0906\u092a\u0915\u0940 \u0938\u0947\u0935\u093e \u092e\u0947\u0902 \u0939\u0942\u0902! \uD83D\uDE0A",
      "I'm the AI Education Counselor of Sankalp Shiksha Salahkar! \uD83C\uDF93\n\n\u2022 Founded by Sh. Amit Kumar Upadhyay\n\u2022 Ex-Deputy Manager, NIMS University Jaipur\n\u2022 24+ partner colleges across India\n\u2022 Offices in 10+ states\n\nHere 24/7 to guide you! \uD83D\uDE0A",
      "Ham Sankalp ke AI Counselor hain! \uD83C\uDF93\n24+ college partner ba, 10+ state mein office ba.\nCall: \uD83D\uDCDE " + PHONE
    );
  }

  // FOUNDER
  if (has(q, "founder", "owner", "malik", "amit", "upadhyay", "director", "\u0938\u0902\u0938\u094d\u0925\u093e\u092a\u0915", "\u092e\u093e\u0932\u093f\u0915", "\u0905\u092e\u093f\u0924")) {
    return hi(
      "**\u0936\u094d\u0930\u0940 \u0905\u092e\u093f\u0924 \u0915\u0941\u092e\u093e\u0930 \u0909\u092a\u093e\u0927\u094d\u092f\u093e\u092f \u091c\u0940** \uD83D\uDE4F\n\n\u2022 NIMS University \u091c\u092f\u092a\u0941\u0930 \u0915\u0947 \u092a\u0942\u0930\u094d\u0935 Deputy Manager\n\u2022 Sankalp Educational Foundation \u0915\u0947 \u092a\u094d\u0930\u092e\u0941\u0916\n\u2022 Raxaul, Bihar \u092e\u0947\u0902 \u092e\u0941\u0916\u094d\u092f\u093e\u0932\u092f\n\u2022 \u0939\u0930 \u091b\u093e\u0924\u094d\u0930 \u0915\u094b \u0938\u0939\u0940 \u0915\u0949\u0932\u0947\u091c \u0926\u093f\u0932\u093e\u0928\u093e \u0909\u0928\u0915\u093e \u092e\u093f\u0936\u0928\n\n\uD83D\uDCDE " + PHONE,
      "**Sh. Amit Kumar Upadhyay ji** founded Sankalp Shiksha Salahkar! \uD83D\uDE4F\n\n\u2022 Former Deputy Manager, NIMS University Jaipur\n\u2022 Head of Sankalp Educational Foundation\n\u2022 HQ: Raxaul, Bihar\n\u2022 Mission: right college for every student\n\n\uD83D\uDCDE " + PHONE,
      "Founder hain **Sh. Amit Kumar Upadhyay ji**! \uD83D\uDE4F\nNIMS University Jaipur mein Deputy Manager rahe.\nCall: \uD83D\uDCDE " + PHONE
    );
  }

  // BIHAR STUDENT CREDIT CARD
  if (has(q, "credit card", "credit", "loan", "bscc", "bihar student", "4 lakh", "4lakh", "loun", "lone", "paisa", "paise", "\u092a\u0948\u0938\u0947", "\u0915\u094d\u0930\u0947\u0921\u093f\u091f", "\u0938\u0930\u0915\u093e\u0930\u0940 \u0932\u094b\u0928")) {
    return hi(
      "**Bihar Student Credit Card (BSCC)** \uD83C\uDFE6\n\n\u2705 \u20b94 \u0932\u093e\u0916 \u0924\u0915 \u0915\u093e \u0932\u094b\u0928 \u2014 \u092c\u0939\u0941\u0924 \u0915\u092e \u092c\u094d\u092f\u093e\u091c \u092a\u0930\n\u2705 \u0939\u092e \u092c\u093f\u0932\u094d\u0915\u0941\u0932 \u092e\u0941\u092b\u094d\u0924 \u092e\u0947\u0902 process \u0915\u0930\u0924\u0947 \u0939\u0948\u0902!\n\n\uD83D\uDCC4 **Student Documents:**\n\u2022 \u0906\u0927\u093e\u0930 \u0915\u093e\u0930\u094d\u0921\n\u2022 10\u0935\u0940\u0902/12\u0935\u0940\u0902 \u092e\u093e\u0930\u094d\u0915\u0936\u0940\u091f\n\u2022 \u0928\u093f\u0935\u093e\u0938 \u092a\u094d\u0930\u092e\u093e\u0923 \u092a\u0924\u094d\u0930\n\u2022 \u092c\u0948\u0902\u0915 \u092a\u093e\u0938\u092c\u0941\u0915\n\u2022 2 \u092a\u093e\u0938\u092a\u094b\u0930\u094d\u091f \u092b\u094b\u091f\u094b\n\n\uD83D\uDCC4 **Parent Documents:**\n\u2022 \u0906\u0927\u093e\u0930 \u0915\u093e\u0930\u094d\u0921, 2 \u092b\u094b\u091f\u094b\n\n\uD83D\uDCB0 Bonafide: \u20b910,000 | Registration: \u20b92,000\n\n\uD83D\uDCDE " + PHONE,
      "**Bihar Student Credit Card (BSCC)** \uD83C\uDFE6\n\n\u2705 Up to \u20b94 lakh loan at very low interest\n\u2705 We process it completely FREE!\n\n\uD83D\uDCC4 Student Documents:\n\u2022 Aadhaar Card\n\u2022 10th/12th Marksheet\n\u2022 Residential Certificate\n\u2022 Bank Passbook\n\u2022 2 Passport Photos\n\n\uD83D\uDCC4 Parent: Aadhaar + 2 Photos\n\n\uD83D\uDCB0 Bonafide: \u20b910,000 | Reg: \u20b92,000\n\nCall now: \uD83D\uDCDE " + PHONE,
      "**Bihar Student Credit Card** \uD83C\uDFE6\n\u20b94 lakh tak loan milela \u2014 bahut kam byaaj!\nHam bilkul muft mein process karila!\n\nDocuments: Aadhaar, Marksheet, Passbook, Photo\nCall: \uD83D\uDCDE " + PHONE
    );
  }

  // SCHOLARSHIP
  if (has(q, "scholarship", "free", "muft", "stipend", "fellowship", "skolarship", "scholrship", "\u0935\u091c\u0940\u092b\u093e", "\u091b\u093e\u0924\u094d\u0930\u0935\u0943\u0924\u094d\u0924\u093f")) {
    return hi(
      "**Scholarship Opportunities** \uD83C\uDFC6\n\n\uD83D\uDCCC Government Schemes:\n\u2022 NSP (National Scholarship Portal)\n\u2022 Post-Matric Bihar Scholarship\n\u2022 Mukhyamantri Kanya Utthan Yojana\n\u2022 Bihar Student Credit Card (\u20b94L)\n\n\uD83D\uDCCC College Merit Scholarships:\n\u2022 GNIOT, SRM, Sandip, Tula's \u2014 sab offer karte hain\n\u2022 Top scorers ko 50% fee waiver bhi!\n\nEligibility check ke liye:\n\uD83D\uDCDE " + PHONE,
      "**Scholarship Opportunities** \uD83C\uDFC6\n\n\uD83D\uDCCC Government:\n\u2022 NSP (National Scholarship Portal)\n\u2022 Post-Matric Bihar Scholarship\n\u2022 Mukhyamantri Kanya Utthan Yojana\n\u2022 Bihar Student Credit Card (\u20b94L loan)\n\n\uD83D\uDCCC College Scholarships:\n\u2022 Up to 50% fee waiver for top scorers\n\u2022 Available at GNIOT, SRM, Sandip & more\n\nCheck your eligibility: \uD83D\uDCDE " + PHONE,
      "**Scholarship** \uD83C\uDFC6\n\u2022 NSP Scholarship\n\u2022 Post-Matric Bihar\n\u2022 Bihar Credit Card (\u20b94L)\n\u2022 College merit waiver\n\nCall: \uD83D\uDCDE " + PHONE
    );
  }

  // B.TECH / ENGINEERING
  if (has(q, "btech", "b tech", "b.tech", "engineering", "engg", "computer science", "cse", "mechanical", "civil", "electrical", "ece", "aiml", "data science", "cyber", "\u0907\u0902\u091c\u0940\u0928\u093f\u092f\u0930\u093f\u0902\u0917", "\u092c\u0940\u091f\u0947\u0915")) {
    const eng = colleges.filter(c => c.type.includes("engineering")).sort((a, b) => parseFloat(a.fee) - parseFloat(b.fee));
    return hi(
      `**B.Tech / Engineering Colleges** \uD83C\uDF93\n\n${eng.slice(0,6).map(fmt).join("\n")}\n\nBihar Student Credit Card se admission possible!\n\uD83D\uDCDE ` + PHONE,
      `**B.Tech / Engineering Colleges** \uD83C\uDF93\n\n${eng.slice(0,6).map(fmt).join("\n")}\n\nBihar Student Credit Card accepted at most!\nCall: \uD83D\uDCDE ` + PHONE,
      `**B.Tech Colleges** \uD83C\uDF93\n\n${eng.slice(0,5).map(c => `\u2022 **${c.name}** \u2014 ${c.loc} | \u20b9${c.fee}L`).join("\n")}\n\nCall: \uD83D\uDCDE ` + PHONE
    );
  }

  // MBA / MANAGEMENT / BBA
  if (has(q, "mba", "management", "bba", "business", "managment", "\u090f\u092e\u092c\u0940\u090f", "\u092e\u0948\u0928\u0947\u091c\u092e\u0947\u0902\u091f")) {
    const mgmt = colleges.filter(c => c.type.includes("management")).sort((a, b) => parseFloat(a.fee) - parseFloat(b.fee));
    return hi(
      `**MBA / Management Colleges** \uD83D\uDCBC\n\n${mgmt.slice(0,6).map(fmt).join("\n")}\n\nCall: \uD83D\uDCDE ` + PHONE,
      `**MBA / Management Colleges** \uD83D\uDCBC\n\n${mgmt.slice(0,6).map(fmt).join("\n")}\n\nCall: \uD83D\uDCDE ` + PHONE,
      `**MBA Colleges** \uD83D\uDCBC\n\n${mgmt.slice(0,5).map(c => `\u2022 **${c.name}** \u2014 ${c.loc} | \u20b9${c.fee}L`).join("\n")}\n\nCall: \uD83D\uDCDE ` + PHONE
    );
  }

  // MCA / BCA
  if (has(q, "mca", "bca", "computer application", "information technology", "\u090f\u092e\u0938\u0940\u090f", "\u092c\u0940\u0938\u0940\u090f")) {
    const it = colleges.filter(c => c.courses.toLowerCase().includes("mca") || c.courses.toLowerCase().includes("bca"));
    return hi(
      `**MCA / BCA Colleges** \uD83D\uDCBB\n\n${it.slice(0,6).map(fmt).join("\n")}\n\nCall: \uD83D\uDCDE ` + PHONE,
      `**MCA / BCA Colleges** \uD83D\uDCBB\n\n${it.slice(0,6).map(fmt).join("\n")}\n\nCall: \uD83D\uDCDE ` + PHONE,
      `**MCA/BCA Colleges** \uD83D\uDCBB\n\n${it.slice(0,5).map(c => `\u2022 **${c.name}** \u2014 \u20b9${c.fee}L`).join("\n")}\n\nCall: \uD83D\uDCDE ` + PHONE
    );
  }

  // PHARMACY
  if (has(q, "pharma", "pharmacy", "b.pharma", "bpharma", "d.pharma", "\u092b\u093e\u0930\u094d\u092e\u093e", "\u092b\u093e\u0930\u094d\u092e\u0947\u0938\u0940")) {
    const ph = colleges.filter(c => c.type.includes("pharmacy"));
    return hi(
      `**Pharmacy Colleges** \uD83D\uDC8A\n\n${ph.map(fmt).join("\n")}\n\nCall: \uD83D\uDCDE ` + PHONE,
      `**Pharmacy Colleges** \uD83D\uDC8A\n\n${ph.map(fmt).join("\n")}\n\nCall: \uD83D\uDCDE ` + PHONE,
      `**Pharmacy** \uD83D\uDC8A\n${ph.slice(0,5).map(c => `\u2022 ${c.name} | \u20b9${c.fee}L`).join("\n")}\nCall: \uD83D\uDCDE ` + PHONE
    );
  }

  // NURSING / MEDICAL
  if (has(q, "nursing", "gnm", "anm", "bsc nursing", "medical", "bpt", "physiotherapy", "\u0928\u0930\u094d\u0938\u093f\u0902\u0917", "\u092e\u0947\u0921\u093f\u0915\u0932")) {
    const med = colleges.filter(c => c.type.includes("medical"));
    return hi(
      `**Nursing / Medical Colleges** \uD83C\uDFE5\n\n${med.map(fmt).join("\n")}\n\nCall: \uD83D\uDCDE ` + PHONE,
      `**Nursing / Medical Colleges** \uD83C\uDFE5\n\n${med.map(fmt).join("\n")}\n\nCall: \uD83D\uDCDE ` + PHONE,
      `**Nursing/Medical** \uD83C\uDFE5\n${med.slice(0,5).map(c => `\u2022 ${c.name} | \u20b9${c.fee}L`).join("\n")}\nCall: \uD83D\uDCDE ` + PHONE
    );
  }

  // LAW / LLB
  if (has(q, "law", "llb", "legal", "advocate", "vakil", "\u0935\u0915\u0940\u0932", "\u0932\u0949", "\u0915\u093e\u0928\u0942\u0928")) {
    const law = colleges.filter(c => c.type.includes("law"));
    return hi(
      `**Law / LLB Colleges** \u2696\uFE0F\n\n${law.map(fmt).join("\n")}\n\nCall: \uD83D\uDCDE ` + PHONE,
      `**Law / LLB Colleges** \u2696\uFE0F\n\n${law.map(fmt).join("\n")}\n\nCall: \uD83D\uDCDE ` + PHONE,
      `**Law Colleges** \u2696\uFE0F\n${law.map(c => `\u2022 ${c.name} | \u20b9${c.fee}L`).join("\n")}\nCall: \uD83D\uDCDE ` + PHONE
    );
  }

  // AGRICULTURE
  if (has(q, "agriculture", "agri", "farming", "bsc agri", "kisan", "krishi", "\u0916\u0947\u0924\u0940", "\u0915\u0943\u0937\u093f", "\u090f\u0917\u094d\u0930\u0940")) {
    const agri = colleges.filter(c => c.type.includes("agriculture"));
    return hi(
      `**Agriculture Colleges** \uD83C\uDF3E\n\n${agri.map(fmt).join("\n")}\n\nCall: \uD83D\uDCDE ` + PHONE,
      `**Agriculture Colleges** \uD83C\uDF3E\n\n${agri.map(fmt).join("\n")}\n\nCall: \uD83D\uDCDE ` + PHONE,
      `**Agriculture** \uD83C\uDF3E\n${agri.map(c => `\u2022 ${c.name} | \u20b9${c.fee}L`).join("\n")}\nCall: \uD83D\uDCDE ` + PHONE
    );
  }

  // DIPLOMA
  if (has(q, "diploma", "polytechnic", "\u0921\u093f\u092a\u094d\u0932\u094b\u092e\u093e", "\u092a\u0949\u0932\u093f\u091f\u0947\u0915\u094d\u0928\u093f\u0915")) {
    const dip = colleges.filter(c => c.courses.toLowerCase().includes("diploma") || c.courses.toLowerCase().includes("polytechnic"));
    return hi(
      `**Diploma / Polytechnic** \uD83D\uDD27\n\n${dip.slice(0,6).map(fmt).join("\n")}\n\nCall: \uD83D\uDCDE ` + PHONE,
      `**Diploma / Polytechnic** \uD83D\uDD27\n\n${dip.slice(0,6).map(fmt).join("\n")}\n\nCall: \uD83D\uDCDE ` + PHONE,
      `**Diploma** \uD83D\uDD27\n${dip.slice(0,5).map(c => `\u2022 ${c.name} | \u20b9${c.fee}L`).join("\n")}\nCall: \uD83D\uDCDE ` + PHONE
    );
  }

  // FEES / CHEAPEST
  if (has(q, "fees", "fee", "kitni fees", "cost", "cheap", "affordable", "sasta", "low budget", "budget", "kam paise", "\u0915\u092e \u092b\u0940\u0938", "\u0938\u0938\u094d\u0924\u093e", "\u092b\u0940\u0938")) {
    const cheap = [...colleges].sort((a, b) => parseFloat(a.fee) - parseFloat(b.fee)).slice(0, 6);
    return hi(
      `**\u0938\u092c\u0938\u0947 \u0915\u092e \u092b\u0940\u0938 \u0935\u093e\u0932\u0947 Colleges** \uD83D\uDCB0\n\n${cheap.map(c => `\u2022 **${c.name}** \u2014 ${c.loc} | **\u20b9${c.fee}L** \u0938\u0947 \u0936\u0941\u0930\u0942${c.credit ? " | Credit Card \u2713" : ""}`).join("\n")}\n\nBihar Student Credit Card \u0938\u0947 \u0914\u0930 \u0906\u0938\u093e\u0928!\n\uD83D\uDCDE ` + PHONE,
      `**Most Affordable Colleges** \uD83D\uDCB0\n\n${cheap.map(c => `\u2022 **${c.name}** \u2014 ${c.loc} | From **\u20b9${c.fee}L**${c.credit ? " | Credit Card \u2713" : ""}`).join("\n")}\n\nBihar Student Credit Card makes it easier!\nCall: \uD83D\uDCDE ` + PHONE,
      `**Saste Colleges** \uD83D\uDCB0\n\n${cheap.map(c => `\u2022 **${c.name}** \u2014 \u20b9${c.fee}L`).join("\n")}\n\nCredit Card se aur aasan!\nCall: \uD83D\uDCDE ` + PHONE
    );
  }

  // ALL COLLEGES
  if (has(q, "all college", "sab college", "list", "kitne college", "how many", "total", "partner college", "\u0938\u092d\u0940 \u0915\u0949\u0932\u0947\u091c", "\u0915\u0941\u0932 \u0915\u0949\u0932\u0947\u091c")) {
    return hi(
      `Hamare **24 Partner Colleges** hain! \uD83C\uDF93\n\n\uD83D\uDCCD Bihar: Sandip, Magadh, MGM, Oxford Business\n\uD83D\uDCCD UP/Noida: GNIOT, SRM, Mangalaytan, Kashi\n\uD83D\uDCCD Punjab: Khalsa, Desh Bhagat, CT, Baba Farid, Amritsar\n\uD83D\uDCCD Haryana: SRM Sonepat, Maharishi Markandeshwar\n\uD83D\uDCCD Rajasthan: Mewar, Vivekanand Global\n\uD83D\uDCCD Gujarat: Gokul Global, PP Savani\n\uD83D\uDCCD Uttarakhand: Tula's | Jharkhand: Arka Jain\n\uD83D\uDCCD Tamil Nadu: Excel | Karnataka: Shridevi | Odisha: Gandhi\n\nCall: \uD83D\uDCDE ` + PHONE,
      `We have **24 Partner Colleges** across India! \uD83C\uDF93\n\n\uD83D\uDCCD Bihar: Sandip, Magadh, MGM, Oxford\n\uD83D\uDCCD UP: GNIOT, SRM, Mangalaytan, Kashi\n\uD83D\uDCCD Punjab: Khalsa, Desh Bhagat, CT, Baba Farid\n\uD83D\uDCCD Haryana: SRM Sonepat, MM University\n\uD83D\uDCCD Rajasthan: Mewar, Vivekanand Global\n\uD83D\uDCCD Gujarat, Uttarakhand, Jharkhand, Tamil Nadu, Karnataka, Odisha\n\nCall: \uD83D\uDCDE ` + PHONE,
      `Hamare **24 colleges** hain! \uD83C\uDF93\nBihar, UP, Punjab, Rajasthan, Gujarat aur bhi!\nCall: \uD83D\uDCDE ` + PHONE
    );
  }

  // SPECIFIC COLLEGE LOOKUP
  for (const col of colleges) {
    const colWords = col.name.toLowerCase().split(" ");
    if (colWords.some(w => w.length > 3 && q.includes(w))) {
      return hi(
        `**${col.name}** \uD83C\uDFEB\n\n\uD83D\uDCCD Location: ${col.loc}\n\uD83C\uDFC6 ${col.naac || "Approved"}\n\uD83D\uDCDA Courses: ${col.courses}\n\uD83D\uDCB0 Fees from: \u20b9${col.fee}L\n\uD83D\uDCB3 Bihar Credit Card: ${col.credit ? "Accepted \u2705" : "Available nahi"}\n\nAdmission ke liye:\n\uD83D\uDCDE ` + PHONE,
        `**${col.name}** \uD83C\uDFEB\n\n\uD83D\uDCCD ${col.loc}\n\uD83C\uDFC6 ${col.naac || "Approved"}\n\uD83D\uDCDA ${col.courses}\n\uD83D\uDCB0 From \u20b9${col.fee}L\n\uD83D\uDCB3 Credit Card: ${col.credit ? "Accepted \u2705" : "Not available"}\n\nAdmission details:\n\uD83D\uDCDE ` + PHONE,
        `**${col.name}** \uD83C\uDFEB\n${col.loc} | \u20b9${col.fee}L\nCredit Card: ${col.credit ? "Haan \u2705" : "Nahi"}\nCall: \uD83D\uDCDE ` + PHONE
      );
    }
  }

  // AFTER 12TH / CAREER ADVICE
  if (has(q, "after 12th", "12th ke baad", "12 ke baad", "12th pass", "kya kare", "kya karun", "course select", "which course", "konsa course", "career", "future", "12\u0935\u0940\u0902 \u0915\u0947 \u092c\u093e\u0926", "\u0915\u094d\u092f\u093e \u0915\u0930\u0947\u0902", "\u0915\u0930\u093f\u092f\u0930")) {
    return hi(
      "**12\u0935\u0940\u0902 \u0915\u0947 \u092c\u093e\u0926 \u0915\u094d\u092f\u093e \u0915\u0930\u0947\u0902?** \uD83E\uDD14\n\n**Science \u0935\u093e\u0932\u0947:**\n\u2022 B.Tech (Engineering) \u2014 \u0938\u092c\u0938\u0947 popular\n\u2022 B.Sc Nursing / GNM \u2014 Medical field\n\u2022 B.Pharma \u2014 Pharmacy\n\u2022 B.Sc Agriculture\n\n**Commerce \u0935\u093e\u0932\u0947:**\n\u2022 BBA \u2192 MBA\n\u2022 BCA \u2192 MCA\n\u2022 B.Com \u2192 CA/MBA\n\u2022 LLB\n\n**Arts \u0935\u093e\u0932\u0947:**\n\u2022 LLB, BBA, Mass Communication\n\nFree counseling:\n\uD83D\uDCDE " + PHONE,
      "**What to do after 12th?** \uD83E\uDD14\n\n**Science students:**\n\u2022 B.Tech (Engineering)\n\u2022 B.Sc Nursing / GNM\n\u2022 B.Pharma\n\u2022 B.Sc Agriculture\n\n**Commerce students:**\n\u2022 BBA \u2192 MBA\n\u2022 BCA \u2192 MCA\n\u2022 B.Com \u2192 CA/MBA\n\n**Arts students:**\n\u2022 LLB, BBA, Mass Communication\n\nFree counseling: \uD83D\uDCDE " + PHONE,
      "**12th ke baad?** \uD83E\uDD14\n\n\u2022 Science: B.Tech, Nursing, Pharma\n\u2022 Commerce: BBA, BCA, B.Com\n\u2022 Arts: LLB, BBA\n\nFree guidance:\n\uD83D\uDCDE " + PHONE
    );
  }

  // NAAC / RANKING
  if (has(q, "naac", "ranking", "rank", "best college", "top college", "\u0928\u0948\u0915", "\u0930\u0948\u0902\u0915\u093f\u0902\u0917")) {
    const aplus = colleges.filter(c => c.naac === "NAAC A++" || c.naac === "NAAC A+");
    return hi(
      `**Top NAAC Ranked Colleges** \uD83C\uDFC6\n\n${aplus.slice(0,8).map(c => `\u2022 **${c.name}** \u2014 **${c.naac}** | ${c.loc}`).join("\n")}\n\nCall: \uD83D\uDCDE ` + PHONE,
      `**Top NAAC Ranked Colleges** \uD83C\uDFC6\n\n${aplus.slice(0,8).map(c => `\u2022 **${c.name}** \u2014 **${c.naac}** | ${c.loc}`).join("\n")}\n\nCall: \uD83D\uDCDE ` + PHONE,
      `**Best Colleges** \uD83C\uDFC6\n${aplus.slice(0,6).map(c => `\u2022 ${c.name} \u2014 ${c.naac}`).join("\n")}\nCall: \uD83D\uDCDE ` + PHONE
    );
  }

  // BIHAR COLLEGES
  if (has(q, "bihar", "patna", "raxaul", "motihari", "madhubani", "local college", "\u092c\u093f\u0939\u093e\u0930", "\u092a\u091f\u0928\u093e")) {
    const bih = colleges.filter(c => c.loc.toLowerCase().includes("bihar") || c.loc.toLowerCase().includes("patna"));
    return hi(
      `**Bihar \u0915\u0947 Partner Colleges** \uD83C\uDFE0\n\n${bih.map(fmt).join("\n")}\n\nHamare offices: Raxaul, Patna, Motihari, Bettiah, Saharsa, Gopalganj, Katihar, Rohtas, Madhepura\nCall: \uD83D\uDCDE ` + PHONE,
      `**Bihar Partner Colleges** \uD83C\uDFE0\n\n${bih.map(fmt).join("\n")}\n\nOffices: Raxaul (HQ), Patna, Motihari, Bettiah, Saharsa + more\nCall: \uD83D\uDCDE ` + PHONE,
      `**Bihar Colleges** \uD83C\uDFE0\n${bih.map(c => `\u2022 ${c.name} | \u20b9${c.fee}L`).join("\n")}\nCall: \uD83D\uDCDE ` + PHONE
    );
  }

  // CONTACT
  if (has(q, "contact", "phone", "number", "call", "address", "office", "email", "website", "where", "kahan", "\u0938\u0902\u092a\u0930\u094d\u0915", "\u092a\u0924\u093e", "\u092b\u094b\u0928")) {
    return hi(
      "**\u0938\u0902\u0915\u0932\u094d\u092a \u0936\u093f\u0915\u094d\u0937\u093e \u0938\u0932\u093e\u0939\u0915\u093e\u0930 \u2014 \u0938\u0902\u092a\u0930\u094d\u0915** \uD83D\uDCDE\n\n\uD83D\uDCF1 +91 9142082026\n\uD83D\uDCF1 +91 9470045035\n\uD83D\uDCF1 +91 9153987424\n\uD83D\uDCF1 +91 9153987422\n\n\uD83D\uDCE7 " + EMAIL + "\n\uD83C\uDF10 www.sankalpshikshasalahkar.org.in\n\uD83D\uDCCD Block Road, Near Hotel President Inn, Raxaul, Bihar (845305)\n\n\uD83C\uDFE2 Offices: Raxaul, Patna, Delhi, Motihari, Bettiah, Saharsa, Gopalganj, Katihar, Rohtas, Madhepura",
      "**Sankalp Shiksha Salahkar \u2014 Contact** \uD83D\uDCDE\n\n\uD83D\uDCF1 +91 9142082026\n\uD83D\uDCF1 +91 9470045035\n\uD83D\uDCF1 +91 9153987424\n\uD83D\uDCF1 +91 9153987422\n\n\uD83D\uDCE7 " + EMAIL + "\n\uD83C\uDF10 www.sankalpshikshasalahkar.org.in\n\uD83D\uDCCD Block Road, Raxaul, Bihar (845305)\n\n\uD83C\uDFE2 Offices in 10 cities across Bihar & Delhi",
      "**Contact** \uD83D\uDCDE\n\uD83D\uDCF1 +91 9142082026\n\uD83D\uDCF1 +91 9470045035\n\uD83D\uDCE7 " + EMAIL + "\n\uD83D\uDCCD Block Road, Raxaul, Bihar"
    );
  }

  // ADMISSION PROCESS
  if (has(q, "admission", "apply", "kaise le", "process", "procedure", "\u090f\u0921\u092e\u093f\u0936\u0928", "\u0926\u093e\u0916\u093f\u0932\u093e")) {
    return hi(
      "**Admission Process** \uD83D\uDCDD\n\n**Step 1:** Hamse call/WhatsApp karo\n**Step 2:** Free counseling session\n**Step 3:** College & course selection\n**Step 4:** Documents prepare\n**Step 5:** Bihar Credit Card (agar chahiye)\n**Step 6:** Admission confirm! \u2705\n\nSab kuch **bilkul free** hai!\n\uD83D\uDCDE " + PHONE,
      "**Admission Process** \uD83D\uDCDD\n\n1. Contact us (call/WhatsApp)\n2. Free counseling session\n3. Choose college & course\n4. Prepare documents\n5. Bihar Credit Card (optional)\n6. Admission confirmed! \u2705\n\n**100% FREE** service!\nCall: \uD83D\uDCDE " + PHONE,
      "**Admission Kaise Hoga** \uD83D\uDCDD\n1. Hamse baat karo\n2. Free counseling\n3. College chunna\n4. Documents\n5. Admission! \u2705\n\nSab muft ba!\nCall: \uD83D\uDCDE " + PHONE
    );
  }

  // HOSTEL
  if (has(q, "hostel", "pg", "accommodation", "raho", "rehna", "\u0930\u0939\u0928\u093e", "\u0939\u0949\u0938\u094d\u091f\u0932")) {
    return hi(
      "**Hostel Facilities** \uD83C\uDFE0\n\nHamare sabhi partner colleges mein hostel available hai!\n\u2022 Boys & Girls alag-alag hostels\n\u2022 Mess / Food facility\n\u2022 24/7 Security & Wi-Fi\n\nExact hostel fees ke liye:\n\uD83D\uDCDE " + PHONE,
      "**Hostel Facilities** \uD83C\uDFE0\n\nAlmost all colleges have hostels!\n\u2022 Separate Boys & Girls hostels\n\u2022 Mess & Food included\n\u2022 24/7 Security & Wi-Fi\n\nFor exact hostel fees:\n\uD83D\uDCDE " + PHONE,
      "**Hostel** \uD83C\uDFE0\nSabhi colleges mein hostel ba!\nBoys/Girls alag, Khana, Security.\nExact fees ke liye: \uD83D\uDCDE " + PHONE
    );
  }

  // PLACEMENT / JOB
  if (has(q, "job", "placement", "salary", "naukri", "company", "recruit", "\u0928\u094c\u0915\u0930\u0940", "\u092a\u094d\u0932\u0947\u0938\u092e\u0947\u0902\u091f")) {
    return hi(
      "**Placement & Career** \uD83D\uDCBC\n\nHamare colleges mein top companies aati hain:\nTCS, Infosys, Wipro, Accenture, IBM, Microsoft, Cognizant, Tech Mahindra, Jio, Airtel, ICICI Bank, HUL, Deloitte, Dell aur kaafi aur!\n\n\uD83C\uDFAF Average: \u20b93-8 LPA\n\uD83C\uDFAF Top packages: \u20b915+ LPA\n\n\uD83D\uDCDE " + PHONE,
      "**Placement & Career** \uD83D\uDCBC\n\nTop recruiters at our colleges:\nTCS, Infosys, Wipro, Accenture, IBM, Microsoft, Cognizant, Tech Mahindra, Jio, ICICI, HUL, Deloitte & many more!\n\n\uD83C\uDFAF Average: \u20b93-8 LPA\n\uD83C\uDFAF Top: \u20b915+ LPA\n\nCall: \uD83D\uDCDE " + PHONE,
      "**Placement** \uD83D\uDCBC\nTCS, Infosys, Wipro, Microsoft, IBM sab aata hai!\n\u20b93-8 LPA average milela.\nCall: \uD83D\uDCDE " + PHONE
    );
  }

  // THANK YOU
  if (has(q, "thank", "thanks", "shukriya", "dhanyavad", "great", "helpful", "bahut accha", "awesome", "\u0927\u0928\u094d\u092f\u0935\u093e\u0926", "\u0936\u0941\u0915\u094d\u0930\u093f\u092f\u093e")) {
    return hi(
      "\u0927\u0928\u094d\u092f\u0935\u093e\u0926! \uD83D\uDE4F \u0906\u092a\u0915\u0940 \u092a\u095d\u093e\u0908 \u0915\u0947 \u0932\u093f\u090f \u0939\u092e \u0939\u092e\u0947\u0936\u093e \u092f\u0939\u093e\u0902 \u0939\u0948\u0902! \uD83D\uDE0A\n\uD83D\uDCDE " + PHONE,
      "You're welcome! \uD83D\uDE4F We're always here for your educational journey! \uD83D\uDE0A\nCall anytime: \uD83D\uDCDE " + PHONE,
      "Shukriya bhaiya/didi! \uD83D\uDE4F Kuch aur puchho! \uD83D\uDE0A\n\uD83D\uDCDE " + PHONE
    );
  }

  // DEFAULT
  const isQuestion = q.endsWith("?") || has(q, "kya", "kaun", "kaise", "kitna", "kitni", "kahan", "kyun", "kab", "what", "how", "which", "where", "when", "why", "who", "tell me", "bata", "batao");
  if (isQuestion) {
    return hi(
      "\u0906\u092a\u0915\u093e \u0938\u0935\u093e\u0932 \u0938\u092e\u091d \u0906\u092f\u093e! \uD83D\uDE4F \u0907\u0938\u0915\u0947 \u0932\u093f\u090f \u0939\u092e\u093e\u0930\u0947 expert counselors \u0938\u0947 \u092c\u093e\u0924 \u0915\u0930\u0947\u0902:\n\n\uD83D\uDCDE " + PHONE + "\n\uD83D\uDCE7 " + EMAIL + "\n\n\u092f\u093e \u0928\u0940\u091a\u0947 \u0926\u093f\u090f chips \u0938\u0947 topic \u091a\u0941\u0928\u0947\u0902! \uD83D\uDE0A",
      "Great question! \uD83D\uDE4F For a precise answer, speak with our expert counselors:\n\n\uD83D\uDCDE " + PHONE + "\n\uD83D\uDCE7 " + EMAIL + "\n\nOr tap a topic chip below! \uD83D\uDE0A",
      "Accha sawaal ba! \uD83D\uDE4F Expert se baat karo:\n\uD83D\uDCDE " + PHONE + "\n\uD83D\uDCE7 " + EMAIL
    );
  }

  return hi(
    "\u0928\u092e\u0938\u094d\u0924\u0947! \uD83D\uDE4F \u092e\u0948\u0902 \u0906\u092a\u0915\u0940 \u092e\u0926\u0926 \u0915\u0930 \u0938\u0915\u0924\u093e \u0939\u0942\u0902:\n\n\u2022 **Colleges** \u2014 B.Tech, MBA, Nursing, Law, Pharma\n\u2022 **Fees** \u2014 \u0938\u092c\u0938\u0947 \u0915\u092e \u092b\u0940\u0938 \u0935\u093e\u0932\u0947 options\n\u2022 **Bihar Credit Card** \u2014 \u20b94L \u0924\u0915 loan\n\u2022 **Scholarship** \u2014 Government schemes\n\u2022 **Admission** \u2014 Step by step guide\n\n\uD83D\uDCDE " + PHONE,
    "Namaste! \uD83D\uDE4F I can help you with:\n\n\u2022 **Colleges** \u2014 B.Tech, MBA, Nursing, Law, Pharmacy\n\u2022 **Fees** \u2014 Most affordable options\n\u2022 **Bihar Credit Card** \u2014 \u20b94L loan\n\u2022 **Scholarships** \u2014 Government schemes\n\u2022 **Admission** \u2014 Complete guidance\n\nCall: \uD83D\uDCDE " + PHONE,
    "Pranam! \uD83D\uDE4F Ham madad kar sakila:\n\u2022 Colleges \u2014 B.Tech, MBA, Nursing\n\u2022 Fees \u2014 Saste options\n\u2022 Bihar Credit Card \u2014 \u20b94L loan\n\u2022 Admission guidance\n\nCall: \uD83D\uDCDE " + PHONE
  );
};

// COMPONENT
export const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Namaste! \uD83D\uDE4F Main hoon aapka AI education counselor \u2014 Sankalp Shiksha Salahkar ka.\n\nAap mujhse **Hindi, English ya Bhojpuri** mein baat kar sakte hain!\n\nKya main aapki madad kar sakta hoon?\n\u2022 College admission\n\u2022 Bihar Student Credit Card\n\u2022 Course selection\n\u2022 Scholarship guidance",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const reply = getResponse(text, updated);
      setMessages(p => [...p, { role: "assistant", content: reply }]);
      setIsTyping(false);
    }, 500 + Math.random() * 400);
  };

  const renderText = (text: string) =>
    text.split("\n").map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      const bullet = line.startsWith("\u2022") || line.startsWith("-") || /^\d+\./.test(line);
      return (
        <p key={i} style={{ marginLeft: bullet ? "8px" : "0", marginTop: i > 0 && line ? "4px" : "0" }}
          dangerouslySetInnerHTML={{ __html: bold }} />
      );
    });

  const chips = ["Fees kitni hai?", "Credit Card chahiye", "B.Tech college", "12th ke baad?", "Bihar college", "Scholarship?"];

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow active:scale-95"
            aria-label="Open chat">
            <Bot size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 w-[360px] sm:w-[400px] h-[580px] bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border">

            <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground">
              <img src={logo} alt="SSS" className="w-8 h-8 rounded-full bg-primary-foreground/20 object-contain p-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold">SSS AI Counselor</p>
                <p className="text-xs opacity-70">Hindi \u2022 English \u2022 Bhojpuri \u2022 24/7</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-primary-foreground/10 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot size={14} className="text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"
                  }`}>
                    {msg.role === "assistant" ? <div className="space-y-0.5">{renderText(msg.content)}</div> : msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 shrink-0 rounded-full bg-accent/10 flex items-center justify-center">
                      <User size={14} className="text-accent" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot size={14} className="text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      {[0,150,300].map(d => <span key={d} className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
              {chips.map((chip, i) => (
                <button key={i} onClick={() => handleSend(chip)}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/15 transition-colors whitespace-nowrap">
                  {chip}
                </button>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-border flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(input); } }}
                placeholder="Hindi, English ya Bhojpuri mein puchho..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-muted text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-shadow" />
              <button onClick={() => handleSend(input)} disabled={!input.trim() || isTyping}
                className="p-2.5 rounded-xl bg-accent text-accent-foreground disabled:opacity-40 transition-opacity active:scale-95">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};