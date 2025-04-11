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
    process.exit(1);
  });

// Define a router
const appRouter = t.router({
  hello: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      return { message: `Hello, ${input.name}!` };
    }),
    register: t.procedure
    .input(z.object({ email: z.string().email(), password: z.string().min(6),role: z.string() }))
    .mutation(async ({ input }) => {
      console.log('Register procedure called with input:', input);
      try {
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser) {
          console.log('User already exists:', input.email);
          throw new Error('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(input.password, 10);
        console.log('Hashed password for:', input.email);
        const user = new User({ email: input.email, password: hashedPassword, role:input.role });
        await user.save();
        console.log('User saved successfully:', input.email);
        return { success: true };
      } catch (error) {
        console.error('Error in register procedure:', error);
        throw error;
      }
    }),
    login: t.procedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input }) => {
      console.log('input reached login', input);
      try {
        const user = await User.findOne({ email: input.email });
        if (!user) {
          return { success: false, message: "User not found" };
        }

        const isValid = await bcrypt.compare(input.password, user.password);
        if (!isValid) {
          return { success: false, message: "Invalid password",userId:'' };
        }
        return { success: true, message: "Login successful", userId: input.email };
      } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Login failed due to server error", userId:'' };
      }
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
