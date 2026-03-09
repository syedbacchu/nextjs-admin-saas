'use client'

import DynamicGrid from '@/components/ui/DynamicGrid'
import BlogCard from '@/components/blog/BlogCard'
import { BlogListItem } from '@/services/blog/blog.types'
import { getBlogPublicListAction } from '@/services/blog/blog.actions'

export default function BlogPublicList() {
    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">Latest Blogs</h1>
            </div>

            <DynamicGrid
                title=""
                showStats={false}
                fetchData={(page, search) => getBlogPublicListAction(page, search)}
                gridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                renderItem={(item: BlogListItem) => <BlogCard item={item} />}
            />
        </div>
    )
}

