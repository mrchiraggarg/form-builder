import React from 'react';
import { FormElement } from '../types/form';
import { useFormBuilder } from '../contexts/FormBuilderContext';

interface FormElementRendererProps {
  element: FormElement;
  isPreview?: boolean;
}

export default function FormElementRenderer({ element, isPreview = false }: FormElementRendererProps) {
  const { state } = useFormBuilder();
  
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg transition-colors
    ${state.theme === 'dark' 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
    }
    focus:outline-none focus:ring-2 focus:ring-blue-500/20
  `;

  const labelClasses = `
    block text-sm font-medium mb-2
    ${state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}
    ${element.required ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}
  `;

  const renderElement = () => {
    switch (element.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={element.placeholder}
            className={inputClasses}
            disabled={!isPreview}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            placeholder={element.placeholder}
            rows={4}
            className={inputClasses}
            disabled={!isPreview}
          />
        );
      
      case 'email':
        return (
          <input
            type="email"
            placeholder={element.placeholder}
            className={inputClasses}
            disabled={!isPreview}
          />
        );
      
      case 'password':
        return (
          <input
            type="password"
            placeholder={element.placeholder}
            className={inputClasses}
            disabled={!isPreview}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            placeholder={element.placeholder}
            className={inputClasses}
            disabled={!isPreview}
          />
        );
      
      case 'date':
        return (
          <input
            type="date"
            className={inputClasses}
            disabled={!isPreview}
          />
        );
      
      case 'checkbox':
        return (
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              className={`
                w-4 h-4 rounded transition-colors
                ${state.theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-blue-500' 
                  : 'bg-white border-gray-300 text-blue-600'
                }
                focus:ring-2 focus:ring-blue-500/20
              `}
              disabled={!isPreview}
            />
            <span className={labelClasses.replace('block', 'inline').replace('mb-2', '')}>
              {element.label}
            </span>
          </label>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {element.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={element.id}
                  value={option}
                  className={`
                    w-4 h-4 transition-colors
                    ${state.theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-blue-500' 
                      : 'bg-white border-gray-300 text-blue-600'
                    }
                    focus:ring-2 focus:ring-blue-500/20
                  `}
                  disabled={!isPreview}
                />
                <span className={`text-sm ${state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        );
      
      case 'select':
        return (
          <select className={inputClasses} disabled={!isPreview}>
            <option value="">Select an option</option>
            {element.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'file':
        return (
          <input
            type="file"
            className={`
              w-full px-3 py-2 border rounded-lg transition-colors
              ${state.theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white' 
                : 'bg-white border-gray-300 text-gray-900 file:bg-gray-100 file:text-gray-700'
              }
              file:border-0 file:py-1 file:px-3 file:rounded file:text-sm file:font-medium
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            `}
            disabled={!isPreview}
          />
        );
      
      case 'submit':
        return (
          <button
            type={isPreview ? 'submit' : 'button'}
            className={`
              px-6 py-3 rounded-lg font-medium transition-colors
              ${state.theme === 'dark' 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500/20
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            disabled={!isPreview}
          >
            {element.label}
          </button>
        );
      
      default:
        return null;
    }
  };

  if (element.type === 'checkbox' || element.type === 'submit') {
    return (
      <div>
        {renderElement()}
      </div>
    );
  }

  return (
    <div>
      <label className={labelClasses}>
        {element.label}
      </label>
      {renderElement()}
    </div>
  );
}