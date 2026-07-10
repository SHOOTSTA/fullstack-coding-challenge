import fs from 'fs'
import path from 'path'
import os from 'os'
import { Store, NotFoundError } from '../src/store'

function tempDbPath(): string {
  return path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'store-test-')), 'db.json')
}

describe('Store', () => {
  let dbPath: string
  let store: Store

  beforeEach(() => {
    dbPath = tempDbPath()
    store = new Store(dbPath)
  })

  it('seeds the database from seed.json on first load', () => {
    const result = store.list({ page: 1, limit: 10 })
    expect(result.totals.all).toBe(24)
    expect(result.totals.ambulance).toBe(12)
    expect(result.totals.doctor).toBe(12)
  })

  it('paginates results, 10 per page by default', () => {
    const page1 = store.list({ page: 1, limit: 10 })
    expect(page1.data).toHaveLength(10)
    expect(page1.totalPages).toBe(3)

    const page3 = store.list({ page: 3, limit: 10 })
    expect(page3.data).toHaveLength(4)
  })

  it('filters by type', () => {
    const result = store.list({ type: 'doctor', page: 1, limit: 100 })
    expect(result.total).toBe(12)
    expect(result.data.every((r) => r.type === 'doctor')).toBe(true)
  })

  it('searches title, description and location case-insensitively', () => {
    const result = store.list({ q: 'berlin', page: 1, limit: 100 })
    expect(result.total).toBeGreaterThan(0)
    expect(result.data.every((r) => r.location.toLowerCase().includes('berlin'))).toBe(true)
  })

  it('creates a new record and persists it to disk', () => {
    const created = store.create({
      type: 'ambulance',
      title: 'Test Ambulance',
      description: 'A test record',
      location: 'Nowhere',
    })
    expect(created.id).toBeTruthy()
    expect(created.imageUrl).toBeNull()

    const reloaded = new Store(dbPath)
    expect(reloaded.getById(created.id).title).toBe('Test Ambulance')
  })

  it('updates an existing record', () => {
    const created = store.create({
      type: 'doctor',
      title: 'Original',
      description: 'Desc',
      location: 'Loc',
    })
    const updated = store.update(created.id, {
      type: 'doctor',
      title: 'Updated',
      description: 'Desc',
      location: 'Loc',
    })
    expect(updated.title).toBe('Updated')
    expect(new Date(updated.updatedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(created.updatedAt).getTime(),
    )
  })

  it('throws NotFoundError when updating a missing record', () => {
    expect(() =>
      store.update('does-not-exist', {
        type: 'doctor',
        title: 'x',
        description: 'x',
        location: 'x',
      }),
    ).toThrow(NotFoundError)
  })

  it('removes a record', () => {
    const created = store.create({
      type: 'ambulance',
      title: 'To Delete',
      description: 'Desc',
      location: 'Loc',
    })
    store.remove(created.id)
    expect(() => store.getById(created.id)).toThrow(NotFoundError)
  })

  it('throws NotFoundError when removing a missing record', () => {
    expect(() => store.remove('does-not-exist')).toThrow(NotFoundError)
  })
})
