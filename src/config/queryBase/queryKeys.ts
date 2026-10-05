export const QUERY_ROOT = "D2T1-ITI";

export function createResourceKeys<TFilters>(resource: string) {
    const all = (businessUid: string | null) =>
        [QUERY_ROOT, businessUid, resource] as const;
    const lists = (businessUid: string | null) =>
        [...all(businessUid), "list"] as const;
    const details = (businessUid: string | null) =>
        [...all(businessUid), "detail"] as const;

    return {
        all,
        lists,
        list: (businessUid: string | null, filters: TFilters) =>
            [...lists(businessUid), filters] as const,
        details,
        detail: (businessUid: string | null, id: string | number | null) =>
            [...details(businessUid), id] as const,
    };
}
