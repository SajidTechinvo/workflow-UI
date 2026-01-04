import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Workflow, FileText, Users, BarChart3 } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your workflow builder platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Workflows
                </p>
                <p className="text-3xl font-bold mt-2">0</p>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-green-600">+0%</span> from last month
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Workflow className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Forms
                </p>
                <p className="text-3xl font-bold mt-2">0</p>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-green-600">+0%</span> from last month
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Workspaces
                </p>
                <p className="text-3xl font-bold mt-2">0</p>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-green-600">+0%</span> from last month
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Executions
                </p>
                <p className="text-3xl font-bold mt-2">0</p>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-green-600">+0%</span> from last month
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Workflows</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Your most recently created workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Workflow className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No workflows yet</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                Get started by creating your first automated workflow
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-border/50 hover:bg-accent transition-colors">
                <div className="font-medium">Create New Workflow</div>
                <div className="text-sm text-muted-foreground">Start building an automated workflow</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-border/50 hover:bg-accent transition-colors">
                <div className="font-medium">Create New Form</div>
                <div className="text-sm text-muted-foreground">Build a dynamic form</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-border/50 hover:bg-accent transition-colors">
                <div className="font-medium">View Analytics</div>
                <div className="text-sm text-muted-foreground">Check your workflow performance</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

