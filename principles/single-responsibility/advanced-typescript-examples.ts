/**
 * Tek Sorumluluk Prensibi (SRP) için Gelişmiş TypeScript Örnekleri
 *
 * Bu dosya, TypeScript uygulamalarında SRP'yi takip eden daha karmaşık
 * senaryoları ve desenleri gösterir.
 */

// ===========================================
// Örnek 1: Dosya İşleme Sistemi
// ===========================================

// ❌ YANLIŞ: FileProcessor çok fazla iş yapıyor
class FileProcessorViolatingSRP {
  constructor(private filePath: string) {}

  // Dosya okuma
  readFile(): string {
    console.log(`Reading file: ${this.filePath}`);
    return 'file content';
  }

  // ❌ İHLAL: Dosya işleme mantığı
  processContent(content: string): string {
    console.log('Processing file content...');
    return content.toUpperCase();
  }

  // ❌ İHLAL: Dosya doğrulama
  validateFile(): boolean {
    console.log('Validating file...');
    return this.filePath.endsWith('.txt');
  }

  // ❌ İHLAL: Dosya sıkıştırma
  compressFile(): string {
    console.log('Compressing file...');
    return 'compressed content';
  }

  // ❌ İHLAL: Dosya şifreleme
  encryptFile(): string {
    console.log('Encrypting file...');
    return 'encrypted content';
  }

  // ❌ İHLAL: Dosya yükleme
  uploadToCloud(): Promise<boolean> {
    console.log('Uploading to cloud...');
    return Promise.resolve(true);
  }
}

// ✅ DOĞRU: Ayrılmış sorumluluklar
interface FileInfo {
  path: string;
  size: number;
  extension: string;
  lastModified: Date;
}

// Dosya okuyucu - sadece dosya okumaktan sorumlu
interface IFileReader {
  readFile(path: string): Promise<string>;
  getFileInfo(path: string): Promise<FileInfo>;
}

class CustomFileReader implements IFileReader {
  async readFile(path: string): Promise<string> {
    console.log(`Reading file: ${path}`);
    // Dosya okuma mantığı
    return 'file content';
  }

  async getFileInfo(path: string): Promise<FileInfo> {
    console.log(`Getting file info: ${path}`);
    return {
      path,
      size: 1024,
      extension: path.split('.').pop() || '',
      lastModified: new Date(),
    };
  }
}

// Dosya doğrulayıcı - sadece doğrulamadan sorumlu
interface IFileValidator {
  validateFile(fileInfo: FileInfo): boolean;
  validateExtension(extension: string): boolean;
  validateSize(size: number): boolean;
}

class FileValidator implements IFileValidator {
  private readonly allowedExtensions = ['.txt', '.json', '.csv'];
  private readonly maxSize = 10 * 1024 * 1024; // 10MB

  validateFile(fileInfo: FileInfo): boolean {
    return this.validateExtension(fileInfo.extension) && this.validateSize(fileInfo.size);
  }

  validateExtension(extension: string): boolean {
    return this.allowedExtensions.includes(`.${extension}`);
  }

  validateSize(size: number): boolean {
    return size <= this.maxSize;
  }
}

// İçerik işleyici - sadece içerik işlemeden sorumlu
interface IContentProcessor {
  processContent(content: string): string;
  transformContent(content: string, transformation: string): string;
}

class ContentProcessor implements IContentProcessor {
  processContent(content: string): string {
    console.log('Processing file content...');
    return content.toUpperCase();
  }

  transformContent(content: string, transformation: string): string {
    switch (transformation) {
      case 'uppercase':
        return content.toUpperCase();
      case 'lowercase':
        return content.toLowerCase();
      case 'reverse':
        return content.split('').reverse().join('');
      default:
        return content;
    }
  }
}

// Dosya sıkıştırıcı - sadece sıkıştırmadan sorumlu
interface IFileCompressor {
  compress(content: string): string;
  decompress(compressedContent: string): string;
}

class FileCompressor implements IFileCompressor {
  compress(content: string): string {
    console.log('Compressing file...');
    // Sıkıştırma mantığı
    return `compressed_${content}`;
  }

  decompress(compressedContent: string): string {
    console.log('Decompressing file...');
    // Açma mantığı
    return compressedContent.replace('compressed_', '');
  }
}

// Dosya şifreleyici - sadece şifrelemeden sorumlu
interface IFileEncryptor {
  encrypt(content: string, key: string): string;
  decrypt(encryptedContent: string, key: string): string;
}

