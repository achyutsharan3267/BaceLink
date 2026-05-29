import { useCallback, useEffect, useState } from "react";
import { group } from "./Data";
import { isSupabaseConfigured, supabase, type SiteContentRow } from "./supabase";

const STORAGE_KEY = "bace-landing-content";
const CONTENT_ROW_ID = "main";

export type EventDetailIcon = "calendar" | "map" | "clock";
export type HighlightIcon = "play" | "music" | "book" | "food";
export type SocialIcon = "youtube" | "instagram" | "facebook" | "telegram" | "whatsapp";

export type EventDetail = {
  label: string;
  icon: EventDetailIcon;
};

export type Highlight = {
  label: string;
  icon: HighlightIcon;
};

export type GroupCard = {
  name: string;
  link: string;
  imageUrl: string;
  description: string;
};

export type QuoteItem = {
  text: string;
  author: string;
};

export type SocialLink = {
  name: string;
  label: string;
  icon: SocialIcon;
  href: string;
  color: string;
};

export type UpcomingEvent = {
  id: string;
  enabled: boolean;
  title: string;
  date: string;
  image: string;
  about: string;
  programStart: string;
  sevaEnabled: boolean;
  sevaLabel: string;
  sevaLink: string;
};

export type SiteContent = {
  navTitle: string;
  navSubtitle: string;
  logoImage: string;
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    invitation: string;
    bannerImage: string;
  };
  contact: {
    label: string;
    name: string;
    phone: string;
  };
  eventDetails: EventDetail[];
  highlights: Highlight[];
  groupsTitle: string;
  groupsSubtitle: string;
  groups: GroupCard[];
  quotesTitle: string;
  quotesImage: string;
  quotesNote: string;
  quotes: QuoteItem[];
  socialTitle: string;
  socialSubtitle: string;
  socialLinks: SocialLink[];
  events: UpcomingEvent[];
  eventSettings: {
    popupEnabled: boolean;
    popupButtonText: string;
  };
  sundayPopup: {
    enabled: boolean;
    title: string;
    date: string;
    image: string;
    about: string;
    programStart: string;
    sevaEnabled: boolean;
    sevaLabel: string;
    sevaLink: string;
    buttonText: string;
  };
  footerLine: string;
  copyright: string;
};

export const defaultContent: SiteContent = {
  navTitle: "Raja Vidya",
  navSubtitle: "The King of Knowledge",
  logoImage: "/images/bace-logo.png",
  hero: {
    badge: "Weekly Bhagavad Gita Classes",
    title: "Raja Vidya",
    subtitle: "The King of Knowledge",
    invitation:
      "Aap aur aapke parivaar ko ISKCON ke special Bhagavad Gita session mein prem se amantrit kiya jata hai. Join an evening of wisdom, kirtan, prasadam, and spiritual friendship.",
    bannerImage: "/images/krishna-arjun-banner.png",
  },
  contact: {
    label: "Venue assistance",
    name: "Achyut Sharan",
    phone: "9667453267",
  },
  eventDetails: [
    { label: "Every Sunday", icon: "calendar" },
    { label: "ISKCON Auditorium", icon: "map" },
    { label: "3:00 PM onwards", icon: "clock" },
  ],
  highlights: [
    { label: "Spiritual Video Show", icon: "play" },
    { label: "Blissful Kirtan", icon: "music" },
    { label: "Bhagavad Gita Discourse", icon: "book" },
    { label: "Delicious Prasadam", icon: "food" },
  ],
  groupsTitle: "Join Our WhatsApp Groups",
  groupsSubtitle: "Continue the journey with devotees",
  groups: group,
  quotesTitle: "Srila Prabhupada Quotes",
  quotesImage: "/images/iskcon-raja-vidya-reference.png",
  quotesNote:
    "Wisdom becomes practical when it is heard, discussed, and lived in loving devotional association.",
  quotes: [
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
  ],
  socialTitle: "Follow Us On Social Media",
  socialSubtitle: "Stay connected with the community",
  socialLinks: [
    {
      name: "YouTube",
      label: "Subscribe",
      icon: "youtube",
      href: "https://www.youtube.com/@Mayapur_bace",
      color: "from-red-500 to-red-700",
    },
    {
      name: "Instagram",
      label: "Follow Us",
      icon: "instagram",
      href: "https://www.instagram.com/mayapurdhambace?igsh=ZTkwdnlkNnNsZ2lr",
      color: "from-pink-500 via-orange-400 to-purple-600",
    },
    {
      name: "Facebook",
      label: "Like Page",
      icon: "facebook",
      href: "https://www.facebook.com/",
      color: "from-blue-500 to-blue-700",
    },
    {
      name: "Telegram",
      label: "Join Channel",
      icon: "telegram",
      href: "https://telegram.org/",
      color: "from-sky-400 to-blue-600",
    },
  ],
  events: [],
  eventSettings: {
    popupEnabled: true,
    popupButtonText: "Close",
  },
  sundayPopup: {
    enabled: false,
    title: "",
    date: "",
    image: "/images/krishna-arjun-banner.png",
    about: "",
    programStart: "",
    sevaEnabled: false,
    sevaLabel: "Register for Seva",
    sevaLink: "",
    buttonText: "Close",
  },
  footerLine: "Hare Krishna - Hari Bol",
  copyright: "Copyright © 2026 Raja Vidya Management Team. All Rights Reserved.",
};

