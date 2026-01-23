export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

// Tenta mapear formatos comuns vindos do Swagger.
// Ajuste se sua API usar outro shape.
export function mapToPageResult<T>(
  raw: any,
  page: number,
  size: number
): PageResult<T> {
  // exemplos:
  // { items, total, page, size }
  // { content, totalElements, number, size }
  // { data, total, page, size }
  const items = raw?.items ?? raw?.content ?? raw?.data ?? raw?.results ?? [];

  const total =
    raw?.total ??
    raw?.totalElements ??
    raw?.count ??
    (Array.isArray(items) ? items.length : 0);

  const p =
    raw?.page ?? (typeof raw?.number === "number" ? raw.number + 1 : page);

  const s = raw?.size ?? size;

  return {
    items: Array.isArray(items) ? items : [],
    total: Number(total ?? 0),
    page: Number(p ?? page),
    size: Number(s ?? size),
  };
}
