export enum WorkspaceRole {
  Owner = 0,
  Admin = 1,
  Member = 2,
  Viewer = 3,
}

export interface Workspace {
  id: string
  name: string
  description?: string
  slug: string
  logoUrl?: string
  isActive: boolean
  ownerId: string
  ownerName?: string
  ownerEmail?: string
  memberCount: number
  createdAt: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
}

export interface WorkspaceMember {
  id: string
  workspaceId: string
  userId: string
  userName?: string
  userEmail?: string
  role: WorkspaceRole
  joinedAt: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface WorkspaceInvitation {
  id: string
  workspaceId: string
  email: string
  role: WorkspaceRole
  token: string
  expiresAt: string
  status: InvitationStatus
  createdAt: string
}

export enum InvitationStatus {
  Pending = 0,
  Accepted = 1,
  Expired = 2,
  Cancelled = 3,
}

export interface CreateWorkspaceDto {
  name: string
  description?: string
  slug?: string
  logoUrl?: string
}

export interface UpdateWorkspaceDto {
  name?: string
  description?: string
  logoUrl?: string
}

export interface AddWorkspaceMemberDto {
  userId: string
  role: WorkspaceRole
}

export interface UpdateWorkspaceMemberRoleDto {
  newRole: WorkspaceRole
}

export interface InviteWorkspaceMemberDto {
  email: string
  role: WorkspaceRole
}

export interface AcceptWorkspaceInvitationDto {
  token: string
}

export const getWorkspaceRoleLabel = (role: WorkspaceRole): string => {
  switch (role) {
    case WorkspaceRole.Owner:
      return 'Owner'
    case WorkspaceRole.Admin:
      return 'Admin'
    case WorkspaceRole.Member:
      return 'Member'
    case WorkspaceRole.Viewer:
      return 'Viewer'
    default:
      return 'Unknown'
  }
}

export const getWorkspaceRoleColor = (role: WorkspaceRole): string => {
  switch (role) {
    case WorkspaceRole.Owner:
      return 'bg-purple-500'
    case WorkspaceRole.Admin:
      return 'bg-blue-500'
    case WorkspaceRole.Member:
      return 'bg-green-500'
    case WorkspaceRole.Viewer:
      return 'bg-gray-500'
    default:
      return 'bg-gray-500'
  }
}

export const getInvitationStatusLabel = (status: InvitationStatus): string => {
  switch (status) {
    case InvitationStatus.Pending:
      return 'Pending'
    case InvitationStatus.Accepted:
      return 'Accepted'
    case InvitationStatus.Expired:
      return 'Expired'
    case InvitationStatus.Cancelled:
      return 'Cancelled'
    default:
      return 'Unknown'
  }
}
