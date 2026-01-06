import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { formService } from '@/services/form-service'
import { Form, FormField, FieldType, UpdateFormSchemaDto } from '@/types/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Eye,
  FileText,
  Mail,
  Hash,
  Calendar,
  Type,
  List,
  CheckSquare,
  Radio,
  Upload,
} from 'lucide-react'

const fieldTypeIcons = {
  [FieldType.Text]: Type,
  [FieldType.Email]: Mail,
  [FieldType.Number]: Hash,
  [FieldType.Date]: Calendar,
  [FieldType.TextArea]: FileText,
  [FieldType.Select]: List,
  [FieldType.MultiSelect]: List,
  [FieldType.Checkbox]: CheckSquare,
  [FieldType.Radio]: Radio,
  [FieldType.File]: Upload,
}

export default function FormBuilderPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [fields, setFields] = useState<FormField[]>([])
  const [isMultiStep, setIsMultiStep] = useState(false)
  const [theme, setTheme] = useState('')
  const [successMessage, setSuccessMessage] = useState('Thank you for your submission!')
  const [redirectUrl, setRedirectUrl] = useState('')

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

  // Initialize fields from schema
  useEffect(() => {
    if (form?.schema) {
      setFields(form.schema.fields || [])
      setIsMultiStep(form.schema.isMultiStep || false)
      setTheme(form.schema.theme || '')
      setSuccessMessage(form.schema.successMessage || 'Thank you for your submission!')
      setRedirectUrl(form.schema.redirectUrl || '')
    }
  }, [form])

  // Update schema mutation
  const updateSchemaMutation = useMutation({
    mutationFn: (data: UpdateFormSchemaDto) => formService.updateFormSchema(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form', id] })
      toast.success('Form schema updated successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to update form schema', {
        description: error.response?.data?.message || 'An error occurred.',
      })
    },
  })

  // Publish form mutation
  const publishMutation = useMutation({
    mutationFn: () => formService.publishForm(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form', id] })
      queryClient.invalidateQueries({ queryKey: ['forms'] })
      toast.success('Form published successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to publish form', {
        description: error.response?.data?.message || 'An error occurred.',
      })
    },
  })

  const addField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      formSchemaId: form?.schema?.id || '',
      name: `field_${fields.length + 1}`,
      label: `Field ${fields.length + 1}`,
      fieldType: FieldType.Text,
      isRequired: false,
      displayOrder: fields.length,
      isVisible: true,
      createdAt: new Date().toISOString(),
    }
    setFields([...fields, newField])
  }

  const removeField = (fieldId: string) => {
    setFields(fields.filter((f) => f.id !== fieldId))
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(
      fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f))
    )
  }

  const handleSave = async () => {
    const schemaDefinition = JSON.stringify({
      fields: fields.map((f) => ({
        id: f.id,
        name: f.name,
        label: f.label,
        fieldType: f.fieldType,
        isRequired: f.isRequired,
        placeholder: f.placeholder,
        helpText: f.helpText,
        defaultValue: f.defaultValue,
        validationRules: f.validationRules,
        options: f.options,
        displayOrder: f.displayOrder,
        isVisible: f.isVisible,
        conditionalLogic: f.conditionalLogic,
      })),
    })

    await updateSchemaMutation.mutateAsync({
      schemaDefinition,
      isMultiStep,
      theme,
      successMessage,
      redirectUrl,
    })
  }

  const handlePublish = async () => {
    if (!form?.schema) {
      toast.error('Please save the form schema first')
      return
    }
    await publishMutation.mutateAsync()
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/forms')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forms
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{form.name}</h1>
          <p className="text-muted-foreground mt-2">Build your form schema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/forms/${id}/preview`)}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={updateSchemaMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateSchemaMutation.isPending ? 'Saving...' : 'Save Schema'}
          </Button>
          {!form.isPublished && (
            <Button onClick={handlePublish} disabled={publishMutation.isPending}>
              {publishMutation.isPending ? 'Publishing...' : 'Publish Form'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Builder */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Fields</CardTitle>
              <CardDescription>Add and configure form fields</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fields.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No fields yet. Add your first field to get started.</p>
                  </div>
                ) : (
                  fields.map((field, index) => {
                    const Icon = fieldTypeIcons[field.fieldType] || Type
                    return (
                      <Card key={field.id} className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">Field {index + 1}</span>
                            {field.isRequired && (
                              <Badge variant="outline" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeField(field.id)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label>Field Label</Label>
                            <Input
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              placeholder="Enter field label"
                            />
                          </div>
                          <div>
                            <Label>Field Name</Label>
                            <Input
                              value={field.name}
                              onChange={(e) => updateField(field.id, { name: e.target.value })}
                              placeholder="Enter field name (snake_case)"
                            />
                          </div>
                          <div>
                            <Label>Field Type</Label>
                            <select
                              value={field.fieldType}
                              onChange={(e) =>
                                updateField(field.id, {
                                  fieldType: parseInt(e.target.value) as FieldType,
                                })
                              }
                              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value={FieldType.Text}>Text</option>
                              <option value={FieldType.Email}>Email</option>
                              <option value={FieldType.Number}>Number</option>
                              <option value={FieldType.Date}>Date</option>
                              <option value={FieldType.TextArea}>Text Area</option>
                              <option value={FieldType.Select}>Select</option>
                              <option value={FieldType.MultiSelect}>Multi Select</option>
                              <option value={FieldType.Checkbox}>Checkbox</option>
                              <option value={FieldType.Radio}>Radio</option>
                              <option value={FieldType.File}>File</option>
                            </select>
                          </div>
                          <div>
                            <Label>Placeholder</Label>
                            <Input
                              value={field.placeholder || ''}
                              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                              placeholder="Enter placeholder text"
                            />
                          </div>
                          <div>
                            <Label>Help Text</Label>
                            <Textarea
                              value={field.helpText || ''}
                              onChange={(e) => updateField(field.id, { helpText: e.target.value })}
                              placeholder="Enter help text"
                              rows={2}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`required-${field.id}`}
                              checked={field.isRequired}
                              onChange={(e) => updateField(field.id, { isRequired: e.target.checked })}
                              className="h-4 w-4"
                            />
                            <Label htmlFor={`required-${field.id}`} className="cursor-pointer">
                              Required field
                            </Label>
                          </div>
                        </div>
                      </Card>
                    )
                  })
                )}
                <Button onClick={addField} variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Field
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isMultiStep"
                  checked={isMultiStep}
                  onChange={(e) => setIsMultiStep(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="isMultiStep" className="cursor-pointer">
                  Multi-step form
                </Label>
              </div>
              <div>
                <Label>Success Message</Label>
                <Textarea
                  value={successMessage}
                  onChange={(e) => setSuccessMessage(e.target.value)}
                  placeholder="Thank you for your submission!"
                  rows={3}
                />
              </div>
              <div>
                <Label>Redirect URL (optional)</Label>
                <Input
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  placeholder="https://example.com/thank-you"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Status:</span>{' '}
                {form.isPublished ? (
                  <Badge className="bg-green-500 text-white">Published</Badge>
                ) : (
                  <Badge variant="outline">Draft</Badge>
                )}
              </div>
              <div>
                <span className="text-muted-foreground">Submissions:</span>{' '}
                {form.currentSubmissions}
                {form.maxSubmissions && ` / ${form.maxSubmissions}`}
              </div>
              {form.publicUrl && (
                <div>
                  <span className="text-muted-foreground">Public URL:</span>{' '}
                  <a
                    href={form.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {form.publicUrl}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

