import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DndContext, DragEndEvent, DragStartEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { toast } from 'sonner'
import { workflowService } from '@/services/workflow-service'
import { WorkflowNode, WorkflowConnection } from '@/types/workflow-builder'
import { convertToN8nWorkflow, convertFromN8nWorkflow } from '@/utils/n8n-converter'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Save,
  Play,
  Plus,
  Trash2,
  Loader2,
  Workflow as WorkflowIcon,
  Webhook,
  Database,
  FileText,
  Mail,
  Calendar,
  Settings,
} from 'lucide-react'

// Node types available for workflows
const NODE_TYPES = [
  { id: 'webhook', name: 'Webhook', icon: Webhook, color: 'bg-blue-500' },
  { id: 'database', name: 'Database', icon: Database, color: 'bg-green-500' },
  { id: 'email', name: 'Email', icon: Mail, color: 'bg-yellow-500' },
  { id: 'file', name: 'File', icon: FileText, color: 'bg-purple-500' },
  { id: 'schedule', name: 'Schedule', icon: Calendar, color: 'bg-orange-500' },
  { id: 'action', name: 'Action', icon: Settings, color: 'bg-gray-500' },
]

interface DraggableNodeProps {
  node: WorkflowNode
  onDelete: (id: string) => void
}

function DraggableNode({ node, onDelete }: DraggableNodeProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const nodeType = NODE_TYPES.find((t) => t.id === node.type) || NODE_TYPES[NODE_TYPES.length - 1]
  const Icon = nodeType.icon

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`absolute cursor-move ${isDragging ? 'z-50' : 'z-10'}`}
      style={{
        ...style,
        left: node.position.x,
        top: node.position.y,
      }}
    >
      <Card className="w-48 shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded ${nodeType.color} text-white`}>
                <Icon className="h-4 w-4" />
              </div>
              <Badge variant="secondary" className="text-xs">
                {node.type}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(node.id)
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-sm font-medium">{node.name}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function WorkflowBuilderPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [nodes, setNodes] = useState<WorkflowNode[]>([])
  const [connections, setConnections] = useState<WorkflowConnection[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isLoadingStructure, setIsLoadingStructure] = useState(false)

  // Fetch workflow
  const { data: workflow, isLoading, error } = useQuery({
    queryKey: ['workflow', id],
    queryFn: () => (id ? workflowService.getWorkflowById(id) : Promise.reject('No ID provided')),
    enabled: !!id,
  })

  // Load workflow structure from n8n
  useEffect(() => {
    const loadWorkflowStructure = async () => {
      if (!workflow || !workflow.n8nWorkflowId) {
        // No n8n workflow ID, start with empty canvas
        setNodes([])
        setConnections([])
        return
      }

      setIsLoadingStructure(true)
      try {
        const n8nWorkflow = await workflowService.getWorkflowStructure(id!)
        const { nodes: loadedNodes, connections: loadedConnections } =
          convertFromN8nWorkflow(n8nWorkflow)
        setNodes(loadedNodes)
        setConnections(loadedConnections)
      } catch (error: any) {
        // If workflow structure doesn't exist in n8n yet, start with empty canvas
        if (error?.response?.status !== 404) {
          toast.error('Failed to load workflow structure', {
            description: error?.response?.data?.message || 'An error occurred.',
          })
        }
        setNodes([])
        setConnections([])
      } finally {
        setIsLoadingStructure(false)
      }
    }

    if (workflow) {
      loadWorkflowStructure()
    }
  }, [workflow, id])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    // Handle dropping on canvas
    if (over.id === 'canvas' && event.activatorEvent instanceof MouseEvent) {
      const canvasElement = document.getElementById('canvas')
      if (!canvasElement) {
        setActiveId(null)
        return
      }

      const rect = canvasElement.getBoundingClientRect()
      const x = event.activatorEvent.clientX - rect.left - 96 // Offset for node width
      const y = event.activatorEvent.clientY - rect.top - 64 // Offset for node height

      // Check if dragging a new node type from the sidebar
      const nodeType = NODE_TYPES.find((t) => t.id === active.id)
      if (nodeType) {
        const newNode: WorkflowNode = {
          id: `node-${Date.now()}`,
          type: nodeType.id,
          name: nodeType.name,
          position: { x: Math.max(0, x), y: Math.max(0, y) },
        }
        setNodes((prev) => [...prev, newNode])
      } else {
        // Moving an existing node
        const existingNode = nodes.find((n) => n.id === active.id)
        if (existingNode) {
          setNodes((prev) =>
            prev.map((node) =>
              node.id === active.id
                ? { ...node, position: { x: Math.max(0, x), y: Math.max(0, y) } }
                : node
            )
          )
        }
      }
    }

    setActiveId(null)
  }

  const handleAddNode = (nodeType: typeof NODE_TYPES[0]) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: nodeType.id,
      name: nodeType.name,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
    }
    setNodes((prev) => [...prev, newNode])
  }

  const handleDeleteNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== nodeId))
    setConnections((prev) =>
      prev.filter((conn) => conn.source !== nodeId && conn.target !== nodeId)
    )
  }

  // Save workflow structure mutation
  const saveStructureMutation = useMutation({
    mutationFn: () => {
      if (!workflow || !id) throw new Error('Workflow not loaded')
      const n8nWorkflow = convertToN8nWorkflow(
        nodes,
        connections,
        workflow.name,
        workflow.description
      )
      return workflowService.saveWorkflowStructure(id, {
        nodes: n8nWorkflow.nodes,
        connections: n8nWorkflow.connections,
        settings: n8nWorkflow.settings,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow', id] })
      toast.success('Workflow saved successfully!', {
        description: 'The workflow structure has been saved to n8n.',
      })
    },
    onError: (error: any) => {
      toast.error('Failed to save workflow', {
        description: error?.response?.data?.message || 'An error occurred while saving the workflow.',
      })
    },
  })

  // Execute workflow mutation
  const executeWorkflowMutation = useMutation({
    mutationFn: () => {
      if (!id) throw new Error('Workflow ID not available')
      return workflowService.executeWorkflow(id)
    },
    onSuccess: (result) => {
      toast.success('Workflow execution started!', {
        description: `Execution ID: ${result.executionId}`,
      })
    },
    onError: (error: any) => {
      toast.error('Failed to execute workflow', {
        description: error?.response?.data?.message || 'An error occurred while executing the workflow.',
      })
    },
  })

  const handleSave = async () => {
    if (nodes.length === 0) {
      toast.warning('No nodes to save', {
        description: 'Add at least one node to the workflow before saving.',
      })
      return
    }
    await saveStructureMutation.mutateAsync()
  }

  const handleRun = async () => {
    if (!id) return
    if (nodes.length === 0) {
      toast.warning('Cannot execute empty workflow', {
        description: 'Add at least one node to the workflow before executing.',
      })
      return
    }
    // Save first, then execute
    try {
      await saveStructureMutation.mutateAsync()
      await executeWorkflowMutation.mutateAsync()
    } catch (error) {
      // Error already handled in mutation
    }
  }

  if (isLoading || isLoadingStructure) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !workflow) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">
              {error ? 'Failed to load workflow' : 'Workflow not found'}
            </p>
            <Button onClick={() => navigate('/workflows')} className="mt-4">
              Back to Workflows
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-muted/30 border-r p-4 overflow-y-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/workflows')}
            className="w-full justify-start mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workflows
          </Button>
          <h2 className="text-lg font-semibold mb-2">Workflow Builder</h2>
          <p className="text-sm text-muted-foreground mb-4">{workflow.name}</p>
        </div>

        <div className="space-y-2 mb-6">
          <Button
            onClick={handleSave}
            className="w-full"
            variant="default"
            disabled={saveStructureMutation.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {saveStructureMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
          <Button
            onClick={handleRun}
            className="w-full"
            variant="outline"
            disabled={saveStructureMutation.isPending || executeWorkflowMutation.isPending}
          >
            <Play className="mr-2 h-4 w-4" />
            {executeWorkflowMutation.isPending ? 'Running...' : 'Run'}
          </Button>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-3">Add Node</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Click to add or drag to canvas
          </p>
          <div className="space-y-2">
            {NODE_TYPES.map((nodeType) => {
              const Icon = nodeType.icon
              return (
                <div key={nodeType.id} className="flex gap-2">
                  <Button
                    id={nodeType.id}
                    variant="outline"
                    className="flex-1 justify-start cursor-grab active:cursor-grabbing"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {nodeType.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-2"
                    onClick={() => handleAddNode(nodeType)}
                    title="Quick add"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="border-t pt-4 mt-6">
          <h3 className="text-sm font-medium mb-2">Nodes ({nodes.length})</h3>
          <p className="text-xs text-muted-foreground">
            Drag nodes on the canvas to reposition them
          </p>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div
            id="canvas"
            className="canvas-container w-full h-full relative"
            style={{
              backgroundImage:
                'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            {nodes.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <WorkflowIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No nodes yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add nodes from the sidebar to get started
                  </p>
                </div>
              </div>
            ) : (
              <SortableContext items={nodes.map((n) => n.id)}>
                {nodes.map((node) => (
                  <DraggableNode key={node.id} node={node} onDelete={handleDeleteNode} />
                ))}
              </SortableContext>
            )}
          </div>
        </DndContext>
      </div>
    </div>
  )
}

