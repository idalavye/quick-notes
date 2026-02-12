---
title: Open/Closed Principle
parent: SOLID Principles
nav_order: 5
---

# Açık/Kapalı Prensibi (OCP) Örnekleri

Bu dizin, nesne yönelimli tasarımın beş SOLID prensibinden biri olan Açık/Kapalı Prensibi'ni (OCP) gösteren kapsamlı TypeScript örneklerini içerir.

## Açık/Kapalı Prensibi Nedir?

Açık/Kapalı Prensibi şunu belirtir:

> **Yazılım varlıkları (sınıflar, modüller, fonksiyonlar) genişletmeye açık, değişikliğe kapalı olmalıdır.**

Bu prensip, mevcut kodu değiştirmeden yeni özellikler ekleyebilmemizi sağlar. Kod, yeni gereksinimler için genişletilebilir olmalı, ancak mevcut işlevselliği bozmamalıdır.

## Bu Dizindeki Dosyalar

### 1. `typescript-examples.ts`

OCP ihlalleri ve düzeltmelerini gösteren temel örnekler:

- **Ödeme Sistemi**: Farklı ödeme yöntemlerini desteklemek için genişletilebilir tasarım
- **Bildirim Sistemi**: Yeni bildirim türleri eklemek için açık/kapalı yaklaşım
- **Dosya İşleme**: Farklı dosya formatlarını desteklemek için genişletilebilir mimari

### 2. `advanced-typescript-examples.ts`

Karmaşık senaryolarla gelişmiş örnekler:

- **E-ticaret Sistemi**: Farklı indirim türleri ve fiyatlandırma stratejileri
- **Raporlama Sistemi**: Çeşitli rapor formatları ve veri kaynakları
- **Plugin Mimarisi**: Dinamik olarak yüklenebilir eklentiler

## Gösterilen Temel Kavramlar

### ❌ Yaygın OCP İhlalleri

1. **Switch/If-Else Zincirleri**: Yeni durumlar için kod değişikliği gerektiren yapılar
2. **Sıkı Bağlantı**: Yeni özellikler için mevcut sınıfları değiştirme ihtiyacı
3. **Modifikasyon Gereksinimi**: Her yeni özellik için mevcut kodu değiştirme
4. **Kırılgan Tasarım**: Bir değişikliğin diğer parçaları etkilemesi
5. **Test Edilmesi Zor**: Her değişiklik için tüm sistemi yeniden test etme

### ✅ OCP En İyi Uygulamaları

1. **Soyutlama Kullanımı**: Arayüzler ve soyut sınıflar ile genişletilebilirlik
2. **Polimorfizm**: Aynı arayüzü farklı şekillerde uygulama
3. **Kompozisyon**: Davranışları birleştirme ve genişletme
4. **Strategy Pattern**: Algoritmaları değiştirilebilir hale getirme
5. **Factory Pattern**: Nesne oluşturmayı genişletilebilir hale getirme

## OCP'yi Takip Etmenin Faydaları

### 1. **Genişletilebilirlik**

- Yeni özellikler mevcut kodu değiştirmeden eklenebilir
- Sistem büyüdükçe daha esnek hale gelir
- Yeni gereksinimler kolayca karşılanabilir

### 2. **Geriye Uyumluluk**

- Mevcut işlevsellik korunur
- Mevcut testler geçerli kalır
- Kullanıcılar etkilenmez

### 3. **Azaltılmış Risk**

- Değişiklikler izole edilir
- Hata riski azalır
- Sistem daha kararlı olur

### 4. **Daha İyi Test Edilebilirlik**

- Yeni özellikler izole olarak test edilebilir
- Mevcut testler bozulmaz
- Daha güvenilir test süreci

### 5. **Kod Kalitesi**

- Daha temiz ve organize kod
- Daha iyi soyutlama
- Daha sürdürülebilir mimari

## OCP İhlallerini Nasıl Tespit Edersiniz

### Bu Soruları Sorun:

1. **Yeni özellik eklemek için mevcut kodu değiştirmeniz gerekiyor mu?**

   - Evet ise, muhtemelen OCP'yi ihlal ediyorsunuz

