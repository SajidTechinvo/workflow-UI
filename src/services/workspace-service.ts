import apiClient from '@/lib/api'
import { Workspace } from '@/types/workspace'

export const workspaceService = {
  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    const response = await apiClient.get<Workspace[]>(`/workspaces/user/${userId}`)
    return response.data
  },

  async getWorkspaceById(id: string): Promise<Workspace> {
    const response = await apiClient.get<Workspace>(`/workspaces/${id}`)
    return response.data
  },
}

