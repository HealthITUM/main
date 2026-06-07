// @ts-nocheck
import { describe, it, expect, beforeEach, jest } from '@jest/globals'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}))

jest.mock('../src/api', () => ({
  api: { get: jest.fn() },
}))

import { specieService } from '../../shared/services/speciesServices'

const mockApi = {
  get: jest.fn().mockResolvedValue({ data: {} }),
} as any

const service = specieService(mockApi)

beforeEach(() => jest.clearAllMocks())

describe('specieService', () => {
  it('getAll - returns list of species', async () => {
    mockApi.get.mockResolvedValue({ data: [{ id: 1, name: 'Monstera' }] })
    const result = await service.getAll()
    expect(mockApi.get).toHaveBeenCalledWith('/species')
    expect(result[0].name).toBe('Monstera')
  })

  it('getById - returns species by id', async () => {
    mockApi.get.mockResolvedValue({ data: { id: 3, name: 'Cactus' } })
    const result = await service.getById('3')
    expect(mockApi.get).toHaveBeenCalledWith('/species/3')
    expect(result.name).toBe('Cactus')
  })
})