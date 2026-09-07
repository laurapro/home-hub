import { describe, expect, it } from "vitest";

import { renderLegacyDisplayPage } from "./legacy-display.server";

describe("legacy display", () => {
  it("renders an IE-compatible page without a JavaScript bundle", () => {
    const html = renderLegacyDisplayPage({
      attention: [],
      householdName: "Laura & family",
      meals: [],
      pets: [],
      shoppingCount: 2,
      timeline: [
        {
          all_day: true,
          ends_at: null,
          item_type: "calendar",
          location: null,
          starts_at: "2026-09-06T12:00:00Z",
          title: "Test <event>",
        },
      ],
      urgentShoppingCount: 1,
    });

    expect(html).toContain('<meta http-equiv="X-UA-Compatible" content="IE=edge">');
    expect(html).toContain('<meta http-equiv="refresh" content="86400">');
    expect(html).toContain("Laura &amp; family");
    expect(html).toContain("Test &lt;event&gt;");
    expect(html).not.toContain("<script");
  });
});
