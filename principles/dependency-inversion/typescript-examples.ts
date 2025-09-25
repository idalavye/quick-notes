/**
 * Dependency Inversion Principle (DIP) - TypeScript Examples
 *
 * Bu dosya, DIP'nin temel kavramlarını ve doğru uygulamalarını gösterir.
 * Yüksek seviyeli modüller düşük seviyeli modüllere bağımlı olmamalıdır.
 * Her ikisi de soyutlamalara bağımlı olmalıdır.
 */

// ============================================================================
// 1. TEMEL KAVRAMLAR VE YANLIŞ UYGULAMALAR
// ============================================================================

// ❌ YANLIŞ: DIP ihlali - Doğrudan somutluk bağımlılığı
class BadEmailService {
  sendEmail(to: string, subject: string, body: string): void {
    console.log(`Sending email to ${to}: ${subject}`);
  }
}

class BadUserService1 {
  private emailService: BadEmailService; // DIP ihlali!

  constructor() {
    this.emailService = new BadEmailService(); // DIP ihlali!
  }

  createUser(userData: any): void {
    console.log('Creating user...');
    this.emailService.sendEmail(userData.email, 'Welcome', 'Welcome to our platform');
  }
}

// ❌ YANLIŞ: DIP ihlali - Katı bağımlılık zinciri
class BadDatabaseConnection {
  connect(): void {
    console.log('Connecting to database...');
  }

  query(sql: string): any[] {
    console.log(`Executing query: ${sql}`);
    return [];
  }
}

class BadUserRepository {
  private db: BadDatabaseConnection; // DIP ihlali!

  constructor() {
    this.db = new BadDatabaseConnection(); // DIP ihlali!
  }

  saveUser(user: any): void {
    this.db.connect();
    this.db.query(`INSERT INTO users (name, email) VALUES ('${user.name}', '${user.email}')`);
  }
}

class BadUserService2 {
  private userRepo: BadUserRepository; // DIP ihlali!

  constructor() {
    this.userRepo = new BadUserRepository(); // DIP ihlali!
  }

  createUser(userData: any): void {
    this.userRepo.saveUser(userData);
  }
}

// ❌ YANLIŞ: DIP ihlali - Sıkı bağlı modüller
class BadPaymentProcessor {
  processPayment(amount: number): void {
    console.log(`Processing payment of ${amount}`);
  }
}

class BadOrderService {
  private paymentProcessor: BadPaymentProcessor; // DIP ihlali!

  constructor() {
    this.paymentProcessor = new BadPaymentProcessor(); // DIP ihlali!
  }

  processOrder(order: any): void {
    console.log('Processing order...');
    this.paymentProcessor.processPayment(order.total);
  }
}

// ============================================================================
// 2. DOĞRU UYGULAMA ÖRNEKLERİ
// ============================================================================

// ✅ DOĞRU: DIP uyumlu - Soyutlama ile çözüm
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

class UserService1 {
  private emailService: EmailService; // Soyutlama bağımlılığı

  constructor(emailService: EmailService) {
    // Bağımlılık enjeksiyonu
    this.emailService = emailService;
  }

  createUser(userData: any): void {
    console.log('Creating user...');
    this.emailService.sendEmail(userData.email, 'Welcome', 'Welcome to our platform');
  }
}

// ✅ DOĞRU: Repository Pattern ile çözüm
interface UserRepository {
  saveUser(user: User): Promise<void>;
  findUser(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}

class DatabaseUserRepository implements UserRepository {
  async saveUser(user: User): Promise<void> {
    console.log('Saving user to database...');
  }

  async findUser(id: string): Promise<User | null> {
    console.log(`Finding user by ID: ${id}`);
    return null;
  }

  async findByEmail(email: string): Promise<User | null> {
    console.log(`Finding user by email: ${email}`);
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

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) || null;
  }
}

class UserService2 {
  private userRepository: UserRepository; // Soyutlama bağımlılığı

  constructor(userRepository: UserRepository) {
    // Bağımlılık enjeksiyonu
    this.userRepository = userRepository;
  }

  async createUser(userData: any): Promise<void> {
    const user = new User(undefined, userData.name, userData.email);
    await this.userRepository.saveUser(user);
  }

  async getUser(id: string): Promise<User | null> {
    return await this.userRepository.findUser(id);
  }
}

// ✅ DOĞRU: Strategy Pattern ile çözüm
interface PaymentStrategy {
  processPayment(amount: number): Promise<PaymentResult>;
}

class CreditCardPayment implements PaymentStrategy {
  async processPayment(amount: number): Promise<PaymentResult> {
    console.log(`Processing credit card payment of ${amount}`);
    return { success: true, transactionId: 'cc_123', amount };
  }
}

class PayPalPayment implements PaymentStrategy {
  async processPayment(amount: number): Promise<PaymentResult> {
    console.log(`Processing PayPal payment of ${amount}`);
    return { success: true, transactionId: 'pp_456', amount };
  }
}

