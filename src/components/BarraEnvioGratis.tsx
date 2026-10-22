import { ENVIO_GRATIS_DESDE, clp } from '../lib/tienda';

export default function BarraEnvioGratis({ subtotal }: { subtotal: number }) {
  const falta = ENVIO_GRATIS_DESDE - subtotal;
  const progreso = Math.min(100, (subtotal / ENVIO_GRATIS_DESDE) * 100);
  return (
    <div className="rounded-xl bg-marca-50 p-3 text-sm">
      <p className="text-marca-900">
        {falta > 0 ? (
          <>
            Te faltan <strong>{clp(falta)}</strong> para el despacho gratis
          </>
        ) : (
          <strong>¡Tienes despacho gratis! 🎉</strong>
        )}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-marca-100">
        <div className="h-full rounded-full bg-marca-600 transition-[width] duration-300" style={{ width: `${progreso}%` }} />
      </div>
    </div>
  );
}
