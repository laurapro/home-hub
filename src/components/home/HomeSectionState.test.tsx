import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { HomeSectionState, type HomeSectionQueryState } from "./HomeSectionState";

function state(error: Error | null = null): HomeSectionQueryState {
  return { isPending: false, error, refetch: vi.fn() };
}

function renderSections(errors: Partial<Record<"today" | "tomorrow" | "shopping", Error>>) {
  return renderToStaticMarkup(
    <main>
      <HomeSectionState
        query={state(errors.today ?? null)}
        isEmpty={!!errors.today}
        loadingMessage="Loading today"
        emptyMessage="Today is empty"
        errorMessage="Today unavailable"
      >
        <p>Today success</p>
      </HomeSectionState>
      <HomeSectionState
        query={state(errors.tomorrow ?? null)}
        isEmpty={!!errors.tomorrow}
        loadingMessage="Loading tomorrow"
        emptyMessage="Tomorrow is empty"
        errorMessage="Tomorrow unavailable"
      >
        <p>Tomorrow success</p>
      </HomeSectionState>
      <HomeSectionState
        query={state(errors.shopping ?? null)}
        isEmpty={!!errors.shopping}
        loadingMessage="Loading shopping"
        emptyMessage="Shopping is empty"
        errorMessage="Shopping unavailable"
      >
        <p>Shopping success</p>
      </HomeSectionState>
    </main>,
  );
}

describe("HomeSectionState isolation", () => {
  it("keeps Tomorrow and Shopping visible when Today fails", () => {
    const html = renderSections({ today: new Error("calendar failed") });

    expect(html).toContain("Today unavailable");
    expect(html).toContain("Tomorrow success");
    expect(html).toContain("Shopping success");
  });

  it("keeps Today and Shopping visible when Tomorrow fails", () => {
    const html = renderSections({ tomorrow: new Error("tomorrow failed") });

    expect(html).toContain("Tomorrow unavailable");
    expect(html).toContain("Today success");
    expect(html).toContain("Shopping success");
  });

  it("keeps Today and Tomorrow visible when Shopping fails", () => {
    const html = renderSections({ shopping: new Error("shopping failed") });

    expect(html).toContain("Shopping unavailable");
    expect(html).toContain("Today success");
    expect(html).toContain("Tomorrow success");
  });

  it("preserves loaded section content when a background refresh fails", () => {
    const html = renderToStaticMarkup(
      <HomeSectionState
        query={state(new Error("refresh failed"))}
        isEmpty={false}
        loadingMessage="Loading today"
        emptyMessage="Today is empty"
        errorMessage="Today may be out of date"
      >
        <p>Previously loaded schedule</p>
      </HomeSectionState>,
    );

    expect(html).toContain("Today may be out of date");
    expect(html).toContain("Previously loaded schedule");
  });
});
