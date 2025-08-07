import LibraryPage from "@/page/library";

interface LibraryPageProps {
  searchParams: Promise<{
    category: string;
    tag: string;
  }>;
}

export const runtime = "edge";

export default async function Library({ searchParams }: LibraryPageProps) {
  const { category } = await searchParams;

  return <LibraryPage category={category} />;
}
