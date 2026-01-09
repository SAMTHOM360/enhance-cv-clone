"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { reorderSections, upsertActiveSection } from "@/lib/features/resume/resumeSlice"
import ResumeSection from "@/components/resume-section"
import { Button } from "@/components/ui/button"
import { Camera, Plus, User } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import ResumeHeader from "@/components/resume-header"
import { setAddSectionModal } from "@/lib/features/settings/settingsSlice"
import { cn } from "@/lib/utils"

export default function ResumeTemplateElegant({ resumeRef }) {
    const dispatch = useDispatch()
    const activeSection = useSelector((state) => state.resume.activeSection)
    const { sections } = useSelector((state) => state.resume)
    const { header } = useSelector((state) => state.resume)
    const [draggedSection, setDraggedSection] = useState(null)

    const handleHeaderClick = () => {
        dispatch(upsertActiveSection({ activeSection: null }))
    }

    const handleAddSectionClick = (column) => {
        dispatch(setAddSectionModal({ isOpen: true, column }))
    }

    const handlePhotoClick = () => {
        if (activeSection?.id === null) {
            const event = new CustomEvent("openPhotoUpload", {})
            window.dispatchEvent(event)
        }
    }

    const leftSections = sections.filter((section) => section.column === "left")
    const rightSections = sections.filter((section) => section.column === "right")

    const handleDragStart = (result) => {
        setDraggedSection(result.draggableId)
    }

    const handleDragEnd = (result) => {
        setDraggedSection(null)

        if (!result.destination) return

        const sourceDroppableId = result.source.droppableId
        const destinationDroppableId = result.destination.droppableId

        if (sourceDroppableId === destinationDroppableId) {
            const isLeftColumn = sourceDroppableId === "left-column"
            const columnSections = isLeftColumn ? [...leftSections] : [...rightSections]

            const [movedSection] = columnSections.splice(result.source.index, 1)
            columnSections.splice(result.destination.index, 0, movedSection)

            const newSections = sections.filter((s) => s.column !== (isLeftColumn ? "left" : "right")).concat(columnSections)

            dispatch(reorderSections({ sections: newSections }))
        }

        else {
            const sourceList = sourceDroppableId === "left-column" ? [...leftSections] : [...rightSections]
            const destList = destinationDroppableId === "left-column" ? [...leftSections] : [...rightSections]

            const movedSectionIndex = result.source.index
            const movedSection = sourceList[movedSectionIndex]

            if (!movedSection) return

            const newColumn = destinationDroppableId === "left-column" ? "left" : "right"
            const updatedSection = {
                ...movedSection,
                column: newColumn,
            }

            sourceList.splice(movedSectionIndex, 1)

            const destListCopy = [...destList]
            destListCopy.splice(result.destination.index, 0, updatedSection)

            let newSections = []

            if (sourceDroppableId === "left-column" && destinationDroppableId === "right-column") {
                newSections = [
                    ...sections.filter((s) => s.column !== "left" && s.column !== "right"),
                    ...sourceList,
                    ...destListCopy,
                ]
            } else {
                newSections = [
                    ...sections.filter((s) => s.column !== "left" && s.column !== "right"),
                    ...destListCopy,
                    ...sourceList,
                ]
            }

            dispatch(reorderSections({ sections: newSections }))
        }
    }

    return (
        <div id="resume-container" className={cn("resume-container resume-page-wrapper h-full", activeSection?.id !== null && "resume-editor-overlay-later")} ref={resumeRef}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-8">
                <div className="left-column-side">
                    {/* Header - Name and title only */}
                    <div onClick={handleHeaderClick}>
                        <ResumeHeader isActive={activeSection?.id === null} hidePhoto={true} />
                    </div>

                    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                        <Droppable droppableId="left-column">
                            {(provided) => (
                                <div className="mt-6" ref={provided.innerRef} {...provided.droppableProps}>
                                    {leftSections.map((section, index) => (
                                        <Draggable
                                            key={section.id}
                                            draggableId={section.id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`${snapshot.isDragging ? "opacity-50" : ""}`}
                                                >
                                                    <ResumeSection section={section} isActive={section.id === activeSection?.id} darkMode={true} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

                <div className="hidden md:flex w-[380px] h-full absolute top-0 right-0 z-[0] bg-[#22405c]"></div>

                <div className="right-column-side text-white relative z-[1] pl-8">
                    {/* Profile photo in sidebar */}
                    {header.visibility.photo && (
                        <div className="flex justify-center mb-8" onClick={handleHeaderClick}>
                            <div
                                className={`w-32 h-32 ${header.roundPhoto ? "rounded-full" : "rounded-md"
                                    } overflow-hidden bg-gray-200 cursor-pointer`}
                                onClick={handlePhotoClick}
                            >
                                {header.photoUrl ? (
                                    <img src={header.photoUrl || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <User className="w-12 h-12" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                        <Droppable droppableId="right-column">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-6">
                                    {rightSections.map((section, index) => (
                                        <Draggable key={section.id} draggableId={section.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`${snapshot.isDragging ? "opacity-50" : ""}`}
                                                >
                                                    <ResumeSection section={section} isActive={section.id === activeSection?.id} darkMode={true} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        </div>
    )
}
