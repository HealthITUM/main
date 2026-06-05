import { describe, it, expect, vi, beforeEach } from 'vitest'
import { recipeService } from '@project/frontend-shared/recipeServices'
import type { AxiosInstance } from 'axios'

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
} as unknown as AxiosInstance

const service = recipeService(mockApi)

beforeEach(() => vi.clearAllMocks())

describe('recipeService', () => {
  it('getAll - returns list of recipes', async () => {
    mockApi.get = vi.fn().mockResolvedValue({ data: [{ id: 1, name: 'Salad', ingredients: [] }] })
    const result = await service.getAll()
    expect(mockApi.get).toHaveBeenCalledWith('/recipes')
    expect(result[0].name).toBe('Salad')
  })

  it('getById - returns recipe by id', async () => {
    mockApi.get = vi.fn().mockResolvedValue({ data: { id: 5, name: 'Soup', ingredients: [] } })
    const result = await service.getById('5')
    expect(mockApi.get).toHaveBeenCalledWith('/recipes/5')
    expect(result.name).toBe('Soup')
  })

  it('create - sends FormData to POST /recipes', async () => {
    mockApi.post = vi.fn().mockResolvedValue({ data: undefined })
    await service.create({
      name: 'Test recipe',
      description: 'Description',
      image: new File([''], 'image.jpg'),
      ingredients: [{ name: 'Garlic', unit: 'pcs', amount: 2 }],
    })
    expect(mockApi.post).toHaveBeenCalledWith('/recipes', expect.any(FormData), expect.anything())
  })

  it('delete - calls DELETE /recipes/:id', async () => {
    mockApi.delete = vi.fn().mockResolvedValue({ data: undefined })
    await service.delete('99')
    expect(mockApi.delete).toHaveBeenCalledWith('/recipes/99')
  })
})