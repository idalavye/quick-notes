/**
 * State Pattern - TypeScript örnekleri
 * Çalıştırmak: npx ts-node design-patterns/behavioral/state/state-examples.ts
 */

// ============== Örnek 1: Sipariş (Order) state'leri ==============
console.log('--- Örnek 1: Sipariş ---');

interface OrderState {
  pay(ctx: Order): void;
  ship(ctx: Order): void;
  status(): string;
}

class Order {
  constructor(public state: OrderState) {}

  pay() {
    this.state.pay(this);
  }

  ship() {
    this.state.ship(this);
  }

  getStatus() {
    return this.state.status();
  }
}

class Pending implements OrderState {
  pay(order: Order) {
    console.log('  Ödendi.');
    order.state = new Paid();
  }
  ship(order: Order) {
    console.log('  Önce ödeme alınmalı.');
  }
  status() {
    return 'Beklemede';
  }
}

class Paid implements OrderState {
  pay(order: Order) {
    console.log('  Zaten ödendi.');
  }
  ship(order: Order) {
    console.log('  Kargoya verildi.');
    order.state = new Shipped();
  }
  status() {
    return 'Ödendi';
  }
}

class Shipped implements OrderState {
  pay() {}
  ship() {
    console.log('  Zaten gönderildi.');
  }
  status() {
    return 'Gönderildi';
  }
}

const order = new Order(new Pending());
console.log('Durum:', order.getStatus());
order.pay();
console.log('Durum:', order.getStatus());
order.ship();
console.log('Durum:', order.getStatus());

// ============== Örnek 2: Otomat (para atma, içecek alma) ==============
console.log('\n--- Örnek 2: Otomat ---');

interface VendingState {
  insertCoin(m: VendingMachine): void;
  selectDrink(m: VendingMachine): void;
}

class VendingMachine {
  constructor(public state: VendingState) {}

  insertCoin() {
    this.state.insertCoin(this);
  }

  selectDrink() {
    this.state.selectDrink(this);
  }
}

class NoCoin implements VendingState {
  insertCoin(m: VendingMachine) {
    console.log('  Para alındı. İçecek seçebilirsiniz.');
    m.state = new HasCoin();
  }
  selectDrink(m: VendingMachine) {
    console.log('  Önce para atın.');
  }
}

class HasCoin implements VendingState {
  insertCoin(m: VendingMachine) {
    console.log('  Zaten para var. İçecek seçin.');
  }
  selectDrink(m: VendingMachine) {
    console.log('  İçecek verildi.');
    m.state = new NoCoin();
  }
}

const machine = new VendingMachine(new NoCoin());
machine.selectDrink(); // Önce para atın.
machine.insertCoin(); // Para alındı.
machine.selectDrink(); // İçecek verildi.
machine.selectDrink(); // Önce para atın.

// ============== Örnek 3 (Advanced): E-ticaret siparişi — iptal, iade, teslim ==============
console.log("\n--- Örnek 3 (Advanced): E-ticaret siparişi ---");

type AdvancedOrderStateName =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

interface AdvancedOrderState {
  cancel(ctx: AdvancedOrder): void;
  ship(ctx: AdvancedOrder): void;
  deliver(ctx: AdvancedOrder): void;
  refund(ctx: AdvancedOrder): void;
  status(): AdvancedOrderStateName;
}

class AdvancedOrder {
  constructor(
    public state: AdvancedOrderState,
    public orderId: string,
    public amount: number
  ) {}

  cancel() {
    this.state.cancel(this);
  }
  ship() {
    this.state.ship(this);
  }
  deliver() {
    this.state.deliver(this);
  }
  refund() {
    this.state.refund(this);
  }
  getStatus() {
    return this.state.status();
  }
}

