import { auth } from "@/auth";
import { getProfile } from "@/app/actions/profile";
import { ProfileForm } from "@/components/profile-form";
import { QRStickerBuilder } from "@/components/qr-sticker-builder";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const profile = await getProfile();

  // If there's no profile, create a safe default that won't cause hydration errors
  const initialData = profile || { qrSlug: nanoid(8) };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Rider Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your emergency profile and generate your QR sticker.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10">
        <section>
          <ProfileForm initialData={initialData as any} />
        </section>

        {profile && <hr />}

        {profile && (
          <section>
            <QRStickerBuilder
              slug={profile.qrSlug}
              defaultName={profile.fullName}
            />
          </section>
        )}
      </div>
    </div>
  );
}
