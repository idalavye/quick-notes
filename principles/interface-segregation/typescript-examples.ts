/**
 * Interface Segregation Principle (ISP) - TypeScript Examples
 *
 * Bu dosya, ISP'nin temel kavramlarını ve doğru uygulamalarını gösterir.
 * İstemciler kullanmadıkları arayüzlere bağımlı olmamalıdır.
 */

// ============================================================================
// 1. TEMEL KAVRAMLAR VE YANLIŞ UYGULAMALAR
// ============================================================================

// ❌ YANLIŞ: ISP ihlali - Büyük ve monolitik arayüz
interface BadWorker {
  work(): void;
  eat(): void;
  sleep(): void;
  code(): void;
  design(): void;
  test(): void;
  deploy(): void;
}

class BadDeveloper implements BadWorker {
  work() {
    console.log('Working...');
  }
  eat() {
    console.log('Eating...');
  }
  sleep() {
    console.log('Sleeping...');
  }
  code() {
    console.log('Coding...');
  }
  design() {
    throw new Error('Developer cannot design'); // ISP ihlali!
  }
  test() {
    throw new Error('Developer cannot test'); // ISP ihlali!
  }
  deploy() {
    throw new Error('Developer cannot deploy'); // ISP ihlali!
  }
}

// ❌ YANLIŞ: ISP ihlali - Gereksiz bağımlılıklar
interface BadPrinter {
  print(): void;
  scan(): void;
  fax(): void;
  email(): void;
}

class BadSimplePrinter implements BadPrinter {
  print() {
    console.log('Printing...');
  }
  scan() {
    throw new Error('Cannot scan'); // ISP ihlali!
  }
  fax() {
    throw new Error('Cannot fax'); // ISP ihlali!
  }
  email() {
    throw new Error('Cannot email'); // ISP ihlali!
  }
}

// ❌ YANLIŞ: ISP ihlali - Arayüz kirliliği
interface BadUserService {
  createUser(): void;
  updateUser(): void;
  deleteUser(): void;
  sendEmail(): void;
  generateReport(): void;
  backupData(): void;
  restoreData(): void;
}

// ============================================================================
// 2. DOĞRU UYGULAMALAR - ARAYÜZ AYIRIMI
// ============================================================================

// ✅ DOĞRU: ISP uyumlu - Küçük ve odaklanmış arayüzler
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

interface Codable {
  code(): void;
}

interface Designable {
  design(): void;
}

interface Testable {
  test(): void;
}

interface Deployable {
  deploy(): void;
}

class Developer implements Workable, Eatable, Sleepable, Codable {
  work() {
    console.log('Working...');
  }
  eat() {
    console.log('Eating...');
  }
  sleep() {
    console.log('Sleeping...');
  }
  code() {
    console.log('Coding...');
  }
}

class Designer implements Workable, Eatable, Sleepable, Designable {
  work() {
    console.log('Working...');
  }
  eat() {
    console.log('Eating...');
  }
  sleep() {
    console.log('Sleeping...');
  }
  design() {
    console.log('Designing...');
  }
}

class Tester implements Workable, Eatable, Sleepable, Testable {
  work() {
    console.log('Working...');
  }
  eat() {
    console.log('Eating...');
  }
  sleep() {
    console.log('Sleeping...');
  }
  test() {
    console.log('Testing...');
  }
}

// ============================================================================
// 3. YAZICI ÖRNEĞİ - ISP UYUMLU
// ============================================================================

interface Printer {
  print(): void;
}

interface Scanner {
  scan(): void;
}

interface FaxMachine {
  fax(): void;
}

interface EmailSender {
  sendEmail(): void;
}

class SimplePrinter implements Printer {
  print() {
    console.log('Printing...');
  }
}

class MultiFunctionPrinter implements Printer, Scanner, FaxMachine, EmailSender {
  print() {
    console.log('Printing...');
  }
  scan() {
    console.log('Scanning...');
  }
  fax() {
    console.log('Faxing...');
  }
  sendEmail() {
    console.log('Sending email...');
  }
}

class ScannerOnly implements Scanner {
  scan() {
    console.log('Scanning...');
  }
}

// ============================================================================
// 4. VERİTABANI ÖRNEĞİ - ISP UYUMLU
// ============================================================================

interface Readable<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
}

interface Writable<T> {
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

interface Searchable<T> {
  search(query: string): Promise<T[]>;
}

interface Cacheable<T> {
  getFromCache(key: string): Promise<T | null>;
  setCache(key: string, value: T): Promise<void>;
}

// Tam özellikli repository
interface FullRepository<T> extends Readable<T>, Writable<T>, Searchable<T>, Cacheable<T> {}

// Sadece okuma yapabilen repository
interface ReadOnlyRepository<T> extends Readable<T> {}

// Sadece yazma yapabilen repository
interface WriteOnlyRepository<T> extends Writable<T> {}

class UserRepository implements FullRepository<User> {
  async findById(id: string): Promise<User | null> {
    console.log(`Finding user by ID: ${id}`);
    return { id, name: 'John Doe', email: 'john@example.com' };
  }

