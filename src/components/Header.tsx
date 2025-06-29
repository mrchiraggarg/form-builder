import React, { useState } from 'react';
import { Moon, Sun, Download, Upload, Save, Code, Eye } from 'lucide-react';
import { useFormBuilder } from '../contexts/FormBuilderContext';
import ExportModal from './ExportModal';

export default function Header() {
  const { state, dispatch } = useFormBuilder();
  const [showExportModal, setShowExportModal] = useState(false);

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const saveToLocalStorage = () => {
    const forms = JSON.parse(localStorage.getItem('form-builder-forms') || '[]');
    const existingIndex = forms.findIndex((f: any) => f.id === state.form.id);
    
    if (existingIndex >= 0) {
      forms[existingIndex] = state.form;
    } else {
      forms.push(state.form);
    }
    
    localStorage.setItem('form-builder-forms', JSON.stringify(forms));
    
    // Show success feedback
    const originalTitle = state.form.title;
    dispatch({ type: 'UPDATE_FORM_SETTINGS', payload: { title: '✓ Saved!' } });
    setTimeout(() => {
      dispatch({ type: 'UPDATE_FORM_SETTINGS', payload: { title: originalTitle } });
    }, 1000);
  };

  const loadFromLocalStorage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          try {
            const formData = JSON.parse(content);
            dispatch({ type: 'LOAD_FORM', payload: formData });
          } catch (error) {
            alert('Invalid form file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <header className={`
      border-b px-6 py-4 flex items-center justify-between
      ${state.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    `}>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FB</span>
          </div>
          <h1 className={`text-xl font-bold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Form Builder
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={saveToLocalStorage}
          className={`
            px-3 py-2 rounded-lg transition-colors flex items-center space-x-2
            ${state.theme === 'dark' 
              ? 'bg-green-700 text-white hover:bg-green-600' 
              : 'bg-green-600 text-white hover:bg-green-700'
            }
          `}
          title="Save form"
        >
          <Save size={16} />
          <span className="hidden sm:inline">Save</span>
        </button>

        <button
          onClick={loadFromLocalStorage}
          className={`
            px-3 py-2 rounded-lg transition-colors flex items-center space-x-2
            ${state.theme === 'dark' 
              ? 'bg-gray-700 text-white hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
          title="Load form"
        >
          <Upload size={16} />
          <span className="hidden sm:inline">Load</span>
        </button>

        <button
          onClick={() => setShowExportModal(true)}
          className={`
            px-3 py-2 rounded-lg transition-colors flex items-center space-x-2
            ${state.theme === 'dark' 
              ? 'bg-blue-700 text-white hover:bg-blue-600' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
          title="Export form"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button
          onClick={toggleTheme}
          className={`
            p-2 rounded-lg transition-colors
            ${state.theme === 'dark' 
              ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
          title="Toggle theme"
        >
          {state.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {showExportModal && (
        <ExportModal onClose={() => setShowExportModal(false)} />
      )}
    </header>
  );
}