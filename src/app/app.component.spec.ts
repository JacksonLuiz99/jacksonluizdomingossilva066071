import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AuthFacade } from './core/auth/auth.facade';
import { AppConfigService } from './core/config/app-config.service';

describe('AppComponent', () => {
  const authFacadeMock = {
    isAuthenticated$: { subscribe: () => {} },
    logout: () => {},
  };

  const configMock = {
    config: { APP_VERSION: '1.0.0', BUILD_TIME: '2024-01-01' },
    apiBaseUrl: 'http://test.com',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AuthFacade, useValue: authFacadeMock },
        { provide: AppConfigService, useValue: configMock },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'jacksonluizdomingossilva066071' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('jacksonluizdomingossilva066071');
  });

  it('should have appVersion getter', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.appVersion).toBe('1.0.0');
  });
});
