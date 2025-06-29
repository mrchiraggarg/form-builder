import React from 'react';
import { FormBuilderProvider } from './contexts/FormBuilderContext';
import Header from './components/Header';
import ElementsSidebar from './components/ElementsSidebar';
import FormCanvas from './components/FormCanvas';
import SettingsPanel from './components/SettingsPanel';

function App() {
  return (
    <FormBuilderProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <ElementsSidebar />
          <FormCanvas />
          <SettingsPanel />
        </div>
      </div>
    </FormBuilderProvider>
  );
}

export default App;