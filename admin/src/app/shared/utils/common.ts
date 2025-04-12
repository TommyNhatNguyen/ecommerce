export const generatePages = (
  totalPage: number,
  numPageShow: number,
  currentPage: number,
): number[] => {
  let result: number[] = [];
  if (currentPage == 1 && currentPage == totalPage) {
    result.push(1);
    return result;
  }
  if (currentPage > totalPage || currentPage < 1) {
    return result;
  }
  for (let i = 0; i <= numPageShow; i++) {
    if (currentPage - i > 0 && currentPage - i !== currentPage + i) {
      result.push(currentPage - i);
    }
    if (currentPage + i <= totalPage) {
      result.push(currentPage + i);
    }
  }
  return result.sort((a, b) => a - b);
};
