import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetPlaces(
      'http://localhost:3001/places',
      'Failed to fetch available places. Please try again later.',
    );
  }

  loadUserPlaces() {
    return this.fetPlaces(
      'http://localhost:3001/user-places',
      'Failed to fetch your places. Please try again later.',
    ).pipe(
      tap({
        next: (userPlaces) => {
          this.userPlaces.set(userPlaces);
        },
      }),
    );
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlace = this.userPlaces();
    if (!prevPlace.some((p) => p.id === place.id)) {
      this.userPlaces.set([...prevPlace, place]);
    }

    return this.http
      .put(`http://localhost:3001/user-places`, {
        placeId: place.id,
      })
      .pipe(
        catchError((error) => {
          this.userPlaces.set(prevPlace);
          this.errorService.showError('Failed to store the place');
          return throwError(() => new Error('Failed to load the place'));
        }),
      );
  }

  removeUserPlace(place: Place) {
    const prevPlace = this.userPlaces();
    if (prevPlace.some((p) => p.id === place.id)) {
      this.userPlaces.set(prevPlace.filter((p) => p.id !== place.id));
    }

    return this.http
      .delete(`http://localhost:3001/user-places/${place.id}`)
      .pipe(
        catchError((error) => {
          this.userPlaces.set(prevPlace);
          this.errorService.showError('Failed to remove the place');
          return throwError(() => new Error('Failed to remove the place'));
        }),
      );
  }

  private fetPlaces(url: string, errorMessage: string) {
    return this.http.get<{ places: Place[] }>(url).pipe(
      map((response) => response.places),
      catchError((error) => throwError(() => new Error(errorMessage))),
    );
  }
}
