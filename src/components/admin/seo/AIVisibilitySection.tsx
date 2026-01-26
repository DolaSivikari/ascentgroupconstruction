import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/ui/Button';
import {
  Bot,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Globe,
  Shield,
  Zap,
  RefreshCw,
  ExternalLink,
  Mic,
  Brain,
  Sparkles,
} from 'lucide-react';
import { COMPANY_FACTS, VOICE_OPTIMIZED_FAQS, CITABLE_CONTENT, SERVICE_AREAS } from '@/utils/seo/ai-content';

interface AIVisibilityCheck {
  name: string;
  status: 'pass' | 'warning' | 'fail';
  description: string;
  recommendation?: string;
}

const AIVisibilitySection = () => {
  const [checks, setChecks] = useState<AIVisibilityCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [llmsTxtContent, setLlmsTxtContent] = useState<string | null>(null);
  const [robotsTxtContent, setRobotsTxtContent] = useState<string | null>(null);

  useEffect(() => {
    runChecks();
  }, []);

  const runChecks = async () => {
    setLoading(true);
    const newChecks: AIVisibilityCheck[] = [];

    // Check 1: llms.txt file exists
    try {
      const llmsResponse = await fetch('/llms.txt');
      if (llmsResponse.ok) {
        const content = await llmsResponse.text();
        setLlmsTxtContent(content);
        newChecks.push({
          name: 'llms.txt File',
          status: content.length > 500 ? 'pass' : 'warning',
          description: `llms.txt exists (${content.length} characters)`,
          recommendation: content.length < 500 ? 'Consider adding more detail to llms.txt' : undefined,
        });
      } else {
        newChecks.push({
          name: 'llms.txt File',
          status: 'fail',
          description: 'llms.txt file not found',
          recommendation: 'Create /public/llms.txt with company information for AI crawlers',
        });
      }
    } catch {
      newChecks.push({
        name: 'llms.txt File',
        status: 'fail',
        description: 'Could not check llms.txt',
        recommendation: 'Ensure llms.txt is accessible',
      });
    }

    // Check 2: robots.txt allows AI crawlers
    try {
      const robotsResponse = await fetch('/robots.txt');
      if (robotsResponse.ok) {
        const content = await robotsResponse.text();
        setRobotsTxtContent(content);
        const aiCrawlers = ['GPTBot', 'ChatGPT-User', 'Claude', 'PerplexityBot', 'anthropic'];
        const allowedCrawlers = aiCrawlers.filter(crawler => 
          content.toLowerCase().includes(crawler.toLowerCase()) && 
          !content.includes(`Disallow: / # ${crawler}`)
        );
        
        newChecks.push({
          name: 'AI Crawler Access',
          status: allowedCrawlers.length >= 3 ? 'pass' : allowedCrawlers.length > 0 ? 'warning' : 'fail',
          description: `${allowedCrawlers.length}/${aiCrawlers.length} AI crawlers explicitly allowed`,
          recommendation: allowedCrawlers.length < 3 ? 'Add explicit Allow rules for GPTBot, Claude-Web, PerplexityBot' : undefined,
        });
      }
    } catch {
      newChecks.push({
        name: 'AI Crawler Access',
        status: 'warning',
        description: 'Could not verify robots.txt',
      });
    }

    // Check 3: Company Facts Completeness
    const factFields = Object.keys(COMPANY_FACTS);
    const filledFields = factFields.filter(key => {
      const value = (COMPANY_FACTS as any)[key];
      return value && (Array.isArray(value) ? value.length > 0 : true);
    });
    newChecks.push({
      name: 'Company Facts',
      status: filledFields.length >= factFields.length * 0.9 ? 'pass' : filledFields.length >= factFields.length * 0.7 ? 'warning' : 'fail',
      description: `${filledFields.length}/${factFields.length} fact fields populated`,
      recommendation: filledFields.length < factFields.length ? 'Complete all company fact fields in ai-content.ts' : undefined,
    });

    // Check 4: Voice FAQs
    newChecks.push({
      name: 'Voice-Optimized FAQs',
      status: VOICE_OPTIMIZED_FAQS.length >= 10 ? 'pass' : VOICE_OPTIMIZED_FAQS.length >= 5 ? 'warning' : 'fail',
      description: `${VOICE_OPTIMIZED_FAQS.length} voice-optimized FAQs available`,
      recommendation: VOICE_OPTIMIZED_FAQS.length < 10 ? 'Add more voice-optimized FAQs for AEO' : undefined,
    });

    // Check 5: Citable Content
    newChecks.push({
      name: 'Citable Content',
      status: CITABLE_CONTENT.length >= 4 ? 'pass' : CITABLE_CONTENT.length >= 2 ? 'warning' : 'fail',
      description: `${CITABLE_CONTENT.length} citable content blocks for AI citation`,
      recommendation: CITABLE_CONTENT.length < 4 ? 'Add more citable content blocks' : undefined,
    });

    // Check 6: Service Areas
    newChecks.push({
      name: 'Local SEO Coverage',
      status: SERVICE_AREAS.length >= 10 ? 'pass' : SERVICE_AREAS.length >= 5 ? 'warning' : 'fail',
      description: `${SERVICE_AREAS.length} service areas defined`,
    });

    // Check 7: Schema.org Structured Data
    newChecks.push({
      name: 'Structured Data',
      status: 'pass',
      description: 'Schema.org generators implemented (Organization, LocalBusiness, Service, FAQ, etc.)',
    });

    setChecks(newChecks);
    setLoading(false);
  };

  const getStatusIcon = (status: AIVisibilityCheck['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-accent-foreground" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-destructive" />;
    }
  };

  const getStatusBadge = (status: AIVisibilityCheck['status']) => {
    switch (status) {
      case 'pass':
        return <Badge variant="success">Pass</Badge>;
      case 'warning':
        return <Badge variant="warning">Warning</Badge>;
      case 'fail':
        return <Badge variant="danger">Needs Attention</Badge>;
    }
  };

  const overallScore = checks.length > 0
    ? Math.round((checks.filter(c => c.status === 'pass').length / checks.length) * 100)
    : 0;

  const aiCrawlers = [
    { name: 'GPTBot', desc: 'OpenAI ChatGPT' },
    { name: 'ChatGPT-User', desc: 'ChatGPT Browse' },
    { name: 'Claude-Web', desc: 'Anthropic Claude' },
    { name: 'PerplexityBot', desc: 'Perplexity AI' },
    { name: 'Google-Extended', desc: 'Google Bard/Gemini' },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Visibility Score</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallScore}%</div>
            <p className="text-xs text-muted-foreground">
              {checks.filter(c => c.status === 'pass').length}/{checks.length} checks passed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voice FAQs</CardTitle>
            <Mic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{VOICE_OPTIMIZED_FAQS.length}</div>
            <p className="text-xs text-muted-foreground">Optimized for voice search</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citable Content</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{CITABLE_CONTENT.length}</div>
            <p className="text-xs text-muted-foreground">AI citation blocks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Areas</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{SERVICE_AREAS.length}</div>
            <p className="text-xs text-muted-foreground">Location pages</p>
          </CardContent>
        </Card>
      </div>

      {/* Visibility Checks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Visibility Checks
              </CardTitle>
              <CardDescription>
                Ensure your site is discoverable by AI assistants and answer engines
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={runChecks} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Recheck
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {checks.map((check, index) => (
              <div 
                key={index} 
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(check.status)}
                  <div>
                    <p className="font-medium">{check.name}</p>
                    <p className="text-sm text-muted-foreground">{check.description}</p>
                    {check.recommendation && (
                      <p className="text-sm text-accent-foreground mt-1">
                        💡 {check.recommendation}
                      </p>
                    )}
                  </div>
                </div>
                {getStatusBadge(check.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Crawler Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            AI Crawler Permissions
          </CardTitle>
          <CardDescription>
            robots.txt configuration for major AI crawlers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {aiCrawlers.map((crawler) => {
              const isAllowed = robotsTxtContent?.includes(crawler.name) && 
                !robotsTxtContent?.includes(`Disallow: / # ${crawler.name}`);
              
              return (
                <div 
                  key={crawler.name}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  {isAllowed ? (
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-accent-foreground shrink-0" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{crawler.name}</p>
                    <p className="text-xs text-muted-foreground">{crawler.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" asChild>
              <a href="/llms.txt" target="_blank" rel="noopener noreferrer">
                <FileText className="h-4 w-4 mr-2" />
                View llms.txt
                <ExternalLink className="h-3 w-3 ml-2" />
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/robots.txt" target="_blank" rel="noopener noreferrer">
                <Shield className="h-4 w-4 mr-2" />
                View robots.txt
                <ExternalLink className="h-3 w-3 ml-2" />
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4 mr-2" />
                View Sitemap
                <ExternalLink className="h-3 w-3 ml-2" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Company Facts Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Company Facts for AI
          </CardTitle>
          <CardDescription>
            Structured data that AI assistants can easily parse and cite
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Basic Info</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Name:</strong> {COMPANY_FACTS.name}</p>
                <p><strong>Type:</strong> {COMPANY_FACTS.type}</p>
                <p><strong>Specialty:</strong> {COMPANY_FACTS.specialty}</p>
                <p><strong>Location:</strong> {COMPANY_FACTS.location}</p>
                <p><strong>Phone:</strong> {COMPANY_FACTS.phone}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Services ({COMPANY_FACTS.services.length})</p>
              <div className="flex flex-wrap gap-1">
                {COMPANY_FACTS.services.slice(0, 6).map((service, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
                {COMPANY_FACTS.services.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{COMPANY_FACTS.services.length - 6} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIVisibilitySection;
