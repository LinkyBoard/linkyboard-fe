export const getParams = (
  params: Record<string, unknown>,
  defaultParams: Record<string, unknown> = {}
) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.append(key, encodeURIComponent(String(value)));
    }
  });

  Object.entries(defaultParams).forEach(([key, value]) => {
    searchParams.append(key, encodeURIComponent(String(value)));
  });

  return searchParams.toString();
};

export const calculateNextPageParam = ({
  totalPages,
  page,
}: {
  totalPages: number;
  page: number;
}) => {
  if (totalPages === 0 || page === totalPages - 1) {
    return undefined;
  }
  return page + 1;
};
