/**
 * Flamingo 2.0 Button Component
 * Matches design system specifications for Primary, Secondary, and Tertiary buttons
 */

import { Loader2 } from "lucide-react";

export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "right",
  children,
  className = "",
  ...props
}) {
  const baseClasses = "inline-flex items-center justify-center font-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed";
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const variantClasses = {
    primary: {
      base: "bg-buttonPrimary text-white rounded-lg",
      hover: "hover:bg-buttonPrimary-hover",
      active: "active:bg-buttonPrimary-active",
      disabled: "disabled:bg-buttonPrimary-disabled disabled:text-buttonText-disabled",
      focus: "focus:ring-buttonPrimary",
    },
    secondary: {
      base: "bg-white text-buttonPrimary border border-buttonPrimary rounded-lg",
      hover: "hover:bg-hover",
      active: "active:bg-select",
      disabled: "disabled:bg-white disabled:border-buttonPrimary-disabled disabled:text-buttonText-disabled",
      focus: "focus:ring-buttonPrimary",
    },
    tertiary: {
      base: "bg-transparent text-buttonPrimary rounded-lg",
      hover: "hover:underline",
      active: "active:underline",
      disabled: "disabled:text-buttonText-disabled",
      focus: "focus:ring-buttonPrimary",
    },
  };

  const variantStyle = variantClasses[variant];
  const isDisabled = disabled || loading;

  const classes = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantStyle.base}
    ${!isDisabled ? variantStyle.hover : ""}
    ${!isDisabled ? variantStyle.active : ""}
    ${variantStyle.disabled}
    ${variantStyle.focus}
    ${className}
  `.trim().replace(/\s+/g, " ");

  const iconElement = loading ? (
    <Loader2 className="w-4 h-4 animate-spin" />
  ) : icon ? (
    <span className={iconPosition === "left" ? "mr-2" : "ml-2"}>
      {icon}
    </span>
  ) : null;

  return (
    <button
      className={classes}
      disabled={isDisabled}
      {...props}
    >
      {iconPosition === "left" && iconElement}
      {loading ? "Loading" : children}
      {iconPosition === "right" && iconElement}
    </button>
  );
}

export default Button;
