import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { authInterceptor } from './auth.interceptor';
import { errorInterceptor } from './error.interceptor';

import { AuthFacade } from '../auth/auth.facade';
import { AuthRefreshService } from '../auth/auth-refresh.service';
import { of } from 'rxjs';

describe('AuthInterceptor', () => {
  it('deve tentar refresh ao receber 401 e repetir request', () => {
    const authFacadeMock = {
      getAccessTokenSnapshot: () => 'OLD',
      getRefreshTokenSnapshot: () => 'REFRESH',
      setTokens: () => {},
      logout: () => {}
    } as any;

    const refreshMock = {
      refreshOnce: () => of('NEW')
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthFacade, useValue: authFacadeMock },
        { provide: AuthRefreshService, useValue: refreshMock },
        provideHttpClient(withInterceptors([errorInterceptor, authInterceptor])),
        provideHttpClientTesting()
      ]
    });

    const http = TestBed.inject(HttpClient);
    const ctrl = TestBed.inject(HttpTestingController);

    http.get('/v1/pets').subscribe();

    const req1 = ctrl.expectOne('/v1/pets');
    expect(req1.request.headers.get('Authorization')).toBe('Bearer OLD');
    req1.flush({}, { status: 401, statusText: 'Unauthorized' });

    const req2 = ctrl.expectOne('/v1/pets');
    expect(req2.request.headers.get('Authorization')).toBe('Bearer NEW');
    req2.flush({ items: [], total: 0 });

    ctrl.verify();
  });
});
