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
  Clock,
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
    <section id="booking" className="py-24 md:py-32 bg-[#0b0b0e] border-t border-white/5 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#c5a059]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left Column: Direct Contact & Estate Assurance */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-[#c5a059]">
                <span className="h-px w-6 bg-[#c5a059]" />
                <span>07 / Acquisition & Inquiries</span>
              </div>
              <h2 className="mt-3 font-serif text-3xl sm:text-5xl text-white font-normal leading-tight">
                Reserve Your Livestock
              </h2>
              <p className="mt-4 text-sm sm:text-base text-white/70 font-light leading-relaxed">
                Submit your customized requirements. Our team personally reviews inventory, verifies bloodlines, and arranges direct video inspections or on-farm visits.
              </p>

              {/* Direct Reach Cards */}
              <div className="mt-8 space-y-3.5">
                {/* Location */}
                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#121217] p-4.5 transition-all hover:border-[#c5a059]/40">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#d4af37]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-[#c5a059]">Farm Estate Location</p>
                    <p className="text-sm font-serif text-white mt-1 leading-snug">{settings.address}</p>
                    <p className="text-xs text-white/50 mt-0.5">Tehsil Yazman · Bahawalpur Division</p>
                  </div>
                </div>

                {/* Direct Phone */}
                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#121217] p-4.5 transition-all hover:border-[#c5a059]/40">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#d4af37]">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-[#c5a059]">Direct Voice Line</p>
                    <a
                      href={telHref(settings.phone)}
                      className="text-base font-serif text-white hover:text-[#d4af37] transition-colors mt-1 block"
                    >
                      {settings.phone}
                    </a>
                    <p className="text-xs text-white/50 mt-0.5">Contact: {settings.contact_person}</p>
                  </div>
                </div>

                {/* Instant WhatsApp */}
                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#121217] p-4.5 transition-all hover:border-[#c5a059]/40">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#d4af37]">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-[#c5a059]">Direct WhatsApp</p>
                    <a
                      href={whatsappHref(
                        settings.whatsapp,
                        "Assalam-o-Alaikum, I would like to inquire directly about livestock availability."
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="text-base font-serif text-white hover:text-[#d4af37] transition-colors mt-1 block"
                    >
                      Chat on WhatsApp ↗
                    </a>
                    <p className="text-xs text-white/50 mt-0.5">Fastest response for photos & live videos</p>
                  </div>
                </div>
              </div>

              {/* Protocol Assurance Note */}
              <div className="mt-8 flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs text-white/50">
                <ShieldCheck className="h-5 w-5 text-[#d4af37] shrink-0" />
                <span>
                  All inquiries are non-binding requests. Booking confirmation follows individual selection, weight verification, and health audit.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean, Polished Luxury Form Container */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-[#131319] p-7 sm:p-10 shadow-2xl relative">
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-serif text-2xl text-white">Acquisition Inquiry</h3>
                  <p className="text-xs text-white/50 mt-1">Specify your target requirements below</p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#c5a059]/30 bg-[#c5a059]/10 px-3 py-1 text-[11px] font-mono text-[#e5c158]">
                  <Sparkles className="h-3 w-3 text-[#d4af37]" />
                  <span>Immediate Review</span>
                </div>
              </div>

              {submitted ? (
                <div className="py-10 text-center space-y-6">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#c5a059]/40 bg-[#c5a059]/10 text-[#d4af37] shadow-[0_0_25px_rgba(197,160,89,0.2)]">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="font-serif text-2xl text-white">Inquiry Received</h4>
                    <p className="mt-2 text-sm text-white/60 max-w-md mx-auto leading-relaxed">
                      Thank you. Your inquiry has been safely dispatched to the estate management. You may also forward the generated summary directly to WhatsApp for rapid processing.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <a
                      href={whatsappHref(settings.whatsapp, submitted.summary)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#dfc17b] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-black shadow-lg hover:brightness-110 transition-all"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Forward on WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => setSubmitted(null)}
                      className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-all"
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
                            <FormLabel className="text-xs font-mono uppercase tracking-wider text-white/80">
                              Full Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Asad Ejaz"
                                className="h-11 rounded-xl border border-white/15 bg-[#1a1a22] text-white placeholder:text-white/30 focus-visible:border-[#c5a059] focus-visible:ring-[#c5a059]/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-mono uppercase tracking-wider text-white/80">
                              Phone Number *
                            </FormLabel>
                            <FormControl>
                              <Input
                                inputMode="tel"
                                placeholder="03XXXXXXXXX"
                                className="h-11 rounded-xl border border-white/15 bg-[#1a1a22] text-white placeholder:text-white/30 focus-visible:border-[#c5a059] focus-visible:ring-[#c5a059]/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-400" />
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
                            <FormLabel className="text-xs font-mono uppercase tracking-wider text-white/80">
                              WhatsApp (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input
                                inputMode="tel"
                                placeholder="03XXXXXXXXX"
                                className="h-11 rounded-xl border border-white/15 bg-[#1a1a22] text-white placeholder:text-white/30 focus-visible:border-[#c5a059] focus-visible:ring-[#c5a059]/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="animal_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-mono uppercase tracking-wider text-white/80">
                              Animal Category *
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-xl border border-white/15 bg-[#1a1a22] text-white focus:border-[#c5a059] focus:ring-[#c5a059]/20">
                                  <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="border border-white/15 bg-[#1a1a22] text-white shadow-2xl">
                                {ANIMAL_CATEGORIES.map((category) => (
                                  <SelectItem
                                    key={category}
                                    value={category}
                                    className="text-white/90 hover:bg-[#c5a059] hover:text-black focus:bg-[#c5a059] focus:text-black cursor-pointer"
                                  >
                                    {ANIMAL_TYPE_LABELS[category] ?? category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs text-red-400" />
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
                            <FormLabel className="text-xs font-mono uppercase tracking-wider text-white/80">
                              Breed Preference *
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-xl border border-white/15 bg-[#1a1a22] text-white focus:border-[#c5a059] focus:ring-[#c5a059]/20">
                                  <SelectValue placeholder="Select Breed" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="border border-white/15 bg-[#1a1a22] text-white shadow-2xl">
                                {breedOptions.map((breed) => (
                                  <SelectItem
                                    key={breed}
                                    value={breed}
                                    className="text-white/90 hover:bg-[#c5a059] hover:text-black focus:bg-[#c5a059] focus:text-black cursor-pointer"
                                  >
                                    {breed}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="purpose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-mono uppercase tracking-wider text-white/80">
                              Intended Purpose *
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-xl border border-white/15 bg-[#1a1a22] text-white focus:border-[#c5a059] focus:ring-[#c5a059]/20">
                                  <SelectValue placeholder="Select Purpose" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="border border-white/15 bg-[#1a1a22] text-white shadow-2xl">
                                {PURPOSES.map((purpose) => (
                                  <SelectItem
                                    key={purpose}
                                    value={purpose}
                                    className="text-white/90 hover:bg-[#c5a059] hover:text-black focus:bg-[#c5a059] focus:text-black cursor-pointer"
                                  >
                                    {purpose}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs text-red-400" />
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
                            <FormLabel className="text-xs font-mono uppercase tracking-wider text-white/80">
                              Quantity *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                max={500}
                                className="h-11 rounded-xl border border-white/15 bg-[#1a1a22] text-white focus-visible:border-[#c5a059] focus-visible:ring-[#c5a059]/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="delivery"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-mono uppercase tracking-wider text-white/80">
                              Delivery Preference *
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-xl border border-white/15 bg-[#1a1a22] text-white focus:border-[#c5a059] focus:ring-[#c5a059]/20">
                                  <SelectValue placeholder="Select Delivery" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="border border-white/15 bg-[#1a1a22] text-white shadow-2xl">
                                {DELIVERY_OPTIONS.map((option) => (
                                  <SelectItem
                                    key={option}
                                    value={option}
                                    className="text-white/90 hover:bg-[#c5a059] hover:text-black focus:bg-[#c5a059] focus:text-black cursor-pointer"
                                  >
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs text-red-400" />
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
                          <FormLabel className="text-xs font-mono uppercase tracking-wider text-white/80">
                            Specific Requests / Weight / Details (Optional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              rows={3}
                              placeholder="e.g. Inquiring for purebred Cholistani bull with heavy hump, approx 500-600kg, delivery to Lahore before Eid."
                              className="rounded-xl border border-white/15 bg-[#1a1a22] text-white placeholder:text-white/30 focus-visible:border-[#c5a059] focus-visible:ring-[#c5a059]/20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#dfc17b] py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-black shadow-[0_0_20px_rgba(197,160,89,0.25)] hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
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
