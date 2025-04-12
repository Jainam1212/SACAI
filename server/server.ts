// import express from "express";
// import cors from "cors";
// import { initTRPC } from "@trpc/server";
// import { createExpressMiddleware } from "@trpc/server/adapters/express";
// import { z } from "zod";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import { User } from "./models/user.ts";
// import bcrypt from "bcrypt";
// import { Server } from "socket.io";  // Correct import for ES Modules

// dotenv.config();

// const t = initTRPC.create();

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGODB_URI!)
//   .then(() => console.log("✅ Connected to MongoDB Atlas"))
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   });

// // Define a router
// const appRouter = t.router({
//   hello: t.procedure
//     .input(z.object({ name: z.string() }))
//     .mutation(({ input }) => {
//       return { message: `Hello, ${input.name}!` };
//     }),

//   register: t.procedure
//     .input(z.object({ email: z.string().email(), password: z.string().min(6), role: z.string() }))
//     .mutation(async ({ input }) => {
//       console.log('Register procedure called with input:', input);
//       try {
//         const existingUser = await User.findOne({ email: input.email });
//         if (existingUser) {
//           console.log('User already exists:', input.email);
//           throw new Error('Email already registered');
//         }
//         const hashedPassword = await bcrypt.hash(input.password, 10);
//         console.log('Hashed password for:', input.email);
//         const user = new User({ email: input.email, password: hashedPassword, role: input.role });
//         await user.save();
//         console.log('User saved successfully:', input.email);
//         return { success: true };
//       } catch (error) {
//         console.error('Error in register procedure:', error);
//         throw error;
//       }
//     }),

//   login: t.procedure
//     .input(z.object({ email: z.string().email(), password: z.string() }))
//     .mutation(async ({ input }) => {
//       console.log('input reached login', input);
//       try {
//         const user = await User.findOne({ email: input.email });
//         if (!user) {
//           return { success: false, message: "User not found" };
//         }

//         const isValid = await bcrypt.compare(input.password, user.password);
//         if (!isValid) {
//           return { success: false, message: "Invalid password", userId: '' };
//         }
//         return { success: true, message: "Login successful", userId: input.email };
//       } catch (error) {
//         console.error("Login error:", error);
//         return { success: false, message: "Login failed due to server error", userId: '' };
//       }
//     }),
// });

// export type AppRouter = typeof appRouter;

// // Express setup
// const app = express();
// app.use(cors());
// app.use(express.json());

// // Attach tRPC to Express
// app.use("/trpc", createExpressMiddleware({ router: appRouter }));

// // Socket.io setup - integrate into app.listen
// const io = new Server({
//   cors: {
//     origin: "*",  // Allow all origins or restrict to specific ones
//     methods: ["GET", "POST"]
//   }
// });

// // Socket.io event listeners
// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });

//   // Example of receiving a message
//   socket.on("send_message", (message) => {
//     console.log("Received message:", message);
//     io.emit("receive_message", message); // Broadcast the message to all clients
//   });
// });

// // Start the server and listen on the desired port
// const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5173; // Ensure PORT is a number
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server is running on http://0.0.0.0:${PORT}`);
//   io.listen(PORT);  // Make sure socket.io listens on the same port as the Express app
// });

import express from "express";
import cors from "cors";
import { initTRPC } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { z } from "zod";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/user.ts";
import bcrypt from "bcrypt";
import { Server } from "socket.io";
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

// Define tRPC router
const appRouter = t.router({
  hello: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      return { message: `Hello, ${input.name}!` };
    }),

  register: t.procedure
    .input(z.object({ email: z.string().email(), password: z.string().min(6), role: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser) {
          throw new Error('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(input.password, 10);
        const user = new User({ email: input.email, password: hashedPassword, role: input.role });
        await user.save();
        return { success: true };
      } catch (error) {
        console.error('Error in register procedure:', error);
        throw error;
      }
    }),

  login: t.procedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const user = await User.findOne({ email: input.email });
        if (!user) {
          return { success: false, message: "User not found" };
        }

        const isValid = await bcrypt.compare(input.password, user.password);
        if (!isValid) {
          return { success: false, message: "Invalid password", userId: '' };
        }
        return { success: true, message: "Login successful", userId: input.email };
      } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Login failed due to server error", userId: '' };
      }
    }),
});

export type AppRouter = typeof appRouter;

const app = express();

// CORS Configuration to allow both ports (5173 and 5174)
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions)); // Enable CORS for both frontends
app.use(express.json());

// Attach tRPC to Express
app.use("/trpc", createExpressMiddleware({ router: appRouter }));

// Socket.io setup with CORS
const io = new Server({
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"], // Allow both front-end ports
    methods: ["GET", "POST"],
  },
});

// Socket.io event listeners
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("send_message", (message) => {
    console.log("Received message:", message);
    io.emit("receive_message", message); // Broadcast the message to all clients
  });
});

// Start the Express server and attach Socket.io
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5173;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

// Attach Socket.io to the same server
io.attach(server);
