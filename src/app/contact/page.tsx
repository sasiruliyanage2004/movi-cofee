import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with our team in Kaduwela, Sri Lanka. Inquiries, private gatherings, phone, WhatsApp, and social channels.",
};

export default function ContactPage() {
  return (
    <div className="pt-28 pb-24 bg-warm-cream min-h-screen text-espresso">
      {/* Hero Header */}
      <section className="py-12 sm:py-16 border-b border-espresso/15">
        <Container width="wide">
          <div className="max-w-2xl">
            <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-muted-coffee font-medium block mb-4">
              CONNECT & INQUIRE • KADUWELA
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal leading-[1.05] tracking-tight text-espresso mb-4">
              Let&apos;s talk.
            </h1>
            <p className="font-serif text-2xl sm:text-3xl text-espresso/70 font-light italic">
              &ldquo;Have a question, planning a gathering, or simply want to say hello? We&apos;d love to hear from you.&rdquo;
            </p>
          </div>
        </Container>
      </section>

      {/* Main Form & Contact Info */}
      <Container width="wide" className="py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="mb-6">
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted-gold font-medium block mb-1">
                MESSAGE OUR TEAM
              </span>
              <h2 className="font-serif text-3xl text-espresso">
                Send an Inquiry
              </h2>
            </div>
            <ContactForm />
          </div>

          {/* Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 border border-espresso/15 bg-soft-beige/30 space-y-6">
              <h3 className="font-serif text-2xl text-espresso mb-4">
                Direct Channels
              </h3>

              {/* Phone */}
              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-muted-gold shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-widest text-muted-coffee block">
                    Phone
                  </span>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="font-serif text-xl text-espresso hover:text-muted-coffee transition-colors"
                  >
                    {siteConfig.phone}
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3.5 border-t border-dashed border-espresso/10 pt-4">
                <MessageCircle className="w-5 h-5 text-muted-gold shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-widest text-muted-coffee block">
                    WhatsApp
                  </span>
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-serif text-xl text-espresso hover:text-muted-coffee transition-colors"
                  >
                    {siteConfig.whatsapp}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 border-t border-dashed border-espresso/10 pt-4">
                <Mail className="w-5 h-5 text-muted-gold shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-widest text-muted-coffee block">
                    Email
                  </span>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="font-serif text-xl text-espresso hover:text-muted-coffee transition-colors"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3.5 border-t border-dashed border-espresso/10 pt-4">
                <MapPin className="w-5 h-5 text-muted-gold shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-widest text-muted-coffee block">
                    Address
                  </span>
                  <p className="font-sans text-xs sm:text-sm text-espresso/70 leading-relaxed font-light">
                    {siteConfig.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Channels */}
            <div className="p-8 border border-espresso/15 bg-warm-cream space-y-4">
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted-gold font-medium block">
                FOLLOW OUR DISPATCHES
              </span>
              <h3 className="font-serif text-2xl text-espresso mb-4">
                Social Profiles
              </h3>

              <div className="space-y-3 font-sans text-sm">
                <div className="flex justify-between items-center py-2 border-b border-espresso/10">
                  <span className="text-muted-coffee uppercase tracking-wider text-xs">
                    Instagram
                  </span>
                  <span className="font-medium text-espresso">
                    {siteConfig.instagram}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-espresso/10">
                  <span className="text-muted-coffee uppercase tracking-wider text-xs">
                    Facebook
                  </span>
                  <span className="font-medium text-espresso">
                    {siteConfig.facebook}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
