import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { FormElement, FormConfig, FormElementType } from '../types/form';

interface FormBuilderState {
  form: FormConfig;
  selectedElementId: string | null;
  draggedItem: any;
  theme: 'light' | 'dark';
  previewMode: boolean;
}

type FormBuilderAction =
  | { type: 'ADD_ELEMENT'; payload: { element: FormElement; index?: number } }
  | { type: 'UPDATE_ELEMENT'; payload: { id: string; updates: Partial<FormElement> } }
  | { type: 'DELETE_ELEMENT'; payload: { id: string } }
  | { type: 'REORDER_ELEMENTS'; payload: { dragIndex: number; dropIndex: number } }
  | { type: 'SELECT_ELEMENT'; payload: { id: string | null } }
  | { type: 'SET_DRAGGED_ITEM'; payload: any }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_PREVIEW_MODE'; payload: boolean }
  | { type: 'LOAD_FORM'; payload: FormConfig }
  | { type: 'UPDATE_FORM_SETTINGS'; payload: Partial<FormConfig> };

const initialState: FormBuilderState = {
  form: {
    id: 'form-' + Date.now(),
    title: 'Untitled Form',
    description: '',
    elements: [],
    theme: 'light',
    styles: {
      primaryColor: '#3B82F6',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  selectedElementId: null,
  draggedItem: null,
  theme: 'light',
  previewMode: false
};

function formBuilderReducer(state: FormBuilderState, action: FormBuilderAction): FormBuilderState {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const { element, index } = action.payload;
      const newElements = [...state.form.elements];
      if (index !== undefined) {
        newElements.splice(index, 0, element);
      } else {
        newElements.push(element);
      }
      return {
        ...state,
        form: {
          ...state.form,
          elements: newElements,
          updatedAt: new Date().toISOString()
        }
      };
    }
    case 'UPDATE_ELEMENT': {
      const { id, updates } = action.payload;
      return {
        ...state,
        form: {
          ...state.form,
          elements: state.form.elements.map(el => 
            el.id === id ? { ...el, ...updates } : el
          ),
          updatedAt: new Date().toISOString()
        }
      };
    }
    case 'DELETE_ELEMENT': {
      return {
        ...state,
        form: {
          ...state.form,
          elements: state.form.elements.filter(el => el.id !== action.payload.id),
          updatedAt: new Date().toISOString()
        },
        selectedElementId: state.selectedElementId === action.payload.id ? null : state.selectedElementId
      };
    }
    case 'REORDER_ELEMENTS': {
      const { dragIndex, dropIndex } = action.payload;
      const newElements = [...state.form.elements];
      const draggedElement = newElements[dragIndex];
      newElements.splice(dragIndex, 1);
      newElements.splice(dropIndex, 0, draggedElement);
      return {
        ...state,
        form: {
          ...state.form,
          elements: newElements,
          updatedAt: new Date().toISOString()
        }
      };
    }
    case 'SELECT_ELEMENT':
      return { ...state, selectedElementId: action.payload.id };
    case 'SET_DRAGGED_ITEM':
      return { ...state, draggedItem: action.payload };
    case 'TOGGLE_THEME':
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      return { 
        ...state, 
        theme: newTheme,
        form: {
          ...state.form,
          theme: newTheme,
          styles: {
            ...state.form.styles,
            backgroundColor: newTheme === 'light' ? '#FFFFFF' : '#1F2937',
            textColor: newTheme === 'light' ? '#1F2937' : '#F9FAFB'
          }
        }
      };
    case 'SET_PREVIEW_MODE':
      return { ...state, previewMode: action.payload };
    case 'LOAD_FORM':
      return { 
        ...state, 
        form: action.payload,
        theme: action.payload.theme,
        selectedElementId: null 
      };
    case 'UPDATE_FORM_SETTINGS':
      return {
        ...state,
        form: {
          ...state.form,
          ...action.payload,
          updatedAt: new Date().toISOString()
        }
      };
    default:
      return state;
  }
}

interface FormBuilderContextType {
  state: FormBuilderState;
  dispatch: React.Dispatch<FormBuilderAction>;
  generateElementId: () => string;
  createElement: (type: FormElementType) => FormElement;
}

const FormBuilderContext = createContext<FormBuilderContextType | undefined>(undefined);

export function FormBuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formBuilderReducer, initialState);

  const generateElementId = () => `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const createElement = (type: FormElementType): FormElement => {
    const id = generateElementId();
    const baseElement = {
      id,
      type,
      label: getDefaultLabel(type),
      required: false,
      styles: {}
    };

    switch (type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'date':
        return { ...baseElement, placeholder: `Enter ${getDefaultLabel(type).toLowerCase()}` };
      case 'textarea':
        return { ...baseElement, placeholder: 'Enter your message' };
      case 'select':
      case 'radio':
        return { ...baseElement, options: ['Option 1', 'Option 2', 'Option 3'] };
      case 'checkbox':
        return { ...baseElement, label: 'Check this box' };
      case 'file':
        return { ...baseElement, label: 'Upload File' };
      case 'submit':
        return { ...baseElement, label: 'Submit Form' };
      default:
        return baseElement;
    }
  };

  const getDefaultLabel = (type: FormElementType): string => {
    const labels = {
      text: 'Text Input',
      textarea: 'Text Area',
      email: 'Email Address',
      password: 'Password',
      number: 'Number Input',
      date: 'Date Picker',
      checkbox: 'Checkbox',
      radio: 'Radio Buttons',
      select: 'Dropdown',
      file: 'File Upload',
      submit: 'Submit Button'
    };
    return labels[type] || 'Form Element';
  };

  return (
    <FormBuilderContext.Provider value={{ state, dispatch, generateElementId, createElement }}>
      {children}
    </FormBuilderContext.Provider>
  );
}

export function useFormBuilder() {
  const context = useContext(FormBuilderContext);
  if (context === undefined) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider');
  }
  return context;
}