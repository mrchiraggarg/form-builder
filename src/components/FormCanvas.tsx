import React from 'react';
import { Trash2, Copy, Settings } from 'lucide-react';
import { useFormBuilder } from '../contexts/FormBuilderContext';
import { FormElement } from '../types/form';
import FormElementRenderer from './FormElementRenderer';

export default function FormCanvas() {
  const { state, dispatch, createElement } = useFormBuilder();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (data) {
      const dragData = JSON.parse(data);
      if (dragData.isNew) {
        const element = createElement(dragData.type);
        dispatch({ type: 'ADD_ELEMENT', payload: { element } });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleElementClick = (elementId: string) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: { id: elementId } });
  };

  const handleDeleteElement = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'DELETE_ELEMENT', payload: { id: elementId } });
  };

  const handleDuplicateElement = (element: FormElement, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicatedElement = {
      ...element,
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label: `${element.label} (Copy)`
    };
    dispatch({ type: 'ADD_ELEMENT', payload: { element: duplicatedElement } });
  };

  if (state.previewMode) {
    return (
      <div className={`flex-1 p-8 overflow-y-auto ${state.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-2xl mx-auto">
          <div className={`
            p-8 rounded-xl shadow-lg
            ${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          `}>
            <div className="mb-8">
              <h1 className={`text-2xl font-bold mb-2 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {state.form.title}
              </h1>
              {state.form.description && (
                <p className={`${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {state.form.description}
                </p>
              )}
            </div>
            
            <form className="space-y-6">
              {state.form.elements.map((element) => (
                <FormElementRenderer key={element.id} element={element} isPreview />
              ))}
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 p-8 overflow-y-auto ${state.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-2xl mx-auto">
        {state.form.elements.length === 0 ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`
              border-2 border-dashed rounded-xl p-16 text-center transition-colors
              ${state.theme === 'dark' 
                ? 'border-gray-600 bg-gray-800/50' 
                : 'border-gray-300 bg-white/50'
              }
            `}
          >
            <div className={`text-6xl mb-4 ${state.theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
              📝
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Start Building Your Form
            </h3>
            <p className={`${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Drag elements from the sidebar or click them to add to your form
            </p>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`
              rounded-xl shadow-lg p-8 min-h-[600px]
              ${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
            `}
          >
            <div className="mb-8">
              <h1 className={`text-2xl font-bold mb-2 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {state.form.title}
              </h1>
              {state.form.description && (
                <p className={`${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {state.form.description}
                </p>
              )}
            </div>

            <div className="space-y-4">
              {state.form.elements.map((element, index) => (
                <div
                  key={element.id}
                  onClick={() => handleElementClick(element.id)}
                  className={`
                    group relative p-4 rounded-lg border-2 transition-all cursor-pointer
                    ${state.selectedElementId === element.id
                      ? (state.theme === 'dark' ? 'border-blue-500 bg-blue-900/20' : 'border-blue-500 bg-blue-50')
                      : (state.theme === 'dark' ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300')
                    }
                  `}
                >
                  <FormElementRenderer element={element} />
                  
                  {/* Element Controls */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleElementClick(element.id);
                        }}
                        className={`
                          p-1.5 rounded text-xs transition-colors
                          ${state.theme === 'dark' 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }
                        `}
                        title="Edit element"
                      >
                        <Settings size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDuplicateElement(element, e)}
                        className={`
                          p-1.5 rounded text-xs transition-colors
                          ${state.theme === 'dark' 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }
                        `}
                        title="Duplicate element"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteElement(element.id, e)}
                        className={`
                          p-1.5 rounded text-xs transition-colors
                          ${state.theme === 'dark' 
                            ? 'bg-red-900 text-red-400 hover:bg-red-800' 
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }
                        `}
                        title="Delete element"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}