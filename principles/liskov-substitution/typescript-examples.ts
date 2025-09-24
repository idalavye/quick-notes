/**
 * Liskov Substitution Principle (LSP) - TypeScript Examples
 *
 * Bu dosya, LSP'nin temel kavramlarını ve doğru uygulamalarını gösterir.
 * Alt sınıflar, üst sınıfların yerine kullanılabilmeli ve bu değişiklik
 * programın doğruluğunu bozmamalıdır.
 */

// ============================================================================
// 1. TEMEL KAVRAMLAR VE YANLIŞ UYGULAMALAR
// ============================================================================

// ❌ YANLIŞ: LSP ihlali - Yöntem imzası değiştirme
class Bird {
  fly(): void {
    console.log('Flying...');
  }
}

class Penguin extends Bird {
  fly(): void {
    throw new Error("Penguins can't fly!"); // LSP ihlali!
  }
}

// ❌ YANLIŞ: LSP ihlali - Dönüş türü değiştirme
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

// ❌ YANLIŞ: LSP ihlali - Özel durum fırlatma
class Database {
  save(data: any): void {
    console.log('Saving data...');
  }
}

class ReadOnlyDatabase extends Database {
  save(data: any): void {
    throw new Error('Cannot save to read-only database'); // LSP ihlali!
  }
}

// ============================================================================
// 2. DOĞRU UYGULAMALAR - ARAYÜZ AYIRIMI
// ============================================================================

// ✅ DOĞRU: Arayüz ayrımı ile LSP uyumlu çözüm
interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

interface Walkable {
  walk(): void;
}

class Bird {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  eat(): void {
    console.log(`${this.name} is eating...`);
  }
}

class FlyingBird extends Bird implements Flyable {
  fly(): void {
    console.log(`${this.name} is flying...`);
  }
}

class Penguin extends Bird implements Swimmable, Walkable {
  swim(): void {
    console.log(`${this.name} is swimming...`);
  }

  walk(): void {
    console.log(`${this.name} is walking...`);
  }
}

// ============================================================================
// 3. ŞEKİL ÖRNEĞİ - LSP UYUMLU
// ============================================================================

abstract class Shape {
  abstract area(): number;
  abstract perimeter(): number;

  // Ortak davranış
  describe(): string {
    return `Shape with area: ${this.area()}, perimeter: ${this.perimeter()}`;
  }
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

class Square extends Rectangle {
  constructor(side: number) {
    super(side, side);
  }
}

// ============================================================================
// 4. VERİTABANI ÖRNEĞİ - LSP UYUMLU
// ============================================================================

interface Database {
  save(data: any): Promise<void>;
  find(id: string): Promise<any>;
  delete(id: string): Promise<void>;
}

class InMemoryDatabase implements Database {
  private data: Map<string, any> = new Map();

  async save(data: any): Promise<void> {
    const id = Math.random().toString(36);
    this.data.set(id, data);
    console.log(`Data saved with ID: ${id}`);
  }

  async find(id: string): Promise<any> {
    return this.data.get(id);
  }

  async delete(id: string): Promise<void> {
    this.data.delete(id);
    console.log(`Data with ID ${id} deleted`);
  }
}

class ReadOnlyDatabase implements Database {
  private data: Map<string, any> = new Map();

  constructor(initialData: Record<string, any> = {}) {
    Object.entries(initialData).forEach(([key, value]) => {
      this.data.set(key, value);
    });
  }

  async save(data: any): Promise<void> {
    // Read-only veritabanı için save işlemi sessizce başarısız olur
    console.log('Read-only database: Save operation ignored');
  }

  async find(id: string): Promise<any> {
    return this.data.get(id);
  }

  async delete(id: string): Promise<void> {
    // Read-only veritabanı için delete işlemi sessizce başarısız olur
    console.log('Read-only database: Delete operation ignored');
  }
}

// ============================================================================
// 5. ARAÇ ÖRNEĞİ - LSP UYUMLU
// ============================================================================

interface Vehicle {
  start(): void;
  stop(): void;
  getSpeed(): number;
}

abstract class Car implements Vehicle {
  protected speed: number = 0;
  protected isRunning: boolean = false;

