/**
 * Open-Closed Principle (OCP) - TypeScript Examples
 *
 * The Open-Closed Principle states that software entities (classes, modules, functions)
 * should be open for extension but closed for modification.
 *
 * This file demonstrates common OCP violations and how to fix them.
 */

// ============================================================================
// EXAMPLE 1: PAYMENT PROCESSING SYSTEM
// ============================================================================

// ❌ VIOLATION: Adding new payment methods requires modifying existing code
class PaymentProcessorViolation {
  processPayment(amount: number, paymentType: string): string {
    if (paymentType === 'credit') {
      return `Processing credit card payment of $${amount}`;
    } else if (paymentType === 'paypal') {
      return `Processing PayPal payment of $${amount}`;
    } else if (paymentType === 'stripe') {
      return `Processing Stripe payment of $${amount}`;
    } else {
      throw new Error('Unsupported payment type');
    }
  }
}

// ✅ SOLUTION: Open for extension, closed for modification
interface PaymentMethod {
  processPayment(amount: number): string;
  getPaymentType(): string;
}

class CreditCardPayment implements PaymentMethod {
  processPayment(amount: number): string {
    return `Processing credit card payment of $${amount}`;
  }

  getPaymentType(): string {
    return 'credit';
  }
}

class PayPalPayment implements PaymentMethod {
  processPayment(amount: number): string {
    return `Processing PayPal payment of $${amount}`;
  }

  getPaymentType(): string {
    return 'paypal';
  }
}

class StripePayment implements PaymentMethod {
  processPayment(amount: number): string {
    return `Processing Stripe payment of $${amount}`;
  }

  getPaymentType(): string {
    return 'stripe';
  }
}

// New payment method can be added without modifying existing code
class ApplePayPayment implements PaymentMethod {
  processPayment(amount: number): string {
    return `Processing Apple Pay payment of $${amount}`;
  }

  getPaymentType(): string {
    return 'apple_pay';
  }
}

class PaymentProcessor {
  private paymentMethods: Map<string, PaymentMethod> = new Map();

  addPaymentMethod(paymentMethod: PaymentMethod): void {
    this.paymentMethods.set(paymentMethod.getPaymentType(), paymentMethod);
  }

  processPayment(amount: number, paymentType: string): string {
    const paymentMethod = this.paymentMethods.get(paymentType);
    if (!paymentMethod) {
      throw new Error(`Unsupported payment type: ${paymentType}`);
    }
    return paymentMethod.processPayment(amount);
  }
}

// ============================================================================
// EXAMPLE 2: NOTIFICATION SYSTEM
// ============================================================================

// ❌ VIOLATION: Adding new notification types requires modifying existing code
class NotificationServiceViolation {
  sendNotification(message: string, type: string, recipient: string): string {
    if (type === 'email') {
      return `Sending email to ${recipient}: ${message}`;
    } else if (type === 'sms') {
      return `Sending SMS to ${recipient}: ${message}`;
    } else if (type === 'push') {
      return `Sending push notification to ${recipient}: ${message}`;
    } else {
      throw new Error('Unsupported notification type');
    }
  }
}

// ✅ SOLUTION: Open for extension, closed for modification
interface NotificationChannel {
  send(message: string, recipient: string): string;
  getChannelType(): string;
}

class EmailNotification implements NotificationChannel {
  send(message: string, recipient: string): string {
    return `Sending email to ${recipient}: ${message}`;
  }

  getChannelType(): string {
    return 'email';
  }
}

class SMSNotification implements NotificationChannel {
  send(message: string, recipient: string): string {
    return `Sending SMS to ${recipient}: ${message}`;
  }

  getChannelType(): string {
    return 'sms';
  }
}

class PushNotification implements NotificationChannel {
  send(message: string, recipient: string): string {
    return `Sending push notification to ${recipient}: ${message}`;
  }

  getChannelType(): string {
    return 'push';
  }
}

