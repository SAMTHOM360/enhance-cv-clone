"use client"

import { useRef, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function AchievementsSettingsPanel({
    achievement,
    onToggleVisibility,
    onClose,
}) {
    const panelRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                onClose()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [onClose])

    if (!achievement) return null

    return (
        <div ref={panelRef} className="AchievementsSettingsPanel bg-white rounded-md shadow-lg border border-gray-200 w-auto p-4 space-y-3 mt-2">
            <div className="flex items-center justify-between">
                <Label htmlFor="show-group-name" className="text-sm">
                    Show Description
                </Label>
                <Switch
                    id="show-group-name"
                    checked={achievement.visibility?.description !== false}
                    onCheckedChange={(checked) => onToggleVisibility("description", checked)}
                    className="data-[state=checked]:bg-teal-500 cursor-pointer"
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="show-compact-mode" className="text-sm">
                    Show Icon
                </Label>
                <Switch
                    id="show-compact-mode"
                    checked={achievement.visibility?.icon !== false}
                    onCheckedChange={(checked) => onToggleVisibility("icon", checked)}
                    className="data-[state=checked]:bg-teal-500 cursor-pointer"
                />
            </div>
        </div>
    )
}
