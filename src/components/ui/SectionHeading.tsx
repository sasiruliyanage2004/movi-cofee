import React from "react";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  align?: "left" | "center" | "asymmetrical";
  theme?: "light" | "dark";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = "left",
  theme = "light",
  className = "",
}) => {
  const isDark = theme === "dark";

  if (align === "asymmetrical") {
    return (
      <div className={`mb-12 md:mb-20 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end ${className}`}>
        <div className="lg:col-span-7">
          {eyebrow && (
            <span
              className={`inline-block text-[11px] font-sans uppercase tracking-[0.25em] mb-4 ${
                isDark ? "text-muted-gold" : "text-muted-coffee"
              }`}
            >
              {eyebrow}
            </span>
          )}
          <h2
            className={`font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.12] tracking-tight ${
              isDark ? "text-warm-cream" : "text-espresso"
            }`}
          >
            {title}
          </h2>
        </div>
        {subtitle && (
          <div className="lg:col-span-5 lg:pb-2">
            <div
              className={`w-12 h-px mb-4 ${
                isDark ? "bg-warm-cream/20" : "bg-espresso/20"
              }`}
            />
            <p
              className={`font-sans text-sm sm:text-base font-normal leading-relaxed ${
                isDark ? "text-warm-cream/70" : "text-espresso/70"
              }`}
            >
              {subtitle}
            </p>
          </div>
        )}
      </div>
    );
  }

  const alignmentClasses =
    align === "center"
      ? "text-center mx-auto items-center"
      : "text-left items-start";

  return (
    <div
      className={`mb-12 md:mb-16 flex flex-col ${alignmentClasses} max-w-3xl ${className}`}
    >
      {eyebrow && (
        <span
          className={`inline-block text-[11px] font-sans uppercase tracking-[0.25em] mb-4 ${
            isDark ? "text-muted-gold" : "text-muted-coffee"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.14] tracking-tight ${
          isDark ? "text-warm-cream" : "text-espresso"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-5 font-sans text-sm sm:text-base font-normal leading-relaxed max-w-2xl ${
            isDark ? "text-warm-cream/70" : "text-espresso/70"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
