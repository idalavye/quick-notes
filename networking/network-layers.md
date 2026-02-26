---
title: Network Layers
parent: Networking
nav_order: 3
---

# Katmanlı Yapı (TCP/IP Özet)

## Neden Katmanlar?

Ağ iletişimi tek bir büyük kural seti yerine **katmanlara** bölünmüştür. Her katman kendi işinden sorumludur; üst katmanlar alt katmanları kullanır. Bu sayede TCP, HTTP, WebSocket gibi protokollerin nerede durduğu netleşir.

## Kabaca Katmanlar (TCP/IP modeli)

| Katman (kabaca)         | Örnek protokoller                | Ne işe yarar?                                            |
| ----------------------- | -------------------------------- | -------------------------------------------------------- |
| **Uygulama**            | HTTP, WebSocket (WS), gRPC, MQTT | “Ne söyleyeceğiz?” — mesaj formatı, istek/cevap şekli    |
| **Taşıma**              | TCP, UDP                         | “Paketleri nasıl taşıyacağız?” — güvenilir mi, sıralı mı |
| **Ağ**                  | IP                               | “Nereye gidecek?” — adresleme, yönlendirme               |
| **Bağlantı / Fiziksel** | Ethernet, Wi‑Fi                  | “Sinyal nasıl iletilecek?” — kablo, radyo                |

## Bu Notlarla İlişki

- **TCP, UDP** → Taşıma katmanı.
- **HTTP, WebSocket** → Uygulama katmanı; ikisi de pratikte **TCP üzerinde** çalışır.
- **Connection** kavramı özellikle taşıma katmanında (TCP) ve uygulama katmanında (HTTP oturumu, WebSocket) karşımıza çıkar.

## Özet

- TCP ve UDP **taşıma** protokolleridir.
- HTTP ve WebSocket **uygulama** protokolleridir; TCP’nin üzerinde çalışır.
- IP ve altı **ağ / fiziksel** katman; adresleme ve iletim.

---

**Sonraki:** [TCP](tcp.md)
