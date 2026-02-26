---
title: Connection Basics
parent: Networking
nav_order: 2
---

# Connection (Bağlantı) Kavramı

## Connection Nedir?

**Connection (bağlantı)**, iki uç (örneğin client–server) arasında kurulmuş, belirli süre boyunca devam eden bir **iletişim kanalıdır**. Bu kanal üzerinden veri gidip gelebilir; kanal kapatılınca iletişim sonlanır.

### Bağlantılı (connection-oriented) vs Bağlantısız (connectionless)

| Özellik           | Bağlantılı                            | Bağlantısız                  |
| ----------------- | ------------------------------------- | ---------------------------- |
| Örnek             | TCP, HTTP oturumu, WebSocket          | UDP, tek paket gönderimi     |
| Önce “el sıkışma” | Evet; bağlantı kurulur                | Hayır; doğrudan paket atılır |
| Durum             | Taraflar “bağlı” kabul edilir         | Her gönderi bağımsız         |
| Güvenilirlik      | Genelde yüksek (kayıp varsa düzeltme) | Garanti yok; hızlı olabilir  |

### Neden Önemli?

- TCP “bağlantılı”, UDP “bağlantısız” denir; HTTP ve WebSocket ise TCP üzerinde çalıştığı için bağlantı kavramıyla iç içedir.
- “Connection” terimi bazen TCP bağlantısı, bazen HTTP oturumu, bazen WebSocket tüneli için kullanılır; bağlamı bilmek faydalıdır.

### "HTTP TCP üzerinde çalışıyor" ne demek?

Ağ iletişimi **katmanlı**dır: üst katman (uygulama) alt katmanı (taşıma) kullanır.

- **Uygulama katmanı (HTTP):** "Ne göndereceğiz?" — istek/cevap formatı, header'lar, metodlar.
- **Taşıma katmanı (TCP):** "Veriyi nasıl taşıyacağız?" — bağlantı kurma, paketlere bölme, sıra ve kayıp kontrolü.

Yani HTTP kuralları sadece **verinin anlamı ve formatını** tanımlar; **gerçek iletimi** TCP yapar. Tarayıcı bir URL istediğinde:

1. Uygulama HTTP'ye göre istek metnini hazırlar (GET, header'lar vb.).
2. Bu veri **TCP'ye** verilir; TCP bağlantı kurar, paketlere böler, sırayla ve güvenilir şekilde gönderir.
3. Sunucuda TCP paketleri birleşir, HTTP mesajı ortaya çıkar; cevap da aynı TCP bağlantısı üzerinden gider.

Özetle: **HTTP "ne" söyleyeceğimizi, TCP "nasıl" ileteceğimizi** belirler. HTTP tek başına ağa paket göndermez; her zaman bir taşıma katmanı (burada TCP) kullanır. WebSocket de aynı şekilde TCP üzerinde çalışır; başlangıçta HTTP upgrade ile aynı TCP kanalı WebSocket'e dönüştürülür.

## Özet

- **Connection** = İki taraf arasında açılmış kanal.
- **Connection-oriented** = Önce bağlantı kurulur, sonra veri taşınır (TCP gibi).
- **Connectionless** = Bağlantı kurulmadan paket gönderilir (UDP gibi).

---

**Sonraki:** [Katmanlı yapı (TCP/IP)](network-layers.md)
