---
title: Prototype Pattern
parent: Design Patterns
nav_order: 1
---

# Prototype Pattern

**Ne yapar?** Yeni object'leri **mevcut bir object'ten kopyalayarak** üretir. `new` ile sıfırdan kurmak yerine, bir **prototype (örnek)** object'ten clone / copy çıkarırsın. Böylece oluşturma maliyeti yüksek veya iç yapısı karmaşık object'ler için tekrar kurulum yapmadan kopya üretirsin.

**Temel fikir:** Object'in kendisi kopyalama davranışını sunar (`clone()`); client prototype'tan kopya alır, gerekirse üzerinde küçük değişiklik yapar.

---

## Ne zaman kullanılır?

- Object oluşturmak **pahalı** (DB, ağ, ağır hesaplama) ve aynı yapıda bir kopya gerekiyorsa.
- Sınıf hiyerarşisini **runtime'da** üretmek istemiyorsan; sadece mevcut instance'lardan kopya üretmek yeterliyse.
- **Initial state** karmaşık ve bir “şablon” object'ten türetmek işini kolaylaştırıyorsa.

---

## Yapı (kısa)

- **Prototype (interface)** → `clone()` veya `copy()` gibi kopyalama method'u tanımlar.
- **Concrete Prototype** → Kopyalama mantığını uygular (shallow veya deep copy).
- **Client** → Prototype instance'ı alır, `clone()` ile yeni instance üretir; gerekirse alanları günceller.

---

## Örnek: Konfigürasyon kopyalama

Aynı ayarlardan küçük farklarla yeni konfig üretmek istiyoruz; her seferinde tüm alanları elle set etmek yerine mevcut config'den kopya alıyoruz.

```typescript
interface Prototype {
  clone(): Prototype;
}

class AppConfig implements Prototype {
  constructor(
    public env: string,
    public apiUrl: string,
    public timeout: number,
  ) {}

  clone(): AppConfig {
    return new AppConfig(this.env, this.apiUrl, this.timeout);
  }
}

// Kullanım: prototype'tan kopya, sonra sadece değişen alanı güncelle
const defaultConfig = new AppConfig('production', 'https://api.example.com', 5000);
const stagingConfig = defaultConfig.clone();
stagingConfig.env = 'staging';
stagingConfig.apiUrl = 'https://staging-api.example.com';
```

---

## Shallow vs deep copy

- **Shallow copy:** Nested object'ler ve array'ler referans olarak kopyalanır; kopyada değişiklik yapınca orijinal de etkilenebilir.
- **Deep copy:** İç içe tüm yapı kopyalanır; kopya tamamen bağımsız olur. Karmaşık object'lerde `structuredClone()` (JS) veya kütüphane kullanılabilir.

Prototype pattern'de genelde **deep copy** istenir; böylece kopya üzerinde yapılan değişiklikler prototype'ı bozmaz.

---

## JavaScript prototype ile fark

JavaScript'te sık duyduğun **"prototype"** bu pattern ile **aynı kavram değil**. İsim benzer; amaç farklı.

- **JavaScript'teki prototype:** Nesnelerin **inheritance / delegation** mekanizmasıdır. Her object'in bir `[[Prototype]]` bağlantısı vardır; bir property'ye erişirken nesnede yoksa zincirde aranır. Constructor'ların `.prototype` property'si, `new` ile oluşturulan instance'ların bu zincirdeki bir sonraki halkası olur. Yani **kopya yok**; aynı zincir paylaşılır, davranış **delegation** ile paylaşılır.

- **Bu pattern (GoF Prototype):** Yeni object'i **mevcut bir object'ten kopyalayarak (clone)** üretmek. Amaç creational: "nasıl yaratırım?" → "kopyalayarak."

|                   | JavaScript prototype                  | Prototype pattern                               |
| ----------------- | ------------------------------------- | ----------------------------------------------- |
| **Ne yapıyor?**   | Property lookup'ta delegation (miras) | Mevcut nesneden kopya alıp yeni nesne üretme    |
| **Kopya var mı?** | Hayır; aynı zinciri paylaşırlar       | Evet; `clone()` ile yeni bağımsız nesne         |
| **Amaç**          | Inheritance / davranış paylaşımı      | Creational: "nasıl yaratırım?" → "kopyalayarak" |

Özetle: JS'teki "prototype" = **miras zinciri**; bu pattern'deki "prototype" = **kopyalanan şablon**.

---

## Özet

- **Prototype** = Mevcut object'ten kopya üreterek yeni instance yaratma; `clone()` ile.
- Creational pattern'ler arasında “nasıl yaratırım?” sorusuna “mevcut olandan kopyalayarak” cevabını verir.
- Karmaşık veya pahalı object oluşturmada, şablon (template) object'ten türetmek için uygundur.

---

**İlgili:** [Design Patterns README](../README.md) · [Composite (Structural)](../../structural/composite/composite.md) · [State (Behavioral)](../../behavioral/state/state.md)
