// LSP — Liskov Substitution Principle
// Antes: Square heredaba de Rectangle pero cambiaba el comportamiento de
// setWidth/setHeight, rompiendo lo que espera quien usa un Rectangle.
// Ahora: no hay herencia entre ellas. Ambas cumplen el contrato Shape (area()),
// que cualquier figura puede respetar sin sorpresas.

interface Shape {
  area(): number;
}

class Rectangle implements Shape {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  area(): number {
    return this.width * this.height;
  }
}

class Square implements Shape {
  private side: number;

  constructor(side: number) {
    this.side = side;
  }

  setSide(side: number): void {
    this.side = side;
  }

  area(): number {
    return this.side * this.side;
  }
}

// Solo acepta Rectangle real: ya no se le puede pasar un Square que rompa la regla.
function resizeRectangle(rectangle: Rectangle): void {
  rectangle.setWidth(5);
  rectangle.setHeight(10);
  console.log(`Area esperada: 50. Area obtenida: ${rectangle.area()}`);
}

// Cualquier Shape es sustituible aquí: solo usamos lo que todas cumplen.
function printArea(shape: Shape): void {
  console.log(`Area: ${shape.area()}`);
}

// ---------------- Prueba ----------------
resizeRectangle(new Rectangle(1, 1));

const square = new Square(1);
square.setSide(7);

const shapes: Shape[] = [new Rectangle(2, 3), square];
shapes.forEach(printArea);

// resizeRectangle(new Square(1)); // ❌ Error de compilación: Square no es un Rectangle

/*
Respuestas:
- ¿Por qué el área no coincide? Porque Square, al hacer setHeight(10), también
  cambia el ancho a 10: el área da 100 en lugar de 50. Rompe la expectativa del cliente.
- ¿Es siempre correcto modelar un cuadrado como rectángulo por herencia? No. En
  matemática lo es, pero en software importa el comportamiento: un cuadrado no
  puede cambiar ancho y alto por separado, así que no es sustituible.
- ¿Qué abstracción común usar? Shape, con el método area().
*/
