import React from "react";

export type ContainerWidth = "narrow" | "default" | "wide" | "full";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: ContainerWidth;
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}

const widthStyles: Record<ContainerWidth, string> = {
  narrow: "max-w-4xl",
  default: "max-w-7xl",
  wide: "max-w-[1400px]",
  full: "max-w-full",
};

export const Container: React.FC<ContainerProps> = ({
  width = "default",
  className = "",
  children,
  as: Component = "div",
  ...props
}) => {
  return (
    <Component
      className={`mx-auto w-full px-5 sm:px-8 md:px-12 lg:px-16 ${widthStyles[width]} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
};
