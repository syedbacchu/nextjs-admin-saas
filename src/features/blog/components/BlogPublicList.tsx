'use client'

import DynamicGrid from '@/components/ui/DynamicGrid'
import BlogCard from '@/features/blog/components/BlogCard'
import { getBlogPublicListAction, BlogListItem } from '@/features/blog'

interface BlogPublicListProps {
    category?: string
    tag?: string
}

export default function BlogPublicList({ category, tag }: BlogPublicListProps) {
    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800">Latest Blogs</h1>
                    {(category || tag) && (
                        <p className="mt-1 text-sm text-slate-500">
                            {category ? `Category: ${category}` : ''}
                            {category && tag ? ' | ' : ''}
                            {tag ? `Tag: ${tag}` : ''}
                        </p>
                    )}
                </div>
            </div>

            <DynamicGrid
                title=""
                showStats={false}
                fetchData={(page, search) => getBlogPublicListAction(page, search, category, tag)}
                gridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2"
                renderItem={(item: BlogListItem) => <BlogCard item={item} />}
            />
        </div>
    )
}
