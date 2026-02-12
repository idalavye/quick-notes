# Design Pattern Tipleri – Özet

Design pattern'ler **Gang of Four (GoF)** sınıflandırmasına göre **3 ana tipe** ayrılır. Her tip, farklı bir tasarım problemini çözmeye odaklanır.

---

## 1. Creational (Yaratımsal) Pattern'ler

**Ne işe yarar:** Object'lerin **nasıl oluşturulacağını** tanımlar. Doğrudan `new` kullanmak yerine, object yaratma sürecini soyutlar veya kontrol altına alır.

**Temel fikir:** Object oluşturma mantığını gizleyerek sistemi daha esnek ve değişime açık hale getirmek.

**Örnek pattern'ler:**

- **Factory** – Object oluşturmayı tek bir yere toplar
- **Builder** – Karmaşık object'leri adım adım kurar
- **Singleton** – Tek bir **instance** garanti eder
- **Prototype** – Mevcut object'ten kopya üretir
- **Abstract Factory** – İlişkili object ailelerini birlikte üretir

**Ne zaman kullanılır:** Object yaratma karmaşık, koşula bağlı veya tekrarlı olduğunda.

---

## 2. Structural (Yapısal) Pattern'ler

**Ne işe yarar:** Class'lar ve object'lerin **nasıl bir araya getirileceğini** (composition, inheritance) düzenler. Büyük yapıları küçük parçalardan oluşturmayı veya mevcut yapıları uyumlu hale getirmeyi hedefler.

**Temel fikir:** Object'ler arası ilişkileri düzenleyerek esnek ve yeniden kullanılabilir yapılar kurmak.

**Örnek pattern'ler:**

- **Adapter** – Uyumsuz interface'leri birbirine bağlar
- **Decorator** – Object'lere davranış ekleyerek sarmalar
- **Facade** – Karmaşık alt sistemlere basit bir interface sunar
- **Proxy** – Bir object'e erişimi kontrol eder veya sadeleştirir
- **Composite** – Object'leri ağaç yapısında birleştirir → [Composite](./structural/composite/composite.md)

**Ne zaman kullanılır:** Class'ların birbirine bağlanma şeklini sadeleştirmek veya mevcut kodu değiştirmeden genişletmek gerektiğinde.

**Temel kavramlar:** Structural tasarım **composition** ve **inheritance** üzerine kurulur. Detay ve TypeScript örnekleri için → [Composition ve Inheritance](./structural/composition-inheritance.md).

---

## 3. Behavioral (Davranışsal) Pattern'ler

**Ne işe yarar:** Object'ler arasındaki **görev dağılımını ve iletişimi** (kim ne yapacak, nasıl haberleşecek) tanımlar. Algoritmaların ve sorumlulukların object'ler arasında nasıl paylaşılacağına odaklanır.

**Temel fikir:** Davranışları object'lerden ayırarak veya object'ler arası etkileşimi standartlaştırarak daha esnek ve bakımı kolay kod yazmak.

**Örnek pattern'ler:**

- **Observer** – Bir değişiklik olduğunda ilgili object'leri otomatik bildirir
- **Strategy** – Algoritmayı object'ten ayırıp değiştirilebilir yapar
- **Command** – İstekleri object olarak paketleyip geçmişini tutar / geri alınabilir yapar
- **State** – Object'in state'ine göre davranışını değiştirir
- **Chain of Responsibility** – İsteği bir zincirdeki object'lere sırayla iletir

**Ne zaman kullanılır:** Object'ler arası iletişim, state yönetimi veya algoritma seçimi karmaşıklaştığında.

---

## Kısa Karşılaştırma

| Tip            | Odak noktası                  | Soru                                 |
| -------------- | ----------------------------- | ------------------------------------ |
| **Creational** | Object oluşturma              | “Bu object'i nasıl yaratırım?”       |
| **Structural** | Object'lerin bir araya gelişi | “Bunları nasıl birleştiririm?”       |
| **Behavioral** | Object'ler arası etkileşim    | “Bunlar birbirine nasıl davranacak?” |

Bu üç tip birlikte, object'lerin **yaratılması**, **yapılandırılması** ve **davranışının** nasıl tasarlanacağını kapsar.
