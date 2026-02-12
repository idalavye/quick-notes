---
title: Interface Segregation Principle
parent: SOLID Principles
nav_order: 3
---

# Interface Segregation Principle (ISP)

**Arayüz Ayrım Prensibi**: İstemciler kullanmadıkları arayüzlere bağımlı olmamalıdır.

## Temel Kavramlar

### Tanım

Robert C. Martin tarafından tanımlanan bu prensip, büyük ve monolitik arayüzlerin yerine küçük, odaklanmış ve özelleşmiş arayüzlerin kullanılmasını önerir. Bu sayede istemciler sadece ihtiyaç duydukları metodlara bağımlı olur.

### Ana Kurallar

1. **Küçük Arayüzler**: Her arayüz tek bir sorumluluğa odaklanmalı
2. **İstemci Odaklı**: Arayüzler istemcilerin ihtiyaçlarına göre tasarlanmalı
3. **Bağımlılık Azaltma**: İstemciler kullanmadıkları metodlara bağımlı olmamalı
4. **Esneklik**: Yeni özellikler mevcut arayüzleri bozmadan eklenebilmeli

## Yaygın İhlaller

### 1. Büyük ve Monolitik Arayüzler

```typescript
// ❌ Yanlış - ISP ihlali
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
  code(): void;
  design(): void;
  test(): void;
  deploy(): void;
}

class Developer implements Worker {
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
    throw new Error('Developer cannot design');
  } // ISP ihlali!
  test() {
    throw new Error('Developer cannot test');
  } // ISP ihlali!
  deploy() {
    throw new Error('Developer cannot deploy');
  } // ISP ihlali!
}
```

### 2. Gereksiz Bağımlılıklar

```typescript
// ❌ Yanlış - ISP ihlali
interface Printer {
  print(): void;
  scan(): void;
  fax(): void;
  email(): void;
}

class SimplePrinter implements Printer {
  print() {
    console.log('Printing...');
  }
  scan() {
    throw new Error('Cannot scan');
  } // ISP ihlali!
  fax() {
    throw new Error('Cannot fax');
  } // ISP ihlali!
  email() {
    throw new Error('Cannot email');
  } // ISP ihlali!
}
```

### 3. Arayüz Kirliliği

```typescript
// ❌ Yanlış - ISP ihlali
interface UserService {
  createUser(): void;
  updateUser(): void;
  deleteUser(): void;
  sendEmail(): void;
  generateReport(): void;
  backupData(): void;
  restoreData(): void;
}
```

## Doğru Uygulama Örnekleri

### 1. Arayüz Ayrımı ile Çözüm

```typescript
// ✅ Doğru - ISP uyumlu
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
```

### 2. Fonksiyonel Arayüzler

```typescript
// ✅ Doğru - ISP uyumlu
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
```

### 3. Servis Ayrımı

```typescript
// ✅ Doğru - ISP uyumlu
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
```

## Faydaları

### 1. Bağımlılık Azaltma

- İstemciler sadece ihtiyaç duydukları metodlara bağımlı olur
- Gereksiz bağımlılıklar ortadan kalkar
- Kod daha temiz ve anlaşılır hale gelir

### 2. Esneklik ve Genişletilebilirlik

- Yeni özellikler mevcut arayüzleri bozmadan eklenebilir
- Farklı kombinasyonlar kolayca oluşturulabilir
- Mevcut kod değiştirilmeden yeni işlevsellik eklenebilir

### 3. Test Edilebilirlik

- Küçük arayüzler daha kolay mock'lanabilir
- Unit testler daha odaklanmış olur
- Test coverage daha kolay sağlanır

### 4. Bakım Kolaylığı

- Değişiklikler daha lokalize olur
- Hata ayıklama daha kolay hale gelir
- Kod sürdürülebilirliği artar

## Pratik İpuçları

### 1. "IS-A" vs "HAS-A" İlişkilerini Kontrol Edin

