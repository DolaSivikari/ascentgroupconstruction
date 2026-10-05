import { Component, type ErrorInfo, type ReactNode } from "react";
import { logError } from "@/utils/errorLogger";

/** A failed deferred feature must not replace the rest of the page. */
export class DeferredBoundary extends Component<
  { children: ReactNode; name: string; optional?: boolean },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    void logError(error, {
      feature: this.props.name,
      componentStack: info.componentStack,
    });
  }

  render() {
    if (!this.state.failed) return this.props.children;
    if (this.props.optional) return null;
    return (
      <div role="status" className="mx-auto max-w-3xl px-6 py-10 text-center">
        <p>{this.props.name} could not load.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Save any form details, then refresh this page to try again.
        </p>
      </div>
    );
  }
}
