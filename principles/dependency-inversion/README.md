---
title: Dependency Inversion Principle
parent: SOLID Principles
nav_order: 2
---

# Dependency Inversion Principle (DIP)

**Bağımlılık Tersine Çevirme Prensibi**: Üst seviye modüller alt seviye modüllere bağımlı olmamalıdır. Her ikisi de soyutlamalara bağımlı olmalıdır.

## Temel Kavramlar

### Tanım

Robert C. Martin tarafından tanımlanan bu prensip, yüksek seviyeli modüllerin düşük seviyeli modüllere doğrudan bağımlı olmaması gerektiğini belirtir. Bunun yerine, her ikisi de soyutlamalara (abstractions) bağımlı olmalıdır.

### Ana Kurallar

1. **Soyutlamalara Bağımlılık**: Yüksek seviyeli modüller soyutlamalara bağımlı olmalı
2. **Somutluktan Uzaklaşma**: Düşük seviyeli modüller soyutlamalara bağımlı olmalı
3. **Bağımlılık Enjeksiyonu**: Bağımlılıklar dışarıdan enjekte edilmeli
4. **Tersine Kontrol**: Kontrol akışı soyutlamalardan somutluklara doğru olmalı

## Yaygın İhlaller

### 1. Doğrudan Somutluk Bağımlılığı

```typescript
// ❌ Yanlış - DIP ihlali
class EmailService {
  sendEmail(to: string, subject: string, body: string): void {
    console.log(`Sending email to ${to}: ${subject}`);
  }
}

class UserService {
  private emailService: EmailService; // DIP ihlali!

  constructor() {
    this.emailService = new EmailService(); // DIP ihlali!
  }

  createUser(userData: any): void {
    // User creation logic
    this.emailService.sendEmail(userData.email, 'Welcome', 'Welcome to our platform');
  }
}
```

### 2. Katı Bağımlılık Zinciri

```typescript
// ❌ Yanlış - DIP ihlali
class DatabaseConnection {
  connect(): void {
    console.log('Connecting to database...');
  }
}

class UserRepository {
  private db: DatabaseConnection; // DIP ihlali!

  constructor() {
    this.db = new DatabaseConnection(); // DIP ihlali!
  }

  saveUser(user: User): void {
    this.db.connect();
    // Save user logic
  }
}

class UserService {
  private userRepo: UserRepository; // DIP ihlali!

  constructor() {
    this.userRepo = new UserRepository(); // DIP ihlali!
  }

  createUser(userData: any): void {
    this.userRepo.saveUser(userData);
  }
}
```

### 3. Sıkı Bağlı Modüller

```typescript
// ❌ Yanlış - DIP ihlali
class PaymentProcessor {
  processPayment(amount: number): void {
    // Payment processing logic
    console.log(`Processing payment of ${amount}`);
  }
}

class OrderService {
  private paymentProcessor: PaymentProcessor; // DIP ihlali!

  constructor() {
    this.paymentProcessor = new PaymentProcessor(); // DIP ihlali!
  }

  processOrder(order: Order): void {
    this.paymentProcessor.processPayment(order.total);
  }
}
```

## Doğru Uygulama Örnekleri

### 1. Soyutlama ile Çözüm

```typescript
// ✅ Doğru - DIP uyumlu
interface EmailService {
  sendEmail(to: string, subject: string, body: string): void;
}

class SmtpEmailService implements EmailService {
  sendEmail(to: string, subject: string, body: string): void {
    console.log(`Sending email via SMTP to ${to}: ${subject}`);
  }
}

class SendGridEmailService implements EmailService {
  sendEmail(to: string, subject: string, body: string): void {
    console.log(`Sending email via SendGrid to ${to}: ${subject}`);
  }
}

class UserService {
  private emailService: EmailService; // Soyutlama bağımlılığı

  constructor(emailService: EmailService) {
    // Bağımlılık enjeksiyonu
    this.emailService = emailService;
  }

  createUser(userData: any): void {
    // User creation logic
    this.emailService.sendEmail(userData.email, 'Welcome', 'Welcome to our platform');
  }
}
```

### 2. Repository Pattern ile Çözüm

