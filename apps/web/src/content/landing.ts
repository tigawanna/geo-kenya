import { MapPin, MapPinned, RefreshCw, ShieldCheck, Smartphone, WifiOff } from "lucide-react";

export const landingNav = {
  status: "Offline maps · Ward lookup",
  links: [
    { label: "Capabilities", href: "#capabilities" },
    { label: "Why GeoKenya", href: "#why" },
    { label: "Privacy", href: "/privacy" },
  ],
} as const;

export const landingHero = {
  eyebrow: "Kenya · Offline-first",
  title: "Every ward, county, and constituency — on your phone.",
  description:
    "GeoKenya puts Kenya's administrative geography in your pocket. Look up wards by location or coordinates, explore boundaries on the map, and sync verified community updates — all without relying on a connection.",
  primaryCta: "Get the app",
  secondaryCta: "Open dashboard",
  mapPanel: {
    fileLabel: "kenya.wards",
    pathLabel: "/admin/divisions",
    coords: "-1.2921, 36.8219",
    legend: [
      { label: "Ward", tone: "primary" },
      { label: "Constituency", tone: "info" },
      { label: "County", tone: "warning" },
    ],
  },
  navPanel: {
    title: "Kilimani Ward",
    distance: "0.8 km",
    elevation: "1,795 m",
    eta: "Nairobi County",
  },
} as const;

export const landingCapabilities = {
  heading: "From the map to the field",
  description:
    "A complete geographic reference on your device, with an optional sync hub for verified ward events and updates.",
  steps: [
    {
      id: "01",
      label: "OFFLINE DATA",
      icon: WifiOff,
      title: "Works without signal",
      description:
        "MapLibre tiles and a SpatiaLite database ship on-device. All 1,450+ wards, 47 counties, and 290 constituencies stay available offline.",
    },
    {
      id: "02",
      label: "LOCATION LOOKUP",
      icon: MapPin,
      title: "Find your ward instantly",
      description:
        "GPS-based ward detection, proximity search, and coordinate lookup — computed locally with no data leaving your device.",
    },
    {
      id: "03",
      label: "SYNC HUB",
      icon: RefreshCw,
      title: "Verified community updates",
      description:
        "Optional sync brings ward events and updates through an append-only event log. Admins verify changes before they reach other devices.",
    },
  ],
} as const;

export const landingReasons = {
  heading: "Built for the field, not the cloud",
  description:
    "Connectivity is unreliable across much of Kenya. GeoKenya is designed around offline-first operation from the first tile to the last lookup.",
  items: [
    {
      icon: Smartphone,
      title: "Offline-first by design",
      description:
        "Ward lookup, map exploration, and proximity search run entirely on-device. The network is an enhancement, never a requirement.",
    },
    {
      icon: ShieldCheck,
      title: "Your location stays private",
      description:
        "Geographic calculations and database queries never leave your phone unless you explicitly enable sync.",
    },
    {
      icon: MapPinned,
      title: "Field-grade accuracy",
      description:
        "Boundaries, distances, and ward assignments use embedded SpatiaLite geometry — not guessed from a remote API.",
    },
  ],
} as const;

export const landingCta = {
  title: "Explore Kenya's geography",
  highlight: "Kenya",
  description:
    "Sign in to the admin hub to review sync events, or grab the mobile app to start exploring wards offline.",
  primaryCta: "Open dashboard",
  secondaryCta: "Create an account",
} as const;

export const landingFooter = {
  tagline: "Offline wards · Location lookup · Verified sync",
} as const;
