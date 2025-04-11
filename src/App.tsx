import { useEffect } from "react";
import { trpc } from "./utils/trpc";

function App() {
  const mutation = trpc.register.useMutation();

  mutation.mutate({
    email: 'tesst@example.com',
    password: 'mypassword123',
  });

  const helloMutation = trpc.hello.useMutation();
  useEffect(() => {
    helloMutation.mutate({ name: "Rohan" });
  }, []);

  if (helloMutation.isPending) return <p>Loading...</p>;
  if (helloMutation.error) return <p>Error: {helloMutation.error.message}</p>;

  return <h1>{helloMutation.data?.message}</h1>;
}

export default App;