```typescript
// ✅ Doğru - DIP uyumlu
interface UserRepository {
  saveUser(user: User): Promise<void>;
  findUser(id: string): Promise<User | null>;
}

class DatabaseUserRepository implements UserRepository {
  async saveUser(user: User): Promise<void> {
    console.log('Saving user to database...');
  }

  async findUser(id: string): Promise<User | null> {
    console.log('Finding user in database...');
    return null;
  }
}

class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async saveUser(user: User): Promise<void> {
    this.users.push(user);
    console.log('Saving user to memory...');
  }

  async findUser(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null;
  }
}

class UserService {
  private userRepository: UserRepository; // Soyutlama bağımlılığı

  constructor(userRepository: UserRepository) {
    // Bağımlılık enjeksiyonu
    this.userRepository = userRepository;
  }

  async createUser(userData: any): Promise<void> {
    const user = new User(userData);
    await this.userRepository.saveUser(user);
  }
}
```

### 3. Strategy Pattern ile Çözüm

```typescript
// ✅ Doğru - DIP uyumlu
interface PaymentStrategy {
  processPayment(amount: number): Promise<PaymentResult>;
}

class CreditCardPayment implements PaymentStrategy {
  async processPayment(amount: number): Promise<PaymentResult> {
    console.log(`Processing credit card payment of ${amount}`);
    return { success: true, transactionId: 'cc_123' };
  }
}

class PayPalPayment implements PaymentStrategy {
  async processPayment(amount: number): Promise<PaymentResult> {
    console.log(`Processing PayPal payment of ${amount}`);
    return { success: true, transactionId: 'pp_456' };
  }
}

class OrderService {
  private paymentStrategy: PaymentStrategy; // Soyutlama bağımlılığı

  constructor(paymentStrategy: PaymentStrategy) {
    // Bağımlılık enjeksiyonu
    this.paymentStrategy = paymentStrategy;
  }

  async processOrder(order: Order): Promise<PaymentResult> {
    return await this.paymentStrategy.processPayment(order.total);
  }
}
```

## Faydaları

### 1. Esneklik ve Genişletilebilirlik

- Farklı implementasyonlar kolayca değiştirilebilir
- Yeni özellikler mevcut kodu bozmadan eklenebilir
- Sistem daha modüler hale gelir

### 2. Test Edilebilirlik

- Mock objeler kolayca oluşturulabilir
- Unit testler daha bağımsız hale gelir
- Test coverage daha kolay sağlanır

### 3. Bakım Kolaylığı

- Değişiklikler daha lokalize olur
- Kod daha sürdürülebilir hale gelir
- Hata ayıklama daha kolay olur

### 4. Loose Coupling

- Modüller arası bağımlılık azalır
- Sistem daha esnek hale gelir
- Yeniden kullanılabilirlik artar

## Pratik İpuçları

### 1. Dependency Injection Container Kullanın

```typescript
class DIContainer {
  private services = new Map<string, any>();

  register<T>(name: string, factory: () => T): void {
    this.services.set(name, factory);
  }

  resolve<T>(name: string): T {
    const factory = this.services.get(name);
    if (!factory) {
      throw new Error(`Service ${name} not found`);
    }
    return factory();
  }
}

// Kullanım
const container = new DIContainer();
container.register('emailService', () => new SmtpEmailService());
container.register('userRepository', () => new DatabaseUserRepository());
container.register('userService', () => new UserService(container.resolve('emailService'), container.resolve('userRepository')));
```

### 2. Interface Segregation ile Birlikte Kullanın

```typescript
// Küçük, odaklanmış arayüzler
interface UserReader {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}

interface UserWriter {
  saveUser(user: User): Promise<void>;
  updateUser(user: User): Promise<void>;
  deleteUser(id: string): Promise<void>;
}

// Kombine arayüz
interface UserRepository extends UserReader, UserWriter {}

// Farklı implementasyonlar
class DatabaseUserRepository implements UserRepository {
  // Implementation
}

class CacheUserRepository implements UserReader {
  // Sadece okuma işlemleri
}
```

### 3. Factory Pattern ile Obje Oluşturma

