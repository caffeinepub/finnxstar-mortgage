import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Globe,
  Home,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si";
import { toast } from "sonner";
import { useSubmitLead } from "./hooks/useQueries";
import AdminBlogPage from "./pages/AdminBlogPage";
import BlogListPage from "./pages/BlogListPage";
import BlogPostPage from "./pages/BlogPostPage";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Who We Serve", href: "#eligibility" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL_LINKS = [
  { icon: <SiFacebook />, href: "#", label: "Facebook" },
  { icon: <SiInstagram />, href: "#", label: "Instagram" },
  { icon: <SiLinkedin />, href: "#", label: "LinkedIn" },
  { icon: <SiX />, href: "#", label: "X" },
];

function scrollTo(href: string) {
  const target = document.querySelector(href);
  if (target) target.scrollIntoView({ behavior: "smooth" });
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setMenuOpen(false);
    if (window.location.pathname !== "/") {
      window.location.href = `/${href}`;
      return;
    }
    scrollTo(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" data-ocid="nav.link" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
              <Building2 className="w-5 h-5 text-navy" />
            </div>
            <span className="font-display text-xl font-bold text-white">
              Finn<span className="text-gold">xstar</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                data-ocid="nav.link"
                className="text-sm font-medium text-white/80 hover:text-gold transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/blog"
              data-ocid="nav.link"
              className="text-sm font-medium text-white/80 hover:text-gold transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Blog
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right">
              <a
                href="tel:+97140000000"
                className="text-gold text-sm font-semibold block"
              >
                +971 4 000 0000
              </a>
              <span className="text-white/60 text-xs">Free Consultation</span>
            </div>
            <Button
              type="button"
              onClick={() => {
                if (window.location.pathname !== "/") {
                  window.location.href = "/#contact";
                  return;
                }
                scrollTo("#contact");
              }}
              data-ocid="nav.primary_button"
              className="btn-gold rounded-full px-5 text-sm"
            >
              Get Pre-Approved
            </Button>
          </div>

          <button
            type="button"
            className="lg:hidden text-white p-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            data-ocid="nav.toggle"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-navy border-t border-white/10"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  data-ocid="nav.link"
                  className="text-white/80 hover:text-gold text-sm py-2 border-b border-white/10"
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/blog"
                onClick={() => setMenuOpen(false)}
                data-ocid="nav.link"
                className="text-white/80 hover:text-gold text-sm py-2 border-b border-white/10 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> Blog
              </Link>
              <Button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  if (window.location.pathname !== "/") {
                    window.location.href = "/#contact";
                    return;
                  }
                  scrollTo("#contact");
                }}
                data-ocid="nav.primary_button"
                className="btn-gold w-full rounded-full mt-2"
              >
                Get Free Consultation
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center"
      style={{
        backgroundImage: `url('/assets/generated/hero-dubai-skyline.dim_1600x900.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-navy/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/60 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-xl"
        >
          <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-4 py-1.5 mb-6">
            <Star className="w-3.5 h-3.5 text-gold fill-gold" />
            <span className="text-gold text-xs font-semibold tracking-wide uppercase">
              Dubai's Trusted Mortgage Experts
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
            Your Trusted
            <span className="block text-gold">Mortgage Broker</span>
            in Dubai
          </h1>

          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Expert guidance for residents, expats &amp; non-residents navigating
            the UAE property market. We secure the best rates from 25+ lenders.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              onClick={() => scrollTo("#contact")}
              data-ocid="hero.primary_button"
              className="btn-gold px-8 py-3 text-base rounded-full shadow-lg"
            >
              Get a Free Consultation
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              type="button"
              onClick={() => scrollTo("#services")}
              data-ocid="hero.secondary_button"
              variant="outline"
              className="px-8 py-3 text-base rounded-full border-white/40 text-white bg-white/10 hover:bg-white/20"
            >
              View Services
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { label: "Lender Partners", value: "25+" },
              { label: "Applications Processed", value: "1,200+" },
              { label: "Client Satisfaction", value: "98%" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl font-bold text-gold">
                  {stat.value}
                </div>
                <div className="text-white/60 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      icon: <Home className="w-6 h-6" />,
      title: "Home Purchase Mortgage",
      description:
        "Tailored mortgage solutions for purchasing your dream home in Dubai, with competitive rates from top UAE banks.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Buy-to-Let Mortgages",
      description:
        "Investment property financing with attractive yields. We help you maximise returns on Dubai's thriving rental market.",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Expat & Non-Resident Loans",
      description:
        "Specialist finance for expats and overseas buyers navigating UAE property ownership requirements.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Mortgage Refinancing",
      description:
        "Review your existing mortgage and switch to a better deal. We negotiate on your behalf with multiple lenders.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Pre-Approval Service",
      description:
        "Get pre-approved in as little as 24 hours. Strengthen your purchase offer with a confirmed finance letter.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Developer Finance",
      description:
        "Exclusive off-plan financing options and developer payment plans through our network of partners.",
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">
            What We Offer
          </span>
          <h2 className="section-heading text-3xl sm:text-4xl mt-2 mb-4">
            Comprehensive Mortgage Solutions
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Whether you're buying your first home, investing in property, or
            refinancing — we have the expertise and lender network to find the
            right solution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              data-ocid={`services.item.${i + 1}`}
              className="bg-gray-50 rounded-2xl p-7 hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center text-navy mb-5">
                {s.icon}
              </div>
              <h3 className="font-semibold text-navy text-lg mb-2">
                {s.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-20 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold text-sm font-semibold tracking-widest uppercase">
              About Finnxstar
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-2 mb-5">
              Dubai's Premier Mortgage Brokerage
            </h2>
            <p className="text-white/70 leading-relaxed mb-5">
              With over a decade of experience in the UAE mortgage market,
              Finnxstar has helped thousands of residents and expats achieve
              their property ownership dreams. Our team of certified mortgage
              advisors brings unmatched knowledge of local regulations, lender
              requirements, and market conditions.
            </p>
            <p className="text-white/70 leading-relaxed mb-8">
              We work with 25+ UAE banks and financial institutions to secure
              the most competitive rates and terms — saving our clients both
              time and money.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Years Experience", value: "12+" },
                { label: "Happy Clients", value: "3,500+" },
                { label: "Bank Partners", value: "25+" },
                { label: "AED Loans Arranged", value: "2B+" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 rounded-xl p-4 text-center"
                >
                  <div className="font-display text-2xl font-bold text-gold">
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-4"
          >
            {[
              {
                icon: <ShieldCheck className="w-5 h-5" />,
                title: "Regulated & Trusted",
                desc: "Licensed by UAE Central Bank and RERA-compliant mortgage advisors.",
              },
              {
                icon: <Clock className="w-5 h-5" />,
                title: "Fast Turnaround",
                desc: "Pre-approval letters issued within 24–48 hours for qualified applicants.",
              },
              {
                icon: <Globe className="w-5 h-5" />,
                title: "Global Expertise",
                desc: "Specialists in expat mortgages with multilingual support teams.",
              },
              {
                icon: <Award className="w-5 h-5" />,
                title: "Award-Winning Service",
                desc: "Recognised as Dubai's Best Mortgage Broker 2022 & 2023.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-5"
              >
                <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center text-gold shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    {item.title}
                  </h4>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Free Consultation",
      desc: "Schedule a no-obligation call with our mortgage advisors to discuss your needs and goals.",
    },
    {
      step: "02",
      title: "Document Submission",
      desc: "We guide you through the required documentation and submit to multiple lenders simultaneously.",
    },
    {
      step: "03",
      title: "Lender Comparison",
      desc: "Receive and compare pre-approval offers from our network of 25+ UAE banks and lenders.",
    },
    {
      step: "04",
      title: "Final Approval & Close",
      desc: "We handle all paperwork and liaise with the lender to ensure a smooth, stress-free closing.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">
            Our Process
          </span>
          <h2 className="section-heading text-3xl sm:text-4xl mt-2 mb-4">
            How It Works
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            From initial consultation to getting the keys — we guide you through
            every step of the mortgage process.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 h-full">
                <span className="font-display text-4xl font-bold text-gold/30">
                  {s.step}
                </span>
                <h3 className="font-semibold text-navy text-lg mt-3 mb-2">
                  {s.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-4 z-10">
                  <ArrowRight className="w-6 h-6 text-gold/50" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EligibilitySection() {
  return (
    <section id="eligibility" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">
            Who We Serve
          </span>
          <h2 className="section-heading text-3xl sm:text-4xl mt-2 mb-4">
            Mortgage Solutions for Everyone
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Whether you're a UAE national, long-term resident, or overseas
            investor — we have tailored options for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "UAE Residents",
              emoji: "🏠",
              points: [
                "UAE nationals & residents",
                "Up to 80% LTV for first-time buyers",
                "Competitive variable & fixed rates",
                "Salary transfer options available",
                "Loan tenors up to 25 years",
              ],
            },
            {
              title: "Expats in UAE",
              emoji: "✈️",
              points: [
                "Resident visa holders",
                "Up to 75% LTV financing",
                "Multi-currency salary accepted",
                "International credit history accepted",
                "Dual income assessments",
              ],
            },
            {
              title: "Non-Residents",
              emoji: "🌍",
              points: [
                "Overseas buyers & investors",
                "Up to 50% LTV for non-residents",
                "Investment property specialists",
                "Remote application process",
                "Free Zone company financing",
              ],
            },
          ].map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-50 rounded-2xl p-7 border border-gray-100"
            >
              <div className="text-4xl mb-4">{group.emoji}</div>
              <h3 className="section-heading text-xl mb-5">{group.title}</h3>
              <ul className="space-y-3">
                {group.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span className="text-gray-600">{pt}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Al-Mansouri",
      role: "First-time buyer, Dubai Marina",
      text: "Finnxstar made our first home purchase completely stress-free. They secured us a rate 0.4% lower than what our bank offered — saving us thousands over the loan term.",
      rating: 5,
    },
    {
      name: "James Thornton",
      role: "British expat, Business Bay",
      text: "As a non-UAE national I was worried about getting a mortgage. The team guided me through every requirement and had my pre-approval in just 48 hours. Outstanding service.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Investment property buyer, JVC",
      text: "I've used Finnxstar for three investment properties now. They always find the best rates and their knowledge of buy-to-let financing is exceptional.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">
            Client Stories
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-2">
            What Our Clients Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              data-ocid={`testimonials.item.${i + 1}`}
              className="bg-white/5 border border-white/10 rounded-2xl p-7"
            >
              <div className="flex mb-4">
                {Array.from({ length: t.rating }, (_, j) => (
                  <Star
                    key={`star-${t.name}-${j}`}
                    className="w-4 h-4 text-gold fill-gold"
                  />
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
              <div>
                <p className="font-semibold text-white">{t.name}</p>
                <p className="text-white/50 text-xs mt-0.5">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: "What documents do I need to apply for a UAE mortgage?",
      a: "Typically: passport copy, Emirates ID, visa, last 6 months bank statements, last 3 months salary slips (or 2 years audited accounts for self-employed), and property details. We provide a full personalised checklist.",
    },
    {
      q: "How long does mortgage approval take in the UAE?",
      a: "Pre-approval typically takes 2-5 business days. Full mortgage approval after property valuation is usually 2-3 weeks. We work to expedite the process wherever possible.",
    },
    {
      q: "Can expats get a mortgage in Dubai?",
      a: "Yes. Expats with UAE residency visas can access mortgages up to 75% LTV. Non-residents can also apply for investment properties up to 50% LTV through our specialist lenders.",
    },
    {
      q: "What are the current mortgage rates in the UAE?",
      a: "Rates vary by lender, loan type, and applicant profile. Variable rates typically start from 3.99% and fixed rates from 4.49%. We compare offers from 25+ lenders to find you the best deal.",
    },
    {
      q: "Is there a fee for your mortgage brokerage services?",
      a: "Our initial consultation is completely free. Our brokerage fee is only payable on successful mortgage completion — no upfront charges. Full fee transparency from the start.",
    },
    {
      q: "Can I get a mortgage for an off-plan property?",
      a: "Yes, several UAE banks offer off-plan financing. Requirements and LTV ratios differ from ready properties. We have specialist knowledge of developer finance options and bank partnerships.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">
            FAQs
          </span>
          <h2 className="section-heading text-3xl sm:text-4xl mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.q}
              value={`faq-${i}`}
              data-ocid={`faq.item.${i + 1}`}
              className="bg-white border border-gray-100 rounded-xl px-6 shadow-sm"
            >
              <AccordionTrigger className="text-left text-navy font-medium hover:text-gold hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-sm leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function ContactSection() {
  const submitLead = useSubmitLead();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    loanType: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.loanType) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      await submitLead.mutateAsync(form);
      toast.success(
        "Thank you! One of our advisors will be in touch within 24 hours.",
      );
      setForm({ name: "", email: "", phone: "", loanType: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gold text-sm font-semibold tracking-widest uppercase">
              Get In Touch
            </span>
            <h2 className="section-heading text-3xl sm:text-4xl mt-2 mb-5">
              Book Your Free Consultation
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Ready to explore your mortgage options? Fill in the form and a
              dedicated Finnxstar advisor will contact you within 24 hours — no
              obligation, completely free.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: <Phone className="w-5 h-5" />,
                  label: "+971 4 000 0000",
                  href: "tel:+97140000000",
                },
                {
                  icon: <Mail className="w-5 h-5" />,
                  label: "info@finnxstar.com",
                  href: "mailto:info@finnxstar.com",
                },
                {
                  icon: <MapPin className="w-5 h-5" />,
                  label: "DIFC, Dubai, UAE",
                  href: "#",
                },
              ].map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-navy transition-all">
                    {contact.icon}
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-navy transition-colors">
                    {contact.label}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form
              data-ocid="contact.modal"
              onSubmit={handleSubmit}
              className="bg-gray-50 rounded-2xl p-8 border border-gray-100 shadow-sm"
            >
              <h3 className="section-heading text-xl mb-6">Request Callback</h3>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    data-ocid="contact.input"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    data-ocid="contact.input"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    data-ocid="contact.input"
                    placeholder="+971 xx xxx xxxx"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="loanType">I'm interested in</Label>
                  <Select
                    value={form.loanType}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, loanType: v }))
                    }
                  >
                    <SelectTrigger data-ocid="contact.select" id="loanType">
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Home Purchase">
                        Home Purchase
                      </SelectItem>
                      <SelectItem value="Buy-to-Let">Buy-to-Let</SelectItem>
                      <SelectItem value="Refinancing">Refinancing</SelectItem>
                      <SelectItem value="Pre-Approval">Pre-Approval</SelectItem>
                      <SelectItem value="Non-Resident">
                        Non-Resident Mortgage
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  data-ocid="contact.submit_button"
                  disabled={submitLead.isPending}
                  className="btn-gold w-full rounded-full py-3 text-base"
                >
                  {submitLead.isPending
                    ? "Sending..."
                    : "Book Free Consultation"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-navy pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
                <Building2 className="w-5 h-5 text-navy" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                Finn<span className="text-gold">xstar</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5 max-w-sm">
              Dubai's trusted mortgage brokerage — connecting residents, expats
              and investors with the best home loan solutions since 2012.
            </p>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white/60 hover:bg-gold hover:text-navy transition-all text-sm"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-white/60">
              {[
                "Home Purchase",
                "Buy-to-Let",
                "Refinancing",
                "Pre-Approval",
                "Expat Mortgages",
              ].map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    className="hover:text-gold transition-colors"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a href="#about" className="hover:text-gold transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-gold transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-gold transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <Link to="/blog" className="hover:text-gold transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-gold transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Finnxstar. All rights reserved.</p>
          <p>
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="hover:text-gold transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <HowItWorksSection />
      <EligibilitySection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </>
  );
}

function RootLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Toaster />
    </>
  );
}

// Router setup
const rootRoute = createRootRoute({
  component: RootLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const blogListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: BlogListPage,
});

const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/$id",
  component: BlogPostPage,
});

const adminBlogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/blog",
  component: AdminBlogPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  blogListRoute,
  blogPostRoute,
  adminBlogRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
