// @ts-nocheck
import { describe, it, expect, beforeEach, jest } from '@jest/globals'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}))

jest.mock('../src/api', () => ({
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}))

import { userPlantService } from '@project/frontend-shared/userPlantsServices'

const mockApi = {
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  patch: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} }),
} as any

const service = userPlantService(mockApi)

beforeEach(() => jest.clearAllMocks())

describe('userPlantService', () => {
  it('getAll - returns list of plants', async () => {
    mockApi.get.mockResolvedValue({ data: [{ id: 1, name: 'Ficus' }] })
    const result = await service.getAll()
    expect(mockApi.get).toHaveBeenCalledWith('/my/plants')
    expect(result[0].name).toBe('Ficus')
  })

  it('getById - returns plant by id', async () => {
    mockApi.get.mockResolvedValue({ data: { id: 5, name: 'Cactus' } })
    const result = await service.getById('5')
    expect(mockApi.get).toHaveBeenCalledWith('/my/plants/5')
    expect(result.name).toBe('Cactus')
  })

  it('create - sends FormData', async () => {
    mockApi.post.mockResolvedValue({ data: undefined })
    await service.create({ name: 'Orchid', plantSpecieId: 3, image: new File([''], 'photo.jpg') })
    expect(mockApi.post).toHaveBeenCalledWith('/my/plants', expect.any(FormData), expect.anything())
  })

  it('update - calls PATCH /my/plants/:id', async () => {
    mockApi.patch.mockResolvedValue({ data: undefined })
    await service.update('7', { name: 'New name' })
    expect(mockApi.patch).toHaveBeenCalledWith('/my/plants/7', { name: 'New name' })
  })

  it('delete - calls DELETE /my/plants/:id', async () => {
    mockApi.delete.mockResolvedValue({ data: undefined })
    await service.delete('7')
    expect(mockApi.delete).toHaveBeenCalledWith('/my/plants/7')
  })

  it('getSensors - returns sensors for plant', async () => {
    mockApi.get.mockResolvedValue({ data: [{ id: 1, userPlantId: 3, online: true }] })
    const result = await service.getSensors('3')
    expect(mockApi.get).toHaveBeenCalledWith('/my/plants/3/sensors')
    expect(result[0].id).toBe(1)
  })

  it('deleteSensor - calls DELETE sensors', async () => {
    mockApi.delete.mockResolvedValue({ data: undefined })
    await service.deleteSensor('3', 's1')
    expect(mockApi.delete).toHaveBeenCalledWith('/my/plants/3/sensors/s1')
  })
  it('getMeasurements - returns measurements for plant', async () => {
    mockApi.get.mockResolvedValue({ data: [{ id: 1, values: {}, timestamp: new Date(), plantId: 3 }] })
    const result = await service.getMeasurements('3')
    expect(mockApi.get).toHaveBeenCalledWith('/my/plants/3/measurements')
    expect(result[0].id).toBe(1)
  })

  it('addSensor - calls POST /my/plants/:id/sensors', async () => {
    mockApi.post.mockResolvedValue({ data: { id: 10, userPlantId: 3, online: false, last_seen: new Date() } })
    const result = await service.addSensor('3')
    expect(mockApi.post).toHaveBeenCalledWith('/my/plants/3/sensors')
    expect(result?.id).toBe(10)
  })
})