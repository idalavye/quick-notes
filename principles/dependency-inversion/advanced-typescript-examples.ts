/**
 * Dependency Inversion Principle (DIP) - Advanced TypeScript Examples
 *
 * Bu dosya, DIP'nin gelişmiş kullanım senaryolarını ve gerçek dünya
 * uygulamalarını gösterir. Karmaşık sistemlerde bağımlılık tersine çevirmenin
 * nasıl uygulanacağını ve design pattern'ler ile nasıl entegre
 * edileceğini gösterir.
 */

// ============================================================================
// 1. MICROSERVICES MİMARİSİ İLE DIP UYGULAMASI
// ============================================================================

// Domain Events
interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  data: any;
  timestamp: Date;
  version: number;
}

class AdvancedUserCreatedEvent implements DomainEvent {
  id = Math.random().toString(36).substr(2, 9);
  type = 'UserCreated';
  timestamp = new Date();
  version = 1;

  constructor(public aggregateId: string, public data: AdvancedUser) {}
}

class AdvancedOrderCreatedEvent implements DomainEvent {
  id = Math.random().toString(36).substr(2, 9);
  type = 'OrderCreated';
  timestamp = new Date();
  version = 1;

  constructor(public aggregateId: string, public data: AdvancedOrder) {}
}

// Event Store
interface EventStore {
  saveEvents(aggregateId: string, events: DomainEvent[]): Promise<void>;
  getEvents(aggregateId: string): Promise<DomainEvent[]>;
  getAllEvents(): Promise<DomainEvent[]>;
}

class InMemoryEventStore implements EventStore {
  private events: DomainEvent[] = [];

  async saveEvents(aggregateId: string, events: DomainEvent[]): Promise<void> {
    this.events.push(...events);
  }

  async getEvents(aggregateId: string): Promise<DomainEvent[]> {
    return this.events.filter((e) => e.aggregateId === aggregateId);
  }

  async getAllEvents(): Promise<DomainEvent[]> {
    return [...this.events];
  }
}

// Event Publisher
interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
  subscribe(eventType: string, handler: EventHandler): void;
}

interface EventHandler {
  handle(event: DomainEvent): Promise<void>;
}

class AdvancedEventBus implements EventPublisher {
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

// User Service
interface AdvancedUserRepository {
  save(user: AdvancedUser): Promise<void>;
  findById(id: string): Promise<AdvancedUser | null>;
  findByEmail(email: string): Promise<AdvancedUser | null>;
}

class AdvancedDatabaseUserRepository implements AdvancedUserRepository {
  constructor(private eventStore: EventStore) {}

  async save(user: AdvancedUser): Promise<void> {
    // User'ı kaydet ve event'leri publish et
    const events = user.getUncommittedEvents();
    await this.eventStore.saveEvents(user.id, events);
    user.markEventsAsCommitted();
  }

  async findById(id: string): Promise<AdvancedUser | null> {
    const events = await this.eventStore.getEvents(id);
    if (events.length === 0) return null;

    const user = new AdvancedUser('', '', '');
    user.loadFromHistory(events);
    return user;
  }

  async findByEmail(email: string): Promise<AdvancedUser | null> {
    // Email ile arama için index kullanılabilir
    return null;
  }
}

class AdvancedUser {
  private uncommittedEvents: DomainEvent[] = [];

  constructor(public id: string, public name: string, public email: string) {}

  static create(name: string, email: string): AdvancedUser {
    const user = new AdvancedUser(Math.random().toString(36).substr(2, 9), name, email);
    user.addEvent(new AdvancedUserCreatedEvent(user.id, user));
    return user;
  }

  addEvent(event: DomainEvent): void {
    this.uncommittedEvents.push(event);
  }

  getUncommittedEvents(): DomainEvent[] {
    return [...this.uncommittedEvents];
  }

  markEventsAsCommitted(): void {
    this.uncommittedEvents = [];
  }

  loadFromHistory(events: DomainEvent[]): void {
    // Event sourcing ile state'i yeniden oluştur
    events.forEach((event) => {
      if (event.type === 'UserCreated') {
        this.id = event.aggregateId;
        this.name = event.data.name;
        this.email = event.data.email;
      }
    });
  }
}

// User Service
class AdvancedUserService {
  constructor(private userRepository: AdvancedUserRepository, private eventPublisher: EventPublisher) {}

  async createUser(name: string, email: string): Promise<AdvancedUser> {
    const user = AdvancedUser.create(name, email);
    await this.userRepository.save(user);

    // Event'leri publish et
    const events = user.getUncommittedEvents();
    for (const event of events) {
      await this.eventPublisher.publish(event);
    }

    return user;
  }

