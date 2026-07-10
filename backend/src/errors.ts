export class AppError extends Error {
  status: number
  issues?: unknown

  constructor(status: number, message: string, issues?: unknown) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.issues = issues
  }
}
