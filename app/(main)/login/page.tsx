import { AuthCard } from "@/components/auth-card";
import { ProviderLoginButtons } from "@/components/auth/provider-login-buttons";
import { OrSeparator } from "@/components/ui/or-separator";

export default function LoginPage() {
  return (
    <div className="grow flex flex-col items-center justify-center">
      <section className="w-[24rem] space-y-4">
        <AuthCard />
        <OrSeparator />
        <ProviderLoginButtons />
      </section>
    </div>
  );
}
