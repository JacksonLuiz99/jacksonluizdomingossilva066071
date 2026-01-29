import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

export interface EnderecoViaCep {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
}

@Injectable({
  providedIn: "root",
})
export class CepService {
  private http = inject(HttpClient);
  private readonly baseUrl = "https://brasilapi.com.br/api/cep/v2";

  consultarCep(cep: string): Observable<EnderecoViaCep> {
    const cleanCep = cep.replace(/\D/g, "");
    return this.http.get<EnderecoViaCep>(`${this.baseUrl}/${cleanCep}`);
  }
}
