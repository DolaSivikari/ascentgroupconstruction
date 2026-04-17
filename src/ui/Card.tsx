/**
 * @deprecated This file is a thin compatibility re-export of the canonical Card.
 * For new code, import directly from "@/design-system/components/Card".
 *
 * Kept for backwards compatibility with existing admin and utility components
 * that still reference the old `@/ui/Card` path. All exports below resolve to
 * the single canonical Card system to guarantee one source of truth.
 */
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/design-system/components/Card";
