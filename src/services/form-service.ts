import apiClient from '@/lib/api'
import {
  Form,
  CreateFormDto,
  UpdateFormSchemaDto,
  SubmitFormDto,
  FormSubmission,
} from '@/types/form'

export const formService = {
  async getUserForms(userId: string): Promise<Form[]> {
    const response = await apiClient.get<Form[]>(`/forms/user/${userId}`)
    return response.data
  },

  async getFormById(id: string): Promise<Form> {
    const response = await apiClient.get<Form>(`/forms/${id}`)
    return response.data
  },

  async getPublicForm(slug: string): Promise<Form> {
    const response = await apiClient.get<Form>(`/forms/public/${slug}`)
    return response.data
  },

  async createForm(data: CreateFormDto): Promise<Form> {
    const response = await apiClient.post<Form>('/forms', data)
    return response.data
  },

  async updateFormSchema(id: string, data: UpdateFormSchemaDto): Promise<Form['schema']> {
    const response = await apiClient.put<Form['schema']>(`/forms/${id}/schema`, data)
    return response.data
  },

  async publishForm(id: string): Promise<Form> {
    const response = await apiClient.post<Form>(`/forms/${id}/publish`)
    return response.data
  },

  async deleteForm(id: string): Promise<void> {
    await apiClient.delete(`/forms/${id}`)
  },

  async submitForm(formId: string, data: SubmitFormDto): Promise<FormSubmission> {
    const response = await apiClient.post<FormSubmission>(`/forms/${formId}/submit`, data)
    return response.data
  },

  async getFormSubmissions(formId: string): Promise<FormSubmission[]> {
    const response = await apiClient.get<FormSubmission[]>(`/forms/${formId}/submissions`)
    return response.data
  },
}

