/**
 * Interface Segregation Principle (ISP) - Advanced TypeScript Examples
 *
 * Bu dosya, ISP'nin gelişmiş kullanım senaryolarını ve gerçek dünya
 * uygulamalarını gösterir. Karmaşık sistemlerde arayüz ayrımının
 * nasıl uygulanacağını ve design pattern'ler ile nasıl entegre
 * edileceğini gösterir.
 */

// ============================================================================
// 1. MICROSERVICES MİMARİSİ İLE ISP UYGULAMASI
// ============================================================================

// User Service Interfaces
interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: CreateUserRequest): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}

interface UserValidator {
  validateUser(user: User): ValidationResult;
  validateEmail(email: string): boolean;
  validatePassword(password: string): boolean;
}

interface UserNotifier {
  sendWelcomeEmail(user: User): Promise<void>;
  sendPasswordResetEmail(user: User, token: string): Promise<void>;
  sendAccountDeletionEmail(user: User): Promise<void>;
}

// Order Service Interfaces
interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  create(order: CreateOrderRequest): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
}

interface OrderCalculator {
  calculateTotal(order: Order): number;
  calculateTax(order: Order): number;
  calculateShipping(order: Order): number;
}

interface OrderProcessor {
  processOrder(order: Order): Promise<ProcessingResult>;
  cancelOrder(order: Order): Promise<void>;
  refundOrder(order: Order): Promise<void>;
}

// Payment Service Interfaces
interface PaymentGateway {
  processPayment(payment: PaymentRequest): Promise<PaymentResult>;
  refundPayment(transactionId: string): Promise<RefundResult>;
}

interface PaymentValidator {
  validatePayment(payment: PaymentRequest): ValidationResult;
  validateCard(card: CardDetails): ValidationResult;
}

interface PaymentLogger {
  logPayment(payment: PaymentRequest, result: PaymentResult): void;
  logRefund(transactionId: string, result: RefundResult): void;
}

// ============================================================================
// 2. CQRS PATTERN İLE ISP UYGULAMASI
// ============================================================================

// Command Interfaces
interface Command {
  execute(): Promise<void>;
}

interface CommandHandler<T extends Command> {
  handle(command: T): Promise<void>;
}

interface CommandValidator<T extends Command> {
  validate(command: T): ValidationResult;
}

// Query Interfaces
interface Query<TResult> {
  execute(): Promise<TResult>;
}

interface QueryHandler<TQuery extends Query<any>, TResult> {
  handle(query: TQuery): Promise<TResult>;
}

interface QueryCache<TQuery extends Query<any>, TResult> {
  get(query: TQuery): Promise<TResult | null>;
  set(query: TQuery, result: TResult): Promise<void>;
  invalidate(pattern: string): Promise<void>;
}

// Event Interfaces
interface DomainEvent {
  eventId: string;
  occurredOn: Date;
  eventType: string;
}

interface EventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}

interface EventStore {
  save(event: DomainEvent): Promise<void>;
  getEvents(aggregateId: string): Promise<DomainEvent[]>;
  getEventsByType(eventType: string): Promise<DomainEvent[]>;
}

// ============================================================================
// 3. STRATEGY PATTERN İLE ISP UYGULAMASI
// ============================================================================

// Authentication Strategy Interfaces
interface AuthenticationStrategy {
  authenticate(credentials: Credentials): Promise<AuthenticationResult>;
  refreshToken(token: string): Promise<AuthenticationResult>;
}

interface AuthenticationValidator {
  validateCredentials(credentials: Credentials): ValidationResult;
  validateToken(token: string): ValidationResult;
}

interface AuthenticationLogger {
  logAuthentication(credentials: Credentials, result: AuthenticationResult): void;
  logTokenRefresh(token: string, result: AuthenticationResult): void;
}

// Notification Strategy Interfaces
interface NotificationChannel {
  send(notification: Notification): Promise<NotificationResult>;
  isAvailable(): boolean;
}

interface NotificationTemplate {
  render(data: any): string;
  validate(data: any): ValidationResult;
}

interface NotificationScheduler {
  schedule(notification: Notification, sendAt: Date): Promise<void>;
  cancel(notificationId: string): Promise<void>;
}

// ============================================================================
// 4. OBSERVER PATTERN İLE ISP UYGULAMASI
// ============================================================================

// Event Publisher Interfaces
interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
  subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): void;
  unsubscribe(eventType: string, handler: EventHandler<any>): void;
}

interface EventFilter {
  shouldHandle(event: DomainEvent): boolean;
  getFilterCriteria(): string[];
}

