import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { workspaceService } from '@/services/workspace-service'
import { CreateWorkspaceDto } from '@/types/workspace'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'

export default function CreateWorkspacePage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<CreateWorkspaceDto>({
    name: '',
    description: '',
    slug: '',
    logoUrl: '',
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateWorkspaceDto) => workspaceService.createWorkspace(data),
    onSuccess: (workspace) => {
      toast.success('Workspace created successfully!', {
        description: `"${workspace.name}" has been created.`,
      })
      navigate(`/workspaces/${workspace.id}`)
    },
    onError: (error: any) => {
      toast.error('Failed to create workspace', {
        description: error.response?.data?.message || 'An error occurred while creating the workspace.',
      })
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Please enter a workspace name')
      return
    }
    await createMutation.mutateAsync(formData)
  }

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: formData.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    })
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/workspaces')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workspaces
        </Button>
        <h1 className="text-3xl font-bold">Create New Workspace</h1>
        <p className="text-muted-foreground mt-2">
          Create a new workspace to organize your workflows, forms, and team members.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Details</CardTitle>
          <CardDescription>
            Provide basic information about your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Workspace Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter workspace name"
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="workspace-slug"
              />
              <p className="text-sm text-muted-foreground mt-1">
                URL-friendly identifier (auto-generated from name if left empty)
              </p>
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
                onClick={() => navigate('/workspaces')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Workspace'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

