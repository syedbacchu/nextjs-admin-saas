export interface ApiListResponse<T> {
    success: boolean
    message: string
    error_message?: string
    status?: number
    data: {
        total_count: number
        total_page: number
        per_page: number
        current_page: number
        data: T[]
    }
}

export interface ColumnDef<T> {
    header: string
    accessorKey?: keyof T
    cell?: (item: T, index: number) => React.ReactNode
    className?: string
}

export interface ApiResponse<T = unknown> {
    success: boolean
    message: string
    // Optional because it might not exist on success=false
    error_message?: string
    status?: number
    // Generic Data (T can be User, Tournament, etc.)
    data: T
}
