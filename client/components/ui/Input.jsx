import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      type = "text",
      label,
      error,
      helper,
      icon,
      placeholder,
      className = "",
      size = "md",
      variant = "default",
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "w-full rounded-lg border transition-all duration-200 focus:outline-none";

    const variants = {
      default:
        "border-gray-300 focus:border-[#cc6600] focus:ring-2 focus:ring-[#cc6600]/20",
      error:
        "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
      success:
        "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20",
    };

    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-5 py-4 text-lg",
    };

    const currentVariant = error ? "error" : variant;
    const classes = `${baseClasses} ${variants[currentVariant]} ${
      sizes[size]
    } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"} ${className}`;

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-[#3b1a0b]">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={`${classes} ${icon ? "pl-10" : ""}`}
            disabled={disabled}
            required={required}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {helper && !error && <p className="text-sm text-gray-500">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
