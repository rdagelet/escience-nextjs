import HomeStatEditor from '@/components/admin/HomeStatEditor';

export default async function EditHomeStatPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <HomeStatEditor params={{ id }} />;
}
