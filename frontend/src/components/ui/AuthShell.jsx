import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const AuthShell = ({
  badge = 'Aurora OKRs',
  heading,
  subheading,
  highlight,
  bullets = [],
  stats = [],
  footer,
  topAction,
  children,
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full bg-primary-300/40 blur-3xl animate-blob dark:bg-primary-500/20" />
        <div className="absolute top-1/3 -right-32 h-[460px] w-[460px] rounded-full bg-accent-300/40 blur-3xl animate-blob-delayed dark:bg-accent-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.12),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.22),transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-12 sm:px-10">
        <div className="mb-12 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow">
              <Sparkles size={24} />
            </div>
            <div>
              <p className="text-xl font-semibold">Aurora OKRs</p>
              <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Align • Focus • Win</p>
            </div>
          </Link>

          {topAction ? (
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              {topAction}
            </div>
          ) : null}
        </div>

        <div className="grid w-full flex-1 grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="hidden lg:flex flex-col justify-between overflow-hidden rounded-[28px] border border-white/60 bg-white/75 p-10 shadow-[0_28px_80px_rgba(15,23,42,0.20)] backdrop-blur-3xl dark:border-white/10 dark:bg-slate-900/60">
            <div>
              {badge && (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-gray-600 shadow-sm dark:bg-slate-800/70 dark:text-gray-300">
                  <Sparkles size={16} className="text-primary-500" />
                  {badge}
                </span>
              )}

              {highlight && (
                <p className="mt-6 text-sm font-medium text-primary-600 dark:text-primary-300">
                  {highlight}
                </p>
              )}

              {heading && (
                <h1 className="mt-5 text-4xl font-semibold leading-tight text-slate-900 dark:text-slate-50">
                  {heading}
                </h1>
              )}

              {subheading && (
                <p className="mt-4 max-w-md text-lg text-slate-700 dark:text-slate-300">
                  {subheading}
                </p>
              )}
            </div>

            {bullets.length > 0 && (
              <div className="mt-12 space-y-6">
                {bullets.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-inner dark:border-white/10 dark:bg-slate-900/70">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-600 shadow-inner dark:bg-primary-500/20 dark:text-primary-200">
                        {Icon ? <Icon size={22} /> : null}
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {stats.length > 0 && (
              <div className="mt-12 grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-inner dark:border-white/10 dark:bg-slate-900/70"
                  >
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-50">
                      {stat.value}
                    </p>
                    {stat.caption && (
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        {stat.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/85 p-10 shadow-[0_36px_100px_rgba(15,23,42,0.18)] backdrop-blur-3xl dark:border-white/10 dark:bg-slate-900/70">
            <div className="pointer-events-none absolute -top-16 right-8 hidden h-28 w-28 rounded-full bg-gradient-to-br from-primary-400/70 via-accent-400/60 to-primary-500/70 blur-2xl lg:block" />
            <div className="pointer-events-none absolute -bottom-24 left-1/2 hidden h-40 w-40 -translate-x-1/2 rounded-full bg-primary-300/30 blur-3xl dark:bg-primary-500/20 lg:block" />
            <div className="relative">
              {children}
            </div>
            {footer && (
              <div className="mt-8 border-t border-white/70 pt-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