class PendingAdv implements AdvancedOrderState {
  cancel(order: AdvancedOrder) {
    console.log(`  [${order.orderId}] Sipariş iptal edildi.`);
    order.state = new CancelledAdv();
  }
  ship() {
    console.log("  Önce ödeme alınmalı.");
  }
  deliver() {}
  refund() {
    console.log("  Ödenmemiş sipariş iade edilemez.");
  }
  status(): AdvancedOrderStateName {
    return "PENDING";
  }
}

class PaidAdv implements AdvancedOrderState {
  cancel(order: AdvancedOrder) {
    console.log(`  [${order.orderId}] İptal talebi alındı, iade işlenecek.`);
    order.state = new RefundedAdv();
  }
  ship(order: AdvancedOrder) {
    console.log(`  [${order.orderId}] Kargoya verildi.`);
    order.state = new ShippedAdv();
  }
  deliver() {
    console.log("  Önce kargoya verilmeli.");
  }
  refund(order: AdvancedOrder) {
    console.log(`  [${order.orderId}] İade işlendi (${order.amount} TL).`);
    order.state = new RefundedAdv();
  }
  status(): AdvancedOrderStateName {
    return "PAID";
  }
}

class ProcessingAdv implements AdvancedOrderState {
  cancel(order: AdvancedOrder) {
    console.log("  Hazırlık aşamasında, iptal için destek ile iletişime geçin.");
  }
  ship(order: AdvancedOrder) {
    console.log(`  [${order.orderId}] Kargoya verildi.`);
    order.state = new ShippedAdv();
  }
  deliver() {
    console.log("  Henüz kargoya verilmedi.");
  }
  refund() {
    console.log("  Önce iptal veya kargo sonrası iade talebi oluşturulmalı.");
  }
  status(): AdvancedOrderStateName {
    return "PROCESSING";
  }
}

class ShippedAdv implements AdvancedOrderState {
  cancel() {
    console.log("  Kargo yolda, iptal için kargo iade edilmeli.");
  }
  ship() {
    console.log("  Zaten kargoya verildi.");
  }
  deliver(order: AdvancedOrder) {
    console.log(`  [${order.orderId}] Teslim alındı olarak işlendi.`);
    order.state = new DeliveredAdv();
  }
  refund() {
    console.log("  Teslim sonrası iade talebi oluşturulabilir.");
  }
  status(): AdvancedOrderStateName {
    return "SHIPPED";
  }
}

class DeliveredAdv implements AdvancedOrderState {
  cancel() {
    console.log("  Teslim edildi, iptal yapılamaz.");
  }
  ship() {}
  deliver() {
    console.log("  Zaten teslim edildi.");
  }
  refund(order: AdvancedOrder) {
    console.log(`  [${order.orderId}] İade kabul edildi (${order.amount} TL).`);
    order.state = new RefundedAdv();
  }
  status(): AdvancedOrderStateName {
    return "DELIVERED";
  }
}

class CancelledAdv implements AdvancedOrderState {
  cancel() {
    console.log("  Zaten iptal edildi.");
  }
  ship() {}
  deliver() {}
  refund() {}
  status(): AdvancedOrderStateName {
    return "CANCELLED";
  }
}

class RefundedAdv implements AdvancedOrderState {
  cancel() {}
  ship() {}
  deliver() {}
  refund() {
    console.log("  Zaten iade edildi.");
  }
  status(): AdvancedOrderStateName {
    return "REFUNDED";
  }
}

const advOrder = new AdvancedOrder(new PendingAdv(), "ORD-101", 299.99);
advOrder.cancel();
console.log("  Durum:", advOrder.getStatus());

const paidOrder = new AdvancedOrder(new PaidAdv(), "ORD-102", 150);
paidOrder.ship();
paidOrder.deliver();
paidOrder.refund();
console.log("  Durum:", paidOrder.getStatus());

// ============== Örnek 4 (Advanced): İçerik / doküman onay akışı ==============
console.log("\n--- Örnek 4 (Advanced): Doküman onay akışı ---");

type DocumentStateName = "DRAFT" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "PUBLISHED";

