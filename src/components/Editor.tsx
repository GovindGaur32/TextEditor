import React from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { updateFileContent } from '../store/editorSlice';
import { FileItem } from '../types';

const Editor: React.FC = () => {
  const dispatch = useAppDispatch();
  const fileSystem = useAppSelector((state) => state.fileSystem);
  const activeFileId = useAppSelector((state) => state.activeFileId);

  const activeFile = fileSystem.find(
    (item) => item.type === 'file' && item.id === activeFileId
  ) as FileItem | undefined;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeFileId) {
      dispatch(updateFileContent({ id: activeFileId, content: e.target.value }));
    }
  };

  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white text-gray-400">
        <p>Select a file to edit</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <textarea
        value={activeFile.content}
        onChange={handleContentChange}
        className="flex-1 p-4 resize-none outline-none font-mono text-sm"
        placeholder="Start typing..."
      />
    </div>
  );
};

export default Editor;