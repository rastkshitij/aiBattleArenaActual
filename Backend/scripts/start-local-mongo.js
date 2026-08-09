import fs from "node:fs";
import path from "node:path";
import { spawnSync, spawn } from "node:child_process";

const projectRoot = path.resolve(process.cwd(), "..");
const dataDir = path.join(projectRoot, "Data", "db");

fs.mkdirSync(dataDir, { recursive: true });

const findMongoBinary = () => {
  const candidates = [
    "mongod",
    "mongod.exe",
    "C:/Program Files/MongoDB/Server/7.0/bin/mongod.exe",
    "C:/Program Files/MongoDB/Server/6.0/bin/mongod.exe",
    "C:/Program Files/MongoDB/Server/5.0/bin/mongod.exe",
    "C:/Program Files/MongoDB/Server/4.4/bin/mongod.exe",
  ];

  for (const candidate of candidates) {
    const result = spawnSync(candidate, ["--version"], {
      stdio: "ignore",
      shell: false,
    });

    if (result.error === null) {
      return candidate;
    }
  }

  return null;
};

const mongoBinary = findMongoBinary();

if (!mongoBinary) {
  console.error("MongoDB is not installed or not available on PATH.");
  console.error("Install MongoDB Community Server, then run:");
  console.error("1) Create the project data folder: Data/db");
  console.error("2) Start Mongo with: mongod --dbpath ./Data/db --port 27017 --bind_ip 127.0.0.1");
  console.error("3) Ensure your app connects to: mongodb://127.0.0.1:27017/ai-battle-arena");
  process.exit(1);
}

const child = spawn(mongoBinary, ["--dbpath", dataDir, "--port", "27017", "--bind_ip", "127.0.0.1"], {
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code) => {
  console.log(`MongoDB exited with code ${code}`);
  process.exit(code ?? 0);
});

child.on("error", (error) => {
  console.error("Failed to start MongoDB:", error);
  process.exit(1);
});

console.log(`Using MongoDB data path: ${dataDir}`);
console.log("MongoDB is starting in normal local mode with persistent project data.");
