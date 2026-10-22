import { useStore } from '@nanostores/react';
import { $comuna, $selectorComunaAbierto } from '../stores/comuna';
import { estimarDespacho, estimarRetiro } from '../lib/entrega';

/** Estimación de despacho y retiro según la comuna elegida en el header. */
export default function EntregaEstimada({ requiereReceta }: { requiereReceta: boolean }) {
  const comuna = useStore($comuna);
  const ahora = new Date();
  const despacho = estimarDespacho(comuna, ahora);
  const retiro = estimarRetiro(comuna, ahora);

  return (
    <div className="rounded-2xl border border-borde p-4 text-sm">
      <ul className="space-y-2">
        {!requiereReceta && (
          <li className="flex gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 size-4 shrink-0 text-acento" aria-hidden="true">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
              <circle cx="17" cy="18" r="2" />
              <circle cx="7" cy="18" r="2" />
            </svg>
            <span>
              <strong className="font-semibold text-texto">Despacho:</strong> <span className="text-texto-2">{despacho.texto}</span>
            </span>
          </li>
        )}
        <li className="flex gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 size-4 shrink-0 text-acento" aria-hidden="true">
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M2 7h20v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-2-1 2.7 2.7 0 0 1-4 0 2.7 2.7 0 0 1-4 0 2.7 2.7 0 0 1-4 0 2.7 2.7 0 0 1-2 1 2 2 0 0 1-2-2Z" />
          </svg>
          <span>
            <strong className="font-semibold text-texto">{requiereReceta ? 'Reserva:' : 'Retiro:'}</strong> <span className="text-texto-2">{retiro.texto}</span>
          </span>
        </li>
      </ul>
      <button type="button" onClick={() => $selectorComunaAbierto.set(true)} className="mt-3 font-semibold text-acento hover:underline">
        Cambiar comuna
      </button>
    </div>
  );
}
