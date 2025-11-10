import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface MoviePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const MoviePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: MoviePaginationProps) => {
  const maxPages = Math.min(totalPages, 500); // TMDB API limit
  
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showPages = 5;
    
    if (maxPages <= showPages + 2) {
      return Array.from({ length: maxPages }, (_, i) => i + 1);
    }
    
    pages.push(1);
    
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(maxPages - 1, currentPage + 1);
    
    if (start > 2) pages.push("ellipsis");
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (end < maxPages - 1) pages.push("ellipsis");
    
    pages.push(maxPages);
    
    return pages;
  };

  const handlePageClick = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPageChange(page);
  };

  return (
    <Pagination className="my-12">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {getPageNumbers().map((page, index) => (
          <PaginationItem key={index}>
            {page === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => handlePageClick(page)}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => currentPage < maxPages && handlePageClick(currentPage + 1)}
            className={currentPage === maxPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
