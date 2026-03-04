import { auth } from "@/auth";
import { getProfile } from "@/app/actions/profile";
import { ProfileForm } from "@/components/profile-form";
import { QRStudio } from "@/components/qr-studio/qr-studio";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ enroll?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
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

        {resolvedSearchParams.enroll && !profile && (
          <div className="bg-primary/10 text-primary border border-primary/20 rounded-md p-4 mt-4">
            <p className="font-medium text-sm">
              You're linking a new emergency QR code! Complete your profile to
              finalize setup.
            </p>
          </div>
        )}

        {resolvedSearchParams.enroll && profile && (
          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 rounded-md p-4 mt-4 space-y-3">
            <p className="font-medium text-sm">
              You scanned a new QR code ({resolvedSearchParams.enroll}), but you
              already have a profile!
            </p>
            <form
              action={async () => {
                "use server";
                const { PrismaClient } = await import("@prisma/client");
                const prisma = new PrismaClient();

                const mapping = await prisma.qrMapping.findUnique({
                  where: { qrId: resolvedSearchParams.enroll! },
                });

                if (mapping && !mapping.slug) {
                  await prisma.qrMapping.update({
                    where: { qrId: resolvedSearchParams.enroll! },
                    data: { slug: profile.qrSlug },
                  });
                  const { redirect } = await import("next/navigation");
                  redirect(`/r/${profile.qrSlug}`);
                } else {
                  const { redirect } = await import("next/navigation");
                  redirect(`/dashboard?error=already_claimed`);
                }
              }}
            >
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Link this QR code to my existing profile
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-10">
        <section>
          <ProfileForm
            initialData={initialData as any}
            enrollQrId={resolvedSearchParams.enroll}
          />
        </section>

        {profile && <hr />}

        {profile && (
          <section>
            <div className="mb-6 space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Sticker Studio
              </h2>
              <p className="text-muted-foreground">
                Design your printable safe sticker by adding backgrounds, text,
                and moving your QR code.
              </p>
            </div>

            {/* The profileUrl handles development fallback via env or hardcoded standard */}
            <QRStudio
              qrUrl={
                process.env.NEXT_PUBLIC_APP_URL
                  ? `${process.env.NEXT_PUBLIC_APP_URL}/r/${profile.qrSlug}`
                  : `https://rider.safe/r/${profile.qrSlug}`
              }
              defaultName={profile.fullName}
            />
          </section>
        )}
      </div>
    </div>
  );
}
