import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Globe, 
  Database, 
  FileText, 
  Link2,
  Settings,
  Play
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface TestResult {
  id: string;
  name: string;
  category: 'pages' | 'database' | 'documents' | 'settings' | 'links';
  status: 'pass' | 'fail' | 'warning' | 'pending' | 'running';
  message: string;
  duration?: number;
}

interface TestDefinition {
  id: string;
  name: string;
  category: 'pages' | 'database' | 'documents' | 'settings' | 'links';
  run: () => Promise<{ status: 'pass' | 'fail' | 'warning'; message: string }>;
}

const Testing = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  // Define all tests
  const tests: TestDefinition[] = [
    // Database Tests
    {
      id: 'db-site-settings',
      name: 'Site Settings Table',
      category: 'database',
      run: async () => {
        const { data, error } = await supabase.from('site_settings').select('id').eq('is_active', true);
        if (error) return { status: 'fail', message: error.message };
        return data?.length ? { status: 'pass', message: 'Active settings found' } : { status: 'warning', message: 'No active settings' };
      }
    },
    {
      id: 'db-footer-settings',
      name: 'Footer Settings Table',
      category: 'database',
      run: async () => {
        const { data, error } = await supabase.from('footer_settings').select('id').eq('is_active', true);
        if (error) return { status: 'fail', message: error.message };
        return data?.length ? { status: 'pass', message: 'Active settings found' } : { status: 'warning', message: 'No active settings' };
      }
    },
    {
      id: 'db-contact-settings',
      name: 'Contact Page Settings',
      category: 'database',
      run: async () => {
        const { data, error } = await supabase.from('contact_page_settings').select('id').eq('is_active', true);
        if (error) return { status: 'fail', message: error.message };
        return data?.length ? { status: 'pass', message: 'Active settings found' } : { status: 'warning', message: 'No active settings' };
      }
    },
    {
      id: 'db-services',
      name: 'Services Table',
      category: 'database',
      run: async () => {
        const { count, error } = await supabase.from('services').select('*', { count: 'exact', head: true });
        if (error) return { status: 'fail', message: error.message };
        return count && count > 0 ? { status: 'pass', message: `${count} services found` } : { status: 'warning', message: 'No services found' };
      }
    },
    {
      id: 'db-projects',
      name: 'Projects Table',
      category: 'database',
      run: async () => {
        const { count, error } = await supabase.from('projects').select('*', { count: 'exact', head: true });
        if (error) return { status: 'fail', message: error.message };
        return count && count > 0 ? { status: 'pass', message: `${count} projects found` } : { status: 'warning', message: 'No projects found' };
      }
    },
    {
      id: 'db-hero-slides',
      name: 'Hero Slides Table',
      category: 'database',
      run: async () => {
        const { count, error } = await supabase.from('hero_slides').select('*', { count: 'exact', head: true }).eq('is_active', true);
        if (error) return { status: 'fail', message: error.message };
        return count && count > 0 ? { status: 'pass', message: `${count} active slides` } : { status: 'warning', message: 'No active hero slides' };
      }
    },
    {
      id: 'db-navigation',
      name: 'Navigation Menu Items',
      category: 'database',
      run: async () => {
        const { count, error } = await supabase.from('navigation_menu_items').select('*', { count: 'exact', head: true }).eq('is_active', true);
        if (error) return { status: 'fail', message: error.message };
        return count && count > 0 ? { status: 'pass', message: `${count} menu items` } : { status: 'warning', message: 'No navigation items' };
      }
    },
    // Documents Tests
    {
      id: 'docs-library',
      name: 'Documents Library',
      category: 'documents',
      run: async () => {
        const { count, error } = await supabase.from('documents_library').select('*', { count: 'exact', head: true }).eq('is_active', true);
        if (error) return { status: 'fail', message: error.message };
        return count && count > 0 ? { status: 'pass', message: `${count} active documents` } : { status: 'warning', message: 'No documents uploaded' };
      }
    },
    {
      id: 'docs-vendor',
      name: 'Vendor Package Document',
      category: 'documents',
      run: async () => {
        const { data, error } = await supabase.from('documents_library').select('*').eq('category', 'vendor').eq('is_active', true).limit(1);
        if (error) return { status: 'fail', message: error.message };
        return data?.length ? { status: 'pass', message: 'Vendor package available' } : { status: 'warning', message: 'No vendor package uploaded' };
      }
    },
    // Settings Tests
    {
      id: 'settings-phone',
      name: 'Phone Number Configured',
      category: 'settings',
      run: async () => {
        const { data, error } = await supabase.from('site_settings').select('phone').eq('is_active', true).single();
        if (error) return { status: 'fail', message: error.message };
        return data?.phone ? { status: 'pass', message: data.phone } : { status: 'warning', message: 'Phone not configured' };
      }
    },
    {
      id: 'settings-email',
      name: 'Email Address Configured',
      category: 'settings',
      run: async () => {
        const { data, error } = await supabase.from('site_settings').select('email').eq('is_active', true).single();
        if (error) return { status: 'fail', message: error.message };
        return data?.email ? { status: 'pass', message: data.email } : { status: 'warning', message: 'Email not configured' };
      }
    },
    {
      id: 'settings-address',
      name: 'Business Address Configured',
      category: 'settings',
      run: async () => {
        const { data, error } = await supabase.from('site_settings').select('address').eq('is_active', true).single();
        if (error) return { status: 'fail', message: error.message };
        return data?.address ? { status: 'pass', message: 'Address set' } : { status: 'warning', message: 'Address not configured' };
      }
    },
    {
      id: 'settings-meta',
      name: 'Default SEO Meta Tags',
      category: 'settings',
      run: async () => {
        const { data, error } = await supabase.from('site_settings').select('meta_title, meta_description').eq('is_active', true).single();
        if (error) return { status: 'fail', message: error.message };
        const hasTitle = data?.meta_title && data.meta_title.length > 0;
        const hasDesc = data?.meta_description && data.meta_description.length > 0;
        if (hasTitle && hasDesc) return { status: 'pass', message: 'SEO configured' };
        if (hasTitle || hasDesc) return { status: 'warning', message: 'Partial SEO config' };
        return { status: 'warning', message: 'SEO not configured' };
      }
    },
    // Links Tests
    {
      id: 'links-social',
      name: 'Social Media Links',
      category: 'links',
      run: async () => {
        const { data, error } = await supabase.from('site_settings').select('social_links').eq('is_active', true).single();
        if (error) return { status: 'fail', message: error.message };
        const links = data?.social_links as Record<string, string> | null;
        if (!links) return { status: 'warning', message: 'No social links' };
        const count = Object.values(links).filter(v => v && v.length > 0).length;
        return count > 0 ? { status: 'pass', message: `${count} social links configured` } : { status: 'warning', message: 'No social links set' };
      }
    },
    {
      id: 'links-admin-users',
      name: 'Admin Users Configured',
      category: 'links',
      run: async () => {
        const { count, error } = await supabase.from('user_roles').select('*', { count: 'exact', head: true }).in('role', ['admin', 'super_admin']);
        if (error) return { status: 'fail', message: error.message };
        return count && count > 0 ? { status: 'pass', message: `${count} admin users` } : { status: 'warning', message: 'No admin users' };
      }
    },
    // Storage Test
    {
      id: 'storage-bucket',
      name: 'Storage Bucket Access',
      category: 'database',
      run: async () => {
        try {
          const { data, error } = await supabase.storage.from('project-images').list('', { limit: 1 });
          if (error) return { status: 'fail', message: error.message };
          return { status: 'pass', message: 'Storage accessible' };
        } catch (e) {
          return { status: 'fail', message: 'Storage not accessible' };
        }
      }
    },
  ];

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);

    const newResults: TestResult[] = [];

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      
      // Show as running
      setResults([...newResults, { 
        id: test.id, 
        name: test.name, 
        category: test.category, 
        status: 'running', 
        message: 'Running...' 
      }]);

      const startTime = performance.now();
      try {
        const result = await test.run();
        const duration = Math.round(performance.now() - startTime);
        newResults.push({
          id: test.id,
          name: test.name,
          category: test.category,
          status: result.status,
          message: result.message,
          duration,
        });
      } catch (error: any) {
        const duration = Math.round(performance.now() - startTime);
        newResults.push({
          id: test.id,
          name: test.name,
          category: test.category,
          status: 'fail',
          message: error.message || 'Unknown error',
          duration,
        });
      }

      setResults([...newResults]);
      setProgress(((i + 1) / tests.length) * 100);
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'fail': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running': return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      default: return <div className="h-5 w-5 rounded-full bg-muted" />;
    }
  };

  const getCategoryIcon = (category: TestResult['category']) => {
    switch (category) {
      case 'database': return <Database className="h-4 w-4" />;
      case 'documents': return <FileText className="h-4 w-4" />;
      case 'settings': return <Settings className="h-4 w-4" />;
      case 'links': return <Link2 className="h-4 w-4" />;
      case 'pages': return <Globe className="h-4 w-4" />;
    }
  };

  const stats = {
    total: results.length,
    pass: results.filter(r => r.status === 'pass').length,
    fail: results.filter(r => r.status === 'fail').length,
    warning: results.filter(r => r.status === 'warning').length,
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) acc[result.category] = [];
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, TestResult[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="business-page-title">Testing Dashboard</h1>
          <p className="text-muted-foreground">
            Automated tests for database, documents, and settings
          </p>
        </div>
        <Button onClick={runAllTests} disabled={isRunning} size="lg" className="gap-2">
          {isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run All Tests
            </>
          )}
        </Button>
      </div>

      {/* Progress */}
      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Running tests...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      {results.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Tests</div>
            </CardContent>
          </Card>
          <Card className="border-green-500/30">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-500">{stats.pass}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </CardContent>
          </Card>
          <Card className="border-yellow-500/30">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-yellow-500">{stats.warning}</div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </CardContent>
          </Card>
          <Card className="border-red-500/30">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-red-500">{stats.fail}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results by Category */}
      {Object.entries(groupedResults).map(([category, categoryResults]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 capitalize">
              {getCategoryIcon(category as TestResult['category'])}
              {category} Tests
            </CardTitle>
            <CardDescription>
              {categoryResults.filter(r => r.status === 'pass').length}/{categoryResults.length} passed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categoryResults.map((result) => (
                <div
                  key={result.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    result.status === 'fail' && "border-red-500/30 bg-red-500/5",
                    result.status === 'warning' && "border-yellow-500/30 bg-yellow-500/5",
                    result.status === 'pass' && "border-green-500/30 bg-green-500/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <div className="font-medium">{result.name}</div>
                      <div className="text-sm text-muted-foreground">{result.message}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.duration !== undefined && (
                      <span className="text-xs text-muted-foreground">{result.duration}ms</span>
                    )}
                    <Badge variant={
                      result.status === 'pass' ? 'default' :
                      result.status === 'warning' ? 'secondary' :
                      result.status === 'fail' ? 'destructive' : 'outline'
                    }>
                      {result.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Empty State */}
      {results.length === 0 && !isRunning && (
        <Card>
          <CardContent className="py-16 text-center">
            <Play className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Tests Run Yet</h3>
            <p className="text-muted-foreground mb-4">
              Click "Run All Tests" to verify your website configuration
            </p>
            <Button onClick={runAllTests}>Run All Tests</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Testing;
