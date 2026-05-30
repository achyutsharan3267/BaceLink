create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  avatar_url text,
  role text not null default 'participant' check (role in ('admin', 'participant')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  status text not null default 'draft' check (status in ('draft', 'waiting', 'active', 'paused', 'ended')),
  timer_per_question integer not null default 10,
  active_question_id uuid,
  current_question_index integer not null default 0,
  started_at timestamptz,
  question_started_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question text not null,
  sort_order integer not null default 0,
  timer_seconds integer not null default 10,
  created_at timestamptz not null default now()
);

alter table public.quizzes
drop constraint if exists quizzes_active_question_id_fkey;

alter table public.quizzes
add constraint quizzes_active_question_id_fkey
foreign key (active_question_id) references public.questions(id) on delete set null;

create table if not exists public.options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  option_text text not null,
  is_correct boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_participants (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'joined' check (status in ('joined', 'active', 'completed')),
  joined_at timestamptz not null default now(),
  unique (quiz_id, user_id)
);

create table if not exists public.competition_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  selected_option_id uuid not null references public.options(id) on delete cascade,
  is_correct boolean not null default false,
  time_taken_ms integer not null default 0,
  points integer not null default 0,
  created_at timestamptz not null default now(),
  unique (quiz_id, question_id, user_id)
);

create table if not exists public.leaderboard (
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null default 0,
  correct_count integer not null default 0,
  wrong_count integer not null default 0,
  attempted_count integer not null default 0,
  total_time_ms integer not null default 0,
  rank integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (quiz_id, user_id)
);

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_updated_at on public.users;
create trigger users_updated_at before update on public.users
for each row execute function public.touch_updated_at();

drop trigger if exists quizzes_updated_at on public.quizzes;
create trigger quizzes_updated_at before update on public.quizzes
for each row execute function public.touch_updated_at();

create or replace function public.refresh_quiz_leaderboard(target_quiz_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.leaderboard (
    quiz_id,
    user_id,
    score,
    correct_count,
    wrong_count,
    attempted_count,
    total_time_ms,
    rank,
    updated_at
  )
  select
    target_quiz_id,
    qp.user_id,
    coalesce(sum(qa.points), 0)::integer as score,
    coalesce(count(*) filter (where qa.is_correct), 0)::integer as correct_count,
    coalesce(count(*) filter (where not qa.is_correct), 0)::integer as wrong_count,
    coalesce(count(qa.id), 0)::integer as attempted_count,
    coalesce(sum(qa.time_taken_ms), 0)::integer as total_time_ms,
    dense_rank() over (
      order by coalesce(sum(qa.points), 0) desc, coalesce(sum(qa.time_taken_ms), 0) asc
    )::integer as rank,
    now()
  from public.quiz_participants qp
  left join public.competition_attempts qa
    on qa.quiz_id = qp.quiz_id and qa.user_id = qp.user_id
  where qp.quiz_id = target_quiz_id
  group by qp.user_id
  on conflict (quiz_id, user_id)
  do update set
    score = excluded.score,
    correct_count = excluded.correct_count,
    wrong_count = excluded.wrong_count,
    attempted_count = excluded.attempted_count,
    total_time_ms = excluded.total_time_ms,
    rank = excluded.rank,
    updated_at = now();
end;
$$;

create or replace function public.submit_quiz_answer(
  target_quiz_id uuid,
  target_question_id uuid,
  target_option_id uuid
)
returns public.competition_attempts
language plpgsql
security definer
set search_path = public
as $$
declare
  quiz_row public.quizzes;
  question_row public.questions;
  option_row public.options;
  elapsed_ms integer;
  base_points integer;
  bonus_points integer;
  inserted_attempt public.competition_attempts;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select * into quiz_row from public.quizzes where id = target_quiz_id;
  if quiz_row.id is null or quiz_row.status <> 'active' then
    raise exception 'Quiz is not active';
  end if;

  if quiz_row.active_question_id is distinct from target_question_id then
    raise exception 'This question is not active';
  end if;

  if not exists (
    select 1 from public.quiz_participants
    where quiz_id = target_quiz_id and user_id = auth.uid()
  ) then
    raise exception 'Join quiz before submitting';
  end if;

  select * into question_row from public.questions where id = target_question_id;
  select * into option_row from public.options
  where id = target_option_id and question_id = target_question_id;

  if option_row.id is null then
    raise exception 'Invalid option';
  end if;

  elapsed_ms = greatest(
    0,
    floor(extract(epoch from (now() - coalesce(quiz_row.question_started_at, now()))) * 1000)::integer
  );

  base_points = case when option_row.is_correct then 10 else 0 end;
  bonus_points = 0;

  if option_row.is_correct then
    select case
      when count(*) = 0 then 2
      when count(*) = 1 then 1
      else 0
    end into bonus_points
    from public.competition_attempts
    where quiz_id = target_quiz_id
      and question_id = target_question_id
      and is_correct = true;
  end if;

  insert into public.competition_attempts (
    quiz_id,
    question_id,
    user_id,
    selected_option_id,
    is_correct,
    time_taken_ms,
    points
  )
  values (
    target_quiz_id,
    target_question_id,
    auth.uid(),
    target_option_id,
    option_row.is_correct,
    elapsed_ms,
    base_points + bonus_points
  )
  on conflict (quiz_id, question_id, user_id)
  do update set selected_option_id = public.competition_attempts.selected_option_id
  returning * into inserted_attempt;

  perform public.refresh_quiz_leaderboard(target_quiz_id);
  return inserted_attempt;
end;
$$;

alter table public.users enable row level security;
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.options enable row level security;
alter table public.quiz_participants enable row level security;
alter table public.competition_attempts enable row level security;
alter table public.leaderboard enable row level security;

drop policy if exists "Users can read profiles" on public.users;
create policy "Users can read profiles" on public.users for select using (true);

drop policy if exists "Users can upsert own profile" on public.users;
create policy "Users can upsert own profile" on public.users
for all using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "Everyone can read quizzes" on public.quizzes;
create policy "Everyone can read quizzes" on public.quizzes for select using (true);

drop policy if exists "Admins manage quizzes" on public.quizzes;
create policy "Admins manage quizzes" on public.quizzes
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Everyone can read questions" on public.questions;
create policy "Everyone can read questions" on public.questions for select using (true);

drop policy if exists "Admins manage questions" on public.questions;
create policy "Admins manage questions" on public.questions
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Everyone can read options" on public.options;
create policy "Everyone can read options" on public.options for select using (true);

drop policy if exists "Admins manage options" on public.options;
create policy "Admins manage options" on public.options
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Participants can join and read own participant row" on public.quiz_participants;
create policy "Participants can join and read own participant row" on public.quiz_participants
for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "Participants read own attempts" on public.competition_attempts;
create policy "Participants read own attempts" on public.competition_attempts
for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Participants insert own attempts" on public.competition_attempts;
create policy "Participants insert own attempts" on public.competition_attempts
for insert with check (user_id = auth.uid());

drop policy if exists "Leaderboard is public readable" on public.leaderboard;
create policy "Leaderboard is public readable" on public.leaderboard for select using (true);

drop policy if exists "Admins manage leaderboard" on public.leaderboard;
create policy "Admins manage leaderboard" on public.leaderboard
for all using (public.is_admin()) with check (public.is_admin());

do $$
begin
  alter publication supabase_realtime add table public.quizzes;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.competition_attempts;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.leaderboard;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.quiz_participants;
exception when duplicate_object then null;
end $$;
