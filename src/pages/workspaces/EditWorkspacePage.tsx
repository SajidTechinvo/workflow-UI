import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { workspaceService } from '@/services/workspace-service'
import { UpdateWorkspaceDto } from '@/types/workspace'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'

export default function EditWorkspacePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState<UpdateWorkspaceDto>({
    name: '',
    description: '',
    logoUrl: '',
  })

  // Fetch workspace
  const {
    data: workspace,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['workspace', id],
    queryFn: () => workspaceService.getWorkspaceById(id!),
    enabled: !!id,
  })

  // Initialize form data
  useEffect(() => {
    if (workspace) {
      setFormData({
        name: workspace.name,
        description: workspace.description || '',
        logoUrl: workspace.logoUrl || '',
      })
    }
  }, [workspace])

  const updateMutation = useMutation({
    mutationFn: (data: UpdateWorkspaceDto) => workspaceService.updateWorkspace(id!, data),
    onSuccess: (updatedWorkspace) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      queryClient.invalidateQueries({ queryKey: ['workspace', id] })
      toast.success('Workspace updated successfully!', {
        description: `"${updatedWorkspace.name}" has been updated.`,
      })
      navigate(`/workspaces/${id}`)
    },
    onError: (error: any) => {
      toast.error('Failed to update workspace', {
        description: error.response?.data?.message || 'An error occurred while updating the workspace.',
      })
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateMutation.mutateAsync(formData)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-muted-foreground">Loading workspace...</div>
      </div>
    )
  }

  if (error || !workspace) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspace Not Found</h1>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-destructive mb-4">Failed to load workspace</p>
            <Button onClick={() => navigate('/workspaces')}>Back to Workspaces</Button>
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
          onClick={() => navigate(`/workspaces/${id}`)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workspace
        </Button>
        <h1 className="text-3xl font-bold">Edit Workspace</h1>
        <p className="text-muted-foreground mt-2">
          Update workspace details
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Details</CardTitle>
          <CardDescription>
            Update basic information about your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Workspace Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter workspace name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter workspace description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="logoUrl">Logo URL (optional)</Label>
              <Input
                id="logoUrl"
                value={formData.logoUrl || ''}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
                type="url"
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/workspaces/${id}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Updating...' : 'Update Workspace'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

