"use client"

import { useSelector, useDispatch } from "react-redux"
import { upsertActiveSection } from "@/lib/features/resume/resumeSlice"
import ResumeHeader from "@/components/resume-header"
import ResumeSection from "@/components/resume-section"
import { cn } from "@/lib/utils"

export default function ResumeTemplateStandard({ resumeRef }) {
    const dispatch = useDispatch()
    const activeSection = useSelector((state) => state.resume.activeSection)
    const { sections } = useSelector((state) => state.resume)

    const handleHeaderClick = () => {
        dispatch(upsertActiveSection({ activeSection: null }))
    }

    // Filter sections by column
    const leftSections = sections.filter((section) => section.column === "left")
    const rightSections = sections.filter((section) => section.column === "right")

    return (
        <div className={cn("w-full mx-auto bg-white p-2 md:p-9 min-h-[842px]", activeSection?.id !== null && "resume-editor-overlay-later")} ref={resumeRef}>
            <div onClick={handleHeaderClick}>
                <ResumeHeader isActive={activeSection?.id === null} />
            </div>

            <div className="flex gap-6 mt-6">
                {/* Left Column */}
                <div className="flex-1">
                    {leftSections.map((section) => (
                        <ResumeSection key={section.id} section={section} isActive={section.id === activeSection?.id} />
                    ))}
                </div>

                {/* Right Column */}
                <div className="flex-1">
                    {rightSections.map((section) => (
                        <ResumeSection key={section.id} section={section} isActive={section.id === activeSection?.id} />
                    ))}
                </div>
            </div>
        </div>
    )
}
