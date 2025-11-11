export const LiveBackdrop = () => {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute top-[-180px] left-[-120px] h-[360px] w-[360px] rounded-full bg-gradient-brand opacity-40 dark:opacity-15 blur-3xl animate-blob" />
      <div className="absolute bottom-[-200px] right-[-140px] h-[380px] w-[380px] rounded-full bg-gradient-sunrise opacity-30 dark:opacity-10 blur-3xl animate-blob-delayed" />
      <div className="absolute top-1/3 left-1/2 h-[240px] w-[240px] -translate-x-1/2 rounded-full bg-accent-400/30 dark:bg-accent-600/20 blur-3xl animate-float-delayed" />
    </div>
  );
};
