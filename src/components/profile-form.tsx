"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  profileFormSchema,
  ProfileFormValues,
} from "@/lib/validations/profile";
import { saveProfile } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Need to create this or fallback to raw textarea
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Need this
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { Trash2, Plus, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { useState, useTransition } from "react";

export function ProfileForm({
  initialData,
}: {
  initialData?: Partial<ProfileFormValues> | null;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      bloodGroup: initialData?.bloodGroup || "",
      medicalNotes: initialData?.medicalNotes || "",
      qrSlug: initialData?.qrSlug || "",
      theme: initialData?.theme || "light",
      emergencyContacts: initialData?.emergencyContacts || [],
      customFields: initialData?.customFields || [],
    },
  });

  const {
    fields: customFields,
    append: appendCustom,
    remove: removeCustom,
    move: moveCustom,
  } = useFieldArray({
    name: "customFields",
    control: form.control,
  });

  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
  } = useFieldArray({
    name: "emergencyContacts",
    control: form.control,
  });

  function onSubmit(data: ProfileFormValues) {
    startTransition(async () => {
      const result = await saveProfile(data);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
        if (result.errors) {
          // You could map field errors here if needed
          console.error(result.errors);
        }
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Profile Information</CardTitle>
            <CardDescription>
              Essential details for emergency situations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Group</FormLabel>
                    <FormControl>
                      <Input placeholder="O+" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qrSlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom QR Link Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="john-doe-safe" {...field} />
                    </FormControl>
                    <FormDescription>
                      rider.safe/r/{field.value}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="medicalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Notes</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Allergies, conditions, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Emergency Contacts Section */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contacts</CardTitle>
            <CardDescription>
              People to contact in case of an emergency (Max 5).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contactFields.map((field, index) => (
              <div
                key={field.id}
                className="flex gap-4 items-end bg-muted/50 p-4 rounded-lg relative"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                  <FormField
                    control={form.control}
                    name={`emergencyContacts.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`emergencyContacts.${index}.relation`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relation</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`emergencyContacts.${index}.phone`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeContact(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {contactFields.length < 5 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() =>
                  appendContact({
                    id: nanoid(),
                    name: "",
                    relation: "",
                    phone: "",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Add Contact
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Custom Fields Section */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Custom Fields</CardTitle>
            <CardDescription>
              Add custom information blocks (Max 10). Reorder using the arrows.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {customFields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col gap-4 bg-muted/50 p-4 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={index === 0}
                      onClick={() => moveCustom(index, index - 1)}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={index === customFields.length - 1}
                      onClick={() => moveCustom(index, index + 1)}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">
                      Field #{index + 1}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive"
                    size="sm"
                    onClick={() => removeCustom(index)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name={`customFields.${index}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="E.g. Insurance Policy"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`customFields.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="col-span-1 lg:col-span-2">
                        <FormLabel>Value</FormLabel>
                        <FormControl>
                          <Input placeholder="Data value" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`customFields.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        {/* Note: since Select isn't fully installed yet, using native select for simplicity or importing Select */}
                        <FormControl>
                          <select
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="text">Text</option>
                            <option value="phone">Phone</option>
                            <option value="multiline">Multiline Info</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <FormField
                    control={form.control}
                    name={`customFields.${index}.isVisible`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Visible on public profile
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            {customFields.length < 10 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendCustom({
                    id: nanoid(),
                    label: "",
                    value: "",
                    type: "text",
                    isVisible: true,
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Add Custom Field
              </Button>
            )}
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
}
