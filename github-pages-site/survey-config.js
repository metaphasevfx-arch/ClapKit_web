// ClapKit survey storage configuration.
// This file is loaded on the public site, so do not place private secrets here.
window.CK_SURVEY_CONFIG = {
  // local | supabase | webhook
  mode: "webhook",

  // Supabase mode example:
  // supabaseUrl: "https://YOUR-PROJECT.supabase.co",
  // supabaseAnonKey: "YOUR_PUBLIC_ANON_KEY",
  // supabaseTable: "department_survey_responses",

  // Google Apps Script Web App URL:
  // https://script.google.com/macros/s/XXXXXXXXXXXX/exec
  webhookUrl: "https://script.google.com/macros/s/AKfycbyqxO8pgod1vsFgGZ1ZuuoRBxhQ4b1t5pNvCN8IJuGZeTQaxhP3Xzre6I9k8Wkn1YJC/exec",

  // For Google Apps Script from browser (Safari/iPhone) use no-cors mode.
  webhookNoCors: true,

  // Optional shared token. Will be sent as query param ?token=...
  // Use a long random string and validate it in Apps Script.
  webhookToken: "clapkit_2026_4tY9mQp7VxK2nL8"
};
