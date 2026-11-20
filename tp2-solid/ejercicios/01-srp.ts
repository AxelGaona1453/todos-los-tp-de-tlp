// SRP — Single Responsibility Principle
// Antes: UserManager validaba, guardaba y enviaba correos (3 motivos para cambiar).
// Ahora: cada responsabilidad vive en su propia clase y UserRegistrationService
// solo coordina el flujo mediante composición.

interface User {
  username: string;
  email: string;
}

// Responsabilidad: reglas de validación de un usuario.
class UserValidator {
  validate(user: User): void {
    if (!user.email.includes("@")) {
      throw new Error("El correo no es valido");
    }
  }
}

// Responsabilidad: almacenamiento de usuarios.
class UserRepository {
  private users: User[] = [];

  save(user: User): void {
    this.users.push(user);
  }

  findAll(): User[] {
    return [...this.users];
  }
}

// Responsabilidad: envío de correos.
class EmailService {
  sendWelcomeEmail(email: string): string {
    return `Email enviado a ${email}`;
  }
}

// Responsabilidad: coordinar el caso de uso "registrar usuario".
class UserRegistrationService {
  private validator: UserValidator;
  private repository: UserRepository;
  private emailService: EmailService;

  constructor(validator: UserValidator, repository: UserRepository, emailService: EmailService) {
    this.validator = validator;
    this.repository = repository;
    this.emailService = emailService;
  }

  register(username: string, email: string): string {
    const user: User = { username, email };
    this.validator.validate(user);
    this.repository.save(user);
    return this.emailService.sendWelcomeEmail(email);
  }
}

// ---------------- Prueba ----------------
const repository = new UserRepository();
const registration = new UserRegistrationService(
  new UserValidator(),
  repository,
  new EmailService()
);

console.log(registration.register("ana", "ana@example.com"));
console.log(registration.register("juan", "juan@example.com"));

try {
  registration.register("pepe", "correo-invalido");
} catch (error) {
  console.log("Error esperado:", (error as Error).message);
}

console.log("Usuarios guardados:", repository.findAll());

/*
Respuestas:
- ¿Qué responsabilidades tiene UserManager? Validar el correo, almacenar el usuario
  y enviar el correo de bienvenida.
- ¿Qué ocurre si cambia la forma de guardar datos? En el original hay que tocar
  UserManager aunque la validación y el email no cambien. Ahora solo cambia UserRepository.
- ¿Qué clase podría encargarse de enviar correos? EmailService.
*/
