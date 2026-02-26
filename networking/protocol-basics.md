---
title: Protocol Basics
parent: Networking
nav_order: 1
---

# Protocol nedir? (Protokol Temelleri)

## Protokol Nedir?

**Protocol (protokol)**, iki veya daha fazla tarafın **nasıl iletişim kuracağını** tanımlayan **kurallar setidir**. Hangi sırayla, hangi formatta mesaj gönderileceği, ne anlama geldiği ve hata durumunda ne yapılacağı protokolde yazılıdır.

### Neden Önemli?

- Aynı protokolü kullanan taraflar birbirini anlar; farklı kurallar kullanılırsa iletişim bozulur.
- Ağda (HTTP, TCP, WebSocket vb.) kullandığımız her şey birer protokoldür.
- Protokol kavramını anlamak, sonraki konularda (connection, TCP, HTTP) temel oluşturur.

## Gerçek Hayat Benzeri

- **Trafik kuralları**: Hangi şeritte gidileceği, işaretlerin anlamı — herkes aynı kurallara uyar.
- **Dil**: Gramer ve kelime anlamları — aynı dili konuşanlar anlaşır.
- **Protokol**: Ağda da “dil” ve “sıra” bellidir; cihazlar bu kurallara uyarak veri alışverişi yapar.

## Ağda Örnek Protokoller

| Protokol        | Kısa açıklama                                 |
| --------------- | --------------------------------------------- |
| TCP, UDP        | Veriyi nasıl taşıyacağımız (taşıma katmanı)   |
| HTTP, WebSocket | Uygulama verisinin formatı (uygulama katmanı) |
| IP              | Paketlerin nereye gideceği (adresleme)        |

Katmanlı yapıyı detaylı görmek için bir sonraki adımlara geçebilirsin.

---

**Sonraki:** [Connection (bağlantı) kavramı](connection-basics.md)
