"use client"

import { useSelector, useDispatch } from "react-redux"
import ResumeHeader from "@/components/resume-header"
import ResumeSection from "@/components/resume-section"
import { cn } from "@/lib/utils"
import { upsertActiveSection } from "@/lib/features/resume/resumeSlice"

export default function ResumeTemplateModern({ resumeRef }) {
    const dispatch = useDispatch()
    const activeSection = useSelector((state) => state.resume.activeSection)
    const { sections } = useSelector((state) => state.resume)

    const handleHeaderClick = () => {
        dispatch(upsertActiveSection({ activeSection: null }))
    }

    // For modern template, we'll display all sections in a single column
    // but maintain their original column property for consistency
    const allSections = [...sections].sort((a, b) => {
        // Sort by column first (left comes before right)
        if (a.column !== b.column) {
            return a.column === "left" ? -1 : 1
        }
        // If same column, maintain original order
        return sections.indexOf(a) - sections.indexOf(b)
    })

    return (
        <div className={cn("w-full mx-auto bg-white p-2 md:p-9 min-h-[842px]", activeSection?.id !== null && "resume-editor-overlay-later")} ref={resumeRef}>
            <div onClick={handleHeaderClick} className="flex items-start">
                <div className="flex-1">
                    <ResumeHeader isActive={activeSection?.id === null} />
                </div>
            </div>

            <div className="mt-6">
                {allSections.map((section) => (
                    <ResumeSection key={section.id} section={section} isActive={section.id === activeSection?.id} />
                ))}
            </div>
        </div>
    )
}
