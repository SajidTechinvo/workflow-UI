import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { workspaceService } from '@/services/workspace-service'
import { CreateWorkflowDto, UpdateWorkflowDto, WorkflowStatus } from '@/types/workflow'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

const workflowSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  workspaceId: z.string().min(1, 'Workspace is required'),
  status: z.nativeEnum(WorkflowStatus).optional(),
  tags: z.string().optional(),
})

type WorkflowFormData = z.infer<typeof workflowSchema>

interface WorkflowFormProps {
  initialData?: Partial<CreateWorkflowDto>
  onSubmit: (data: CreateWorkflowDto | UpdateWorkflowDto) => Promise<void>
  isLoading?: boolean
  isEdit?: boolean
}

export function WorkflowForm({ initialData, onSubmit, isLoading = false, isEdit = false }: WorkflowFormProps) {
  const { user } = useAuthStore()

  // Fetch user workspaces
  const { data: workspaces = [], isLoading: isLoadingWorkspaces } = useQuery({
    queryKey: ['workspaces', user?.id],
    queryFn: () => (user ? workspaceService.getUserWorkspaces(user.id) : Promise.resolve([])),
    enabled: !!user,
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WorkflowFormData>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      workspaceId: initialData?.workspaceId || workspaces[0]?.id || '',
      status: initialData?.status ?? WorkflowStatus.Draft,
      tags: initialData?.tags?.join(', ') || '',
    },
  })

  const selectedWorkspaceId = watch('workspaceId')
  const selectedStatus = watch('status')

  // Set default workspace when workspaces load
  useEffect(() => {
    if (workspaces.length > 0 && !selectedWorkspaceId) {
      setValue('workspaceId', workspaces[0].id)
    }
  }, [workspaces, selectedWorkspaceId, setValue])

  // Set initial workspace from initialData
  useEffect(() => {
    if (initialData?.workspaceId) {
      setValue('workspaceId', initialData.workspaceId)
    }
  }, [initialData?.workspaceId, setValue])

  const onSubmitForm = async (data: WorkflowFormData) => {
    const tagsArray = data.tags
      ?.split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0) || []

    if (isEdit) {
      const updateData: UpdateWorkflowDto = {
        name: data.name,
        description: data.description || undefined,
        status: data.status,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      }
      await onSubmit(updateData)
    } else {
      const createData: CreateWorkflowDto = {
        name: data.name,
        description: data.description || undefined,
        workspaceId: data.workspaceId,
        status: data.status,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      }
      await onSubmit(createData)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Enter workflow name..."
          className="border-border/50 focus:border-primary transition-colors"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Enter workflow description..."
          className="border-border/50 focus:border-primary transition-colors min-h-[100px]"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {!isEdit && (
        <div className="space-y-2">
          <Label htmlFor="workspaceId" className="text-sm font-medium">
            Workspace <span className="text-destructive">*</span>
          </Label>
          <Select
            value={selectedWorkspaceId}
            onValueChange={(value) => setValue('workspaceId', value)}
            disabled={isLoadingWorkspaces}
          >
            <SelectTrigger className="border-border/50 focus:border-primary transition-colors">
              <SelectValue placeholder="Select a workspace..." />
            </SelectTrigger>
            <SelectContent>
              {workspaces.map((workspace) => (
                <SelectItem key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.workspaceId && (
            <p className="text-sm text-destructive">{errors.workspaceId.message}</p>
          )}
          {isLoadingWorkspaces && (
            <p className="text-sm text-muted-foreground">Loading workspaces...</p>
          )}
          {!isLoadingWorkspaces && workspaces.length === 0 && (
            <p className="text-sm text-muted-foreground">No workspaces available</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="status" className="text-sm font-medium">
          Status
        </Label>
        <Select
          value={selectedStatus?.toString()}
          onValueChange={(value) => setValue('status', parseInt(value) as WorkflowStatus)}
        >
          <SelectTrigger className="border-border/50 focus:border-primary transition-colors">
            <SelectValue placeholder="Select status..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={WorkflowStatus.Draft.toString()}>Draft</SelectItem>
            <SelectItem value={WorkflowStatus.Active.toString()}>Active</SelectItem>
            <SelectItem value={WorkflowStatus.Paused.toString()}>Paused</SelectItem>
            <SelectItem value={WorkflowStatus.Archived.toString()}>Archived</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-sm text-destructive">{errors.status.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags" className="text-sm font-medium">
          Tags
        </Label>
        <Input
          id="tags"
          placeholder="Enter tags separated by commas (e.g., marketing, automation)"
          className="border-border/50 focus:border-primary transition-colors"
          {...register('tags')}
        />
        <p className="text-xs text-muted-foreground">
          Separate multiple tags with commas
        </p>
        {errors.tags && (
          <p className="text-sm text-destructive">{errors.tags.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" disabled={isLoading || isLoadingWorkspaces}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? 'Update Workflow' : 'Create Workflow'}
        </Button>
      </div>
    </form>
  )
}

