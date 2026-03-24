import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";

type Message = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are an expert AI education counselor for "Sankalp Shiksha Salahkar" — Bihar's most trusted education consultancy founded by Sh. Amit Kumar Upadhyay, former Deputy Manager at NIMS University, Jaipur. Head office: Block Road, Near Hotel President Inn, Raxaul, Bihar (845305).

IMPORTANT LANGUAGE RULE:
- If the user writes in Hindi (Devanagari script) → reply ONLY in Hindi
- If the user writes in Bhojpuri or uses words like "bhaiya, didi, ba, hau, hamar, tohar, kaisan, rauwa, hamra" → reply in friendly Bhojpuri/Hindi mix
- If the user writes in English → reply in English
- Always match the user's language automatically

YOUR ROLE:
- Help students choose the right college, course, and career path
- Explain Bihar Student Credit Card (BSCC) process — up to ₹4 lakh loan
- Guide on scholarships (NSP, Post-Matric, Mukhyamantri Kanya Utthan Yojana)
- Provide fee information for partner colleges
- Be warm, friendly, and encouraging — like a trusted elder brother/sister

PARTNER COLLEGES (24 total):
1. Gokul Global University – Gujarat | NAAC A | B.Tech, BBA, MBA, B.Pharma, Nursing, GNM | From ₹3L
2. Mewar University – Rajasthan | NAAC A+ | B.Tech, BPT, BBA, MBA, LLB, MCA | From ₹3.3L
3. Sandip University – Bihar (Madhubani) | NAAC | B.Tech, BCA, MBA, LLB, PhD | From ₹1L
4. SRM Institute – Ghaziabad | NAAC A++ | B.Tech CSE/AIML/DataScience, MBA, MCA | From ₹1.96L
5. SRM Sonepat – Haryana | B.Tech CSE/AI&ML, BCA/MCA, BBA, MBA | From ₹2.57L
6. Mangalaytan University – UP | NAAC A+ | B.Tech, BCA, B.Pharma, BBA, MBA, LLB | From ₹3.44L
7. Khalsa College of Engineering – Punjab | NAAC A+ | Diploma, B.Tech, BCA, BBA, MCA, MBA | From ₹1.9L
8. GNIOT Group – Greater Noida | NAAC A+ | B.Tech, MBA, MCA, BBA, BCA, B.Pharma, LLB | From ₹1.35L
9. Vivekanand Global University – Jaipur | NAAC A+ | B.Tech, BCA, MCA, BBA, MBA, B.Com | From ₹3.5L
10. Arka Jain University – Jharkhand | NAAC A | BCA, B.Tech, MCA, BBA, MBA, Diploma | From ₹1.8L
11. PP Savani University – Surat | NAAC A+ | B.Tech, BCA, B.Pharma, GNM, B.Sc Nursing | From ₹3.15L
12. Desh Bhagat University – Punjab | NAAC A+ | B.Tech, LLB, B.Pharma, GNM, Diploma | From ₹2.38L
13. CT Group – Punjab | NAAC A | B.Tech, MBA, MCA, Diploma | From ₹2.8L
14. Baba Farid Group – Punjab | NAAC A+ | B.Tech, BCA, BBA, MBA, MCA | From ₹3.15L
15. MGM Group – Bihar (Patna) | BCA, BBA, LLB, B.Pharma, Nursing, ANM | From ₹2.1L
16. Maharishi Markandeshwar – Haryana | NAAC A++ | B.Tech, MBA, MCA, B.Pharma | From ₹4.1L
17. Magadh Group – Patna, Bihar | MBA, MCA, BBA, BCA, B.Pharma, D.Pharma | From ₹1.8L
18. Excel Engineering College – Tamil Nadu | NAAC A+ | B.Tech, M.Tech, MBA/MCA | From ₹2L
19. Shridevi Group – Karnataka | NAAC A+ | B.Tech, MBA, Diploma, Medical | From ₹1.16L
20. Gandhi Engineering College – Odisha | NAAC A+ | B.Tech CSE, Diploma, MBA | From ₹3L
21. Amritsar Group – Punjab | NAAC A | B.Tech, MBA, B.Pharma, Nursing | From ₹3.45L
22. Tula's Institute – Dehradun | NAAC A+ | B.Tech, MBA, MCA, BCA, BBA | From ₹1.39L
23. Kashi Institute of Technology – UP | NAAC A | B.Tech, MBA, MCA, BBA, BCA | From ₹3.32L
24. Oxford Business College – Patna | BBA, BCA, BBM | From ₹2.6L

BIHAR STUDENT CREDIT CARD:
- Up to ₹4 lakh loan at very low interest
- Student docs needed: Aadhaar, 10th/12th marksheet, residential certificate, bank passbook, 2 photos
- Parent docs: Aadhaar, 2 photos
- Bonafide: ₹10,000 | Registration fee: ₹2,000
- We process this completely FREE

CONTACT:
- Phone: +91 9142082026, +91 9470045035, +91 9153987424, +91 9153987422
- Email: md.sankalpshikshasalahkar@gmail.com
- Website: www.sankalpshikshasalahkar.org.in
- Offices: Raxaul (HQ), Patna, Delhi, Motihari, Bettiah, Saharsa, Gopalganj, Katihar, Rohtas, Madhepura

