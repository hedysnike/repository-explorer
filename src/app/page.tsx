import { Spotlight } from "@/components/spotlight-new";
import { ResultData } from "@/lib/types";
import { RepositoryClient } from "./repository";

interface Props {
  searchParams: Promise<{
    query: string;
    sort?: "asc" | "desc";
    page?: string;
    columns?: "grid" | "table";
  }>;
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export default async function Home({ searchParams }: Props) {
  const { query, sort, page, columns } = await searchParams;

  let data: ResultData = { items: [], total_count: 0 };

  let formattedQuery: string | undefined;
  if (!!query) {
    formattedQuery = query.toString().trim().replace(/\s+/g, " ");
    console.log(`REQUEST:`, formattedQuery, sort, page);
    const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(formattedQuery)}${sort ? `&sort=${sort}` : ""}${page && `&page=${page}`}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });

    data = await response.json();
  }

  return (
    <div className="bg-[#111111] flex flex-col justify-center relative min-h-screen overflow-x-hidden">
      <RepositoryClient query_param={formattedQuery} results={data.items} total={data.total_count} currentPage={parseInt(page?.toString() || "1")} initialColumns={columns} />
      <Spotlight />
    </div>
  );
}