```typescript
// Soru: Printer IS-A Scanner mı?
// Cevap: Hayır, Printer HAS-A Scanner olabilir

interface Printer {
  print(): void;
}

interface Scanner {
  scan(): void;
}

class MultiFunctionDevice implements Printer, Scanner {
  print() {
    /* ... */
  }
  scan() {
    /* ... */
  }
}
```

### 2. Arayüz Boyutunu Kontrol Edin

```typescript
// Eğer bir arayüzde 5'ten fazla metod varsa, ayrılmaya ihtiyaç olabilir
interface LargeInterface {
  method1(): void;
  method2(): void;
  method3(): void;
  method4(): void;
  method5(): void;
  method6(): void; // Bu arayüz çok büyük!
}
```

### 3. İstemci İhtiyaçlarını Analiz Edin

```typescript
// Farklı istemciler farklı arayüzler kullanmalı
interface ReadOnlyRepository {
  findById(id: string): Promise<Entity | null>;
  findAll(): Promise<Entity[]>;
}

interface WriteOnlyRepository {
  save(entity: Entity): Promise<Entity>;
  delete(id: string): Promise<void>;
}

interface FullRepository extends ReadOnlyRepository, WriteOnlyRepository {}
```

## Test Stratejileri

### 1. Arayüz Uyumluluk Testleri

```typescript
function testInterfaceCompliance<T>(implementation: T, interfaceName: string): boolean {
  // Arayüzün tüm metodlarının implement edildiğini kontrol et
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(implementation));
  return methods.length > 0;
}
```

### 2. Bağımlılık Enjeksiyon Testleri

```typescript
function testDependencyInjection<T>(service: T, dependencies: any[]): boolean {
  // Servisin sadece gerekli bağımlılıkları kullandığını kontrol et
  return dependencies.every((dep) => dep !== null);
}
```

## İlişkili Prensipler

- **Single Responsibility**: Her arayüz tek bir sorumluluğa odaklanmalı
- **Open/Closed**: Arayüzler genişletmeye açık, değişikliğe kapalı olmalı
- **Liskov Substitution**: Alt sınıflar üst sınıfların yerine kullanılabilmeli
- **Dependency Inversion**: Soyutlamalara bağımlı olunmalı

## Yaygın Desenler

### 1. Adapter Pattern

```typescript
interface OldInterface {
  oldMethod(): void;
}

interface NewInterface {
  newMethod(): void;
}

class Adapter implements NewInterface {
  constructor(private oldService: OldInterface) {}

  newMethod(): void {
    this.oldService.oldMethod();
  }
}
```

### 2. Facade Pattern

```typescript
interface ComplexSubsystem {
  operation1(): void;
  operation2(): void;
  operation3(): void;
}

interface SimpleFacade {
  simpleOperation(): void;
}

class Facade implements SimpleFacade {
  constructor(private subsystem: ComplexSubsystem) {}

  simpleOperation(): void {
    this.subsystem.operation1();
    this.subsystem.operation2();
    this.subsystem.operation3();
  }
}
```

### 3. Strategy Pattern

```typescript
interface PaymentStrategy {
  pay(amount: number): Promise<void>;
}

interface ValidationStrategy {
  validate(data: any): boolean;
}

class PaymentProcessor {
  constructor(private paymentStrategy: PaymentStrategy, private validationStrategy: ValidationStrategy) {}

  async processPayment(amount: number, data: any): Promise<void> {
    if (this.validationStrategy.validate(data)) {
      await this.paymentStrategy.pay(amount);
    }
  }
}
```

## Özet

Interface Segregation Principle, büyük ve monolitik arayüzlerin yerine küçük, odaklanmış ve özelleşmiş arayüzlerin kullanılmasını önerir. Bu prensibi uygulayarak:

- Daha temiz ve anlaşılır kod yazabilirsiniz
- Gereksiz bağımlılıkları ortadan kaldırabilirsiniz
- Daha esnek ve genişletilebilir sistemler oluşturabilirsiniz
- Test edilebilirliği artırabilirsiniz

**Hatırlayın**: İstemciler kullanmadıkları arayüzlere bağımlı olmamalıdır. Küçük, odaklanmış arayüzler büyük, monolitik arayüzlerden daha iyidir.
