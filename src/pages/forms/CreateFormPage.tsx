import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { formService } from '@/services/form-service'
import { workspaceService } from '@/services/workspace-service'
import { CreateFormDto, FormAccessType } from '@/types/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'

export default function CreateFormPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [formData, setFormData] = useState<CreateFormDto>({
    name: '',
    description: '',
    workspaceId: '',
    accessType: FormAccessType.Private,
    isPublic: false,
  })

  // Fetch user workspaces
  const { data: workspaces = [] } = useQuery({
    queryKey: ['workspaces', user?.id],
    queryFn: () => workspaceService.getUserWorkspaces(user!.id),
    enabled: !!user?.id,
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateFormDto) => formService.createForm(data),
    onSuccess: (form) => {
      toast.success('Form created successfully!', {
        description: `"${form.name}" has been created.`,
      })
      navigate(`/forms/${form.id}/builder`)
    },
    onError: (error: any) => {
      toast.error('Failed to create form', {
        description: error.response?.data?.message || 'An error occurred while creating the form.',
      })
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.workspaceId) {
      toast.error('Please fill in all required fields')
      return
    }
    await createMutation.mutateAsync(formData)
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/forms')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forms
        </Button>
        <h1 className="text-3xl font-bold">Create New Form</h1>
        <p className="text-muted-foreground mt-2">
          Create a new form by filling in the details below. You'll be able to build the form schema after creation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Details</CardTitle>
          <CardDescription>
            Provide basic information about your form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Form Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter form name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter form description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="workspaceId">Workspace *</Label>
              <select
                id="workspaceId"
                value={formData.workspaceId}
                onChange={(e) => setFormData({ ...formData, workspaceId: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select a workspace</option>
                {workspaces.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="accessType">Access Type</Label>
              <select
                id="accessType"
                value={formData.accessType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    accessType: parseInt(e.target.value) as FormAccessType,
                    isPublic: parseInt(e.target.value) === FormAccessType.Public,
                  })
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={FormAccessType.Private}>Private</option>
                <option value={FormAccessType.Public}>Public</option>
                <option value={FormAccessType.DomainRestricted}>Domain Restricted</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic || false}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="isPublic" className="cursor-pointer">
                Make form publicly accessible
              </Label>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/forms')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Form'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

