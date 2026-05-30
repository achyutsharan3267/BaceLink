create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  options jsonb not null default '[]'::jsonb,
  correct_index integer not null default 0,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  participant_name text not null,
  score integer not null,
  total integer not null,
  wrong integer not null,
  percentage numeric not null,
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;

drop policy if exists "Public can read enabled quiz questions" on public.quiz_questions;
create policy "Public can read enabled quiz questions"
on public.quiz_questions
for select
using (enabled = true);

drop policy if exists "Public can manage quiz questions" on public.quiz_questions;
create policy "Public can manage quiz questions"
on public.quiz_questions
for all
using (true)
with check (true);

drop policy if exists "Public can insert quiz attempts" on public.quiz_attempts;
create policy "Public can insert quiz attempts"
on public.quiz_attempts
for insert
with check (true);

drop policy if exists "Public can read quiz leaderboard" on public.quiz_attempts;
create policy "Public can read quiz leaderboard"
on public.quiz_attempts
for select
using (true);

create or replace function public.set_quiz_question_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists quiz_questions_updated_at on public.quiz_questions;
create trigger quiz_questions_updated_at
before update on public.quiz_questions
for each row
execute function public.set_quiz_question_updated_at();

