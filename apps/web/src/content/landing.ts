import { PencilLine, Search, Map, Users, WifiOff, Zap } from "lucide-react";

export const landingNav = {
  links: [
    { label: "How it works", href: "#capabilities" },
    { label: "Why GeoKenya", href: "#why" },
  ],
} as const;

export const landingAccess = {
  openTesting: {
    eyebrow: "Open testing",
    heading: "Try GeoKenya on Android",
    description:
      "Open testing is live on Google Play. Install the build and help us shake out the newest features.",
    cta: "Join open testing",
  },
  production: {
    eyebrow: "On Google Play",
    heading: "Get the app",
    description:
      "GeoKenya is available on Google Play. Download the stable release and explore Kenya’s map.",
    cta: "Download on Google Play",
  },
  openAndProduction: {
    eyebrow: "Available now",
    heading: "Pick your build",
    description:
      "Try the newest features in open testing, or install the stable production release from Google Play.",
    openCta: "Try open testing",
    productionCta: "Get production app",
  },
} as const;

export const landingHero = {
  eyebrow: "Android testing soon",
  stats: [
    { label: "47 counties", tone: "green" },
    { label: "290 constituencies", tone: "red" },
    { label: "1,450 wards", tone: "neutral" },
  ],
  title: "But do you know which one is yours?",
  description:
    "County is easy. Constituency, maybe. Your ward? That's the tricky one. GeoKenya finds it — no stress.",
  primaryCta: "Get started",
  secondaryCta: "See how it works",
} as const;

export const landingCapabilities = {
  heading: "A friendly way to know your place",
  description:
    "Look up where you are, see how the map fits together, and help make the data better for everyone who comes after you.",
  steps: [
    {
      id: "01",
      label: "LOOK IT UP",
      icon: Search,
      title: "Find your ward in seconds",
      description:
        "Search by your current location or any place name to instantly see the ward, constituency, and county it belongs to.",
    },
    {
      id: "02",
      label: "UNDERSTAND",
      icon: Map,
      title: "See how your area fits together",
      description:
        "Explore boundaries on the map and learn how wards roll up into constituencies and counties across all 47 counties.",
    },
    {
      id: "03",
      label: "CONTRIBUTE",
      icon: PencilLine,
      title: "Improve the map for everyone",
      description:
        "Notice something off or missing? Suggest edits and add local detail. Verified contributions become a shared reference others can trust.",
    },
  ],
} as const;

export const landingReasons = {
  heading: "A handy tool you'll keep coming back to",
  description:
    "GeoKenya is small, quick, and dependable — easy to whip out whenever you want a clear picture of where you are.",
  items: [
    {
      icon: Zap,
      title: "Answers in a tap",
      description:
        "Open it anywhere and immediately see your ward, constituency, and county — no scrolling through forms or guessing.",
    },
    {
      icon: WifiOff,
      title: "Works wherever you go",
      description:
        "Maps and lookups are stored on your phone, so they keep working out on the trail or in remote areas where the signal drops.",
    },
    {
      icon: Users,
      title: "Built better by the community",
      description:
        "High-quality data kept accurate and current by people who know their areas best — and every contribution helps the next person.",
    },
  ],
} as const;

export const landingWaitlist = {
  eyebrow: "Early access",
  heading: "Join the testing waitlist",
  description:
    "Leave your email and we’ll invite you to internal or open testing rounds on Android Play as slots open.",
  placeholder: "you@email.com",
  submitLabel: "Request invite",
  successTitle: "You’re on the list",
  successBody: "We’ll email you when a testing round opens.",
  alreadyJoinedBody: "That email is already on the waitlist. We’ll be in touch.",
  privacyNote: "By joining you agree to our Privacy Policy and Terms.",
} as const;

export const landingCta = {
  title: "Get to know your Kenya",
  highlight: "Kenya",
  description:
    "Join the waitlist for Android testing and be first in line when internal or open rounds open.",
  primaryCta: "Join the waitlist",
  secondaryCta: "See how it works",
  openTestingCta: "Try open testing",
  productionCta: "Get the app",
  dualDescription:
    "Open testing has the newest builds. Production is the stable release on Google Play.",
} as const;

export const landingFooter = {
  tagline: "Know your ward · constituency · county",
  legal: [
    { label: "Privacy", to: "/privacy" as const },
    { label: "Terms", to: "/terms" as const },
    // Shown in footer only in DEV — route is gated until account dashboard ships
    { label: "Data deletion", to: "/data-deletion" as const },
  ],
} as const;
