import apiClient from '@/lib/api'
import { Workflow, CreateWorkflowDto, UpdateWorkflowDto } from '@/types/workflow'
import {
  N8nWorkflow,
  SaveWorkflowStructureDto,
  ExecuteWorkflowDto,
  N8nExecutionResult,
} from '@/types/n8n'

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

  async getWorkflowStructure(id: string): Promise<N8nWorkflow> {
    const response = await apiClient.get<N8nWorkflow>(`/workflows/${id}/structure`)
    return response.data
  },

  async saveWorkflowStructure(id: string, data: SaveWorkflowStructureDto): Promise<N8nWorkflow> {
    const response = await apiClient.put<N8nWorkflow>(`/workflows/${id}/structure`, data)
    return response.data
  },

  async executeWorkflow(id: string, data?: ExecuteWorkflowDto): Promise<N8nExecutionResult> {
    const response = await apiClient.post<N8nExecutionResult>(`/workflows/${id}/execute`, data)
    return response.data
  },
}