class FileEncryptor implements IFileEncryptor {
  encrypt(content: string, key: string): string {
    console.log('Encrypting file...');
    // Şifreleme mantığı
    return `encrypted_${content}`;
  }

  decrypt(encryptedContent: string, key: string): string {
    console.log('Decrypting file...');
    // Şifre çözme mantığı
    return encryptedContent.replace('encrypted_', '');
  }
}

// Bulut yükleyici - sadece yüklemekten sorumlu
interface ICloudUploader {
  upload(content: string, path: string): Promise<string>;
  download(path: string): Promise<string>;
}

class CloudUploader implements ICloudUploader {
  async upload(content: string, path: string): Promise<string> {
    console.log(`Uploading to cloud: ${path}`);
    // Yükleme mantığı
    return `cloud://bucket/${path}`;
  }

  async download(path: string): Promise<string> {
    console.log(`Downloading from cloud: ${path}`);
    // İndirme mantığı
    return 'downloaded content';
  }
}

// Dosya işleme orkestratörü
class FileProcessingOrchestrator {
  constructor(
    private fileReader: IFileReader,
    private fileValidator: IFileValidator,
    private contentProcessor: IContentProcessor,
    private fileCompressor: IFileCompressor,
    private fileEncryptor: IFileEncryptor,
    private cloudUploader: ICloudUploader
  ) {}

  async processFile(
    filePath: string,
    options: {
      compress?: boolean;
      encrypt?: boolean;
      upload?: boolean;
      transformation?: string;
    } = {}
  ): Promise<string> {
    try {
      // Dosya okuma
      const content = await this.fileReader.readFile(filePath);
      const fileInfo = await this.fileReader.getFileInfo(filePath);

      // Dosya doğrulama
      if (!this.fileValidator.validateFile(fileInfo)) {
        throw new Error('File validation failed');
      }

      // İçerik işleme
      let processedContent = options.transformation
        ? this.contentProcessor.transformContent(content, options.transformation)
        : this.contentProcessor.processContent(content);

      // İstenirse sıkıştırma
      if (options.compress) {
        processedContent = this.fileCompressor.compress(processedContent);
      }

      // İstenirse şifreleme
      if (options.encrypt) {
        processedContent = this.fileEncryptor.encrypt(processedContent, 'secret-key');
      }

      // İstenirse yükleme
      if (options.upload) {
        const cloudPath = await this.cloudUploader.upload(processedContent, filePath);
        console.log(`File uploaded to: ${cloudPath}`);
      }

      return processedContent;
    } catch (error) {
      console.error('File processing failed:', error);
      throw error;
    }
  }
}

// ===========================================
// Örnek 2: Bildirim Sistemi
// ===========================================

// Bildirim sistemi için türler
interface CustomNotification {
  id: string;
  type: 'email' | 'sms' | 'push' | 'webhook';
  recipient: string;
  subject?: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  scheduledFor?: Date;
}

interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ❌ YANLIŞ: NotificationManager çok fazla iş yapıyor
class NotificationManagerViolatingSRP {
  constructor(private notifications: CustomNotification[] = []) {}

  // Bildirim depolama
  addNotification(notification: CustomNotification): void {
    this.notifications.push(notification);
  }

  // ❌ İHLAL: Email gönderme mantığı
  sendEmail(notification: CustomNotification): Promise<NotificationResult> {
    console.log(`Sending email to ${notification.recipient}: ${notification.subject}`);
    return Promise.resolve({ success: true, messageId: 'email_123' });
  }

  // ❌ İHLAL: SMS gönderme mantığı
  sendSMS(notification: CustomNotification): Promise<NotificationResult> {
    console.log(`Sending SMS to ${notification.recipient}: ${notification.message}`);
    return Promise.resolve({ success: true, messageId: 'sms_456' });
  }

  // ❌ İHLAL: Push bildirim mantığı
  sendPushNotification(notification: CustomNotification): Promise<NotificationResult> {
    console.log(`Sending push notification to ${notification.recipient}: ${notification.message}`);
    return Promise.resolve({ success: true, messageId: 'push_789' });
  }

