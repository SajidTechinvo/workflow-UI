import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { workspaceService } from '@/services/workspace-service'
import {
  Workspace,
  WorkspaceMember,
  WorkspaceRole,
  WorkspaceInvitation,
  getWorkspaceRoleLabel,
  getWorkspaceRoleColor,
  InviteWorkspaceMemberDto,
  UpdateWorkspaceMemberRoleDto,
} from '@/types/workspace'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowLeft,
  Edit,
  Users,
  UserPlus,
  Mail,
  Trash2,
  RefreshCw,
  X,
  Check,
} from 'lucide-react'
import { format } from 'date-fns'
import { useAuthStore } from '@/stores/auth-store'

export default function WorkspaceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>(WorkspaceRole.Member)

  // Fetch workspace
  const {
    data: workspace,
    isLoading: workspaceLoading,
    error: workspaceError,
  } = useQuery<Workspace>({
    queryKey: ['workspace', id],
    queryFn: () => workspaceService.getWorkspaceById(id!),
    enabled: !!id,
  })

  // Fetch members
  const {
    data: members = [],
    isLoading: membersLoading,
    refetch: refetchMembers,
  } = useQuery<WorkspaceMember[]>({
    queryKey: ['workspace-members', id],
    queryFn: () => workspaceService.getWorkspaceMembers(id!),
    enabled: !!id,
  })

  // Invite member mutation
  const inviteMutation = useMutation({
    mutationFn: (data: InviteWorkspaceMemberDto) =>
      workspaceService.inviteWorkspaceMember(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-members', id] })
      setShowInviteDialog(false)
      setInviteEmail('')
      toast.success('Invitation sent successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to send invitation', {
        description: error.response?.data?.message || 'An error occurred.',
      })
    },
  })

  // Update member role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateWorkspaceMemberRoleDto }) =>
      workspaceService.updateWorkspaceMemberRole(id!, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-members', id] })
      toast.success('Member role updated successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to update member role', {
        description: error.response?.data?.message || 'An error occurred.',
      })
    },
  })

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => workspaceService.removeWorkspaceMember(id!, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-members', id] })
      toast.success('Member removed successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to remove member', {
        description: error.response?.data?.message || 'An error occurred.',
      })
    },
  })

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address')
      return
    }
    await inviteMutation.mutateAsync({
      email: inviteEmail,
      role: inviteRole,
    })
  }

  const handleUpdateRole = async (userId: string, newRole: WorkspaceRole) => {
    await updateRoleMutation.mutateAsync({
      userId,
      data: { newRole },
    })
  }

  const handleRemoveMember = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to remove "${userName}" from this workspace?`)) {
      removeMemberMutation.mutate(userId)
    }
  }

  const currentUserMember = members.find((m) => m.userId === user?.id)
  const canManageMembers =
    currentUserMember?.role === WorkspaceRole.Owner || currentUserMember?.role === WorkspaceRole.Admin

  if (workspaceLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (workspaceError || !workspace) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/workspaces')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workspaces
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{workspace.name}</h1>
          {workspace.description && (
            <p className="text-muted-foreground mt-2">{workspace.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          {canManageMembers && (
            <Button onClick={() => setShowInviteDialog(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate(`/workspaces/${id}/edit`)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Workspace Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Workspace Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Slug:</span>{' '}
              <code className="bg-muted px-2 py-1 rounded text-xs">{workspace.slug}</code>
            </div>
            <div>
              <span className="text-muted-foreground">Owner:</span>{' '}
              {workspace.ownerName || workspace.ownerEmail || 'Unknown'}
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>{' '}
              {workspace.isActive ? (
                <Badge className="bg-green-500 text-white">Active</Badge>
              ) : (
                <Badge variant="outline">Inactive</Badge>
              )}
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>{' '}
              {format(new Date(workspace.createdAt), 'MMM dd, yyyy')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{workspace.memberCount}</div>
                <div className="text-sm text-muted-foreground">Total Members</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
          </CardHeader>
          <CardContent>
            {currentUserMember ? (
              <Badge className={`${getWorkspaceRoleColor(currentUserMember.role)} text-white`}>
                {getWorkspaceRoleLabel(currentUserMember.role)}
              </Badge>
            ) : (
              <Badge variant="outline">Not a member</Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>Manage workspace members and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          {membersLoading ? (
            <div className="flex items-center justify-center p-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No members found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    {canManageMembers && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.userName || 'Unknown User'}
                      </TableCell>
                      <TableCell>{member.userEmail || '—'}</TableCell>
                      <TableCell>
                        <Badge className={`${getWorkspaceRoleColor(member.role)} text-white`}>
                          {getWorkspaceRoleLabel(member.role)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(member.joinedAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        {member.isActive ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                      {canManageMembers && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {member.role !== WorkspaceRole.Owner && (
                              <>
                                <select
                                  value={member.role}
                                  onChange={(e) =>
                                    handleUpdateRole(member.userId, parseInt(e.target.value) as WorkspaceRole)
                                  }
                                  disabled={updateRoleMutation.isPending}
                                  className="text-xs px-2 py-1 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                  <option value={WorkspaceRole.Admin}>Admin</option>
                                  <option value={WorkspaceRole.Member}>Member</option>
                                  <option value={WorkspaceRole.Viewer}>Viewer</option>
                                </select>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveMember(
                                      member.userId,
                                      member.userName || member.userEmail || 'this member'
                                    )
                                  }
                                  disabled={removeMemberMutation.isPending}
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {member.role === WorkspaceRole.Owner && (
                              <span className="text-xs text-muted-foreground">Owner</span>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Dialog */}
      {showInviteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Invite Member</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInviteDialog(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Send an invitation to join this workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <select
                    id="role"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(parseInt(e.target.value) as WorkspaceRole)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={WorkspaceRole.Admin}>Admin</option>
                    <option value={WorkspaceRole.Member}>Member</option>
                    <option value={WorkspaceRole.Viewer}>Viewer</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowInviteDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={inviteMutation.isPending} className="flex-1">
                    {inviteMutation.isPending ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

