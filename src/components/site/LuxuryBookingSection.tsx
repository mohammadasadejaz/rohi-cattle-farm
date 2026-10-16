import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CheckCircle2,
  MessageCircle,
  Phone,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

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
  telHref,
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
  "Bulls / Cattle": "Bull / Cattle",
  Sheep: "Sheep",
  Goats: "Goats",
};

export function LuxuryBookingSection({
  settings,
  breeds,
}: {
  settings: SiteSettings;
  breeds: Breed[];
}) {
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

  const breedOptions = [...breeds.map((breed) => breed.name), "Other / Custom"];

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
      toast.error("Could not send your inquiry. Please call or WhatsApp us directly.");
      return;
    }

    const summary = [
      `Assalam-o-Alaikum, this is ${parsed.full_name}.`,
      `I have submitted a livestock inquiry on your website:`,
      `• Animal: ${ANIMAL_TYPE_LABELS[parsed.animal_type] ?? parsed.animal_type}`,
      `• Breed: ${parsed.breed}`,
      `• Purpose: ${parsed.purpose}`,
      `• Quantity: ${parsed.quantity}`,
      `• Delivery: ${parsed.delivery}`,
      parsed.message ? `• Requirements: ${parsed.message}` : "",
      `• Contact: ${parsed.phone}`,
    ]
      .filter(Boolean)
      .join("\n");

    setSubmitted({ summary });
    form.reset();
    toast.success("Acquisition inquiry recorded successfully.");
  }

  return (
    <section id="booking" className="py-24 md:py-32 bg-[#fcfaf6] border-t border-[#e4dacb] relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left Column: Direct Contact & Estate Assurance */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-[#9e7030]">
                <span className="h-px w-6 bg-[#9e7030]" />
                <span>07 / Acquisition & Inquiries</span>
              </div>
              <h2 className="mt-3 font-serif text-3xl sm:text-5xl text-[#1f1b18] font-normal leading-tight">
                Reserve Your Livestock
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#5c544d] font-light leading-relaxed">
                Submit your customized requirements. Our team personally reviews inventory, verifies bloodlines, and arranges direct video inspections or on-farm visits.
              </p>

              {/* Direct Reach Cards */}
              <div className="mt-8 space-y-3.5">
                {/* Location */}
                <div className="flex items-start gap-4 rounded-2xl border border-[#e4dacb] bg-white p-4.5 shadow-sm transition-all hover:border-[#b07d37]/50">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f8f3eb] border border-[#e4dacb] text-[#8e6022]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-[#9e7030]">Farm Estate Location</p>
                    <p className="text-sm font-serif text-[#1f1b18] mt-1 leading-snug">{settings.address}</p>
                    <p className="text-xs text-[#70665c] mt-0.5">Tehsil Yazman · Bahawalpur Division</p>
                  </div>
                </div>

                {/* Direct Phone */}
                <div className="flex items-start gap-4 rounded-2xl border border-[#e4dacb] bg-white p-4.5 shadow-sm transition-all hover:border-[#b07d37]/50">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f8f3eb] border border-[#e4dacb] text-[#8e6022]">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-[#9e7030]">Direct Voice Line</p>
                    <a
                      href={telHref(settings.phone)}
                      className="text-base font-serif text-[#1f1b18] hover:text-[#b07d37] transition-colors mt-1 block"
                    >
                      {settings.phone}
                    </a>
                    <p className="text-xs text-[#70665c] mt-0.5">Contact: {settings.contact_person}</p>
                  </div>
                </div>

                {/* Instant WhatsApp */}
                <div className="flex items-start gap-4 rounded-2xl border border-[#e4dacb] bg-white p-4.5 shadow-sm transition-all hover:border-[#b07d37]/50">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f8f3eb] border border-[#e4dacb] text-[#8e6022]">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-[#9e7030]">Direct WhatsApp</p>
                    <a
                      href={whatsappHref(
                        settings.whatsapp,
                        "Assalam-o-Alaikum, I would like to inquire directly about livestock availability."
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="text-base font-serif text-[#1f1b18] hover:text-[#b07d37] transition-colors mt-1 block font-medium"
                    >
                      Chat on WhatsApp ↗
                    </a>
                    <p className="text-xs text-[#70665c] mt-0.5">Fastest response for photos & live videos</p>
                  </div>
                </div>
              </div>

              {/* Protocol Assurance Note */}
              <div className="mt-8 flex items-center gap-3 rounded-xl border border-[#e4dacb] bg-[#f8f5ee] p-4 text-xs text-[#5c544d]">
                <ShieldCheck className="h-5 w-5 text-[#8e6022] shrink-0" />
                <span>
                  All inquiries are non-binding requests. Booking confirmation follows individual selection, weight verification, and health audit.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean, Polished Luxury Form Container */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#e4dacb] bg-white p-7 sm:p-10 shadow-lg relative">
              <div className="mb-6 flex items-center justify-between border-b border-[#e4dacb] pb-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#1f1b18]">Acquisition Inquiry</h3>
                  <p className="text-xs text-[#70665c] mt-1">Specify your target requirements below</p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#e4dacb] bg-[#f8f3eb] px-3 py-1 text-[11px] font-mono text-[#8e6022]">
                  <Sparkles className="h-3 w-3 text-[#b07d37]" />
                  <span>Immediate Review</span>
                </div>
              </div>

              {submitted ? (
                <div className="py-10 text-center space-y-6">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#b07d37]/40 bg-[#f8f3eb] text-[#8e6022] shadow-sm">
                    <CheckCircle2 className="h-8 w-8 text-[#b07d37]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-2xl text-[#1f1b18]">Inquiry Received</h4>
                    <p className="mt-2 text-sm text-[#5c544d] max-w-md mx-auto leading-relaxed">
                      Thank you. Your inquiry has been safely dispatched to the estate management. You may also forward the generated summary directly to WhatsApp for rapid processing.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <a
                      href={whatsappHref(settings.whatsapp, submitted.summary)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#b07d37] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:bg-[#97692b] transition-all"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Forward on WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => setSubmitted(null)}
                      className="inline-flex items-center justify-center rounded-xl border border-[#d9ccbc] bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#1f1b18] hover:bg-[#f8f5ee] transition-all"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    {/* Name & Phone */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-mono uppercase tracking-wider text-[#4a443e]">
                              Full Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Asad Ejaz"
                                className="h-11 rounded-xl border border-[#d9ccbc] bg-[#fcfaf6] text-[#1f1b18] placeholder:text-[#998f82] focus-visible:border-[#b07d37] focus-visible:ring-[#b07d37]/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-mono uppercase tracking-wider text-[#4a443e]">
                              Phone Number *
                            </FormLabel>
                            <FormControl>
                              <Input
                                inputMode="tel"
                                placeholder="03XXXXXXXXX"
                                className="h-11 rounded-xl border border-[#d9ccbc] bg-[#fcfaf6] text-[#1f1b18] placeholder:text-[#998f82] focus-visible:border-[#b07d37] focus-visible:ring-[#b07d37]/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* WhatsApp & Animal Type */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="whatsapp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-mono uppercase tracking-wider text-[#4a443e]">
                              WhatsApp (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input
                                inputMode="tel"
                                placeholder="03XXXXXXXXX"
                                className="h-11 rounded-xl border border-[#d9ccbc] bg-[#fcfaf6] text-[#1f1b18] placeholder:text-[#998f82] focus-visible:border-[#b07d37] focus-visible:ring-[#b07d37]/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="animal_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-mono uppercase tracking-wider text-[#4a443e]">
                              Animal Category *
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-xl border border-[#d9ccbc] bg-[#fcfaf6] text-[#1f1b18] focus:border-[#b07d37] focus:ring-[#b07d37]/20">
                                  <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="border border-[#e4dacb] bg-white text-[#1f1b18] shadow-xl">
                                {ANIMAL_CATEGORIES.map((category) => (
                                  <SelectItem
                                    key={category}
                                    value={category}
                                    className="text-[#1f1b18] hover:bg-[#f8f3eb] hover:text-[#8e6022] focus:bg-[#f8f3eb] focus:text-[#8e6022] cursor-pointer"
                                  >
                                    {ANIMAL_TYPE_LABELS[category] ?? category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Breed & Purpose */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="breed"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-mono uppercase tracking-wider text-[#4a443e]">
                              Breed Preference *
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-xl border border-[#d9ccbc] bg-[#fcfaf6] text-[#1f1b18] focus:border-[#b07d37] focus:ring-[#b07d37]/20">
                                  <SelectValue placeholder="Select Breed" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="border border-[#e4dacb] bg-white text-[#1f1b18] shadow-xl">
                                {breedOptions.map((breed) => (
                                  <SelectItem
                                    key={breed}
                                    value={breed}
                                    className="text-[#1f1b18] hover:bg-[#f8f3eb] hover:text-[#8e6022] focus:bg-[#f8f3eb] focus:text-[#8e6022] cursor-pointer"
                                  >
                                    {breed}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="purpose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-mono uppercase tracking-wider text-[#4a443e]">
                              Intended Purpose *
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-xl border border-[#d9ccbc] bg-[#fcfaf6] text-[#1f1b18] focus:border-[#b07d37] focus:ring-[#b07d37]/20">
                                  <SelectValue placeholder="Select Purpose" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="border border-[#e4dacb] bg-white text-[#1f1b18] shadow-xl">
                                {PURPOSES.map((purpose) => (
                                  <SelectItem
                                    key={purpose}
                                    value={purpose}
                                    className="text-[#1f1b18] hover:bg-[#f8f3eb] hover:text-[#8e6022] focus:bg-[#f8f3eb] focus:text-[#8e6022] cursor-pointer"
                                  >
                                    {purpose}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Quantity & Delivery Preference */}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-mono uppercase tracking-wider text-[#4a443e]">
                              Quantity *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                max={500}
                                className="h-11 rounded-xl border border-[#d9ccbc] bg-[#fcfaf6] text-[#1f1b18] focus-visible:border-[#b07d37] focus-visible:ring-[#b07d37]/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="delivery"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-mono uppercase tracking-wider text-[#4a443e]">
                              Delivery Preference *
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-xl border border-[#d9ccbc] bg-[#fcfaf6] text-[#1f1b18] focus:border-[#b07d37] focus:ring-[#b07d37]/20">
                                  <SelectValue placeholder="Select Delivery" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="border border-[#e4dacb] bg-white text-[#1f1b18] shadow-xl">
                                {DELIVERY_OPTIONS.map((option) => (
                                  <SelectItem
                                    key={option}
                                    value={option}
                                    className="text-[#1f1b18] hover:bg-[#f8f3eb] hover:text-[#8e6022] focus:bg-[#f8f3eb] focus:text-[#8e6022] cursor-pointer"
                                  >
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Message / Special Requirements */}
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-mono uppercase tracking-wider text-[#4a443e]">
                            Specific Requests / Weight / Details (Optional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              rows={3}
                              placeholder="e.g. Inquiring for purebred Cholistani bull with heavy hump, approx 500-600kg, delivery to Lahore before Eid."
                              className="rounded-xl border border-[#d9ccbc] bg-[#fcfaf6] text-[#1f1b18] placeholder:text-[#998f82] focus-visible:border-[#b07d37] focus-visible:ring-[#b07d37]/20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#b07d37] hover:bg-[#97692b] py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-md hover:shadow-lg active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                      <span>{form.formState.isSubmitting ? "Dispatching Inquiry..." : "Submit Acquisition Inquiry"}</span>
                    </button>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
