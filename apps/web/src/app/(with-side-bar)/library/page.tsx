import LibraryPage from "@/page/library";

interface LibraryPageProps {
  searchParams: Promise<{
    category: string;
    id: string;
  }>;
}

export default async function Library({ searchParams }: LibraryPageProps) {
  const { category, id } = await searchParams;

  return <LibraryPage category={category} id={id} />;
}
