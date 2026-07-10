import fs from 'fs'
import path from 'path'
import os from 'os'
import request from 'supertest'
import { createApp } from '../src/app'

function tempDbPath(): string {
  return path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'services-test-')), 'db.json')
}

describe('GET /api/services', () => {
  it('returns the first page of 10 records by default with totals', async () => {
    const app = createApp(tempDbPath())
    const res = await request(app).get('/api/services')

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(10)
    expect(res.body.page).toBe(1)
    expect(res.body.limit).toBe(10)
    expect(res.body.totals.all).toBe(24)
  })

  it('supports pagination via page and limit query params', async () => {
    const app = createApp(tempDbPath())
    const res = await request(app).get('/api/services?page=2&limit=5')

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(5)
    expect(res.body.page).toBe(2)
  })

  it('filters by type', async () => {
    const app = createApp(tempDbPath())
    const res = await request(app).get('/api/services?type=doctor&limit=100')

    expect(res.status).toBe(200)
    expect(res.body.data.every((s: { type: string }) => s.type === 'doctor')).toBe(true)
  })

  it('rejects an invalid type filter', async () => {
    const app = createApp(tempDbPath())
    const res = await request(app).get('/api/services?type=nurse')

    expect(res.status).toBe(400)
  })

  it('searches by free text', async () => {
    const app = createApp(tempDbPath())
    const res = await request(app).get('/api/services?q=tokyo')

    expect(res.status).toBe(200)
    expect(res.body.total).toBeGreaterThan(0)
  })
})

describe('GET /api/services/:id', () => {
  it('returns 404 for a missing record', async () => {
    const app = createApp(tempDbPath())
    const res = await request(app).get('/api/services/does-not-exist')
    expect(res.status).toBe(404)
  })

  it('returns the record when found', async () => {
    const app = createApp(tempDbPath())
    const list = await request(app).get('/api/services?limit=1')
    const id = list.body.data[0].id

    const res = await request(app).get(`/api/services/${id}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(id)
  })
})

describe('POST /api/services', () => {
  it('creates a new record', async () => {
    const app = createApp(tempDbPath())
    const res = await request(app).post('/api/services').send({
      type: 'ambulance',
      title: 'New Ambulance',
      description: 'Description',
      location: 'Somewhere',
    })

    expect(res.status).toBe(201)
    expect(res.body.title).toBe('New Ambulance')
    expect(res.body.id).toBeTruthy()
  })

  it('rejects an invalid payload', async () => {
    const app = createApp(tempDbPath())
    const res = await request(app).post('/api/services').send({
      type: 'ambulance',
      title: '',
      description: 'Description',
      location: 'Somewhere',
    })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Validation failed')
  })
})

describe('PUT /api/services/:id', () => {
  it('updates an existing record', async () => {
    const app = createApp(tempDbPath())
    const created = await request(app).post('/api/services').send({
      type: 'doctor',
      title: 'Before',
      description: 'Description',
      location: 'Somewhere',
    })

    const res = await request(app).put(`/api/services/${created.body.id}`).send({
      type: 'doctor',
      title: 'After',
      description: 'Description',
      location: 'Somewhere',
    })

    expect(res.status).toBe(200)
    expect(res.body.title).toBe('After')
  })

  it('returns 404 when updating a missing record', async () => {
    const app = createApp(tempDbPath())
    const res = await request(app).put('/api/services/does-not-exist').send({
      type: 'doctor',
      title: 'After',
      description: 'Description',
      location: 'Somewhere',
    })

    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/services/:id', () => {
  it('deletes an existing record', async () => {
    const app = createApp(tempDbPath())
    const created = await request(app).post('/api/services').send({
      type: 'ambulance',
      title: 'To Delete',
      description: 'Description',
      location: 'Somewhere',
    })

    const res = await request(app).delete(`/api/services/${created.body.id}`)
    expect(res.status).toBe(204)

    const getRes = await request(app).get(`/api/services/${created.body.id}`)
    expect(getRes.status).toBe(404)
  })

  it('returns 404 when deleting a missing record', async () => {
    const app = createApp(tempDbPath())
    const res = await request(app).delete('/api/services/does-not-exist')
    expect(res.status).toBe(404)
  })
})
