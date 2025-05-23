import { Injectable } from '@angular/core';
import type { FolderItemTreeApiResponse, TreeNode } from '@/app/models/folder.model';

@Injectable({ providedIn: 'root' })
export class FolderTransformService {
  transformApiResponse(api: FolderItemTreeApiResponse): Record<string, TreeNode> {
    const folderMap = new Map<
      number,
      { id: number; title: string; parentId: number | null; node: TreeNode }
    >();

    // 1. Create folder nodes
    for (const [id, title, parentId] of api.folders.data) {
      folderMap.set(id, {
        id,
        title,
        parentId,
        node: { title, items: [] },
      });
    }

    // 2. Assign items to their folders (as { id, title } objects)
    for (const [id, title, folderId] of api.items.data) {
      const folder = folderMap.get(folderId);
      if (folder) {
        folder.node.items.push({ id, title });
      }
    }

    // 3. Sort items alphabetically by title
    for (const folder of folderMap.values()) {
      folder.node.items.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
      );
    }

    // 4. Build the tree structure
    const tree: Record<string, TreeNode> = {};
    for (const folder of folderMap.values()) {
      if (folder.parentId === null) {
        tree[folder.title] = folder.node;
      } else {
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          parent.node.subfolders ??= {};
          parent.node.subfolders[folder.title] = folder.node;
        }
      }
    }

    // 5. Sort subfolders recursively
    const sortSubfolders = (node: TreeNode): void => {
      if (!node.subfolders) return;

      const sorted: Record<string, TreeNode> = {};
      for (const key of Object.keys(node.subfolders).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' }),
      )) {
        const subfolder = node.subfolders[key];
        sortSubfolders(subfolder);
        sorted[key] = subfolder;
      }
      node.subfolders = sorted;
    };

    Object.values(tree).forEach(sortSubfolders);

    // 6. Recursively collect all item IDs
    const collectAllItemIds = (node: TreeNode): number[] => {
      const ids = node.items.map((item) => item.id);

      if (node.subfolders) {
        for (const subfolder of Object.values(node.subfolders)) {
          ids.push(...collectAllItemIds(subfolder));
        }
      }

      node.allItemIds = ids;
      return ids;
    };

    Object.values(tree).forEach(collectAllItemIds);

    return tree;
  }
}
