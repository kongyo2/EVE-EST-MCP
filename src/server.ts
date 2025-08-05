import { FastMCP } from "fastmcp";
import fetch from "node-fetch";
import { z } from "zod";

const server = new FastMCP({
  name: "EVE Online EST Server",
  version: "1.0.0",
});

/**
 * Fetch current UTC time from WorldTimeAPI as fallback
 */
async function fetchTimeFromAPI(): Promise<Date> {
  try {
    const response = await fetch("https://worldtimeapi.org/api/timezone/UTC");
    if (!response.ok) {
      throw new Error(`API response not ok: ${response.status}`);
    }
    const data = (await response.json()) as { datetime: string };
    return new Date(data.datetime);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to fetch time from API: ${errorMessage}`);
  }
}

/**
 * Get current EVE Server Time (EST) and calculate time until server downtime
 * EVE Server Time is identical to UTC
 * Daily downtime: 11:00 to 11:15 UTC (EVE Server Time)
 */
async function getCurrentESTTime() {
  const { source: timeSource, time: now } = await getCurrentTime();

  // EVE Server Time is UTC
  const estTime = now.toISOString().replace("T", " ").substring(0, 19) + " EST";

  // Calculate time until next downtime (11:00 UTC)
  const downtimeHour = 11;
  const downtimeMinute = 0;

  // Create downtime date for today
  const nextDowntime = new Date(now);
  nextDowntime.setUTCHours(downtimeHour, downtimeMinute, 0, 0);

  // If current time is past today's downtime, set to tomorrow's downtime
  if (now >= nextDowntime) {
    nextDowntime.setUTCDate(nextDowntime.getUTCDate() + 1);
  }

  // Calculate time difference
  const timeDiff = nextDowntime.getTime() - now.getTime();
  const hoursUntilDowntime = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutesUntilDowntime = Math.floor(
    (timeDiff % (1000 * 60 * 60)) / (1000 * 60),
  );

  // Check if server is currently in downtime (11:00-11:15 UTC)
  const currentHour = now.getUTCHours();
  const currentMinute = now.getUTCMinutes();
  const isInDowntime = currentHour === 11 && currentMinute < 15;

  return {
    currentTime: estTime,
    downtimeWindow: "11:00 to 11:15 EST (UTC)",
    isInDowntime,
    nextDowntimeStart:
      nextDowntime.toISOString().replace("T", " ").substring(0, 19) + " EST",
    timeSource,
    timeUntilNextDowntime: isInDowntime
      ? "Server is currently in downtime"
      : `${hoursUntilDowntime}h ${minutesUntilDowntime}m`,
    utcTime: now.toISOString(),
  };
}

/**
 * Get current time with fallback to WorldTimeAPI
 */
async function getCurrentTime(): Promise<{ source: string; time: Date }> {
  try {
    const now = new Date();
    // Check if system time is valid (not NaN and reasonable)
    if (isNaN(now.getTime()) || now.getFullYear() < 2020) {
      throw new Error("System time appears invalid");
    }
    return { source: "system", time: now };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn(
      "System time unavailable, falling back to WorldTimeAPI:",
      errorMessage,
    );
    const apiTime = await fetchTimeFromAPI();
    return { source: "worldtimeapi", time: apiTime };
  }
}

server.addTool({
  annotations: {
    openWorldHint: true, // May use external API as fallback
    readOnlyHint: true, // This tool doesn't modify anything
    title: "Get Current EVE Server Time",
  },
  description:
    "Get current EVE Server Time (EST) which is identical to UTC, and calculate time until next server downtime. EVE Online servers go offline daily from 11:00 to 11:15 EST (UTC) for maintenance. Uses system time with WorldTimeAPI as fallback.",
  execute: async () => {
    try {
      const timeInfo = await getCurrentESTTime();
      return JSON.stringify(timeInfo, null, 2);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return JSON.stringify(
        {
          error: "Failed to get current time",
          message: errorMessage,
          timestamp: new Date().toISOString(),
        },
        null,
        2,
      );
    }
  },
  name: "getCurrentESTTime",
  parameters: z.object({}),
});

server.start({
  transportType: "stdio",
});
