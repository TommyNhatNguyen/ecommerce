import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import React from "react";
import { generatePages } from "../../utils/common";

type CustomPaginationPropsType = {
  totalPage: number;
  currentPage: number;
  numPageShow?: number;
  handlePrevPage?: () => void;
  handleNextPage?: () => void;
  handleChangePage: (page: number) => void;
};

const CustomPagination = ({
  totalPage = 1,
  currentPage = 1,
  numPageShow = 3,
  handlePrevPage,
  handleNextPage,
  handleChangePage,
}: CustomPaginationPropsType) => {
  const _onPrevPage = () => {
    handlePrevPage && handlePrevPage();
  };
  const _onNextPage = () => {
    handleNextPage && handleNextPage();
  };
  const _onChangePage = (pageNum: number) => {
    handleChangePage(pageNum);
  };
  return (
    <Pagination>
      <PaginationContent>
        {handlePrevPage && (
          <PaginationItem
            onClick={_onPrevPage}
            className={cn(
              "cursor-pointer duration-300 hover:-translate-x-2",
              currentPage == 1 &&
                "cursor-not-allowed text-gray-100 hover:translate-x-0",
            )}
          >
            <PaginationPrevious />
          </PaginationItem>
        )}
        {currentPage !== 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {generatePages(totalPage, numPageShow, currentPage).map(
          (page, index) => {
            return (
              <PaginationItem
                key={page || index}
                className={cn(
                  page == currentPage && "bg-white/20",
                  "cursor-pointer rounded-sm",
                )}
                onChange={() => _onChangePage(page)}
              >
                <PaginationLink>{page}</PaginationLink>
              </PaginationItem>
            );
          },
        )}

        {currentPage !== totalPage && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {handleNextPage && (
          <PaginationItem
            onClick={_onNextPage}
            className={cn(
              "cursor-pointer duration-300 hover:-translate-x-2",
              totalPage &&
                "cursor-not-allowed text-gray-100 hover:translate-x-0",
            )}
          >
            <PaginationNext />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
