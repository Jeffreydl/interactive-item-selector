import { Component } from '@angular/core';
import { render, screen, fireEvent } from '@testing-library/angular';
import { FolderTreeComponent } from './folder-tree.component';
import type { TreeNode } from '@/app/models/folder.model';

@Component({
  template: `
    <app-folder-tree
      [folderTree]="folderTree"
      [selectedItems]="selectedItems"
      (folderToggled)="onFolderToggled($event)"
      (itemToggled)="onItemToggled($event)"
    />
  `,
  standalone: true,
  imports: [FolderTreeComponent],
})
class HostComponent {
  folderTree: Record<string, TreeNode> = {};
  selectedItems = new Set<number>();
  onFolderToggled = jest.fn();
  onItemToggled = jest.fn();
}

const mockTree: Record<string, TreeNode> = {
  'Folder A': {
    title: 'Folder A',
    items: [
      { id: 1, title: 'Item 1' },
      { id: 2, title: 'Item 2' },
    ],
    allItemIds: [1, 2],
    subfolders: {
      'Subfolder B': {
        title: 'Subfolder B',
        items: [{ id: 3, title: 'Item 3' }],
        allItemIds: [3],
        subfolders: {},
      },
    },
  },
};

describe('FolderTreeComponent', () => {
  let folderTree: Record<string, TreeNode>;
  let selectedItems: Set<number>;
  let renderResult: Awaited<ReturnType<typeof render>>;
  let host: HostComponent;

  async function setup() {
    renderResult = await render(HostComponent, {
      componentProperties: {
        folderTree,
        selectedItems,
      },
    });
    host = renderResult.fixture.componentInstance as HostComponent;
  }

  beforeEach(() => {
    folderTree = mockTree;
    selectedItems = new Set();
  });

  it('renders folder and item labels', async () => {
    await setup();
    expect(screen.getByLabelText('Folder A')).toBeInTheDocument();
    expect(screen.getByLabelText('Item 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Item 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Subfolder B')).toBeInTheDocument();
    expect(screen.getByLabelText('Item 3')).toBeInTheDocument();
  });

  it('shows checked state if all items in a folder are selected', async () => {
    selectedItems = new Set([1, 2]);
    await setup();
    const folderA = screen.getByLabelText('Folder A') as HTMLInputElement;
    expect(folderA.checked).toBe(true);
    expect(folderA.indeterminate).toBe(false);
  });

  it('shows unchecked state if no items in a folder items are selected', async () => {
    selectedItems = new Set();
    await setup();
    const folderA = screen.getByLabelText('Folder A') as HTMLInputElement;
    expect(folderA.checked).toBe(false);
    expect(folderA.indeterminate).toBe(false);
  });

  it('shows indeterminate state if some but not all items in a folder are selected', async () => {
    selectedItems = new Set([1]);
    await setup();
    const folderA = screen.getByLabelText('Folder A') as HTMLInputElement;
    expect(folderA.checked).toBe(false);
    expect(folderA.indeterminate).toBe(true);
  });

  it('should replaces spaces with a dash', async () => {
    await setup();
    const input = screen.getByLabelText('Folder A');
    const sanitizedId = 'folder-a';
    expect(input).toHaveAttribute('id', sanitizedId);
  });

  it('checks item checkbox if selected', async () => {
    selectedItems = new Set([2]);
    await setup();
    const item2 = screen.getByLabelText('Item 2') as HTMLInputElement;
    expect(item2.checked).toBe(true);

    const item1 = screen.getByLabelText('Item 1') as HTMLInputElement;
    expect(item1.checked).toBe(false);
  });

  it('emits itemToggled when an item is clicked', async () => {
    await setup();
    const item1 = screen.getByLabelText('Item 1') as HTMLInputElement;
    await fireEvent.click(item1);
    expect(host.onItemToggled).toHaveBeenCalledWith({ itemId: 1, checked: true });
  });

  it('emits folderToggled when a folder is clicked', async () => {
    await setup();
    const folderA = screen.getByLabelText('Folder A') as HTMLInputElement;
    await fireEvent.click(folderA);
    expect(host.onFolderToggled).toHaveBeenCalledWith(
      expect.objectContaining({
        node: expect.objectContaining({ title: 'Folder A' }),
        checked: true,
      }),
    );
  });
});
