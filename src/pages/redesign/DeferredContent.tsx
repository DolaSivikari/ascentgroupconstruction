import { useEffect, useRef, useState, type ReactNode } from "react";

/** Keep below-fold interactive code out of the initial page render. */
export function DeferredContent({
  children,
  eager = false,
}: {
  children: ReactNode;
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(eager);
  useEffect(() => {
    if (eager) {
      setVisible(true);
      return;
    }
    if (!ref.current || !window.IntersectionObserver) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [eager]);
  return (
    <div ref={ref} className="min-h-32">
      {visible ? (
        children
      ) : (
        <p className="p-6 text-muted-foreground" role="status">
          Interactive section loads as you approach.
        </p>
      )}
    </div>
  );
}
