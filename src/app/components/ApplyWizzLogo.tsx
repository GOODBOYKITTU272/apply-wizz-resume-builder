import React from "react";

interface ApplyWizzLogoProps {
  variant?: "full" | "icon" | "white";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const ApplyWizzLogo: React.FC<ApplyWizzLogoProps> = ({
  variant = "full",
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: variant === "icon" ? "w-6 h-6" : "h-8",
    md: variant === "icon" ? "w-8 h-8" : "h-10",
    lg: variant === "icon" ? "w-12 h-12" : "h-14",
    xl: variant === "icon" ? "w-16 h-16" : "h-20",
  };

  const iconBgColor = variant === "white" ? "rgba(255, 255, 255, 0.1)" : "#2D3748";
  const textColor = variant === "white" ? "#FFFFFF" : "#4A90E2";
  const brandTextColor = variant === "white" ? "#FFFFFF" : "#4A90E2";

  const LogoIcon = () => (
    <div 
      className={`rounded-2xl flex items-center justify-center font-bold ${sizeClasses[size]} ${variant === "icon" ? "aspect-square" : ""} shadow-md`}
      style={{ 
        background: iconBgColor
      }}
    >
      <div className="flex items-center gap-0.5">
        <span 
          className={`font-bold ${
            size === "sm" ? "text-xs" : 
            size === "md" ? "text-sm" : 
            size === "lg" ? "text-lg" : "text-xl"
          }`}
          style={{ color: textColor }}
        >
          A
        </span>
        <span 
          className={`font-bold text-white ${
            size === "sm" ? "text-xs" : 
            size === "md" ? "text-sm" : 
            size === "lg" ? "text-lg" : "text-xl"
          }`}
        >
          W
        </span>
        <div className={`rounded-full bg-green-400 ${
          size === "sm" ? "w-1 h-1 ml-0.5" :
          size === "md" ? "w-1.5 h-1.5 ml-0.5" :
          size === "lg" ? "w-2 h-2 ml-1" : "w-2.5 h-2.5 ml-1"
        }`}></div>
      </div>
    </div>
  );

  if (variant === "icon") {
    return (
      <div className={className}>
        <LogoIcon />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon />
      <div className="flex flex-col">
        <span 
          className={`font-bold leading-tight ${
            size === "sm" ? "text-lg" : 
            size === "md" ? "text-xl" : 
            size === "lg" ? "text-2xl" : "text-3xl"
          }`}
          style={{ 
            fontFamily: "'Inter', sans-serif",
            color: brandTextColor,
            letterSpacing: "0.05em",
            fontWeight: "700"
          }}
        >
          APPLY WIZZ
        </span>
        {size !== "sm" && (
          <span 
            className={`text-xs font-medium leading-tight opacity-80`}
            style={{ 
              fontFamily: "'Inter', sans-serif",
              color: textColor
            }}
          >
            Your Career Partner
          </span>
        )}
      </div>
    </div>
  );
};

// Export individual components for specific use cases
export const ApplyWizzIcon: React.FC<Omit<ApplyWizzLogoProps, "variant">> = (props) => (
  <ApplyWizzLogo {...props} variant="icon" />
);

export const ApplyWizzLogoWhite: React.FC<Omit<ApplyWizzLogoProps, "variant">> = (props) => (
  <ApplyWizzLogo {...props} variant="white" />
);