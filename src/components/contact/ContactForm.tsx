"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.name.trim()) {
      errs.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      errs.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      errs.phone = "Please enter your phone number.";
    }

    if (!formData.message.trim()) {
      errs.message = "Please enter your message.";
    } else if (formData.message.trim().length < 10) {
      errs.message = "Your message should be at least 10 characters.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    // Structured for future backend API / Server Action integration
    try {
      // Simulate rapid accessible response
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setErrors({});
    } catch {
      setErrors({ message: "Unable to submit message. Please contact us directly via phone or WhatsApp." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 sm:p-12 border border-espresso/15 bg-soft-beige/30">
      {isSuccess ? (
        <div
          role="status"
          aria-live="polite"
          className="text-center py-12 flex flex-col items-center"
        >
          <div className="w-12 h-12 rounded-full bg-muted-gold/20 flex items-center justify-center mb-4 text-espresso">
            <CheckCircle2 className="w-6 h-6 text-muted-coffee" />
          </div>
          <h3 className="font-serif text-3xl text-espresso mb-2">
            Message Received
          </h3>
          <p className="font-sans text-sm text-espresso/70 max-w-md mx-auto mb-8 font-light">
            Thank you for reaching out. A member of our Kaduwela team will review your inquiry and connect with you shortly.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsSuccess(false)}
          >
            SEND ANOTHER MESSAGE
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label
                htmlFor="contact-name"
                className="block text-[11px] font-sans uppercase tracking-[0.18em] text-muted-coffee mb-2 font-medium"
              >
                Name <span className="text-red-700">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Your Name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={`w-full bg-warm-cream border px-4 py-3 text-sm text-espresso placeholder:text-espresso/35 focus:outline-none transition-colors font-sans ${
                  errors.name
                    ? "border-red-500 focus:border-red-600"
                    : "border-espresso/20 focus:border-espresso"
                }`}
              />
              {errors.name && (
                <p id="name-error" className="mt-1.5 text-xs text-red-600 font-sans flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="contact-email"
                className="block text-[11px] font-sans uppercase tracking-[0.18em] text-muted-coffee mb-2 font-medium"
              >
                Email <span className="text-red-700">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="name@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`w-full bg-warm-cream border px-4 py-3 text-sm text-espresso placeholder:text-espresso/35 focus:outline-none transition-colors font-sans ${
                  errors.email
                    ? "border-red-500 focus:border-red-600"
                    : "border-espresso/20 focus:border-espresso"
                }`}
              />
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-xs text-red-600 font-sans flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="contact-phone"
              className="block text-[11px] font-sans uppercase tracking-[0.18em] text-muted-coffee mb-2 font-medium"
            >
              Phone <span className="text-red-700">*</span>
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+94 7X XXX XXXX"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={`w-full bg-warm-cream border px-4 py-3 text-sm text-espresso placeholder:text-espresso/35 focus:outline-none transition-colors font-sans ${
                errors.phone
                  ? "border-red-500 focus:border-red-600"
                  : "border-espresso/20 focus:border-espresso"
              }`}
            />
            {errors.phone && (
              <p id="phone-error" className="mt-1.5 text-xs text-red-600 font-sans flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="contact-message"
              className="block text-[11px] font-sans uppercase tracking-[0.18em] text-muted-coffee mb-2 font-medium"
            >
              Message <span className="text-red-700">*</span>
            </label>
            <textarea
              id="contact-message"
              rows={5}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Tell us about your gathering, question, or request..."
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={`w-full bg-warm-cream border px-4 py-3 text-sm text-espresso placeholder:text-espresso/35 focus:outline-none transition-colors font-sans resize-none ${
                errors.message
                  ? "border-red-500 focus:border-red-600"
                  : "border-espresso/20 focus:border-espresso"
              }`}
            />
            {errors.message && (
              <p id="message-error" className="mt-1.5 text-xs text-red-600 font-sans flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.message}
              </p>
            )}
          </div>

          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              "SENDING..."
            ) : (
              <>
                <Send className="w-3.5 h-3.5 mr-2 inline" />
                SEND MESSAGE
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
};
