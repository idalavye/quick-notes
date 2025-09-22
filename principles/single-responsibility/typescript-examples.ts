/**
 * TypeScript'te Tek Sorumluluk Prensibi (SRP) Örnekleri
 *
 * Tek Sorumluluk Prensibi, bir sınıfın sadece bir değişiklik nedeni olması gerektiğini belirtir.
 * Başka bir deyişle, bir sınıfın sadece bir işi veya sorumluluğu olmalıdır.
 */

// ===========================================
// ❌ YANLIŞ: SRP'yi ihlal eden örnek
// ===========================================

interface UserData {
  name: string;
  email: string;
  id?: string;
}

class UserViolatingSRP {
  private name: string;
  private email: string;
  private id?: string;

  constructor(name: string, email: string, id?: string) {
    this.name = name;
    this.email = email;
    this.id = id;
  }

  // Kullanıcı veri yönetimi
  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getId(): string | undefined {
    return this.id;
  }

  updateEmail(newEmail: string): void {
    this.email = newEmail;
  }

  // ❌ İHLAL: User sınıfı aynı zamanda email doğrulama işlemi yapıyor
  validateEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  // ❌ İHLAL: User sınıfı aynı zamanda veritabanı işlemleri yapıyor
  saveToDatabase(): Promise<boolean> {
    console.log(`Saving user ${this.name} to database...`);
    // Veritabanı mantığı burada
    return Promise.resolve(true);
  }

  // ❌ İHLAL: User sınıfı aynı zamanda email gönderme işlemi yapıyor
  sendWelcomeEmail(): Promise<boolean> {
    console.log(`Sending welcome email to ${this.email}...`);
    // Email gönderme mantığı burada
    return Promise.resolve(true);
  }

  // ❌ İHLAL: User sınıfı aynı zamanda loglama işlemi yapıyor
  logUserActivity(activity: string): void {
    console.log(`User ${this.name} performed: ${activity}`);
  }
}

// ===========================================
// ✅ DOĞRU: SRP'yi takip eden örnek
// ===========================================

// 1. User sınıfı - sadece kullanıcı verilerinden sorumlu
class User {
  private name: string;
  private email: string;
  private id?: string;

  constructor(name: string, email: string, id?: string) {
    this.name = name;
    this.email = email;
    this.id = id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getId(): string | undefined {
    return this.id;
  }

  updateEmail(newEmail: string): void {
    this.email = newEmail;
  }

  updateName(newName: string): void {
    this.name = newName;
  }
}

// 2. EmailValidator sınıfı - sadece email doğrulamadan sorumlu
class EmailValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly BUSINESS_DOMAINS = ['company.com', 'business.org'];

  static validate(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  static validateFormat(email: string): boolean {
    return this.validate(email);
  }

  static isBusinessEmail(email: string): boolean {
    const domain = email.split('@')[1];
    return this.BUSINESS_DOMAINS.includes(domain);
  }

  static isGmail(email: string): boolean {
    return email.endsWith('@gmail.com');
  }
}

// 3. UserRepository arayüzü ve uygulaması
interface IUserRepository {
  save(user: User): Promise<boolean>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(user: User): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

class UserRepository implements IUserRepository {
  async save(user: User): Promise<boolean> {
    console.log(`Saving user ${user.getName()} to database...`);
    // Veritabanı mantığı burada
    return true;
  }

  async findById(id: string): Promise<User | null> {
    console.log(`Finding user with id: ${id}`);
    // Veritabanı sorgu mantığı burada
    return null;
  }

  async findByEmail(email: string): Promise<User | null> {
    console.log(`Finding user with email: ${email}`);
    // Veritabanı sorgu mantığı burada
    return null;
  }

  async update(user: User): Promise<boolean> {
    console.log(`Updating user ${user.getName()} in database...`);
    // Veritabanı güncelleme mantığı burada
    return true;
  }

  async delete(id: string): Promise<boolean> {
    console.log(`Deleting user with id: ${id}`);
    // Veritabanı silme mantığı burada
    return true;
  }
}

// 4. EmailService arayüzü ve uygulaması
interface IEmailService {
  sendWelcomeEmail(user: User): Promise<boolean>;
  sendPasswordResetEmail(user: User): Promise<boolean>;
  sendNotificationEmail(user: User, message: string): Promise<boolean>;
}

class EmailService implements IEmailService {
  async sendWelcomeEmail(user: User): Promise<boolean> {
    console.log(`Sending welcome email to ${user.getEmail()}...`);
    // Email gönderme mantığı burada
    return true;
  }

  async sendPasswordResetEmail(user: User): Promise<boolean> {
    console.log(`Sending password reset email to ${user.getEmail()}...`);
    // Email gönderme mantığı burada
    return true;
  }

