import { describe, it, expect, vi, beforeEach } from 'vitest'
import { userService } from '@project/frontend-shared/userServices'
import type { AxiosInstance } from 'axios'

const mockApi = {
  post: vi.fn(),
  get: vi.fn(),
  patch: vi.fn(),
} as unknown as AxiosInstance

const service = userService(mockApi)

beforeEach(() => vi.clearAllMocks())

describe('userService', () => {
  it('login - returns token and data', async () => {
    mockApi.post = vi.fn().mockResolvedValue({
      data: { id: 1, username: '123', email: '124', token: 'abc123' }
    })
    const result = await service.login({ username: '123', email: '124', password: '123' })
    expect(result.token).toBeDefined()
    expect(result.id).toBe(1)
  })

  it('getMe - calls GET /user/me', async () => {
    mockApi.get = vi.fn().mockResolvedValue({ data: { id: 1, username: 'ana', email: 'ana@test.com' } })
    const result = await service.getMe()
    expect(mockApi.get).toHaveBeenCalledWith('/user/me')
    expect(result.username).toBe('ana')
  })
  it('register - calls POST /user/register', async () => {
    mockApi.post = vi.fn().mockResolvedValue({ data: undefined })
    await service.register({ username: 'ana', email: 'ana@test.com', password: '123' })
    expect(mockApi.post).toHaveBeenCalledWith('/user/register', {
        username: 'ana', email: 'ana@test.com', password: '123'
    })
  })
  it('updateMe - calls PATCH /user/me', async () => {
    mockApi.patch = vi.fn().mockResolvedValue({ data: undefined })
    await service.updateMe({ username: 'nova' })
    expect(mockApi.patch).toHaveBeenCalledWith('/user/me', { username: 'nova' })
  })
})