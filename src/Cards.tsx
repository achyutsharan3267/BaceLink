import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CalendarDays,
  Clock3,
  Bell,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
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
import {
  getUpcomingEvents,
  type SiteContent,
  type UpcomingEvent,
  useWebsiteContent,
} from "./content";

const POPUP_SEEN_KEY = "bace-upcoming-event-popup-seen";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Groups", href: "#groups" },
  { label: "Events", href: "/events" },
  { label: "Quotes", href: "#quotes" },
  { label: "Social", href: "#social" },
  { label: "Quiz", href: "/quiz" },
];

const eventIconMap = {
  calendar: CalendarDays,
  map: MapPin,
  clock: Clock3,
} satisfies Record<string, LucideIcon>;

const highlightIconMap = {
  play: Play,
  music: Music,
  book: BookOpen,
  food: Utensils,
} satisfies Record<string, LucideIcon>;

const socialIconMap = {
  youtube: Video,
  instagram: Camera,
  facebook: ThumbsUp,
  telegram: Send,
  whatsapp: MessageCircle,
} satisfies Record<string, LucideIcon>;

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

function Navbar({ content }: { content: SiteContent }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 py-3 sm:px-6">
      <nav className="premium-glass mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-3 sm:px-5">
        <a href="#home" className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-full border border-amber-300/35 bg-white/90 p-1 shadow-[0_0_22px_rgba(245,178,57,0.22)]">
            <img
              src={content.logoImage}
              alt="BACE logo"
              className="h-full w-full object-contain"
            />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-bold tracking-wide text-amber-100">
              {content.navTitle}
            </span>
            <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
              {content.navSubtitle}
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
          href={`tel:${content.contact.phone}`}
          className="hidden items-center gap-2 rounded-full border border-amber-300/35 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-100 transition hover:border-amber-200 hover:bg-amber-300/20 lg:flex"
        >
          <Phone size={17} />
          {content.contact.phone}
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

function HeroSection({ content }: { content: SiteContent }) {
  const heroBackground = {
    backgroundImage: `linear-gradient(90deg, rgba(2, 7, 20, 0.08), rgba(2, 7, 20, 0.9) 54%, rgba(2, 7, 20, 0.98)), url("${content.hero.bannerImage}")`,
  };

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
        style={heroBackground}
      >
        <div className="relative min-h-[360px] overflow-hidden sm:min-h-[500px] lg:min-h-full">
          {/* <div className="absolute inset-0 bg-gradient-to-t from-[#020714] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#020714]/25" /> */}
        </div>

        <div className="relative flex flex-col justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/30 bg-black/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-amber-200">
            <Sparkles size={16} />
            {content.hero.badge}
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-normal sm:text-6xl lg:text-8xl">
            <span className="gold-text">{content.hero.title}</span>
            <span className="mt-2 block text-2xl font-semibold text-amber-50 sm:text-3xl lg:text-4xl">
              {content.hero.subtitle}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-amber-50/86 sm:text-lg">
            {content.hero.invitation}
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {content.eventDetails.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl border border-amber-300/28 bg-[#071832]/70 p-4 text-amber-50 shadow-[0_0_30px_rgba(245,178,57,0.12)] backdrop-blur"
              >
                <IconBadge icon={eventIconMap[item.icon]} className="size-10 rounded-xl" />
                <span className="text-sm font-bold sm:text-base">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-amber-300/30 bg-[#06152e]/72 p-4 shadow-[0_0_34px_rgba(245,178,57,0.12)] backdrop-blur sm:p-5">
            <p className="mb-4 text-center text-sm font-black uppercase tracking-[0.28em] text-amber-300">
              Highlights
            </p>
            <div className="grid gap-3 sm:grid-cols-2 ">
              {content.highlights.map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3">
                  <IconBadge icon={highlightIconMap[item.icon]} className="size-10 rounded-xl" />
                  <span className="text-sm font-semibold text-amber-50/90">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <a
            href={`tel:${content.contact.phone}`}
            className="mt-6 flex w-full max-w-md items-center gap-4 rounded-3xl border border-amber-300/35 bg-black/24 p-4 shadow-[0_0_34px_rgba(245,178,57,0.14)] transition hover:-translate-y-1 hover:border-amber-200 hover:bg-amber-300/10"
          >
            <IconBadge icon={Phone} />
            <span>
              <span className="block text-sm text-amber-50/70">{content.contact.label}</span>
              <span className="block text-lg font-black text-amber-100">
                {content.contact.name} - {content.contact.phone}
              </span>
            </span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function GroupsSection({ content }: { content: SiteContent }) {
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
              {content.groupsTitle}
            </p>
            <h2 className="mt-2 text-3xl font-black text-amber-50 sm:text-4xl">
              {content.groupsSubtitle}
            </h2>
          </div>
          <MessageCircle className="text-green-400" size={34} />
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {content.groups.map((item, index) => (
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

function QuotesSection({ content }: { content: SiteContent }) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    if (content.quotes.length === 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setQuoteIndex((current) => (current + 1) % content.quotes.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [content.quotes.length]);

  const activeQuote = content.quotes[quoteIndex] ?? content.quotes[0] ?? {
    text: "Add quotes from the admin page.",
    author: "Admin",
  };

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
            {content.quotesTitle}
          </p>
          <div className="mt-6 min-h-[270px] rounded-3xl border border-amber-300/28 bg-white/[0.045] p-6 sm:p-8">
            <Quote className="mb-5 text-amber-300" size={42} />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeQuote?.text}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.45 }}
              >
                <p className="text-2xl font-semibold leading-relaxed text-amber-50 sm:text-3xl">
                  "{activeQuote?.text}"
                </p>
                <p className="mt-5 text-lg font-black text-amber-300">
                  - {activeQuote?.author}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-5 flex gap-2">
            {content.quotes.map((quote, index) => (
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
            src={content.quotesImage}
            alt="Srila Prabhupada"
            className="absolute bottom-0 right-0 h-full w-full object-cover object-[82%_72%] opacity-95"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020714] via-[#020714]/20 to-transparent lg:bg-gradient-to-r" />
          <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-amber-300/25 bg-black/34 p-5 backdrop-blur">
            <p className="text-sm font-bold leading-6 text-amber-50/84">
              {content.quotesNote}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function SocialSection({ content }: { content: SiteContent }) {
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
            {content.socialTitle}
          </p>
          <h2 className="mt-2 text-3xl font-black text-amber-50 sm:text-4xl">
            {content.socialSubtitle}
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.socialLinks.map((item) => {
            const SocialIcon = socialIconMap[item.icon];

            return (
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
                <SocialIcon size={25} />
              </span>
              <span className="block text-lg font-black text-white">{item.name}</span>
              <span className="mt-1 block text-sm font-semibold text-amber-50/66">
                {item.label}
              </span>
            </motion.a>
          );
          })}
        </div>
      </div>
    </motion.section>
  );
}

function EventCard({ event, featured = false }: { event: UpcomingEvent; featured?: boolean }) {
  const showSevaButton = event.sevaEnabled && event.sevaLabel;

  return (
    <motion.article
      whileHover={{ y: -3 }}
      className={`grid gap-4 rounded-3xl border bg-[#06142b]/78 p-4 shadow-[0_18px_44px_rgba(0,0,0,0.22)] sm:grid-cols-[150px_1fr] ${
        featured ? "border-amber-300/45" : "border-amber-300/22"
      }`}
    >
      <div className="relative h-44 overflow-hidden rounded-2xl border border-amber-300/18 sm:h-full sm:min-h-40">
        <img
          src={event.image}
          alt={event.title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020714]/50 to-transparent" />
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {featured && (
              <span className="rounded-full bg-amber-300/12 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-amber-200">
                Next Event
              </span>
            )}
            <span className="rounded-full border border-amber-300/18 px-3 py-1 text-xs font-bold text-amber-50/62">
              Upcoming
            </span>
          </div>
          <h3 className="text-2xl font-black leading-tight text-white">{event.title}</h3>
          <div className="mt-3 grid gap-2 text-sm font-bold text-amber-50/78 lg:grid-cols-2">
            <p className="flex items-center gap-2">
              <CalendarDays size={17} className="shrink-0 text-amber-300" />
              {event.date}
            </p>
            <p className="flex items-center gap-2">
              <Clock3 size={17} className="shrink-0 text-amber-300" />
              {event.programStart}
            </p>
          </div>
          <p className="mt-3 text-sm leading-6 text-amber-50/68">{event.about}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {showSevaButton && event.sevaLink && (
            <a
              href={event.sevaLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-300 px-5 py-2.5 text-sm font-black text-[#08111f] transition hover:bg-amber-200"
            >
              {event.sevaLabel}
              <ExternalLink size={16} />
            </a>
          )}
          {showSevaButton && !event.sevaLink && (
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-amber-300/45 px-5 py-2.5 text-sm font-black text-[#08111f]/70"
            >
              {event.sevaLabel}
            </button>
          )}
          <a
            href="/events"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-300/25 bg-white/[0.045] px-5 py-2.5 text-sm font-black text-amber-100 transition hover:bg-amber-300/10"
          >
            Details
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function UpcomingEventSection({ content }: { content: SiteContent }) {
  const upcomingEvents = getUpcomingEvents(content);
  const featuredEvent = upcomingEvents[0];

  if (!featuredEvent) {
    return null;
  }

  return (
    <motion.section
      id="upcoming-event"
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65 }}
      className="px-4 py-8 sm:px-6"
    >
      <div className="premium-glass mx-auto max-w-7xl rounded-[2rem] p-5 sm:p-7 lg:p-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-amber-300">
              Upcoming Events
            </p>
            <h2 className="mt-2 text-3xl font-black leading-tight text-amber-50 sm:text-4xl">
              Join the next devotional program
            </h2>
          </div>
          <a
            href="/events"
            className="inline-flex items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-300/10 px-5 py-3 font-black text-amber-100 transition hover:bg-amber-300/20"
          >
            View All Events
          </a>
        </div>

        <div className="grid gap-4">
          {upcomingEvents.slice(0, 3).map((event, index) => (
            <EventCard key={event.id} event={event} featured={index === 0} />
          ))}
        </div>

        {upcomingEvents.length > 3 && (
          <p className="mt-4 text-center text-sm font-semibold text-amber-50/58">
            {upcomingEvents.length - 3} more event(s) available on the events page.
          </p>
        )}
      </div>
    </motion.section>
  );
}

function Footer({ content }: { content: SiteContent }) {
  return (
    <footer className="px-4 pb-8 pt-4 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-amber-300/20 bg-black/18 px-5 py-8 text-center">
        <div className="flex items-center justify-center gap-3 text-amber-300">
          <Heart size={18} />
          <span className="text-lg font-black">{content.footerLine}</span>
          <Heart size={18} />
        </div>
        <p className="mt-3 text-sm text-amber-50/58">
          {content.copyright}
        </p>
      </div>
    </footer>
  );
}

function UpcomingEventPopup({ content }: { content: SiteContent }) {
  const [isVisible, setIsVisible] = useState(false);
  const featuredEvent = getUpcomingEvents(content)[0];
  const showSevaButton = Boolean(featuredEvent?.sevaEnabled && featuredEvent.sevaLabel);

  useEffect(() => {
    if (!content.eventSettings.popupEnabled || !featuredEvent) {
      return;
    }

    const hasSeenPopup = window.sessionStorage.getItem(POPUP_SEEN_KEY);
    if (!hasSeenPopup) {
      const timer = window.setTimeout(() => setIsVisible(true), 650);
      return () => window.clearTimeout(timer);
    }
  }, [content.eventSettings.popupEnabled, featuredEvent]);

  if (!featuredEvent) {
    return null;
  }

  const closePopup = () => {
    window.sessionStorage.setItem(POPUP_SEEN_KEY, "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#020714]/78 px-4 py-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="premium-glass relative w-full max-w-2xl overflow-hidden rounded-[2rem] p-5 sm:p-7"
          >
            <button
              type="button"
              aria-label="Close upcoming event popup"
              onClick={closePopup}
              className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full border border-amber-300/25 bg-white/5 text-amber-100 transition hover:bg-amber-300/15"
            >
              <X size={20} />
            </button>

            <div className="mb-5 flex items-center gap-3 pr-10">
              <IconBadge icon={Bell} className="rounded-full" />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">
                  Upcoming Event
                </p>
                <h2 className="mt-1 text-2xl font-black text-amber-50 sm:text-3xl">
                  {featuredEvent.title}
                </h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
              <img
                src={featuredEvent.image}
                alt={featuredEvent.title}
                className="h-56 w-full rounded-3xl border border-amber-300/25 object-cover md:h-full"
                loading="lazy"
              />

              <div className="grid gap-4">
                <div className="rounded-3xl border border-amber-300/25 bg-white/[0.045] p-5">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-300">
                    Date
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-white">
                    {featuredEvent.date}
                  </h3>
                </div>
                <div className="rounded-3xl border border-amber-300/35 bg-amber-300/10 p-5 shadow-[0_0_34px_rgba(245,178,57,0.14)]">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-200">
                    Program Start
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-white">
                    {featuredEvent.programStart}
                  </h3>
                </div>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-amber-50/74">
              {featuredEvent.about}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {showSevaButton && featuredEvent.sevaLink && (
                <a
                  href={featuredEvent.sevaLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-emerald-700 px-5 py-3 font-black text-white shadow-[0_0_28px_rgba(34,197,94,0.24)] transition hover:brightness-110"
                >
                  {featuredEvent.sevaLabel}
                </a>
              )}
              {showSevaButton && !featuredEvent.sevaLink && (
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-2xl bg-green-500/45 px-5 py-3 font-black text-white/70"
                >
                  {featuredEvent.sevaLabel}
                </button>
              )}
              <button
                type="button"
                onClick={closePopup}
                className="rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-600 px-5 py-3 font-black text-[#08111f] shadow-[0_0_28px_rgba(245,178,57,0.24)] transition hover:brightness-110"
              >
                {content.eventSettings.popupButtonText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EventsPage() {
  const { content } = useWebsiteContent();
  const upcomingEvents = getUpcomingEvents(content);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 pb-10 pt-5 text-amber-50 sm:px-6">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <div className="mx-auto max-w-7xl">
        <nav className="premium-glass sticky top-4 z-40 mb-6 flex items-center justify-between rounded-full px-4 py-3 sm:px-5">
          <a href="/" className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full border border-amber-300/35 bg-white/90 p-1">
              <img src={content.logoImage} alt="BACE logo" className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block text-lg font-bold text-amber-100">{content.navTitle}</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
                Events
              </span>
            </span>
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-black text-amber-100 transition hover:bg-amber-300/20"
          >
            <ArrowLeft size={17} />
            Home
          </a>
        </nav>

        <section className="premium-glass mb-6 rounded-[2rem] p-5 sm:p-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-amber-300">
                Raja Vidya Events
              </p>
              <h1 className="mt-2 text-4xl font-black leading-tight text-amber-50 sm:text-5xl">
                Upcoming Events
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-amber-50/66">
                Clear details for upcoming classes, festivals, seva opportunities,
                and devotional gatherings.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-300/24 bg-white/[0.045] px-5 py-4">
              <p className="text-sm font-bold text-amber-50/62">Total upcoming</p>
              <p className="mt-1 text-3xl font-black text-amber-200">{upcomingEvents.length}</p>
            </div>
          </div>
        </section>

        <section className="premium-glass rounded-[2rem] p-5 sm:p-8">
          {upcomingEvents.length === 0 ? (
            <div className="mx-auto max-w-3xl rounded-[2rem] border border-amber-300/20 bg-white/[0.035] p-8 text-center sm:p-12">
              <span className="mx-auto flex size-20 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 text-amber-300 shadow-[0_0_40px_rgba(245,178,57,0.18)]">
                <Bell size={40} />
              </span>
              <h2 className="mt-6 text-4xl font-black text-white">No upcoming events</h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-amber-50/66">
                Please check again soon for the next Raja Vidya class or devotional gathering.
              </p>
              <a
                href="/"
                className="mt-7 inline-flex items-center gap-2 rounded-2xl border border-amber-300/30 bg-amber-300/10 px-5 py-3 font-black text-amber-100 transition hover:bg-amber-300/20"
              >
                Back to Home
                <ArrowRight size={18} />
              </a>
            </div>
          ) : (
            <>
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.28em] text-amber-300">
                    Event List
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-amber-50 sm:text-3xl">
                    Date, time, details, and seva links
                  </h2>
                </div>
                <a
                  href="/#social"
                  className="inline-flex items-center gap-2 rounded-2xl border border-amber-300/30 bg-white/[0.045] px-5 py-3 font-black text-amber-100 transition hover:bg-amber-300/12"
                >
                  Follow Updates
                  <ExternalLink size={17} />
                </a>
              </div>

              <div className="grid gap-4">
                {upcomingEvents.map((event, index) => (
                  <EventCard key={event.id} event={event} featured={index === 0} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function Cards() {
  const { content } = useWebsiteContent();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <Navbar content={content} />
      <HeroSection content={content} />
      <GroupsSection content={content} />
      <UpcomingEventSection content={content} />
      <QuotesSection content={content} />
      <SocialSection content={content} />
      <Footer content={content} />
      <UpcomingEventPopup content={content} />
    </main>
  );
}

export default Cards;
export { EventsPage };
