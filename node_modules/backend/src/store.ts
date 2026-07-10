import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import type { ListParams, ListResult, Service, ServiceInput, ServiceType } from './types'

const SEED_PATH = path.join(__dirname, 'data', 'seed.json')

export class NotFoundError extends Error {
  constructor(message = 'Service not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class Store {
  private dbPath: string
  private records: Service[]

  constructor(dbPath: string) {
    this.dbPath = dbPath
    this.records = this.load()
  }

  private load(): Service[] {
    if (!fs.existsSync(this.dbPath)) {
      const seed = JSON.parse(fs.readFileSync(SEED_PATH, 'utf-8')) as Service[]
      fs.mkdirSync(path.dirname(this.dbPath), { recursive: true })
      fs.writeFileSync(this.dbPath, JSON.stringify(seed, null, 2))
      return seed
    }
    return JSON.parse(fs.readFileSync(this.dbPath, 'utf-8')) as Service[]
  }

  private persist(): void {
    fs.writeFileSync(this.dbPath, JSON.stringify(this.records, null, 2))
  }

  list(params: ListParams): ListResult {
    const { type, q } = params
    const page = Math.max(1, Math.floor(params.page) || 1)
    const limit = Math.max(1, Math.floor(params.limit) || 10)

    const byType = (t: ServiceType) => this.records.filter((r) => r.type === t).length

    let filtered = this.records
    if (type) {
      filtered = filtered.filter((r) => r.type === type)
    }
    if (q && q.trim()) {
      const needle = q.trim().toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(needle) ||
          r.description.toLowerCase().includes(needle) ||
          r.location.toLowerCase().includes(needle),
      )
    }

    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const start = (page - 1) * limit
    const data = filtered.slice(start, start + limit)

    return {
      data,
      page,
      limit,
      total,
      totalPages,
      totals: {
        all: this.records.length,
        ambulance: byType('ambulance'),
        doctor: byType('doctor'),
      },
    }
  }

  getById(id: string): Service {
    const found = this.records.find((r) => r.id === id)
    if (!found) throw new NotFoundError()
    return found
  }

  create(input: ServiceInput): Service {
    const now = new Date().toISOString()
    const service: Service = {
      id: crypto.randomUUID(),
      type: input.type,
      title: input.title,
      description: input.description,
      location: input.location,
      imageUrl: input.imageUrl ?? null,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
      createdAt: now,
      updatedAt: now,
    }
    this.records.push(service)
    this.persist()
    return service
  }

  update(id: string, input: ServiceInput): Service {
    const index = this.records.findIndex((r) => r.id === id)
    if (index === -1) throw new NotFoundError()
    const existing = this.records[index]
    const updated: Service = {
      ...existing,
      type: input.type,
      title: input.title,
      description: input.description,
      location: input.location,
      imageUrl: input.imageUrl ?? null,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
      updatedAt: new Date().toISOString(),
    }
    this.records[index] = updated
    this.persist()
    return updated
  }

  remove(id: string): void {
    const index = this.records.findIndex((r) => r.id === id)
    if (index === -1) throw new NotFoundError()
    this.records.splice(index, 1)
    this.persist()
  }
}

export const defaultDbPath = path.join(__dirname, 'data', 'db.json')
