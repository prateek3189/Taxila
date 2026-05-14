export function success<T>(data: T) {
  return { success: true as const, data };
}

export function successPaginated<T>(
  data: T[],
  meta: { total: number; page: number; limit: number },
) {
  return { success: true as const, data, meta };
}
