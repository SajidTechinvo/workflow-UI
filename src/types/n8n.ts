export interface N8nNode {
  id: string
  name: string
  type: string
  typeVersion: number
  position: number[]
  parameters?: Record<string, any>
  webhookId?: string
}

export interface N8nWorkflow {
  id?: string
  name: string
  description?: string
  active: boolean
  nodes: N8nNode[]
  connections?: Record<string, any>
  settings?: Record<string, any>
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface N8nExecutionResult {
  executionId: string
  workflowId: string
  status: string
  finished: boolean
  data?: any
  startedAt?: string
  stoppedAt?: string
}

export interface SaveWorkflowStructureDto {
  nodes?: N8nNode[]
  connections?: Record<string, any>
  settings?: Record<string, any>
}

export interface ExecuteWorkflowDto {
  inputData?: any
}

