import { TestBed } from '@angular/core/testing';
import { PetsListPage } from './pets-list.page';
import { PetsFacade } from '../../data-access/pets.facade';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('PetsListPage', () => {
  it('deve renderizar cards a partir do facade.items$', async () => {
    await TestBed.configureTestingModule({
      imports: [PetsListPage],
      providers: [
        {
          provide: PetsFacade,
          useValue: {
            items$: of([{ id: 1, nome: 'Luna', especie: 'Gato', idade: 2, raca: 'SRD', fotoUrl: null }]),
            total$: of(1),
            page$: of(1),
            loadingList$: of(false),
            error$: of(null),
            loadPets: () => of(true),
            searchByName: () => of(true),
            goToPage: () => of(true),
            store: { snapshot: { page: 1, total: 1, size: 10 } }
          }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PetsListPage);
    fixture.detectChanges();

    const cardLinks = fixture.debugElement.queryAll(By.css('a[aria-label="Abrir detalhes do pet"]'));
    expect(cardLinks.length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Luna');
  });
});
