export interface Workspace {
  id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface WorkspaceDto {
  id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

