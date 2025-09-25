# SOLID Principles

Bu dosya, nesne yönelimli tasarımın beş temel prensibini (SOLID) açıklar ve her biri için kapsamlı TypeScript örnekleri sunar.

## Single Responsibility Principle (SRP)

**Tek Sorumluluk Prensibi**: Bir sınıfın sadece bir değişiklik nedeni olmalıdır.

📁 [Detaylı örnekler ve açıklamalar](./single-responsibility/)

## Open/Closed Principle (OCP)

**Açık/Kapalı Prensibi**: Yazılım varlıkları genişletmeye açık, değişikliğe kapalı olmalıdır.

📁 [Detaylı örnekler ve açıklamalar](./open-closed/)

### Temel Kavramlar

- **Açık Genişletmeye**: Yeni özellikler mevcut kodu değiştirmeden eklenebilir
- **Kapalı Değişikliğe**: Mevcut kod değiştirilmez, sadece genişletilir
- **Soyutlama Kullanımı**: Arayüzler ve soyut sınıflar ile genişletilebilirlik
- **Polimorfizm**: Aynı arayüzü farklı şekillerde uygulama

### Yaygın Desenler

- **Strategy Pattern**: Algoritmaları değiştirilebilir hale getirme
- **Factory Pattern**: Nesne oluşturmayı genişletilebilir hale getirme
- **Observer Pattern**: Dinamik olarak dinleyiciler ekleme
- **Plugin Mimarisi**: Dinamik olarak yüklenebilir eklentiler

## Liskov Substitution Principle (LSP)

**Liskov Yerine Geçme Prensibi**: Alt sınıflar, üst sınıfların yerine kullanılabilmeli ve bu değişiklik programın doğruluğunu bozmamalıdır.

📁 [Detaylı örnekler ve açıklamalar](./liskov-substitution/)

### Temel Kavramlar

- **Davranışsal Uyumluluk**: Alt sınıf, üst sınıfın tüm davranışlarını korumalı
- **Ön Koşul Zayıflatma**: Alt sınıf, üst sınıftan daha az kısıtlayıcı ön koşullar kabul edebilir
- **Son Koşul Güçlendirme**: Alt sınıf, üst sınıftan daha güçlü son koşullar sağlamalı
- **Değişmezlik Korunması**: Alt sınıf, üst sınıfın değişmezliklerini korumalı

### Yaygın İhlaller

- **Yöntem İmzası Değiştirme**: Alt sınıfta farklı parametreler veya dönüş türleri
- **Özel Durum Fırlatma**: Alt sınıfta beklenmeyen hatalar
- **Davranış Değiştirme**: Alt sınıfta farklı iş mantığı

### Çözüm Stratejileri

- **Arayüz Ayrımı**: Küçük, odaklanmış arayüzler kullanma
- **Soyut Sınıflar**: Ortak davranışları soyut sınıflarda tanımlama
- **Composition over Inheritance**: Kalıtım yerine kompozisyon kullanma

## Interface Segregation Principle (ISP)

**Arayüz Ayrım Prensibi**: İstemciler kullanmadıkları arayüzlere bağımlı olmamalıdır.

📁 [Detaylı örnekler ve açıklamalar](./interface-segregation/)

### Temel Kavramlar

- **Küçük Arayüzler**: Her arayüz tek bir sorumluluğa odaklanmalı
- **İstemci Odaklı**: Arayüzler istemcilerin ihtiyaçlarına göre tasarlanmalı
- **Bağımlılık Azaltma**: İstemciler kullanmadıkları metodlara bağımlı olmamalı
- **Esneklik**: Yeni özellikler mevcut arayüzleri bozmadan eklenebilmeli

### Yaygın İhlaller

- **Büyük Arayüzler**: Monolitik arayüzlerde gereksiz metodlar
- **Gereksiz Bağımlılıklar**: İstemcilerin kullanmadığı metodlara bağımlılık
- **Arayüz Kirliliği**: Farklı sorumlulukların aynı arayüzde toplanması

### Çözüm Stratejileri

- **Arayüz Ayrımı**: Büyük arayüzleri küçük parçalara bölme
- **Fonksiyonel Arayüzler**: Her arayüz tek bir işlev için tasarlanmalı
- **Composition over Inheritance**: Kalıtım yerine kompozisyon kullanma

## Dependency Inversion Principle (DIP)

**Bağımlılık Tersine Çevirme Prensibi**: Soyutlamalara bağımlı olunmalı, somut sınıflara değil. Bağımlılıkları dışarıdan enjekte edin, içeride oluşturmayın.

📁 [Detaylı örnekler ve açıklamalar](./dependency-inversion/) _(Yakında)_

### IoC

DIP, sınıfların somutlara değil soyutlamalara bağımlı olmasını söylerken, IoC bağımlılıkların kontrolünü sınıflardan alıp dışarıya vermeyi ifade eder. ✅

1. DIP = prensip (neden?)
2. IoC = yaklaşım (nasıl?) - Genelde Dependency injection ile yapılır.

## SOLID Prensiplerinin Birlikte Kullanımı

Bu prensipler birlikte çalışarak:

- **Sürdürülebilir kod** oluşturur
- **Test edilebilir sistemler** sağlar
- **Esnek mimariler** destekler
- **Kod tekrarını** azaltır
- **Bakım maliyetlerini** düşürür

## Örnekler

Her prensip için ayrı dizinlerde kapsamlı TypeScript örnekleri bulabilirsiniz:

- [Single Responsibility Examples](./single-responsibility/)
- [Open/Closed Examples](./open-closed/)
- [Liskov Substitution Examples](./liskov-substitution/)
- [Interface Segregation Examples](./interface-segregation/)
- [Dependency Inversion Examples](./dependency-inversion/) _(Yakında)_
