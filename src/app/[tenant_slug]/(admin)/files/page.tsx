import { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'
import FilesContent from './FilesContent'

export async function generateMetadata(): Promise<Metadata> {
    return constructMetadata({
        title: 'Files',
        description: 'Manage and organize your transport business files, documents, and digital assets.',
        noIndex: true,
    })
}

export default function FilesPage() {
    return <FilesContent />
}