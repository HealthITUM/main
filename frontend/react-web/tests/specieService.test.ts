import { describe, it, expect, vi, beforeEach } from 'vitest'
import { specieService } from '@project/frontend-shared/speciesServices'
import type { AxiosInstance } from 'axios'

const mockApi = {
  get: vi.fn(),
} as unknown as AxiosInstance

const service = specieService(mockApi)

beforeEach(() => vi.clearAllMocks())

describe('specieService', () => {
  it('getAll - returns list of species', async () => {
    mockApi.get = vi.fn().mockResolvedValue({ data: [{ id: 1, name: 'Monstera' }] })
    const result = await service.getAll()
    expect(mockApi.get).toHaveBeenCalledWith('/species')
    expect(result[0].name).toBe('Monstera')
  })

  it('getById - returns species by id', async () => {
    mockApi.get = vi.fn().mockResolvedValue({ data: { id: 3, name: 'Cactus' } })
    const result = await service.getById('3')
    expect(mockApi.get).toHaveBeenCalledWith('/species/3')
    expect(result.name).toBe('Cactus')
  })
})