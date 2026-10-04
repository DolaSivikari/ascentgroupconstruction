import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  selectedContent: string;
  setSelectedContent: (v: string) => void;
  generatingKeywords: boolean;
  onGenerateKeywords: () => void;
}

export const SEODashboardContentTab = ({
  selectedContent,
  setSelectedContent,
  generatingKeywords,
  onGenerateKeywords,
}: Props) => (
  <>
    <Card>
      <CardHeader>
        <CardTitle>Keyword Suggestions</CardTitle>
        <CardDescription>Generate SEO keywords using AI analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="content">Content to Analyze</Label>
          <Textarea
            id="content"
            value={selectedContent}
            onChange={(e) => setSelectedContent(e.target.value)}
            placeholder="Paste your content here to generate keyword suggestions..."
            rows={6}
          />
        </div>
        <Button onClick={onGenerateKeywords} disabled={generatingKeywords}>
          {generatingKeywords ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Generate Keywords'
          )}
        </Button>
      </CardContent>
    </Card>

  </>
);
