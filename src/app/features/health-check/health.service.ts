import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AppConfigService } from "../../core/config/app-config.service";
import { AuthFacade } from "../../core/auth/auth.facade";
import { catchError, map, of } from "rxjs";

export interface CheckResult {
  ok: boolean;
  message: string;
}

@Injectable({ providedIn: "root" })
export class HealthService {
  private http = inject(HttpClient);
  private config = inject(AppConfigService);
  private auth = inject(AuthFacade);

  liveness(): CheckResult {
    return { ok: true, message: "App renderizada e executando." };
  }

  readiness() {
    const isAuth = this.auth.getAccessTokenSnapshot() != null;

    let params = new HttpParams().set("page", "1").set("size", "1");
    return this.http
      .get<any>(`${this.config.apiBaseUrl}/v1/pets`, { params })
      .pipe(
        map(
          (): CheckResult => ({
            ok: isAuth,
            message: isAuth
              ? "Comunicação com API OK e token presente."
              : "API respondeu, mas token ausente (não autenticado).",
          })
        ),
        catchError(() =>
          of({
            ok: false,
            message: "Falha ao comunicar com API (readiness FAIL).",
          })
        )
      );
  }

  health() {
    const live = this.liveness();
    return this.readiness().pipe(
      map((ready): CheckResult => {
        const ok = live.ok && ready.ok;
        return {
          ok,
          message: ok
            ? "HEALTH OK"
            : `HEALTH ${ready.ok ? "WARN" : "FAIL"} — ${ready.message}`,
        };
      })
    );
  }

  meta() {
    return {
      apiBaseUrl: this.config.apiBaseUrl,
      version: this.config.config.APP_VERSION,
      buildTime: this.config.config.BUILD_TIME,
    };
  }
}
