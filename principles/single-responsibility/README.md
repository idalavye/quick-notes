# Tek Sorumluluk Prensibi (SRP) Örnekleri

Bu dizin, nesne yönelimli tasarımın beş SOLID prensibinden biri olan Tek Sorumluluk Prensibi'ni (SRP) gösteren kapsamlı TypeScript örneklerini içerir.

## Tek Sorumluluk Prensibi Nedir?

Tek Sorumluluk Prensibi şunu belirtir:

> **Bir sınıfın sadece bir değişiklik nedeni olmalıdır.**

Başka bir deyişle, bir sınıfın sadece bir işi veya sorumluluğu olmalıdır. Bu prensip, daha sürdürülebilir, test edilebilir ve esnek kod oluşturmaya yardımcı olur.

## Bu Dizindeki Dosyalar

### 1. `typescript-examples.ts`

SRP ihlalleri ve düzeltmelerini gösteren temel örnekler:

- **Kullanıcı Yönetim Sistemi**: Kullanıcı verileri, doğrulama, veritabanı işlemleri, email gönderme ve loglama işlemlerinin nasıl ayrılacağını gösterir
- **Sipariş İşleme Sistemi**: Sipariş verileri, ödeme işleme, envanter yönetimi, kargo ve bildirimlerin nasıl ayrılacağını gösterir

### 2. `advanced-typescript-examples.ts`

Karmaşık senaryolarla gelişmiş örnekler:

- **Dosya İşleme Sistemi**: Dosya okuma, doğrulama, içerik işleme, sıkıştırma, şifreleme ve bulut yükleme işlemlerini ayırır
- **Bildirim Sistemi**: Bildirim depolama, şablon işleme, hız sınırlama ve farklı türde göndericileri ayırır

## Gösterilen Temel Kavramlar

### ❌ Yaygın SRP İhlalleri

1. **Tanrı Sınıfları**: Çok fazla iş yapan sınıflar
2. **Karışık Sorumluluklar**: Veri yönetimini iş mantığı ile birleştirme
3. **Sıkı Bağlantı**: Çok fazla başka sınıfa bağımlı olan sınıflar
4. **Test Edilmesi Zor**: Birim testi yapılması zor olan sınıflar
5. **Bakımı Zor**: Bir alandaki değişikliklerin ilgisiz alanları etkilemesi

### ✅ SRP En İyi Uygulamaları

1. **Tek Amaç**: Her sınıfın net bir sorumluluğu var
2. **Arayüz Ayrımı**: Küçük, odaklanmış arayüzler
3. **Bağımlılık Enjeksiyonu**: Servisler enjekte edilir, dahili olarak oluşturulmaz
4. **Miras Yerine Kompozisyon**: Sorumlulukları birleştirmek için kompozisyon kullanın
5. **Endişelerin Ayrılması**: Farklı endişeler farklı sınıflar tarafından ele alınır

## SRP'yi Takip Etmenin Faydaları

### 1. **Anlaşılması Daha Kolay**

- Her sınıfın net, tek bir amacı var
- Kod daha okunabilir ve kendini belgeler
- Yeni geliştiriciler kod tabanını hızla anlayabilir

### 2. **Test Edilmesi Daha Kolay**

- Her sorumluluğu izole olarak test edebilirsiniz
- Bağımlılıkları kolayca mock'layabilirsiniz
- Odaklanmış birim testleri yazabilirsiniz

### 3. **Bakımı Daha Kolay**

- Bir sorumluluktaki değişiklikler diğerlerini etkilemez
- Hata düzeltmeleri yerelleştirilir
- Kod incelemeleri daha odaklanmış olur

### 4. **Yeniden Kullanılması Daha Kolay**

- Bireysel sınıflar farklı bağlamlarda yeniden kullanılabilir
- Bileşenler daha modülerdir
- Daha iyi kod organizasyonu

### 5. **Azaltılmış Bağlantı**

- Sınıflar birbirine daha az bağımlıdır
- Değişiklikler daha izole olur
- Sistem daha esnektir

## SRP İhlallerini Nasıl Tespit Edersiniz

### Bu Soruları Sorun:

1. **Sınıfın sorumluluğunu tek cümlede açıklayabilir misiniz?**

   - "ve" veya "veya" kullanmanız gerekiyorsa, birden fazla sorumluluğu olabilir

2. **Sınıfın birden fazla değişiklik nedeni var mı?**

   - Varsa, muhtemelen SRP'yi ihlal ediyor

3. **Bir testte birden fazla şeyi mi test ediyorsunuz?**

   - Bu, sınıfın çok fazla iş yaptığını gösterebilir

