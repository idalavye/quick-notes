---
title: Liskov Substitution Principle
parent: SOLID Principles
nav_order: 4
---

# Liskov Substitution Principle (LSP)

**Liskov Yerine Geçme Prensibi**: Alt sınıflar, üst sınıfların yerine kullanılabilmeli ve bu değişiklik programın doğruluğunu bozmamalıdır.

## Temel Kavramlar

### Tanım

Barbara Liskov tarafından 1987 yılında tanımlanan bu prensip, nesne yönelimli programlamada kalıtımın doğru kullanılması için kritik kurallar belirler.

### Ana Kurallar

1. **Davranışsal Uyumluluk**: Alt sınıf, üst sınıfın tüm davranışlarını korumalı
2. **Ön Koşul Zayıflatma**: Alt sınıf, üst sınıftan daha az kısıtlayıcı ön koşullar kabul edebilir
3. **Son Koşul Güçlendirme**: Alt sınıf, üst sınıftan daha güçlü son koşullar sağlamalı
4. **Değişmezlik Korunması**: Alt sınıf, üst sınıfın değişmezliklerini korumalı

## Yaygın İhlaller

### 1. Yöntem İmzası Değiştirme

```typescript
// ❌ Yanlış - LSP ihlali
class Bird {
  fly(): void {
    console.log('Flying...');
  }
}

class Penguin extends Bird {
  fly(): void {
    throw new Error("Penguins can't fly!"); // LSP ihlali
  }
}
```

### 2. Dönüş Türü Değiştirme

```typescript
// ❌ Yanlış - LSP ihlali
class Shape {
  area(): number {
    return 0;
  }
}

class Circle extends Shape {
  area(): string {
    // LSP ihlali - dönüş türü değişti
    return 'Circle area';
  }
}
```

### 3. Özel Durum Fırlatma

```typescript
// ❌ Yanlış - LSP ihlali
class Database {
  save(data: any): void {
    // Normal kaydetme işlemi
  }
}

class ReadOnlyDatabase extends Database {
  save(data: any): void {
    throw new Error('Cannot save to read-only database'); // LSP ihlali
  }
}
```

## Doğru Uygulama Örnekleri

### 1. Arayüz Ayrımı ile Çözüm

```typescript
// ✅ Doğru - LSP uyumlu
interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

class Bird {
  // Temel kuş davranışları
}

class FlyingBird extends Bird implements Flyable {
  fly(): void {
    console.log('Flying...');
  }
}

class Penguin extends Bird implements Swimmable {
  swim(): void {
    console.log('Swimming...');
  }
}
```

### 2. Soyut Sınıf Kullanımı

```typescript
// ✅ Doğru - LSP uyumlu
abstract class Shape {
  abstract area(): number;
  abstract perimeter(): number;
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  area(): number {
    return this.width * this.height;
  }

  perimeter(): number {
    return 2 * (this.width + this.height);
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius * this.radius;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}
```

## Faydaları

### 1. Kod Güvenilirliği

- Alt sınıflar her zaman üst sınıfların yerine kullanılabilir
- Beklenmeyen davranış değişiklikleri önlenir

### 2. Test Edilebilirlik

- Mock objeler güvenle kullanılabilir
- Unit testler daha güvenilir hale gelir

### 3. Kod Sürdürülebilirliği

- Kalıtım hiyerarşisi daha anlaşılır
- Yeni alt sınıflar eklemek daha güvenli

### 4. Polimorfizm Desteği

- Aynı arayüzü farklı şekillerde uygulama
- Runtime'da dinamik tip seçimi

## Pratik İpuçları

### 1. "IS-A" İlişkisini Kontrol Edin

```typescript
// Soru: Penguin IS-A Bird mi?
// Cevap: Evet, ama Penguin IS-A Flyable değil
```

### 2. Davranışsal Sözleşmeleri Tanımlayın

```typescript
interface Contract {
  // Ön koşullar
  preconditions: string[];
  // Son koşullar
  postconditions: string[];
  // Değişmezlikler
  invariants: string[];
}
```

### 3. Arayüz Ayrımı Uygulayın

```typescript
// Büyük arayüz yerine küçük, odaklanmış arayüzler
interface Readable {
  read(): string;
}

interface Writable {
  write(data: string): void;
}

interface ReadWritable extends Readable, Writable {}
```

## Test Stratejileri

### 1. Sözleşme Testleri

```typescript
function testLSPCompliance<T extends Shape>(shape: T) {
  // Tüm Shape alt sınıfları aynı davranışı sergilemeli
  expect(shape.area()).toBeGreaterThanOrEqual(0);
  expect(shape.perimeter()).toBeGreaterThanOrEqual(0);
}
```

### 2. Polimorfizm Testleri

```typescript
function testPolymorphism(shapes: Shape[]) {
  shapes.forEach((shape) => {
    // Her shape aynı şekilde kullanılabilmeli
    const area = shape.area();
    const perimeter = shape.perimeter();
    expect(typeof area).toBe('number');
    expect(typeof perimeter).toBe('number');
  });
}
```

## İlişkili Prensipler

- **Single Responsibility**: Her sınıfın tek bir sorumluluğu olmalı
- **Open/Closed**: Genişletmeye açık, değişikliğe kapalı
- **Interface Segregation**: Küçük, odaklanmış arayüzler
- **Dependency Inversion**: Soyutlamalara bağımlılık

## Özet

Liskov Substitution Principle, kalıtımın doğru kullanılması için kritik kurallar belirler. Bu prensibi uygulayarak:

- Daha güvenilir kod yazabilirsiniz
- Polimorfizmi güvenle kullanabilirsiniz
- Test edilebilir sistemler oluşturabilirsiniz
- Kod sürdürülebilirliğini artırabilirsiniz

**Hatırlayın**: Alt sınıflar, üst sınıfların yerine kullanılabilmeli ve bu değişiklik programın doğruluğunu bozmamalıdır.