  async sendNotificationEmail(user: User, message: string): Promise<boolean> {
    console.log(`Sending notification to ${user.getEmail()}: ${message}`);
    // Email gönderme mantığı burada
    return true;
  }
}

// 5. Logger arayüzü ve uygulaması
interface ILogger {
  logUserActivity(user: User, activity: string): void;
  logError(error: Error): void;
  logInfo(message: string): void;
}

class Logger implements ILogger {
  logUserActivity(user: User, activity: string): void {
    console.log(`User ${user.getName()} performed: ${activity}`);
  }

  logError(error: Error): void {
    console.error(`Error occurred: ${error.message}`);
  }

  logInfo(message: string): void {
    console.log(`Info: ${message}`);
  }
}

// ===========================================
// Kullanım Örnekleri
// ===========================================

async function demonstrateSRPUsage(): Promise<void> {
  // Kullanıcı oluşturma
  const user = new User('John Doe', 'john@example.com', 'user_123');

  // EmailValidator kullanarak email doğrulama
  if (EmailValidator.validate(user.getEmail())) {
    console.log('Email is valid');
  }

  // Daha iyi test edilebilirlik için dependency injection kullanma
  const userRepository = new UserRepository();
  const emailService = new EmailService();
  const logger = new Logger();

  // UserRepository kullanarak kullanıcı kaydetme
  await userRepository.save(user);

  // EmailService kullanarak hoş geldin emaili gönderme
  await emailService.sendWelcomeEmail(user);

  // Logger kullanarak aktivite loglama
  logger.logUserActivity(user, 'User created');
}

// ===========================================
// Başka Bir Örnek: Sipariş İşleme
// ===========================================

// Sipariş sistemi için türler ve arayüzler
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

interface ShippingResult {
  success: boolean;
  trackingNumber?: string;
  error?: string;
}

// ❌ YANLIŞ: Order sınıfı çok fazla iş yapıyor
class OrderViolatingSRP {
  private id: string;
  private customerId: string;
  private items: OrderItem[];
  private total: number;
  private status: OrderStatus;

  constructor(id: string, customerId: string, items: OrderItem[], total: number) {
    this.id = id;
    this.customerId = customerId;
    this.items = items;
    this.total = total;
    this.status = 'pending';
  }

  // Sipariş veri yönetimi
  getId(): string {
    return this.id;
  }

  getTotal(): number {
    return this.total;
  }

  getStatus(): OrderStatus {
    return this.status;
  }

  addItem(item: OrderItem): void {
    this.items.push(item);
  }

  // ❌ İHLAL: Order sınıfı ödeme işleme işlemi yapıyor
  async processPayment(paymentMethod: string): Promise<PaymentResult> {
    console.log(`Processing payment of $${this.total} using ${paymentMethod}`);
    // Ödeme işleme mantığı
    this.status = 'paid';
    return { success: true, transactionId: 'txn_123' };
  }

  // ❌ İHLAL: Order sınıfı envanter yönetimi işlemi yapıyor
  updateInventory(): Promise<boolean> {
    console.log('Updating inventory...');
    // Envanter güncelleme mantığı
    return Promise.resolve(true);
  }

  // ❌ İHLAL: Order sınıfı kargo işlemi yapıyor
  async shipOrder(): Promise<ShippingResult> {
    console.log('Shipping order...');
    // Kargo mantığı
    this.status = 'shipped';
    return { success: true, trackingNumber: 'TRK_456' };
  }

  // ❌ İHLAL: Order sınıfı bildirim işlemi yapıyor
  sendConfirmationEmail(): Promise<boolean> {
    console.log('Sending confirmation email...');
    // Email gönderme mantığı
    return Promise.resolve(true);
  }
}

// ✅ DOĞRU: Ayrılmış sorumluluklar
class Order {
  private id: string;
  private customerId: string;
  private items: OrderItem[];
  private total: number;
  private status: OrderStatus;

  constructor(id: string, customerId: string, items: OrderItem[], total: number) {
    this.id = id;
    this.customerId = customerId;
    this.items = items;
    this.total = total;
    this.status = 'pending';
  }

  getId(): string {
    return this.id;
  }

  getTotal(): number {
    return this.total;
  }

  getStatus(): OrderStatus {
    return this.status;
  }

  addItem(item: OrderItem): void {
    this.items.push(item);
  }

  updateStatus(status: OrderStatus): void {
    this.status = status;
  }

