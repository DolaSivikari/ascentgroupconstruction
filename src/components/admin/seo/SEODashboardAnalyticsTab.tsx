import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  Eye,
  Link as LinkIcon,
  Loader2,
  MousePointerClick,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type {
  DailyMetrics,
  PageMetrics,
  QueryMetrics,
  SearchConsoleData,
} from '@/pages/admin/seo/types';

interface Metrics {
  totalClicks: number;
  totalImpressions: number;
  avgCTR: number;
  avgPosition: number;
  previousClicks: number;
  previousImpressions: number;
}

interface Props {
  isConnected: boolean;
  checkingConnection: boolean;
  lastSyncTime: string | null;
  siteUrl: string;
  setSiteUrl: (v: string) => void;
  dateRange: '7' | '30' | '90';
  setDateRange: (v: '7' | '30' | '90') => void;
  fetchingData: boolean;
  searchConsoleData: SearchConsoleData[];
  metrics: Metrics;
  dailyMetrics: DailyMetrics[];
  topPages: PageMetrics[];
  topQueries: QueryMetrics[];
  clicksChange: number;
  impressionsChange: number;
  onConnect: () => void;
  onFetch: () => void;
}

export const SEODashboardAnalyticsTab = ({
  isConnected,
  checkingConnection,
  lastSyncTime,
  siteUrl,
  setSiteUrl,
  dateRange,
  setDateRange,
  fetchingData,
  searchConsoleData,
  metrics,
  dailyMetrics,
  topPages,
  topQueries,
  clicksChange,
  impressionsChange,
  onConnect,
  onFetch,
}: Props) => (
  <>
    <Card className={isConnected ? 'border-success/50' : 'border-warning/50'}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Google Search Console
              {checkingConnection ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isConnected ? (
                <Badge variant="success">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Not Connected
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-2">
              {isConnected ? (
                <div className="flex items-center gap-2">
                  <span>Your account is connected and ready to fetch analytics</span>
                  {lastSyncTime && <span className="text-xs">• Last synced: {lastSyncTime}</span>}
                </div>
              ) : (
                'Connect your Google Search Console account to view search analytics and performance data'
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm mb-3">Connect your Google Search Console to access:</p>
              <ul className="text-sm space-y-1 ml-4 list-disc text-muted-foreground">
                <li>Search performance data and click metrics</li>
                <li>Top-performing pages and queries</li>
                <li>Average position and CTR tracking</li>
                <li>Historical trend analysis</li>
              </ul>
            </div>
            <Button onClick={onConnect} size="lg" className="w-full sm:w-auto">
              <LinkIcon className="h-4 w-4 mr-2" />
              Connect Google Search Console
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="siteUrl">Website URL or Domain</Label>
                <Input
                  id="siteUrl"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="ascentgroupconstruction.com or https://example.com/"
                  className="max-w-md"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter your domain (e.g., ascentgroupconstruction.com) or full URL with protocol
                </p>
              </div>
              <div>
                <Label>Date Range</Label>
                <Select value={dateRange} onValueChange={(value: '7' | '30' | '90') => setDateRange(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={onFetch} disabled={fetchingData}>
                {fetchingData ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Fetch Data
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>

    {searchConsoleData.length > 0 && (
      <>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalClicks.toLocaleString()}</div>
              <p className="text-xs flex items-center gap-1">
                {clicksChange > 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-success">+{clicksChange.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-danger" />
                    <span className="text-danger">{clicksChange.toFixed(1)}%</span>
                  </>
                )}
                <span className="text-muted-foreground">vs previous period</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalImpressions.toLocaleString()}</div>
              <p className="text-xs flex items-center gap-1">
                {impressionsChange > 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-success">+{impressionsChange.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-danger" />
                    <span className="text-danger">{impressionsChange.toFixed(1)}%</span>
                  </>
                )}
                <span className="text-muted-foreground">vs previous period</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg CTR</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgCTR.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">Click-through rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Position</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgPosition.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Search ranking</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Clicks & Impressions Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="impressions" stroke="hsl(var(--secondary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top 10 Pages by Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topPages} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="page_path"
                    type="category"
                    width={150}
                    tickFormatter={(value: string) =>
                      value.length > 20 ? value.substring(0, 20) + '...' : value
                    }
                  />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Search Queries</CardTitle>
            <CardDescription>Most viewed search queries for your site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topQueries.map((query, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{query.query}</p>
                    <p className="text-sm text-muted-foreground">
                      Position {query.position.toFixed(1)} • CTR {(query.ctr * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-bold">{query.clicks}</p>
                      <p className="text-muted-foreground">Clicks</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{query.impressions.toLocaleString()}</p>
                      <p className="text-muted-foreground">Impressions</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </>
    )}

    {searchConsoleData.length === 0 && isConnected && (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-3 py-8">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-lg font-medium">No Search Console data available</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Enter your site URL above and click "Fetch Data" to load analytics from Google Search Console.
            </p>
          </div>
        </CardContent>
      </Card>
    )}
  </>
);
