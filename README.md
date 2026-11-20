# Trabajos prácticos — Taller de Lenguajes de Programación IV

Todos los trabajos prácticos de la materia, cada uno en su propia carpeta y con su propio README.

| Carpeta | Trabajo | Tema | Cómo correrlo |
|---|---|---|---|
| [`tp1-poo-pilares`](./tp1-poo-pilares) | Los 4 pilares de la POO + getters y setters | Abstracción, encapsulamiento, herencia, polimorfismo | `npm install` y `npm run ej1` … `ej5` |
| [`tp2-solid`](./tp2-solid) | Actividad práctica de SOLID | SRP, OCP, LSP, ISP, DIP (refactor de ejemplos) | `npm install` y `npm run 01-srp` … `05-dip` |
| [`tp3-patrones-diseno`](./tp3-patrones-diseno) | Inventario de equipos informáticos | Singleton, Factory Method, Observer, Adapter | `npm install` y `npm run ej1` … `ej4` |
| [`tp4-empleados-solid`](./tp4-empleados-solid) | Empleados y salarios (refactor) | Arquitectura en capas + SOLID con Express y MongoDB | `docker compose up -d`, `npm install`, `npm run dev` |
| [`tp5-integrador`](./tp5-integrador) | Actividad práctica integradora — Mesa de ayuda | Full stack React + Express + MongoDB, JWT, roles, los 4 patrones, Docker | `cp .env.example .env` y `docker compose up --build` |
| [`tp6-testing`](./tp6-testing) | Laboratorio de pruebas automatizadas | Vitest, Supertest, typecheck y CI | `npm install`, `npm test` |

Requisitos generales: Node.js 22.18 o superior (probado con Node 24) y Docker para los TP 4 y 5.