// New notification channel can be added without modifying existing code
class SlackNotification implements NotificationChannel {
  send(message: string, recipient: string): string {
    return `Sending Slack message to ${recipient}: ${message}`;
  }

  getChannelType(): string {
    return 'slack';
  }
}

class NotificationService {
  private channels: Map<string, NotificationChannel> = new Map();

  addChannel(channel: NotificationChannel): void {
    this.channels.set(channel.getChannelType(), channel);
  }

  sendNotification(message: string, type: string, recipient: string): string {
    const channel = this.channels.get(type);
    if (!channel) {
      throw new Error(`Unsupported notification type: ${type}`);
    }
    return channel.send(message, recipient);
  }
}

// ============================================================================
// EXAMPLE 3: FILE PROCESSING SYSTEM
// ============================================================================

// ❌ VIOLATION: Adding new file types requires modifying existing code
class FileProcessorViolation {
  processFile(fileName: string, fileType: string): string {
    if (fileType === 'pdf') {
      return `Processing PDF file: ${fileName}`;
    } else if (fileType === 'docx') {
      return `Processing DOCX file: ${fileName}`;
    } else if (fileType === 'txt') {
      return `Processing TXT file: ${fileName}`;
    } else {
      throw new Error('Unsupported file type');
    }
  }
}

// ✅ SOLUTION: Open for extension, closed for modification
interface FileProcessor {
  canProcess(fileType: string): boolean;
  process(fileName: string): string;
}

class PDFProcessor implements FileProcessor {
  canProcess(fileType: string): boolean {
    return fileType === 'pdf';
  }

  process(fileName: string): string {
    return `Processing PDF file: ${fileName}`;
  }
}

class DOCXProcessor implements FileProcessor {
  canProcess(fileType: string): boolean {
    return fileType === 'docx';
  }

  process(fileName: string): string {
    return `Processing DOCX file: ${fileName}`;
  }
}

class TXTProcessor implements FileProcessor {
  canProcess(fileType: string): boolean {
    return fileType === 'txt';
  }

  process(fileName: string): string {
    return `Processing TXT file: ${fileName}`;
  }
}

// New file processor can be added without modifying existing code
class ImageProcessor implements FileProcessor {
  canProcess(fileType: string): boolean {
    return ['jpg', 'png', 'gif'].includes(fileType);
  }

  process(fileName: string): string {
    return `Processing image file: ${fileName}`;
  }
}

class FileProcessorManager {
  private processors: FileProcessor[] = [];

  addProcessor(processor: FileProcessor): void {
    this.processors.push(processor);
  }

  processFile(fileName: string, fileType: string): string {
    const processor = this.processors.find((p) => p.canProcess(fileType));
    if (!processor) {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
    return processor.process(fileName);
  }
}

// ============================================================================
// EXAMPLE 4: DISCOUNT CALCULATION SYSTEM
// ============================================================================

// ❌ VIOLATION: Adding new discount types requires modifying existing code
class DiscountCalculatorViolation {
  calculateDiscount(amount: number, discountType: string, value: number): number {
    if (discountType === 'percentage') {
      return amount * (value / 100);
    } else if (discountType === 'fixed') {
      return Math.min(value, amount);
    } else if (discountType === 'buy_one_get_one') {
      return amount * 0.5; // Simplified BOGO calculation
    } else {
      throw new Error('Unsupported discount type');
    }
  }
}

// ✅ SOLUTION: Open for extension, closed for modification
interface DiscountStrategy {
  calculateDiscount(amount: number): number;
  getDiscountType(): string;
}

class PercentageDiscount implements DiscountStrategy {
  constructor(private percentage: number) {}

  calculateDiscount(amount: number): number {
    return amount * (this.percentage / 100);
  }

  getDiscountType(): string {
    return 'percentage';
  }
}

class FixedDiscount implements DiscountStrategy {
  constructor(private discountAmount: number) {}

