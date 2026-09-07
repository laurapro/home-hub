import { afterEach, describe, expect, it } from "vitest";

import { handleLegacyDisplay, renderLegacyDisplayPage } from "./legacy-display.server";

const originalActionToken = process.env["LEGACY_DISPLAY_ACTION_TOKEN"];

afterEach(() => {
  if (originalActionToken === undefined) delete process.env["LEGACY_DISPLAY_ACTION_TOKEN"];
  else process.env["LEGACY_DISPLAY_ACTION_TOKEN"] = originalActionToken;
});

describe("legacy display", () => {
  it("renders an IE-compatible page without a JavaScript bundle", () => {
    const html = renderLegacyDisplayPage({
      attention: [],
      householdName: "Laura & family",
      meals: [],
      pets: [],
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
    });

    expect(html).toContain('<meta http-equiv="X-UA-Compatible" content="IE=edge">');
    expect(html).toContain('<meta http-equiv="refresh" content="86400">');
    expect(html).toContain("Laura &amp; family");
    expect(html).toContain("Test &lt;event&gt;");
    expect(html).not.toContain("<script");
  });

  it("renders a signed no-JavaScript medication form only for an enrolled display", () => {
    const data = {
      attention: [],
      householdName: "Home",
      meals: [],
      pets: [
        {
          due_at: "2026-09-06T14:00:00Z",
          entity_id: "123e4567-e89b-42d3-a456-426614174000",
          entity_type: "pet_medication",
          human_action: "Give one pill",
          medication_name: "Fluoxetine",
          pet_name: "Buck",
          scheduled_for: "2026-09-06",
          severity: "due",
        },
      ],
      timeline: [],
    };

    const publicHtml = renderLegacyDisplayPage(data);
    const enrolledHtml = renderLegacyDisplayPage(data, "a".repeat(32));

    expect(publicHtml).not.toContain("Mark pill given");
    expect(enrolledHtml).toContain('form method="post" action="/legacy-display"');
    expect(enrolledHtml).toContain("Mark pill given");
    expect(enrolledHtml).toContain('name="proof"');
    expect(enrolledHtml).not.toContain("a".repeat(32));
    expect(enrolledHtml).not.toContain("<script");
    expect(enrolledHtml.indexOf("Mark pill given")).toBeLessThan(enrolledHtml.indexOf("Schedule"));
    expect(enrolledHtml).not.toContain("Shopping list");
  });

  it("enrolls a matching device without placing the secret in the cookie", async () => {
    const secret = "tablet-secret-that-is-at-least-32-characters";
    process.env["LEGACY_DISPLAY_ACTION_TOKEN"] = secret;

    const response = await handleLegacyDisplay(
      new Request(`https://example.com/legacy-display?device=${secret}`),
    );

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/legacy-display");
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain("Secure");
    expect(response.headers.get("set-cookie")).not.toContain(secret);
  });

  it("rejects medication writes from a display that is not enrolled", async () => {
    process.env["LEGACY_DISPLAY_ACTION_TOKEN"] = "tablet-secret-that-is-at-least-32-characters";

    const response = await handleLegacyDisplay(
      new Request("https://example.com/legacy-display", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: "action=give-medication",
      }),
    );

    expect(response.status).toBe(403);
    expect(await response.text()).toContain("not enrolled");
  });
});
