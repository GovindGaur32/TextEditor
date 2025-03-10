import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditorState, FileSystemItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

const initialState: EditorState = {
  fileSystem: [],
  openFiles: [],
  activeFileId: null,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    //creating folder
    createFolder: (state, action: PayloadAction<{ name: string; parentId: string | null }>) => {
      const newFolder: FileSystemItem = {
        id: uuidv4(),
        name: action.payload.name,
        type: 'folder',
        isExpanded: true,
        parentId: action.payload.parentId,
      };
      state.fileSystem.push(newFolder);
    },
//creating file
    createFile: (state, action: PayloadAction<{ name: string; parentId: string | null }>) => {
      const fileName = action.payload.name.endsWith('.txt') 
        ? action.payload.name 
        : `${action.payload.name}.txt`;
      
      const newFile: FileSystemItem = {
        id: uuidv4(),
        name: fileName,
        content: '',
        type: 'file',
        parentId: action.payload.parentId,
      };
      state.fileSystem.push(newFile);
    },

    toggleFolder: (state, action: PayloadAction<string>) => {

      const folder = state.fileSystem.find(
        (item) => item.type === 'folder' && item.id === action.payload
      ) as FileSystemItem & { isExpanded: boolean } | undefined;
      
      if (folder) {
        folder.isExpanded = !folder.isExpanded;
      }
    },

    openFile: (state, action: PayloadAction<string>) => {
      const fileId = action.payload;
      if (!state.openFiles.includes(fileId)) {
        state.openFiles.push(fileId);
      }
      state.activeFileId = fileId;
    },

    closeFile: (state, action: PayloadAction<string>) => {
      const fileId = action.payload;
      state.openFiles = state.openFiles.filter((id) => id !== fileId);
      
      if (state.activeFileId === fileId) {
        state.activeFileId = state.openFiles.length > 0 ? state.openFiles[state.openFiles.length - 1] : null;
      }
    },

    setActiveFile: (state, action: PayloadAction<string>) => {
      state.activeFileId = action.payload;
    },

    updateFileContent: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const file = state.fileSystem.find(
        (item) => item.type === 'file' && item.id === action.payload.id
      ) as FileSystemItem & { content: string } | undefined;
      
      if (file) {
        file.content = action.payload.content;
      }
    },

    deleteItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      
      
      const getAllDescendantIds = (id: string): string[] => {
        const directChildren = state.fileSystem.filter(item => item.parentId === id);
        const childrenIds = directChildren.map(child => child.id);
        
        const descendantIds = [...childrenIds];
        
       
        directChildren
          .filter(child => child.type === 'folder')
          .forEach(folder => {
            descendantIds.push(...getAllDescendantIds(folder.id));
          });
        
        return descendantIds;
      };
      
      
      const idsToDelete = [itemId, ...getAllDescendantIds(itemId)];
      
      
      state.openFiles = state.openFiles.filter(id => !idsToDelete.includes(id));
      
      
      if (state.activeFileId && idsToDelete.includes(state.activeFileId)) {
        state.activeFileId = state.openFiles.length > 0 ? state.openFiles[state.openFiles.length - 1] : null;
      }
      
      
      state.fileSystem = state.fileSystem.filter(item => !idsToDelete.includes(item.id));
    },
  },
});

export const {
  createFolder,
  createFile,
  toggleFolder,
  openFile,
  closeFile,
  setActiveFile,
  updateFileContent,
  deleteItem,
} = editorSlice.actions;

export default editorSlice.reducer;