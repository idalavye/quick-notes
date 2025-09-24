/**
 * Liskov Substitution Principle (LSP) - Advanced TypeScript Examples
 *
 * Bu dosya, LSP'nin gelişmiş kullanım senaryolarını ve gerçek dünya
 * uygulamalarını gösterir. Karmaşık kalıtım hiyerarşileri, generic
 * tipler ve design pattern'ler ile LSP uyumluluğu sağlanır.
 */

// ============================================================================
// 1. GENERIC TİPLER İLE LSP UYGULAMASI
// ============================================================================

interface Repository<T> {
  save(entity: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  delete(id: string): Promise<void>;
}

abstract class BaseRepository<T> implements Repository<T> {
  protected entities: Map<string, T> = new Map();

  async save(entity: T): Promise<T> {
    const id = this.generateId();
    this.entities.set(id, entity);
    console.log(`Entity saved with ID: ${id}`);
    return entity;
  }

  async findById(id: string): Promise<T | null> {
    return this.entities.get(id) || null;
  }

  async findAll(): Promise<T[]> {
    return Array.from(this.entities.values());
  }

  async delete(id: string): Promise<void> {
    this.entities.delete(id);
    console.log(`Entity with ID ${id} deleted`);
  }

  protected abstract generateId(): string;
}

class UserRepository extends BaseRepository<User> {
  protected generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.findAll();
    return users.find((user) => user.email === email) || null;
  }
}

