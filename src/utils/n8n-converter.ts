import { WorkflowNode, WorkflowConnection } from '@/types/workflow-builder'
import { N8nNode, N8nWorkflow } from '@/types/n8n'

// Map frontend node types to n8n node types
const NODE_TYPE_MAP: Record<string, string> = {
  webhook: 'n8n-nodes-base.webhook',
  database: 'n8n-nodes-base.postgres',
  email: 'n8n-nodes-base.emailSend',
  file: 'n8n-nodes-base.readBinaryFile',
  schedule: 'n8n-nodes-base.scheduleTrigger',
  action: 'n8n-nodes-base.set',
}

// Reverse map: n8n node types to frontend node types
const N8N_TYPE_MAP: Record<string, string> = {
  'n8n-nodes-base.webhook': 'webhook',
  'n8n-nodes-base.postgres': 'database',
  'n8n-nodes-base.emailSend': 'email',
  'n8n-nodes-base.readBinaryFile': 'file',
  'n8n-nodes-base.scheduleTrigger': 'schedule',
  'n8n-nodes-base.set': 'action',
}

/**
 * Convert frontend WorkflowNode to n8n N8nNode
 */
export function convertToN8nNode(node: WorkflowNode): N8nNode {
  const n8nType = NODE_TYPE_MAP[node.type] || 'n8n-nodes-base.set'

  return {
    id: node.id,
    name: node.name,
    type: n8nType,
    typeVersion: 1,
    position: [node.position.x, node.position.y],
    parameters: node.data || {},
  }
}

/**
 * Convert n8n N8nNode to frontend WorkflowNode
 */
export function convertFromN8nNode(n8nNode: N8nNode): WorkflowNode {
  // Extract frontend type from n8n type
  const frontendType = Object.entries(N8N_TYPE_MAP).find(([n8nType]) =>
    n8nNode.type.includes(n8nType.split('.')[1])
  )?.[1] || 'action'

  // Extract name from n8n node name or type
  const name = n8nNode.name || n8nNode.type.split('.').pop() || 'Node'

  return {
    id: n8nNode.id,
    type: frontendType,
    name: name,
    position: {
      x: n8nNode.position[0] || 0,
      y: n8nNode.position[1] || 0,
    },
    data: n8nNode.parameters || {},
  }
}

/**
 * Convert frontend workflow structure to n8n workflow structure
 */
export function convertToN8nWorkflow(
  nodes: WorkflowNode[],
  connections: WorkflowConnection[],
  workflowName: string,
  workflowDescription?: string
): N8nWorkflow {
  const n8nNodes = nodes.map(convertToN8nNode)

  // Convert connections to n8n format
  // n8n connections format: { [nodeName]: { main: [[{ node: targetNodeName, type: 'main', index: 0 }]] } }
  const n8nConnections: Record<string, any> = {}
  
  connections.forEach((conn) => {
    const sourceNode = nodes.find((n) => n.id === conn.source)
    const targetNode = nodes.find((n) => n.id === conn.target)
    
    if (sourceNode && targetNode) {
      if (!n8nConnections[sourceNode.name]) {
        n8nConnections[sourceNode.name] = { main: [[]] }
      }
      n8nConnections[sourceNode.name].main[0].push({
        node: targetNode.name,
        type: 'main',
        index: 0,
      })
    }
  })

  return {
    name: workflowName,
    description: workflowDescription,
    active: false,
    nodes: n8nNodes,
    connections: Object.keys(n8nConnections).length > 0 ? n8nConnections : undefined,
  }
}

/**
 * Convert n8n workflow structure to frontend workflow structure
 */
export function convertFromN8nWorkflow(n8nWorkflow: N8nWorkflow): {
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
} {
  const nodes = n8nWorkflow.nodes.map(convertFromN8nNode)

  // Convert n8n connections to frontend connections
  const connections: WorkflowConnection[] = []
  
  if (n8nWorkflow.connections) {
    Object.entries(n8nWorkflow.connections).forEach(([sourceName, connectionData]: [string, any]) => {
      const sourceNode = nodes.find((n) => n.name === sourceName)
      if (!sourceNode || !connectionData.main) return

      connectionData.main.forEach((outputArray: any[], outputIndex: number) => {
        outputArray.forEach((connection: any, connectionIndex: number) => {
          const targetNode = nodes.find((n) => n.name === connection.node)
          if (targetNode) {
            connections.push({
              id: `conn-${sourceNode.id}-${targetNode.id}-${outputIndex}-${connectionIndex}`,
              source: sourceNode.id,
              target: targetNode.id,
              sourceHandle: `output-${outputIndex}`,
              targetHandle: `input-${connection.index || 0}`,
            })
          }
        })
      })
    })
  }

  return { nodes, connections }
}

