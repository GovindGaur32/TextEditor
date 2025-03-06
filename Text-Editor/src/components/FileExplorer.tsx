import React, { useState } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { createFolder, createFile, toggleFolder, openFile, deleteItem } from '../store/editorSlice';
import { FileSystemItem } from '../types';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, Plus, Trash2 } from 'lucide-react';

const FileExplorer: React.FC = () => {
  const dispatch = useAppDispatch();
  const fileSystem = useAppSelector((state) => state.fileSystem);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<'file' | 'folder' | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);

  const handleCreateItem = () => {
    if (!newItemName.trim()) return;

    if (newItemType === 'folder') {
      dispatch(createFolder({ name: newItemName, parentId }));
    } else if (newItemType === 'file') {
      dispatch(createFile({ name: newItemName, parentId }));
    }

    setNewItemName('');
    setNewItemType(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateItem();
    } else if (e.key === 'Escape') {
      setNewItemName('');
      setNewItemType(null);
    }
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      dispatch(deleteItem(id));
    }
  };

  const renderFileSystemItem = (item: FileSystemItem, depth = 0) => {
    const paddingLeft = `${depth * 16}px`;

    if (item.type === 'folder') {
      return (
        <div key={item.id}>
          <div 
            className="flex items-center py-1 hover:bg-gray-200 cursor-pointer group"
            style={{ paddingLeft }}
          >
            <span 
              className="mr-1 cursor-pointer" 
              onClick={() => dispatch(toggleFolder(item.id))}
            >
              {item.isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
            <span 
              className="flex items-center flex-1"
              onClick={() => dispatch(toggleFolder(item.id))}
            >
              {item.isExpanded ? <FolderOpen size={16} className="mr-1" /> : <Folder size={16} className="mr-1" />}
              {item.name}
            </span>
            <div className="hidden group-hover:flex">
              <button 
                className="p-1 hover:bg-gray-300 rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  setNewItemType('file');
                  setParentId(item.id);
                }}
              >
                <FileText size={14} />
              </button>
              <button 
                className="p-1 hover:bg-gray-300 rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  setNewItemType('folder');
                  setParentId(item.id);
                }}
              >
                <Folder size={14} />
              </button>
              <button 
                className="p-1 hover:bg-gray-300 rounded-md text-red-500"
                onClick={(e) => handleDeleteItem(item.id, e)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          
          {item.isExpanded && (
            <div>
              {fileSystem
                .filter((child) => child.parentId === item.id)
                .map((child) => renderFileSystemItem(child, depth + 1))}
              
              {newItemType && parentId === item.id && (
                <div className="flex items-center py-1" style={{ paddingLeft: `${(depth + 1) * 16}px` }}>
                  {newItemType === 'folder' ? <Folder size={16} className="mr-1" /> : <FileText size={16} className="mr-1" />}
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="bg-transparent outline-none border-b border-blue-500"
                    placeholder={`New ${newItemType}`}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div 
          key={item.id}
          className="flex items-center py-1 hover:bg-gray-200 cursor-pointer group"
          style={{ paddingLeft: `${paddingLeft}` }}
        >
          <div className="flex items-center flex-1" onClick={() => dispatch(openFile(item.id))}>
            <FileText size={16} className="mr-1 ml-5" />
            {item.name}
          </div>
          <div className="hidden group-hover:flex">
            <button 
              className="p-1 hover:bg-gray-300 rounded-md text-red-500"
              onClick={(e) => handleDeleteItem(item.id, e)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="h-full overflow-auto bg-gray-100 p-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">Explorer</h2>
        <div className="flex space-x-1">
          <button 
            className="p-1 hover:bg-gray-300 rounded-md"
            onClick={() => {
              setNewItemType('file');
              setParentId(null);
            }}
          >
            <FileText size={14} />
          </button>
          <button 
            className="p-1 hover:bg-gray-300 rounded-md"
            onClick={() => {
              setNewItemType('folder');
              setParentId(null);
            }}
          >
            <Folder size={14} />
          </button>
        </div>
      </div>
      
      <div>
        {fileSystem
          .filter((item) => item.parentId === null)
          .map((item) => renderFileSystemItem(item))}
        
        {newItemType && parentId === null && (
          <div className="flex items-center py-1">
            {newItemType === 'folder' ? <Folder size={16} className="mr-1" /> : <FileText size={16} className="mr-1" />}
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="bg-transparent outline-none border-b border-blue-500"
              placeholder={`New ${newItemType}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;