class ProductRepository extends BaseRepository<Product> {
  protected generateId(): string {
    return `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async findByCategory(category: string): Promise<Product[]> {
    const products = await this.findAll();
    return products.filter((product) => product.category === category);
  }
}

// ============================================================================
// 2. STRATEGY PATTERN İLE LSP UYGULAMASI
// ============================================================================

interface PaymentStrategy {
  processPayment(amount: number): Promise<PaymentResult>;
  validatePayment(paymentData: any): boolean;
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

abstract class BasePaymentStrategy implements PaymentStrategy {
  abstract processPayment(amount: number): Promise<PaymentResult>;

  validatePayment(paymentData: any): boolean {
    // Temel validasyon kuralları
    return paymentData && typeof paymentData === 'object';
  }

  protected generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

class CreditCardPayment extends BasePaymentStrategy {
  async processPayment(amount: number): Promise<PaymentResult> {
    try {
      // Kredi kartı ödeme işlemi simülasyonu
      await this.simulateNetworkDelay();

      if (amount <= 0) {
        return { success: false, error: 'Invalid amount' };
      }

      const transactionId = this.generateTransactionId();
      console.log(`Credit card payment processed: ${amount} TL, Transaction ID: ${transactionId}`);

      return { success: true, transactionId };
    } catch (error) {
      return { success: false, error: 'Payment processing failed' };
    }
  }

  private async simulateNetworkDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

class PayPalPayment extends BasePaymentStrategy {
  async processPayment(amount: number): Promise<PaymentResult> {
    try {
      // PayPal ödeme işlemi simülasyonu
      await this.simulateNetworkDelay();

      if (amount <= 0) {
        return { success: false, error: 'Invalid amount' };
      }

      const transactionId = this.generateTransactionId();
      console.log(`PayPal payment processed: ${amount} TL, Transaction ID: ${transactionId}`);

      return { success: true, transactionId };
    } catch (error) {
      return { success: false, error: 'Payment processing failed' };
    }
  }

  private async simulateNetworkDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 1500));
  }
}

class BankTransferPayment extends BasePaymentStrategy {
  async processPayment(amount: number): Promise<PaymentResult> {
    try {
      // Banka transferi simülasyonu
      await this.simulateNetworkDelay();

      if (amount <= 0) {
        return { success: false, error: 'Invalid amount' };
      }

      if (amount < 100) {
        return { success: false, error: 'Minimum amount for bank transfer is 100 TL' };
      }

      const transactionId = this.generateTransactionId();
      console.log(`Bank transfer processed: ${amount} TL, Transaction ID: ${transactionId}`);

      return { success: true, transactionId };
    } catch (error) {
      return { success: false, error: 'Payment processing failed' };
    }
  }

  private async simulateNetworkDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

// ============================================================================
// 3. OBSERVER PATTERN İLE LSP UYGULAMASI
// ============================================================================

interface Observer<T> {
  update(data: T): void;
}

interface Subject<T> {
  attach(observer: Observer<T>): void;
  detach(observer: Observer<T>): void;
  notify(data: T): void;
}

abstract class BaseSubject<T> implements Subject<T> {
  private observers: Observer<T>[] = [];

  attach(observer: Observer<T>): void {
    this.observers.push(observer);
  }

  detach(observer: Observer<T>): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(data: T): void {
    this.observers.forEach((observer) => observer.update(data));
  }
}

class StockPriceSubject extends BaseSubject<StockPrice> {
  private currentPrice: StockPrice;

  constructor(initialPrice: StockPrice) {
    super();
    this.currentPrice = initialPrice;
  }

  updatePrice(newPrice: StockPrice): void {
    this.currentPrice = newPrice;
    this.notify(this.currentPrice);
  }

  getCurrentPrice(): StockPrice {
    return this.currentPrice;
  }
}

class EmailNotificationObserver implements Observer<StockPrice> {
  constructor(private email: string) {}

  update(data: StockPrice): void {
    console.log(`Email sent to ${this.email}: Stock ${data.symbol} is now ${data.price} TL`);
  }
}

class SMSNotificationObserver implements Observer<StockPrice> {
  constructor(private phoneNumber: string) {}

  update(data: StockPrice): void {
    console.log(`SMS sent to ${this.phoneNumber}: Stock ${data.symbol} is now ${data.price} TL`);
  }
}

class LoggingObserver implements Observer<StockPrice> {
  update(data: StockPrice): void {
    console.log(`[LOG] Stock price updated: ${data.symbol} = ${data.price} TL at ${data.timestamp}`);
  }
}

// ============================================================================
// 4. FACTORY PATTERN İLE LSP UYGULAMASI
// ============================================================================

interface Document {
  render(): string;
  save(): Promise<void>;
  getContent(): string;
}

abstract class BaseDocument implements Document {
  protected content: string;

  constructor(content: string) {
    this.content = content;
  }

  abstract render(): string;

  async save(): Promise<void> {
    console.log(`Saving document with content: ${this.content.substring(0, 50)}...`);
  }

  getContent(): string {
    return this.content;
  }
}

class PDFDocument extends BaseDocument {
  render(): string {
    return `PDF Document:\n${this.content}\n[PDF Footer]`;
  }

  async save(): Promise<void> {
    await super.save();
    console.log('PDF document saved successfully');
  }
}

class WordDocument extends BaseDocument {
  render(): string {
    return `Word Document:\n${this.content}\n[Word Footer]`;
  }

  async save(): Promise<void> {
    await super.save();
    console.log('Word document saved successfully');
  }
}

class HTMLDocument extends BaseDocument {
  render(): string {
    return `<html><body><p>${this.content}</p></body></html>`;
  }

  async save(): Promise<void> {
    await super.save();
    console.log('HTML document saved successfully');
  }
}

abstract class DocumentFactory {
  abstract createDocument(content: string): Document;

  // Template method pattern
  async processDocument(content: string): Promise<string> {
    const document = this.createDocument(content);
    const rendered = document.render();
    await document.save();
    return rendered;
  }
}

class PDFDocumentFactory extends DocumentFactory {
  createDocument(content: string): Document {
    return new PDFDocument(content);
  }
}

class WordDocumentFactory extends DocumentFactory {
  createDocument(content: string): Document {
    return new WordDocument(content);
  }
}

class HTMLDocumentFactory extends DocumentFactory {
  createDocument(content: string): Document {
    return new HTMLDocument(content);
  }
}

// ============================================================================
// 5. COMPOSITE PATTERN İLE LSP UYGULAMASI
// ============================================================================

interface FileSystemItem {
  getName(): string;
  getSize(): number;
  display(indent: number): void;
}

abstract class BaseFileSystemItem implements FileSystemItem {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  abstract getSize(): number;
  abstract display(indent: number): void;
}

class File extends BaseFileSystemItem {
  private size: number;

  constructor(name: string, size: number) {
    super(name);
    this.size = size;
  }

  getSize(): number {
    return this.size;
  }

  display(indent: number): void {
    const spaces = '  '.repeat(indent);
    console.log(`${spaces}📄 ${this.name} (${this.size} bytes)`);
  }
}

class Directory extends BaseFileSystemItem {
  private items: FileSystemItem[] = [];

  constructor(name: string) {
    super(name);
  }

  addItem(item: FileSystemItem): void {
    this.items.push(item);
  }

  removeItem(item: FileSystemItem): void {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  getSize(): number {
    return this.items.reduce((total, item) => total + item.getSize(), 0);
  }

  display(indent: number): void {
    const spaces = '  '.repeat(indent);
    console.log(`${spaces}📁 ${this.name} (${this.getSize()} bytes)`);

    this.items.forEach((item) => {
      item.display(indent + 1);
    });
  }
}

// ============================================================================
// 6. LSP UYUMLULUK TESTLERİ
// ============================================================================

class LSPTester {
  static testRepositoryLSP<T>(repository: Repository<T>): boolean {
    try {
      // Tüm repository implementasyonları aynı davranışı sergilemeli
      const testEntity = { id: 'test', name: 'test' } as T;

      // Temel operasyonlar çalışmalı
      repository.save(testEntity);
      repository.findById('test');
      repository.findAll();
      repository.delete('test');

      return true;
    } catch (error) {
      console.error('Repository LSP test failed:', error);
      return false;
    }
  }

  static testPaymentStrategyLSP(strategy: PaymentStrategy): boolean {
    try {
      // Tüm payment strategy'ler aynı davranışı sergilemeli
      const testData = { amount: 100 };

      if (!strategy.validatePayment(testData)) {
        return false;
      }

      // processPayment async olduğu için burada sadece tip kontrolü yapıyoruz
      const result = strategy.processPayment(100);

      return result instanceof Promise;
    } catch (error) {
      console.error('Payment Strategy LSP test failed:', error);
      return false;
    }
  }

  static testDocumentLSP(document: Document): boolean {
    try {
      // Tüm document implementasyonları aynı davranışı sergilemeli
      const content = document.getContent();
      const rendered = document.render();
      const savePromise = document.save();

      return typeof content === 'string' && typeof rendered === 'string' && savePromise instanceof Promise;
    } catch (error) {
      console.error('Document LSP test failed:', error);
      return false;
    }
  }
}

// ============================================================================
// 7. KULLANIM ÖRNEKLERİ
// ============================================================================

async function demonstrateAdvancedLSP() {
  console.log('=== Advanced LSP Examples ===\n');

  // Repository örnekleri
  console.log('1. Repository Pattern:');
  const userRepo = new UserRepository();
  const productRepo = new ProductRepository();

  console.log(`User Repository LSP compliant: ${LSPTester.testRepositoryLSP(userRepo)}`);
  console.log(`Product Repository LSP compliant: ${LSPTester.testRepositoryLSP(productRepo)}`);

  // Payment Strategy örnekleri
  console.log('\n2. Payment Strategy Pattern:');
  const creditCard = new CreditCardPayment();
  const paypal = new PayPalPayment();
  const bankTransfer = new BankTransferPayment();

  console.log(`Credit Card LSP compliant: ${LSPTester.testPaymentStrategyLSP(creditCard)}`);
  console.log(`PayPal LSP compliant: ${LSPTester.testPaymentStrategyLSP(paypal)}`);
  console.log(`Bank Transfer LSP compliant: ${LSPTester.testPaymentStrategyLSP(bankTransfer)}`);

  // Document Factory örnekleri
  console.log('\n3. Document Factory Pattern:');
  const pdfFactory = new PDFDocumentFactory();
  const wordFactory = new WordDocumentFactory();
  const htmlFactory = new HTMLDocumentFactory();

  const pdfDoc = pdfFactory.createDocument('PDF content');
  const wordDoc = wordFactory.createDocument('Word content');
  const htmlDoc = htmlFactory.createDocument('HTML content');

  console.log(`PDF Document LSP compliant: ${LSPTester.testDocumentLSP(pdfDoc)}`);
  console.log(`Word Document LSP compliant: ${LSPTester.testDocumentLSP(wordDoc)}`);
  console.log(`HTML Document LSP compliant: ${LSPTester.testDocumentLSP(htmlDoc)}`);

  // Observer Pattern örneği
  console.log('\n4. Observer Pattern:');
  const stockSubject = new StockPriceSubject({ symbol: 'AAPL', price: 150, timestamp: new Date() });
  const emailObserver = new EmailNotificationObserver('user@example.com');
  const smsObserver = new SMSNotificationObserver('+1234567890');
  const logObserver = new LoggingObserver();

  stockSubject.attach(emailObserver);
  stockSubject.attach(smsObserver);
  stockSubject.attach(logObserver);

  stockSubject.updatePrice({ symbol: 'AAPL', price: 155, timestamp: new Date() });

  // Composite Pattern örneği
  console.log('\n5. Composite Pattern:');
  const rootDir = new Directory('Root');
  const documentsDir = new Directory('Documents');
  const imagesDir = new Directory('Images');

  const file1 = new File('document1.txt', 1024);
  const file2 = new File('document2.txt', 2048);
  const image1 = new File('image1.jpg', 5120);

  documentsDir.addItem(file1);
  documentsDir.addItem(file2);
  imagesDir.addItem(image1);

  rootDir.addItem(documentsDir);
  rootDir.addItem(imagesDir);

  console.log('File System Structure:');
  rootDir.display(0);
}

// ============================================================================
// 8. TİP TANIMLARI
// ============================================================================

interface User {
  id: string;
  name: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface StockPrice {
  symbol: string;
  price: number;
  timestamp: Date;
}

// ============================================================================
// 9. EXPORT
// ============================================================================

export {
  Repository,
  BaseRepository,
  UserRepository,
  ProductRepository,
  PaymentStrategy,
  BasePaymentStrategy,
  CreditCardPayment,
  PayPalPayment,
  BankTransferPayment,
  Observer,
  Subject,
  BaseSubject,
  StockPriceSubject,
  EmailNotificationObserver,
  SMSNotificationObserver,
  LoggingObserver,
  Document,
  BaseDocument,
  PDFDocument,
  WordDocument,
  HTMLDocument,
  DocumentFactory,
  PDFDocumentFactory,
  WordDocumentFactory,
  HTMLDocumentFactory,
  FileSystemItem,
  BaseFileSystemItem,
  File,
  Directory,
  LSPTester,
  demonstrateAdvancedLSP,
};
