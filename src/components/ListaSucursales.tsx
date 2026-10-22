import { useEffect, useState } from 'react';
import { estadoSucursal } from '../lib/entrega';
import { SUCURSALES } from '../lib/tienda';

const horario = ([abre, cierra]: [number, number]) => (abre === 0 && cierra === 24 ? '24 horas' : `${abre}:00 a ${cierra}:00`);

/** Sucursales con su horario. "Abierta ahora" se calcula en el navegador con la hora local (no en el build). */
export default function ListaSucursales() {
  const [ahora, setAhora] = useState<Date | null>(null);

  useEffect(() => {
    setAhora(new Date());
    const reloj = setInterval(() => setAhora(new Date()), 60_000);
    return () => clearInterval(reloj);
  }, []);

  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {SUCURSALES.map((s) => {
        const estado = ahora && estadoSucursal(s, ahora);
        return (
          <li key={s.id} className="flex flex-col rounded-2xl border border-borde bg-superficie p-5">
            <h2 className="text-lg font-bold">{s.nombre}</h2>
            <p className="text-sm text-texto-2">{s.direccion}</p>
            <p className="mt-3 min-h-6 text-sm font-semibold">
              {estado && (
                <span className={estado.abierta ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-400'}>
                  <span className={`mr-1.5 inline-block size-2 rounded-full ${estado.abierta ? 'bg-emerald-600' : 'bg-red-600'}`} aria-hidden="true" />
                  {estado.texto}
                </span>
              )}
            </p>
            <dl className="mt-3 space-y-1 border-t border-borde pt-3 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-tenue">Lunes a sábado</dt>
                <dd>{horario(s.horario.semana)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-tenue">Domingo y festivos</dt>
                <dd>{horario(s.horario.domingo)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-tenue">Teléfono (ficticio)</dt>
                <dd className="tabular-nums">{s.telefono}</dd>
              </div>
            </dl>
          </li>
        );
      })}
    </ul>
  );
}
