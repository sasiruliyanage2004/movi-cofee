export interface Testimonial {
  id: string;
  quotePlaceholder: string;
  authorPlaceholder: string;
  roleOrNotePlaceholder: string;
  highlightTag: string;
}

export interface ReviewConfig {
  hasRealReviews: boolean;
  emptyStateHeading: string;
  emptyStateCopy: string;
  googleReviewUrlPlaceholder: string;
  testimonials: Testimonial[];
}

export const reviewConfig: ReviewConfig = {
  hasRealReviews: false, // Strict adherence: no fabricated reviews
  emptyStateHeading: "YOUR EXPERIENCE MATTERS TO US.",
  emptyStateCopy:
    "We are committed to delivering exceptional coffee and warm hospitality to Kaduwela. As our community grows, your reflections help us refine every detail.",
  googleReviewUrlPlaceholder: "https://g.page/r/review-placeholder",
  testimonials: [
    {
      id: "testimonial-1",
      quotePlaceholder:
        "\"[Guest feedback placeholder: A thoughtfully designed space where the coffee craft and peaceful ambience invite you to linger.]\"",
      authorPlaceholder: "[Guest Name Placeholder]",
      roleOrNotePlaceholder: "[Kaduwela Local / Frequent Guest]",
      highlightTag: "Atmosphere & Craft",
    },
    {
      id: "testimonial-2",
      quotePlaceholder:
        "\"[Guest feedback placeholder: Consistent espresso quality, refined presentation, and warm hospitality that sets a new standard.]\"",
      authorPlaceholder: "[Guest Name Placeholder]",
      roleOrNotePlaceholder: "[Specialty Coffee Explorer]",
      highlightTag: "Espresso Quality",
    },
    {
      id: "testimonial-3",
      quotePlaceholder:
        "\"[Guest feedback placeholder: A tranquil sanctuary away from the bustle. The pour-over is prepared with genuine passion.]\"",
      authorPlaceholder: "[Guest Name Placeholder]",
      roleOrNotePlaceholder: "[Neighborhood Regular]",
      highlightTag: "Calm Space",
    },
  ],
};
