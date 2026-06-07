// @ts-nocheck
import { describe, it, expect, beforeEach, jest } from '@jest/globals'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}))

jest.mock('../src/api', () => ({
  api: { post: jest.fn(), get: jest.fn(), patch: jest.fn() },
}))

import { userService } from '../../shared/services/userServices'

const mockApi = {
  post: jest.fn().mockResolvedValue({ data: {} }),
  get: jest.fn().mockResolvedValue({ data: {} }),
  patch: jest.fn().mockResolvedValue({ data: {} }),
} as any

const service = userService(mockApi)

beforeEach(() => jest.clearAllMocks())

describe('userService', () => {
  it('login - returns token and data', async () => {
    mockApi.post.mockResolvedValue({
      data: { id: 1, username: '123', email: '124', token: 'abc123' }
    })
    const result = await service.login({ username: '123', email: '124', password: '123' })
    expect(result.token).toBeDefined()
    expect(result.id).toBe(1)
  })

  it('getMe - calls GET /user/me', async () => {
    mockApi.get.mockResolvedValue({ data: { id: 1, username: 'ana', email: 'ana@test.com' } })
    const result = await service.getMe()
    expect(mockApi.get).toHaveBeenCalledWith('/user/me')
    expect(result.username).toBe('ana')
  })
  it('register - calls POST /user/register', async () => {
    mockApi.post.mockResolvedValue({ data: undefined })
    await service.register({ username: 'ana', email: 'ana@test.com', password: '123' })
    expect(mockApi.post).toHaveBeenCalledWith('/user/register', {
        username: 'ana', email: 'ana@test.com', password: '123'
    })
  })

  it('updateMe - calls PATCH /user/me', async () => {
    mockApi.patch.mockResolvedValue({ data: undefined })
    await service.updateMe({ username: 'nova' })
    expect(mockApi.patch).toHaveBeenCalledWith('/user/me', { username: 'nova' })
  })
})