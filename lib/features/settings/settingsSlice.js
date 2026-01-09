import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    branding: true,
    theme: "light",
    fontSize: 1,
    fontFamily: "Inter",
    template: "double-column",
    showTemplatesModal: false,
    showAddSectionModal: false,
    addSectionColumn: "left",
}

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        toggleBranding: (state) => {
            state.branding = !state.branding
        },

        setTheme: (state, action) => {
            state.theme = action.payload
        },

        setFontSize: (state, action) => {
            state.fontSize = action.payload
        },

        setFontFamily: (state, action) => {
            state.fontFamily = action.payload
        },

        setTemplate: (state, action) => {
            state.template = action.payload.template
        },

        setTemplatesModal: (state, action) => {
            state.showTemplatesModal = action.payload
        },

        setAddSectionModal: (state, action) => {
            state.showAddSectionModal = action.payload.isOpen
            if (action.payload.column) {
                state.addSectionColumn = action.payload.column
            }
        },
    },
})

export const {
    toggleBranding,
    setTheme,
    setFontSize,
    setFontFamily,
    setTemplate,
    setTemplatesModal,
    setAddSectionModal,
} = settingsSlice.actions

export default settingsSlice.reducer
