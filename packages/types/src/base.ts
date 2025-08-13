export interface BaseResponseDTO<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

interface SortProps {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export type PaginationDTO<T> = BaseResponseDTO<{
  content: T;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: SortProps;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: SortProps;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}>;
