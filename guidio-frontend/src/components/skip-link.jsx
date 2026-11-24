/** Lets keyboard users jump past the navigation to the main content. */
export function SkipLink({ targetId = "main-content" }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:tracking-[-0.01em] focus:text-background focus:shadow-[0_12px_32px_-12px] focus:shadow-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/60 focus:ring-offset-2"
    >
      Skip to content
    </a>
  );
}