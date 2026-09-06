import { afterEach, describe, expect, it } from "vitest";

import { handleLegacyDisplay, renderLegacyDisplayPage } from "./legacy-display.server";

const originalPin = process.env["LEGACY_DISPLAY_PIN"];

afterEach(() => {
  if (originalPin === undefined) delete process.env["LEGACY_DISPLAY_PIN"];
  else process.env["LEGACY_DISPLAY_PIN"] = originalPin;
});

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

  it("shows setup guidance when the protected PIN is missing", async () => {
    delete process.env["LEGACY_DISPLAY_PIN"];
    const response = await handleLegacyDisplay(new Request("https://example.com/legacy-display"));

    expect(response.status).toBe(503);
    expect(await response.text()).toContain("display PIN has not been configured");
  });

  it("shows the PIN form without loading household data", async () => {
    process.env["LEGACY_DISPLAY_PIN"] = "12345678";
    const response = await handleLegacyDisplay(new Request("https://example.com/legacy-display"));

    expect(response.status).toBe(200);
    expect(await response.text()).toContain('form method="post" action="/legacy-display"');
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
  });
});
