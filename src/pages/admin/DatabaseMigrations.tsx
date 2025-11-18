import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/ui/Button';
import { toast } from 'sonner';
import { Database, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { migrateNavigationData } from '@/utils/migrateNavigationData';
import { migrateHomepageSettings, migrateHeroSlides } from '@/utils/migrateHomepageData';
import { migrateAboutPageSettings } from '@/utils/migrateAboutPageData';

const DatabaseMigrations = () => {
  const [migrations, setMigrations] = useState({
    navigation: { loading: false, completed: false },
    homepage: { loading: false, completed: false },
    heroSlides: { loading: false, completed: false },
    aboutPage: { loading: false, completed: false },
  });

  const handleMigration = async (
    type: keyof typeof migrations,
    migrationFn: () => Promise<any>,
    confirmMessage: string
  ) => {
    if (!confirm(confirmMessage)) return;

    setMigrations(prev => ({
      ...prev,
      [type]: { ...prev[type], loading: true }
    }));

    try {
      const result = await migrationFn();
      
      if (result.success) {
        toast.success(result.message || 'Migration completed successfully!');
        setMigrations(prev => ({
          ...prev,
          [type]: { loading: false, completed: true }
        }));
      } else {
        toast.error(result.error || 'Migration failed');
        setMigrations(prev => ({
          ...prev,
          [type]: { loading: false, completed: false }
        }));
      }
    } catch (error: any) {
      console.error('Migration error:', error);
      toast.error(error.message || 'Migration failed');
      setMigrations(prev => ({
        ...prev,
        [type]: { loading: false, completed: false }
      }));
    }
  };

  const migrationCards = [
    {
      key: 'navigation' as const,
      title: 'Navigation Structure',
      description: 'Import ~35 navigation menu items from hardcoded structure',
      impact: 'Enables database-driven navigation management',
      icon: Database,
      migrationFn: migrateNavigationData,
      confirmMessage: 'Import navigation structure? This will add ~35 menu items to the database.'
    },
    {
      key: 'homepage' as const,
      title: 'Homepage Settings',
      description: 'Create homepage configuration with hero text and CTAs',
      impact: 'Enables homepage hero text editing via admin panel',
      icon: Database,
      migrationFn: migrateHomepageSettings,
      confirmMessage: 'Create homepage settings record?'
    },
    {
      key: 'heroSlides' as const,
      title: 'Hero Slides',
      description: 'Create initial hero slide with default content',
      impact: 'Enables hero slide carousel management',
      icon: Database,
      migrationFn: migrateHeroSlides,
      confirmMessage: 'Create initial hero slide?'
    },
    {
      key: 'aboutPage' as const,
      title: 'About Page Settings',
      description: 'Create about page configuration with company story and values',
      impact: 'Enables about page content editing via admin panel',
      icon: Database,
      migrationFn: migrateAboutPageSettings,
      confirmMessage: 'Create about page settings with default content?'
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Database Migrations</h1>
        <p className="text-muted-foreground">
          Initialize database tables with default content to enable admin panel editing
        </p>
      </div>

      <div className="grid gap-6">
        {migrationCards.map(({ key, title, description, impact, icon: Icon, migrationFn, confirmMessage }) => {
          const state = migrations[key];
          
          return (
            <Card key={key} className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    {state.completed && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-primary mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <span>{impact}</span>
                  </div>
                  
                  <Button
                    onClick={() => handleMigration(key, migrationFn, confirmMessage)}
                    disabled={state.loading || state.completed}
                    variant={state.completed ? "outline" : "default"}
                  >
                    {state.loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Migrating...
                      </>
                    ) : state.completed ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Run Migration
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 mt-6 border-amber-500/20 bg-amber-500/5">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-amber-600 mt-1" />
          <div>
            <h3 className="font-semibold mb-2">Important Notes</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Migrations can only be run once - existing records will prevent re-migration</li>
              <li>• Your website will continue working with hardcoded fallbacks until migrations are run</li>
              <li>• After migration, edit content through the respective admin panel sections</li>
              <li>• To re-run a migration, manually delete records from the database first</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DatabaseMigrations;
