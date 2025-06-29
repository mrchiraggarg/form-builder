export interface FormElement {
  id: string;
  type: FormElementType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: ValidationRule[];
  styles?: ElementStyles;
}

export type FormElementType = 
  | 'text' 
  | 'textarea' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'date' 
  | 'checkbox' 
  | 'radio' 
  | 'select' 
  | 'file' 
  | 'submit';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'min' | 'max' | 'pattern';
  value?: string | number;
  message: string;
}

export interface ElementStyles {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  fontSize?: string;
  fontWeight?: string;
}

export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  elements: FormElement[];
  theme: 'light' | 'dark';
  styles?: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DragItem {
  type: FormElementType;
  element?: FormElement;
  isNew: boolean;
}