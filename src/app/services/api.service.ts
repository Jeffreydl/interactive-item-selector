import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import type { FolderItemTreeApiResponse } from '@/app/models/folder.model';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getItems(): Observable<FolderItemTreeApiResponse> {
    return this.http.get<FolderItemTreeApiResponse>(environment.apiUrl).pipe(
      catchError((err) => {
        console.error('Error fetching items', err);
        return throwError(() => err);
      }),
    );
  }
}
