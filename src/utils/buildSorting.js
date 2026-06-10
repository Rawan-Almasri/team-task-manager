export const buildSorting = (
  sortBy,
  order,
  defaultField = "createdAt"
) => {
  return {
    [sortBy || defaultField]:
      order?.toUpperCase() === "ASC"
        ? "ASC"
        : "DESC",
  };
};