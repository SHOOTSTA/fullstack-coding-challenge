import { Router } from 'express'
import { Store, NotFoundError } from '../store'
import { serviceInputSchema } from '../schema'
import { AppError } from '../errors'
import type { ServiceType } from '../types'

const VALID_TYPES: ServiceType[] = ['ambulance', 'doctor']

export function createServicesRouter(store: Store): Router {
  const router = Router()

  router.get('/', (req, res) => {
    const { type, q, page, limit } = req.query

    if (type !== undefined && !VALID_TYPES.includes(type as ServiceType)) {
      throw new AppError(400, `type must be one of: ${VALID_TYPES.join(', ')}`)
    }

    const result = store.list({
      type: type as ServiceType | undefined,
      q: typeof q === 'string' ? q : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    })

    res.json(result)
  })

  router.get('/:id', (req, res) => {
    const service = store.getById(req.params.id)
    res.json(service)
  })

  router.post('/', (req, res) => {
    const parsed = serviceInputSchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError(400, 'Validation failed', parsed.error.flatten())
    }
    const service = store.create(parsed.data)
    res.status(201).json(service)
  })

  router.put('/:id', (req, res) => {
    const parsed = serviceInputSchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError(400, 'Validation failed', parsed.error.flatten())
    }
    const service = store.update(req.params.id, parsed.data)
    res.json(service)
  })

  router.delete('/:id', (req, res) => {
    store.remove(req.params.id)
    res.status(204).send()
  })

  // Convert NotFoundError thrown by the store into a 404 without
  // repeating try/catch boilerplate in every handler above.
  router.use((err: unknown, _req: unknown, _res: unknown, next: (err: unknown) => void) => {
    if (err instanceof NotFoundError) {
      next(new AppError(404, err.message))
      return
    }
    next(err)
  })

  return router
}
