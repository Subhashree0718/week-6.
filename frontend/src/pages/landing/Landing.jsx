import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { LiveBackdrop } from '../../components/ui/LiveBackdrop';
import { useAuth } from '../../hooks/useAuth';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
  BarChart3,
  LampDesk,
  CheckCircle2,
  PlayCircle,
  TimerReset,
  LineChart,
  Heart,
} from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const pillars = [
    {
      title: 'All-in-one operating cadence',
      description: 'Consolidate goals, rituals, and review loops into a single system of record.',
      icon: LampDesk,
    },
    {
      title: 'Signal-driven leadership insight',
      description: 'Spot blockers early with momentum analytics and automated nudges for each squad.',
      icon: BarChart3,
    },
    {
      title: 'Enterprise-grade governance',
      description: 'Role-aware access, audit trails, and compliance defaults built for scale-ups.',
      icon: ShieldCheck,
    },
  ];

  const highlights = [
    'AI copilots that triage blockers before they escalate',
    'Executive dashboards calibrated for boardroom storytelling',
    'Live context cards that surface ownership and next steps',
    'Precision nudges that keep rituals and updates on cadence',
  ];

  const featureMetrics = [
    {
      label: 'Cycle time acceleration',
      value: '47%',
      description: 'Faster objective throughput after migrating to Aurora workflows.',
    },
    {
      label: 'Update adherence',
      value: '93%',
      description: 'Teams staying within their agreed reporting cadence.',
    },
    {
      label: 'Leadership confidence',
      value: '4.8/5',
      description: 'Executive CSAT on clarity and forecasting accuracy.',
    },
  ];

  const testimonials = [
    {
      quote:
        'Aurora reframed how we run operating reviews. Within two quarters, strategy off-sites became scenario design sessions instead of status rundowns.',
      name: 'Elena Martinez',
      title: 'Chief Strategy Officer, Fluxwave',
    },
    {
      quote:
        'Every squad now knows the ripple effect of their work. The AI nudges keep the hum of continuous alignment alive even across timezones.',
      name: 'Noah Greenwood',
      title: 'Head of Product Ops, Orion Systems',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <LiveBackdrop />

      <div className="relative z-10">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8 sm:px-10">
          <Link to="/" className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow">
              <Sparkles size={26} />
            </div>
            <div>
              <p className="text-2xl font-semibold">Aurora OKRs</p>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Align • Focus • Win</p>
            </div>
          </Link>
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary-300 hover:text-primary-600 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-primary-500"
            >
              Sign in
            </Link>
            <Button asChild size="lg" className="shadow-floating">
              <Link to="/register" className="inline-flex items-center gap-2">
                Try for free
                <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 pb-32 sm:px-10">
          <section className="relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.45em] text-slate-600 shadow-inner backdrop-blur dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200">
                <Sparkles size={16} className="text-primary-500" />
                Aurora Operating System
              </div>
              <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                Operational intelligence for leaders building what&apos;s next.
              </h1>
              <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                Synchronise objectives, rituals, and strategic bets with living dashboards, AI-assisted nudges, and a live backdrop that adapts to the pulse of your business.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button size="lg" className="shadow-glow" asChild>
                  <Link to="/register" className="inline-flex items-center gap-2">
                    Launch Aurora
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/login" className="inline-flex items-center gap-2">
                    Enter workspace
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <button className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-semibold text-primary-600 shadow-inner transition hover:border-primary-300 hover:text-primary-500 dark:border-white/10 dark:bg-slate-900/70 dark:text-primary-300">
                  <PlayCircle size={18} /> Watch 90s demo
                </button>
              </div>

              <div className="grid gap-4 rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-inner backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/70">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-600 shadow-inner dark:bg-primary-500/20 dark:text-primary-200">
                    <Users size={22} />
                  </div>
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.45em] text-slate-500">Trusted by distributed operators</p>
                    <p className="text-xl font-semibold text-slate-900 dark:text-slate-50">2,400+ teams run Aurora to orchestrate focus &amp; flow</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {highlights.map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-slate-600 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300"
                      style={{ animation: 'fadeUp 0.7s ease forwards', animationDelay: `${0.15 * index}s` }}
                    >
                      <CheckCircle2 size={16} className="text-primary-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-[0_36px_120px_rgba(15,23,42,0.18)] backdrop-blur-3xl dark:border-white/10 dark:bg-slate-900/70">
              <div className="pointer-events-none absolute -top-24 right-8 h-40 w-40 rounded-full bg-gradient-to-b from-primary-400/60 via-accent-400/50 to-primary-500/60 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-primary-300/30 blur-3xl dark:bg-primary-500/20" />
              <div className="pointer-events-none absolute inset-0 animate-tilt bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_60%)]" />
              <div className="relative space-y-6">
                <div className="grid gap-4 rounded-2xl border border-white/70 bg-white/90 p-6 shadow-inner dark:border-white/10 dark:bg-slate-900/75">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-500">Executive pulse</p>
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary-500/15 px-3 py-1 text-xs font-semibold text-primary-600 dark:bg-primary-500/20 dark:text-primary-200">
                      <ShieldCheck size={14} /> Healthy
                    </span>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Momentum strength • 86%</h3>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        AI synthesises traction signals from objectives, key results, and rituals to ensure leadership intervenes only when leverage is highest.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/60 bg-white/70 p-4 text-xs uppercase tracking-[0.35em] text-slate-500 shadow-inner dark:border-white/10 dark:bg-slate-900/60">
                      <div className="flex items-center gap-2 text-primary-500">
                        <TimerReset size={16} /> Weekly heartbeat
                      </div>
                      <p className="mt-3 text-[0.85rem] font-semibold text-slate-900 dark:text-slate-100">Forecast confidence • 92%</p>
                      <p className="mt-2 text-[0.7rem] text-slate-500 dark:text-slate-400">Predictive alert raised for Growth OKR due Friday</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {pillars.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-inner transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70"
                        style={{ animation: 'fadeUp 0.7s ease forwards', animationDelay: `${0.2 + index * 0.15}s` }}
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-600 shadow-inner dark:bg-primary-500/20 dark:text-primary-200">
                          {Icon ? <Icon size={20} /> : null}
                        </div>
                        <p className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-50">{item.title}</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="grid gap-4 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-inner sm:grid-cols-[1fr_auto] dark:border-white/10 dark:bg-slate-900/70">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      “Aurora became our single command centre. Within a quarter our squads were shipping faster, risk surfaced earlier, and leadership syncs turned into decisions rather than status.”
                    </p>
                    <div className="mt-4 text-xs uppercase tracking-[0.35em] text-slate-500">
                      Chief of Staff • Nimbus Labs
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-center gap-2 text-right text-xs uppercase tracking-[0.35em] text-primary-500">
                    <span>Series B SaaS</span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary-500/15 px-3 py-1 text-[0.65rem] font-semibold text-primary-600 dark:bg-primary-500/20 dark:text-primary-200">
                      <Heart size={14} /> Customer since 2023
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-28 grid gap-10 rounded-3xl border border-white/70 bg-white/80 p-10 shadow-inner backdrop-blur-2xl lg:grid-cols-[1.15fr_0.85fr] dark:border-white/10 dark:bg-slate-900/70">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.45em] text-slate-500">Precision instrumentation</p>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">Every ritual, insight, and heartbeat in one orchestrated layout.</h2>
              <p className="max-w-2xl text-slate-600 dark:text-slate-300">
                Aurora is the living canvas for your operating rhythm—align OKRs, stand-ups, and business reviews while our AI ensures context never gets lost between functions.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {featureMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-white/60 bg-white/70 p-6 text-center shadow-inner transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70">
                    <p className="text-[0.65rem] uppercase tracking-[0.4em] text-slate-500">{metric.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-primary-600 dark:text-primary-300">{metric.value}</p>
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{metric.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/85 p-8 shadow-[0_28px_90px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-slate-900/70">
              <div className="pointer-events-none absolute -top-20 right-1/4 h-36 w-36 rounded-full bg-gradient-to-r from-primary-400/40 via-accent-400/40 to-primary-500/40 blur-3xl" />
              <div className="relative space-y-5">
                <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/80 px-5 py-3 text-sm text-slate-600 shadow-inner dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
                  <span className="inline-flex items-center gap-2 text-primary-500">
                    <LineChart size={16} /> Operating review playlist
                  </span>
                  <span className="text-xs uppercase tracking-[0.35em] text-slate-500">Live now</span>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-inner dark:border-white/10 dark:bg-slate-900/70">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Assemble the ritual cadence your teams deserve—Aurora adapts to your leadership model, powering weekly scorecards, quarterly business reviews, and the narrative glue that keeps investors confident.
                  </p>
                </div>
                <div className="grid gap-4">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={testimonial.name}
                      className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-inner transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70"
                      style={{ animation: 'fadeUp 0.6s ease forwards', animationDelay: `${0.2 + index * 0.1}s` }}
                    >
                      <p className="text-sm text-slate-600 dark:text-slate-300">“{testimonial.quote}”</p>
                      <div className="mt-4 text-xs uppercase tracking-[0.35em] text-slate-500">
                        {testimonial.name} • {testimonial.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-28 rounded-3xl border border-white/70 bg-white/80 p-10 shadow-inner backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/70">
            <div className="flex flex-col gap-8 text-center">
              <p className="text-xs uppercase tracking-[0.45em] text-slate-500">The Aurora promise</p>
              <h2 className="text-4xl font-semibold text-slate-900 dark:text-slate-50">Bring clarity, conviction, and cadence to your entire operating system.</h2>
              <p className="mx-auto max-w-3xl text-slate-600 dark:text-slate-300">
                Experience a living workspace that blends elevated aesthetics with data-backed execution discipline. Aurora&apos;s live background, ambient motion, and conversational microcopy keep teams engaged while leadership gets a true source of truth.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="shadow-glow" asChild>
                  <Link to="/register" className="inline-flex items-center gap-2">
                    Start your transformation
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login" className="inline-flex items-center gap-2">
                    Continue where you left off
                    <ArrowRight size={18} />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/60 bg-white/75 py-8 text-sm text-slate-500 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-400">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <p>© {new Date().getFullYear()} Aurora Labs. All rights reserved.</p>
            <div className="flex flex-wrap gap-6">
              <Link to="/login" className="transition hover:text-primary-600">
                Customer login
              </Link>
              <Link to="/register" className="transition hover:text-primary-600">
                Start trial
              </Link>
              <a href="mailto:hello@aurora.app" className="transition hover:text-primary-600">
                Contact sales
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
