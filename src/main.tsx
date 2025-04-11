import ReactDOM from "react-dom/client";
import { trpc } from "./utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import './index.css'
import App from "./App.tsx";


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
      <App></App>
    </QueryClientProvider>
  </trpc.Provider>
);
