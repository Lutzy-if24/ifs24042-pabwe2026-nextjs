import DetailPage from "@/features/posts/pages/DetailPage";

type Props = {
  params: Promise<{ postId: string }>;
};

export default async function Page({ params }: Props) {
  const { postId } = await params;
  return <DetailPage postId={postId} />;
}
