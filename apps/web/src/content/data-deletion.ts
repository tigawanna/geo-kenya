export const dataDeletionPolicy = {
  title: "Data Deletion",
  lastUpdated: "August 2, 2026",
  intro:
    "Google Play and good practice both expect a clear way to request deletion of account and personal data. Here is how GeoKenya handles that.",
  sections: [
    {
      heading: "On-device app data",
      body: "To remove local GeoKenya data from your phone, clear the app’s storage in Android settings or uninstall GeoKenya. Uninstalling removes the on-device SQLite database, cached maps, and local preferences.",
    },
    {
      heading: "Waitlist email",
      body: "If you have a GeoKenya web account with the same email, sign in and open Account to remove yourself from the testing waitlist. Otherwise email denniskinuthiawaweru@gmail.com with subject “GeoKenya waitlist removal” and the address you used.",
    },
    {
      heading: "Dashboard account",
      body: "Sign in and open Account to review your profile and self-serve waitlist/contribution controls. To delete the web account itself, email denniskinuthiawaweru@gmail.com from the same address with subject “GeoKenya account deletion”. We will delete your account record and associated sessions. OAuth tokens stored for sign-in will also be removed.",
    },
    {
      heading: "Synced contributions",
      body: "From Account you can withdraw contributions that are still pending review. Once an event is verified it becomes part of the shared geographic dataset and is not removed. On request we can delete or anonymize remaining identifiable account linkage for pending items.",
    },
    {
      heading: "Crash reports",
      body: "Firebase Crashlytics reports are anonymized diagnostics. They are not tied to your waitlist email or ward lookup history. Retention follows Google Firebase defaults and cannot always be selectively purged per user.",
    },
    {
      heading: "What we need from you",
      body: "For email requests, include the address tied to your waitlist signup or account, and whether you want waitlist removal, account deletion, or both. We aim to complete verified requests within 30 days.",
    },
    {
      heading: "Contact",
      body: "denniskinuthiawaweru@gmail.com · https://github.com/tigawanna/geo-kenya",
    },
  ],
} as const;
