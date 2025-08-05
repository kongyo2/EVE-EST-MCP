import { expect, it, describe, beforeEach, afterEach } from "vitest";
import { FastMCP } from "fastmcp";
import { z } from "zod";
import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";

const serverPath = path.resolve(__dirname, "est-server.ts");

describe("EVE Server Time MCP Server", () => {
  let serverProcess;
  let responses = [];
  let errors = [];

  beforeEach(() => {
    responses = [];
    errors = [];
    serverProcess = spawn("tsx", [serverPath], { stdio: ["pipe", "pipe", "pipe"] });

    serverProcess.stdout.on("data", (data) => {
      responses.push(JSON.parse(data.toString()));
    });

    serverProcess.stderr.on("data", (data) => {
      errors.push(data.toString());
    });
  });

  afterEach(() => {
    serverProcess.kill();
  });

  it("should return the current EST time and time until downtime", (done) => {
    const request = {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "getCurrentESTTime",
        arguments: {},
      },
    };

    serverProcess.stdin.write(JSON.stringify(request) + "\n");

    setTimeout(() => {
      expect(errors).toEqual([]);
      expect(responses.length).toBe(1);
      const response = responses[0];
      expect(response.id).toBe(1);
      expect(response.result).toBeDefined();
      const result = JSON.parse(response.result);
      expect(result.currentEST).toBeDefined();
      expect(result.timeUntilDowntime).toBeDefined();
      expect(result.downtimeStart).toBeDefined();
      done();
    }, 1000);
  });
});