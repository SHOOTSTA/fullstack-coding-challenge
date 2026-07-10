import { createApp } from './app'
import { defaultDbPath } from './store'

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000

const app = createApp(defaultDbPath)

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
