import { st } from "springtype/core";
import { Sheet } from "../datamodel/sheet";

export interface EditorContext {
    sheets: Array<Sheet>;
    activeSheetId: string,
}

export const INITIAL_EDITOR_CONTEXT_STATE: EditorContext = {
    sheets: [],
    activeSheetId: null,
};

export const EDITOR_CONTEXT = 'editor';

export const getEditorContext = () => {
    return st.context(EDITOR_CONTEXT, INITIAL_EDITOR_CONTEXT_STATE);
}