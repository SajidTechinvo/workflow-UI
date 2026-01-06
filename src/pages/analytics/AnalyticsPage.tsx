import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { workspaceService } from '@/services/workspace-service'
import { analyticsService } from '@/services/analytics-service'
import { AnalyticsFilters } from '@/types/analytics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  Workflow,
  FileText,
  Play,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
} from 'lucide-react'
import { format, subDays } from 'date-fns'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

export default function AnalyticsPage() {
  const { user } = useAuthStore()
  const [filters, setFilters] = useState<AnalyticsFilters>({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  })

  // Fetch workspaces for filter
  const { data: workspaces = [] } = useQuery({
    queryKey: ['workspaces', user?.id],
    queryFn: () => workspaceService.getUserWorkspaces(user!.id),
    enabled: !!user?.id,
  })

  // Fetch analytics
  const { data: workflowAnalytics, isLoading: workflowLoading } = useQuery({
    queryKey: ['workflow-analytics', filters],
    queryFn: () => analyticsService.getWorkflowAnalytics(filters),
  })

  const { data: formAnalytics, isLoading: formLoading } = useQuery({
    queryKey: ['form-analytics', filters],
    queryFn: () => analyticsService.getFormAnalytics(filters),
  })

  const { data: executionAnalytics, isLoading: executionLoading } = useQuery({
    queryKey: ['execution-analytics', filters],
    queryFn: () => analyticsService.getExecutionAnalytics(filters),
  })

  const isLoading = workflowLoading || formLoading || executionLoading

  const handleFilterChange = (key: keyof AnalyticsFilters, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }))
  }

  const resetFilters = () => {
    setFilters({
      startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
    })
  }

  // Prepare chart data
  const workflowStatusData = workflowAnalytics
    ? Object.entries(workflowAnalytics.workflowsByStatus).map(([status, count]) => ({
        name: status,
        value: count,
      }))
    : []

  const executionStatusData = executionAnalytics
    ? Object.entries(executionAnalytics.executionsByStatus).map(([status, count]) => ({
        name: status,
        value: count,
      }))
    : []

  const triggerTypeData = executionAnalytics
    ? Object.entries(executionAnalytics.executionsByTriggerType).map(([type, count]) => ({
        name: type,
        value: count,
      }))
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-2">View insights and statistics</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filters.workspaceId || ''}
                onChange={(e) => handleFilterChange('workspaceId', e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Workspaces</option>
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-muted-foreground">to</span>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button variant="outline" onClick={resetFilters} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Workflow Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Workflow className="h-8 w-8 text-blue-500" />
                  <div className="text-2xl font-bold">{workflowAnalytics?.totalWorkflows || 0}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {workflowAnalytics?.activeWorkflows || 0} active
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <FileText className="h-8 w-8 text-green-500" />
                  <div className="text-2xl font-bold">{formAnalytics?.totalForms || 0}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {formAnalytics?.publishedForms || 0} published
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Play className="h-8 w-8 text-purple-500" />
                  <div className="text-2xl font-bold">{executionAnalytics?.totalExecutions || 0}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {executionAnalytics?.successfulExecutions || 0} successful
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <div className="text-2xl font-bold">
                    {executionAnalytics?.successRate.toFixed(1) || 0}%
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">Average success rate</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workflow Status Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Workflows by Status</CardTitle>
                <CardDescription>Distribution of workflows by status</CardDescription>
              </CardHeader>
              <CardContent>
                {workflowStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={workflowStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {workflowStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Execution Status Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Executions by Status</CardTitle>
                <CardDescription>Distribution of executions by status</CardDescription>
              </CardHeader>
              <CardContent>
                {executionStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={executionStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {executionStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workflows Created Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Workflows Created Over Time</CardTitle>
                <CardDescription>Number of workflows created per day</CardDescription>
              </CardHeader>
              <CardContent>
                {workflowAnalytics?.workflowsCreatedOverTime &&
                workflowAnalytics.workflowsCreatedOverTime.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={workflowAnalytics.workflowsCreatedOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#8884d8" name="Workflows" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Executions Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Executions Over Time</CardTitle>
                <CardDescription>Number of executions per day</CardDescription>
              </CardHeader>
              <CardContent>
                {executionAnalytics?.executionsOverTime &&
                executionAnalytics.executionsOverTime.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={executionAnalytics.executionsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#82ca9d" name="Executions" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Most Used Workflows */}
            <Card>
              <CardHeader>
                <CardTitle>Most Used Workflows</CardTitle>
                <CardDescription>Top workflows by execution count</CardDescription>
              </CardHeader>
              <CardContent>
                {workflowAnalytics?.mostUsedWorkflows &&
                workflowAnalytics.mostUsedWorkflows.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={workflowAnalytics.mostUsedWorkflows.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="workflowName" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="executionCount" fill="#8884d8" name="Executions" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Most Popular Forms */}
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Forms</CardTitle>
                <CardDescription>Top forms by submission count</CardDescription>
              </CardHeader>
              <CardContent>
                {formAnalytics?.mostPopularForms && formAnalytics.mostPopularForms.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={formAnalytics.mostPopularForms.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="formName" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="submissionCount" fill="#82ca9d" name="Submissions" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Execution Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Execution Statistics</CardTitle>
              <CardDescription>Detailed execution metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">Average Duration</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {executionAnalytics?.averageExecutionDurationMs
                      ? `${(executionAnalytics.averageExecutionDurationMs / 1000).toFixed(2)}s`
                      : '0s'}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Successful</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {executionAnalytics?.successfulExecutions || 0}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium">Failed</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {executionAnalytics?.failedExecutions || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