  // ❌ İHLAL: Şablon işleme
  processTemplate(template: string, data: any): string {
    console.log('Processing notification template...');
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || match);
  }

  // ❌ İHLAL: Hız sınırlama
  checkRateLimit(recipient: string): boolean {
    console.log(`Checking rate limit for ${recipient}...`);
    return true;
  }

  // ❌ İHLAL: Yeniden deneme mantığı
  retryFailedNotification(notificationId: string): Promise<NotificationResult> {
    console.log(`Retrying notification ${notificationId}...`);
    return Promise.resolve({ success: true, messageId: 'retry_123' });
  }
}

// ✅ DOĞRU: Ayrılmış sorumluluklar

// Bildirim depolama - sadece bildirim depolamaktan sorumlu
interface INotificationRepository {
  save(notification: CustomNotification): Promise<void>;
  findById(id: string): Promise<CustomNotification | null>;
  findByRecipient(recipient: string): Promise<CustomNotification[]>;
  updateStatus(id: string, status: string): Promise<void>;
}

class NotificationRepository implements INotificationRepository {
  private notifications: CustomNotification[] = [];

  async save(notification: CustomNotification): Promise<void> {
    this.notifications.push(notification);
    console.log(`Notification saved: ${notification.id}`);
  }

  async findById(id: string): Promise<CustomNotification | null> {
    return this.notifications.find((n) => n.id === id) || null;
  }

  async findByRecipient(recipient: string): Promise<CustomNotification[]> {
    return this.notifications.filter((n) => n.recipient === recipient);
  }

  async updateStatus(id: string, status: string): Promise<void> {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      // Durum güncelleme mantığı
      console.log(`Notification ${id} status updated to: ${status}`);
    }
  }
}

// Şablon işleyici - sadece şablon işlemeden sorumlu
interface ITemplateProcessor {
  processTemplate(template: string, data: Record<string, any>): string;
  validateTemplate(template: string): boolean;
}

class TemplateProcessor implements ITemplateProcessor {
  processTemplate(template: string, data: Record<string, any>): string {
    console.log('Processing notification template...');
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match;
    });
  }

  validateTemplate(template: string): boolean {
    // Geçerli şablon sözdizimini kontrol et
    const templateRegex = /\{\{(\w+)\}\}/g;
    const matches = template.match(templateRegex);
    return matches !== null;
  }
}

// Hız sınırlayıcı - sadece hız sınırlamadan sorumlu
interface IRateLimiter {
  checkLimit(recipient: string, type: string): boolean;
  incrementCounter(recipient: string, type: string): void;
  resetCounters(): void;
}

class RateLimiter implements IRateLimiter {
  private counters: Map<string, Map<string, number>> = new Map();
  private limits: Map<string, number> = new Map([
    ['email', 100], // Saatte 100 email
    ['sms', 10], // Saatte 10 SMS
    ['push', 50], // Saatte 50 push bildirimi
  ]);

  checkLimit(recipient: string, type: string): boolean {
    const limit = this.limits.get(type) || 0;
    const current = this.getCurrentCount(recipient, type);
    return current < limit;
  }

  incrementCounter(recipient: string, type: string): void {
    const recipientCounters = this.counters.get(recipient) || new Map();
    const current = recipientCounters.get(type) || 0;
    recipientCounters.set(type, current + 1);
    this.counters.set(recipient, recipientCounters);
  }

  private getCurrentCount(recipient: string, type: string): number {
    const recipientCounters = this.counters.get(recipient);
    return recipientCounters?.get(type) || 0;
  }

  resetCounters(): void {
    this.counters.clear();
  }
}

// Bildirim göndericileri - her biri bir tür bildirimden sorumlu
interface INotificationSender {
  send(notification: CustomNotification): Promise<NotificationResult>;
  canSend(notification: CustomNotification): boolean;
}

class EmailSender implements INotificationSender {
  canSend(notification: CustomNotification): boolean {
    return notification.type === 'email' && !!notification.subject;
  }

  async send(notification: CustomNotification): Promise<NotificationResult> {
    console.log(`Sending email to ${notification.recipient}: ${notification.subject}`);
    // Email gönderme mantığı
    return { success: true, messageId: 'email_123' };
  }
}

class SMSSender implements INotificationSender {
  canSend(notification: CustomNotification): boolean {
    return notification.type === 'sms';
  }

  async send(notification: CustomNotification): Promise<NotificationResult> {
    console.log(`Sending SMS to ${notification.recipient}: ${notification.message}`);
    // SMS gönderme mantığı
    return { success: true, messageId: 'sms_456' };
  }
}

class PushNotificationSender implements INotificationSender {
  canSend(notification: CustomNotification): boolean {
    return notification.type === 'push';
  }

