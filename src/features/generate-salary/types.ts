export interface GenerateSalaryRequest {
    generate_date: string
    month: string
    status?: number
}

export interface GenerateSalaryResponse {
    success: boolean
    message: string
    data: any
}
