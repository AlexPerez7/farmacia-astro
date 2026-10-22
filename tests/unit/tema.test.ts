import { beforeEach, describe, expect, it, vi } from 'vitest';

let sistemaOscuro = false;

async function cargarTema() {
  vi.resetModules();
  return import('../../src/stores/tema');
}

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  sistemaOscuro = false;
  vi.stubGlobal('matchMedia', (consulta: string) => ({
    matches: consulta === '(prefers-color-scheme: dark)' && sistemaOscuro,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
});

describe('tema', () => {
  it('parte en "sistema" y aplica el tema del sistema operativo', async () => {
    sistemaOscuro = true;
    const t = await cargarTema();
    expect(t.$tema.get()).toBe('sistema');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('rota sistema → claro → oscuro → sistema', async () => {
    const t = await cargarTema();
    const vistos = [t.$tema.get()];
    for (let i = 0; i < 3; i++) {
      t.rotarTema();
      vistos.push(t.$tema.get());
    }
    expect(vistos).toEqual(['sistema', 'claro', 'oscuro', 'sistema']);
  });

  it('"claro" y "oscuro" ignoran el sistema', async () => {
    sistemaOscuro = true;
    const t = await cargarTema();
    t.$tema.set('claro');
    expect(document.documentElement.dataset.theme).toBe('light');
    sistemaOscuro = false;
    t.$tema.set('oscuro');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('persiste la elección y la recupera al recargar', async () => {
    const t = await cargarTema();
    t.$tema.set('oscuro');
    expect(localStorage.getItem('pulso:tema')).toBe('oscuro');
    const recargado = await cargarTema();
    expect(recargado.$tema.get()).toBe('oscuro');
  });

  it('un valor desconocido guardado vuelve a "sistema"', async () => {
    localStorage.setItem('pulso:tema', 'morado');
    const t = await cargarTema();
    expect(t.$tema.get()).toBe('sistema');
  });
});
