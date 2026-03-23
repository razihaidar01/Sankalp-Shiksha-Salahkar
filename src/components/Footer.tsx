import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

export const Footer = () => {
  return (
    <footer className="relative bg-primary text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[6rem] sm:text-[10rem] lg:text-[14rem] font-black opacity-[0.04] whitespace-nowrap leading-none">
          संकल्प शिक्षा सलाहकार
        </span>
      </div>

      <div className="relative container-narrow section-padding pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="SSS" className="w-14 h-14 object-contain rounded-lg bg-primary-foreground/10 p-1" />
              <div>
                <span className="text-lg font-black tracking-tight block">SSS</span>
                <span className="text-xs opacity-60">संकल्प शिक्षा सलाहकार</span>
              </div>
            </div>
            <p className="text-sm opacity-70 max-w-xs leading-relaxed">
              Your trusted guide to college admissions, scholarships, and career counseling across India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider opacity-50 mb-4">Navigate</h4>
            <ul className="space-y-2.5">
              {[
                { to: "/", l: "Home" },
                { to: "/services", l: "Services" },
                { to: "/colleges", l: "Colleges" },
                { to: "/contact", l: "Contact" },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                    {link.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider opacity-50 mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm opacity-70">
                <Phone size={14} className="mt-0.5 shrink-0" /> +91 9142082026
              </li>
              <li className="flex items-start gap-2 text-sm opacity-70">
                <Phone size={14} className="mt-0.5 shrink-0" /> +91 9470045035
              </li>
              <li className="flex items-start gap-2 text-sm opacity-70">
                <Mail size={14} className="mt-0.5 shrink-0" /> md.sankalpshikshasalahkar@gmail.com
              </li>
              <li className="flex items-start gap-2 text-sm opacity-70">
                <MapPin size={14} className="mt-0.5 shrink-0" /> Block Road, Near Hotel President Inn, Raxaul, Bihar (845305)
              </li>
            </ul>
          </div>

          {/* Office Locations */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider opacity-50 mb-4">Offices</h4>
            <p className="text-sm opacity-70 leading-relaxed">
              Delhi · Patna · Motihari · Bettiah · Saharsa · Gopalganj · Katihar · Rohtas · Madhepura
            </p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs opacity-50">
            © {new Date().getFullYear()} Sankalp Shiksha Salahkar. All rights reserved.
          </p>
          <p className="text-xs opacity-50">
            हर घर में दीप जलाओ, अब अपने बच्चों को खूब पढ़ाओ
          </p>
        </div>
      </div>
    </footer>
  );
};