  start(): void {
    this.isRunning = true;
    console.log('Car started');
  }

  stop(): void {
    this.isRunning = false;
    this.speed = 0;
    console.log('Car stopped');
  }

  getSpeed(): number {
    return this.speed;
  }

  abstract accelerate(): void;
}

class SportsCar extends Car {
  accelerate(): void {
    if (this.isRunning) {
      this.speed += 20;
      console.log(`Sports car accelerated to ${this.speed} km/h`);
    }
  }
}

class Truck extends Car {
  accelerate(): void {
    if (this.isRunning) {
      this.speed += 5;
      console.log(`Truck accelerated to ${this.speed} km/h`);
    }
  }
}

// ============================================================================
// 6. POLİMORFİZM ÖRNEĞİ
// ============================================================================

function demonstratePolymorphism() {
  // Tüm Shape alt sınıfları aynı şekilde kullanılabilir
  const shapes: Shape[] = [new Rectangle(5, 3), new Circle(4), new Square(6)];

  shapes.forEach((shape) => {
    console.log(shape.describe());
    // Her shape aynı davranışı sergiler
    console.log(`Area: ${shape.area()}`);
    console.log(`Perimeter: ${shape.perimeter()}`);
    console.log('---');
  });
}

// ============================================================================
// 7. LSP TEST FONKSİYONU
// ============================================================================

function testLSPCompliance<T extends Shape>(shape: T): boolean {
  try {
    // Tüm Shape alt sınıfları aynı davranışı sergilemeli
    const area = shape.area();
    const perimeter = shape.perimeter();
    const description = shape.describe();

    // Temel kontroller
    if (typeof area !== 'number' || area < 0) {
      return false;
    }

    if (typeof perimeter !== 'number' || perimeter < 0) {
      return false;
    }

    if (typeof description !== 'string') {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

// ============================================================================
// 8. KULLANIM ÖRNEKLERİ
// ============================================================================

// Şekil örnekleri
const rectangle = new Rectangle(10, 5);
const circle = new Circle(3);
const square = new Square(4);

console.log('=== Shape Examples ===');
console.log(rectangle.describe());
console.log(circle.describe());
console.log(square.describe());

// LSP testi
console.log('\n=== LSP Compliance Tests ===');
console.log(`Rectangle LSP compliant: ${testLSPCompliance(rectangle)}`);
console.log(`Circle LSP compliant: ${testLSPCompliance(circle)}`);
console.log(`Square LSP compliant: ${testLSPCompliance(square)}`);

// Polimorfizm örneği
console.log('\n=== Polymorphism Demo ===');
demonstratePolymorphism();

// Araç örnekleri
console.log('\n=== Vehicle Examples ===');
const sportsCar = new SportsCar();
const truck = new Truck();

sportsCar.start();
sportsCar.accelerate();
sportsCar.accelerate();
console.log(`Sports car speed: ${sportsCar.getSpeed()} km/h`);

truck.start();
truck.accelerate();
console.log(`Truck speed: ${truck.getSpeed()} km/h`);

// Veritabanı örnekleri
console.log('\n=== Database Examples ===');
const memoryDb = new InMemoryDatabase();
const readOnlyDb = new ReadOnlyDatabase({ '1': 'test data' });

// Her iki veritabanı da aynı arayüzü kullanır
memoryDb.save({ name: 'test' });
readOnlyDb.save({ name: 'test' }); // Sessizce başarısız olur

memoryDb.find('1');
readOnlyDb.find('1');

export {
  Shape,
  Rectangle,
  Circle,
  Square,
  Bird,
  FlyingBird,
  Penguin,
  Database,
  InMemoryDatabase,
  ReadOnlyDatabase,
  Vehicle,
  Car,
  SportsCar,
  Truck,
  testLSPCompliance,
  demonstratePolymorphism,
};
