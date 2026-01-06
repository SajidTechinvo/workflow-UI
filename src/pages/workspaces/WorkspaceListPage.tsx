import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { workspaceService } from '@/services/workspace-service'
import { Workspace } from '@/types/workspace'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Building2,
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

type SortField = 'name' | 'memberCount' | 'createdAt' | 'updatedAt'
type SortDirection = 'asc' | 'desc'

export default function WorkspaceListPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('updatedAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Fetch workspaces
  const {
    data: workspaces = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Workspace[]>({
    queryKey: ['workspaces', user?.id],
    queryFn: () => workspaceService.getUserWorkspaces(user!.id),
    enabled: !!user?.id,
  })

  // Delete workspace mutation
  const deleteWorkspaceMutation = useMutation({
    mutationFn: (id: string) => workspaceService.deleteWorkspace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      toast.success('Workspace deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete workspace')
    },
  })

  // Filter and sort workspaces
  const filteredAndSortedWorkspaces = useMemo(() => {
    let filtered = workspaces

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (w) =>
          w.name.toLowerCase().includes(term) ||
          w.description?.toLowerCase().includes(term) ||
          w.slug.toLowerCase().includes(term)
      )
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'memberCount':
          aValue = a.memberCount
          bValue = b.memberCount
          break
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        case 'updatedAt':
          aValue = new Date(a.updatedAt || a.createdAt).getTime()
          bValue = new Date(b.updatedAt || b.createdAt).getTime()
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [workspaces, searchTerm, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      deleteWorkspaceMutation.mutate(id)
    }
  }

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        {sortField === field && (
          <span className="text-xs text-muted-foreground">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </TableHead>
  )

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground mt-2">Manage your workspaces</p>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-destructive mb-4">Failed to load workspaces</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground mt-2">Manage your workspaces and team members</p>
        </div>
        <Button onClick={() => navigate('/workspaces/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Workspace
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search workspaces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Refresh Button */}
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Workspaces Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredAndSortedWorkspaces.length} Workspace
            {filteredAndSortedWorkspaces.length !== 1 ? 's' : ''}
          </CardTitle>
          <CardDescription>Your workspaces are listed below</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredAndSortedWorkspaces.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No workspaces found</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                {searchTerm
                  ? 'Try adjusting your search'
                  : 'Get started by creating your first workspace'}
              </p>
              {!searchTerm && (
                <Button onClick={() => navigate('/workspaces/new')} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Workspace
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableHeader field="name">Name</SortableHeader>
                    <TableHead>Slug</TableHead>
                    <TableHead>Owner</TableHead>
                    <SortableHeader field="memberCount">Members</SortableHeader>
                    <TableHead>Status</TableHead>
                    <SortableHeader field="updatedAt">Last Updated</SortableHeader>
                    <SortableHeader field="createdAt">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedWorkspaces.map((workspace) => (
                    <TableRow key={workspace.id}>
                      <TableCell className="font-medium">
                        <div>
                          <Link
                            to={`/workspaces/${workspace.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {workspace.name}
                          </Link>
                          {workspace.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {workspace.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{workspace.slug}</code>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {workspace.ownerName || workspace.ownerEmail || 'Unknown'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{workspace.memberCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {workspace.isActive ? (
                          <Badge className="bg-green-500 text-white">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {workspace.updatedAt
                          ? format(new Date(workspace.updatedAt), 'MMM dd, yyyy')
                          : format(new Date(workspace.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(workspace.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/workspaces/${workspace.id}`)}
                            className="h-8 w-8 p-0"
                            title="View Workspace"
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/workspaces/${workspace.id}/edit`)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(workspace.id, workspace.name)}
                            disabled={deleteWorkspaceMutation.isPending}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

