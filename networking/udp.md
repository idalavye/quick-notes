---
title: UDP
parent: Networking
nav_order: 5
---

# UDP (User Datagram Protocol)

## UDP Nedir?

**UDP**, taşıma katmanında kullanılan **bağlantısız (connectionless)** bir protokoldür. Hedef adrese paket gönderilir; “bağlantı kurma” veya “kayıp düzeltme” yoktur. Bu yüzden **düşük gecikme** ve **basitlik** sunar.

### Temel Özellikler

- **Bağlantısız**: El sıkışma yok; doğrudan paket (datagram) gönderilir.
- **Güvenilir değil**: Paket kaybolursa veya sırası bozulursa UDP bunu düzeltmez.
- **Hızlı**: Ek kontrol ve yeniden gönderim olmadığı için gecikme düşük olabilir.
- **Mesaj odaklı**: Her gönderi ayrı bir “datagram”; TCP’deki gibi sürekli byte akışı değil.

### Neden Önemli?

- Canlı video/audio, oyun, VoIP gibi **gecikmenin kritik** olduğu senaryolarda tercih edilir.
- DNS sorguları gibi kısa, tek seferlik isteklerde de UDP kullanılır.
- TCP ile karşılaştırınca “güvenilirlik mi, hız mı?” trade-off’u netleşir.

## TCP vs UDP (özet)

| Özellik        | TCP                  | UDP                  |
| -------------- | -------------------- | -------------------- |
| Bağlantı       | Evet                 | Hayır                |
| Kayıp / sıra   | Düzeltilir           | Düzeltilmez          |
| Gecikme        | Genelde daha yüksek  | Daha düşük olabilir  |
| Örnek kullanım | HTTP, WebSocket, SSH | Oyun, streaming, DNS |

## Özet

- UDP = Bağlantısız, hızlı, güvenilirliği garanti etmeyen taşıma protokolü.
- Web tarafında çoğu zaman TCP (ve üzerinde HTTP/WebSocket) kullanılır; UDP özellikle gerçek zamanlı ve canlı trafikte öne çıkar.

---

**Sonraki:** [HTTP](http.md)
