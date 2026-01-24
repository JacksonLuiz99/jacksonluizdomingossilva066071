import { Injectable, inject } from '@angular/core';
import { TutoresStore } from './tutores.store';
import { TutoresApiService } from './tutores-api.service';
import { SnackbarService } from '../../../core/ui/snackbar.service';
import { TutorCreateDto, TutorUpdateDto } from './tutores.models';
import { catchError, finalize, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TutoresFacade {
  deleteTutor(id: number) {
    this.store.patch({ saving: true, error: null });
    return this.api.delete(id).pipe(
      tap(() => this.snack.success('Tutor excluído com sucesso.')),
      catchError((err) => {
        this.store.patch({
          error: err?.error?.message ?? 'Erro ao excluir tutor.',
        });
        return of(null);
      }),
      finalize(() => this.store.patch({ saving: false })),
    );
  }
  private store = inject(TutoresStore);
  private api = inject(TutoresApiService);
  private snack = inject(SnackbarService);

  readonly selected$ = this.store.selected$;
  readonly loadingDetail$ = this.store.loadingDetail$;
  readonly saving$ = this.store.saving$;
  readonly uploadingPhoto$ = this.store.uploadingPhoto$;
  readonly error$ = this.store.error$;

  loadTutorDetail(id: number) {
    this.store.patch({ loadingDetail: true, error: null, selected: null });
    return this.api.getById(id).pipe(
      tap((t) => this.store.setSelected(t)),
      catchError((err) => {
        this.store.patch({
          error: err?.error?.message ?? 'Erro ao carregar tutor.',
        });
        return of(null);
      }),
      finalize(() => this.store.patch({ loadingDetail: false })),
    );
  }

  createTutor(dto: TutorCreateDto) {
    this.store.patch({ saving: true, error: null });
    return this.api.create(dto).pipe(
      tap((t) => {
        this.store.setSelected(t);
        this.snack.success('Tutor criado com sucesso.');
      }),
      catchError((err) => {
        this.store.patch({
          error: err?.error?.message ?? 'Erro ao criar tutor.',
        });
        return of(null);
      }),
      finalize(() => this.store.patch({ saving: false })),
    );
  }

  updateTutor(id: number, dto: TutorUpdateDto) {
    this.store.patch({ saving: true, error: null });
    return this.api.update(id, dto).pipe(
      tap((t) => {
        this.store.setSelected(t);
        this.snack.success('Tutor atualizado com sucesso.');
      }),
      catchError((err) => {
        this.store.patch({
          error: err?.error?.message ?? 'Erro ao atualizar tutor.',
        });
        return of(null);
      }),
      finalize(() => this.store.patch({ saving: false })),
    );
  }

  deleteTutorPhoto(tutorId: number, photoId: number) {
    this.store.patch({ uploadingPhoto: true, error: null });
    return this.api.deletePhoto(tutorId, photoId).pipe(
      tap(() => this.snack.success('Foto removida com sucesso.')),
      catchError((err) => {
        this.store.patch({
          error: err?.error?.message ?? 'Erro ao remover foto.',
        });
        return of(null);
      }),
      finalize(() => this.store.patch({ uploadingPhoto: false })),
    );
  }

  uploadTutorPhoto(id: number, file: File) {
    this.store.patch({ uploadingPhoto: true, error: null });
    return this.api.uploadPhoto(id, file).pipe(
      tap(() => this.snack.success('Foto do tutor enviada.')),
      catchError((err) => {
        this.store.patch({
          error: err?.error?.message ?? 'Erro ao enviar foto.',
        });
        return of(null);
      }),
      finalize(() => this.store.patch({ uploadingPhoto: false })),
    );
  }

  vincularPet(tutorId: number, petId: number) {
    this.store.patch({ saving: true, error: null });
    return this.api.vincularPet(tutorId, petId).pipe(
      tap(() => this.snack.success('Pet vinculado ao tutor.')),
      catchError((err) => {
        this.store.patch({
          error: err?.error?.message ?? 'Erro ao vincular pet.',
        });
        return of(null);
      }),
      finalize(() => this.store.patch({ saving: false })),
    );
  }

  removerVinculo(tutorId: number, petId: number) {
    this.store.patch({ saving: true, error: null });
    return this.api.removerVinculo(tutorId, petId).pipe(
      tap(() => this.snack.success('Vínculo removido.')),
      catchError((err) => {
        this.store.patch({
          error: err?.error?.message ?? 'Erro ao remover vínculo.',
        });
        return of(null);
      }),
      finalize(() => this.store.patch({ saving: false })),
    );
  }
}
