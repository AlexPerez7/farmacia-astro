import { beforeEach, describe, expect, it, vi } from 'vitest';

// Los stores leen localStorage al cargarse, así que cada test importa una copia nueva del módulo.
beforeEach(() => localStorage.clear());

async function cargarComuna() {
  vi.resetModules();
  return import('../../src/stores/comuna');
}
async function cargarFavoritos() {
  vi.resetModules();
  return import('../../src/stores/favoritos');
}

describe('store de comuna', () => {
  it('la primera visita asigna Providencia sin confirmar', async () => {
    const c = await cargarComuna();
    expect(c.$comuna.get()).toBe('Providencia');
    expect(c.$comunaConfirmada.get()).toBe(false);
  });

  it('mantener confirma la comuna y la recuerda', async () => {
    (await cargarComuna()).mantenerComuna();
    expect((await cargarComuna()).$comunaConfirmada.get()).toBe(true);
  });

  it('elegir guarda la comuna e ignora nombres desconocidos', async () => {
    const c = await cargarComuna();
    c.elegirComuna('Ñuñoa');
    c.elegirComuna('Atlántida');
    expect(c.$comuna.get()).toBe('Ñuñoa');
    expect((await cargarComuna()).$comuna.get()).toBe('Ñuñoa');
  });

  it('una comuna guardada inválida vuelve a la por defecto', async () => {
    localStorage.setItem('pulso:comuna', 'Atlántida');
    const c = await cargarComuna();
    expect(c.$comuna.get()).toBe('Providencia');
    expect(c.$comunaConfirmada.get()).toBe(false);
  });
});

describe('store de favoritos', () => {
  it('alternar agrega al inicio y vuelve a quitar', async () => {
    const f = await cargarFavoritos();
    f.alternarFavorito('a');
    f.alternarFavorito('b');
    expect(f.$favoritos.get()).toEqual(['b', 'a']);
    f.alternarFavorito('a');
    expect(f.$favoritos.get()).toEqual(['b']);
    expect((await cargarFavoritos()).$favoritos.get()).toEqual(['b']);
  });
});
