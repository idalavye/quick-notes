---
title: JavaScript Prototype (Inheritance)
parent: Tools
nav_order: 2
---

# JavaScript Prototype Mekanizması (Inheritance / Delegation)

JavaScript'teki **prototype**, nesnelerin **inheritance (miras)** ve **delegation** mekanizmasıdır. Yeni nesne oluşturmak için "kopya" almak değil; property aramada **zincir (chain)** üzerinden başka bir nesneye bakmaktır. Bu yüzden design pattern'deki [Prototype pattern](../design-patterns/creational/prototype/prototype.md) (clone ile yeni instance) ile karıştırılmamalıdır.

---

## Temel kavramlar

### [[Prototype]] ve property lookup

- Her JavaScript object'inin içsel bir **`[[Prototype]]`** bağlantısı vardır (internal slot).
- Bir property'ye erişirken (okuma): önce nesnenin kendi üzerinde aranır; yoksa **prototype zinciri**nde sırayla aranır. Buna **delegation** denir — nesne kendinde yoksa "şablon" nesneye sorar.
- Erişim: `Object.getPrototypeOf(obj)` (önerilen) veya eski `obj.__proto__`.

### Constructor ve .prototype

- Bir **constructor function** (örn. `function User() {}` veya `class User {}`) çağrıldığında, JavaScript onun **`.prototype`** property'sine bakar.
- `new User()` ile oluşturulan instance'ın `[[Prototype]]`'ı, `User.prototype` nesnesine bağlanır.
- Yani: `Object.getPrototypeOf(new User()) === User.prototype` (constructor ile oluşturulduysa).

Bu sayede instance'da tanımlı olmayan method'lar (örn. `User.prototype.sayHi`) zincir üzerinden bulunur; kopya oluşturulmaz, aynı prototype nesnesi paylaşılır.

---

## Örnek: constructor + .prototype

```javascript
function User(name) {
  this.name = name;
}

User.prototype.sayHi = function () {
  console.log('Hi, ' + this.name);
};

const u = new User('Ali');
u.sayHi(); // "Hi, Ali" — sayHi kendi üzerinde yok, User.prototype'tan geldi
console.log(Object.getPrototypeOf(u) === User.prototype); // true
```

---

## Object.create ile prototype zinciri

`new` kullanmadan, doğrudan verilen prototype ile yeni nesne oluşturur:

```javascript
const proto = {
  greet() {
    console.log('Hello');
  },
};
const obj = Object.create(proto);
obj.greet(); // "Hello" — obj'de yok, proto'dan delegation
console.log(Object.getPrototypeOf(obj) === proto); // true
```

---

## Prototype vs Prototype pattern (özet)

|                   | JavaScript prototype                  | Prototype pattern (GoF)                              |
| ----------------- | ------------------------------------- | ---------------------------------------------------- |
| **Ne yapıyor?**   | Property lookup'ta delegation (miras) | Mevcut nesneden kopya (clone) alıp yeni nesne üretme |
| **Kopya var mı?** | Hayır; zincir paylaşılır              | Evet; `clone()` ile bağımsız kopya                   |
| **Amaç**          | Inheritance / davranış paylaşımı      | Creational: "nasıl yaratırım?" → "kopyalayarak"      |

Detay için: [Prototype pattern](../design-patterns/creational/prototype/prototype.md#javascript-prototype-ile-fark).

---

## Özet

- **JavaScript prototype** = Nesnelerin `[[Prototype]]` zinciri; property yoksa zincirde aranır (delegation).
- **Constructor'ın `.prototype`** = `new` ile oluşturulan instance'ların `[[Prototype]]`'ı.
- **Object.create(proto)** = Verilen `proto`'yu `[[Prototype]]` yapan yeni nesne.
- Design pattern'deki Prototype pattern ile aynı kavram değildir; biri delegation, diğeri clone.

---

**İlgili:** [Closures](closures.md) · [Prototype pattern (Design Patterns)](../design-patterns/creational/prototype/prototype.md)
