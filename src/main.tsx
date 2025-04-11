import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { trpc } from "./utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";


const client = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "http://localhost:4000/trpc",
    }),
  ],
});


ReactDOM.createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={client}>
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
