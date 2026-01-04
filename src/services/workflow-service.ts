import apiClient from '@/lib/api'
import { Workflow, CreateWorkflowDto, UpdateWorkflowDto } from '@/types/workflow'

export const workflowService = {
  async getUserWorkflows(userId: string): Promise<Workflow[]> {
    const response = await apiClient.get<Workflow[]>(`/workflows/user/${userId}`)
    return response.data
  },

  async getWorkflowById(id: string): Promise<Workflow> {
    const response = await apiClient.get<Workflow>(`/workflows/${id}`)
    return response.data
  },

  async createWorkflow(data: CreateWorkflowDto): Promise<Workflow> {
    const response = await apiClient.post<Workflow>('/workflows', data)
    return response.data
  },

  async updateWorkflow(id: string, data: UpdateWorkflowDto): Promise<Workflow> {
    const response = await apiClient.put<Workflow>(`/workflows/${id}`, data)
    return response.data
  },

  async deleteWorkflow(id: string): Promise<void> {
    await apiClient.delete(`/workflows/${id}`)
  },

  async getWorkflowVersions(id: string) {
    const response = await apiClient.get(`/workflows/${id}/versions`)
    return response.data
  },

  async restoreWorkflowVersion(workflowId: string, versionId: string): Promise<Workflow> {
    const response = await apiClient.post<Workflow>(
      `/workflows/${workflowId}/restore/${versionId}`
    )
    return response.data
  },
}

