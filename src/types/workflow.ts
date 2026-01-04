export enum WorkflowStatus {
  Draft = 0,
  Active = 1,
  Paused = 2,
  Archived = 3,
}

export interface Workflow {
  id: string
  name: string
  description?: string
  workspaceId: string
  createdById: string
  n8nWorkflowId?: string
  status: WorkflowStatus
  isActive: boolean
  tags?: string[]
  createdAt: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
}

export interface CreateWorkflowDto {
  name: string
  description?: string
  workspaceId: string
  n8nWorkflowId?: string
  status?: WorkflowStatus
  tags?: string[]
}

export interface UpdateWorkflowDto {
  name?: string
  description?: string
  status?: WorkflowStatus
  tags?: string[]
  isActive?: boolean
}

export const getWorkflowStatusLabel = (status: WorkflowStatus): string => {
  switch (status) {
    case WorkflowStatus.Draft:
      return 'Draft'
    case WorkflowStatus.Active:
      return 'Active'
    case WorkflowStatus.Paused:
      return 'Paused'
    case WorkflowStatus.Archived:
      return 'Archived'
    default:
      return 'Unknown'
  }
}

export const getWorkflowStatusColor = (status: WorkflowStatus): string => {
  switch (status) {
    case WorkflowStatus.Draft:
      return 'bg-gray-500'
    case WorkflowStatus.Active:
      return 'bg-green-500'
    case WorkflowStatus.Paused:
      return 'bg-yellow-500'
    case WorkflowStatus.Archived:
      return 'bg-gray-400'
    default:
      return 'bg-gray-500'
  }
}

