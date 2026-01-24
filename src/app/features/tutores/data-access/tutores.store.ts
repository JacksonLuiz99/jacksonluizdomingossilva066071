import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { TutoresState, initialTutoresState, Tutor } from './tutores.models';

@Injectable({ providedIn: 'root' })
export class TutoresStore {
  private readonly _state$ = new BehaviorSubject<TutoresState>(initialTutoresState);
  readonly state$ = this._state$.asObservable();

  readonly selected$ = this.state$.pipe(map(s => s.selected), distinctUntilChanged());
  readonly loadingDetail$ = this.state$.pipe(map(s => s.loadingDetail), distinctUntilChanged());
  readonly saving$ = this.state$.pipe(map(s => s.saving), distinctUntilChanged());
  readonly uploadingPhoto$ = this.state$.pipe(map(s => s.uploadingPhoto), distinctUntilChanged());
  readonly error$ = this.state$.pipe(map(s => s.error), distinctUntilChanged());

  get snapshot(): TutoresState {
    return this._state$.getValue();
  }

  patch(partial: Partial<TutoresState>) {
    this._state$.next({ ...this.snapshot, ...partial });
  }

  setSelected(t: Tutor | null) {
    this.patch({ selected: t });
  }
}
