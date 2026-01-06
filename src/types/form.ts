export enum FormAccessType {
  Public = 0,
  Private = 1,
  DomainRestricted = 2,
}

export enum FieldType {
  Text = 0,
  Email = 1,
  Number = 2,
  Date = 3,
  TextArea = 4,
  Select = 5,
  MultiSelect = 6,
  Checkbox = 7,
  Radio = 8,
  File = 9,
}

export interface FormField {
  id: string
  formSchemaId: string
  formStepId?: string
  name: string
  label: string
  fieldType: FieldType
  isRequired: boolean
  placeholder?: string
  helpText?: string
  defaultValue?: string
  validationRules?: string
  options?: string
  displayOrder: number
  isVisible: boolean
  conditionalLogic?: string
  createdAt: string
  updatedAt?: string
}

export interface FormStep {
  id: string
  formSchemaId: string
  stepNumber: number
  title: string
  description?: string
  isRequired: boolean
  conditionalLogic?: string
  fields?: FormField[]
  createdAt: string
  updatedAt?: string
}

export interface FormSchema {
  id: string
  formId: string
  schemaDefinition: string
  isMultiStep: boolean
  theme?: string
  customCss?: string
  successMessage?: string
  redirectUrl?: string
  steps?: FormStep[]
  fields?: FormField[]
  createdAt: string
  updatedAt?: string
}

export interface Form {
  id: string
  name: string
  description?: string
  workspaceId: string
  createdById: string
  workflowId?: string
  n8nWorkflowId?: string
  accessType: FormAccessType
  isPublic: boolean
  publicSlug?: string
  publicUrl?: string
  accessPassword?: string
  allowedDomains?: string[]
  maxSubmissions?: number
  currentSubmissions: number
  acceptsUntil?: string
  isAcceptingSubmissions: boolean
  isPublished: boolean
  publishedAt?: string
  createdAt: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
  schema?: FormSchema
}

export interface FormSubmission {
  id: string
  formId: string
  workflowExecutionId?: string
  submissionData: Record<string, any>
  ipAddress?: string
  userAgent?: string
  referrer?: string
  submittedAt: string
  submittedById?: string
  createdAt: string
  updatedAt?: string
}

export interface CreateFormDto {
  name: string
  description?: string
  workspaceId: string
  workflowId?: string
  accessType?: FormAccessType
  isPublic?: boolean
  accessPassword?: string
  allowedDomains?: string[]
  maxSubmissions?: number
  acceptsUntil?: string
}

export interface UpdateFormSchemaDto {
  schemaDefinition: string
  isMultiStep: boolean
  theme?: string
  customCss?: string
  successMessage?: string
  redirectUrl?: string
}

export interface SubmitFormDto {
  data: Record<string, any>
  accessPassword?: string
}

export const getFormAccessTypeLabel = (accessType: FormAccessType): string => {
  switch (accessType) {
    case FormAccessType.Public:
      return 'Public'
    case FormAccessType.Private:
      return 'Private'
    case FormAccessType.DomainRestricted:
      return 'Domain Restricted'
    default:
      return 'Unknown'
  }
}

export const getFormAccessTypeColor = (accessType: FormAccessType): string => {
  switch (accessType) {
    case FormAccessType.Public:
      return 'bg-green-500'
    case FormAccessType.Private:
      return 'bg-blue-500'
    case FormAccessType.DomainRestricted:
      return 'bg-yellow-500'
    default:
      return 'bg-gray-500'
  }
}

export const getFieldTypeLabel = (fieldType: FieldType): string => {
  switch (fieldType) {
    case FieldType.Text:
      return 'Text'
    case FieldType.Email:
      return 'Email'
    case FieldType.Number:
      return 'Number'
    case FieldType.Date:
      return 'Date'
    case FieldType.TextArea:
      return 'Text Area'
    case FieldType.Select:
      return 'Select'
    case FieldType.MultiSelect:
      return 'Multi Select'
    case FieldType.Checkbox:
      return 'Checkbox'
    case FieldType.Radio:
      return 'Radio'
    case FieldType.File:
      return 'File'
    default:
      return 'Unknown'
  }
}

