import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIA_IDS } from './lib/categorias';
import { UNIDADES } from './lib/precios';

const productos = defineCollection({
  loader: file('src/data/productos.json'),
  schema: z.object({
    nombre: z.string(),
    laboratorio: z.string(),
    categoria: z.enum(CATEGORIA_IDS),
    subcategoria: z.string(),
    presentacion: z.string(),
    /** Cantidad y unidad del envase, para el precio por unidad de medida. */
    contenido: z.number().positive(),
    unidad: z.enum(UNIDADES),
    principioActivo: z.string().optional(),
    descripcion: z.string(),
    precio: z.number().int().positive(),
    precioAnterior: z.number().int().positive().optional(),
    /** Fecha (AAAA-MM-DD) hasta la que vale el precio de oferta. */
    ofertaHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    stock: z.number().int().nonnegative(),
    requiereReceta: z.boolean().default(false),
    bioequivalente: z.boolean().default(false),
    destacado: z.boolean().default(false),
    masVendido: z.boolean().default(false),
  }),
});

export const collections = { productos };
