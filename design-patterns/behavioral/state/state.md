---
title: State Pattern
parent: Design Patterns
nav_order: 3
---

# State Pattern

**Ne yapar?** Bir object'in davranışı **içinde bulunduğu state'e** göre değişir. State değişince aynı method farklı iş yapar. Bunu `if (state === 'X')` yerine, her state'i ayrı bir class'a taşıyarak yaparız — kod daha okunaklı ve yeni state eklemek kolay olur.

**3 şey var:**

- **Context** → State'i tutan, işi mevcut state'e devreden object (örn. sipariş, makine)
- **State (interface)** → Ortak interface: tüm state'lerin uyduğu sözleşme
- **Concrete State** → Her durum için bir class (Pending, Paid, Shipped vb.)

---

## Örnek: Sipariş state'leri

Sipariş önce bekliyor, ödeme alınınca "ödendi", kargoya verilince "gönderildi". Aynı method (`pay()`, `ship()`) farklı state'te farklı davranıyor; geçişi state class'ları yapıyor.

```typescript
interface OrderState {
  pay(ctx: Order): void;
  ship(ctx: Order): void;
}

class Order {
  constructor(public state: OrderState) {}

  pay() {
    this.state.pay(this);
  }

  ship() {
    this.state.ship(this);
  }
}

class Pending implements OrderState {
  pay(order: Order) {
    console.log('Ödendi.');
    order.state = new Paid();
  }
  ship(order: Order) {
    console.log('Önce ödeme alınmalı.');
  }
}

class Paid implements OrderState {
  pay(order: Order) {
    console.log('Zaten ödendi.');
  }
  ship(order: Order) {
    console.log('Kargoya verildi.');
    order.state = new Shipped();
  }
}

class Shipped implements OrderState {
  pay() {}
  ship() {
    console.log('Zaten gönderildi.');
  }
}

// Kullanım
const order = new Order(new Pending());
order.pay(); // Ödendi. → state: Paid
order.ship(); // Kargoya verildi. → state: Shipped
```

State pattern'ın özü: "hangi state'teyim?" sorusu state object'inin kendisi; Context sadece ona soruyor.

---

## Ne Zaman Kullanılır?

- Object'in davranışı state'e göre çok dallanıyorsa (çok `if (state === ...)`).
- Yeni state ekleyeceksin ve mevcut kodu mümkün olduğunca az değiştirmek istiyorsun.

**Çalışan örnekler:** [state-examples.ts](./state-examples.ts) — basit sipariş + otomat; **advanced** senaryolar: e-ticaret siparişi (iptal, iade, teslim), doküman onay akışı (taslak → inceleme → onay/red → yayın), abonelik (deneme → aktif → ödeme gecikmesi → askı → iptal). Çalıştırmak: `npx ts-node design-patterns/behavioral/state/state-examples.ts`
