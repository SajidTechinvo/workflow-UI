export interface WorkflowNode {
  id: string
  type: string
  name: string
  position: { x: number; y: number }
  data?: Record<string, any>
}

export interface WorkflowConnection {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

export interface WorkflowBuilderState {
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
}

