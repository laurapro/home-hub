import { describe, expect, it } from "vitest";
import { inventoryQuickCorrection, type InventoryOption } from "./food";

function inventory(overrides: Partial<InventoryOption> = {}): InventoryOption {
  return {
    inventory_id: "inventory-1",
    tracking_mode: "status",
    status: "plenty",
    quantity: null,
    meals_remaining: null,
    ...overrides,
  } as InventoryOption;
}

describe("inventoryQuickCorrection", () => {
  it("confirms an item without changing its values", () => {
    expect(inventoryQuickCorrection(inventory(), "still_have")).toEqual({
      p_inventory_id: "inventory-1",
    });
  });

  it("marks a finished item out", () => {
    expect(inventoryQuickCorrection(inventory(), "finished")).toEqual({
      p_inventory_id: "inventory-1",
      p_status: "out",
    });
  });

  it("removes one remaining meal", () => {
    expect(
      inventoryQuickCorrection(
        inventory({ tracking_mode: "meals", meals_remaining: 3 }),
        "used_some",
      ),
    ).toEqual({ p_inventory_id: "inventory-1", p_meals_remaining: 2 });
  });

  it("marks the item out when the last meal is used", () => {
    expect(
      inventoryQuickCorrection(
        inventory({ tracking_mode: "meals", meals_remaining: 1 }),
        "used_some",
      ),
    ).toEqual({ p_inventory_id: "inventory-1", p_meals_remaining: 0, p_status: "out" });
  });

  it("removes one numeric unit", () => {
    expect(inventoryQuickCorrection(inventory({ quantity: 2 }), "used_some")).toEqual({
      p_inventory_id: "inventory-1",
      p_quantity: 1,
    });
  });

  it.each([
    ["plenty", "some"],
    ["some", "low"],
    ["low", "out"],
    ["unknown", "some"],
  ])("moves status-only inventory from %s to %s", (status, expected) => {
    expect(inventoryQuickCorrection(inventory({ status }), "used_some")).toEqual({
      p_inventory_id: "inventory-1",
      p_status: expected,
    });
  });
});
