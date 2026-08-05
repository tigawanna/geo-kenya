export const privacyPolicy = {
  title: "Privacy Policy",
  lastUpdated: "August 5, 2026",
  intro:
    "GeoKenya is built offline-first. Most of what you do stays on your phone. This policy explains what little data we process when you use the app, optional sync, crash reporting, or the website waitlist.",
  sections: [
    {
      heading: "Who we are",
      body: "GeoKenya (“we”, “us”) provides an offline geographic reference for Kenya’s wards, constituencies, and counties. The Android app package is com.tigawanna.geokenya.dev. Contact: denniskinuthiawaweru@gmail.com. Project source: https://github.com/tigawanna/geo-kenya.",
    },
    {
      heading: "Overview",
      body: "In normal offline use, location lookups, ward searches, and map calculations run locally on your device using an embedded SQLite database with SpatiaLite extensions. We do not sell personal data and we do not show ads.",
    },
    {
      heading: "Data processed on your device",
      body: "Ward, constituency, and county reference data is stored on-device. When you grant location permission, your approximate or precise location is used only to identify nearby administrative boundaries and distances. That location is processed on-device and is not continuously uploaded.",
    },
    {
      heading: "Data we do not collect in offline use",
      body: "Without optional sync or a website waitlist submission, GeoKenya does not transmit your location history, search history, or ward lookups to our servers. We do not use advertising SDKs or behavioral tracking SDKs for marketing.",
    },
    {
      heading: "Optional community sync",
      body: "If you enable sync and submit contributions, the app may send event payloads you create (for example suggested edits or location-tagged contributions) to the GeoKenya sync server. Sync is opt-in. Payloads contain the data you submit — not a continuous GPS trail.",
    },
    {
      heading: "Website waitlist",
      body: "If you join the testing waitlist on our website, we store the email address you submit, the time of signup, an optional source label, and a truncated user-agent string so we can invite you to internal or open testing rounds. We use this email only for GeoKenya testing and launch communications. You can request removal at any time via the contact email below.",
    },
    {
      heading: "Accounts (web dashboard)",
      body: "If you create a dashboard account, we store your name, email address, authentication credentials or OAuth tokens, and session data needed to sign you in. Account data is used to operate sync review tools and related product features.",
    },
    {
      heading: "Crash reporting",
      body: "Production Android builds may use Google Firebase Crashlytics to collect anonymized crash and diagnostic reports (device model, OS version, app version, stack traces). These reports help improve stability and are not used to reconstruct your ward lookup history.",
    },
    {
      heading: "Location permissions",
      body: "GeoKenya requests location access solely to determine your current administrative area and compute distances. You can deny or revoke permission in system settings; core offline browsing of reference data still works without location.",
    },
    {
      heading: "Children’s privacy",
      body: "GeoKenya is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided personal data, contact us and we will delete it.",
    },
    {
      heading: "Data retention and deletion",
      body: "On-device data remains until you clear app storage or uninstall. Waitlist emails are retained until you remove them from Account (when signed in with the same email) or ask to be removed, or until the testing program ends. After you delete a web account, we retain the email only as a deletion record and to block re-registration abuse. Crash reports follow Firebase retention defaults. Pending contributions can be withdrawn from Account; verified sync data stays in the shared dataset.",
    },
    {
      heading: "Third-party services",
      body: "We use Cloudflare (website hosting and database) and, in production Android builds, Google Firebase Crashlytics. Those providers process data under their own terms to deliver the services we configure.",
    },
    {
      heading: "International transfers",
      body: "Because hosting and crash reporting providers may operate outside Kenya, limited technical data may be processed in other countries subject to those providers’ safeguards.",
    },
    {
      heading: "Your choices",
      body: "You can use the app fully offline, revoke location permission, decline optional sync, remove your waitlist email from Account when signed in, delete your web account from Account, or email denniskinuthiawaweru@gmail.com for waitlist removal if you cannot sign in.",
    },
    {
      heading: "Changes",
      body: "We may update this policy as the product evolves. The “Last updated” date at the top will change when we do. Continued use after an update means you accept the revised policy.",
    },
    {
      heading: "Contact",
      body: "Privacy questions: denniskinuthiawaweru@gmail.com. You can also open an issue on https://github.com/tigawanna/geo-kenya.",
    },
  ],
} as const;
