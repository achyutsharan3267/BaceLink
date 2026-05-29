import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CalendarDays,
  Clock3,
  Heart,
  Camera,
  MapPin,
  Menu,
  MessageCircle,
  Music,
  Phone,
  Play,
  Quote,
  Send,
  Sparkles,
  ThumbsUp,
  Utensils,
  X,
  Video,
} from "lucide-react";
import { group } from "./Data";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Groups", href: "#groups" },
  { label: "Quotes", href: "#quotes" },
  { label: "Social", href: "#social" },
];

const eventDetails = [
  { label: "Every Sunday", icon: CalendarDays },
  { label: "ISKCON Auditorium", icon: MapPin },
  { label: "3:00 PM onwards", icon: Clock3 },
];

const highlights = [
  { label: "Spiritual Video Show", icon: Play },
  { label: "Blissful Kirtan", icon: Music },
  { label: "Bhagavad Gita Discourse", icon: BookOpen },
  { label: "Delicious Prasadam", icon: Utensils },
];

const quotes = [
  {
    text: "The Bhagavad-gita is the essence of all Vedic knowledge.",
    author: "Srila Prabhupada",
  },
  {
    text: "Krishna consciousness is not an artificial imposition on the mind; it is the original energy of the living entity.",
    author: "Srila Prabhupada",
  },
  {
    text: "By chanting Hare Krishna, one can cleanse the heart and awaken pure devotion.",
    author: "Srila Prabhupada",
  },
];

const socialLinks = [
  {
    name: "YouTube",
    label: "Subscribe",
    icon: Video,
    href: "https://www.youtube.com/@Mayapur_bace",
    color: "from-red-500 to-red-700",
  },
  {
    name: "Instagram",
    label: "Follow Us",
    icon: Camera,
    href: "https://www.instagram.com/mayapurdhambace?igsh=ZTkwdnlkNnNsZ2lr",
    color: "from-pink-500 via-orange-400 to-purple-600",
  },
  {
    name: "Facebook",
    label: "Like Page",
    icon: ThumbsUp,
    href: "https://www.facebook.com/",
    color: "from-blue-500 to-blue-700",
  },
  {
    name: "Telegram",
    label: "Join Channel",
    icon: Send,
    href: "https://telegram.org/",
    color: "from-sky-400 to-blue-600",
  },
];

const sectionReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

type IconProps = {
  icon: LucideIcon;
  className?: string;
};