2. **Switch/if-else yapıları var mı?**

   - Yeni durumlar için kod değişikliği gerektiriyorsa OCP ihlali

3. **Bir sınıf birden fazla nedenden dolayı değişiyor mu?**

   - Her yeni özellik için aynı sınıfı değiştirmek OCP ihlali

4. **Yeni türler eklemek için mevcut kodu modifiye etmeniz gerekiyor mu?**

   - Evet ise, genişletilebilir tasarım kullanmalısınız

## OCP Uygulama Stratejileri

### 1. **Arayüz Tabanlı Tasarım**

```typescript
// Önce: Sıkı bağlantı
class PaymentProcessor {
  processPayment(amount: number, type: string) {
    if (type === 'credit') {
      // Kredi kartı işleme
    } else if (type === 'paypal') {
      // PayPal işleme
    }
  }
}

// Sonra: Arayüz tabanlı
interface PaymentMethod {
  processPayment(amount: number): Promise<PaymentResult>;
}

class CreditCardPayment implements PaymentMethod {
  processPayment(amount: number): Promise<PaymentResult> {
    // Kredi kartı işleme
  }
}

class PayPalPayment implements PaymentMethod {
  processPayment(amount: number): Promise<PaymentResult> {
    // PayPal işleme
  }
}
```

### 2. **Strategy Pattern**

```typescript
// Önce: Sıkı bağlantı
class DiscountCalculator {
  calculateDiscount(amount: number, type: string) {
    if (type === 'percentage') {
      return amount * 0.1;
    } else if (type === 'fixed') {
      return 50;
    }
  }
}

// Sonra: Strategy pattern
interface DiscountStrategy {
  calculateDiscount(amount: number): number;
}

class PercentageDiscount implements DiscountStrategy {
  constructor(private percentage: number) {}

  calculateDiscount(amount: number): number {
    return amount * (this.percentage / 100);
  }
}

class FixedDiscount implements DiscountStrategy {
  constructor(private amount: number) {}

  calculateDiscount(amount: number): number {
    return this.amount;
  }
}
```

### 3. **Factory Pattern**

```typescript
// Önce: Sıkı bağlantı
class NotificationService {
  sendNotification(message: string, type: string) {
    if (type === 'email') {
      // Email gönder
    } else if (type === 'sms') {
      // SMS gönder
    }
  }
}

// Sonra: Factory pattern
interface NotificationChannel {
  send(message: string): Promise<void>;
}

class EmailNotification implements NotificationChannel {
  send(message: string): Promise<void> {
    // Email gönder
  }
}

class SMSNotification implements NotificationChannel {
  send(message: string): Promise<void> {
    // SMS gönder
  }
}

class NotificationFactory {
  static create(type: string): NotificationChannel {
    switch (type) {
      case 'email':
        return new EmailNotification();
      case 'sms':
        return new SMSNotification();
      default:
        throw new Error('Unsupported notification type');
    }
  }
}
```

### 4. **Plugin Mimarisi**

```typescript
// Önce: Sıkı bağlantı
class FileProcessor {
  processFile(file: File, type: string) {
    if (type === 'pdf') {
      // PDF işleme
    } else if (type === 'docx') {
      // DOCX işleme
    }
  }
}

// Sonra: Plugin mimarisi
interface FileProcessorPlugin {
  canProcess(file: File): boolean;
  process(file: File): Promise<ProcessedFile>;
}

class PDFProcessor implements FileProcessorPlugin {
  canProcess(file: File): boolean {
    return file.type === 'application/pdf';
  }

  process(file: File): Promise<ProcessedFile> {
    // PDF işleme
  }
}

class FileProcessorManager {
  private plugins: FileProcessorPlugin[] = [];

  registerPlugin(plugin: FileProcessorPlugin): void {
    this.plugins.push(plugin);
  }

  processFile(file: File): Promise<ProcessedFile> {
    const plugin = this.plugins.find((p) => p.canProcess(file));
    if (!plugin) {
      throw new Error('No processor found for file type');
    }
    return plugin.process(file);
  }
}
```

## TypeScript'e Özel Faydalar

### 1. **Güçlü Tip Sistemi**

