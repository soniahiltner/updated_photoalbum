import config from '../config'

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

class APIClient {
  private static instance: APIClient
  private baseUrl: string

  private constructor(baseUrl: string = config.apiUrl) {
    this.baseUrl = baseUrl
  }

  static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient()
    }
    return APIClient.instance
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): string {
    const url = new URL(`${this.baseUrl}${endpoint}`)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }

    return url.toString()
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options
    const url = this.buildUrl(endpoint, params)

    try {
      const response = await fetch(url, fetchOptions)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.error ||
            errorData.message ||
            `HTTP error! status: ${response.status}`
        )
      }

      return response.json()
    } catch (error) {
      console.error('API request error:', error)
      throw error
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      params
    })
  }

  async post<T>(
    endpoint: string,
    data?: Record<string, unknown> | FormData
  ): Promise<T> {
    const isFormData = data instanceof FormData

    return this.request<T>(endpoint, {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data)
    })
  }

  async patch<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Export singleton instance
export const apiClient = APIClient.getInstance()
