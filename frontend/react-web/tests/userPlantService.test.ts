import { describe, it, expect, vi, beforeEach } from 'vitest'
import { userPlantService } from '@project/frontend-shared/userPlantsServices'
import type { AxiosInstance } from 'axios'

const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
} as unknown as AxiosInstance

const service = userPlantService(mockApi)

beforeEach(() => vi.clearAllMocks())

describe('userPlantService', () => {
  it('getAll - returns list of plants', async () => {
    mockApi.get = vi.fn().mockResolvedValue({ data: [{ id: 1, name: 'Ficus' }] })
    const result = await service.getAll()
    expect(mockApi.get).toHaveBeenCalledWith('/my/plants')
    expect(result[0].name).toBe('Ficus')
  })

  it('getById - returns plant by id', async () => {
    mockApi.get = vi.fn().mockResolvedValue({ data: { id: 5, name: 'Cactus' } })
    const result = await service.getById('5')
    expect(mockApi.get).toHaveBeenCalledWith('/my/plants/5')
    expect(result.name).toBe('Cactus')
  })

  it('create - sends FormData', async () => {
    mockApi.post = vi.fn().mockResolvedValue({ data: undefined })
    await service.create({ name: 'Orchid', plantSpecieId: 3, image: new File([''], 'photo.jpg') })
    expect(mockApi.post).toHaveBeenCalledWith('/my/plants', expect.any(FormData), expect.anything())
  })

  it('update - calls PATCH /my/plants/:id', async () => {
    mockApi.patch = vi.fn().mockResolvedValue({ data: undefined })
    await service.update('7', { name: 'New name' })
    expect(mockApi.patch).toHaveBeenCalledWith('/my/plants/7', { name: 'New name' })
  })

  it('delete - calls DELETE /my/plants/:id', async () => {
    mockApi.delete = vi.fn().mockResolvedValue({ data: undefined })
    await service.delete('7')
    expect(mockApi.delete).toHaveBeenCalledWith('/my/plants/7')
  })

  it('getSensors - returns sensors for plant', async () => {
    mockApi.get = vi.fn().mockResolvedValue({ data: [{ id: 1, userPlantId: 3, online: true }] })
    const result = await service.getSensors('3')
    expect(mockApi.get).toHaveBeenCalledWith('/my/plants/3/sensors')
    expect(result[0].id).toBe(1)
  })

  it('deleteSensor - calls DELETE /my/plants/:id/sensors/:sensorId', async () => {
    mockApi.delete = vi.fn().mockResolvedValue({ data: undefined })
    await service.deleteSensor('3', 's1')
    expect(mockApi.delete).toHaveBeenCalledWith('/my/plants/3/sensors/s1')
  })
  it('getMeasurements - returns measurements for plant', async () => {
    mockApi.get = vi.fn().mockResolvedValue({ data: [{ id: 1, values: {}, timestamp: new Date(), plantId: 3 }] })
    const result = await service.getMeasurements('3')
    expect(mockApi.get).toHaveBeenCalledWith('/my/plants/3/measurements')
    expect(result[0].id).toBe(1)
  })
  it('addSensor - calls POST /my/plants/:id/sensors', async () => {
    mockApi.post = vi.fn().mockResolvedValue({ data: { id: 10, userPlantId: 3, online: false, last_seen: new Date() } })
    const result = await service.addSensor('3', { name: 'Sensor A' })
    expect(mockApi.post).toHaveBeenCalledWith('/my/plants/3/sensors', { name: 'Sensor A' })
    expect(result.id).toBe(10)
  })
})