interface DocumentState {
  submit(ctx: ContentDoc): void;
  approve(ctx: ContentDoc): void;
  reject(ctx: ContentDoc, reason?: string): void;
  publish(ctx: ContentDoc): void;
  status(): DocumentStateName;
}

class ContentDoc {
  constructor(
    public state: DocumentState,
    public title: string,
    public version: number = 1
  ) {}

  submit() {
    this.state.submit(this);
  }
  approve() {
    this.state.approve(this);
  }
  reject(reason?: string) {
    this.state.reject(this, reason);
  }
  publish() {
    this.state.publish(this);
  }
  getStatus() {
    return this.state.status();
  }
}

class Draft implements DocumentState {
  submit(doc: ContentDoc) {
    console.log(`  [${doc.title}] İncelemeye gönderildi.`);
    doc.state = new InReview();
  }
  approve() {
    console.log("  Taslak onaylanamaz, önce gönderin.");
  }
  reject() {
    console.log("  Taslak reddedilemez.");
  }
  publish() {
    console.log("  Yayınlamak için önce onay alınmalı.");
  }
  status(): DocumentStateName {
    return "DRAFT";
  }
}

class InReview implements DocumentState {
  submit() {
    console.log("  Zaten incelemede.");
  }
  approve(doc: ContentDoc) {
    console.log(`  [${doc.title}] Onaylandı.`);
    doc.state = new Approved();
  }
  reject(doc: ContentDoc, reason?: string) {
    console.log(`  [${doc.title}] Reddedildi${reason ? `: ${reason}` : "."}`);
    doc.state = new Rejected();
  }
  publish() {
    console.log("  Önce onaylanmalı.");
  }
  status(): DocumentStateName {
    return "IN_REVIEW";
  }
}

class Approved implements DocumentState {
  submit() {}
  approve() {
    console.log("  Zaten onaylı.");
  }
  reject() {
    console.log("  Onaylı doküman reddedilemez; revizyon için taslağa alın.");
  }
  publish(doc: ContentDoc) {
    console.log(`  [${doc.title}] v${doc.version} yayınlandı.`);
    doc.state = new Published();
  }
  status(): DocumentStateName {
    return "APPROVED";
  }
}

class Rejected implements DocumentState {
  submit(doc: ContentDoc) {
    doc.version++;
    console.log(`  [${doc.title}] Revizyon v${doc.version} taslak olarak güncellendi.`);
    doc.state = new Draft();
  }
  approve() {
    console.log("  Reddedilen doküman tekrar incelemeye gönderilmeli.");
  }
  reject() {
    console.log("  Zaten reddedildi.");
  }
  publish() {
    console.log("  Reddedilen doküman yayınlanamaz.");
  }
  status(): DocumentStateName {
    return "REJECTED";
  }
}

class Published implements DocumentState {
  submit() {}
  approve() {}
  reject() {}
  publish() {
    console.log("  Zaten yayında.");
  }
  status(): DocumentStateName {
    return "PUBLISHED";
  }
}

const doc = new ContentDoc(new Draft(), "API Rehberi");
doc.submit();
doc.reject("Eksik örnekler.");
console.log("  Durum:", doc.getStatus());
doc.submit(); // Rejected -> Draft (revizyon)
doc.submit(); // Draft -> InReview
doc.approve();
doc.publish();
console.log("  Durum:", doc.getStatus());

// ============== Örnek 5 (Advanced): Abonelik / subscription state ==============
console.log("\n--- Örnek 5 (Advanced): Abonelik ---");

type SubscriptionStateName = "TRIAL" | "ACTIVE" | "PAST_DUE" | "SUSPENDED" | "CANCELLED";

interface SubscriptionState {
  activate(ctx: Subscription): void;
  charge(ctx: Subscription): boolean;
  paymentFailed(ctx: Subscription): void;
  suspend(ctx: Subscription): void;
  cancel(ctx: Subscription): void;
  status(): SubscriptionStateName;
}

