# 🏢 Estrada-Art: Auditoriyalarni Band Qilish Tizimi

**Botir Zokirov nomidagi Milliy estrada san’ati instituti** uchun maxsus ishlab chiqilgan raqamli yechim. Ushbu tizim talabalarga o‘quv xonalarini masofadan turib band qilish, ma'muriyatga esa jarayonni nazorat qilish imkonini beradi.

## 🚀 Loyiha Haqida
Bu loyiha **Serverless** (serversiz) arxitekturada qurilgan bo‘lib, ma'lumotlar bazasi sifatida **Google Calendar**, Backend sifatida esa **Google Apps Script** xizmatidan foydalanadi. Bu tizimning barqaror, tez va mutlaqo bepul ishlashini ta'minlaydi.

Tizim **Gibrid interfeysga** ega: Kompyuterda to‘liq ekranli Dashboard, telefonda esa Mobil ilova ko‘rinishiga avtomatik moslashadi.

## ✨ Asosiy Xususiyatlari

### 🔐 Xavfsizlik va Logika
* **Role-Based Access:** Admin (faqat kuzatuv) va Talaba (bron qilish) rejimlari.
* **HEMIS Integratsiyasi (Simulyatsiya):** Talabalar o‘z ID raqamlari orqali tizimga kiradi.
* **Limit Tizimi:** Bitta talaba bir vaqtning o‘zida faqat **1 ta xonani** band qila oladi.
* **Race Condition Protection:** Bir vaqtda ikki kishi bitta xonani bosib qolsa, tizim millisekund farqi bilan birinchisini qabul qiladi, ikkinchisini rad etadi.
* **Vaqt Nazorati:** O‘tib ketgan vaqtga yoki band xonaga bron qilish imkonsiz.

### 📱 Interfeys (Frontend)
* **Responsive Design:** Bootstrap 5 asosida yig‘ilgan. Desktop, Tablet va Mobile qurilmalarda ideal ishlaydi.
* **Real-time Monitoring:** Xonalar holati (Band/Bo‘sh) real vaqt rejimida ranglar orqali ko‘rsatiladi.
* **Mening Chiptam:** Talaba bron qilgan zahoti uning profilida "Faol Bron" kartochkasi paydo bo‘ladi.
* **Bekor Qilish:** Rejalar o‘zgarganda, talaba o‘z bronini bir tugma bilan bekor qila oladi (Google Calendardan avtomatik o‘chadi).

## 🛠 Texnologiyalar
Loyiha quyidagi texnologiyalar asosida yaratildi:

* **Frontend:** HTML5, CSS3, Bootstrap 5, JavaScript (ES6+).
* **Backend:** Google Apps Script (GAS).
* **Database:** Google Calendar API.
* **API:** RESTful API (via GAS Web App).

## ⚙️ O'rnatish va Ishga Tushirish

Loyihani o‘z serveringizda ishlatish uchun quyidagi qadamlarni bajaring:

### 1. Backend (Google)
1.  [Google Apps Script](https://script.google.com/) da yangi loyiha oching.
2.  `Code.gs` fayliga repozitoriydagi backend kodini joylang.
3.  Google Calendar ID ni o‘zgartiring.
4.  Loyihani **Deploy** qiling:
    * `Deploy` -> `New Deployment` -> `Web App`.
    * `Who has access`: **Anyone** (juda muhim!).
5.  Hosil bo‘lgan `Web App URL` ni nusxalab oling.

### 2. Frontend (Server)
1.  `index.html` faylini oching.
2.  `const API_URL = "SIZNING_URL"` qatoriga nusxalab olingan linkni qo‘ying.
3.  Faylni istalgan hostingga yoki lokal serverga joylang.

## 📸 Skrinshotlar

*(Bu yerga loyihangizning login oynasi, dashboard va mobil ko'rinish rasmlarini joylashingiz mumkin)*

---
**Muallif:** Jaxongir Baxtiyarov  
**Bo'lim:** Raqamli ta’lim texnologiyalari markazi (RTTM)
