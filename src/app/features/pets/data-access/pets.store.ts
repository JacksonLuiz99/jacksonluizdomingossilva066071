import { Injectable } from "@angular/core";
import { BehaviorSubject, distinctUntilChanged, map } from "rxjs";
import { PetsState, initialPetsState, Pet } from "./pets.models";

@Injectable({ providedIn: "root" })
export class PetsStore {
  private readonly _state$ = new BehaviorSubject<PetsState>(initialPetsState);
  readonly state$ = this._state$.asObservable();

  // seletores
  readonly items$ = this.state$.pipe(
    map((s) => s.items),
    distinctUntilChanged()
  );
  readonly total$ = this.state$.pipe(
    map((s) => s.total),
    distinctUntilChanged()
  );
  readonly page$ = this.state$.pipe(
    map((s) => s.page),
    distinctUntilChanged()
  );
  readonly size$ = this.state$.pipe(
    map((s) => s.size),
    distinctUntilChanged()
  );
  readonly query$ = this.state$.pipe(
    map((s) => s.query),
    distinctUntilChanged()
  );

  readonly selectedPet$ = this.state$.pipe(
    map((s) => s.selected),
    distinctUntilChanged()
  );
  readonly selectedTutor$ = this.state$.pipe(
    map((s) => s.selectedTutor),
    distinctUntilChanged()
  );

  readonly loadingList$ = this.state$.pipe(
    map((s) => s.loadingList),
    distinctUntilChanged()
  );
  readonly loadingDetail$ = this.state$.pipe(
    map((s) => s.loadingDetail),
    distinctUntilChanged()
  );
  readonly saving$ = this.state$.pipe(
    map((s) => s.saving),
    distinctUntilChanged()
  );
  readonly uploadingPhoto$ = this.state$.pipe(
    map((s) => s.uploadingPhoto),
    distinctUntilChanged()
  );
  readonly error$ = this.state$.pipe(
    map((s) => s.error),
    distinctUntilChanged()
  );

  get snapshot(): PetsState {
    return this._state$.getValue();
  }

  patch(partial: Partial<PetsState>) {
    this._state$.next({ ...this.snapshot, ...partial });
  }

  resetSelected() {
    this.patch({ selected: null, selectedTutor: null, error: null });
  }

  upsertItem(item: Pet) {
    const items = [...this.snapshot.items];
    const idx = items.findIndex((p) => p.id === item.id);
    if (idx >= 0) items[idx] = item;
    else items.unshift(item);
    this.patch({ items });
  }

  removeItem(id: number) {
    this.patch({ items: this.snapshot.items.filter((p) => p.id !== id) });
  }
}
