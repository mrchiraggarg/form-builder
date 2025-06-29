import React, { useState } from 'react';
import { X, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useFormBuilder } from '../contexts/FormBuilderContext';

export default function SettingsPanel() {
  const { state, dispatch } = useFormBuilder();
  const [newOption, setNewOption] = useState('');

  const selectedElement = state.form.elements.find(el => el.id === state.selectedElementId);

  const handleUpdateElement = (updates: any) => {
    if (selectedElement) {
      dispatch({ 
        type: 'UPDATE_ELEMENT', 
        payload: { id: selectedElement.id, updates } 
      });
    }
  };

  const handleAddOption = () => {
    if (newOption.trim() && selectedElement) {
      const currentOptions = selectedElement.options || [];
      handleUpdateElement({ 
        options: [...currentOptions, newOption.trim()] 
      });
      setNewOption('');
    }
  };

  const handleDeleteOption = (index: number) => {
    if (selectedElement?.options) {
      const newOptions = selectedElement.options.filter((_, i) => i !== index);
      handleUpdateElement({ options: newOptions });
    }
  };

  const handleUpdateFormSettings = (updates: any) => {
    dispatch({ type: 'UPDATE_FORM_SETTINGS', payload: updates });
  };

  const togglePreviewMode = () => {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: !state.previewMode });
  };

  const inputClasses = `
    w-full px-3 py-2 border rounded-lg transition-colors
    ${state.theme === 'dark' 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
    }
    focus:outline-none focus:ring-2 focus:ring-blue-500/20
  `;

  const labelClasses = `block text-sm font-medium mb-2 ${state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`;

  return (
    <div className={`w-80 ${state.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l overflow-y-auto`}>
      <div className="p-6">
        {/* Preview Toggle */}
        <button
          onClick={togglePreviewMode}
          className={`
            w-full mb-6 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2
            ${state.previewMode
              ? (state.theme === 'dark' ? 'bg-green-700 text-white hover:bg-green-600' : 'bg-green-600 text-white hover:bg-green-700')
              : (state.theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700')
            }
          `}
        >
          {state.previewMode ? <EyeOff size={18} /> : <Eye size={18} />}
          <span>{state.previewMode ? 'Exit Preview' : 'Preview Form'}</span>
        </button>

        {!selectedElement ? (
          <div>
            <h2 className={`text-lg font-semibold mb-6 ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Form Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Form Title</label>
                <input
                  type="text"
                  value={state.form.title}
                  onChange={(e) => handleUpdateFormSettings({ title: e.target.value })}
                  className={inputClasses}
                />
              </div>
              
              <div>
                <label className={labelClasses}>Description</label>
                <textarea
                  value={state.form.description || ''}
                  onChange={(e) => handleUpdateFormSettings({ description: e.target.value })}
                  rows={3}
                  className={inputClasses}
                  placeholder="Optional form description"
                />
              </div>

              <div>
                <label className={labelClasses}>Primary Color</label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={state.form.styles?.primaryColor || '#3B82F6'}
                    onChange={(e) => handleUpdateFormSettings({ 
                      styles: { ...state.form.styles, primaryColor: e.target.value }
                    })}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={state.form.styles?.primaryColor || '#3B82F6'}
                    onChange={(e) => handleUpdateFormSettings({ 
                      styles: { ...state.form.styles, primaryColor: e.target.value }
                    })}
                    className={inputClasses}
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Element Settings
              </h2>
              <button
                onClick={() => dispatch({ type: 'SELECT_ELEMENT', payload: { id: null } })}
                className={`
                  p-1.5 rounded transition-colors
                  ${state.theme === 'dark' 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-500'
                  }
                `}
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Label</label>
                <input
                  type="text"
                  value={selectedElement.label}
                  onChange={(e) => handleUpdateElement({ label: e.target.value })}
                  className={inputClasses}
                />
              </div>

              {selectedElement.type !== 'submit' && selectedElement.type !== 'checkbox' && (
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedElement.required}
                      onChange={(e) => handleUpdateElement({ required: e.target.checked })}
                      className={`
                        w-4 h-4 rounded transition-colors
                        ${state.theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-blue-500' 
                          : 'bg-white border-gray-300 text-blue-600'
                        }
                      `}
                    />
                    <span className={`text-sm ${state.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                      Required field
                    </span>
                  </label>
                </div>
              )}

              {['text', 'textarea', 'email', 'password', 'number'].includes(selectedElement.type) && (
                <div>
                  <label className={labelClasses}>Placeholder</label>
                  <input
                    type="text"
                    value={selectedElement.placeholder || ''}
                    onChange={(e) => handleUpdateElement({ placeholder: e.target.value })}
                    className={inputClasses}
                  />
                </div>
              )}

              {['radio', 'select'].includes(selectedElement.type) && (
                <div>
                  <label className={labelClasses}>Options</label>
                  <div className="space-y-2 mb-3">
                    {selectedElement.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(selectedElement.options || [])];
                            newOptions[index] = e.target.value;
                            handleUpdateElement({ options: newOptions });
                          }}
                          className={inputClasses}
                        />
                        <button
                          onClick={() => handleDeleteOption(index)}
                          className={`
                            p-2 rounded transition-colors
                            ${state.theme === 'dark' 
                              ? 'text-red-400 hover:bg-red-900/20' 
                              : 'text-red-600 hover:bg-red-50'
                            }
                          `}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="New option"
                      className={inputClasses}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                    />
                    <button
                      onClick={handleAddOption}
                      disabled={!newOption.trim()}
                      className={`
                        px-3 py-2 rounded-lg transition-colors
                        ${state.theme === 'dark' 
                          ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-700' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300'
                        }
                        disabled:cursor-not-allowed
                      `}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}