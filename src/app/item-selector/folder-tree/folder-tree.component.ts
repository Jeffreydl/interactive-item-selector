import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import type { TreeNode } from '@/app/models/folder.model';

@Component({
  selector: 'app-folder-tree',
  templateUrl: './folder-tree.component.html',
  styleUrl: './folder-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderTreeComponent {
  readonly folderTree = input<Record<string, TreeNode>>();
  readonly selectedItems = input.required<Set<number>>();
  readonly folderToggled = output<{ node: TreeNode; checked: boolean }>();
  readonly itemToggled = output<{ itemId: number; checked: boolean }>();
  readonly entries = computed<[string, TreeNode][]>(() => Object.entries(this.folderTree() ?? {}));
  readonly depth = input<number>(1);

  sanitizeId(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '');
  }

  getCheckboxState(node: TreeNode): 'checked' | 'indeterminate' | 'unchecked' {
    const selectedItems = this.selectedItems();
    if (!node.allItemIds || !selectedItems) return 'unchecked';

    const selectedCount = node.allItemIds.filter((id: number) => selectedItems.has(id)).length;
    const total = node.allItemIds.length;

    if (selectedCount === 0) return 'unchecked';
    if (selectedCount === total) return 'checked';
    return 'indeterminate';
  }

  getCheckboxStatus(event: Event): boolean {
    return (event.target as HTMLInputElement)?.checked ?? false;
  }

  isItemChecked(id: number): boolean {
    return this.selectedItems()?.has(id) ?? false;
  }
}
