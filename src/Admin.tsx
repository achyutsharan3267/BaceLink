import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ImagePlus,
  Home,
  Lock,
  LogOut,
  Mail,
} from "lucide-react";
import {
  defaultContent,
  type EventDetail,
  type GroupCard,
  type Highlight,
  type QuoteItem,
  type SiteContent,
  type SocialLink,
  type UpcomingEvent,
  useWebsiteContent,
} from "./content";

type Path = keyof Pick<
  SiteContent,
  | "eventDetails"
  | "highlights"
  | "groups"
  | "quotes"
  | "socialLinks"
  | "events"
>;

const inputClass =
  "w-full rounded-2xl border border-amber-300/20 bg-[#06142b]/80 px-4 py-3 text-amber-50 outline-none transition focus:border-amber-300/70";
const labelClass = "mb-2 block text-sm font-bold text-amber-200/90";
const cardClass = "rounded-3xl border border-amber-300/20 bg-white/[0.045] p-5";
const ADMIN_EMAIL_SESSION_KEY = "bace-admin-email";
const allowedAdminEmails = ((import.meta.env.VITE_ADMIN_EMAILS as string | undefined) ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

function fieldId(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
};

function TextField({ label, value, onChange, multiline = false }: TextFieldProps) {
  const id = fieldId(label);

  return (
    <label htmlFor={id} className="block">
      <span className={labelClass}>{label}</span>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          className={inputClass}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        />
      )}
    </label>
  );
}

type ImageFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function ImageField({ label, value, onChange }: ImageFieldProps) {
  const id = fieldId(label);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid gap-3">
      <TextField label={`${label} URL`} value={value} onChange={onChange} />
      <label
        htmlFor={id}
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 font-bold text-amber-100 transition hover:bg-amber-300/20"
      >
        <ImagePlus size={18} />
        Upload {label}
      </label>
      <input id={id} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      {value && (
        <img
          src={value}
          alt={label}
          className="h-36 w-full rounded-2xl border border-amber-300/20 object-cover"
        />
      )}
    </div>
  );
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isAllowedAdminEmail(email: string) {
  if (allowedAdminEmails.length === 0) {
    return false;
  }

  return allowedAdminEmails.includes(email.toLowerCase());
}

function confirmAction(message: string) {
  return window.confirm(message);
}

type AdminEmailGateProps = {
  onAccessGranted: (email: string) => void;
};

function AdminEmailGate({ onAccessGranted }: AdminEmailGateProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isAllowedAdminEmail(normalizedEmail)) {
      setError("This email is not allowed to access the admin panel.");
      return;
    }

    window.sessionStorage.setItem(ADMIN_EMAIL_SESSION_KEY, normalizedEmail);
    onAccessGranted(normalizedEmail);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#030816] px-4 py-8 text-amber-50">
      <form
        onSubmit={handleSubmit}
        className="premium-glass w-full max-w-md rounded-[2rem] p-6 sm:p-8"
      >
        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-300/10 text-amber-200">
          <Lock size={26} />
        </div>
        <p className="text-sm font-black uppercase tracking-[0.28em] text-amber-300">
          Admin Access
        </p>
        <h1 className="mt-2 text-3xl font-black">Enter Your Email</h1>
        <p className="mt-3 text-sm leading-6 text-amber-50/66">
          Only an approved admin email can open the content manager.
        </p>

        <label htmlFor="admin-email" className="mt-6 block">
          <span className={labelClass}>Email Address</span>
          <div className="relative">
            <Mail
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-amber-200/60"
            />
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              placeholder="admin@example.com"
              className={`${inputClass} pl-11`}
              autoComplete="email"
            />
          </div>
        </label>

        {error && (
          <p className="mt-3 rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-5 w-full rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-600 px-5 py-3 font-black text-[#08111f] shadow-[0_0_28px_rgba(245,178,57,0.24)] transition hover:brightness-110"
        >
          Continue
        </button>

        {allowedAdminEmails.length === 0 && (
          <p className="mt-4 rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-xs font-bold leading-5 text-red-100">
            Admin access is locked. Add VITE_ADMIN_EMAILS in environment variables and redeploy.
          </p>
        )}
      </form>
    </main>
  );
}

