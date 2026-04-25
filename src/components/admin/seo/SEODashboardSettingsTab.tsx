import { AlertCircle, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  robotsTxt: string;
  setRobotsTxt: (v: string) => void;
  isSaving: boolean;
  onSave: () => void;
  onReset: () => void;
}

export const SEODashboardSettingsTab = ({
  robotsTxt,
  setRobotsTxt,
  isSaving,
  onSave,
  onReset,
}: Props) => (
  <Card>
    <CardHeader>
      <CardTitle>Robots.txt</CardTitle>
      <CardDescription>Configure crawler access rules - Changes take effect after deployment</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="robots">Edit robots.txt content:</Label>
        <Textarea
          id="robots"
          value={robotsTxt}
          onChange={(e) => setRobotsTxt(e.target.value)}
          rows={12}
          className="font-mono text-sm"
          disabled={isSaving}
          placeholder="Loading robots.txt..."
        />
      </div>
      <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-amber-200 flex items-start gap-2">
        <AlertCircle className="h-4 w-4 mt-0.5" />
        <span>
          Saved to database. Live robots.txt output depends on deployment wiring — verify production behavior after changes.
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        ⚠️ Changes will be stored in the database and applied to your live site on next deployment. Make sure to include
        proper User-agent directives and your Sitemap URL.
      </p>
      <div className="flex gap-2">
        <Button onClick={onSave} disabled={isSaving} className="flex items-center gap-2">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
        <Button onClick={onReset} variant="outline" disabled={isSaving}>
          Reset to Default
        </Button>
      </div>
    </CardContent>
  </Card>
);
