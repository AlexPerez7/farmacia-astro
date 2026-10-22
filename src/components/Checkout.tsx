import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { $resumen, vaciar, type ItemCarro } from '../stores/carro';
import { formatearRut, rutValido } from '../lib/rut';
import { SUCURSALES, clp } from '../lib/tienda';
import { url } from '../lib/url';

export type Pedido = {
  numero: string;
  fecha: string;
  nombre: string;
  email: string;
  entrega: 'despacho' | 'retiro';
  destino: string;
  items: ItemCarro[];
  reservas: ItemCarro[];
  subtotal: number;
  envio: number;
  total: number;
};

export const CLAVE_PEDIDO = 'pulso:ultimo-pedido';

type Errores = Partial<Record<'nombre' | 'rut' | 'email' | 'telefono' | 'direccion' | 'comuna', string>>;

const COMUNAS = ['Providencia', 'Ñuñoa', 'Las Condes', 'Santiago', 'Maipú', 'La Florida', 'Puente Alto', 'Vitacura'];

export default function Checkout() {
  const r = useStore($resumen);
  const soloReservas = r.directos.length === 0;

  const [datos, setDatos] = useState({ nombre: '', rut: '', email: '', telefono: '', direccion: '', comuna: '' });
  const [entrega, setEntrega] = useState<'despacho' | 'retiro'>('despacho');
  const [sucursal, setSucursal] = useState(SUCURSALES[0].id);
  const [pago, setPago] = useState('webpay');
  const [errores, setErrores] = useState<Errores>({});
  const [procesando, setProcesando] = useState(false);

  if (r.unidades === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-borde-fuerte bg-superficie p-12 text-center">
        <p className="text-lg text-texto-2">No hay productos para pagar.</p>
        <a href={url('productos/')} className="mt-4 inline-block font-semibold text-acento hover:underline">
          Volver a la tienda
        </a>
      </div>
    );
  }

  // Los productos con receta siempre se retiran en sucursal.
  const modoEntrega = soloReservas ? 'retiro' : entrega;
  const envio = modoEntrega === 'despacho' ? r.envio : 0;
  const total = r.subtotal + envio;

  const set = (campo: keyof typeof datos) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setDatos((d) => ({ ...d, [campo]: e.target.value }));

  function validar(): Errores {
    const e: Errores = {};
    if (datos.nombre.trim().length < 3) e.nombre = 'Ingresa tu nombre completo.';
    if (!rutValido(datos.rut)) e.rut = 'El RUT no es válido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) e.email = 'Ingresa un correo válido.';
    if (!/^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/.test(datos.telefono.trim())) e.telefono = 'Formato: +56 9 1234 5678.';
    if (modoEntrega === 'despacho') {
      if (datos.direccion.trim().length < 5) e.direccion = 'Ingresa la dirección de despacho.';
      if (!datos.comuna) e.comuna = 'Selecciona una comuna.';
    }
    return e;
  }

  async function onSubmit(ev: React.SyntheticEvent<HTMLFormElement>) {
    ev.preventDefault();
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) {
      document.getElementById(`campo-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    setProcesando(true);
    // Simula la ida y vuelta a la pasarela de pago.
    await new Promise((res) => setTimeout(res, 1200));
    const suc = SUCURSALES.find((s) => s.id === sucursal)!;
    const pedido: Pedido = {
      numero: `FP-${Date.now().toString().slice(-7)}`,
      fecha: new Date().toISOString(),
      nombre: datos.nombre.trim(),
      email: datos.email.trim(),
      entrega: modoEntrega,
      destino: modoEntrega === 'despacho' ? `${datos.direccion.trim()}, ${datos.comuna}` : `${suc.nombre} — ${suc.direccion}`,
      items: r.directos,
      reservas: r.conReceta,
      subtotal: r.subtotal,
      envio,
      total,
    };
    try {
      sessionStorage.setItem(CLAVE_PEDIDO, JSON.stringify(pedido));
    } catch {
      // Sin almacenamiento la confirmación mostrará un mensaje genérico.
    }
    vaciar();
    location.href = url('confirmacion/');
  }

  const campo = 'w-full rounded-lg border bg-superficie px-3 py-2.5 text-base outline-none focus:border-marca-600 focus:ring-2 focus:ring-acento-suave';
  const borde = (k: keyof Errores) => (errores[k] ? 'border-red-400' : 'border-borde-fuerte');
  const error = (k: keyof Errores) =>
    errores[k] && (
      <p id={`error-${k}`} className="mt-1 text-xs text-red-600 dark:text-red-400">
        {errores[k]}
      </p>
    );

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-borde bg-superficie p-5">
          <h2 className="mb-4 font-bold">1. Tus datos</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="campo-nombre" className="mb-1 block text-sm font-medium">Nombre completo</label>
              <input id="campo-nombre" autoComplete="name" value={datos.nombre} onChange={set('nombre')} className={`${campo} ${borde('nombre')}`} aria-invalid={!!errores.nombre} aria-describedby="error-nombre" />
              {error('nombre')}
            </div>
            <div>
              <label htmlFor="campo-rut" className="mb-1 block text-sm font-medium">RUT</label>
              <input
                id="campo-rut"
                inputMode="text"
                placeholder="12.345.678-5"
                value={datos.rut}
                onChange={set('rut')}
                onBlur={() => setDatos((d) => ({ ...d, rut: formatearRut(d.rut) }))}
                className={`${campo} ${borde('rut')}`}
                aria-invalid={!!errores.rut}
                aria-describedby="error-rut"
              />
              {error('rut')}
            </div>
            <div>
              <label htmlFor="campo-telefono" className="mb-1 block text-sm font-medium">Teléfono</label>
              <input id="campo-telefono" type="tel" autoComplete="tel" placeholder="+56 9 1234 5678" value={datos.telefono} onChange={set('telefono')} className={`${campo} ${borde('telefono')}`} aria-invalid={!!errores.telefono} aria-describedby="error-telefono" />
              {error('telefono')}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="campo-email" className="mb-1 block text-sm font-medium">Correo electrónico</label>
              <input id="campo-email" type="email" autoComplete="email" value={datos.email} onChange={set('email')} className={`${campo} ${borde('email')}`} aria-invalid={!!errores.email} aria-describedby="error-email" />
              {error('email')}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-borde bg-superficie p-5">
          <h2 className="mb-4 font-bold">2. Entrega</h2>
          {soloReservas ? (
            <p className="mb-4 rounded-xl bg-aviso-fondo p-3 text-sm text-aviso-texto">Tu carro solo tiene productos con receta: se retiran en sucursal.</p>
          ) : (
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              {(['despacho', 'retiro'] as const).map((op) => (
                <label
                  key={op}
                  className={`cursor-pointer rounded-xl border-2 p-3 text-sm ${entrega === op ? 'border-marca-600 bg-acento-suave' : 'border-borde'}`}
                >
                  <input type="radio" name="entrega" value={op} checked={entrega === op} onChange={() => setEntrega(op)} className="sr-only" />
                  <span className="block font-semibold">{op === 'despacho' ? 'Despacho a domicilio' : 'Retiro en sucursal'}</span>
                  <span className="text-texto-2">{op === 'despacho' ? (r.envio === 0 ? 'Gratis' : clp(r.envio)) : 'Gratis'}</span>
                </label>
              ))}
            </div>
          )}

          {modoEntrega === 'despacho' ? (
            <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
              <div>
                <label htmlFor="campo-direccion" className="mb-1 block text-sm font-medium">Dirección</label>
                <input id="campo-direccion" autoComplete="street-address" value={datos.direccion} onChange={set('direccion')} className={`${campo} ${borde('direccion')}`} aria-invalid={!!errores.direccion} aria-describedby="error-direccion" />
                {error('direccion')}
              </div>
              <div>
                <label htmlFor="campo-comuna" className="mb-1 block text-sm font-medium">Comuna</label>
                <select id="campo-comuna" value={datos.comuna} onChange={set('comuna')} className={`${campo} ${borde('comuna')}`} aria-invalid={!!errores.comuna} aria-describedby="error-comuna">
                  <option value="">Selecciona…</option>
                  {COMUNAS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                {error('comuna')}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {SUCURSALES.map((s) => (
                <label key={s.id} className={`flex cursor-pointer gap-3 rounded-xl border p-3 text-sm ${sucursal === s.id ? 'border-marca-600 bg-acento-suave' : 'border-borde'}`}>
                  <input type="radio" name="sucursal" checked={sucursal === s.id} onChange={() => setSucursal(s.id)} className="mt-0.5 accent-marca-700" />
                  <span>
                    <span className="block font-semibold">{s.nombre}</span>
                    <span className="text-texto-2">{s.direccion}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
          {r.conReceta.length > 0 && !soloReservas && (
            <p className="mt-4 text-sm text-aviso-texto">
              Los productos con receta se reservan en {SUCURSALES.find((s) => s.id === sucursal)?.nombre}, aunque elijas despacho para el resto.
            </p>
          )}
        </section>

        {total > 0 && (
          <section className="rounded-2xl border border-borde bg-superficie p-5">
            <h2 className="mb-1 font-bold">3. Pago</h2>
            <p className="mb-4 text-sm text-tenue">Demo: no se realiza ningún cobro ni se piden datos de tarjeta.</p>
            <div className="space-y-2">
              {[
                { id: 'webpay', nombre: 'Tarjeta de débito o crédito (simulado)' },
                { id: 'transferencia', nombre: 'Transferencia bancaria (simulado)' },
              ].map((m) => (
                <label key={m.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm ${pago === m.id ? 'border-marca-600 bg-acento-suave' : 'border-borde'}`}>
                  <input type="radio" name="pago" checked={pago === m.id} onChange={() => setPago(m.id)} className="accent-marca-700" />
                  {m.nombre}
                </label>
              ))}
            </div>
          </section>
        )}
      </div>

      <aside className="h-fit space-y-4 rounded-2xl border border-borde bg-superficie p-5 lg:sticky lg:top-32">
        <h2 className="font-bold">Tu pedido</h2>
        <ul className="space-y-2 text-sm">
          {[...r.directos, ...r.conReceta].map((i) => (
            <li key={i.id} className="flex justify-between gap-2">
              <span className="min-w-0">
                <span className="text-tenue">{i.cantidad}×</span> {i.nombre}
                {i.requiereReceta && <span className="ml-1 text-xs font-semibold text-aviso-texto">(reserva)</span>}
              </span>
              <span className="shrink-0 tabular-nums">{clp(i.precio * i.cantidad)}</span>
            </li>
          ))}
        </ul>
        <dl className="space-y-2 border-t border-borde pt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-texto-2">Subtotal en línea</dt>
            <dd className="tabular-nums">{clp(r.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-texto-2">Despacho</dt>
            <dd className="tabular-nums">{envio === 0 ? 'Gratis' : clp(envio)}</dd>
          </div>
          {r.conReceta.length > 0 && (
            <div className="flex justify-between text-aviso-texto">
              <dt>Se paga en sucursal</dt>
              <dd className="tabular-nums">{clp(r.subtotalReceta)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-borde pt-3 text-base font-bold">
            <dt>Total a pagar hoy</dt>
            <dd className="tabular-nums">{clp(total)}</dd>
          </div>
        </dl>
        <button
          type="submit"
          disabled={procesando}
          className="w-full rounded-lg bg-marca-700 px-4 py-3 font-semibold text-white hover:bg-marca-800 disabled:cursor-wait disabled:opacity-70"
        >
          {procesando ? 'Procesando…' : total > 0 ? `Pagar ${clp(total)}` : 'Confirmar reserva'}
        </button>
        <p className="text-center text-xs text-tenue">Sitio de demostración. No se procesan pagos reales.</p>
      </aside>
    </form>
  );
}
