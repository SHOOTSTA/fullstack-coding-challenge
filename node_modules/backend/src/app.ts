import express, { Express, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import path from 'path'
import { Store } from './store'
import { createServicesRouter } from './routes/services'
import { AppError } from './errors'

export function createApp(dbPath: string): Express {
  const app = express()
  const store = new Store(dbPath)

  app.use(cors())
  app.use(express.json())
  app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')))

  app.get('/health', (_req, res) => res.json({ status: 'ok' }))
  app.use('/api/services', createServicesRouter(store))

  app.use((_req, res) => {
    res.status(404).json({ message: 'Not found' })
  })

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      res.status(err.status).json({ message: err.message, issues: err.issues })
      return
    }
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  })

  return app
}