  getItems(): OrderItem[] {
    return [...this.items]; // Kapsüllemeyi korumak için kopya döndür
  }
}

// Ödeme işleme servisi
interface IPaymentProcessor {
  processPayment(order: Order, paymentMethod: string): Promise<PaymentResult>;
}

class PaymentProcessor implements IPaymentProcessor {
  async processPayment(order: Order, paymentMethod: string): Promise<PaymentResult> {
    console.log(`Processing payment of $${order.getTotal()} using ${paymentMethod}`);
    // Ödeme işleme mantığı
    return { success: true, transactionId: 'txn_123' };
  }
}

// Envanter yönetim servisi
interface IInventoryManager {
  updateInventory(order: Order): Promise<boolean>;
  checkAvailability(items: OrderItem[]): Promise<boolean>;
}

class InventoryManager implements IInventoryManager {
  async updateInventory(order: Order): Promise<boolean> {
    console.log('Updating inventory for order items...');
    // Envanter güncelleme mantığı
    return true;
  }

  async checkAvailability(items: OrderItem[]): Promise<boolean> {
    console.log('Checking item availability...');
    // Mevcutluk kontrol mantığı
    return true;
  }
}

// Kargo servisi
interface IShippingService {
  shipOrder(order: Order): Promise<ShippingResult>;
  trackOrder(trackingNumber: string): Promise<string>;
}

class ShippingService implements IShippingService {
  async shipOrder(order: Order): Promise<ShippingResult> {
    console.log('Shipping order...');
    // Kargo mantığı
    return { success: true, trackingNumber: 'TRK_456' };
  }

  async trackOrder(trackingNumber: string): Promise<string> {
    console.log(`Tracking order: ${trackingNumber}`);
    // Takip mantığı
    return 'In transit';
  }
}

// Sipariş bildirim servisi
interface IOrderNotificationService {
  sendConfirmationEmail(order: Order): Promise<boolean>;
  sendShippingNotification(order: Order, trackingNumber: string): Promise<boolean>;
}

class OrderNotificationService implements IOrderNotificationService {
  async sendConfirmationEmail(order: Order): Promise<boolean> {
    console.log('Sending order confirmation email...');
    // Email gönderme mantığı
    return true;
  }

  async sendShippingNotification(order: Order, trackingNumber: string): Promise<boolean> {
    console.log(`Sending shipping notification with tracking: ${trackingNumber}`);
    // Email gönderme mantığı
    return true;
  }
}

// Tüm servisleri orkestre eden sipariş işleme servisi
class OrderProcessingService {
  constructor(
    private paymentProcessor: IPaymentProcessor,
    private inventoryManager: IInventoryManager,
    private shippingService: IShippingService,
    private notificationService: IOrderNotificationService
  ) {}

  async processOrder(order: Order, paymentMethod: string): Promise<boolean> {
    try {
      // Ödeme işleme
      const paymentResult = await this.paymentProcessor.processPayment(order, paymentMethod);
      if (!paymentResult.success) {
        return false;
      }
      order.updateStatus('paid');

      // Envanter güncelleme
      await this.inventoryManager.updateInventory(order);

      // Sipariş kargo
      const shippingResult = await this.shippingService.shipOrder(order);
      if (shippingResult.success) {
        order.updateStatus('shipped');
      }

      // Bildirim gönderme
      await this.notificationService.sendConfirmationEmail(order);
      if (shippingResult.trackingNumber) {
        await this.notificationService.sendShippingNotification(order, shippingResult.trackingNumber);
      }

      return true;
    } catch (error) {
      console.error('Order processing failed:', error);
      return false;
    }
  }
}

// Düzeltilmiş versiyonun kullanımı
async function demonstrateOrderProcessing(): Promise<void> {
  const items: OrderItem[] = [
    { id: 'item1', name: 'Product 1', price: 49.99, quantity: 1 },
    { id: 'item2', name: 'Product 2', price: 29.99, quantity: 2 },
  ];

  const order = new Order('ORD_001', 'CUST_123', items, 109.97);

  // Servis örnekleri oluşturma
  const paymentProcessor = new PaymentProcessor();
  const inventoryManager = new InventoryManager();
  const shippingService = new ShippingService();
  const notificationService = new OrderNotificationService();

  // Dependency injection ile sipariş işleme servisi oluşturma
  const orderProcessingService = new OrderProcessingService(paymentProcessor, inventoryManager, shippingService, notificationService);

  // Servis aracılığıyla sipariş işleme
  const success = await orderProcessingService.processOrder(order, 'credit_card');
  console.log(`Order processing ${success ? 'succeeded' : 'failed'}`);
}

// ===========================================
// SRP'yi Takip Etmenin Faydaları
// ===========================================

/*
1. Anlaşılması daha kolay: Her sınıfın net, tek bir amacı var
2. Test edilmesi daha kolay: Her sorumluluğu izole olarak test edebilirsiniz
3. Bakımı daha kolay: Bir sorumluluktaki değişiklikler diğerlerini etkilemez
4. Yeniden kullanılması daha kolay: Bireysel sınıflar farklı bağlamlarda yeniden kullanılabilir
5. Azaltılmış bağlantı: Sınıflar birbirine daha az bağımlı
6. Daha iyi organizasyon: Kod daha organize ve gezinmesi daha kolay
*/