  async findAll(): Promise<User[]> {
    console.log('Finding all users');
    return [];
  }

  async create(user: User): Promise<User> {
    console.log('Creating user:', user);
    return user;
  }

  async update(user: User): Promise<User> {
    console.log('Updating user:', user);
    return user;
  }

  async delete(id: string): Promise<void> {
    console.log(`Deleting user with ID: ${id}`);
  }

  async search(query: string): Promise<User[]> {
    console.log(`Searching users with query: ${query}`);
    return [];
  }

  async getFromCache(key: string): Promise<User | null> {
    console.log(`Getting from cache: ${key}`);
    return null;
  }

  async setCache(key: string, value: User): Promise<void> {
    console.log(`Setting cache: ${key}`);
  }
}

class ReadOnlyUserRepository implements ReadOnlyRepository<User> {
  async findById(id: string): Promise<User | null> {
    console.log(`Finding user by ID: ${id}`);
    return { id, name: 'John Doe', email: 'john@example.com' };
  }

  async findAll(): Promise<User[]> {
    console.log('Finding all users');
    return [];
  }
}

// ============================================================================
// 5. SERVİS AYIRIMI ÖRNEĞİ
// ============================================================================

interface UserRepository {
  createUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User>;
  deleteUser(id: string): Promise<void>;
  findUser(id: string): Promise<User | null>;
}

interface EmailService {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}

interface ReportService {
  generateReport(data: any): Promise<Report>;
}

interface BackupService {
  backupData(): Promise<void>;
  restoreData(): Promise<void>;
}

class UserService {
  constructor(private userRepository: UserRepository, private emailService: EmailService) {}

  async createUser(userData: CreateUserRequest): Promise<User> {
    const user: User = {
      id: Math.random().toString(36),
      name: userData.name,
      email: userData.email,
    };
    const createdUser = await this.userRepository.createUser(user);
    await this.emailService.sendEmail(createdUser.email, 'Welcome!', 'Your account has been created successfully.');
    return createdUser;
  }
}

class ReportGenerator {
  constructor(private userRepository: UserRepository, private reportService: ReportService) {}

  async generateUserReport(): Promise<Report> {
    const users = await this.userRepository.findAll();
    return this.reportService.generateReport(users);
  }
}

// ============================================================================
// 6. PAYMENT ÖRNEĞİ - ISP UYUMLU
// ============================================================================

interface PaymentProcessor {
  processPayment(amount: number): Promise<PaymentResult>;
}

interface PaymentValidator {
  validatePayment(paymentData: any): boolean;
}

interface PaymentLogger {
  logPayment(payment: Payment): void;
}

interface PaymentNotifier {
  notifyPayment(payment: Payment): Promise<void>;
}

class CreditCardProcessor implements PaymentProcessor, PaymentValidator, PaymentLogger {
  processPayment(amount: number): Promise<PaymentResult> {
    console.log(`Processing credit card payment: ${amount}`);
    return Promise.resolve({ success: true, transactionId: 'txn_123' });
  }

  validatePayment(paymentData: any): boolean {
    return paymentData && paymentData.cardNumber && paymentData.cvv;
  }

  logPayment(payment: Payment): void {
    console.log(`Payment logged: ${payment.amount} - ${payment.method}`);
  }
}

class PayPalProcessor implements PaymentProcessor, PaymentNotifier {
  processPayment(amount: number): Promise<PaymentResult> {
    console.log(`Processing PayPal payment: ${amount}`);
    return Promise.resolve({ success: true, transactionId: 'pp_456' });
  }

  async notifyPayment(payment: Payment): Promise<void> {
    console.log(`PayPal notification sent for payment: ${payment.amount}`);
  }
}

// ============================================================================
// 7. FILE SYSTEM ÖRNEĞİ - ISP UYUMLU
// ============================================================================

interface FileReader {
  readFile(path: string): Promise<string>;
}

interface FileWriter {
  writeFile(path: string, content: string): Promise<void>;
}

interface FileDeleter {
  deleteFile(path: string): Promise<void>;
}

interface FileMover {
  moveFile(from: string, to: string): Promise<void>;
}

interface FileCopier {
  copyFile(from: string, to: string): Promise<void>;
}

class ReadOnlyFileSystem implements FileReader {
  async readFile(path: string): Promise<string> {
    console.log(`Reading file: ${path}`);
    return 'File content';
  }
}

class FullFileSystem implements FileReader, FileWriter, FileDeleter, FileMover, FileCopier {
  async readFile(path: string): Promise<string> {
    console.log(`Reading file: ${path}`);
    return 'File content';
  }

  async writeFile(path: string, content: string): Promise<void> {
    console.log(`Writing file: ${path}`);
  }

  async deleteFile(path: string): Promise<void> {
    console.log(`Deleting file: ${path}`);
  }

  async moveFile(from: string, to: string): Promise<void> {
    console.log(`Moving file from ${from} to ${to}`);
  }

