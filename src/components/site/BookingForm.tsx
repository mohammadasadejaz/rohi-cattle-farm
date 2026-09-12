import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import {
  ANIMAL_CATEGORIES,
  DELIVERY_OPTIONS,
  PURPOSES,
  whatsappHref,
  type SiteSettings,
} from "@/lib/site";
import type { Breed } from "@/lib/queries";

const schema = z.object({
  full_name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(20),
  whatsapp: z.string().trim().max(20).optional().or(z.literal("")),
  animal_type: z.string().min(1, "Select an animal type"),
  breed: z.string().min(1, "Select a breed"),
  purpose: z.string().min(1, "Select a purpose"),
  quantity: z.coerce.number().int().min(1, "Minimum 1").max(500),
  delivery: z.string().min(1, "Select a delivery preference"),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

type FormValues = z.input<typeof schema>;

const ANIMAL_TYPE_LABELS: Record<string, string> = {
  "Bulls / Cattle": "Bull",
  Sheep: "Sheep",
  Goats: "Goat",
};

export function BookingForm({ settings, breeds }: { settings: SiteSettings; breeds: Breed[] }) {
  const [submitted, setSubmitted] = useState<null | { summary: string }>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "",
      phone: "",
      whatsapp: "",
      animal_type: "",
      breed: "",
      purpose: "",
      quantity: 1,
      delivery: "Farm Pickup",
      message: "",
    },
  });

  const breedOptions = [...breeds.map((breed) => breed.name), "Other"];

  async function onSubmit(values: FormValues) {
    const parsed = schema.parse(values);
    const { error } = await supabase.from("inquiries").insert({
      full_name: parsed.full_name,
      phone: parsed.phone,
      whatsapp: parsed.whatsapp || null,
      animal_type: parsed.animal_type,
      breed: parsed.breed,
      purpose: parsed.purpose,
      quantity: parsed.quantity,
      delivery: parsed.delivery,
      message: parsed.message || null,
    });

    if (error) {
      toast.error("Could not send your inquiry. Please call or WhatsApp us instead.");
      return;
    }

    const summary = [
      `Assalam-o-Alaikum, this is ${parsed.full_name}.`,
      `I sent an inquiry on your website:`,
      `Animal: ${ANIMAL_TYPE_LABELS[parsed.animal_type] ?? parsed.animal_type}`,
      `Breed: ${parsed.breed}`,
      `Purpose: ${parsed.purpose}`,
      `Quantity: ${parsed.quantity}`,
      `Delivery: ${parsed.delivery}`,
      parsed.message ? `Message: ${parsed.message}` : "",
      `Phone: ${parsed.phone}`,
    ]
      .filter(Boolean)
      .join("\n");

    setSubmitted({ summary });
    form.reset();
    toast.success("Inquiry sent to the farm.");
  }

  return (
    <section id="booking" className="section-shell scroll-mt-20 py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="eyebrow">Booking</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">Request an Animal</h2>
          <p className="mt-4 text-muted-foreground">
            Send us your requirements and we will contact you with current availability. This is an
            inquiry request — it is not a confirmed booking until the farm confirms availability
            with you directly.
          </p>
          <div className="mt-6 rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
            <p>
              Prefer to talk? Call{" "}
              <a className="font-medium text-foreground" href={`tel:+${settings.phone}`}>
                {settings.phone}
              </a>{" "}
              or message us on WhatsApp any time.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-soft)] md:p-8">
          {submitted ? (
            <div className="space-y-5 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
              <h3 className="font-display text-2xl">Inquiry Received</h3>
              <p className="text-sm text-muted-foreground">
                Thank you. Your request has been sent to the farm. Our team will contact you to
                confirm availability. Your request is recorded as an inquiry, not a confirmed
                booking.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button asChild>
                  <a
                    href={whatsappHref(settings.whatsapp, submitted.summary)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle /> Also send on WhatsApp
                  </a>
                </Button>
                <Button variant="outline" onClick={() => setSubmitted(null)}>
                  Send another inquiry
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input inputMode="tel" placeholder="03XXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input inputMode="tel" placeholder="Optional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="animal_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Animal Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ANIMAL_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {ANIMAL_TYPE_LABELS[category]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="breed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breed</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {breedOptions.map((breed) => (
                            <SelectItem key={breed} value={breed}>
                              {breed}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PURPOSES.map((purpose) => (
                            <SelectItem key={purpose} value={purpose}>
                              {purpose}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="delivery"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Preferred Delivery</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DELIVERY_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Message / Requirements</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="Tell us what you are looking for" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="sm:col-span-2"
                  disabled={form.formState.isSubmitting}
                >
                  <Send /> {form.formState.isSubmitting ? "Sending…" : "Send Inquiry"}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </section>
  );
}
