# TP3 — Patrones de diseño: Sistema de Inventario de Equipos Informáticos

Consigna: [gist de la cátedra](https://gist.github.com/aguscenturion/4642c842b575276726bb1749b9a43533)

## Cómo ejecutar

Requiere Node.js 22.18+ (ejecuta TypeScript de forma nativa).

```bash
npm install
npm run ej1   # Singleton — Inventario
npm run ej2   # Factory Method — EquipoFactory
npm run ej3   # Observer — Equipo / Soporte
npm run ej4   # Adapter — AdaptadorInventario / InventarioViejo
npm run typecheck
```

## Resumen

| Ejercicio | Patrón | Clases principales | Idea |
|---|---|---|---|
| 1 | Singleton | `Inventario`, interfaz `Equipo` | Constructor privado + `obtenerInstancia()` estático: toda la app comparte un único inventario |
| 2 | Factory Method | `EquipoFactory`, `EquipoInformatico` (abstracta), `Notebook`, `Desktop`, `Servidor` | `crearEquipo()` decide qué clase concreta instanciar y siempre devuelve el tipo abstracto común |
| 3 | Observer | interfaz `Observador`, `Equipo` (sujeto), `Soporte`, `RegistroLog` | `Equipo` notifica a sus observadores al cambiar de estado; depende de la interfaz, no de `Soporte` |
| 4 | Adapter | interfaz `Inventario`, `InventarioViejo`, `AdaptadorInventario` | El adaptador implementa la interfaz nueva y traduce `agregarEquipo` → `agregarItem` |