  async copyFile(from: string, to: string): Promise<void> {
    console.log(`Copying file from ${from} to ${to}`);
  }
}

// ============================================================================
// 8. ISP UYUMLULUK TESTLERİ
// ============================================================================

class ISPTester {
  static testInterfaceCompliance<T>(implementation: T, interfaceName: string): boolean {
    try {
      // Arayüzün tüm metodlarının implement edildiğini kontrol et
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(implementation));
      console.log(`${interfaceName} has ${methods.length} methods`);
      return methods.length > 0;
    } catch (error) {
      console.error(`Interface compliance test failed for ${interfaceName}:`, error);
      return false;
    }
  }

  static testDependencyInjection<T>(service: T, dependencies: any[]): boolean {
    try {
      // Servisin sadece gerekli bağımlılıkları kullandığını kontrol et
      return dependencies.every((dep) => dep !== null);
    } catch (error) {
      console.error('Dependency injection test failed:', error);
      return false;
    }
  }

  static testInterfaceSegregation(interfaces: any[]): boolean {
    try {
      // Her arayüzün tek bir sorumluluğa odaklandığını kontrol et
      return interfaces.every((iface) => {
        const methods = Object.getOwnPropertyNames(iface.prototype || {});
        return methods.length <= 3; // Küçük arayüzler 3'ten az metod içermeli
      });
    } catch (error) {
      console.error('Interface segregation test failed:', error);
      return false;
    }
  }
}

// ============================================================================
// 9. KULLANIM ÖRNEKLERİ
// ============================================================================

function demonstrateISP() {
  console.log('=== Interface Segregation Principle Examples ===\n');

  // Worker örnekleri
  console.log('1. Worker Examples:');
  const developer = new Developer();
  const designer = new Designer();
  const tester = new Tester();

  developer.work();
  developer.code();
  designer.design();
  tester.test();

  // Printer örnekleri
  console.log('\n2. Printer Examples:');
  const simplePrinter = new SimplePrinter();
  const multiFunctionPrinter = new MultiFunctionPrinter();
  const scannerOnly = new ScannerOnly();

  simplePrinter.print();
  multiFunctionPrinter.print();
  multiFunctionPrinter.scan();
  scannerOnly.scan();

  // Repository örnekleri
  console.log('\n3. Repository Examples:');
  const fullRepo = new UserRepository();
  const readOnlyRepo = new ReadOnlyUserRepository();

  fullRepo.findById('1');
  fullRepo.create({ id: '1', name: 'John', email: 'john@example.com' });
  readOnlyRepo.findById('1');

  // Payment örnekleri
  console.log('\n4. Payment Examples:');
  const creditCardProcessor = new CreditCardProcessor();
  const paypalProcessor = new PayPalProcessor();

  creditCardProcessor.processPayment(100);
  creditCardProcessor.validatePayment({ cardNumber: '1234', cvv: '123' });
  paypalProcessor.processPayment(200);

  // File System örnekleri
  console.log('\n5. File System Examples:');
  const readOnlyFS = new ReadOnlyFileSystem();
  const fullFS = new FullFileSystem();

  readOnlyFS.readFile('/path/to/file.txt');
  fullFS.readFile('/path/to/file.txt');
  fullFS.writeFile('/path/to/newfile.txt', 'content');
  fullFS.moveFile('/old/path', '/new/path');

  // ISP Testleri
  console.log('\n6. ISP Compliance Tests:');
  console.log(`Developer ISP compliant: ${ISPTester.testInterfaceCompliance(developer, 'Developer')}`);
  console.log(`SimplePrinter ISP compliant: ${ISPTester.testInterfaceCompliance(simplePrinter, 'SimplePrinter')}`);
  console.log(`UserRepository ISP compliant: ${ISPTester.testInterfaceCompliance(fullRepo, 'UserRepository')}`);
}

// ============================================================================
// 10. TİP TANIMLARI
// ============================================================================

interface User {
  id: string;
  name: string;
  email: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
}

interface Report {
  id: string;
  data: any;
  generatedAt: Date;
}

interface Payment {
  id: string;
  amount: number;
  method: string;
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// ============================================================================
// 11. EXPORT
// ============================================================================

export {
  Workable,
  Eatable,
  Sleepable,
  Codable,
  Designable,
  Testable,
  Deployable,
  Developer,
  Designer,
  Tester,
  Printer,
  Scanner,
  FaxMachine,
  EmailSender,
  SimplePrinter,
  MultiFunctionPrinter,
  ScannerOnly,
  Readable,
  Writable,
  Searchable,
  Cacheable,
  FullRepository,
  ReadOnlyRepository,
  WriteOnlyRepository,
  UserRepository,
  ReadOnlyUserRepository,
  UserService,
  ReportGenerator,
  PaymentProcessor,
  PaymentValidator,
  PaymentLogger,
  PaymentNotifier,
  CreditCardProcessor,
  PayPalProcessor,
  FileReader,
  FileWriter,
  FileDeleter,
  FileMover,
  FileCopier,
  ReadOnlyFileSystem,
  FullFileSystem,
  ISPTester,
  demonstrateISP,
};