- Arayüzler net sözleşmeler tanımlar
- Derleme zamanı kontrolü
- Daha güvenli genişletme

### 2. **Generic Types**

- Tip güvenliği ile genişletilebilirlik
- Daha esnek tasarım
- Kod tekrarını azaltma

### 3. **Decorator Pattern**

- Mevcut sınıfları değiştirmeden genişletme
- Daha modüler tasarım
- Daha temiz kod

### 4. **Union Types ve Discriminated Unions**

- Daha güvenli tip kontrolü
- Daha iyi IntelliSense desteği
- Daha az hata

## Yaygın Desenler

### 1. **Strategy Pattern**

Algoritmaları değiştirilebilir hale getirir:

```typescript
interface SortingStrategy<T> {
  sort(items: T[]): T[];
}

class QuickSort<T> implements SortingStrategy<T> {
  sort(items: T[]): T[] {
    // Quick sort implementation
  }
}

class MergeSort<T> implements SortingStrategy<T> {
  sort(items: T[]): T[] {
    // Merge sort implementation
  }
}
```

### 2. **Observer Pattern**

Dinamik olarak dinleyiciler ekleme:

```typescript
interface Observer {
  update(data: any): void;
}

class Subject {
  private observers: Observer[] = [];

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  notify(data: any): void {
    this.observers.forEach((observer) => observer.update(data));
  }
}
```

### 3. **Command Pattern**

İşlemleri genişletilebilir hale getirir:

```typescript
interface Command {
  execute(): void;
  undo(): void;
}

class Invoker {
  private commands: Command[] = [];

  addCommand(command: Command): void {
    this.commands.push(command);
  }

  executeAll(): void {
    this.commands.forEach((command) => command.execute());
  }
}
```

## OCP Uyumlu Kod Test Etme

### 1. **Birim Testi**

Her strateji izole olarak test edilebilir:

```typescript
describe('PaymentMethod', () => {
  it('should process credit card payment', async () => {
    const payment = new CreditCardPayment();
    const result = await payment.processPayment(100);
    expect(result.success).toBe(true);
  });
});
```

### 2. **Entegrasyon Testi**

Farklı stratejilerin birlikte çalışmasını test edin:

```typescript
describe('PaymentProcessor', () => {
  it('should process different payment methods', async () => {
    const processor = new PaymentProcessor();
    const creditCard = new CreditCardPayment();
    const paypal = new PayPalPayment();

    processor.addPaymentMethod('credit', creditCard);
    processor.addPaymentMethod('paypal', paypal);

    const result1 = await processor.processPayment(100, 'credit');
    const result2 = await processor.processPayment(100, 'paypal');

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
  });
});
```

### 3. **Mock ve Stub Kullanımı**

Test için bağımlılıkları mock'lamak kolay:

```typescript
const mockPaymentMethod = {
  processPayment: jest.fn().mockResolvedValue({ success: true }),
} as PaymentMethod;
```

## OCP ve Diğer SOLID Prensipleri

### SRP ile İlişki

- Her sınıf tek bir sorumluluğa sahip olmalı
- Genişletme için yeni sınıflar oluşturulmalı

### LSP ile İlişki

- Alt sınıflar üst sınıfların yerine kullanılabilmeli
- Genişletme sırasında davranış korunmalı

### ISP ile İlişki

- Arayüzler küçük ve odaklanmış olmalı
- Sadece gerekli metodlar implement edilmeli

### DIP ile İlişki

- Soyutlamalara bağımlı olunmalı
- Somut sınıflara değil, arayüzlere bağımlılık

## Sonuç

Açık/Kapalı Prensibi'ni takip etmek şunlara yol açar:

- **Genişletilebilir sistemler** - yeni özellikler kolayca eklenebilir
- **Kararlı kod tabanı** - mevcut kod değişmez
- **Azaltılmış risk** - değişiklikler izole edilir
- **Daha iyi test edilebilirlik** - yeni özellikler izole test edilebilir
- **Sürdürülebilir mimari** - sistem büyüdükçe daha esnek olur

Unutmayın: **Açık genişletmeye, kapalı değişikliğe.**
