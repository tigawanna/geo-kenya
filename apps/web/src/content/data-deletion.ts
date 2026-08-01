export const dataDeletionPolicy = {
  title: "Data Deletion",
  lastUpdated: "August 1, 2026",
  intro:
    "Google Play and good practice both expect a clear way to request deletion of account and personal data. Here is how GeoKenya handles that.",
  sections: [
    {
      heading: "On-device app data",
      body: "To remove local GeoKenya data from your phone, clear the app’s storage in Android settings or uninstall GeoKenya. Uninstalling removes the on-device SQLite database, cached maps, and local preferences.",
    },
    {
      heading: "Waitlist email",
      body: "To remove your email from the testing waitlist, send a message to denniskinuthiawaweru@gmail.com with subject “GeoKenya waitlist removal” and the email address you used. We will delete the waitlist row associated with that address.",
    },
    {
      heading: "Dashboard account",
      body: "If you created a GeoKenya web account, email denniskinuthiawaweru@gmail.com from the same address with subject “GeoKenya account deletion”. We will delete your account record and associated sessions. OAuth tokens stored for sign-in will also be removed.",
    },
    {
      heading: "Synced contributions",
      body: "Community sync events you submitted may already be reviewed or merged into shared reference data. On request we can delete or anonymize identifiable account linkage; published geographic corrections that no longer identify you may remain as part of the shared dataset.",
    },
    {
      heading: "Crash reports",
      body: "Firebase Crashlytics reports are anonymized diagnostics. They are not tied to your waitlist email or ward lookup history. Retention follows Google Firebase defaults and cannot always be selectively purged per user.",
    },
    {
      heading: "What we need from you",
      body: "Include the email tied to your waitlist signup or account, and whether you want waitlist removal, account deletion, or both. We aim to complete verified requests within 30 days.",
    },
    {
      heading: "Contact",
      body: "denniskinuthiawaweru@gmail.com · https://github.com/tigawanna/geo-kenya",
    },
  ],
} as const;
