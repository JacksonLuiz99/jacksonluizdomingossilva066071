import { PetsStore } from './pets.store';
import { initialPetsState } from './pets.models';

describe('PetsStore', () => {
  it('deve iniciar com estado inicial', () => {
    const store = new PetsStore();
    expect(store.snapshot).toEqual(initialPetsState);
  });

  it('patch deve atualizar estado de forma imutável', () => {
    const store = new PetsStore();
    store.patch({ page: 2, query: 'luna' });
    expect(store.snapshot.page).toBe(2);
    expect(store.snapshot.query).toBe('luna');
  });

  it('upsertItem deve adicionar novo item', () => {
    const store = new PetsStore();
    const pet = { id: 1, nome: 'Luna', idade: 2, raca: 'SRD' };
    store.upsertItem(pet);
    expect(store.snapshot.items.length).toBe(1);
    expect(store.snapshot.items[0]).toEqual(pet);
  });

  it('removeItem deve remover item por id', () => {
    const store = new PetsStore();
    store.patch({ items: [{ id: 1, nome: 'Luna', idade: 2, raca: 'SRD' }] });
    store.removeItem(1);
    expect(store.snapshot.items.length).toBe(0);
  });
});
