import { FastMCP } from "fastmcp";
import { z } from "zod";

// EVE Server TimeはUTCと同等
// ダウンタイムは11:00 to (nominally) 11:15 (EVE Server Time (UTC))

const server = new FastMCP({
  name: "EVE Server Time",
  version: "1.0.0",
});

server.addTool({
  annotations: {
    openWorldHint: false,
    readOnlyHint: true,
    title: "Get Current EST Time",
  },
  description: "Get the current EVE Server Time (EST) and time until server downtime",
  execute: async () => {
    const now = new Date();
    const utcTime = now.toISOString().replace('T', ' ').substring(0, 19);
    
    // Calculate time until downtime (11:00 UTC)
    const tomorrow = new Date(now);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(11, 0, 0, 0);
    
    const todayDowntime = new Date(now);
    todayDowntime.setUTCHours(11, 0, 0, 0);
    
    let downtime: Date;
    if (now < todayDowntime) {
      downtime = todayDowntime;
    } else {
      downtime = tomorrow;
    }
    
    const timeUntilDowntimeMs = downtime.getTime() - now.getTime();
    const hoursUntilDowntime = Math.floor(timeUntilDowntimeMs / (1000 * 60 * 60));
    const minutesUntilDowntime = Math.floor((timeUntilDowntimeMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
      currentEST: utcTime,
      timeUntilDowntime: `${hoursUntilDowntime} hours and ${minutesUntilDowntime} minutes`,
      downtimeStart: downtime.toISOString().replace('T', ' ').substring(0, 19)
    };
  },
  name: "getCurrentESTTime",
  parameters: z.object({}),
});

server.start({
  transportType: "stdio",
});