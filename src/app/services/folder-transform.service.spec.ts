import { FolderTransformService } from './folder-transform.service';
import type { FolderItemTreeApiResponse, TreeNode } from '@/app/models/folder.model';

describe('FolderTransformService', () => {
  let service: FolderTransformService;

  beforeEach(() => {
    service = new FolderTransformService();
  });

  it('should transform API response to a Record<string, TreeNode>', () => {
    const mockApiResponse: FolderItemTreeApiResponse = {
      folders: {
        columns: ['id', 'title', 'parent_id'],
        data: [
          [1, 'Root', null],
          [2, 'Child', 1],
        ],
      },
      items: {
        columns: ['id', 'title', 'folder_id'],
        data: [
          [10, 'Item A', 1],
          [11, 'Item B', 2],
        ],
      },
    };

    const result: Record<string, TreeNode> = service.transformApiResponse(mockApiResponse);

    const expected: Record<string, TreeNode> = {
      Root: {
        title: 'Root',
        items: [{ id: 10, title: 'Item A' }],
        subfolders: {
          Child: {
            title: 'Child',
            items: [{ id: 11, title: 'Item B' }],
            allItemIds: [11],
          },
        },
        allItemIds: [10, 11],
      },
    };
    expect(result).toEqual(expected);
  });
});
