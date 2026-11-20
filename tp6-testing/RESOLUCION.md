# Resolución — Laboratorio de pruebas automatizadas (Unidad 4)

Consigna: [aalesann/tlp4-u4-intro-calidad-y-pruebas-de-software](https://github.com/aalesann/tlp4-u4-intro-calidad-y-pruebas-de-software)

## Qué se hizo

1. Se ejecutó `npm test` sin tocar nada: **4 pruebas pasan y 1 falla** (`rechaza descuentos superiores al 100 %`).
2. Se corrigió `src/services/precios.ts` agregando validaciones con `RangeError`:
   - precio finito y `>= 0`;
   - descuento finito entre `0` y `100` inclusive.
3. Se agregaron pruebas unitarias en `tests/precios.test.ts`: descuento 100 % → `0`, precio negativo,
   descuento negativo y el desafío de `NaN` como precio.
4. Se agregó la prueba de integración HTTP 400 en `tests/api.test.ts`.
5. Se verificó `npm run typecheck`.
6. CI: el workflow está en la raíz del repositorio (`.github/workflows/tp6-pruebas.yml`), porque GitHub Actions
   solo lee workflows desde la raíz. Corre dentro de esta carpeta con `npm ci`, ya que `package-lock.json` está versionado.

## Registro de resultados

| Comprobación | Resultado | Observación |
| --- | --- | --- |
| Respuesta de `GET /salud` | `{"estado":"ok"}` | La API responde (en el código la ruta es `/salud`, no `/healthy`) |
| Primera ejecución de `npm test` | 4 pasan / 1 falla | Falla el caso de descuento 150 % |
| Corrección del servicio | 5 / 5 pasan | Se agregan validaciones con `RangeError` |
| Nuevas pruebas unitarias | 7 unitarias pasan | Incluye 100 %, precio negativo, descuento negativo y `NaN` |
| Prueba de integración HTTP 400 | Pasa | Total: **10 pruebas, 10 pasan** |
| Verificación `npm run typecheck` | Sin errores | `tsc --noEmit` |

## Respuestas

### Sección 2 — Conocer la aplicación
- **¿Qué archivo contiene la regla de cálculo?** `src/services/precios.ts`.
- **¿Qué archivo define la ruta HTTP?** `src/app.ts`.
- **¿En qué se diferencian?** El servicio contiene solo la lógica de negocio (no sabe nada de HTTP); `app.ts` recibe
  la request, llama al servicio y traduce el resultado o el error a una respuesta HTTP (200, 400 o 500).

### Sección 4 — Interpretar la falla
1. Con 150 % sobre $1.000 devolvía **-500**.
2. Un precio final negativo no tiene sentido: un descuento no puede superar el 100 %.
3. La prueba exige que se **lance** un `RangeError`. La función terminó normalmente y devolvió un número,
   así que la expectativa `toThrow(RangeError)` no se cumplió.

### Sección 6 — Desafío `NaN`
Sí, la validación lo rechaza: `Number.isFinite(NaN)` es `false`, por lo que se lanza `RangeError`.

### Sección 7 — ¿Por qué es de integración?
Porque no llama a la función directamente: envía una request HTTP real a la app de Express (con Supertest) y
verifica que la ruta, el parseo del JSON, el servicio y el manejo de errores colaboren para devolver un `400`.

### Sección 8 — `typecheck` vs `npm test`
`npm test` comprueba **comportamientos** ejecutando el código; `typecheck` analiza los **tipos** sin ejecutar nada.
Node ejecuta `.ts` borrando los tipos, así que un error de tipos no se detecta al correr. Cada uno encuentra
problemas que el otro no ve.

### Preguntas de cierre
1. **Manual vs automatizada:** la manual depende de una persona y es difícil de repetir igual; la automatizada
   está escrita en código, se repite siempre igual, en segundos y también en CI.
2. **Causa de la primera falla:** `calcularPrecioFinal` no validaba la entrada y aceptaba un descuento de 150 %.
3. **Por qué incluir casos inválidos:** porque los errores aparecen en los bordes y en las entradas inesperadas;
   los casos habituales no muestran si el sistema rechaza datos que rompen las reglas de negocio.
4. **Qué comprueba cada archivo:** `precios.test.ts` prueba la función de cálculo aislada (unitaria);
   `api.test.ts` prueba las rutas de Express junto con el servicio y el manejo de errores (integración).
5. **Ventajas de ejecutar después de cada cambio:** detectan regresiones enseguida, cuando es fácil saber qué
   cambio las causó, y dan confianza para refactorizar.

### Preguntas de repaso (material teórico)
1. **¿Por qué un 200 puede tener errores de negocio?** El 200 solo indica que la petición se procesó;
   antes de la corrección, un descuento de 150 % devolvía 200 con un total de -500.
2. **Unitaria vs integración:** la unitaria prueba una pieza aislada; la de integración, la colaboración entre varias.
3. **¿Por qué `toThrow` recibe una función?** Para que Vitest la ejecute dentro de un `try/catch` y capture el error;
   si se pasa el resultado, el error se lanza antes de llegar a `expect` y rompe la prueba.
4. **`npm test` vs `npm run typecheck`:** ver sección 8.
5. **GitHub Actions:** ejecuta automáticamente el typecheck y las pruebas en cada push o pull request, así nadie
   integra cambios que rompen algo sin enterarse.
