import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { formService } from '@/services/form-service'
import {
  Form,
  FormAccessType,
  getFormAccessTypeLabel,
  getFormAccessTypeColor,
} from '@/types/form'
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
  Eye,
  ExternalLink,
  Filter,
  ArrowUpDown,
  RefreshCw,
  FileText,
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

type SortField = 'name' | 'accessType' | 'isPublished' | 'createdAt' | 'updatedAt'
type SortDirection = 'asc' | 'desc'

export default function FormListPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [searchTerm, setSearchTerm] = useState('')
  const [accessTypeFilter, setAccessTypeFilter] = useState<FormAccessType | 'all'>('all')
  const [publishedFilter, setPublishedFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [sortField, setSortField] = useState<SortField>('updatedAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Fetch forms
  const {
    data: forms = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Form[]>({
    queryKey: ['forms', user?.id],
    queryFn: () => formService.getUserForms(user!.id),
    enabled: !!user?.id,
  })

  // Delete form mutation
  const deleteFormMutation = useMutation({
    mutationFn: (id: string) => formService.deleteForm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] })
      toast.success('Form deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete form')
    },
  })

  // Filter and sort forms
  const filteredAndSortedForms = useMemo(() => {
    let filtered = forms

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(term) ||
          f.description?.toLowerCase().includes(term)
      )
    }

    // Apply access type filter
    if (accessTypeFilter !== 'all') {
      filtered = filtered.filter((f) => f.accessType === accessTypeFilter)
    }

    // Apply published filter
    if (publishedFilter !== 'all') {
      filtered = filtered.filter((f) =>
        publishedFilter === 'published' ? f.isPublished : !f.isPublished
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
        case 'accessType':
          aValue = a.accessType
          bValue = b.accessType
          break
        case 'isPublished':
          aValue = a.isPublished ? 1 : 0
          bValue = b.isPublished ? 1 : 0
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
  }, [forms, searchTerm, accessTypeFilter, publishedFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteFormMutation.mutate(id)
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
          <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
          <p className="text-muted-foreground mt-2">Manage your forms and surveys</p>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-destructive mb-4">Failed to load forms</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
          <p className="text-muted-foreground mt-2">Manage your forms and surveys</p>
        </div>
        <Button onClick={() => navigate('/forms/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Form
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
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Access Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={accessTypeFilter}
                onChange={(e) => setAccessTypeFilter(e.target.value as FormAccessType | 'all')}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Access Types</option>
                <option value={FormAccessType.Public}>Public</option>
                <option value={FormAccessType.Private}>Private</option>
                <option value={FormAccessType.DomainRestricted}>Domain Restricted</option>
              </select>
            </div>

            {/* Published Filter */}
            <div className="flex items-center gap-2">
              <select
                value={publishedFilter}
                onChange={(e) => setPublishedFilter(e.target.value as 'all' | 'published' | 'draft')}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
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

      {/* Forms Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredAndSortedForms.length} Form{filteredAndSortedForms.length !== 1 ? 's' : ''}
          </CardTitle>
          <CardDescription>Your forms are listed below</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredAndSortedForms.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No forms found</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                {searchTerm || accessTypeFilter !== 'all' || publishedFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Get started by creating your first form'}
              </p>
              {!searchTerm && accessTypeFilter === 'all' && publishedFilter === 'all' && (
                <Button onClick={() => navigate('/forms/new')} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Form
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableHeader field="name">Name</SortableHeader>
                    <TableHead>Access Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submissions</TableHead>
                    <SortableHeader field="updatedAt">Last Updated</SortableHeader>
                    <SortableHeader field="createdAt">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedForms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="font-medium">
                        <div>
                          <Link
                            to={`/forms/${form.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {form.name}
                          </Link>
                          {form.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {form.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getFormAccessTypeColor(form.accessType)} text-white`}
                        >
                          {getFormAccessTypeLabel(form.accessType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {form.isPublished ? (
                          <Badge className="bg-green-500 text-white">Published</Badge>
                        ) : (
                          <Badge variant="outline">Draft</Badge>
                        )}
                        {!form.isAcceptingSubmissions && (
                          <Badge variant="outline" className="ml-2">
                            Closed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {form.currentSubmissions}
                            {form.maxSubmissions && ` / ${form.maxSubmissions}`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {form.updatedAt
                          ? format(new Date(form.updatedAt), 'MMM dd, yyyy')
                          : format(new Date(form.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(form.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {form.publicUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(form.publicUrl, '_blank')}
                              className="h-8 w-8 p-0"
                              title="View Public Form"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/forms/${form.id}/builder`)}
                            className="h-8 w-8 p-0"
                            title="Edit Form"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/forms/${form.id}/edit`)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(form.id, form.name)}
                            disabled={deleteFormMutation.isPending}
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

