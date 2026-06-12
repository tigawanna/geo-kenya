import { Layers, Map, MapPin, PencilLine, Search, Users, WifiOff, Zap } from "lucide-react";

export const landingNav = {
  status: "Know your ward, constituency & county",
  links: [
    { label: "How it works", href: "#capabilities" },
    { label: "Why GeoKenya", href: "#why" },
    { label: "Privacy", href: "/privacy" },
  ],
} as const;

export const landingHero = {
  eyebrow: "Get to know your Kenya",
  title: "Know your ward, constituency, and county.",
  description:
    "Most of us know our county, but few can name the ward or constituency we live in — even though they show up on official forms all the time. GeoKenya is a simple, friendly way to look up exactly where you are and understand how your area is put together.",
  primaryCta: "Get the app",
  secondaryCta: "Open dashboard",
  mapPanel: {
    fileLabel: "kenya.wards",
    pathLabel: "/explore/ward-lookup",
    coords: "-1.2921, 36.8219",
    legend: [
      { label: "Ward", tone: "red" },
      { label: "Constituency", tone: "green" },
      { label: "County", tone: "ink" },
    ],
  },
  navPanel: {
    title: "Kilimani Ward",
    context: "Dagoretti North · Nairobi County",
    stats: [
      { label: "Counties", value: "47", icon: Layers },
      { label: "Constituencies", value: "290", icon: Map },
      { label: "Wards", value: "1,450+", icon: MapPin },
    ],
  },
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
    "GeoKenya is small, quick, and dependable — easy to whip out whenever you want a clear picture of where you are and what it's made up of.",
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

export const landingCta = {
  title: "Get to know your Kenya",
  highlight: "Kenya",
  description:
    "Grab the app to look up any ward or constituency, or open the dashboard to review and verify community contributions.",
  primaryCta: "Open dashboard",
  secondaryCta: "Create an account",
} as const;

export const landingFooter = {
  tagline: "Know your ward · constituency · county",
} as const;
