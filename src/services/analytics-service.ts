import apiClient from '@/lib/api'
import {
  WorkflowAnalytics,
  FormAnalytics,
  ExecutionAnalytics,
  AnalyticsFilters,
} from '@/types/analytics'

export const analyticsService = {
  async getWorkflowAnalytics(filters?: AnalyticsFilters): Promise<WorkflowAnalytics> {
    const params = new URLSearchParams()
    if (filters?.workspaceId) params.append('workspaceId', filters.workspaceId)
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)

    const response = await apiClient.get<WorkflowAnalytics>(
      `/analytics/workflows${params.toString() ? `?${params.toString()}` : ''}`
    )
    return response.data
  },

  async getFormAnalytics(filters?: AnalyticsFilters): Promise<FormAnalytics> {
    const params = new URLSearchParams()
    if (filters?.workspaceId) params.append('workspaceId', filters.workspaceId)
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)

    const response = await apiClient.get<FormAnalytics>(
      `/analytics/forms${params.toString() ? `?${params.toString()}` : ''}`
    )
    return response.data
  },

  async getExecutionAnalytics(filters?: AnalyticsFilters): Promise<ExecutionAnalytics> {
    const params = new URLSearchParams()
    if (filters?.workspaceId) params.append('workspaceId', filters.workspaceId)
    if (filters?.workflowId) params.append('workflowId', filters.workflowId)
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)

    const response = await apiClient.get<ExecutionAnalytics>(
      `/analytics/executions${params.toString() ? `?${params.toString()}` : ''}`
    )
    return response.data
  },
}

