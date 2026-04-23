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
  webhookUrl: "",

  // For Google Apps Script from browser (Safari/iPhone) use no-cors mode.
  webhookNoCors: true,

  // Optional shared token. Will be sent as query param ?token=...
  // Use a long random string and validate it in Apps Script.
  webhookToken: ""
};
