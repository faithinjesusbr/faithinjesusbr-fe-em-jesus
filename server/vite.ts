// server/vite.ts
import path from "path";
import fs from "fs/promises";

export async function ensureClientBuild() {
  const distPath = path.resolve(__dirname, "../client/dist");
  try {
    await fs.access(distPath);
  } catch {
    throw new Error(`Could not find the build directory: ${distPath}, make sure to build the client first`);
  }
  return distPath;
}

export function serveStatic(distDir: string) {
  const express = require("express");
  return express.static(distDir);
}

export function log(...args: any[]) {
  console.log(...args);
}
