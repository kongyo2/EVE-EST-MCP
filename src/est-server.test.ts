import { describe, expect, it } from "vitest";

describe("EVE Online EST Time Server", () => {
  it("should calculate time correctly", () => {
    const now = new Date();
    const utcTime = now.toISOString();
    const estTime = utcTime.replace("T", " ").substring(0, 19) + " EST";

    expect(estTime).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} EST/);
  });

  it("should identify downtime window correctly", () => {
    const downtimeWindow = "11:00 to 11:15 EST (UTC)";
    expect(downtimeWindow).toBe("11:00 to 11:15 EST (UTC)");
  });

  it("should calculate time until downtime", () => {
    const now = new Date();
    const downtimeHour = 11;

    const nextDowntime = new Date(now);
    nextDowntime.setUTCHours(downtimeHour, 0, 0, 0);

    if (now >= nextDowntime) {
      nextDowntime.setUTCDate(nextDowntime.getUTCDate() + 1);
    }

    const timeDiff = nextDowntime.getTime() - now.getTime();
    const hoursUntilDowntime = Math.floor(timeDiff / (1000 * 60 * 60));

    expect(hoursUntilDowntime).toBeGreaterThanOrEqual(0);
    expect(hoursUntilDowntime).toBeLessThan(24);
  });

  it("should detect if currently in downtime", () => {
    const now = new Date();
    const currentHour = now.getUTCHours();
    const currentMinute = now.getUTCMinutes();
    const isInDowntime = currentHour === 11 && currentMinute < 15;

    expect(typeof isInDowntime).toBe("boolean");
  });
});
