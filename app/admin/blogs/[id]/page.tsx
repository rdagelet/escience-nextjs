import { use } from 'react';
import BlogEditor from '@/components/admin/BlogEditor';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <BlogEditor params={{ id }} />;
}
