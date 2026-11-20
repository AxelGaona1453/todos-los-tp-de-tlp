// ISP — Interface Segregation Principle
// Antes: SimplePrinter implementaba MultifunctionPrinter y tenía que "implementar"
// scan y fax lanzando errores.
// Ahora: interfaces chicas; cada clase implementa solo las capacidades que tiene.

interface Printer {
  print(document: string): void;
}

interface Scanner {
  scan(document: string): void;
}

interface Fax {
  fax(document: string): void;
}

class SimplePrinter implements Printer {
  print(document: string): void {
    console.log(`Imprimiendo: ${document}`);
  }
}

// Un equipo multifunción combina las interfaces que realmente soporta.
class MultifunctionPrinter implements Printer, Scanner, Fax {
  print(document: string): void {
    console.log(`[Multifunción] Imprimiendo: ${document}`);
  }

  scan(document: string): void {
    console.log(`[Multifunción] Escaneando: ${document}`);
  }

  fax(document: string): void {
    console.log(`[Multifunción] Enviando fax: ${document}`);
  }
}

// Los clientes dependen solo de la capacidad que necesitan.
function printAll(printers: Printer[], document: string): void {
  printers.forEach((printer) => printer.print(document));
}

function scanDocument(scanner: Scanner, document: string): void {
  scanner.scan(document);
}

// ---------------- Prueba ----------------
const simple = new SimplePrinter();
const multi = new MultifunctionPrinter();

printAll([simple, multi], "tarea.txt");
scanDocument(multi, "contrato.pdf");
multi.fax("factura.pdf");
// scanDocument(simple, "x"); // ❌ Error de compilación: SimplePrinter no es un Scanner

/*
Respuestas:
- ¿Qué método no necesita SimplePrinter? scan y fax.
- ¿Qué problema causa implementar métodos que lanzan errores? El tipo "promete"
  algo que no cumple: el error aparece recién en ejecución y quien la usa no
  puede confiar en la interfaz (también viola LSP).
- ¿Cómo separar las capacidades? En interfaces Printer, Scanner y Fax.
*/
