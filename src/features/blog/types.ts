export interface BlogAuthor {
    id: number
    name: string
}

export interface BlogCategory {
    id: number
    name: string
    slug: string
}

export interface BlogSummaryCategory extends BlogCategory {
    status?: boolean
    blogs_count?: number
}

export interface BlogTag {
    id: number
    name: string
    slug: string
}

export interface BlogListItem {
    id: number
    title: string
    slug: string
    excerpt: string
    thumbnail_img: string | null
    featured_img?: string | null
    status?: string
    is_comment_allow?: boolean
    published_at?: string | null
    author?: BlogAuthor | null
    categories?: BlogCategory[]
    tags?: BlogTag[]
}

export interface BlogListResponse {
    success: boolean
    message: string
    data: {
        total_count: number
        total_page: number
        per_page: number
        current_page: number
        data: BlogListItem[]
    }
}

export interface BlogDetailsData extends BlogListItem {
    content: string
    post_type?: string
    visibility?: number
    is_featured?: number
    featured_order?: number
    total_hit?: number
    meta_title?: string | null
    meta_keywords?: string | null
    meta_description?: string | null
    similar_blogs?: BlogListItem[]
    created_at?: string
    updated_at?: string
}

export interface BlogDetailsResponse {
    success: boolean
    message: string
    data: BlogDetailsData
    status?: number
    error_message?: string
}

export interface BlogSummaryResponse {
    success: boolean
    message: string
    data: {
        latest_blogs: BlogListItem[]
        categories: BlogSummaryCategory[]
    }
    status?: number
    error_message?: string
}

export interface BlogComment {
    id: number
    post_id: number
    parent_id: number | null
    name: string
    email: string
    website?: string | null
    comment: string
    likes_count?: number
    created_at?: string
    user?: {
        id?: number
        name?: string
        image?: string | null
    } | null
    replies?: BlogComment[]
}

export interface BlogCommentsResponse {
    success: boolean
    message: string
    data: {
        total_count: number
        total_page: number
        per_page: number
        current_page: number
        data: BlogComment[]
    }
    status?: number
    error_message?: string
}