function IconBadge({ icon: Icon, className = "" }: IconProps) {
  return (
    <span
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-300/10 text-amber-200 shadow-[0_0_24px_rgba(245,178,57,0.18)] ${className}`}
    >
      <Icon size={22} strokeWidth={2.1} />
    </span>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 py-3 sm:px-6">
      <nav className="premium-glass mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-3 sm:px-5">
        <a href="#home" className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-full border border-amber-300/35 bg-white/90 p-1 shadow-[0_0_22px_rgba(245,178,57,0.22)]">
            <img
              src="/images/bace-logo.png"
              alt="BACE logo"
              className="h-full w-full object-contain"
            />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-bold tracking-wide text-amber-100">
              Raja Vidya
            </span>
            <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
              The King of Knowledge
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-amber-50/82 transition hover:bg-amber-300/10 hover:text-amber-200"
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="tel:9667453267"
          className="hidden items-center gap-2 rounded-full border border-amber-300/35 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-100 transition hover:border-amber-200 hover:bg-amber-300/20 lg:flex"
        >
          <Phone size={17} />
          9667453267
        </a>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex size-11 items-center justify-center rounded-full border border-amber-300/30 bg-white/5 text-amber-100 md:hidden"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="premium-glass mx-auto mt-3 grid max-w-7xl gap-2 rounded-3xl p-3 md:hidden"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-4 py-3 font-semibold text-amber-50/88 transition hover:bg-amber-300/10"
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden px-4 pb-8 pt-28 sm:px-6 lg:pt-32">
      <div className="absolute inset-0 opacity-70 spiritual-pattern" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,178,57,0.18),transparent_42rem)]" />

      <motion.div
        variants={sectionReveal}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.75, ease: "easeOut" }}
        className="premium-glass reference-art relative mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] lg:min-h-[620px] lg:grid-cols-[0.95fr_1.05fr]"
      >
        <div className="relative min-h-[360px] overflow-hidden sm:min-h-[500px] lg:min-h-full">
          {/* <div className="absolute inset-0 bg-gradient-to-t from-[#020714] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#020714]/25" /> */}
        </div>

        <div className="relative flex flex-col justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/30 bg-black/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-amber-200">
            <Sparkles size={16} />
            Weekly Bhagavad Gita Classes
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-normal sm:text-6xl lg:text-8xl">
            <span className="gold-text">Raja Vidya</span>
            <span className="mt-2 block text-2xl font-semibold text-amber-50 sm:text-3xl lg:text-4xl">
              The King of Knowledge
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-amber-50/86 sm:text-lg">
            Aap aur aapke parivaar ko ISKCON ke special Bhagavad Gita session mein
            prem se amantrit kiya jata hai. Join an evening of wisdom, kirtan,
            prasadam, and spiritual friendship.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {eventDetails.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl border border-amber-300/28 bg-[#071832]/70 p-4 text-amber-50 shadow-[0_0_30px_rgba(245,178,57,0.12)] backdrop-blur"
              >
                <IconBadge icon={item.icon} className="size-10 rounded-xl" />
                <span className="text-sm font-bold sm:text-base">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-amber-300/30 bg-[#06152e]/72 p-4 shadow-[0_0_34px_rgba(245,178,57,0.12)] backdrop-blur sm:p-5">
            <p className="mb-4 text-center text-sm font-black uppercase tracking-[0.28em] text-amber-300">
              Highlights
            </p>
            <div className="grid gap-3 sm:grid-cols-2 ">
              {highlights.map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3">
                  <IconBadge icon={item.icon} className="size-10 rounded-xl" />
                  <span className="text-sm font-semibold text-amber-50/90">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <a
            href="tel:9667453267"
            className="mt-6 flex w-full max-w-md items-center gap-4 rounded-3xl border border-amber-300/35 bg-black/24 p-4 shadow-[0_0_34px_rgba(245,178,57,0.14)] transition hover:-translate-y-1 hover:border-amber-200 hover:bg-amber-300/10"
          >
            <IconBadge icon={Phone} />
            <span>
              <span className="block text-sm text-amber-50/70">Venue assistance</span>
              <span className="block text-lg font-black text-amber-100">
                Achyut Sharan - 9667453267
              </span>
            </span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function GroupsSection() {
  return (
    <motion.section
      id="groups"
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65 }}
      className="px-4 py-8 sm:px-6"
    >
      <div className="premium-glass mx-auto max-w-7xl rounded-[2rem] p-5 sm:p-7 lg:p-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-amber-300">
              Join Our WhatsApp Groups
            </p>
            <h2 className="mt-2 text-3xl font-black text-amber-50 sm:text-4xl">
              Continue the journey with devotees
            </h2>
          </div>
          <MessageCircle className="text-green-400" size={34} />
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {group.map((item, index) => (
            <motion.article
              key={item.link}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.015 }}
              className="group relative min-h-[390px] overflow-hidden rounded-3xl border border-amber-300/30 bg-[#06142b] shadow-[0_24px_60px_rgba(0,0,0,0.32)]"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020714] via-[#06142b]/62 to-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="rounded-3xl border border-white/14 bg-[#06142b]/72 p-5 backdrop-blur-xl">
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-amber-300">
                    WhatsApp Group
                  </p>
                  <h3 className="text-3xl font-black leading-tight text-white">
                    {item.name}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-amber-50/76">
                    {item.description}
                  </p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-700 px-5 py-3 font-black text-white shadow-[0_0_28px_rgba(34,197,94,0.34)] transition hover:from-green-400 hover:to-emerald-600"
                  >
                    <MessageCircle size={20} />
                    Join Group
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function QuotesSection() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setQuoteIndex((current) => (current + 1) % quotes.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  const activeQuote = quotes[quoteIndex];

  return (
    <motion.section
      id="quotes"
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65 }}
      className="px-4 py-8 sm:px-6 h-[527px]"
    >
      <div className="premium-glass mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-6 sm:p-8 lg:p-10">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-amber-300">
            Srila Prabhupada Quotes
          </p>
          <div className="mt-6 min-h-[270px] rounded-3xl border border-amber-300/28 bg-white/[0.045] p-6 sm:p-8">
            <Quote className="mb-5 text-amber-300" size={42} />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeQuote.text}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.45 }}
              >
                <p className="text-2xl font-semibold leading-relaxed text-amber-50 sm:text-3xl">
                  "{activeQuote.text}"
                </p>
                <p className="mt-5 text-lg font-black text-amber-300">
                  - {activeQuote.author}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-5 flex gap-2">
            {quotes.map((quote, index) => (
              <button
                key={quote.text}
                type="button"
                aria-label={`Show quote ${index + 1}`}
                onClick={() => setQuoteIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === quoteIndex ? "w-10 bg-amber-300" : "w-2.5 bg-amber-100/35"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden bg-[radial-gradient(circle_at_55%_32%,rgba(245,178,57,0.18),transparent_16rem),linear-gradient(135deg,#071832,#020714_72%)]">
          <img
            src="/images/iskcon-raja-vidya-reference.png"
            alt="Srila Prabhupada"
            className="absolute bottom-0 right-0 h-full w-full object-cover object-[82%_72%] opacity-95"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020714] via-[#020714]/20 to-transparent lg:bg-gradient-to-r" />
          <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-amber-300/25 bg-black/34 p-5 backdrop-blur">
            <p className="text-sm font-bold leading-6 text-amber-50/84">
              Wisdom becomes practical when it is heard, discussed, and lived in
              loving devotional association.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function SocialSection() {
  return (
    <motion.section
      id="social"
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65 }}
      className="px-4 py-8 sm:px-6"
    >
      <div className="premium-glass mx-auto max-w-7xl rounded-[2rem] p-5 sm:p-7 lg:p-8">
        <div className="mb-6 text-center">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-amber-300">
            Follow Us On Social Media
          </p>
          <h2 className="mt-2 text-3xl font-black text-amber-50 sm:text-4xl">
            Stay connected with the community
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {socialLinks.map((item) => (
            <motion.a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -6, scale: 1.02 }}
              className="rounded-3xl border border-white/12 bg-white/[0.045] p-4 transition hover:border-amber-300/45 hover:shadow-[0_0_34px_rgba(245,178,57,0.18)]"
            >
              <span
                className={`mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}
              >
                <item.icon size={25} />
              </span>
              <span className="block text-lg font-black text-white">{item.name}</span>
              <span className="mt-1 block text-sm font-semibold text-amber-50/66">
                {item.label}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function Footer() {
  return (
    <footer className="px-4 pb-8 pt-4 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-amber-300/20 bg-black/18 px-5 py-8 text-center">
        <div className="flex items-center justify-center gap-3 text-amber-300">
          <Heart size={18} />
          <span className="text-lg font-black">Hare Krishna - Hari Bol</span>
          <Heart size={18} />
        </div>
        <p className="mt-3 text-sm text-amber-50/58">
        Copyright © 2026 Raja Vidya Management Team. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

function Cards() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <Navbar />
      <HeroSection />
      <GroupsSection />
      <QuotesSection />
      <SocialSection />
      <Footer />
    </main>
  );
}

export default Cards;
