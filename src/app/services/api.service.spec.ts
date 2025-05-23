import { createHttpFactory, SpectatorHttp, HttpMethod } from '@ngneat/spectator/jest';
import { ApiService } from './api.service';
import type { FolderItemTreeApiResponse } from '@/app/models/folder.model';
import apiResponseMock from '@/assets/mocks/items';

describe('ApiService (Spectator)', () => {
  let spectator: SpectatorHttp<ApiService>;
  const createHttp = createHttpFactory(ApiService);
  const mockResponse: FolderItemTreeApiResponse = apiResponseMock;

  beforeEach(() => {
    spectator = createHttp();
  });

  it('should make a GET request to the correct URL', () => {
    spectator.service.getItems().subscribe();
    const req = spectator.expectOne('/assets/mocks/items.json', HttpMethod.GET);

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return expected data', () => {
    let result: FolderItemTreeApiResponse | undefined;
    spectator.service.getItems().subscribe((data) => {
      result = data;
    });
    spectator.expectOne('/assets/mocks/items.json', HttpMethod.GET).flush(mockResponse);
    expect(result).toEqual(mockResponse);
  });

  it('should handle error and call catchError', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      return;
    });
    let error;

    spectator.service.getItems().subscribe({
      error: (err) => {
        error = err;
      },
    });

    spectator
      .expectOne('/assets/mocks/items.json', HttpMethod.GET)
      .error(new ProgressEvent('error'), { status: 500 });

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching items', expect.anything());
    expect(error).toBeDefined();

    consoleSpy.mockRestore();
  });
});
