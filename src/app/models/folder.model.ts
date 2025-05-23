export type FolderRow = readonly [number, string, number | null];
export type ItemRow = readonly [number, string, number];

export interface FolderItemTreeApiResponse {
  folders: {
    columns: readonly ['id', 'title', 'parent_id'];
    data: readonly FolderRow[];
  };
  items: {
    columns: readonly ['id', 'title', 'folder_id'];
    data: readonly ItemRow[];
  };
}

export interface TreeNode {
  title: string;
  items: { id: number; title: string }[];
  allItemIds?: number[];
  subfolders?: Record<string, TreeNode>;
}
