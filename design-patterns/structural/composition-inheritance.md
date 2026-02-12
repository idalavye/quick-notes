# Composition ve Inheritance

Structural pattern'ler ve OOP tasarımında iki temel yaklaşım vardır: **inheritance** (kalıtım) ve **composition** (bileşim). İkisi de class'ları bir araya getirir ama farklı ilişki türlerini ifade eder.

---

## Inheritance (Kalıtım)

**İlişki:** “**is-a**” — Alt tip, üst tipin bir türüdür.

Bir class başka bir class'tan **extends** ile türetilir; üst class'ın davranışı ve state'i miras alınır.

### TypeScript örneği: Inheritance

```typescript
// Base class
class Animal {
  constructor(protected name: string) {}

  speak(): string {
    return `${this.name} makes a sound`;
  }

  move(): string {
    return `${this.name} moves`;
  }
}

// Inheritance: Dog "is-a" Animal
class Dog extends Animal {
  constructor(
    name: string,
    private breed: string,
  ) {
    super(name);
  }

  speak(): string {
    return `${this.name} barks`;
  }

  fetch(): string {
    return `${this.name} fetches the ball`;
  }
}

// Inheritance: Cat "is-a" Animal
class Cat extends Animal {
  speak(): string {
    return `${this.name} meows`;
  }
}

// Kullanım
const dog = new Dog('Rex', 'Labrador');
console.log(dog.speak()); // "Rex barks"
console.log(dog.move()); // "Rex moves" (miras)
console.log(dog.fetch()); // "Rex fetches the ball"

const cat = new Cat('Whiskers');
console.log(cat.speak()); // "Whiskers meows"
```

**Artıları:** Kod tekrarı azalır, ortak davranış tek yerde (base class).  
**Eksileri:** Sıkı bağlılık, hierarchy derinleşince kırılganlık, tek bir base class'tan türetme sınırı.

---

## Composition (Composition)

**İlişki:** “**has-a**” — Bir class, başka object'lere **sahiptir** (içinde bulundurur).

Davranış veya yetenek, ayrı class'lardan gelen instance'lar üzerinden kullanılır; `extends` yok.

### TypeScript örneği: Composition

```typescript
// Ayrı yetenekler / bileşenler
class Engine {
  constructor(private horsepower: number) {}

  start(): string {
    return `Engine (${this.horsepower}hp) started`;
  }

  stop(): string {
    return 'Engine stopped';
  }
}

class StereoSystem {
  setVolume(level: number): void {
    console.log(`Volume set to ${level}`);
  }

  play(): string {
    return 'Playing music';
  }
}

// Car "has-a" Engine ve "has-a" StereoSystem
class Car {
  constructor(
    private brand: string,
    private engine: Engine,
    private stereo: StereoSystem,
  ) {}

  start(): string {
    return this.engine.start();
  }

  stop(): string {
    return this.engine.stop();
  }

  playMusic(): string {
    this.stereo.setVolume(5);
    return this.stereo.play();
  }

  getInfo(): string {
    return `${this.brand} car`;
  }
}

// Bileşenleri dışarıdan veriyoruz → esnek, test edilebilir
const engine = new Engine(150);
const stereo = new StereoSystem();
const car = new Car('Toyota', engine, stereo);

console.log(car.start()); // "Engine (150hp) started"
console.log(car.playMusic()); // "Playing music"
```

**Artıları:** Gevşek bağlılık, bileşenler değiştirilebilir veya mock'lanabilir, tek inheritance sınırı yok.  
**Eksileri:** Daha fazla class/object, bazen daha fazla boilerplate.

---

## Composition + Interface (Dependency Injection tarzı)

Composition'da bileşenleri **interface** üzerinden kullanırsan, farklı implementasyonları kolayca takabiliyorsun:

```typescript
interface PaymentProcessor {
  charge(amount: number): boolean;
}

class CreditCardProcessor implements PaymentProcessor {
  charge(amount: number): boolean {
    console.log(`Charged ${amount} via credit card`);
    return true;
  }
}

class PayPalProcessor implements PaymentProcessor {
  charge(amount: number): boolean {
    console.log(`Charged ${amount} via PayPal`);
    return true;
  }
}

// Order "has-a" PaymentProcessor (composition)
class Order {
  constructor(private paymentProcessor: PaymentProcessor) {}

  checkout(amount: number): boolean {
    return this.paymentProcessor.charge(amount);
  }
}

// Runtime'da hangi processor kullanılacağına karar verilebilir
const order1 = new Order(new CreditCardProcessor());
const order2 = new Order(new PayPalProcessor());
order1.checkout(100); // Credit card
order2.checkout(50); // PayPal
```

---

## Ne Zaman Hangisi?

| Kriter            | Inheritance                    | Composition                   |
| ----------------- | ------------------------------ | ----------------------------- |
| İlişki            | Gerçekten “X bir Y’dir” (is-a) | “X bir Y’ye sahiptir” (has-a) |
| Davranış değişimi | Override, subclass’lar         | Farklı bileşen inject et      |
| Esneklik          | Hierarchy sabit kalır          | Bileşenler değiştirilebilir   |
| Test              | Mock’lamak zor olabilir        | Bileşenler kolay mock’lanır   |

**Pratik kural:** “Favor composition over inheritance” — davranışı parçalara bölüp composition ile birleştirmek çoğu zaman daha esnek ve güvenli olur. Gerçek bir is-a ilişkisi ve net bir hiyerarşi varsa inheritance mantıklıdır.

---

## Özet

- **Inheritance:** `extends` ile is-a ilişkisi; ortak base, alt tipler.
- **Composition:** Class içinde başka object'ler tutmak; has-a, daha esnek.
- TypeScript'te inheritance için `extends` ve `super`, composition için constructor’da dependency almak ve interface kullanmak yaygın pattern’dir.

Structural pattern'lerden **Decorator**, **Composite**, **Strategy** gibi birçok pattern composition kullanır; inheritance ise template method veya base class’lı hiyerarşilerde öne çıkar.
