import Fastify from "fastify";
import cors from "@fastify/cors";

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });

app.get("/health", async () => ({
  name: "klypvio-api",
  status: "ok",
  version: "0.1.0"
}));

app.get("/api/projects", async () => []);

const port = Number(process.env.PORT ?? 4000);

app.listen({ host: "0.0.0.0", port }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
