// @ts-nocheck
import { describe, it, expect, beforeEach, jest } from '@jest/globals'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}))

jest.mock('../src/api', () => ({
  api: { post: jest.fn(), get: jest.fn(), delete: jest.fn() },
}))

import { recipeService } from '../../shared/services/recipeServices'

const mockApi = {
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} }),
} as any

const service = recipeService(mockApi)

beforeEach(() => jest.clearAllMocks())

describe('recipeService', () => {
  it('getAll - returns list of recipes', async () => {
    mockApi.get.mockResolvedValue({ data: [{ id: 1, name: 'Salad', ingredients: [] }] })
    const result = await service.getAll()
    expect(mockApi.get).toHaveBeenCalledWith('/recipes')
    expect(result[0].name).toBe('Salad')
  })

  it('getById - returns recipe by id', async () => {
    mockApi.get.mockResolvedValue({ data: { id: 5, name: 'Soup', ingredients: [] } })
    const result = await service.getById('5')
    expect(mockApi.get).toHaveBeenCalledWith('/recipes/5')
    expect(result.name).toBe('Soup')
  })

  it('create - sends FormData', async () => {
    mockApi.post.mockResolvedValue({ data: undefined })
    await service.create({
      name: 'Test recipe',
      description: 'Description',
      image: new File([''], 'image.jpg'),
      ingredients: [{ name: 'Garlic', unit: 'pcs', amount: 2 }],
    })
    expect(mockApi.post).toHaveBeenCalledWith('/recipes', expect.any(FormData), expect.anything())
  })

  it('delete - calls DELETE /recipes/:id', async () => {
    mockApi.delete.mockResolvedValue({ data: undefined })
    await service.delete('99')
    expect(mockApi.delete).toHaveBeenCalledWith('/recipes/99')
  })
})