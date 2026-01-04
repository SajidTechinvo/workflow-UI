import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { workflowService } from '@/services/workflow-service'
import { CreateWorkflowDto } from '@/types/workflow'
import { WorkflowForm } from '@/components/workflows/WorkflowForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function CreateWorkflowPage() {
  const navigate = useNavigate()

  const createMutation = useMutation({
    mutationFn: (data: CreateWorkflowDto) => workflowService.createWorkflow(data),
    onSuccess: (workflow) => {
      toast.success('Workflow created successfully!', {
        description: `"${workflow.name}" has been created.`,
      })
      navigate(`/workflows/${workflow.id}/builder`)
    },
    onError: (error: any) => {
      toast.error('Failed to create workflow', {
        description: error.response?.data?.message || 'An error occurred while creating the workflow.',
      })
    },
  })

  const handleSubmit = async (data: CreateWorkflowDto) => {
    await createMutation.mutateAsync(data)
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
        <h1 className="text-3xl font-bold">Create New Workflow</h1>
        <p className="text-muted-foreground mt-2">
          Create a new workflow by filling in the details below. You'll be able to build the workflow steps after creation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workflow Details</CardTitle>
          <CardDescription>
            Provide basic information about your workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorkflowForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
        </CardContent>
      </Card>
    </div>
  )
}

