import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AppConfigService } from "../../../core/config/app-config.service";
import { map } from "rxjs";

@Injectable({ providedIn: "root" })
export class TutoresApiService {
  private http = inject(HttpClient);
  private config = inject(AppConfigService);

  list(page: number, size: number, query: string) {
    const apiPage = page - 1; // API usa 0-based
    let params = new HttpParams()
      .set("page", String(apiPage))
      .set("size", String(size));
    if (query?.trim()) params = params.set("nome", query.trim());

    return this.http
      .get<any>(`${this.config.apiBaseUrl}/v1/tutores`, { params })
      .pipe(
        map((raw) => {
          const responsePage =
            typeof raw?.page === "number" ? raw.page + 1 : page;
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
    return this.http.get<Tutor>(`${this.config.apiBaseUrl}/v1/tutores/${id}`);
  }

  create(dto: TutorCreateDto) {
    return this.http.post<Tutor>(`${this.config.apiBaseUrl}/v1/tutores`, dto);
  }

  update(id: number, dto: TutorUpdateDto) {
    return this.http.put<Tutor>(
      `${this.config.apiBaseUrl}/v1/tutores/${id}`,
      dto,
    );
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.config.apiBaseUrl}/v1/tutores/${id}`);
  }

  uploadPhoto(id: number, file: File) {
    const fd = new FormData();
    fd.append("foto", file); 
    return this.http.post<any>(
      `${this.config.apiBaseUrl}/v1/tutores/${id}/fotos`,
      fd,
    );
  }

  deletePhoto(tutorId: number, photoId: number) {
    return this.http.delete<void>(
      `${this.config.apiBaseUrl}/v1/tutores/${tutorId}/fotos/${photoId}`,
    );
  }

  vincularPet(tutorId: number, petId: number) {
    return this.http.post<any>(
      `${this.config.apiBaseUrl}/v1/tutores/${tutorId}/pets/${petId}`,
      {},
    );
  }

  removerVinculo(tutorId: number, petId: number) {
    return this.http.delete<any>(
      `${this.config.apiBaseUrl}/v1/tutores/${tutorId}/pets/${petId}`,
    );
  }
}
