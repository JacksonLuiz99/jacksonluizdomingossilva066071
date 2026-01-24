import { Injectable, inject } from '@angular/core';
import { PetsStore } from './pets.store';
import { PetsApiService } from './pets-api.service';
import { SnackbarService } from '../../../core/ui/snackbar.service';
import { PetCreateDto, PetUpdateDto } from './pets.models';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  of,
  switchMap,
  tap,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PetsFacade {
  private store = inject(PetsStore);
  private api = inject(PetsApiService);
  private snack = inject(SnackbarService);

  // exposições
  readonly items$ = this.store.items$;
  readonly total$ = this.store.total$;
  readonly page$ = this.store.page$;
  readonly size$ = this.store.size$;
  readonly query$ = this.store.query$;

  readonly selectedPet$ = this.store.selectedPet$;
  readonly selectedTutor$ = this.store.selectedTutor$;

  readonly loadingList$ = this.store.loadingList$;
  readonly loadingDetail$ = this.store.loadingDetail$;
  readonly saving$ = this.store.saving$;
  readonly uploadingPhoto$ = this.store.uploadingPhoto$;
  readonly error$ = this.store.error$;

  loadPets() {
    const { page, size, query } = this.store.snapshot;
    this.store.patch({ loadingList: true, error: null });

    return this.api.list(page, size, query).pipe(
      tap((res) => {
        this.store.patch({
          items: res.items,
          total: res.total,
          page: res.page,
          size: res.size,
        });
      }),
      catchError((err) => {
        console.error('[PetsFacade] Erro ao listar pets:', err);
        this.store.patch({
          error: err?.error?.message ?? 'Erro ao listar pets.',
        });
        return of(null);
      }),
      finalize(() => this.store.patch({ loadingList: false })),
    );
  }

  searchByName(name: string) {
    // debounce 300ms + reset page=1
    this.store.patch({ query: name ?? '', page: 1 });
    return of(name).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(() => this.loadPets()),
    );
  }

  goToPage(page: number) {
    this.store.patch({ page });
    return this.loadPets();
  }

  loadPetDetail(id: number) {
    this.store.patch({
      loadingDetail: true,
      error: null,
      selected: null,
      selectedTutor: null,
    });

    return this.api.getById(id).pipe(
      tap((pet) => this.store.patch({ selected: pet })),
      catchError((err) => {
        this.store.patch({
          error: err?.error?.message ?? 'Erro ao carregar pet.',
        });
        return of(null);
      }),
      finalize(() => this.store.patch({ loadingDetail: false })),
    );
  }

  createPet(dto: PetCreateDto) {
    this.store.patch({ saving: true, error: null });
    return this.api.create(dto).pipe(
      tap((p) => {
        this.store.upsertItem(p);
        this.snack.success('Pet criado com sucesso.');
      }),
      catchError((err) => {
        this.store.patch({
          error: err?.error?.message ?? 'Erro ao criar pet.',
        });
        this.snack.error(err?.error?.message ?? 'Erro ao criar pet.');
        return of(null);
      }),
      finalize(() => this.store.patch({ saving: false })),
    );
  }

  updatePet(id: number, dto: PetUpdateDto) {
    this.store.patch({ saving: true, error: null });
    return this.api.update(id, dto).pipe(
      tap((p) => {
        this.store.upsertItem(p);
        this.snack.success('Pet atualizado com sucesso.');
      }),
      catchError((err) => {
        this.store.patch({
          error: err?.error?.message ?? 'Erro ao atualizar pet.',
        });
        this.snack.error(err?.error?.message ?? 'Erro ao atualizar pet.');
        return of(null);
      }),
      finalize(() => this.store.patch({ saving: false })),
    );
  }

  deletePet(id: number) {
    this.store.patch({ saving: true, error: null });
    return this.api.delete(id).pipe(
      tap(() => {
        this.store.removeItem(id);
        this.snack.success('Pet excluído com sucesso.');
      }),
      catchError((err) => {
        this.store.patch({
          error: err?.error?.message ?? 'Erro ao excluir pet.',
        });
        this.snack.error(err?.error?.message ?? 'Erro ao excluir pet.');
        return of(null);
      }),
      finalize(() => this.store.patch({ saving: false })),
    );
  }

  uploadPetPhoto(id: number, file: File) {
    this.store.patch({ uploadingPhoto: true, error: null });
    return this.api.uploadPhoto(id, file).pipe(
      tap(() => {
        this.store.patch({ uploadingPhoto: false });
        this.snack.success('Foto do pet carregada com sucesso.');
      }),
      catchError((err) => {
        this.store.patch({
          error: err?.error?.message ?? 'Erro ao carregar foto do pet.',
        });
        this.snack.error(err?.error?.message ?? 'Erro ao carregar foto do pet.');
        return of(null);
      }),
      finalize(() => this.store.patch({ uploadingPhoto: false })),
    );
  }

  deletePetPhoto(petId: number, photoId: number) {
    this.store.patch({ saving: true, error: null });
    return this.api.deletePhoto(petId, photoId).pipe(
      tap(() => {
        this.store.patch({ saving: false });
        this.snack.success('Foto do pet excluída com sucesso.');
      }),
      catchError((err) => {
        this.store.patch({
          error: err?.error?.message ?? 'Erro ao excluir foto do pet.',
        });
        this.snack.error(err?.error?.message ?? 'Erro ao excluir foto do pet.');
        return of(null);
      }),
      finalize(() => this.store.patch({ saving: false })),
    );
  }

  // Carregar TODOS os pets (sem paginação) para autocomplete
  loadAllPets() {
    return this.api.listAll().pipe(
      catchError((err) => {
        console.error('[PetsFacade] Erro ao listar todos os pets:', err);
        return of([]);
      }),
    );
  }

  resetSelected() {
    this.store.resetSelected();
  }
}