  async getUser(id: string): Promise<AdvancedUser | null> {
    return await this.userRepository.findById(id);
  }
}

// ============================================================================
// 2. CQRS (Command Query Responsibility Segregation) PATTERN
// ============================================================================

// Commands
interface AdvancedCommand {
  id: string;
  type: string;
  data: any;
}

class AdvancedCreateUserCommand implements AdvancedCommand {
  id = Math.random().toString(36).substr(2, 9);
  type = 'CreateUser';

  constructor(public data: { name: string; email: string }) {}
}

class AdvancedCreateOrderCommand implements AdvancedCommand {
  id = Math.random().toString(36).substr(2, 9);
  type = 'CreateOrder';

  constructor(public data: { userId: string; items: OrderItem[]; total: number }) {}
}

// Queries
interface Query {
  id: string;
  type: string;
  data: any;
}

class GetUserQuery implements Query {
  id = Math.random().toString(36).substr(2, 9);
  type = 'GetUser';

  constructor(public data: { id: string }) {}
}

class GetUserOrdersQuery implements Query {
  id = Math.random().toString(36).substr(2, 9);
  type = 'GetUserOrders';

  constructor(public data: { userId: string }) {}
}

// Command Handlers
interface AdvancedCommandHandler<T extends AdvancedCommand> {
  handle(command: T): Promise<void>;
}

class AdvancedCreateUserCommandHandler implements AdvancedCommandHandler<AdvancedCreateUserCommand> {
  constructor(private userService: AdvancedUserService) {}

  async handle(command: AdvancedCreateUserCommand): Promise<void> {
    await this.userService.createUser(command.data.name, command.data.email);
  }
}

class AdvancedCreateOrderCommandHandler implements AdvancedCommandHandler<AdvancedCreateOrderCommand> {
  constructor(private orderService: AdvancedOrderService) {}

  async handle(command: AdvancedCreateOrderCommand): Promise<void> {
    await this.orderService.createOrder(command.data);
  }
}

// Query Handlers
interface QueryHandler<T extends Query, R> {
  handle(query: T): Promise<R>;
}

class AdvancedGetUserQueryHandler implements QueryHandler<GetUserQuery, AdvancedUser | null> {
  constructor(private userService: AdvancedUserService) {}

  async handle(query: GetUserQuery): Promise<AdvancedUser | null> {
    return await this.userService.getUser(query.data.id);
  }
}

class AdvancedGetUserOrdersQueryHandler implements QueryHandler<GetUserOrdersQuery, AdvancedOrder[]> {
  constructor(private orderService: AdvancedOrderService) {}

  async handle(query: GetUserOrdersQuery): Promise<AdvancedOrder[]> {
    return await this.orderService.getUserOrders(query.data.userId);
  }
}

// Command Bus
class AdvancedCommandBus {
  private handlers = new Map<string, AdvancedCommandHandler<any>>();

  register<T extends AdvancedCommand>(commandType: string, handler: AdvancedCommandHandler<T>): void {
    this.handlers.set(commandType, handler);
  }

  async execute<T extends AdvancedCommand>(command: T): Promise<void> {
    const handler = this.handlers.get(command.type);
    if (!handler) {
      throw new Error(`No handler found for command: ${command.type}`);
    }
    await handler.handle(command);
  }
}

// Query Bus
class QueryBus {
  private handlers = new Map<string, QueryHandler<any, any>>();

  register<T extends Query, R>(queryType: string, handler: QueryHandler<T, R>): void {
    this.handlers.set(queryType, handler);
  }

  async execute<T extends Query, R>(query: T): Promise<R> {
    const handler = this.handlers.get(query.type);
    if (!handler) {
      throw new Error(`No handler found for query: ${query.type}`);
    }
    return await handler.handle(query);
  }
}

// ============================================================================
// 3. SAGA PATTERN İLE DISTRIBUTED TRANSACTIONS
// ============================================================================

interface SagaStep {
  execute(): Promise<void>;
  compensate(): Promise<void>;
}

class CreateUserSagaStep implements SagaStep {
  constructor(private userService: AdvancedUserService, private userData: any) {}

  async execute(): Promise<void> {
    await this.userService.createUser(this.userData.name, this.userData.email);
  }

  async compensate(): Promise<void> {
    // User'ı sil veya deaktive et
    console.log('Compensating user creation...');
  }
}

class SendWelcomeEmailSagaStep implements SagaStep {
  constructor(private emailService: EmailService, private user: AdvancedUser) {}

  async execute(): Promise<void> {
    await this.emailService.sendEmail(this.user.email, 'Welcome', 'Welcome to our platform!');
  }

