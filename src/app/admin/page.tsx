import { auth } from "@/auth";
import { checkIsAdmin, getQrMappings } from "@/app/actions/admin";
import { redirect } from "next/navigation";
import { AdminQrManager } from "@/components/admin-qr-manager";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    // If user is authenticated but not an admin, send them to dashboard
    redirect("/dashboard");
  }

  const qrMappings = await getQrMappings();

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Generate print-ready QR codes for rider enrollment.
        </p>
      </div>

      <div className="bg-card text-card-foreground border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">QR Code Generation</h2>
        <AdminQrManager initialMappings={qrMappings as any} />
      </div>
    </div>
  );
}