interface EventTransformer {
  transform(event: DomainEvent): DomainEvent;
  canTransform(eventType: string): boolean;
}

// Event Consumer Interfaces
interface EventConsumer {
  consume(event: DomainEvent): Promise<void>;
  getSupportedEventTypes(): string[];
}

interface EventRetryPolicy {
  shouldRetry(event: DomainEvent, error: Error): boolean;
  getRetryDelay(attempt: number): number;
  getMaxRetries(): number;
}

// ============================================================================
// 5. ADAPTER PATTERN İLE ISP UYGULAMASI
// ============================================================================

// External Service Interfaces
interface ExternalUserService {
  getUser(id: string): Promise<ExternalUser>;
  createUser(user: ExternalUser): Promise<ExternalUser>;
  updateUser(user: ExternalUser): Promise<ExternalUser>;
  deleteUser(id: string): Promise<void>;
}

interface ExternalPaymentService {
  chargeCard(card: CardDetails, amount: number): Promise<PaymentResult>;
  refund(transactionId: string): Promise<RefundResult>;
}

interface ExternalNotificationService {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
  sendSMS(to: string, message: string): Promise<void>;
}

// Adapter Interfaces
interface ServiceAdapter<TExternal, TInternal> {
  adaptToInternal(external: TExternal): TInternal;
  adaptToExternal(internal: TInternal): TExternal;
}

interface ServiceMapper<TExternal, TInternal> {
  mapToInternal(external: TExternal): TInternal;
  mapToExternal(internal: TInternal): TExternal;
  validateMapping(external: TExternal, internal: TInternal): boolean;
}

// ============================================================================
// 6. FACTORY PATTERN İLE ISP UYGULAMASI
// ============================================================================

// Factory Interfaces
interface Factory<T> {
  create(config: FactoryConfig): T;
  canCreate(type: string): boolean;
}

interface FactoryConfig {
  type: string;
  options: Record<string, any>;
}

interface FactoryRegistry {
  register(type: string, factory: Factory<any>): void;
  getFactory(type: string): Factory<any> | null;
  getSupportedTypes(): string[];
}

// Builder Interfaces
interface Builder<T> {
  reset(): void;
  setProperty(key: string, value: any): Builder<T>;
  build(): T;
}

interface BuilderValidator<T> {
  validate(builder: Builder<T>): ValidationResult;
  getRequiredProperties(): string[];
}

// ============================================================================
// 7. DECORATOR PATTERN İLE ISP UYGULAMASI
// ============================================================================

// Base Service Interfaces
interface DataService {
  getData(id: string): Promise<any>;
  saveData(data: any): Promise<void>;
}

interface CacheService {
  get(key: string): Promise<any | null>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

interface LoggingService {
  log(level: LogLevel, message: string, data?: any): void;
  error(message: string, error: Error): void;
  warn(message: string, data?: any): void;
  info(message: string, data?: any): void;
}

interface MetricsService {
  incrementCounter(name: string, tags?: Record<string, string>): void;
  recordHistogram(name: string, value: number, tags?: Record<string, string>): void;
  recordGauge(name: string, value: number, tags?: Record<string, string>): void;
}

// ============================================================================
// 8. COMPOSITE PATTERN İLE ISP UYGULAMASI
// ============================================================================

// Component Interfaces
interface UIComponent {
  render(): string;
  getProperties(): Record<string, any>;
}

interface ContainerComponent extends UIComponent {
  addChild(component: UIComponent): void;
  removeChild(component: UIComponent): void;
  getChildren(): UIComponent[];
}

interface InteractiveComponent extends UIComponent {
  onClick(handler: () => void): void;
  onHover(handler: () => void): void;
}

interface StylableComponent extends UIComponent {
  setStyle(property: string, value: string): void;
  getStyles(): Record<string, string>;
}

// ============================================================================
// 9. PROXY PATTERN İLE ISP UYGULAMASI
// ============================================================================

// Proxy Interfaces
interface ServiceProxy<T> {
  call(method: string, args: any[]): Promise<any>;
  isAvailable(): boolean;
  getLatency(): number;
}

interface LoadBalancer {
  selectService(services: ServiceProxy<any>[]): ServiceProxy<any>;
  getHealthStatus(): HealthStatus;
}

interface CircuitBreaker {
  execute<T>(operation: () => Promise<T>): Promise<T>;
  getState(): CircuitState;
  reset(): void;
}

// ============================================================================
// 10. ISP UYUMLULUK TESTLERİ VE ANALİZ
// ============================================================================

class AdvancedISPTester {
  static analyzeInterfaceSize(interfaces: any[]): InterfaceAnalysis {
    const analysis: InterfaceAnalysis = {
      totalInterfaces: interfaces.length,
      averageMethodsPerInterface: 0,
      largeInterfaces: [],
      wellSegregatedInterfaces: [],
    };

    let totalMethods = 0;

    interfaces.forEach((iface) => {
      const methods = this.getInterfaceMethods(iface);
      totalMethods += methods.length;

      if (methods.length > 5) {
        analysis.largeInterfaces.push({
          name: iface.name || 'Unknown',
          methodCount: methods.length,
          methods: methods,
        });
      } else {
        analysis.wellSegregatedInterfaces.push({
          name: iface.name || 'Unknown',
          methodCount: methods.length,
          methods: methods,
        });
      }
    });

    analysis.averageMethodsPerInterface = totalMethods / interfaces.length;

    return analysis;
  }

