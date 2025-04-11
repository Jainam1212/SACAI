import express from "express";
import cors from "cors";
import { initTRPC } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { z } from "zod";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/user.ts"
import bcrypt from "bcrypt";

dotenv.config();

const t = initTRPC.create();

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // stop the app if connection fails
  });

// Define a router
const appRouter = t.router({
  hello: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      return { message: `Hello, ${input.name}!` };
    }),
    register: t.procedure
    .input(z.object({ email: z.string().email(), password: z.string().min(6) }))
    .mutation(async ({ input }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const user = new User({ email: input.email, password: hashedPassword });
      await user.save();
      return { success: true };
    }),

  login: t.procedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input }) => {
      const user = await User.findOne({ email: input.email });
      if (!user) throw new Error("User not found");

      const isValid = await bcrypt.compare(input.password, user.password);
      if (!isValid) throw new Error("Invalid password");

      return { success: true, message: "Login successful" };
    }),
});

export type AppRouter = typeof appRouter;

// Express setup
const app = express();
app.use(cors());
app.use(express.json());

// Attach tRPC to Express
app.use("/trpc", createExpressMiddleware({ router: appRouter }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
