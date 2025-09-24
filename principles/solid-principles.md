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

**Liskov Yerine Geçme Prensibi**: Alt sınıflar, üst sınıfların yerine kullanılabilmeli.

📁 [Detaylı örnekler ve açıklamalar](./liskov-substitution/) _(Yakında)_

## Interface Segregation Principle (ISP)

**Arayüz Ayrım Prensibi**: İstemciler kullanmadıkları arayüzlere bağımlı olmamalı.

📁 [Detaylı örnekler ve açıklamalar](./interface-segregation/) _(Yakında)_

## Dependency Inversion Principle (DIP)

**Bağımlılık Tersine Çevirme Prensibi**: Soyutlamalara bağımlı olunmalı, somut sınıflara değil.

📁 [Detaylı örnekler ve açıklamalar](./dependency-inversion/) _(Yakında)_

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
- [Liskov Substitution Examples](./liskov-substitution/) _(Yakında)_
- [Interface Segregation Examples](./interface-segregation/) _(Yakında)_
- [Dependency Inversion Examples](./dependency-inversion/) _(Yakında)_