  static testDependencyInjection<T>(service: T, requiredDependencies: string[], optionalDependencies: string[] = []): DependencyInjectionTest {
    const test: DependencyInjectionTest = {
      serviceName: (service as any).constructor?.name || 'Unknown',
      requiredDependencies: [],
      optionalDependencies: [],
      missingDependencies: [],
      extraDependencies: [],
      isCompliant: true,
    };

    // Bu gerçek bir implementasyon olmalı - şimdilik mock
    test.requiredDependencies = requiredDependencies;
    test.optionalDependencies = optionalDependencies;

    return test;
  }

  static testInterfaceCohesion(interfaces: any[]): CohesionAnalysis {
    const analysis: CohesionAnalysis = {
      highCohesion: [],
      lowCohesion: [],
      averageCohesion: 0,
    };

    interfaces.forEach((iface) => {
      const methods = this.getInterfaceMethods(iface);
      const cohesion = this.calculateCohesion(methods);

      if (cohesion > 0.7) {
        analysis.highCohesion.push({
          name: iface.name || 'Unknown',
          cohesion: cohesion,
        });
      } else {
        analysis.lowCohesion.push({
          name: iface.name || 'Unknown',
          cohesion: cohesion,
        });
      }
    });

    const totalCohesion = analysis.highCohesion.concat(analysis.lowCohesion).reduce((sum, item) => sum + item.cohesion, 0);

    analysis.averageCohesion = totalCohesion / interfaces.length;

    return analysis;
  }

  private static getInterfaceMethods(iface: any): string[] {
    // Bu gerçek bir implementasyon olmalı - şimdilik mock
    return Object.getOwnPropertyNames(iface.prototype || {});
  }

  private static calculateCohesion(methods: string[]): number {
    // Basit cohesion hesaplama - gerçek implementasyon daha karmaşık olmalı
    return methods.length <= 3 ? 1.0 : Math.max(0, 1.0 - (methods.length - 3) * 0.1);
  }
}

// ============================================================================
// 11. KULLANIM ÖRNEKLERİ
// ============================================================================

async function demonstrateAdvancedISP() {
  console.log('=== Advanced Interface Segregation Principle Examples ===\n');

  // Microservices Architecture
  console.log('1. Microservices Architecture:');
  console.log('- User Service: Repository, Validator, Notifier interfaces');
  console.log('- Order Service: Repository, Calculator, Processor interfaces');
  console.log('- Payment Service: Gateway, Validator, Logger interfaces');

  // CQRS Pattern
  console.log('\n2. CQRS Pattern:');
  console.log('- Command: Handler, Validator interfaces');
  console.log('- Query: Handler, Cache interfaces');
  console.log('- Event: Handler, Store interfaces');

  // Strategy Pattern
  console.log('\n3. Strategy Pattern:');
  console.log('- Authentication: Strategy, Validator, Logger interfaces');
  console.log('- Notification: Channel, Template, Scheduler interfaces');

  // Observer Pattern
  console.log('\n4. Observer Pattern:');
  console.log('- Event Publisher: Publisher, Filter, Transformer interfaces');
  console.log('- Event Consumer: Consumer, RetryPolicy interfaces');

  // Adapter Pattern
  console.log('\n5. Adapter Pattern:');
  console.log('- External Services: User, Payment, Notification interfaces');
  console.log('- Adapters: ServiceAdapter, ServiceMapper interfaces');

  // Factory Pattern
  console.log('\n6. Factory Pattern:');
  console.log('- Factory: Factory, Registry interfaces');
  console.log('- Builder: Builder, Validator interfaces');

  // Decorator Pattern
  console.log('\n7. Decorator Pattern:');
  console.log('- Base Services: Data, Cache, Logging, Metrics interfaces');

  // Composite Pattern
  console.log('\n8. Composite Pattern:');
  console.log('- UI Components: Component, Container, Interactive, Stylable interfaces');

  // Proxy Pattern
  console.log('\n9. Proxy Pattern:');
  console.log('- Proxy: ServiceProxy, LoadBalancer, CircuitBreaker interfaces');

  // ISP Analysis
  console.log('\n10. ISP Analysis:');
  const mockInterfaces = [
    { name: 'UserRepository', prototype: { findById: () => {}, create: () => {} } },
    { name: 'PaymentGateway', prototype: { processPayment: () => {} } },
    { name: 'NotificationService', prototype: { send: () => {} } },
  ];

  const analysis = AdvancedISPTester.analyzeInterfaceSize(mockInterfaces);
  console.log(`Total Interfaces: ${analysis.totalInterfaces}`);
  console.log(`Average Methods per Interface: ${analysis.averageMethodsPerInterface.toFixed(2)}`);
  console.log(`Well Segregated Interfaces: ${analysis.wellSegregatedInterfaces.length}`);
  console.log(`Large Interfaces: ${analysis.largeInterfaces.length}`);
}

// ============================================================================
// 12. TİP TANIMLARI
// ============================================================================

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
}