  calculateDiscount(amount: number): number {
    return Math.min(this.discountAmount, amount);
  }

  getDiscountType(): string {
    return 'fixed';
  }
}

class BuyOneGetOneDiscount implements DiscountStrategy {
  calculateDiscount(amount: number): number {
    return amount * 0.5; // Simplified BOGO calculation
  }

  getDiscountType(): string {
    return 'buy_one_get_one';
  }
}

// New discount strategy can be added without modifying existing code
class VolumeDiscount implements DiscountStrategy {
  constructor(private minQuantity: number, private discountPercentage: number) {}

  calculateDiscount(amount: number): number {
    // Simplified volume discount calculation
    return amount * (this.discountPercentage / 100);
  }

  getDiscountType(): string {
    return 'volume';
  }
}

class DiscountCalculator {
  private strategies: Map<string, DiscountStrategy> = new Map();

  addStrategy(strategy: DiscountStrategy): void {
    this.strategies.set(strategy.getDiscountType(), strategy);
  }

  calculateDiscount(amount: number, discountType: string): number {
    const strategy = this.strategies.get(discountType);
    if (!strategy) {
      throw new Error(`Unsupported discount type: ${discountType}`);
    }
    return strategy.calculateDiscount(amount);
  }
}

// ============================================================================
// EXAMPLE 5: SHAPE DRAWING SYSTEM
// ============================================================================

// ❌ VIOLATION: Adding new shapes requires modifying existing code
class ShapeDrawerViolation {
  drawShape(shapeType: string, size: number): string {
    if (shapeType === 'circle') {
      return `Drawing circle with radius ${size}`;
    } else if (shapeType === 'square') {
      return `Drawing square with side ${size}`;
    } else if (shapeType === 'triangle') {
      return `Drawing triangle with side ${size}`;
    } else {
      throw new Error('Unsupported shape type');
    }
  }
}

// ✅ SOLUTION: Open for extension, closed for modification
interface DrawableShape {
  draw(size: number): string;
  getShapeType(): string;
}

class Circle implements DrawableShape {
  draw(size: number): string {
    return `Drawing circle with radius ${size}`;
  }

  getShapeType(): string {
    return 'circle';
  }
}

class Square implements DrawableShape {
  draw(size: number): string {
    return `Drawing square with side ${size}`;
  }

  getShapeType(): string {
    return 'square';
  }
}

class Triangle implements DrawableShape {
  draw(size: number): string {
    return `Drawing triangle with side ${size}`;
  }

  getShapeType(): string {
    return 'triangle';
  }
}

// New shape can be added without modifying existing code
class Rectangle implements DrawableShape {
  constructor(private width: number, private height: number) {}

  draw(size: number): string {
    return `Drawing rectangle with width ${this.width * size} and height ${this.height * size}`;
  }

  getShapeType(): string {
    return 'rectangle';
  }
}

class ShapeDrawer {
  private shapes: Map<string, DrawableShape> = new Map();

  addShape(shape: DrawableShape): void {
    this.shapes.set(shape.getShapeType(), shape);
  }