4. **Kendinizi birçok ilgisiz modülü import ederken buluyor musunuz?**
   - Bu, sınıfın çok fazla bağımlılığı olduğunu gösterir

## Yeniden Düzenleme Stratejileri

### 1. **Sınıf Çıkarma**

```typescript
// Önce: User sınıfı çok fazla iş yapıyor
class User {
  getName() {
    /* ... */
  }
  validateEmail() {
    /* ... */
  }
  saveToDatabase() {
    /* ... */
  }
  sendEmail() {
    /* ... */
  }
}

// Sonra: Ayrı sınıflar
class User {
  getName() {
    /* ... */
  }
}

class EmailValidator {
  validate(email: string) {
    /* ... */
  }
}

class UserRepository {
  save(user: User) {
    /* ... */
  }
}

class EmailService {
  sendEmail(user: User) {
    /* ... */
  }
}
```

### 2. **Metot Çıkarma**

```typescript
// Önce: Birden fazla iş yapan uzun metot
processOrder(order: Order) {
    // Siparişi doğrula
    // Ödemeyi işle
    // Envanteri güncelle
    // Bildirim gönder
    // Aktiviteyi logla
}

// Sonra: Metotları çıkar
processOrder(order: Order) {
    this.validateOrder(order);
    this.processPayment(order);
    this.updateInventory(order);
    this.sendNotification(order);
    this.logActivity(order);
}
```

### 3. **Kompozisyon Kullanma**

```typescript
// Önce: Birden fazla sorumluluğu olan sınıf
class OrderProcessor {
  processOrder() {
    /* ... */
  }
  sendEmail() {
    /* ... */
  }
  logActivity() {
    /* ... */
  }
}

// Sonra: Kompozisyon kullan
class OrderProcessor {
  constructor(private emailService: EmailService, private logger: Logger) {}

  processOrder() {
    // Siparişi işle
    this.emailService.sendEmail();
    this.logger.logActivity();
  }
}
```

## TypeScript'e Özel Faydalar

### 1. **Tür Güvenliği**

- Arayüzler net sözleşmeler tanımlamaya yardımcı olur
- Derleme zamanı kontrolü birçok hatayı önler
- Daha iyi IDE desteği ve otomatik tamamlama

### 2. **Arayüz Ayrımı**

- Küçük, odaklanmış arayüzler
- Uygulaması ve mock'lanması kolay
- Daha iyi bağımlılık enjeksiyonu

### 3. **Genel Türler**

- Tür güvenliği ile yeniden kullanılabilir bileşenler
- Daha iyi soyutlama
- Azaltılmış kod tekrarı

### 4. **Erişim Değiştiricileri**

- `private`, `protected`, `public` ile net kapsülleme
- Daha iyi veri gizleme
- Sınıf üyelerine kontrollü erişim

## Yaygın Desenler

### 1. **Repository Deseni**

Veri erişimini iş mantığından ayırır:

```typescript
interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
}
```

### 2. **Servis Deseni**

İş mantığını veri modellerinden ayırır:

```typescript
interface IUserService {
  createUser(userData: UserData): Promise<User>;
  updateUser(id: string, userData: UserData): Promise<User>;
}
```

### 3. **Factory Deseni**

Nesne oluşturmayı iş mantığından ayırır:

```typescript
interface IUserFactory {
  createUser(userData: UserData): User;
  createAdminUser(userData: UserData): User;
}
```

## SRP Uyumlu Kod Test Etme

### 1. **Birim Testi**

Her sınıf izole olarak test edilebilir:

```typescript
describe('EmailValidator', () => {
  it('should validate correct email format', () => {
    expect(EmailValidator.validate('test@example.com')).toBe(true);
  });
});
```

### 2. **Bağımlılıkları Mock'lama**

Test için bağımlılıkları mock'lamak kolay:

```typescript
const mockEmailService = {
  sendEmail: jest.fn(),
} as IEmailService;
```

### 3. **Entegrasyon Testi**

Bileşenlerin birlikte nasıl çalıştığını test edin:

```typescript
describe('UserService', () => {
  it('should create user and send welcome email', async () => {
    const user = await userService.createUser(userData);
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(user);
  });
});
```

## Sonuç

Tek Sorumluluk Prensibi'ni takip etmek şunlara yol açar:

- **Daha temiz kod** - anlaşılması daha kolay
- **Daha iyi test edilebilirlik** - odaklanmış birim testleri ile
- **Daha kolay bakım** - izole değişiklikler ile
- **Daha yüksek yeniden kullanılabilirlik** - bileşenlerin
- **Azaltılmış bağlantı** - sınıflar arasında

Unutmayın: **Bir sınıf, bir sorumluluk, bir değişiklik nedeni.**
