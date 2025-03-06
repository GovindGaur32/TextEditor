import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import FileExplorer from './components/FileExplorer';
import Editor from './components/Editor';
import Tabs from './components/Tabs';

function TextEditor() {
  return (
    <div className="flex h-screen">
      <div className="w-64 border-r border-gray-300">
        <FileExplorer />
      </div>
      <div className="flex-1 flex flex-col">
        <Tabs />
        <Editor />
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="min-h-screen bg-white">
          <TextEditor />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;