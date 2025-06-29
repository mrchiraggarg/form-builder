import React from 'react';
import { 
  Type, 
  AlignLeft, 
  Mail, 
  Lock, 
  Hash, 
  Calendar, 
  CheckSquare, 
  Circle, 
  ChevronDown, 
  Upload, 
  Send 
} from 'lucide-react';
import { FormElementType } from '../types/form';
import { useFormBuilder } from '../contexts/FormBuilderContext';

const elementTypes: Array<{
  type: FormElementType;
  label: string;
  icon: React.ReactNode;
  description: string;
}> = [
  { type: 'text', label: 'Text Input', icon: <Type size={20} />, description: 'Single line text input' },
  { type: 'textarea', label: 'Text Area', icon: <AlignLeft size={20} />, description: 'Multi-line text input' },
  { type: 'email', label: 'Email', icon: <Mail size={20} />, description: 'Email address input' },
  { type: 'password', label: 'Password', icon: <Lock size={20} />, description: 'Password input field' },
  { type: 'number', label: 'Number', icon: <Hash size={20} />, description: 'Numeric input field' },
  { type: 'date', label: 'Date', icon: <Calendar size={20} />, description: 'Date picker input' },
  { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare size={20} />, description: 'Single checkbox option' },
  { type: 'radio', label: 'Radio Group', icon: <Circle size={20} />, description: 'Multiple choice options' },
  { type: 'select', label: 'Dropdown', icon: <ChevronDown size={20} />, description: 'Dropdown selection' },
  { type: 'file', label: 'File Upload', icon: <Upload size={20} />, description: 'File upload input' },
  { type: 'submit', label: 'Submit Button', icon: <Send size={20} />, description: 'Form submission button' }
];

export default function ElementsSidebar() {
  const { state, dispatch, createElement } = useFormBuilder();

  const handleDragStart = (e: React.DragEvent, type: FormElementType) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type, isNew: true }));
    dispatch({ type: 'SET_DRAGGED_ITEM', payload: { type, isNew: true } });
  };

  const handleAddElement = (type: FormElementType) => {
    const element = createElement(type);
    dispatch({ type: 'ADD_ELEMENT', payload: { element } });
  };

  return (
    <div className={`w-80 ${state.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r overflow-y-auto`}>
      <div className="p-6">
        <h2 className={`text-lg font-semibold mb-6 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Form Elements
        </h2>
        
        <div className="space-y-3">
          {elementTypes.map((elementType) => (
            <div
              key={elementType.type}
              draggable
              onDragStart={(e) => handleDragStart(e, elementType.type)}
              onClick={() => handleAddElement(elementType.type)}
              className={`
                group p-4 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200
                ${state.theme === 'dark' 
                  ? 'border-gray-600 hover:border-blue-400 hover:bg-gray-700/50' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }
                transform hover:scale-105 hover:shadow-md
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  p-2 rounded-lg transition-colors
                  ${state.theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300 group-hover:bg-blue-600 group-hover:text-white' 
                    : 'bg-gray-100 text-gray-600 group-hover:bg-blue-500 group-hover:text-white'
                  }
                `}>
                  {elementType.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {elementType.label}
                  </h3>
                  <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {elementType.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}