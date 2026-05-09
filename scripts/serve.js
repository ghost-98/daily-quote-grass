import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const port = Number.parseInt(process.env.PORT ?? "4173", 10);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

function resolveRequestPath(url) {
  const pathname = decodeURIComponent(new URL(url, `http://localhost:${port}`).pathname);
  const relativePath = pathname === "/" ? "public/index.html" : pathname.replace(/^\/+/, "");
  const targetPath = path.resolve(rootDir, relativePath);

  if (!targetPath.startsWith(rootDir)) {
    return null;
  }

  return targetPath;
}

const server = createServer(async (request, response) => {
  const targetPath = resolveRequestPath(request.url);

  if (!targetPath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(targetPath);
    response.writeHead(200, {
      "content-type": mimeTypes[path.extname(targetPath)] ?? "application/octet-stream"
    });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not Found");
  }
});

server.listen(port, () => {
  console.log(`Daily Quote Garden UI: http://localhost:${port}`);
});
