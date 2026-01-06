import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { formService } from '@/services/form-service'
import { Form, FormAccessType, CreateFormDto } from '@/types/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { workspaceService } from '@/services/workspace-service'

export default function EditFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [formData, setFormData] = useState<CreateFormDto>({
    name: '',
    description: '',
    workspaceId: '',
    accessType: FormAccessType.Private,
    isPublic: false,
  })

  // Fetch form
  const {
    data: form,
    isLoading,
    error,
  } = useQuery<Form>({
    queryKey: ['form', id],
    queryFn: () => formService.getFormById(id!),
    enabled: !!id,
  })

  // Fetch user workspaces
  const { data: workspaces = [] } = useQuery({
    queryKey: ['workspaces', user?.id],
    queryFn: () => workspaceService.getUserWorkspaces(user!.id),
    enabled: !!user?.id,
  })

  // Initialize form data
  useEffect(() => {
    if (form) {
      setFormData({
        name: form.name,
        description: form.description || '',
        workspaceId: form.workspaceId,
        workflowId: form.workflowId,
        accessType: form.accessType,
        isPublic: form.isPublic,
        accessPassword: form.accessPassword,
        allowedDomains: form.allowedDomains,
        maxSubmissions: form.maxSubmissions,
        acceptsUntil: form.acceptsUntil,
      })
    }
  }, [form])

  // Note: There's no updateForm endpoint in the API, so we'll just show a message
  // In a real implementation, you'd need to add an UpdateFormCommand to the backend

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    toast.info('Form update functionality will be available soon', {
      description: 'The backend API does not currently support updating form details.',
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-muted-foreground">Loading form...</div>
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Form Not Found</h1>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-destructive mb-4">Failed to load form</p>
            <Button onClick={() => navigate('/forms')}>Back to Forms</Button>
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
          onClick={() => navigate('/forms')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forms
        </Button>
        <h1 className="text-3xl font-bold">Edit Form</h1>
        <p className="text-muted-foreground mt-2">
          Update form details. To edit the form schema, use the form builder.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Details</CardTitle>
          <CardDescription>
            Update basic information about your form
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
                disabled
              />
              <p className="text-sm text-muted-foreground mt-1">
                Form name updates are not yet supported by the API
              </p>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter form description"
                rows={3}
                disabled
              />
            </div>

            <div>
              <Label htmlFor="workspaceId">Workspace</Label>
              <select
                id="workspaceId"
                value={formData.workspaceId}
                disabled
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-muted"
              >
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
                disabled
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-muted"
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
                disabled
                className="h-4 w-4"
              />
              <Label htmlFor="isPublic" className="cursor-not-allowed opacity-50">
                Make form publicly accessible
              </Label>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Form detail updates are not yet supported by the backend API.
                To modify the form structure, use the{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => navigate(`/forms/${id}/builder`)}
                >
                  Form Builder
                </Button>
                .
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/forms')}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => navigate(`/forms/${id}/builder`)}
              >
                Go to Form Builder
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

