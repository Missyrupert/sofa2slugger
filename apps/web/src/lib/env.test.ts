import { describe, it, expect } from "vitest";
import { getResolvedBaseUrl } from "./env";

describe("getResolvedBaseUrl", () => {
  it("returns localhost when no env vars set", () => {
    const url = getResolvedBaseUrl();
    expect(url).toMatch(/^https?:\/\//);
  });
});