RESPONSE STYLE:
- Keep replies concise (3-6 lines max for simple questions)
- Use bullet points for lists
- Be warm and encouraging
- Always offer to help further
- Never make up information not in this prompt`;

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent";

const callGemini = async (messages: Message[]): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
  }

  const contents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
        topP: 0.9,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error("Gemini API error:", JSON.stringify(err));
    return `Error: ${err?.error?.message || "API call failed"}`;
    return getFallbackResponse(messages[messages.length - 1]?.content || "");
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || getFallbackResponse("");
};

// Smart fallback when no API key
const getFallbackResponse = (input: string): string => {
  const q = input.toLowerCase();
  const isHindi = /[ऀ-ॿ]/.test(input);
  const isBhojpuri = /(bhaiya|didi|ba |hau|hamar|tohar|kaisan|rauwa)/i.test(input);

  if (isHindi) {
    if (q.includes("credit") || q.includes("loan") || q.includes("पैसे"))
      return "बिहार स्टूडेंट क्रेडिट कार्ड से ₹4 लाख तक का लोन मिलता है! आधार कार्ड, 10वीं/12वीं मार्कशीट और बैंक पासबुक चाहिए। हम बिल्कुल मुफ्त में मदद करते हैं। 📞 +91 9142082026";
    if (q.includes("btech") || q.includes("b.tech") || q.includes("engineering"))
      return "B.Tech के लिए SRM गाजियाबाद (NAAC A++), GNIOT नोएडा (NAAC A+), Tula's देहरादून (NAAC A+) बेहतरीन विकल्प हैं। फीस ₹1.35L से शुरू। Bihar Student Credit Card भी चलता है!";
    return "नमस्ते! 🙏 संकल्प शिक्षा सलाहकार में आपका स्वागत है। कॉलेज एडमिशन, Bihar Credit Card, या करियर के बारे में कोई भी सवाल पूछें। 📞 +91 9142082026";
  }

  if (isBhojpuri) {
    return "Pranam bhaiya/didi! 🙏 Sankalp Shiksha Salahkar mein raur swagat ba! College admission, Bihar Credit Card, ya career ke baare mein kuch bhi pucho. Bilkul free guidance milela! 📞 +91 9142082026";
  }

  if (q.includes("credit") || q.includes("loan"))
    return "Bihar Student Credit Card gives up to ₹4 lakh for higher education at low interest! We process it completely FREE. Call: 📞 +91 9142082026";
  if (q.includes("btech") || q.includes("engineering"))
    return "Top B.Tech colleges: SRM Ghaziabad (NAAC A++), GNIOT Noida (NAAC A+), Tula's Dehradun — fees from ₹1.35L. All accept Bihar Student Credit Card!";
  if (q.includes("mba"))
    return "Top MBA options: SRM Ghaziabad ₹4.21L, Magadh Patna ₹2.51L (most affordable!), Sandip University Bihar ₹3.8L. Which budget suits you?";

  return "Namaste! 🙏 Main hoon aapka AI education counselor at Sankalp Shiksha Salahkar. Aap mujhse Hindi, English ya Bhojpuri mein pooch sakte hain — college fees, admissions, Bihar Student Credit Card, scholarships sab ke baare mein!";
};

export const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Namaste! 🙏 Main hoon aapka AI education counselor — Sankalp Shiksha Salahkar ka.\n\nAap mujhse **Hindi, English ya Bhojpuri** mein baat kar sakte hain!\n\nKya main aapki madad kar sakta hoon?\n• College admission\n• Bihar Student Credit Card\n• Course selection\n• Scholarship guidance",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAI, setIsAI] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    setIsAI(!!apiKey && apiKey !== "your_gemini_api_key_here");
  }, []);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput("");

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      // Only send last 10 messages to keep context window manageable
      const contextMessages = updatedMessages.slice(-10);
      const reply = await callGemini(contextMessages);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, kuch problem ho gayi. Please call karein: 📞 +91 9142082026"
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Simple markdown-lite renderer
  const renderText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      const withBold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      const isBullet = line.startsWith("•") || line.startsWith("-") || line.startsWith("*");
      return (
        <p key={i}
          style={{ marginLeft: isBullet ? "8px" : "0", marginTop: i > 0 && line !== "" ? "4px" : "0" }}
          dangerouslySetInnerHTML={{ __html: withBold }}
        />
      );
    });
  };

  const chips = ["College fees kitni hai?", "Credit Card chahiye", "B.Tech best college", "12th ke baad kya karein?"];

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow active:scale-95"
            aria-label="Open AI Chat"
          >
            <Bot size={24} />

          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 w-[360px] sm:w-[400px] h-[580px] bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground">
              <img src={logo} alt="SSS" className="w-8 h-8 rounded-full bg-primary-foreground/20 object-contain p-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold">SSS AI Counselor</p>
                  {isAI && <Sparkles size={12} className="text-accent" />}
                </div>
                <p className="text-xs opacity-70">Hindi • English • Bhojpuri • 24/7</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-primary-foreground/10 transition-colors">
                <X size={18} />
              </button>
            </div>



            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot size={14} className="text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}>
                    {msg.role === "assistant"
                      ? <div className="space-y-0.5">{renderText(msg.content)}</div>
                      : msg.content}
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
                      {[0, 150, 300].map(d => (
                        <span key={d} className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce"
                          style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick chips */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
              {chips.map((chip, i) => (
                <button key={i} onClick={() => setInput(chip)}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/15 transition-colors whitespace-nowrap">
                  {chip}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Hindi, English ya Bhojpuri mein puchho..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-muted text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
              />
              <button onClick={sendMessage} disabled={!input.trim() || isTyping}
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
