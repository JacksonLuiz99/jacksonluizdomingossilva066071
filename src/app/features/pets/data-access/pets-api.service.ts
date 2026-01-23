import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConfigService } from '../../../core/config/app-config.service';
import { Pet, PetCreateDto, PetUpdateDto } from './pets.models';
import { map } from 'rxjs';
import { mapToPageResult } from '../../../shared/components/utils/http.utils';

@Injectable({ providedIn: 'root' })
export class PetsApiService {
  private http = inject(HttpClient);
  private config = inject(AppConfigService);

  list(page: number, size: number, query: string) {
    // API está usando paginação baseada em 0, mas o frontend usa baseado em 1
    const apiPage = page - 1; // Converter para 0-indexed para a API
    let params = new HttpParams()
      .set('page', String(apiPage))
      .set('size', String(size));
    if (query?.trim()) params = params.set('nome', query.trim());

    return this.http
      .get<any>(`${this.config.apiBaseUrl}/v1/pets`, { params })
      .pipe(
        map((raw) => {
          // A API retorna page em 0-based, precisamos converter para 1-based para o store
          const responsePage =
            typeof raw?.page === 'number' ? raw.page + 1 : page;
          return {
            items: raw?.content ?? raw?.items ?? [],
            total: raw?.total ?? 0,
            page: responsePage,
            size: raw?.size ?? size,
          };
        }),
      );
  }

  getById(id: number) {
    return this.http.get<Pet>(`${this.config.apiBaseUrl}/v1/pets/${id}`);
  }

  create(dto: PetCreateDto) {
    return this.http.post<Pet>(`${this.config.apiBaseUrl}/v1/pets`, dto);
  }

  update(id: number, dto: PetUpdateDto) {
    return this.http.put<Pet>(`${this.config.apiBaseUrl}/v1/pets/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.config.apiBaseUrl}/v1/pets/${id}`);
  }

  uploadPhoto(id: number, file: File) {
    const fd = new FormData();
    fd.append('foto', file);
    return this.http.post<any>(
      `${this.config.apiBaseUrl}/v1/pets/${id}/fotos`,
      fd,
    );
  }

  deletePhoto(petId: number, photoId: number) {
    return this.http.delete<void>(
      `${this.config.apiBaseUrl}/v1/pets/${petId}/fotos/${photoId}`,
    );
  }

  // Busca TODOS os pets sem paginação (para autocomplete)
  listAll() {
    const params = new HttpParams().set('page', '0').set('size', '1000'); // Tamanho grande para pegar todos

    return this.http
      .get<any>(`${this.config.apiBaseUrl}/v1/pets`, { params })
      .pipe(map((raw) => raw?.content ?? raw?.items ?? []));
  }
}