class BankTransferPayment implements PaymentStrategy {
  async processPayment(amount: number): Promise<PaymentResult> {
    console.log(`Processing bank transfer payment of ${amount}`);
    return { success: true, transactionId: 'bt_789', amount };
  }
}

class OrderService {
  private paymentStrategy: PaymentStrategy; // Soyutlama bağımlılığı

  constructor(paymentStrategy: PaymentStrategy) {
    // Bağımlılık enjeksiyonu
    this.paymentStrategy = paymentStrategy;
  }

  async processOrder(order: Order): Promise<PaymentResult> {
    console.log('Processing order...');
    return await this.paymentStrategy.processPayment(order.total);
  }
}

// ============================================================================
// 3. DEPENDENCY INJECTION CONTAINER
// ============================================================================

class DIContainer {
  private services = new Map<string, any>();
  private singletons = new Map<string, any>();

  register<T>(name: string, factory: () => T, singleton: boolean = false): void {
    this.services.set(name, { factory, singleton });
  }

  resolve<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }

    if (service.singleton) {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, service.factory());
      }
      return this.singletons.get(name);
    }

    return service.factory();
  }
}

// Kullanım örneği
const container = new DIContainer();

// Servisleri kaydet
container.register('emailService', () => new SmtpEmailService(), true);
container.register('userRepository', () => new DatabaseUserRepository(), true);
container.register('userService', () => new UserService1(container.resolve('emailService')));

// Servisleri kullan
const userService = container.resolve<UserService1>('userService');

// ============================================================================
// 4. FACTORY PATTERN İLE OBJE OLUŞTURMA
// ============================================================================

interface ServiceFactory {
  createEmailService(): EmailService;
  createUserRepository(): UserRepository;
  createPaymentService(): PaymentStrategy;
}

class ProductionServiceFactory implements ServiceFactory {
  createEmailService(): EmailService {
    return new SmtpEmailService();
  }

  createUserRepository(): UserRepository {
    return new DatabaseUserRepository();
  }

  createPaymentService(): PaymentStrategy {
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

  createPaymentService(): PaymentStrategy {
    return new MockPaymentService();
  }
}

class MockEmailService implements EmailService {
  private sentEmails: Array<{ to: string; subject: string; body: string }> = [];

  sendEmail(to: string, subject: string, body: string): void {
    this.sentEmails.push({ to, subject, body });
    console.log(`Mock: Sending email to ${to}: ${subject}`);
  }

  getSentEmails(): Array<{ to: string; subject: string; body: string }> {
    return this.sentEmails;
  }
}

class MockPaymentService implements PaymentStrategy {
  async processPayment(amount: number): Promise<PaymentResult> {
    console.log(`Mock: Processing payment of ${amount}`);
    return { success: true, transactionId: 'mock_123', amount };
  }
}

// ============================================================================
// 5. OBSERVER PATTERN İLE EVENT HANDLING
// ============================================================================

interface EventPublisher {
  publish(event: DomainEvent): void;
  subscribe(eventType: string, handler: EventHandler): void;
}

interface EventHandler {
  handle(event: DomainEvent): Promise<void>;
}

interface DomainEvent {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  aggregateId: string;
  version: number;
}

class UserCreatedEvent implements DomainEvent {
  id = Math.random().toString(36).substr(2, 9);
  type = 'UserCreated';
  timestamp = new Date();
  aggregateId = '';
  version = 1;

  constructor(public data: User) {
    this.aggregateId = data.id;
  }
}

class OrderCreatedEvent implements DomainEvent {
  id = Math.random().toString(36).substr(2, 9);
  type = 'OrderCreated';
  timestamp = new Date();
  aggregateId = '';
  version = 1;

  constructor(public data: Order) {
    this.aggregateId = data.id;
  }
}

class EventBus implements EventPublisher {
  private handlers = new Map<string, EventHandler[]>();

  async publish(event: DomainEvent): Promise<void> {
    const eventHandlers = this.handlers.get(event.type) || [];
    await Promise.all(eventHandlers.map((handler) => handler.handle(event)));
  }

  subscribe(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }
}

class EmailNotificationHandler implements EventHandler {
  constructor(private emailService: EmailService) {}

  async handle(event: DomainEvent): Promise<void> {
    if (event.type === 'UserCreated') {
      const user = event.data as User;
      this.emailService.sendEmail(user.email, 'Welcome', 'Welcome to our platform!');
    }
  }
}

class OrderNotificationHandler implements EventHandler {
  constructor(private emailService: EmailService) {}