  async compensate(): Promise<void> {
    // Email gönderimini iptal et (genellikle mümkün değil)
    console.log('Cannot compensate email sending...');
  }
}

class CreateUserProfileSagaStep implements SagaStep {
  constructor(private profileService: ProfileService, private userId: string) {}

  async execute(): Promise<void> {
    await this.profileService.createProfile(this.userId);
  }

  async compensate(): Promise<void> {
    await this.profileService.deleteProfile(this.userId);
  }
}

class Saga {
  private steps: SagaStep[] = [];
  private executedSteps: SagaStep[] = [];

  addStep(step: SagaStep): void {
    this.steps.push(step);
  }

  async execute(): Promise<void> {
    try {
      for (const step of this.steps) {
        await step.execute();
        this.executedSteps.push(step);
      }
    } catch (error) {
      await this.compensate();
      throw error;
    }
  }

  private async compensate(): Promise<void> {
    // Ters sırada compensate et
    for (let i = this.executedSteps.length - 1; i >= 0; i--) {
      try {
        await this.executedSteps[i].compensate();
      } catch (error) {
        console.error('Compensation failed:', error);
      }
    }
  }
}

// ============================================================================
// 4. OUTBOX PATTERN İLE EVENTUAL CONSISTENCY
// ============================================================================

interface OutboxEvent {
  id: string;
  aggregateId: string;
  eventType: string;
  eventData: any;
  timestamp: Date;
  processed: boolean;
}

interface OutboxRepository {
  save(event: OutboxEvent): Promise<void>;
  getUnprocessedEvents(): Promise<OutboxEvent[]>;
  markAsProcessed(eventId: string): Promise<void>;
}

class DatabaseOutboxRepository implements OutboxRepository {
  private events: OutboxEvent[] = [];

  async save(event: OutboxEvent): Promise<void> {
    this.events.push(event);
  }

  async getUnprocessedEvents(): Promise<OutboxEvent[]> {
    return this.events.filter((e) => !e.processed);
  }

  async markAsProcessed(eventId: string): Promise<void> {
    const event = this.events.find((e) => e.id === eventId);
    if (event) {
      event.processed = true;
    }
  }
}

class OutboxProcessor {
  constructor(private outboxRepository: OutboxRepository, private eventPublisher: EventPublisher) {}

  async processEvents(): Promise<void> {
    const unprocessedEvents = await this.outboxRepository.getUnprocessedEvents();

    for (const event of unprocessedEvents) {
      try {
        const domainEvent: DomainEvent = {
          id: event.id,
          type: event.eventType,
          aggregateId: event.aggregateId,
          data: event.eventData,
          timestamp: event.timestamp,
          version: 1,
        };

        await this.eventPublisher.publish(domainEvent);
        await this.outboxRepository.markAsProcessed(event.id);
      } catch (error) {
        console.error('Failed to process outbox event:', error);
      }
    }
  }
}

// ============================================================================
// 5. CIRCUIT BREAKER PATTERN İLE RESILIENCE
// ============================================================================

enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

interface CircuitBreakerConfig {
  failureThreshold: number;
  timeout: number;
  resetTimeout: number;
}

class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime = 0;

  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime > this.config.resetTimeout) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await Promise.race([
        operation(),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Operation timeout')), this.config.timeout)),
      ]);

      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN;
    }
  }
}

// Circuit Breaker ile Service
class ResilientUserService {
  constructor(private userService: AdvancedUserService, private circuitBreaker: CircuitBreaker) {}

  async createUser(name: string, email: string): Promise<AdvancedUser> {
    return await this.circuitBreaker.execute(() => this.userService.createUser(name, email));
  }
}

// ============================================================================
// 6. RETRY PATTERN İLE FAULT TOLERANCE
// ============================================================================

interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoffMultiplier: number;
}

class RetryHandler {
  constructor(private config: RetryConfig) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error;
    let delay = this.config.delay;

    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt === this.config.maxAttempts) {
          throw lastError;
        }

        await this.sleep(delay);
        delay *= this.config.backoffMultiplier;
      }
    }

    throw lastError!;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ============================================================================
// 7. BULKHEAD PATTERN İLE RESOURCE ISOLATION
// ============================================================================

class BulkheadExecutor {
  private semaphores = new Map<string, { count: number; max: number }>();

  createBulkhead(name: string, maxConcurrency: number): void {
    this.semaphores.set(name, { count: 0, max: maxConcurrency });
  }

