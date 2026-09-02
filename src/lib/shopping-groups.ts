export const UNCATEGORIZED_STORE_KEY = "uncategorized";

export type ShoppingStore = {
  id: string;
  name: string;
};

export type StoreAssignableItem = {
  store_id: string | null;
};

export type ShoppingStoreGroup<TItem extends StoreAssignableItem> = {
  key: string;
  name: string;
  items: TItem[];
};

/** Groups items by active store, with Uncategorized first and stores ordered by name. */
export function groupShoppingItemsByStore<TItem extends StoreAssignableItem>(
  items: TItem[],
  stores: ShoppingStore[],
): ShoppingStoreGroup<TItem>[] {
  const sortedStores = [...stores].sort(
    (a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }) || a.id.localeCompare(b.id),
  );
  const activeStoreIds = new Set(sortedStores.map((store) => store.id));
  const groups = new Map<string, TItem[]>();

  for (const item of items) {
    const key =
      item.store_id && activeStoreIds.has(item.store_id) ? item.store_id : UNCATEGORIZED_STORE_KEY;
    const groupItems = groups.get(key) ?? [];
    groupItems.push(item);
    groups.set(key, groupItems);
  }

  const result: ShoppingStoreGroup<TItem>[] = [];
  const uncategorized = groups.get(UNCATEGORIZED_STORE_KEY);
  if (uncategorized?.length) {
    result.push({
      key: UNCATEGORIZED_STORE_KEY,
      name: "Uncategorized",
      items: uncategorized,
    });
  }

  for (const store of sortedStores) {
    const storeItems = groups.get(store.id);
    if (storeItems?.length) {
      result.push({ key: store.id, name: store.name, items: storeItems });
    }
  }

  return result;
}
