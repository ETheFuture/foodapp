import { LoginForm } from "@/components/LoginForm";

export const metadata = {
  title: "Inloggen · Bite",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const p = await searchParams;
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16 sm:px-0">
      <h1 className="text-2xl font-semibold text-zinc-900">Inloggen</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Restaurant of teambeheer. Geen consumentenaccount in MVP.
      </p>
      <div className="mt-8">
        <LoginForm nextPath={p.next && p.next.startsWith("/") ? p.next : "/dashboard"} />
      </div>
    </div>
  );
}
