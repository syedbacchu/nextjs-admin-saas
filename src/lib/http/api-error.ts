export class ApiError extends Error {
    status: number
    payload: any

    constructor(message: string, status: number, payload?: any) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.payload = payload
    }
}
