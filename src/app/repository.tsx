"use client";

import { PlaceholdersAndVanishInput } from "../components/placeholders-and-vanish-input";
import { motion } from "framer-motion";
import { GithubRepository } from "@/lib/types";
import { Pagination } from "@/components/pagination";
import { RepositoryTable } from "@/components/repository-table";
import { useRepositorySearch } from "@/lib/hooks/use-search";
import { RepositoryGrid } from "@/components/repository-grid";

const placeholders = [
  "What's the first rule of Fight Club?",
  "Who is Tyler Durden?",
  "Where is Andrew Laeddis Hiding?",
  "Write a Javascript method to reverse a string",
  "How to assemble your own PC?",
];

export function RepositoryClient({
  query_param,
  results,
  total,
  currentPage,
  initialColumns,
}: {
  query_param?: string;
  results: GithubRepository[];
  total: number;
  currentPage: number;
  initialColumns?: "grid" | "table";
}) {
  const { query, setQuery, page, setPage, columns, setColumns, repositories, count, sort, setSort, refetch, loading } = useRepositorySearch({
    initialQuery: query_param,
    initialPage: currentPage.toString(),
    initialTotal: total,
    initialColumns: initialColumns,
  });

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    refetch();
  };

  return (
    <div className="h-full px-4 w-full flex flex-col justify-center">
      <div className="w-full flex items-center justify-center pb-14 pt-5 min-h-5 sticky top-0 bg-[#111111]">
        <div className="relative max-w-7xl w-full flex mx-auto">
          <motion.h2
            className={`absolute dark:text-white w-max font-semibold text-black`}
            initial={false}
            animate={{
              top: repositories.length > 0 ? 0 : 80,
              left: repositories.length > 0 ? 0 : "50%",
              x: repositories.length > 0 ? 0 : "-50%",
              fontSize: repositories.length > 0 ? "1.25rem" : "3.00rem",
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            Your Favorite Github Search
          </motion.h2>

          <motion.div
            className="absolute"
            initial={false}
            animate={{
              top: repositories.length > 0 ? 0 : 150,
              left: repositories.length > 0 ? "80%" : "50%",
              x: repositories.length > 0 ? 0 : "-50%",
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <PlaceholdersAndVanishInput setValue={setQuery} value={query} placeholders={placeholders} onChange={handleChange} />
          </motion.div>
        </div>
      </div>

      {query && count > 0 && (
        <div className="relative justify-between items-center max-w-7xl w-full flex mx-auto mt-20 z-0">
          <span className="text-gray-200 text-sm">
            {count} results found for <span className="font-bold">{query}</span>
          </span>
          <div className="flex items-center gap-2">
            <select name="columns" id="columns" onChange={(e) => setSort(e.target.value)} className="py-1.5 px-4 rounded-lg text-gray-300 bg-gray-800">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <button onClick={() => setColumns("grid")} className={`p-2 rounded-lg text-gray-300 ${columns === "grid" ? "bg-indigo-500" : ""}`}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="11" y="1" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="1" y="11" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="11" y="11" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
            <button onClick={() => setColumns("table")} className={`p-2 rounded-lg text-gray-300 ${columns === "table" ? "bg-indigo-500" : ""}`}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="18" height="8" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="1" y="11" width="18" height="8" rx="1" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="w-full min-h-[101vh] h-full max-w-7xl flex mx-auto pt-20 pb-10 text-gray-200">
        {loading ? (
          <div className="flex items-center justify-center h-full">Loading...</div>
        ) : repositories.length > 0 ? (
          columns === "grid" ? (
            <RepositoryGrid repositories={repositories} />
          ) : (
            <RepositoryTable repositories={repositories} />
          )
        ) : query ? (
          <div className="flex items-center justify-center h-full min-h-screen">No results found</div>
        ) : null}
      </div>

      <section className="pb-96 text-white">
        {count > 0 && (
          <Pagination
            currentPage={Number(page)}
            totalPages={Math.ceil(count / 100)}
            onPageChange={(page) => {
              setPage(page.toString());
              refetch();
            }}
          />
        )}
      </section>
    </div>
  );
}