interface CreateOrderRequest {
  userId: string;
  items: OrderItem[];
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

interface ProcessingResult {
  success: boolean;
  orderId: string;
  message: string;
}

interface PaymentRequest {
  amount: number;
  currency: string;
  card: CardDetails;
}

interface CardDetails {
  number: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
}

interface PaymentResult {
  success: boolean;
  transactionId: string;
  error?: string;
}

interface RefundResult {
  success: boolean;
  refundId: string;
  error?: string;
}

interface Credentials {
  username: string;
  password: string;
}

interface AuthenticationResult {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

interface Notification {
  id: string;
  type: string;
  recipient: string;
  content: string;
  scheduledFor?: Date;
}

interface NotificationResult {
  success: boolean;
  messageId: string;
  error?: string;
}

interface ExternalUser {
  externalId: string;
  name: string;
  email: string;
}

interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

interface HealthStatus {
  isHealthy: boolean;
  services: ServiceHealth[];
}

interface ServiceHealth {
  name: string;
  isHealthy: boolean;
  latency: number;
}

enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

interface InterfaceAnalysis {
  totalInterfaces: number;
  averageMethodsPerInterface: number;
  largeInterfaces: InterfaceInfo[];
  wellSegregatedInterfaces: InterfaceInfo[];
}

interface InterfaceInfo {
  name: string;
  methodCount: number;
  methods: string[];
}

interface DependencyInjectionTest {
  serviceName: string;
  requiredDependencies: string[];
  optionalDependencies: string[];
  missingDependencies: string[];
  extraDependencies: string[];
  isCompliant: boolean;
}

interface CohesionAnalysis {
  highCohesion: CohesionInfo[];
  lowCohesion: CohesionInfo[];
  averageCohesion: number;
}

interface CohesionInfo {
  name: string;
  cohesion: number;
}

// ============================================================================
// 13. EXPORT
// ============================================================================

export {
  UserRepository,
  UserValidator,
  UserNotifier,
  OrderRepository,
  OrderCalculator,
  OrderProcessor,
  PaymentGateway,
  PaymentValidator,
  PaymentLogger,
  Command,
  CommandHandler,
  CommandValidator,
  Query,
  QueryHandler,
  QueryCache,
  DomainEvent,
  EventHandler,
  EventStore,
  AuthenticationStrategy,
  AuthenticationValidator,
  AuthenticationLogger,
  NotificationChannel,
  NotificationTemplate,
  NotificationScheduler,
  EventPublisher,
  EventFilter,
  EventTransformer,
  EventConsumer,
  EventRetryPolicy,
  ExternalUserService,
  ExternalPaymentService,
  ExternalNotificationService,
  ServiceAdapter,
  ServiceMapper,
  Factory,
  FactoryConfig,
  FactoryRegistry,
  Builder,
  BuilderValidator,
  DataService,
  CacheService,
  LoggingService,
  MetricsService,
  UIComponent,
  ContainerComponent,
  InteractiveComponent,
  StylableComponent,
  ServiceProxy,
  LoadBalancer,
  CircuitBreaker,
  AdvancedISPTester,
  demonstrateAdvancedISP,
};
