import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { formService } from '@/services/form-service'
import { Form, FormField, FieldType, SubmitFormDto } from '@/types/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default function FormPreviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [submitted, setSubmitted] = useState(false)
  const [accessPassword, setAccessPassword] = useState('')

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

  // Submit form mutation
  const submitMutation = useMutation({
    mutationFn: (data: SubmitFormDto) => formService.submitForm(id!, data),
    onSuccess: () => {
      setSubmitted(true)
      toast.success('Form submitted successfully!')
    },
    onError: (error: any) => {
      toast.error('Failed to submit form', {
        description: error.response?.data?.message || 'An error occurred.',
      })
    },
  })

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData({ ...formData, [fieldName]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitMutation.mutateAsync({
      data: formData,
      accessPassword: accessPassword || undefined,
    })
  }

  const renderField = (field: FormField) => {
    const value = formData[field.name] || field.defaultValue || ''

    switch (field.fieldType) {
      case FieldType.Text:
      case FieldType.Email:
      case FieldType.Number:
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type={
                field.fieldType === FieldType.Email
                  ? 'email'
                  : field.fieldType === FieldType.Number
                  ? 'number'
                  : 'text'
              }
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.isRequired}
            />
            {field.helpText && (
              <p className="text-sm text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        )

      case FieldType.TextArea:
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={field.name}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.isRequired}
              rows={4}
            />
            {field.helpText && (
              <p className="text-sm text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        )

      case FieldType.Select:
        const options = field.options ? JSON.parse(field.options) : []
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            <select
              id={field.name}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.isRequired}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select an option</option>
              {Array.isArray(options) &&
                options.map((option: string, index: number) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
            </select>
            {field.helpText && (
              <p className="text-sm text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        )

      case FieldType.Checkbox:
        return (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={field.name}
                checked={value === true || value === 'true'}
                onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                required={field.isRequired}
                className="h-4 w-4"
              />
              <Label htmlFor={field.name} className="cursor-pointer">
                {field.label}
                {field.isRequired && <span className="text-destructive ml-1">*</span>}
              </Label>
            </div>
            {field.helpText && (
              <p className="text-sm text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        )

      case FieldType.Date:
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type="date"
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              required={field.isRequired}
            />
            {field.helpText && (
              <p className="text-sm text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        )

      default:
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.isRequired}
            />
            {field.helpText && (
              <p className="text-sm text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        )
    }
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

  if (submitted) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Form Submitted Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              {form.schema?.successMessage || 'Thank you for your submission!'}
            </p>
            {form.schema?.redirectUrl ? (
              <Button onClick={() => (window.location.href = form.schema!.redirectUrl!)}>
                Continue
              </Button>
            ) : (
              <Button onClick={() => navigate('/forms')}>Back to Forms</Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const fields = form.schema?.fields || []

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/forms')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forms
        </Button>
        <h1 className="text-3xl font-bold">{form.name}</h1>
        {form.description && (
          <p className="text-muted-foreground mt-2">{form.description}</p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Preview</CardTitle>
          <CardDescription>Preview and test your form</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field) => renderField(field))}

            {form.accessPassword && (
              <div className="space-y-2">
                <Label htmlFor="accessPassword">Access Password</Label>
                <Input
                  id="accessPassword"
                  type="password"
                  value={accessPassword}
                  onChange={(e) => setAccessPassword(e.target.value)}
                  placeholder="Enter access password"
                  required
                />
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/forms')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitMutation.isPending}>
                {submitMutation.isPending ? 'Submitting...' : 'Submit Form'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