  async execute<T>(bulkheadName: string, operation: () => Promise<T>): Promise<T> {
    const semaphore = this.semaphores.get(bulkheadName);
    if (!semaphore) {
      throw new Error(`Bulkhead ${bulkheadName} not found`);
    }

    if (semaphore.count >= semaphore.max) {
      throw new Error(`Bulkhead ${bulkheadName} is full`);
    }

    semaphore.count++;
    try {
      return await operation();
    } finally {
      semaphore.count--;
    }
  }
}

// ============================================================================
// 8. TIMEOUT PATTERN İLE RESPONSIVENESS
// ============================================================================

class TimeoutHandler {
  async execute<T>(operation: () => Promise<T>, timeoutMs: number): Promise<T> {
    return await Promise.race([operation(), new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Operation timeout')), timeoutMs))]);
  }
}

// ============================================================================
// 9. COMPOSITE PATTERN İLE COMPLEX DEPENDENCIES
// ============================================================================

interface Service {
  start(): Promise<void>;
  stop(): Promise<void>;
  isHealthy(): Promise<boolean>;
}

class DatabaseService implements Service {
  async start(): Promise<void> {
    console.log('Starting database service...');
  }

  async stop(): Promise<void> {
    console.log('Stopping database service...');
  }

  async isHealthy(): Promise<boolean> {
    return true;
  }
}

class CacheService implements Service {
  async start(): Promise<void> {
    console.log('Starting cache service...');
  }

  async stop(): Promise<void> {
    console.log('Stopping cache service...');
  }

  async isHealthy(): Promise<boolean> {
    return true;
  }
}

class MessageQueueService implements Service {
  async start(): Promise<void> {
    console.log('Starting message queue service...');
  }

  async stop(): Promise<void> {
    console.log('Stopping message queue service...');
  }

  async isHealthy(): Promise<boolean> {
    return true;
  }
}

class ServiceManager implements Service {
  private services: Service[] = [];

  addService(service: Service): void {
    this.services.push(service);
  }

  async start(): Promise<void> {
    await Promise.all(this.services.map((service) => service.start()));
  }

  async stop(): Promise<void> {
    await Promise.all(this.services.map((service) => service.stop()));
  }

  async isHealthy(): Promise<boolean> {
    const healthChecks = await Promise.all(this.services.map((service) => service.isHealthy()));
    return healthChecks.every((healthy) => healthy);
  }
}

// ============================================================================
// 10. DEPENDENCY INJECTION CONTAINER İLE ADVANCED DI
// ============================================================================

interface ServiceDescriptor {
  factory: () => any;
  singleton: boolean;
  dependencies: string[];
}

class AdvancedDIContainer {
  private services = new Map<string, ServiceDescriptor>();
  private singletons = new Map<string, any>();
  private building = new Set<string>();

  register<T>(name: string, factory: (...deps: any[]) => T, dependencies: string[] = [], singleton: boolean = false): void {
    this.services.set(name, { factory, dependencies, singleton });
  }

  resolve<T>(name: string): T {
    if (this.building.has(name)) {
      throw new Error(`Circular dependency detected: ${name}`);
    }

    this.building.add(name);

    try {
      const descriptor = this.services.get(name);
      if (!descriptor) {
        throw new Error(`Service ${name} not found`);
      }

      if (descriptor.singleton && this.singletons.has(name)) {
        return this.singletons.get(name);
      }

      const dependencies = descriptor.dependencies.map((dep) => this.resolve(dep));
      const instance = descriptor.factory.apply(null, dependencies);

      if (descriptor.singleton) {
        this.singletons.set(name, instance);
      }

      return instance;
    } finally {
      this.building.delete(name);
    }
  }

  createScope(): DIContainerScope {
    return new DIContainerScope(this);
  }
}

class DIContainerScope {
  private scopedInstances = new Map<string, any>();

  constructor(private container: AdvancedDIContainer) {}

  resolve<T>(name: string): T {
    if (this.scopedInstances.has(name)) {
      return this.scopedInstances.get(name);
    }

    const instance = this.container.resolve<T>(name);
    this.scopedInstances.set(name, instance);
    return instance;
  }
}

// ============================================================================
// 11. KULLANIM ÖRNEKLERİ VE INTEGRATION
// ============================================================================

// Container setup
function setupAdvancedContainer(): AdvancedDIContainer {
  const container = new AdvancedDIContainer();

  // Event Store
  container.register('eventStore', () => new InMemoryEventStore());

  // Event Publisher
  container.register('eventPublisher', () => new AdvancedEventBus());

  // Repositories
  container.register('userRepository', (eventStore) => new AdvancedDatabaseUserRepository(eventStore), ['eventStore']);

  // Services
  container.register('userService', (userRepository, eventPublisher) => new AdvancedUserService(userRepository, eventPublisher), [
    'userRepository',
    'eventPublisher',
  ]);

  // Circuit Breaker
  container.register(
    'circuitBreaker',
    () =>
      new CircuitBreaker({
        failureThreshold: 5,
        timeout: 5000,
        resetTimeout: 30000,
      })
  );

  // Retry Handler
  container.register(
    'retryHandler',
    () =>
      new RetryHandler({
        maxAttempts: 3,
        delay: 1000,
        backoffMultiplier: 2,
      })
  );

  // Resilient Service
  container.register('resilientUserService', (userService, circuitBreaker) => new ResilientUserService(userService, circuitBreaker), [
    'userService',
    'circuitBreaker',
  ]);

  return container;
}

// Application setup
async function setupApplication(): Promise<void> {
  const container = setupAdvancedContainer();

  // Event handlers
  const eventPublisher = container.resolve<AdvancedEventBus>('eventPublisher');
  const emailService = new AdvancedSmtpEmailService();

  eventPublisher.subscribe('UserCreated', new AdvancedEmailNotificationHandler(emailService));

  // Command handlers
  const commandBus = new AdvancedCommandBus();
  const userService = container.resolve<AdvancedUserService>('userService');

  commandBus.register('CreateUser', new AdvancedCreateUserCommandHandler(userService));

  // Query handlers
  const queryBus = new QueryBus();
  queryBus.register('GetUser', new AdvancedGetUserQueryHandler(userService));

  // Outbox processor
  const outboxRepository = new DatabaseOutboxRepository();
  const outboxProcessor = new OutboxProcessor(outboxRepository, eventPublisher);

  // Start outbox processing
  setInterval(() => outboxProcessor.processEvents(), 5000);

  console.log('Application setup completed');
}

// ============================================================================
// 12. YARDIMCI TİPLER VE ARAYÜZLER
// ============================================================================

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

class AdvancedOrder {
  constructor(public id: string, public userId: string, public items: OrderItem[], public total: number, public customerEmail: string) {}
}

class AdvancedOrderService {
  constructor(private orderRepository: any) {}

  async createOrder(orderData: any): Promise<void> {
    console.log('Creating order...');
  }

  async getUserOrders(userId: string): Promise<AdvancedOrder[]> {
    console.log(`Getting orders for user ${userId}`);
    return [];
  }
}

interface ProfileService {
  createProfile(userId: string): Promise<void>;
  deleteProfile(userId: string): Promise<void>;
}

class DatabaseProfileService implements ProfileService {
  async createProfile(userId: string): Promise<void> {
    console.log(`Creating profile for user ${userId}`);
  }

  async deleteProfile(userId: string): Promise<void> {
    console.log(`Deleting profile for user ${userId}`);
  }
}

class LegacyOrderService {
  constructor(private orderRepository: any) {}

  async createOrder(orderData: any): Promise<void> {
    console.log('Creating order...');
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    console.log(`Getting orders for user ${userId}`);
    return [];
  }
}

class AdvancedSmtpEmailService implements EmailService {
  sendEmail(to: string, subject: string, body: string): void {
    console.log(`Sending email via SMTP to ${to}: ${subject}`);
  }
}

class AdvancedEmailNotificationHandler implements EventHandler {
  constructor(private emailService: EmailService) {}

  async handle(event: DomainEvent): Promise<void> {
    if (event.type === 'UserCreated') {
      const user = event.data as AdvancedUser;
      this.emailService.sendEmail(user.email, 'Welcome', 'Welcome to our platform!');
    }
  }
}

// ============================================================================
// 13. ÖZET VE SONUÇ
// ============================================================================

/*
Advanced Dependency Inversion Principle (DIP) özeti:

1. Microservices Architecture
   - Event-driven communication
   - Domain events
   - Event sourcing
   - CQRS pattern

2. Resilience Patterns
   - Circuit Breaker
   - Retry Pattern
   - Bulkhead Pattern
   - Timeout Pattern

3. Advanced DI Patterns
   - Advanced DI Container
   - Scoped Dependencies
   - Circular Dependency Detection
   - Service Lifecycle Management

4. Distributed Systems Patterns
   - Saga Pattern
   - Outbox Pattern
   - Eventual Consistency
   - Service Discovery

5. Testing Strategies
   - Mock Services
   - Integration Tests
   - Contract Tests
   - Chaos Engineering

Bu gelişmiş örnekler, büyük ölçekli sistemlerde DIP'nin nasıl
uygulanacağını ve diğer design pattern'ler ile nasıl entegre
edileceğini gösterir.
*/
