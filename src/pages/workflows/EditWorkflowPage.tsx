import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { workflowService } from '@/services/workflow-service'
import { UpdateWorkflowDto } from '@/types/workflow'
import { WorkflowForm } from '@/components/workflows/WorkflowForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function EditWorkflowPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: workflow, isLoading, error } = useQuery({
    queryKey: ['workflow', id],
    queryFn: () => (id ? workflowService.getWorkflowById(id) : Promise.reject('No ID provided')),
    enabled: !!id,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkflowDto }) =>
      workflowService.updateWorkflow(id, data),
    onSuccess: (updatedWorkflow) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] })
      queryClient.invalidateQueries({ queryKey: ['workflow', id] })
      toast.success('Workflow updated successfully!', {
        description: `"${updatedWorkflow.name}" has been updated.`,
      })
      navigate('/workflows')
    },
    onError: (error: any) => {
      toast.error('Failed to update workflow', {
        description: error.response?.data?.message || 'An error occurred while updating the workflow.',
      })
    },
  })

  const handleSubmit = async (data: UpdateWorkflowDto) => {
    if (!id) return
    await updateMutation.mutateAsync({ id, data })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (error || !workflow) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
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
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/workflows')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workflows
        </Button>
        <h1 className="text-3xl font-bold">Edit Workflow</h1>
        <p className="text-muted-foreground mt-2">
          Update workflow details below.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workflow Details</CardTitle>
          <CardDescription>
            Update basic information about your workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorkflowForm
            initialData={workflow}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
            isEdit={true}
          />
        </CardContent>
      </Card>
    </div>
  )
}

