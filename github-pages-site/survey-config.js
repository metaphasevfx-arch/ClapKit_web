// ClapKit survey storage configuration.
// This file is loaded on the public site, so do not place private secrets here.
window.CK_SURVEY_CONFIG = {
  // local | supabase | webhook
  mode: "webhook",

  // Supabase mode example:
  // supabaseUrl: "https://YOUR-PROJECT.supabase.co",
  // supabaseAnonKey: "YOUR_PUBLIC_ANON_KEY",
  // supabaseTable: "department_survey_responses",

  // Webhook endpoint that stores responses on server.
  webhookUrl: "https://clapkit.pro/api/survey"
};
