/**
 * Skip Link Component for Accessibility
 * Allows keyboard users to skip navigation and jump to main content
 */
const SkipLink = () => {
  return (
    <a
      href="#main-content"
      onClick={(event) => {
        const target =
          document.getElementById("main-content") ||
          document.querySelector("main") ||
          document.querySelector("h1");
        if (!target) return;
        event.preventDefault();
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        target.scrollIntoView({ behavior: "auto", block: "start" });
      }}
      className="fixed top-0 left-0 -translate-y-full focus:translate-y-0 z-[100] bg-primary text-primary-foreground px-6 py-3 font-semibold transition-transform focus:outline-none focus:ring-4 focus:ring-primary/50"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;