```typescript
interface ServiceFactory {
  createEmailService(): EmailService;
  createUserRepository(): UserRepository;
  createPaymentService(): PaymentService;
}

class ProductionServiceFactory implements ServiceFactory {
  createEmailService(): EmailService {
    return new SmtpEmailService();
  }

  createUserRepository(): UserRepository {
    return new DatabaseUserRepository();
  }

  createPaymentService(): PaymentService {
    return new CreditCardPayment();
  }
}

class TestServiceFactory implements ServiceFactory {
  createEmailService(): EmailService {
    return new MockEmailService();
  }

  createUserRepository(): UserRepository {
    return new InMemoryUserRepository();
  }

  createPaymentService(): PaymentService {
    return new MockPaymentService();
  }
}
```

## Test Stratejileri

### 1. Mock Objeler ile Test

```typescript
class MockEmailService implements EmailService {
  private sentEmails: Array<{ to: string; subject: string; body: string }> = [];

  sendEmail(to: string, subject: string, body: string): void {
    this.sentEmails.push({ to, subject, body });
  }

  getSentEmails(): Array<{ to: string; subject: string; body: string }> {
    return this.sentEmails;
  }
}

// Test
describe('UserService', () => {
  it('should send welcome email when creating user', async () => {
    const mockEmailService = new MockEmailService();
    const userService = new UserService(mockEmailService);

    await userService.createUser({ email: 'test@example.com' });

    const sentEmails = mockEmailService.getSentEmails();
    expect(sentEmails).toHaveLength(1);
    expect(sentEmails[0].to).toBe('test@example.com');
  });
});
```

### 2. Integration Testler

```typescript
describe('UserService Integration', () => {
  it('should work with real database', async () => {
    const realEmailService = new SmtpEmailService();
    const realUserRepository = new DatabaseUserRepository();
    const userService = new UserService(realEmailService, realUserRepository);

    // Gerçek veritabanı ile test
    await userService.createUser({ email: 'test@example.com' });

    const user = await realUserRepository.findByEmail('test@example.com');
    expect(user).toBeDefined();
  });
});
```

## İlişkili Prensipler

- **Single Responsibility**: Her modül tek bir sorumluluğa odaklanmalı
- **Open/Closed**: Modüller genişletmeye açık, değişikliğe kapalı olmalı
- **Liskov Substitution**: Alt sınıflar üst sınıfların yerine kullanılabilmeli
- **Interface Segregation**: Küçük, odaklanmış arayüzler kullanılmalı

## Yaygın Desenler

### 1. Dependency Injection

```typescript
class UserController {
  constructor(private userService: UserService, private emailService: EmailService, private logger: Logger) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.createUser(req.body);
      res.json(user);
    } catch (error) {
      this.logger.error('Error creating user', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
```

### 2. Observer Pattern

```typescript
interface EventPublisher {
  publish(event: DomainEvent): void;
}

interface EventSubscriber {
  handle(event: DomainEvent): void;
}

class UserService {
  constructor(private eventPublisher: EventPublisher) {}

  async createUser(userData: any): Promise<void> {
    const user = new User(userData);
    // User creation logic
    this.eventPublisher.publish(new UserCreatedEvent(user));
  }
}
```

### 3. Command Pattern

```typescript
interface Command {
  execute(): Promise<void>;
}

interface CommandHandler<T extends Command> {
  handle(command: T): Promise<void>;
}

class CreateUserCommand implements Command {
  constructor(public userData: any) {}
}

class CreateUserCommandHandler implements CommandHandler<CreateUserCommand> {
  constructor(private userService: UserService) {}

  async handle(command: CreateUserCommand): Promise<void> {
    await this.userService.createUser(command.userData);
  }
}
```

## Özet

Dependency Inversion Principle, yüksek seviyeli modüllerin düşük seviyeli modüllere doğrudan bağımlı olmaması gerektiğini belirtir. Bu prensibi uygulayarak:

- Daha esnek ve genişletilebilir sistemler oluşturabilirsiniz
- Test edilebilirliği artırabilirsiniz
- Modüller arası bağımlılığı azaltabilirsiniz
- Kod sürdürülebilirliğini artırabilirsiniz

**Hatırlayın**: Soyutlamalara bağımlı olun, somutluklara değil. Bağımlılıkları dışarıdan enjekte edin, içeride oluşturmayın.
