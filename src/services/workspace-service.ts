import apiClient from '@/lib/api'
import {
  Workspace,
  WorkspaceMember,
  WorkspaceInvitation,
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  AddWorkspaceMemberDto,
  UpdateWorkspaceMemberRoleDto,
  InviteWorkspaceMemberDto,
  AcceptWorkspaceInvitationDto,
} from '@/types/workspace'

export const workspaceService = {
  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    const response = await apiClient.get<Workspace[]>(`/workspaces/user/${userId}`)
    return response.data
  },

  async getWorkspaceById(id: string): Promise<Workspace> {
    const response = await apiClient.get<Workspace>(`/workspaces/${id}`)
    return response.data
  },

  async createWorkspace(data: CreateWorkspaceDto): Promise<Workspace> {
    const response = await apiClient.post<Workspace>('/workspaces', data)
    return response.data
  },

  async updateWorkspace(id: string, data: UpdateWorkspaceDto): Promise<Workspace> {
    const response = await apiClient.put<Workspace>(`/workspaces/${id}`, data)
    return response.data
  },

  async deleteWorkspace(id: string): Promise<void> {
    await apiClient.delete(`/workspaces/${id}`)
  },

  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const response = await apiClient.get<WorkspaceMember[]>(`/workspaces/${workspaceId}/members`)
    return response.data
  },

  async addWorkspaceMember(workspaceId: string, data: AddWorkspaceMemberDto): Promise<WorkspaceMember> {
    const response = await apiClient.post<WorkspaceMember>(`/workspaces/${workspaceId}/members`, data)
    return response.data
  },

  async updateWorkspaceMemberRole(
    workspaceId: string,
    userId: string,
    data: UpdateWorkspaceMemberRoleDto
  ): Promise<WorkspaceMember> {
    const response = await apiClient.put<WorkspaceMember>(
      `/workspaces/${workspaceId}/members/${userId}/role`,
      data
    )
    return response.data
  },

  async removeWorkspaceMember(workspaceId: string, userId: string): Promise<void> {
    await apiClient.delete(`/workspaces/${workspaceId}/members/${userId}`)
  },

  async inviteWorkspaceMember(
    workspaceId: string,
    data: InviteWorkspaceMemberDto
  ): Promise<WorkspaceInvitation> {
    const response = await apiClient.post<WorkspaceInvitation>(
      `/workspaces/${workspaceId}/invitations`,
      data
    )
    return response.data
  },

  async acceptWorkspaceInvitation(data: AcceptWorkspaceInvitationDto): Promise<WorkspaceMember> {
    const response = await apiClient.post<WorkspaceMember>('/workspaces/invitations/accept', data)
    return response.data
  },

  async resendWorkspaceInvitation(invitationId: string): Promise<WorkspaceInvitation> {
    const response = await apiClient.post<WorkspaceInvitation>(
      `/workspaces/invitations/${invitationId}/resend`
    )
    return response.data
  },

  async cancelWorkspaceInvitation(invitationId: string): Promise<void> {
    await apiClient.delete(`/workspaces/invitations/${invitationId}`)
  },
}
