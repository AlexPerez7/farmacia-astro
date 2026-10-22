import { describe, expect, it } from 'vitest';
import { formatearRut, limpiarRut, rutValido } from '../../src/lib/rut';

describe('rutValido', () => {
  it.each(['12.345.678-5', '12345678-5', '123456785', '11.111.111-1', '7.654.321-6'])('acepta %s', (rut) => {
    expect(rutValido(rut)).toBe(true);
  });

  it.each(['10.000.013-K', '10000013-k', '10.000.004-0'])('acepta dígito verificador K o 0: %s', (rut) => {
    expect(rutValido(rut)).toBe(true);
  });

  it.each(['12.345.678-9', '10.000.013-1', '10.000.004-K', '', 'abc', '1-9', '123.456.789.012-3'])('rechaza %j', (rut) => {
    expect(rutValido(rut)).toBe(false);
  });
});

describe('formatearRut', () => {
  it('agrega puntos y guion', () => {
    expect(formatearRut('123456785')).toBe('12.345.678-5');
    expect(formatearRut('76543216')).toBe('7.654.321-6');
  });

  it('pasa la k a mayúscula', () => {
    expect(formatearRut('10000013k')).toBe('10.000.013-K');
  });

  it('deja intacto un valor demasiado corto', () => {
    expect(formatearRut('1')).toBe('1');
  });
});

describe('limpiarRut', () => {
  it('quita todo lo que no es dígito o K', () => {
    expect(limpiarRut(' 12.345.678-5 ')).toBe('123456785');
  });
});
