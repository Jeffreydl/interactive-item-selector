import { render, fireEvent, screen } from '@testing-library/angular';
import { ItemSelectorComponent } from './item-selector.component';
import { FolderTreeComponent } from './folder-tree/folder-tree.component';
import { ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';

import { ApiService } from '@/app/services/api.service';
import { FolderTransformService } from '@/app/services/folder-transform.service';
import apiResponseMock from '@/assets/mocks/items';

const realTransformService = new FolderTransformService();
const transformedTree = realTransformService.transformApiResponse(apiResponseMock);

const mockApiService = {
  getItems: () => of(apiResponseMock),
};
const mockFolderTransformService = {
  transformApiResponse: () => transformedTree,
};

describe('ItemSelectorComponent', () => {
  let fixture: ComponentFixture<ItemSelectorComponent>;

  async function renderComponent() {
    const result = await render(ItemSelectorComponent, {
      imports: [FolderTreeComponent],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: FolderTransformService, useValue: mockFolderTransformService },
      ],
    });
    fixture = result.fixture;
    return result;
  }

  beforeEach(async () => {
    await renderComponent();
  });

  it('renders app-folder-tree when folderTree data is present', () => {
    expect(document.querySelector('app-folder-tree')).toBeTruthy();
  });

  it('renders the clear selection button and summary', () => {
    expect(screen.getByText('Clear selection')).toBeInTheDocument();
    expect(screen.getByText('Selected item IDs:')).toBeInTheDocument();
  });

  it('selects and display the individual item when the item is selected, and clears it when unchecked', () => {
    const itemCheckbox = screen.getByLabelText('Audio item 1');
    fireEvent.click(itemCheckbox);
    fixture.detectChanges();

    expect(screen.getByText('Selected item IDs: 5')).toBeInTheDocument();
    expect(fixture.componentInstance.selectedItems().has(5)).toBe(true);

    fireEvent.click(itemCheckbox);
    fixture.detectChanges();

    expect(screen.getByText('Selected item IDs:')).toBeInTheDocument();
    expect(fixture.componentInstance.selectedItems().size).toBe(0);
  });

  it('selects and displays all item IDs within a folder when the folder checkbox is checked, and clears them when unchecked', () => {
    const folderCheckbox = screen.getByLabelText('Audio');
    fireEvent.click(folderCheckbox);
    fixture.detectChanges();

    expect(screen.getByText('Selected item IDs: 1, 3, 4, 5, 7')).toBeInTheDocument();
    expect(fixture.componentInstance.selectedItems().size).toBe(5);

    fireEvent.click(folderCheckbox);
    fixture.detectChanges();

    expect(screen.getByText('Selected item IDs:')).toBeInTheDocument();
    expect(fixture.componentInstance.selectedItems().size).toBe(0);
  });

  it('clears any selected items when the clear selection button is clicked', () => {
    fixture.componentInstance.selectedItems.set(new Set([3, 7, 42]));
    fixture.detectChanges();

    expect(screen.getByText('Selected item IDs: 3, 7, 42')).toBeInTheDocument();

    const button = screen.getByText('Clear selection');
    fireEvent.click(button);
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedItems().size).toBe(0);
    expect(screen.getByText('Selected item IDs:')).toBeInTheDocument();
  });

  it('shows sorted selected item IDs', () => {
    fixture.componentInstance.selectedItems.set(new Set([3, 7, 42, 1]));
    fixture.detectChanges();

    expect(screen.getByText('Selected item IDs: 1, 3, 7, 42')).toBeInTheDocument();
  });
});
