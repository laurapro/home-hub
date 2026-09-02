import { describe, expect, it } from "vitest";
import { groupShoppingItemsByStore } from "./shopping-groups";

type TestItem = { id: string; store_id: string | null };

const stores = [
  { id: "walmart", name: "Walmart" },
  { id: "costco", name: "Costco" },
  { id: "aldi", name: "ALDI" },
];

describe("groupShoppingItemsByStore", () => {
  it("groups open items by active store in a predictable order", () => {
    const items: TestItem[] = [
      { id: "milk", store_id: "walmart" },
      { id: "rice", store_id: "costco" },
      { id: "apples", store_id: "aldi" },
    ];

    const groups = groupShoppingItemsByStore(items, stores);

    expect(groups.map((group) => group.name)).toEqual(["ALDI", "Costco", "Walmart"]);
    expect(groups.map((group) => group.items.map((item) => item.id))).toEqual([
      ["apples"],
      ["rice"],
      ["milk"],
    ]);
  });

  it("puts items without an active selected store in Uncategorized first", () => {
    const items: TestItem[] = [
      { id: "alexa-item", store_id: null },
      { id: "inactive-store-item", store_id: "closed-store" },
      { id: "rice", store_id: "costco" },
    ];

    const groups = groupShoppingItemsByStore(items, stores);

    expect(groups.map((group) => group.name)).toEqual(["Uncategorized", "Costco"]);
    expect(groups[0]?.items.map((item) => item.id)).toEqual(["alexa-item", "inactive-store-item"]);
  });

  it("moves an item to its newly selected store group", () => {
    const item: TestItem = { id: "paper-towels", store_id: null };

    const before = groupShoppingItemsByStore([item], stores);
    const after = groupShoppingItemsByStore([{ ...item, store_id: "costco" }], stores);

    expect(before.map((group) => group.name)).toEqual(["Uncategorized"]);
    expect(after.map((group) => group.name)).toEqual(["Costco"]);
  });
});
