export interface FileItem {
  id: string;
  name: string;
  content: string;
  type: 'file';
  parentId: string | null;
}

export interface FolderItem {
  id: string;
  name: string;
  type: 'folder';
  isExpanded: boolean;
  parentId: string | null;
}

export type FileSystemItem = FileItem | FolderItem;

export interface EditorState {
  fileSystem: FileSystemItem[];
  openFiles: string[];
  activeFileId: string | null;
}