function mergeContent(content: Partial<SiteContent> | SiteContent): SiteContent {
  return {
    ...defaultContent,
    ...content,
    hero: { ...defaultContent.hero, ...content.hero },
    contact: { ...defaultContent.contact, ...content.contact },
    events: content.events ?? defaultContent.events,
    eventSettings: { ...defaultContent.eventSettings, ...content.eventSettings },
    sundayPopup: { ...defaultContent.sundayPopup, ...content.sundayPopup },
  };
}

export function getUpcomingEvents(content: SiteContent) {
  return content.events.filter((event) => event.enabled);
}

function readContent(): SiteContent {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? mergeContent(JSON.parse(saved)) : defaultContent;
  } catch {
    return defaultContent;
  }
}

export async function loadContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured || !supabase) {
    return readContent();
  }

  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("id", CONTENT_ROW_ID)
    .maybeSingle<Pick<SiteContentRow, "content">>();

  if (error) {
    console.error("Unable to load Supabase content", error);
    return readContent();
  }

  if (!data?.content || Object.keys(data.content).length === 0) {
    return defaultContent;
  }

  const nextContent = mergeContent(data.content);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextContent));

  return nextContent;
}

export async function saveContent(content: SiteContent) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("site_content").upsert({
      id: CONTENT_ROW_ID,
      content,
    });

    if (error) {
      throw error;
    }
  }

  window.dispatchEvent(new Event("bace-content-updated"));
}

export async function clearSavedContent() {
  window.localStorage.removeItem(STORAGE_KEY);

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("site_content").upsert({
      id: CONTENT_ROW_ID,
      content: defaultContent,
    });

    if (error) {
      throw error;
    }
  }

  window.dispatchEvent(new Event("bace-content-updated"));
}

export function useWebsiteContent() {
  const [content, setContentState] = useState<SiteContent>(() => readContent());
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [saveStatus, setSaveStatus] = useState(
    isSupabaseConfigured ? "Connecting to Supabase..." : "Local browser mode",
  );

  useEffect(() => {
    let isMounted = true;

    loadContent()
      .then((nextContent) => {
        if (!isMounted) return;
        setContentState(nextContent);
        setSaveStatus(
          isSupabaseConfigured
            ? "Connected to Supabase"
            : "Local browser mode. Add Supabase env keys for shared updates.",
        );
      })
      .catch((error: unknown) => {
        console.error("Content load failed", error);
        if (isMounted) {
          setSaveStatus("Could not load Supabase content. Using local fallback.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    const syncContent = () => {
      loadContent()
        .then((nextContent) => setContentState(nextContent))
        .catch(() => setContentState(readContent()));
    };

    window.addEventListener("storage", syncContent);
    window.addEventListener("bace-content-updated", syncContent);

    const channel =
      isSupabaseConfigured && supabase
        ? supabase
            .channel("site-content-sync")
            .on(
              "postgres_changes",
              {
                event: "*",
                schema: "public",
                table: "site_content",
                filter: `id=eq.${CONTENT_ROW_ID}`,
              },
              syncContent,
            )
            .subscribe()
        : null;

    return () => {
      isMounted = false;
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
      window.removeEventListener("storage", syncContent);
      window.removeEventListener("bace-content-updated", syncContent);
    };
  }, []);

  const setContent = useCallback(async (nextContent: SiteContent) => {
    setContentState(nextContent);
    setSaveStatus(isSupabaseConfigured ? "Saving to Supabase..." : "Saving locally...");

    try {
      await saveContent(nextContent);
      setSaveStatus(isSupabaseConfigured ? "Saved to Supabase" : "Saved locally");
    } catch (error) {
      console.error("Content save failed", error);
      setSaveStatus("Save failed. Check Supabase config/policies.");
    }
  }, []);

  const resetContent = useCallback(async () => {
    setContentState(defaultContent);
    setSaveStatus(isSupabaseConfigured ? "Resetting Supabase content..." : "Resetting local content...");

    try {
      await clearSavedContent();
      setSaveStatus(isSupabaseConfigured ? "Reset saved to Supabase" : "Reset locally");
    } catch (error) {
      console.error("Content reset failed", error);
      setSaveStatus("Reset failed. Check Supabase config/policies.");
    }
  }, []);

  return { content, setContent, resetContent, isLoading, saveStatus, isSupabaseConfigured };
}
