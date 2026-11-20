// Ejercicio 5 — Getters y setters

class Persona {
  private readonly dni: string;
  nombre: string;
  private _edad: number = 0;
  private _email: string = "";

  constructor(dni: string, nombre: string, edad: number, email: string) {
    this.dni = dni;
    this.nombre = nombre;
    // Usamos los setters para que las validaciones también apliquen al crear la persona.
    this.edad = edad;
    this.email = email;
  }

  get edad(): number {
    return this._edad;
  }

  set edad(valor: number) {
    if (valor < 0) {
      throw new Error("La edad no puede ser negativa");
    }
    if (valor > 120) {
      throw new Error("La edad no puede ser mayor a 120");
    }
    this._edad = valor;
  }

  get email(): string {
    return this._email;
  }

  set email(valor: string) {
    if (!valor.includes("@")) {
      throw new Error(`Email inválido: "${valor}" no contiene "@"`);
    }
    this._email = valor;
  }

  // Calculado al leerlo, no se guarda.
  get esMayorDeEdad(): boolean {
    return this._edad >= 18;
  }

  // Solo datos no sensibles: sin dni ni email.
  get datosPublicos(): string {
    return `Nombre: ${this.nombre} — Mayor de edad: ${this.esMayorDeEdad ? "sí" : "no"}`;
  }
}

// ---------------- Bloque de prueba ----------------
const persona = new Persona("40123456", "Carla", 17, "carla@mail.com");
console.log(persona.datosPublicos);

persona.edad = 18;
console.log("Edad actualizada:", persona.edad, "— ¿mayor de edad?", persona.esMayorDeEdad);

persona.email = "carla.nueva@mail.com";
console.log("Email:", persona.email);

try {
  persona.edad = -5;
} catch (error) {
  console.log("Error esperado:", (error as Error).message);
}

try {
  persona.edad = 150;
} catch (error) {
  console.log("Error esperado:", (error as Error).message);
}

try {
  persona.email = "sin-arroba.com";
} catch (error) {
  console.log("Error esperado:", (error as Error).message);
}

// persona.esMayorDeEdad = false; // ❌ Error: es un getter de solo lectura
// persona.dni;                    // ❌ Error: 'dni' es private
console.log(persona.datosPublicos);
