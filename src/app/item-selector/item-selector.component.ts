import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '@/app/services/api.service';
import { FolderTransformService } from '@/app/services/folder-transform.service';
import type { FolderItemTreeApiResponse, TreeNode } from '@/app/models/folder.model';
import { FolderTreeComponent } from '@/app/item-selector/folder-tree/folder-tree.component';
@Component({
  selector: 'app-item-selector',
  imports: [FolderTreeComponent],
  templateUrl: './item-selector.component.html',
  styleUrl: './item-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemSelectorComponent {
  private api = inject(ApiService);
  private folderTransform = inject(FolderTransformService);

  private apiResponse = toSignal<FolderItemTreeApiResponse | null>(this.api.getItems(), {
    initialValue: null,
  });

  readonly folderTree = computed(() => {
    const data = this.apiResponse();
    return data ? this.folderTransform.transformApiResponse(data) : null;
  });

  selectedItems = signal(new Set<number>());

  get selectedItemsAsArray(): number[] {
    return Array.from(this.selectedItems()).sort((a, b) => a - b);
  }

  private updateSet(set: Set<number>, id: number, checked: boolean): void {
    if (checked) {
      set.add(id);
    } else {
      set.delete(id);
    }
  }

  onItemToggle({ itemId, checked }: { itemId: number; checked: boolean }): void {
    const newSet = new Set(this.selectedItems());
    this.updateSet(newSet, itemId, checked);
    this.selectedItems.set(newSet);
  }

  onFolderToggle({ node, checked }: { node: TreeNode; checked: boolean }): void {
    if (!node.allItemIds) return;
    const newSet = new Set(this.selectedItems());
    for (const id of node.allItemIds) {
      this.updateSet(newSet, id, checked);
    }
    this.selectedItems.set(newSet);
  }

  clearSelection(): void {
    this.selectedItems.set(new Set<number>());
  }
}
