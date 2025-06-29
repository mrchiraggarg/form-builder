import React, { useState } from 'react';
import { X, Copy, Download, CheckCircle } from 'lucide-react';
import { useFormBuilder } from '../contexts/FormBuilderContext';

interface ExportModalProps {
  onClose: () => void;
}

export default function ExportModal({ onClose }: ExportModalProps) {
  const { state } = useFormBuilder();
  const [activeTab, setActiveTab] = useState<'json' | 'html'>('json');
  const [copied, setCopied] = useState(false);

  const generateHTML = () => {
    const formHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${state.form.title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: ${state.theme === 'dark' ? '#111827' : '#f9fafb'};
      color: ${state.theme === 'dark' ? '#f9fafb' : '#111827'};
      padding: 2rem;
    }
    
    .form-container {
      max-width: 600px;
      margin: 0 auto;
      background: ${state.theme === 'dark' ? '#1f2937' : '#ffffff'};
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, ${state.theme === 'dark' ? '0.5' : '0.1'});
    }
    
    .form-title {
      font-size: 1.875rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: ${state.form.styles?.primaryColor || '#3b82f6'};
    }
    
    .form-description {
      color: ${state.theme === 'dark' ? '#d1d5db' : '#6b7280'};
      margin-bottom: 2rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: ${state.theme === 'dark' ? '#e5e7eb' : '#374151'};
    }
    
    .required::after {
      content: ' *';
      color: #ef4444;
    }
    
    .form-input, .form-textarea, .form-select {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid ${state.theme === 'dark' ? '#4b5563' : '#d1d5db'};
      border-radius: 8px;
      background: ${state.theme === 'dark' ? '#374151' : '#ffffff'};
      color: ${state.theme === 'dark' ? '#f9fafb' : '#111827'};
      transition: border-color 0.2s;
    }
    
    .form-input:focus, .form-textarea:focus, .form-select:focus {
      outline: none;
      border-color: ${state.form.styles?.primaryColor || '#3b82f6'};
      box-shadow: 0 0 0 3px ${state.form.styles?.primaryColor || '#3b82f6'}20;
    }
    
    .checkbox-group, .radio-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .checkbox-item, .radio-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .submit-btn {
      background: ${state.form.styles?.primaryColor || '#3b82f6'};
      color: white;
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .submit-btn:hover {
      background: ${state.form.styles?.primaryColor || '#2563eb'};
    }
  </style>
</head>
<body>
  <div class="form-container">
    <form id="generated-form">
      <h1 class="form-title">${state.form.title}</h1>
      ${state.form.description ? `<p class="form-description">${state.form.description}</p>` : ''}
      
      ${state.form.elements.map(element => {
        switch (element.type) {
          case 'text':
          case 'email':
          case 'password':
          case 'number':
            return `
              <div class="form-group">
                <label class="form-label ${element.required ? 'required' : ''}">${element.label}</label>
                <input type="${element.type}" class="form-input" placeholder="${element.placeholder || ''}" ${element.required ? 'required' : ''} />
              </div>
            `;
          case 'textarea':
            return `
              <div class="form-group">
                <label class="form-label ${element.required ? 'required' : ''}">${element.label}</label>
                <textarea class="form-textarea" rows="4" placeholder="${element.placeholder || ''}" ${element.required ? 'required' : ''}></textarea>
              </div>
            `;
          case 'date':
            return `
              <div class="form-group">
                <label class="form-label ${element.required ? 'required' : ''}">${element.label}</label>
                <input type="date" class="form-input" ${element.required ? 'required' : ''} />
              </div>
            `;
          case 'checkbox':
            return `
              <div class="form-group">
                <div class="checkbox-group">
                  <div class="checkbox-item">
                    <input type="checkbox" id="${element.id}" />
                    <label for="${element.id}">${element.label}</label>
                  </div>
                </div>
              </div>
            `;
          case 'radio':
            return `
              <div class="form-group">
                <label class="form-label ${element.required ? 'required' : ''}">${element.label}</label>
                <div class="radio-group">
                  ${element.options?.map((option, index) => `
                    <div class="radio-item">
                      <input type="radio" id="${element.id}_${index}" name="${element.id}" value="${option}" />
                      <label for="${element.id}_${index}">${option}</label>
                    </div>
                  `).join('') || ''}
                </div>
              </div>
            `;
          case 'select':
            return `
              <div class="form-group">
                <label class="form-label ${element.required ? 'required' : ''}">${element.label}</label>
                <select class="form-select" ${element.required ? 'required' : ''}>
                  <option value="">Select an option</option>
                  ${element.options?.map(option => `<option value="${option}">${option}</option>`).join('') || ''}
                </select>
              </div>
            `;
          case 'file':
            return `
              <div class="form-group">
                <label class="form-label ${element.required ? 'required' : ''}">${element.label}</label>
                <input type="file" class="form-input" ${element.required ? 'required' : ''} />
              </div>
            `;
          case 'submit':
            return `
              <div class="form-group">
                <button type="submit" class="submit-btn">${element.label}</button>
              </div>
            `;
          default:
            return '';
        }
      }).join('')}
    </form>
  </div>
  
  <script>
    document.getElementById('generated-form').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Form submitted! (This is a demo)');
    });
  </script>
</body>
</html>`;
    return formHTML;
  };

  const exportContent = activeTab === 'json' 
    ? JSON.stringify(state.form, null, 2)
    : generateHTML();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const filename = activeTab === 'json' 
      ? `${state.form.title.replace(/\s+/g, '-').toLowerCase()}.json`
      : `${state.form.title.replace(/\s+/g, '-').toLowerCase()}.html`;
    
    const blob = new Blob([exportContent], { 
      type: activeTab === 'json' ? 'application/json' : 'text/html' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`
        w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl
        ${state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
      `}>
        <div className={`p-6 border-b ${state.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-semibold ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Export Form
            </h2>
            <button
              onClick={onClose}
              className={`
                p-2 rounded-lg transition-colors
                ${state.theme === 'dark' 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-500'
                }
              `}
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex space-x-1 mt-4">
            <button
              onClick={() => setActiveTab('json')}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors
                ${activeTab === 'json'
                  ? (state.theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
                  : (state.theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                }
              `}
            >
              JSON
            </button>
            <button
              onClick={() => setActiveTab('html')}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors
                ${activeTab === 'html'
                  ? (state.theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
                  : (state.theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                }
              `}
            >
              HTML
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {activeTab === 'json' 
                ? 'Export your form structure as JSON for backup or sharing'
                : 'Export as complete HTML page ready to use'
              }
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleCopy}
                className={`
                  px-3 py-2 rounded-lg transition-colors flex items-center space-x-2
                  ${copied
                    ? (state.theme === 'dark' ? 'bg-green-700 text-white' : 'bg-green-600 text-white')
                    : (state.theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                  }
                `}
              >
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                className={`
                  px-3 py-2 rounded-lg transition-colors flex items-center space-x-2
                  ${state.theme === 'dark' 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                `}
              >
                <Download size={16} />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className={`
            border rounded-lg overflow-auto max-h-96
            ${state.theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
          `}>
            <pre className={`
              p-4 text-sm font-mono whitespace-pre-wrap
              ${state.theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}
            `}>
              {exportContent}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}