  async send(notification: CustomNotification): Promise<NotificationResult> {
    console.log(`Sending push notification to ${notification.recipient}: ${notification.message}`);
    // Push bildirim mantığı
    return { success: true, messageId: 'push_789' };
  }
}

// Bildirim servisi orkestratörü
class NotificationService {
  constructor(
    private repository: INotificationRepository,
    private templateProcessor: ITemplateProcessor,
    private rateLimiter: IRateLimiter,
    private senders: INotificationSender[]
  ) {}

  async sendNotification(notification: CustomNotification): Promise<NotificationResult> {
    try {
      // Hız sınırını kontrol et
      if (!this.rateLimiter.checkLimit(notification.recipient, notification.type)) {
        throw new Error('Rate limit exceeded');
      }

      // Uygun göndericiyi bul
      const sender = this.senders.find((s) => s.canSend(notification));
      if (!sender) {
        throw new Error(`No sender available for notification type: ${notification.type}`);
      }

      // Gerekirse şablonu işle
      if (notification.message.includes('{{')) {
        const data = { recipient: notification.recipient, subject: notification.subject };
        notification.message = this.templateProcessor.processTemplate(notification.message, data);
      }

      // Bildirim gönder
      const result = await sender.send(notification);

      // Hız sınırlayıcıyı güncelle
      this.rateLimiter.incrementCounter(notification.recipient, notification.type);

      // Bildirimi kaydet
      await this.repository.save(notification);

      return result;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// ===========================================
// Kullanım Örnekleri
// ===========================================

async function demonstrateFileProcessing(): Promise<void> {
  // Servis örnekleri oluşturma
  const fileReader = new CustomFileReader();
  const fileValidator = new FileValidator();
  const contentProcessor = new ContentProcessor();
  const fileCompressor = new FileCompressor();
  const fileEncryptor = new FileEncryptor();
  const cloudUploader = new CloudUploader();

  // Orkestratör oluşturma
  const orchestrator = new FileProcessingOrchestrator(fileReader, fileValidator, contentProcessor, fileCompressor, fileEncryptor, cloudUploader);

  // Çeşitli seçeneklerle dosya işleme
  const result = await orchestrator.processFile('/path/to/file.txt', {
    compress: true,
    encrypt: true,
    upload: true,
    transformation: 'uppercase',
  });

  console.log('File processing result:', result);
}

async function demonstrateNotificationSystem(): Promise<void> {
  // Servis örnekleri oluşturma
  const repository = new NotificationRepository();
  const templateProcessor = new TemplateProcessor();
  const rateLimiter = new RateLimiter();
  const senders = [new EmailSender(), new SMSSender(), new PushNotificationSender()];

  // Bildirim servisi oluşturma
  const notificationService = new NotificationService(repository, templateProcessor, rateLimiter, senders);

  // Farklı türde bildirimler gönderme
  const emailNotification: CustomNotification = {
    id: 'email_1',
    type: 'email',
    recipient: 'user@example.com',
    subject: 'Welcome!',
    message: 'Hello {{recipient}}, welcome to our service!',
    priority: 'medium',
    createdAt: new Date(),
  };

  const smsNotification: CustomNotification = {
    id: 'sms_1',
    type: 'sms',
    recipient: '+1234567890',
    message: 'Your verification code is: 123456',
    priority: 'high',
    createdAt: new Date(),
  };

  // Bildirimleri gönderme
  await notificationService.sendNotification(emailNotification);
  await notificationService.sendNotification(smsNotification);
}

// ===========================================
// Gösterilen Temel Faydalar
// ===========================================

/*
1. **Tek Sorumluluk**: Her sınıfın net bir amacı var
2. **Test Edilebilirlik**: Her bileşen izole olarak test edilebilir
3. **Bakım Kolaylığı**: Bir bileşendeki değişiklikler diğerlerini etkilemez
4. **Yeniden Kullanılabilirlik**: Bileşenler farklı bağlamlarda yeniden kullanılabilir
5. **Bağımlılık Enjeksiyonu**: Servisler enjekte edilir, kolayca değiştirilebilir
6. **Arayüz Ayrımı**: Küçük, odaklanmış arayüzler
7. **Açık/Kapalı Prensibi**: Yeni işlevsellik eklemek kolay
8. **Tür Güvenliği**: TypeScript derleme zamanı tür kontrolü sağlar
*/
