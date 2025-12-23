import express from "express";
import dotenv from "dotenv";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "../../infrastructure/betterAuth";

dotenv.config();

const app = express();

app.get("/auth/verify", async (req, res) => {
  console.log("Received verify request with headers:", req.headers);

  const session = await auth.api.getSession({
    headers: {
      authorization: req.headers.authorization || ""
    }
  });

  if (!session) {
    return res.status(401).json({ error: "session_not_found" });
  }

  return res.json({ 
    userId: session.user.id,
    user: session.user 
  });
});

app.all("/auth/*", toNodeHandler(auth));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(process.env.AUTH_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Auth service running on port ${process.env.AUTH_PORT}`);
});
