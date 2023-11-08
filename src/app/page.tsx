import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();
  console.log("session::", session);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {session && session.user ? (
        <h1>Welcome {session.user.email}</h1>
      ) : (
        <h1>Welcome Guest</h1>
      )}
    </main>
  );
}
