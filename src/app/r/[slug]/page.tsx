import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Phone, AlertCircle, HeartPulse, User } from "lucide-react";
import { CustomField, EmergencyContact } from "@/lib/validations/profile";
import React from "react";

const prisma = new PrismaClient();

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const profile = await prisma.riderProfile.findUnique({
    where: { qrSlug: resolvedParams.slug },
  });

  if (!profile) {
    notFound();
  }

  // Parse JSON fields securely
  const emergencyContacts = (profile.emergencyContacts ||
    []) as any as EmergencyContact[];
  const customFields = (profile.customFields || []) as any as CustomField[];

  // Render only visible custom fields
  const visibleFields = customFields.filter((f) => f.isVisible);

  return (
    <div
      className={`min-h-screen p-4 md:p-8 ${profile.theme === "dark" ? "bg-zinc-950 text-white" : "bg-slate-50 text-slate-900"}`}
    >
      <main className="max-w-md mx-auto space-y-6">
        {/* Urgent Header */}
        <div className="bg-red-600 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center space-y-2">
          <AlertCircle className="w-12 h-12 mb-2" />
          <h1 className="text-2xl font-black uppercase tracking-wider">
            Emergency Profile
          </h1>
          <p className="font-medium opacity-90">
            If found, please contact emergency numbers below.
          </p>
        </div>

        {/* Basic Info */}
        <Card className="border-2 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="text-blue-600" /> Rider Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                  Full Name
                </p>
                <p className="font-semibold text-lg">{profile.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                  Blood Group
                </p>
                <div className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full font-bold">
                  <HeartPulse className="w-4 h-4" />
                  {profile.bloodGroup}
                </div>
              </div>
            </div>

            {profile.medicalNotes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">
                    Medical Notes
                  </p>
                  <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-lg text-sm">
                    {profile.medicalNotes}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        {emergencyContacts.length > 0 && (
          <Card className="border-2 shadow-sm border-t-red-500 border-t-4">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Phone className="text-red-500" /> Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {emergencyContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex flex-col p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{contact.name}</h4>
                      <p className="text-xs text-muted-foreground capitalize">
                        {contact.relation}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center justify-center w-full gap-2 bg-slate-900 text-white font-medium py-2 rounded-md transition-opacity hover:opacity-90"
                  >
                    <Phone className="w-4 h-4" /> Call {contact.phone}
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Custom Fields */}
        {visibleFields.length > 0 && (
          <Card className="border-2 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 divide-y">
              {visibleFields.map((field) => (
                <div key={field.id} className="pt-4 first:pt-0">
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">
                    {field.label}
                  </p>

                  {field.type === "phone" ? (
                    <a
                      href={`tel:${field.value}`}
                      className="text-blue-600 font-semibold inline-flex items-center gap-1 hover:underline"
                    >
                      <Phone className="w-4 h-4" /> {field.value}
                    </a>
                  ) : field.type === "multiline" ? (
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {field.value}
                    </div>
                  ) : (
                    <p className="font-medium text-sm">{field.value}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
