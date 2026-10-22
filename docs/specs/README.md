# Specs de Farmacia Pulso

Cada cambio se describe aquí **antes** de escribir código. Flujo:

1. Claude redacta la spec en `docs/specs/NNN-nombre.md` con estado `propuesta`.
2. Tú la revisas: apruebas o pides cambios (la spec se edita, no se reemplaza).
3. Aprobada pasa a `aprobada`; solo entonces se implementa.
4. Al terminar y verificar, pasa a `hecha` y se mueve a `docs/specs/done/`.

Estados: `propuesta` · `aprobada` · `hecha` · `descartada`.

## Plantilla

```markdown
# NNN · Título
Estado: propuesta · Fase del PLAN: N · Fecha: AAAA-MM-DD

## Objetivo
Una o dos frases: qué cambia y por qué.

## Alcance
Qué entra / qué NO entra.

## Diseño
Archivos, componentes y comportamiento. Lo justo para implementar sin adivinar.

## Criterios de aceptación
- [ ] Verificables (comando, test o prueba concreta en el navegador).

## Preguntas abiertas
Lo que necesita tu decisión.
```

## Índice

| # | Spec | Estado |
|---|---|---|
| 001 | [MVP de tienda con carro](done/001-mvp-tienda-carro.md) | hecha |
| 002 | [Modo oscuro y responsividad](done/002-modo-oscuro-responsividad.md) | hecha |
| 003 | [Tests automatizados](003-tests-automatizados.md) | aprobada |
