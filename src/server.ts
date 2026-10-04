import { spawn } from "child_process";
import { APP_PORT } from "./lib/config";

const mode = process.argv[2] || "dev";

const env = {
  ...process.env,
  PORT: String(APP_PORT),
};

const args =
  mode === "start"
    ? ["next", "start", "-p", String(APP_PORT)]
    : ["next", "dev", "-p", String(APP_PORT)];

const child = spawn("bunx", args, {
  stdio: "inherit",
  env,
  shell: true,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
