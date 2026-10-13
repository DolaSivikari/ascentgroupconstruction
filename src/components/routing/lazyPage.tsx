import {
  Component,
  lazy,
  Suspense,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { logError } from "@/utils/errorLogger";

class PageLoadBoundary extends Component<
  {
    children: ReactNode;
    name: string;
    retry: () => void;
  },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    void logError(error, { feature: `Page: ${this.props.name}` });
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-semibold">
          {this.props.name} could not load
        </h1>
        <p role="alert">Check your connection and try again.</p>
        <button
          className="underline focus-visible:outline"
          onClick={this.props.retry}
        >
          Try again
        </button>
        <p className="text-sm">
          If the site was updated, save any open form details before reloading.
        </p>
        <button
          className="underline focus-visible:outline"
          onClick={() => window.location.reload()}
        >
          Reload page
        </button>
      </main>
    );
  }
}

/** Retry creates a fresh lazy request; a rejected import is never cached as success. */
export function lazyPage(
  importer: () => Promise<{ default: ComponentType }>,
  name: string,
) {
  const initialPage = lazy(importer);
  return function RecoverablePage() {
    const [attempt, setAttempt] = useState(() => ({
      number: 0,
      Page: initialPage,
    }));
    const Page = attempt.Page;
    return (
      <PageLoadBoundary
        key={attempt.number}
        name={name}
        retry={() => {
          const nextPage = lazy(importer);
          setAttempt({ number: attempt.number + 1, Page: nextPage });
        }}
      >
        <Suspense
          fallback={
            <p role="status" className="p-6">
              Loading page…
            </p>
          }
        >
          <Page />
        </Suspense>
      </PageLoadBoundary>
    );
  };
}
