"use client";

import { EducationFields } from "@/lib/types";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export default function FieldVisibilityMenu({
  position,
  onClose,
  visibility,
  onToggle,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 250),
    y: Math.min(position.y, window.innerHeight - 300),
  };

  return createPortal(
    <div
      ref={menuRef}
      className="fixed bg-white rounded-md shadow-lg border border-gray-200 z-50 w-64"
      style={{
        top: `${adjustedPosition.y}px`,
        left: `${adjustedPosition.x}px`,
      }}
    >
      <div className="p-3 space-y-3">
        {EducationFields.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <Label htmlFor={`show-${key}`} className="text-sm">
              {label}
            </Label>
            <Switch
              id={`show-${key}`}
              checked={visibility?.[key] ?? false}
              onCheckedChange={(checked) => onToggle(key, checked)}
              className="data-[state=checked]:bg-teal-500"
            />
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
}