  async handle(event: DomainEvent): Promise<void> {
    if (event.type === 'OrderCreated') {
      const order = event.data as Order;
      this.emailService.sendEmail(order.customerEmail, 'Order Confirmation', `Your order #${order.id} has been created.`);
    }
  }
}

// ============================================================================
// 6. COMMAND PATTERN İLE İŞLEM YÖNETİMİ
// ============================================================================

interface Command {
  id: string;
  type: string;
  data: any;
  execute(): Promise<void>;
}

interface CommandHandler<T extends Command> {
  handle(command: T): Promise<void>;
}

class CreateUserCommand implements Command {
  id = Math.random().toString(36).substr(2, 9);
  type = 'CreateUser';

  constructor(public userData: any, public data: any = userData) {}

  async execute(): Promise<void> {
    // Command execution logic can be added here
  }
}

class CreateOrderCommand implements Command {
  id = Math.random().toString(36).substr(2, 9);
  type = 'CreateOrder';

  constructor(public orderData: any, public data: any = orderData) {}

  async execute(): Promise<void> {
    // Command execution logic can be added here
  }
}

class CreateUserCommandHandler implements CommandHandler<CreateUserCommand> {
  constructor(private userService: UserService2) {}

  async handle(command: CreateUserCommand): Promise<void> {
    await this.userService.createUser(command.userData);
  }
}

class CreateOrderCommandHandler implements CommandHandler<CreateOrderCommand> {
  constructor(private orderService: OrderService) {}

  async handle(command: CreateOrderCommand): Promise<void> {
    await this.orderService.processOrder(command.orderData);
  }
}

class CommandBus {
  private handlers = new Map<string, CommandHandler<any>>();

  register<T extends Command>(commandType: string, handler: CommandHandler<T>): void {
    this.handlers.set(commandType, handler);
  }

  async execute<T extends Command>(command: T): Promise<void> {
    const commandType = command.constructor.name;
    const handler = this.handlers.get(commandType);

    if (!handler) {
      throw new Error(`No handler found for command: ${commandType}`);
    }

    await handler.handle(command);
  }
}

// ============================================================================
// 7. TEST ÖRNEKLERİ
// ============================================================================

// Mock objeler ile test
class TestUserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(userData: any): Promise<void> {
    const user = new User(undefined, userData.name, userData.email);
    await this.userRepository.saveUser(user);
  }
}

// Test kullanımı
async function testUserService(): Promise<void> {
  const mockRepository = new InMemoryUserRepository();
  const userService = new TestUserService(mockRepository);

  await userService.createUser({ name: 'John Doe', email: 'john@example.com' });

  const user = await mockRepository.findByEmail('john@example.com');
  console.log('User found:', user);
}

// ============================================================================
// 8. KULLANIM ÖRNEKLERİ
// ============================================================================

// Production ortamında kullanım
function setupProductionServices(): { userService: UserService1; orderService: OrderService } {
  const emailService = new SmtpEmailService();
  const userRepository = new DatabaseUserRepository();
  const paymentStrategy = new CreditCardPayment();

  const userService = new UserService1(emailService);
  const orderService = new OrderService(paymentStrategy);

  return { userService, orderService };
}

// Test ortamında kullanım
function setupTestServices(): { userService: UserService1; orderService: OrderService } {
  const emailService = new MockEmailService();
  const userRepository = new InMemoryUserRepository();
  const paymentStrategy = new MockPaymentService();

  const userService = new UserService1(emailService);
  const orderService = new OrderService(paymentStrategy);

  return { userService, orderService };
}

// Event-driven kullanım
function setupEventDrivenServices(): { userService: UserService1; eventBus: EventBus } {
  const emailService = new SmtpEmailService();
  const eventBus = new EventBus();

  // Event handler'ları kaydet
  eventBus.subscribe('UserCreated', new EmailNotificationHandler(emailService));
  eventBus.subscribe('OrderCreated', new OrderNotificationHandler(emailService));

  const userService = new UserService1(emailService);

  return { userService, eventBus };
}

// ============================================================================
// 9. YARDIMCI TİPLER VE ARAYÜZLER
// ============================================================================

class User {
  constructor(public id: string = Math.random().toString(36).substr(2, 9), public name: string, public email: string) {}
}

class Order {
  constructor(public id: string = Math.random().toString(36).substr(2, 9), public total: number, public customerEmail: string) {}
}

interface PaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
}

// ============================================================================
// 10. ÖZET VE SONUÇ
// ============================================================================

/*
Dependency Inversion Principle (DIP) özeti:

1. Yüksek seviyeli modüller düşük seviyeli modüllere bağımlı olmamalıdır
2. Her ikisi de soyutlamalara bağımlı olmalıdır
3. Soyutlamalar somutluklara bağımlı olmamalıdır
4. Somutluklar soyutlamalara bağımlı olmalıdır

Faydaları:
- Esneklik ve genişletilebilirlik
- Test edilebilirlik
- Bakım kolaylığı
- Loose coupling

Kullanım alanları:
- Dependency Injection
- Repository Pattern
- Strategy Pattern
- Observer Pattern
- Command Pattern
- Factory Pattern
*/