class Subscription {
  constructor(
    public state: SubscriptionState,
    public planId: string,
    public billingDay: number
  ) {}

  activate() {
    this.state.activate(this);
  }
  charge() {
    return this.state.charge(this);
  }
  paymentFailed() {
    this.state.paymentFailed(this);
  }
  suspend() {
    this.state.suspend(this);
  }
  cancel() {
    this.state.cancel(this);
  }
  getStatus() {
    return this.state.status();
  }
}

class Trial implements SubscriptionState {
  activate(sub: Subscription) {
    console.log(`  [${sub.planId}] Deneme bitti, abonelik aktif.`);
    sub.state = new ActiveSub();
  }
  charge() {
    console.log("  Deneme süresinde ücret alınmaz.");
    return false;
  }
  paymentFailed() {}
  suspend() {
    console.log("  Deneme askıya alınamaz.");
  }
  cancel(sub: Subscription) {
    console.log(`  [${sub.planId}] Deneme iptal edildi.`);
    sub.state = new CancelledSub();
  }
  status(): SubscriptionStateName {
    return "TRIAL";
  }
}

class ActiveSub implements SubscriptionState {
  activate() {
    console.log("  Zaten aktif.");
  }
  charge(sub: Subscription) {
    console.log(`  [${sub.planId}] Ödeme alındı (fatura günü: ${sub.billingDay}).`);
    return true;
  }
  paymentFailed(sub: Subscription) {
    console.log(`  [${sub.planId}] Ödeme başarısız, hatırlatma gönderildi.`);
    sub.state = new PastDueSub();
  }
  suspend(sub: Subscription) {
    console.log(`  [${sub.planId}] Abonelik askıya alındı.`);
    sub.state = new SuspendedSub();
  }
  cancel(sub: Subscription) {
    console.log(`  [${sub.planId}] İptal edildi, dönem sonuna kadar erişim devam eder.`);
    sub.state = new CancelledSub();
  }
  status(): SubscriptionStateName {
    return "ACTIVE";
  }
}

class PastDueSub implements SubscriptionState {
  activate() {
    console.log("  Önce ödeme yapılmalı.");
  }
  charge(sub: Subscription) {
    console.log(`  [${sub.planId}] Ödeme alındı, abonelik tekrar aktif.`);
    sub.state = new ActiveSub();
    return true;
  }
  paymentFailed(sub: Subscription) {
    console.log(`  [${sub.planId}] Tekrarlayan ödeme hatası, abonelik askıya alındı.`);
    sub.state = new SuspendedSub();
  }
  suspend(sub: Subscription) {
    sub.state = new SuspendedSub();
  }
  cancel(sub: Subscription) {
    sub.state = new CancelledSub();
  }
  status(): SubscriptionStateName {
    return "PAST_DUE";
  }
}

class SuspendedSub implements SubscriptionState {
  activate() {
    console.log("  Önce ödeme yapıp askı kaldırılmalı.");
  }
  charge(sub: Subscription) {
    console.log(`  [${sub.planId}] Ödeme alındı, abonelik yeniden aktif.`);
    sub.state = new ActiveSub();
    return true;
  }
  paymentFailed() {}
  suspend() {
    console.log("  Zaten askıda.");
  }
  cancel(sub: Subscription) {
    sub.state = new CancelledSub();
  }
  status(): SubscriptionStateName {
    return "SUSPENDED";
  }
}

class CancelledSub implements SubscriptionState {
  activate() {}
  charge() {
    return false;
  }
  paymentFailed() {}
  suspend() {}
  cancel() {
    console.log("  Zaten iptal edildi.");
  }
  status(): SubscriptionStateName {
    return "CANCELLED";
  }
}

const sub = new Subscription(new Trial(), "pro-monthly", 15);
console.log("  Durum:", sub.getStatus());
sub.activate();
sub.paymentFailed();
console.log("  Durum:", sub.getStatus());
sub.charge();
console.log("  Durum:", sub.getStatus());
