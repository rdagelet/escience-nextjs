import WhyFeatureEditor from '@/components/admin/WhyFeatureEditor';

export default async function EditWhyFeaturePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <WhyFeatureEditor params={{ id }} />;
}
