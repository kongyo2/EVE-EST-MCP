import { FastMCP } from "fastmcp";
import { z } from "zod";

const server = new FastMCP({
  name: "EVE Online EST Server",
  version: "1.0.0",
});

/**
 * Get current EVE Server Time (EST) and calculate time until server downtime
 * EVE Server Time is identical to UTC
 * Daily downtime: 11:00 to 11:15 UTC (EVE Server Time)
 */
function getCurrentESTTime() {
  const now = new Date();

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
    timeUntilNextDowntime: isInDowntime
      ? "Server is currently in downtime"
      : `${hoursUntilDowntime}h ${minutesUntilDowntime}m`,
    utcTime: now.toISOString(),
  };
}

server.addTool({
  annotations: {
    openWorldHint: false, // This tool doesn't interact with external systems
    readOnlyHint: true, // This tool doesn't modify anything
    title: "Get Current EVE Server Time",
  },
  description:
    "Get current EVE Server Time (EST) which is identical to UTC, and calculate time until next server downtime. EVE Online servers go offline daily from 11:00 to 11:15 EST (UTC) for maintenance.",
  execute: async () => {
    const timeInfo = getCurrentESTTime();
    return JSON.stringify(timeInfo, null, 2);
  },
  name: "getCurrentESTTime",
  parameters: z.object({}),
});

server.start({
  transportType: "stdio",
});
