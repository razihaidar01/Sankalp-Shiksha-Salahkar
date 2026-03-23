export interface College {
  id: number;
  name: string;
  location: string;
  state: string;
  naac?: string;
  creditCard: boolean;
  courses: string[];
  feeFrom: number;
  feeLabel: string;
  hostelFee?: string;
  website?: string;
}

export const colleges: College[] = [
  { id: 1, name: "Gokul Global University", location: "Gujarat", state: "Gujarat", naac: "A", creditCard: true, courses: ["B.Tech (CSE/Cyber/IT/AI)", "BBA", "MBA", "B.Pharma", "BPT", "B.Sc Nursing", "GNM"], feeFrom: 300000, feeLabel: "₹3,00,000" },
  { id: 2, name: "Mewar University", location: "Rajasthan", state: "Rajasthan", naac: "A+", creditCard: true, courses: ["Polytechnic", "B.Tech", "BPT", "BBA", "B.Com", "MBA", "B.Pharma", "LLB", "MCA"], feeFrom: 330000, feeLabel: "₹3,30,000" },
  { id: 3, name: "Sandip University", location: "Bihar", state: "Bihar", naac: undefined, creditCard: true, courses: ["B.Tech", "BBA/BCA", "MBA", "B.Ed", "LLB", "PhD", "Polytechnic"], feeFrom: 100000, feeLabel: "₹1,00,000" },
  { id: 4, name: "SRM Institute", location: "Ghaziabad", state: "Uttar Pradesh", naac: "A++", creditCard: true, courses: ["B.Tech CSE/AIML/DataScience/CyberSec", "MBA", "MCA", "BBA", "Hotel Mgmt"], feeFrom: 196000, feeLabel: "₹1,96,000" },
  { id: 5, name: "SRM Sonepat", location: "Haryana", state: "Haryana", creditCard: true, courses: ["B.Tech CSE/AI&ML", "Civil/BioMedical", "BCA/MCA", "BBA", "MBA"], feeFrom: 257000, feeLabel: "₹2,57,000" },
  { id: 6, name: "Mangalaytan University", location: "Uttar Pradesh", state: "Uttar Pradesh", naac: "A+", creditCard: true, courses: ["B.Tech", "BCA", "MCA", "B.Pharma", "BPT", "BBA", "MBA", "LLB", "B.Com"], feeFrom: 344000, feeLabel: "₹3,44,000" },
  { id: 7, name: "Khalsa College of Engineering", location: "Punjab", state: "Punjab", naac: "A+", creditCard: false, courses: ["Diploma", "B.Tech", "BHMCT", "BCA", "BBA", "MCA", "MBA"], feeFrom: 190000, feeLabel: "₹1,90,000" },
  { id: 8, name: "GNIOT Group", location: "Greater Noida", state: "Uttar Pradesh", naac: "A+", creditCard: true, courses: ["PGDM", "MBA", "M.Tech", "MCA", "B.Tech", "BBA", "BCA", "B.Pharma", "LLB"], feeFrom: 135000, feeLabel: "₹1,35,000" },
  { id: 9, name: "Vivekanand Global University", location: "Jaipur", state: "Rajasthan", naac: "A+", creditCard: true, courses: ["B.Tech", "BCA", "MCA", "BBA", "MBA", "B.Com", "B.Sc Agriculture"], feeFrom: 350000, feeLabel: "₹3,50,000" },
  { id: 10, name: "Arka Jain University", location: "Jharkhand", state: "Jharkhand", naac: "A", creditCard: true, courses: ["BCA", "B.Tech", "MCA", "BBA", "MBA", "Diploma", "B.Sc Biotech"], feeFrom: 180000, feeLabel: "₹1,80,000" },
  { id: 11, name: "PP Savani University", location: "Surat", state: "Gujarat", naac: "A+", creditCard: true, courses: ["B.Tech", "BCA", "MCA", "B.Pharma", "GNM", "B.Sc Nursing", "BBA"], feeFrom: 315000, feeLabel: "₹3,15,000" },
  { id: 12, name: "Desh Bhagat University", location: "Punjab", state: "Punjab", naac: "A+", creditCard: false, courses: ["B.Tech", "LLB", "B.Pharma", "GNM", "BHMCT", "Diploma"], feeFrom: 238000, feeLabel: "₹2,38,000" },
  { id: 13, name: "CT Group", location: "Punjab", state: "Punjab", naac: "A", creditCard: false, courses: ["B.Tech", "MBA", "MCA", "Diploma"], feeFrom: 280000, feeLabel: "₹2,80,000" },
  { id: 14, name: "Baba Farid Group", location: "Punjab", state: "Punjab", naac: "A+", creditCard: false, courses: ["B.Tech", "BCA", "BBA", "MBA", "MCA", "B.Sc Agriculture"], feeFrom: 315000, feeLabel: "₹3,15,000" },
  { id: 15, name: "MGM Group", location: "Bihar", state: "Bihar", creditCard: true, courses: ["BCA", "BBA", "BBM", "B.Com", "LLB", "B.Pharma", "Nursing", "ANM"], feeFrom: 210000, feeLabel: "₹2,10,000" },
  { id: 16, name: "Maharishi Markandeshwar", location: "Haryana", state: "Haryana", naac: "A++", creditCard: true, courses: ["B.Tech", "MBA", "MCA", "B.Pharma", "B.Sc Agriculture", "BHMCT"], feeFrom: 410000, feeLabel: "₹4,10,000" },
  { id: 17, name: "Magadh Group", location: "Patna", state: "Bihar", creditCard: true, courses: ["MBA", "MCA", "BBA", "BCA", "B.Pharma", "D.Pharma", "Diploma"], feeFrom: 180000, feeLabel: "₹1,80,000" },
  { id: 18, name: "Excel Engineering College", location: "Tamil Nadu", state: "Tamil Nadu", naac: "A+", creditCard: false, courses: ["B.Tech", "M.Tech", "MBA/MCA"], feeFrom: 201000, feeLabel: "₹2,01,000" },
  { id: 19, name: "Shridevi Group", location: "Karnataka", state: "Karnataka", naac: "A+", creditCard: false, courses: ["B.Tech", "MBA", "Diploma", "Medical Diplomas"], feeFrom: 116500, feeLabel: "₹1,16,500" },
  { id: 20, name: "Gandhi Engineering College", location: "Odisha", state: "Odisha", naac: "A+", creditCard: false, courses: ["B.Tech CSE", "Diploma", "MBA"], feeFrom: 300000, feeLabel: "₹3,00,000" },
  { id: 21, name: "Amritsar Group", location: "Punjab", state: "Punjab", naac: "A", creditCard: false, courses: ["B.Tech", "MBA", "B.Pharma", "Nursing", "Fashion Design"], feeFrom: 345000, feeLabel: "₹3,45,000" },
  { id: 22, name: "Tula's Institute", location: "Dehradun", state: "Uttarakhand", naac: "A+", creditCard: true, courses: ["B.Tech", "MBA", "MCA", "BCA", "BBA", "B.Sc Agriculture"], feeFrom: 139000, feeLabel: "₹1,39,000" },
  { id: 23, name: "Kashi Institute of Technology", location: "Uttar Pradesh", state: "Uttar Pradesh", naac: "A", creditCard: true, courses: ["B.Tech", "MBA", "MCA", "BBA", "BCA", "Polytechnic"], feeFrom: 332000, feeLabel: "₹3,32,000" },
  { id: 24, name: "Oxford Business College", location: "Patna", state: "Bihar", creditCard: true, courses: ["BBA", "BCA", "BBM"], feeFrom: 260000, feeLabel: "₹2,60,000" },
];

export const states = [...new Set(colleges.map(c => c.state))].sort();

export const courseTypes = ["Engineering", "Management", "Medical", "Law", "Agriculture", "Science"];

export const recruiters = [
  "TCS", "Accenture", "Airtel", "IBM", "Microsoft", "Wipro", "Meta", "Jio", "Philips",
  "Tech Mahindra", "ICICI Bank", "Axis Bank", "Apollo", "HUL", "Genpact", "Nestlé",
  "Dell", "ITC", "Godrej", "Cognizant", "Deloitte", "Commvault", "Hexaware",
  "Infineon", "ServiceNow"
];