function Admin() {
  const { content, setContent, resetContent, saveStatus, isSupabaseConfigured } =
    useWebsiteContent();
  const [draftContent, setDraftContent] = useState<SiteContent>(content);
  const [isDirty, setIsDirty] = useState(false);
  const [adminEmail, setAdminEmail] = useState(
    () => window.sessionStorage.getItem(ADMIN_EMAIL_SESSION_KEY) ?? "",
  );
  const lastUpdated = new Date().toLocaleTimeString();

  useEffect(() => {
    if (!isDirty) {
      setDraftContent(content);
    }
  }, [content, isDirty]);

  if (!adminEmail || !isValidEmail(adminEmail) || !isAllowedAdminEmail(adminEmail)) {
    return <AdminEmailGate onAccessGranted={setAdminEmail} />;
  }

  const update = (next: SiteContent) => {
    setDraftContent(next);
    setIsDirty(true);
  };
  const updateRoot = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    update({ ...draftContent, [key]: value });
  };
  const updateHero = <K extends keyof SiteContent["hero"]>(
    key: K,
    value: SiteContent["hero"][K],
  ) => update({ ...draftContent, hero: { ...draftContent.hero, [key]: value } });
  const updateContact = <K extends keyof SiteContent["contact"]>(
    key: K,
    value: SiteContent["contact"][K],
  ) => update({ ...draftContent, contact: { ...draftContent.contact, [key]: value } });
  const updateEventSettings = <K extends keyof SiteContent["eventSettings"]>(
    key: K,
    value: SiteContent["eventSettings"][K],
  ) => update({ ...draftContent, eventSettings: { ...draftContent.eventSettings, [key]: value } });
  const updateListItem = <T,>(path: Path, index: number, item: T) => {
    const list = [...(draftContent[path] as T[])];
    list[index] = item;
    update({ ...draftContent, [path]: list });
  };
  const addListItem = <T,>(path: Path, item: T) => {
    update({ ...draftContent, [path]: [...(draftContent[path] as T[]), item] });
  };
  const removeListItem = (path: Path, index: number) => {
    update({
      ...draftContent,
      [path]: (draftContent[path] as unknown[]).filter((_, itemIndex) => itemIndex !== index),
    });
  };
  const saveDraft = () => {
    if (!confirmAction("Save these changes to the live website?")) return;
    setContent(draftContent);
    setIsDirty(false);
  };
  const discardDraft = () => {
    if (!confirmAction("Discard all unsaved changes?")) return;
    setDraftContent(content);
    setIsDirty(false);
  };
  const resetWebsite = () => {
    if (!confirmAction("Reset the live website content to defaults?")) return;
    resetContent();
    setDraftContent(defaultContent);
    setIsDirty(false);
  };

  return (
    <main className="min-h-screen bg-[#030816] px-4 py-8 text-amber-50 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="premium-glass sticky top-4 z-20 mb-6 flex flex-col gap-4 rounded-3xl p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-amber-300">
              Hidden Admin
            </p>
            <h1 className="text-3xl font-black">Website Content Manager</h1>
            <p className="mt-1 text-sm text-amber-50/60">
              {isDirty ? "Unsaved draft changes" : `Synced at ${lastUpdated}`}
            </p>
            <p
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black ${
                isSupabaseConfigured
                  ? "bg-green-500/15 text-green-200"
                  : "bg-amber-300/15 text-amber-100"
              }`}
            >
              {saveStatus}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                if (!confirmAction("Logout from admin panel? Unsaved changes will stay only in this tab.")) {
                  return;
                }
                window.sessionStorage.removeItem(ADMIN_EMAIL_SESSION_KEY);
                setAdminEmail("");
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-amber-300/25 bg-white/[0.05] px-4 py-3 font-bold text-amber-100 transition hover:bg-white/[0.09]"
            >
              <LogOut size={18} />
              {adminEmail}
            </button>
            <a
              href="/"
              onClick={(event) => {
                if (isDirty && !confirmAction("You have unsaved changes. Open the site anyway?")) {
                  event.preventDefault();
                }
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-amber-300/25 bg-white/[0.05] px-4 py-3 font-bold transition hover:bg-white/[0.09]"
            >
              <Home size={18} />
              View Site
            </a>
            <button
              type="button"
              onClick={saveDraft}
              disabled={!isDirty}
              className="inline-flex items-center gap-2 rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 font-bold text-amber-100 transition hover:bg-amber-300/20 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Save size={18} />
              Save Changes
            </button>
            <button
              type="button"
              onClick={discardDraft}
              disabled={!isDirty}
              className="inline-flex items-center gap-2 rounded-2xl border border-amber-300/25 bg-white/[0.05] px-4 py-3 font-bold text-amber-100 transition hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <RotateCcw size={18} />
              Discard Draft
            </button>
            <button
              type="button"
              onClick={resetWebsite}
              className="inline-flex items-center gap-2 rounded-2xl border border-red-300/25 bg-red-500/10 px-4 py-3 font-bold text-red-100 transition hover:bg-red-500/20"
            >
              <RotateCcw size={18} />
              Reset Website
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          <section className={cardClass}>
            <h2 className="mb-5 text-2xl font-black text-amber-100">Header & Hero</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <TextField label="Header Title" value={draftContent.navTitle} onChange={(value) => updateRoot("navTitle", value)} />
              <TextField label="Header Subtitle" value={draftContent.navSubtitle} onChange={(value) => updateRoot("navSubtitle", value)} />
              <ImageField label="Logo Image" value={draftContent.logoImage} onChange={(value) => updateRoot("logoImage", value)} />
              <ImageField label="Hero Banner Image" value={draftContent.hero.bannerImage} onChange={(value) => updateHero("bannerImage", value)} />
              <TextField label="Hero Badge" value={draftContent.hero.badge} onChange={(value) => updateHero("badge", value)} />
              <TextField label="Hero Title" value={draftContent.hero.title} onChange={(value) => updateHero("title", value)} />
              <TextField label="Hero Subtitle" value={draftContent.hero.subtitle} onChange={(value) => updateHero("subtitle", value)} />
              <TextField label="Invitation Text" value={draftContent.hero.invitation} onChange={(value) => updateHero("invitation", value)} multiline />
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="mb-5 text-2xl font-black text-amber-100">Contact & Event</h2>
            <div className="grid gap-4 lg:grid-cols-3">
              <TextField label="Contact Label" value={draftContent.contact.label} onChange={(value) => updateContact("label", value)} />
              <TextField label="Contact Name" value={draftContent.contact.name} onChange={(value) => updateContact("name", value)} />
              <TextField label="Contact Phone" value={draftContent.contact.phone} onChange={(value) => updateContact("phone", value)} />
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {draftContent.eventDetails.map((item, index) => (
                <TextField
                  key={`${item.icon}-${index}`}
                  label={`Event Detail ${index + 1}`}
                  value={item.label}
                  onChange={(value) => updateListItem<EventDetail>("eventDetails", index, { ...item, label: value })}
                />
              ))}
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-4">
              {draftContent.highlights.map((item, index) => (
                <TextField
                  key={`${item.icon}-${index}`}
                  label={`Highlight ${index + 1}`}
                  value={item.label}
                  onChange={(value) => updateListItem<Highlight>("highlights", index, { ...item, label: value })}
                />
              ))}
            </div>
          </section>

          <section className={cardClass}>
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-black text-amber-100">Upcoming Events</h2>
                <p className="mt-1 text-sm text-amber-50/58">
                  Manage all upcoming events, homepage event section, and popup.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!confirmAction("Add a new event to the draft?")) return;
                  addListItem<UpcomingEvent>("events", {
                    id: `event-${Date.now()}`,
                    enabled: true,
                    title: "New Event",
                    date: "Event date",
                    image: "/images/krishna-arjun-banner.png",
                    about: "About this event",
                    programStart: "Program starts at 3:00 PM onwards",
                    sevaEnabled: true,
                    sevaLabel: "Register for Seva",
                    sevaLink: "https://forms.gle/",
                  });
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-3 font-bold text-white"
              >
                <Plus size={18} />
                Add Event
              </button>
            </div>

            <div className="mb-5 grid gap-4 lg:grid-cols-2">
              <label className="inline-flex items-center gap-3 rounded-2xl border border-amber-300/20 bg-white/[0.04] px-4 py-3 font-bold text-amber-100">
                <input
                  type="checkbox"
                  checked={draftContent.eventSettings.popupEnabled}
                  onChange={(event) => updateEventSettings("popupEnabled", event.target.checked)}
                  className="size-5 accent-amber-400"
                />
                Show popup when an upcoming event exists
              </label>
              <TextField
                label="Popup Close Button Text"
                value={draftContent.eventSettings.popupButtonText}
                onChange={(value) => updateEventSettings("popupButtonText", value)}
              />
            </div>

            <div className="grid gap-5">
              {draftContent.events.map((item, index) => (
                <div key={item.id} className="rounded-3xl border border-amber-300/15 bg-black/20 p-4">
                  <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-black text-amber-200">Event {index + 1}</h3>
                      <p className="text-sm text-amber-50/52">{item.title}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex items-center gap-2 font-bold text-amber-100">
                        <input
                          type="checkbox"
                          checked={item.enabled}
                          onChange={(event) =>
                            updateListItem<UpcomingEvent>("events", index, {
                              ...item,
                              enabled: event.target.checked,
                            })
                          }
                          className="size-5 accent-amber-400"
                        />
                        Upcoming
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (!confirmAction(`Delete event "${item.title}" from the draft?`)) return;
                          removeListItem("events", index);
                        }}
                        className="text-red-300"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <TextField
                      label="Event Title"
                      value={item.title}
                      onChange={(value) => updateListItem<UpcomingEvent>("events", index, { ...item, title: value })}
                    />
                    <TextField
                      label="Event Date"
                      value={item.date}
                      onChange={(value) => updateListItem<UpcomingEvent>("events", index, { ...item, date: value })}
                    />
                    <ImageField
                      label="Event Image"
                      value={item.image}
                      onChange={(value) => updateListItem<UpcomingEvent>("events", index, { ...item, image: value })}
                    />
                    <TextField
                      label="Program Start"
                      value={item.programStart}
                      onChange={(value) =>
                        updateListItem<UpcomingEvent>("events", index, { ...item, programStart: value })
                      }
                    />
                    <TextField
                      label="About Event"
                      value={item.about}
                      onChange={(value) => updateListItem<UpcomingEvent>("events", index, { ...item, about: value })}
                      multiline
                    />
                    <div className="rounded-3xl border border-amber-300/15 bg-black/20 p-4">
                      <label className="mb-4 inline-flex items-center gap-3 font-bold text-amber-100">
                        <input
                          type="checkbox"
                          checked={item.sevaEnabled}
                          onChange={(event) =>
                            updateListItem<UpcomingEvent>("events", index, {
                              ...item,
                              sevaEnabled: event.target.checked,
                            })
                          }
                          className="size-5 accent-amber-400"
                        />
                        Show Seva Button
                      </label>
                      <div className="grid gap-4">
                        <TextField
                          label="Seva Button Text"
                          value={item.sevaLabel}
                          onChange={(value) =>
                            updateListItem<UpcomingEvent>("events", index, { ...item, sevaLabel: value })
                          }
                        />
                        <TextField
                          label="Seva Google Form Link"
                          value={item.sevaLink}
                          onChange={(value) =>
                            updateListItem<UpcomingEvent>("events", index, { ...item, sevaLink: value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-amber-100">WhatsApp Groups</h2>
              <button
                type="button"
                onClick={() => {
                  if (!confirmAction("Add a new WhatsApp group to the draft?")) return;
                  addListItem<GroupCard>("groups", {
                    name: "New Group",
                    link: "https://chat.whatsapp.com/",
                    imageUrl: "",
                    description: "Group description",
                  });
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-3 font-bold text-white"
              >
                <Plus size={18} />
                Add
              </button>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <TextField label="Groups Section Title" value={draftContent.groupsTitle} onChange={(value) => updateRoot("groupsTitle", value)} />
              <TextField label="Groups Section Subtitle" value={draftContent.groupsSubtitle} onChange={(value) => updateRoot("groupsSubtitle", value)} />
            </div>
            <div className="mt-6 grid gap-5">
              {draftContent.groups.map((item, index) => (
                <div key={`${item.link}-${index}`} className="rounded-3xl border border-amber-300/15 bg-black/20 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-black text-amber-200">Group {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => {
                        if (!confirmAction(`Delete group "${item.name}" from the draft?`)) return;
                        removeListItem("groups", index);
                      }}
                      className="text-red-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <TextField label="Group Name" value={item.name} onChange={(value) => updateListItem<GroupCard>("groups", index, { ...item, name: value })} />
                    <TextField label="Join Link" value={item.link} onChange={(value) => updateListItem<GroupCard>("groups", index, { ...item, link: value })} />
                    <ImageField label="Group Image" value={item.imageUrl} onChange={(value) => updateListItem<GroupCard>("groups", index, { ...item, imageUrl: value })} />
                    <TextField label="Description" value={item.description} onChange={(value) => updateListItem<GroupCard>("groups", index, { ...item, description: value })} multiline />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-amber-100">Quotes</h2>
              <button
                type="button"
                onClick={() => {
                  if (!confirmAction("Add a new quote to the draft?")) return;
                  addListItem<QuoteItem>("quotes", { text: "New quote", author: "Srila Prabhupada" });
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-3 font-bold text-white"
              >
                <Plus size={18} />
                Add
              </button>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <TextField label="Quotes Section Title" value={draftContent.quotesTitle} onChange={(value) => updateRoot("quotesTitle", value)} />
              <ImageField label="Prabhupad Image" value={draftContent.quotesImage} onChange={(value) => updateRoot("quotesImage", value)} />
              <TextField label="Quote Image Note" value={draftContent.quotesNote} onChange={(value) => updateRoot("quotesNote", value)} multiline />
            </div>
            <div className="mt-6 grid gap-4">
              {draftContent.quotes.map((item, index) => (
                <div key={`${item.text}-${index}`} className="rounded-3xl border border-amber-300/15 bg-black/20 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-black text-amber-200">Quote {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => {
                        if (!confirmAction("Delete this quote from the draft?")) return;
                        removeListItem("quotes", index);
                      }}
                      className="text-red-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
                    <TextField label="Author" value={item.author} onChange={(value) => updateListItem<QuoteItem>("quotes", index, { ...item, author: value })} />
                    <TextField label="Quote Text" value={item.text} onChange={(value) => updateListItem<QuoteItem>("quotes", index, { ...item, text: value })} multiline />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-amber-100">Social Media</h2>
              <button
                type="button"
                onClick={() => {
                  if (!confirmAction("Add a new social link to the draft?")) return;
                  addListItem<SocialLink>("socialLinks", {
                    name: "WhatsApp Community",
                    label: "Join Now",
                    icon: "whatsapp",
                    href: "https://www.whatsapp.com/",
                    color: "from-emerald-400 to-green-700",
                  });
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-3 font-bold text-white"
              >
                <Plus size={18} />
                Add
              </button>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <TextField label="Social Section Title" value={draftContent.socialTitle} onChange={(value) => updateRoot("socialTitle", value)} />
              <TextField label="Social Section Subtitle" value={draftContent.socialSubtitle} onChange={(value) => updateRoot("socialSubtitle", value)} />
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {draftContent.socialLinks.map((item, index) => (
                <div key={`${item.name}-${index}`} className="rounded-3xl border border-amber-300/15 bg-black/20 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-black text-amber-200">Social {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => {
                        if (!confirmAction(`Delete social link "${item.name}" from the draft?`)) return;
                        removeListItem("socialLinks", index);
                      }}
                      className="text-red-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="grid gap-4">
                    <TextField label="Name" value={item.name} onChange={(value) => updateListItem<SocialLink>("socialLinks", index, { ...item, name: value })} />
                    <TextField label="Small Label" value={item.label} onChange={(value) => updateListItem<SocialLink>("socialLinks", index, { ...item, label: value })} />
                    <TextField label="Link" value={item.href} onChange={(value) => updateListItem<SocialLink>("socialLinks", index, { ...item, href: value })} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="mb-5 text-2xl font-black text-amber-100">Footer</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <TextField label="Footer Line" value={draftContent.footerLine} onChange={(value) => updateRoot("footerLine", value)} />
              <TextField label="Copyright" value={draftContent.copyright} onChange={(value) => updateRoot("copyright", value)} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Admin;
