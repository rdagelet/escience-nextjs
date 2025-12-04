'use client';

import { use } from 'react';
import JobEditor from '@/components/admin/JobEditor';

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <JobEditor params={{ id }} />;
}
