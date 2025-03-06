import React from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { closeFile, setActiveFile } from '../store/editorSlice';
import { FileText, X } from 'lucide-react';

const Tabs: React.FC = () => {
  const dispatch = useAppDispatch();
  const fileSystem = useAppSelector((state) => state.fileSystem);
  const openFiles = useAppSelector((state) => state.openFiles);
  const activeFileId = useAppSelector((state) => state.activeFileId);

  if (openFiles.length === 0) {
    return null;
  }

  return (
    <div className="flex bg-gray-200 border-b border-gray-300 overflow-x-auto">
      {openFiles.map((fileId) => {
        const file = fileSystem.find((item) => item.id === fileId);
        if (!file || file.type !== 'file') return null;

        const isActive = fileId === activeFileId;

        return (
          <div
            key={fileId}
            className={`flex items-center px-3 py-2 border-r border-gray-300 cursor-pointer ${
              isActive ? 'bg-white' : 'hover:bg-gray-300'
            }`}
            onClick={() => dispatch(setActiveFile(fileId))}
          >
            <FileText size={14} className="mr-1" />
            <span className="truncate max-w-xs">{file.name}</span>
            <button
              className="ml-2 p-1 rounded-full hover:bg-gray-400"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(closeFile(fileId));
              }}
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Tabs;