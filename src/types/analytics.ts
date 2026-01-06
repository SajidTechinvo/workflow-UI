export interface TimeSeriesDataPoint {
  date: string
  count: number
}

export interface WorkflowUsage {
  workflowId: string
  workflowName: string
  executionCount: number
  successCount: number
  failureCount: number
}

export interface WorkflowAnalytics {
  totalWorkflows: number
  activeWorkflows: number
  inactiveWorkflows: number
  workflowsByStatus: Record<string, number>
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  averageExecutionDurationMs: number
  mostUsedWorkflows: WorkflowUsage[]
  workflowsCreatedOverTime: TimeSeriesDataPoint[]
}

export interface FormUsage {
  formId: string
  formName: string
  submissionCount: number
  lastSubmissionAt?: string
}

export interface FormAnalytics {
  totalForms: number
  publishedForms: number
  draftForms: number
  totalSubmissions: number
  averageSubmissionsPerForm: number
  mostPopularForms: FormUsage[]
  formsCreatedOverTime: TimeSeriesDataPoint[]
  submissionsOverTime: TimeSeriesDataPoint[]
}

export interface WorkflowExecutionStats {
  workflowId: string
  workflowName: string
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  averageDurationMs: number
}

export interface ExecutionAnalytics {
  totalExecutions: number
  executionsByStatus: Record<string, number>
  successfulExecutions: number
  failedExecutions: number
  successRate: number
  averageExecutionDurationMs: number
  fastestExecutionMs?: number
  slowestExecutionMs?: number
  executionsByTriggerType: Record<string, number>
  executionsOverTime: TimeSeriesDataPoint[]
  executionStatsByWorkflow: WorkflowExecutionStats[]
}

export interface AnalyticsFilters {
  workspaceId?: string
  workflowId?: string
  startDate?: string
  endDate?: string
}