  drawShape(shapeType: string, size: number): string {
    const shape = this.shapes.get(shapeType);
    if (!shape) {
      throw new Error(`Unsupported shape type: ${shapeType}`);
    }
    return shape.draw(size);
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

// Example usage of the payment processing system
function demonstratePaymentSystem() {
  console.log('=== Payment Processing System ===');

  const paymentProcessor = new PaymentProcessor();

  // Add payment methods
  paymentProcessor.addPaymentMethod(new CreditCardPayment());
  paymentProcessor.addPaymentMethod(new PayPalPayment());
  paymentProcessor.addPaymentMethod(new StripePayment());
  paymentProcessor.addPaymentMethod(new ApplePayPayment()); // New method added without modification

  // Process payments
  console.log(paymentProcessor.processPayment(100, 'credit'));
  console.log(paymentProcessor.processPayment(50, 'paypal'));
  console.log(paymentProcessor.processPayment(75, 'apple_pay'));
}

// Example usage of the notification system
function demonstrateNotificationSystem() {
  console.log('\n=== Notification System ===');

  const notificationService = new NotificationService();

  // Add notification channels
  notificationService.addChannel(new EmailNotification());
  notificationService.addChannel(new SMSNotification());
  notificationService.addChannel(new PushNotification());
  notificationService.addChannel(new SlackNotification()); // New channel added without modification

  // Send notifications
  console.log(notificationService.sendNotification('Hello!', 'email', 'user@example.com'));
  console.log(notificationService.sendNotification('Hello!', 'slack', '@username'));
}

// Example usage of the file processing system
function demonstrateFileProcessingSystem() {
  console.log('\n=== File Processing System ===');

  const fileProcessorManager = new FileProcessorManager();

  // Add file processors
  fileProcessorManager.addProcessor(new PDFProcessor());
  fileProcessorManager.addProcessor(new DOCXProcessor());
  fileProcessorManager.addProcessor(new TXTProcessor());
  fileProcessorManager.addProcessor(new ImageProcessor()); // New processor added without modification

  // Process files
  console.log(fileProcessorManager.processFile('document.pdf', 'pdf'));
  console.log(fileProcessorManager.processFile('image.jpg', 'jpg'));
}

// Example usage of the discount calculation system
function demonstrateDiscountSystem() {
  console.log('\n=== Discount Calculation System ===');

  const discountCalculator = new DiscountCalculator();

  // Add discount strategies
  discountCalculator.addStrategy(new PercentageDiscount(10));
  discountCalculator.addStrategy(new FixedDiscount(20));
  discountCalculator.addStrategy(new BuyOneGetOneDiscount());
  discountCalculator.addStrategy(new VolumeDiscount(5, 15)); // New strategy added without modification

  // Calculate discounts
  console.log(`10% discount on $100: $${discountCalculator.calculateDiscount(100, 'percentage')}`);
  console.log(`$20 fixed discount on $100: $${discountCalculator.calculateDiscount(100, 'fixed')}`);
  console.log(`Volume discount on $100: $${discountCalculator.calculateDiscount(100, 'volume')}`);
}

// Example usage of the shape drawing system
function demonstrateShapeDrawingSystem() {
  console.log('\n=== Shape Drawing System ===');

  const shapeDrawer = new ShapeDrawer();

  // Add shapes
  shapeDrawer.addShape(new Circle());
  shapeDrawer.addShape(new Square());
  shapeDrawer.addShape(new Triangle());
  shapeDrawer.addShape(new Rectangle(2, 3)); // New shape added without modification

  // Draw shapes
  console.log(shapeDrawer.drawShape('circle', 5));
  console.log(shapeDrawer.drawShape('rectangle', 2));
}

// Run all demonstrations
function runAllDemonstrations() {
  demonstratePaymentSystem();
  demonstrateNotificationSystem();
  demonstrateFileProcessingSystem();
  demonstrateDiscountSystem();
  demonstrateShapeDrawingSystem();
}

// Export for use in other modules
export {
  PaymentMethod,
  CreditCardPayment,
  PayPalPayment,
  StripePayment,
  ApplePayPayment,
  PaymentProcessor,
  NotificationChannel,
  EmailNotification,
  SMSNotification,
  PushNotification,
  SlackNotification,
  NotificationService,
  FileProcessor,
  PDFProcessor,
  DOCXProcessor,
  TXTProcessor,
  ImageProcessor,
  FileProcessorManager,
  DiscountStrategy,
  PercentageDiscount,
  FixedDiscount,
  BuyOneGetOneDiscount,
  VolumeDiscount,
  DiscountCalculator,
  DrawableShape,
  Circle,
  Square,
  Triangle,
  Rectangle,
  ShapeDrawer,
  runAllDemonstrations,
};

// Uncomment to run demonstrations
// runAllDemonstrations();
