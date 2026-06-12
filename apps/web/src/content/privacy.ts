export const privacyPolicy = {
  title: "Privacy Policy",
  lastUpdated: "June 11, 2026",
  sections: [
    {
      heading: "Overview",
      body: "GeoKenya is designed to operate entirely offline. Your location data, ward lookups, and geographic calculations are performed locally on your device using an embedded SQLite database with SpatiaLite extensions.",
    },
    {
      heading: "Data We Do Not Collect",
      body: "In normal offline use, GeoKenya does not transmit your location, search history, or ward lookups to any server. No analytics SDKs track your movements or browsing within the app.",
    },
    {
      heading: "Optional Sync",
      body: "If you enable sync, the app may send ward events and updates you create to the GeoKenya sync server. Sync is opt-in and requires explicit configuration. Sync payloads contain only the event data you submit — not your continuous location.",
    },
    {
      heading: "Location Permissions",
      body: "GeoKenya requests location access solely to determine your current ward and compute distances. Location data is processed on-device and is never uploaded unless you have configured sync and are submitting a location-tagged event.",
    },
    {
      heading: "Crash Reporting",
      body: "Production builds may use Firebase Crashlytics to collect anonymized crash reports. These reports help improve app stability and do not include your ward lookup history or location data.",
    },
    {
      heading: "Contact",
      body: "Questions about this policy can be directed to the project maintainers via the GeoKenya GitHub repository.",
    },
  ],
} as const;
