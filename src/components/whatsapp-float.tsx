"use client";

import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";

export function WhatsAppFloat() {
  const handleWhatsAppClick = () => {
    window.open("https://wa.link/xlnp6z", "_blank");
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "bg-green-500 hover:bg-green-600 text-white",
        "rounded-full p-4 shadow-lg hover:shadow-xl",
        "transition-all duration-300 ease-in-out",
        "hover:scale-110 active:scale-95",
        "flex items-center justify-center",
        "w-14 h-14 md:w-16 md:h-16",
        "group animate-bounce hover:animate-none"
      )}
      aria-label="Contact us on WhatsApp"
      title="Chat with us on WhatsApp"
      style={{
        animationDuration: "2s",
        animationIterationCount: "infinite",
      }}
    >
      <FaWhatsapp className="h-6 w-6 md:h-7 md:w-7 group-hover:rotate-12 transition-transform duration-300" />
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-full bg-green-300 opacity-20 animate-pulse"></div>
    </button>
  );
}
