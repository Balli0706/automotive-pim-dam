'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Car, 
  Database, 
  Image, 
  Workflow, 
  Brain, 
  Users, 
  BarChart3, 
  Settings,
  Upload,
  Download,
  Search,
  Filter
} from 'lucide-react';

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data for dashboard
  const stats = {
    totalProducts: 12847,
    totalAssets: 45621,
    activeWorkflows: 23,
    pendingTasks: 156
  };

  const recentActivities = [
    { id: 1, action: 'Product imported', user: 'Data Steward', time: '2 min ago', type: 'import' },
    { id: 2, action: 'Asset approved', user: 'Marketing Team', time: '5 min ago', type: 'approval' },
    { id: 3, action: 'Export completed', user: 'System', time: '10 min ago', type: 'export' },
    { id: 4, action: 'Workflow created', user: 'Admin', time: '15 min ago', type: 'workflow' }
  ];

  return (
    <div className=\"min-h-screen bg-gray-50 dark:bg-gray-900\">
      {/* Header */}
      <header className=\"bg-white dark:bg-gray-800 shadow-sm border-b\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
          <div className=\"flex justify-between items-center h-16\">
            <div className=\"flex items-center space-x-4\">
              <Car className=\"h-8 w-8 text-blue-600\" />
              <h1 className=\"text-xl font-bold text-gray-900 dark:text-white\">
                Automotive PIM + DAM
              </h1>
            </div>
            <div className=\"flex items-center space-x-4\">
              <Button variant=\"outline\" size=\"sm\">
                <Search className=\"h-4 w-4 mr-2\" />
                Search
              </Button>
              <Button size=\"sm\">
                <Upload className=\"h-4 w-4 mr-2\" />
                Import
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8\">
        {/* Stats Overview */}
        <div className=\"grid grid-cols-1 md:grid-cols-4 gap-6 mb-8\">
          <Card>
            <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">
              <CardTitle className=\"text-sm font-medium\">Products</CardTitle>
              <Database className=\"h-4 w-4 text-muted-foreground\" />
            </CardHeader>
            <CardContent>
              <div className=\"text-2xl font-bold\">{stats.totalProducts.toLocaleString()}</div>
              <p className=\"text-xs text-muted-foreground\">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">
              <CardTitle className=\"text-sm font-medium\">Assets</CardTitle>
              <Image className=\"h-4 w-4 text-muted-foreground\" />
            </CardHeader>
            <CardContent>
              <div className=\"text-2xl font-bold\">{stats.totalAssets.toLocaleString()}</div>
              <p className=\"text-xs text-muted-foreground\">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">
              <CardTitle className=\"text-sm font-medium\">Active Workflows</CardTitle>
              <Workflow className=\"h-4 w-4 text-muted-foreground\" />
            </CardHeader>
            <CardContent>
              <div className=\"text-2xl font-bold\">{stats.activeWorkflows}</div>
              <p className=\"text-xs text-muted-foreground\">
                3 completed today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">
              <CardTitle className=\"text-sm font-medium\">Pending Tasks</CardTitle>
              <Users className=\"h-4 w-4 text-muted-foreground\" />
            </CardHeader>
            <CardContent>
              <div className=\"text-2xl font-bold\">{stats.pendingTasks}</div>
              <p className=\"text-xs text-muted-foreground\">
                -5% from yesterday
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className=\"space-y-6\">
          <TabsList className=\"grid w-full grid-cols-5\">
            <TabsTrigger value=\"overview\">Overview</TabsTrigger>
            <TabsTrigger value=\"products\">Products</TabsTrigger>
            <TabsTrigger value=\"assets\">Assets</TabsTrigger>
            <TabsTrigger value=\"workflows\">Workflows</TabsTrigger>
            <TabsTrigger value=\"ai-tools\">AI Tools</TabsTrigger>
          </TabsList>

          <TabsContent value=\"overview\" className=\"space-y-6\">
            <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">
              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest system activities and user actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className=\"space-y-4\">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className=\"flex items-center space-x-4\">
                        <div className=\"flex-shrink-0\">
                          {activity.type === 'import' && <Upload className=\"h-4 w-4 text-blue-500\" />}
                          {activity.type === 'approval' && <Badge className=\"h-4 w-4 text-green-500\" />}
                          {activity.type === 'export' && <Download className=\"h-4 w-4 text-purple-500\" />}
                          {activity.type === 'workflow' && <Workflow className=\"h-4 w-4 text-orange-500\" />}
                        </div>
                        <div className=\"flex-1 min-w-0\">
                          <p className=\"text-sm font-medium text-gray-900 dark:text-white\">
                            {activity.action}
                          </p>
                          <p className=\"text-sm text-gray-500 dark:text-gray-400\">
                            by {activity.user}
                          </p>
                        </div>
                        <div className=\"flex-shrink-0 text-sm text-gray-500 dark:text-gray-400\">
                          {activity.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className=\"grid grid-cols-2 gap-4\">
                    <Button className=\"h-20 flex flex-col space-y-2\" variant=\"outline\">
                      <Upload className=\"h-6 w-6\" />
                      <span className=\"text-sm\">Import Products</span>
                    </Button>
                    <Button className=\"h-20 flex flex-col space-y-2\" variant=\"outline\">
                      <Image className=\"h-6 w-6\" />
                      <span className=\"text-sm\">Upload Assets</span>
                    </Button>
                    <Button className=\"h-20 flex flex-col space-y-2\" variant=\"outline\">
                      <Brain className=\"h-6 w-6\" />
                      <span className=\"text-sm\">Generate Layout</span>
                    </Button>
                    <Button className=\"h-20 flex flex-col space-y-2\" variant=\"outline\">
                      <Download className=\"h-6 w-6\" />
                      <span className=\"text-sm\">Export Data</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value=\"products\" className=\"space-y-6\">
            <Card>
              <CardHeader>
                <div className=\"flex justify-between items-center\">
                  <div>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>Manage your automotive product catalog</CardDescription>
                  </div>
                  <div className=\"flex space-x-2\">
                    <Button variant=\"outline\" size=\"sm\">
                      <Filter className=\"h-4 w-4 mr-2\" />
                      Filter
                    </Button>
                    <Button size=\"sm\">
                      Add Product
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className=\"text-center py-8 text-gray-500 dark:text-gray-400\">
                  Product table will be implemented here with advanced filtering and KI-powered features
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value=\"assets\" className=\"space-y-6\">
            <Card>
              <CardHeader>
                <div className=\"flex justify-between items-center\">
                  <div>
                    <CardTitle>Digital Asset Management</CardTitle>
                    <CardDescription>Organize and manage your digital assets</CardDescription>
                  </div>
                  <Button size=\"sm\">
                    <Upload className=\"h-4 w-4 mr-2\" />
                    Upload Assets
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className=\"text-center py-8 text-gray-500 dark:text-gray-400\">
                  Asset gallery and management interface will be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value=\"workflows\" className=\"space-y-6\">
            <Card>
              <CardHeader>
                <div className=\"flex justify-between items-center\">
                  <div>
                    <CardTitle>Workflow Management</CardTitle>
                    <CardDescription>Automate your business processes</CardDescription>
                  </div>
                  <Button size=\"sm\">
                    Create Workflow
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className=\"text-center py-8 text-gray-500 dark:text-gray-400\">
                  Workflow designer and management tools will be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value=\"ai-tools\" className=\"space-y-6\">
            <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
              <Card>
                <CardHeader>
                  <CardTitle className=\"flex items-center space-x-2\">
                    <Brain className=\"h-5 w-5\" />
                    <span>Data Cleaning</span>
                  </CardTitle>
                  <CardDescription>AI-powered data validation and cleaning</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className=\"w-full\">Start Cleaning</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className=\"flex items-center space-x-2\">
                    <Image className=\"h-5 w-5\" />
                    <span>Layout Generator</span>
                  </CardTitle>
                  <CardDescription>Generate brochures and datasheets</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className=\"w-full\">Generate Layout</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className=\"flex items-center space-x-2\">
                    <Download className=\"h-5 w-5\" />
                    <span>Smart Export</span>
                  </CardTitle>
                  <CardDescription>AI-guided data export and integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className=\"w-full\">Configure Export</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}