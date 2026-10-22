import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIA_IDS } from './lib/categorias';

const productos = defineCollection({
  loader: file('src/data/productos.json'),
  schema: z.object({
    nombre: z.string(),
    laboratorio: z.string(),
    categoria: z.enum(CATEGORIA_IDS),
    presentacion: z.string(),
    principioActivo: z.string().optional(),
    descripcion: z.string(),
    precio: z.number().int().positive(),
    precioAnterior: z.number().int().positive().optional(),
    stock: z.number().int().nonnegative(),
    requiereReceta: z.boolean().default(false),
    destacado: z.boolean().default(false),
  }),
});

export const collections = { productos };
