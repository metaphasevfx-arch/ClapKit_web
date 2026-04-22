# Crew Survey Storage

The survey page is at `/survey/`.

## Why not GitHub files directly?
A static browser page cannot safely write to your GitHub repository without exposing private credentials. So the site should submit responses to an external endpoint/database.

## Recommended setup: Supabase (anonymous insert-only)

1. Create a Supabase project.
2. Run SQL in Supabase SQL Editor:

```sql
create extension if not exists pgcrypto;

create table if not exists public.department_survey_responses (
  id bigint generated always as identity primary key,
  response_id uuid not null default gen_random_uuid(),
  submitted_at timestamptz not null default now(),
  department text not null,
  custom_department text,
  locale text not null,
  answers jsonb not null,
  source text not null default 'clapkit_site_survey_v1'
);

alter table public.department_survey_responses enable row level security;

drop policy if exists "Allow anonymous insert" on public.department_survey_responses;
create policy "Allow anonymous insert"
  on public.department_survey_responses
  for insert
  to anon
  with check (true);
```

3. Open `survey-config.js` and set:

```js
window.CK_SURVEY_CONFIG = {
  mode: "supabase",
  supabaseUrl: "https://YOUR-PROJECT.supabase.co",
  supabaseAnonKey: "YOUR_PUBLIC_ANON_KEY",
  supabaseTable: "department_survey_responses"
};
```

4. Keep `SELECT` closed for anonymous users (do not add read policy for `anon`).

## Optional: quick aggregation query

```sql
select
  coalesce(nullif(custom_department, ''), department) as department_group,
  count(*) as responses
from public.department_survey_responses
group by 1
order by 2 desc;
```

## Alternative setup: webhook
Set `mode: "webhook"` and `webhookUrl` in `survey-config.js`. The endpoint should accept JSON POST and store payload fields.
