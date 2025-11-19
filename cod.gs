// ---------------- SOZLAMALAR ----------------
// Kalendar ID (O'zingiznikini tekshirib qo'ying)
const CALENDAR_ID = "674f7a5b80953d166ba3b96318a9ca9c64b0d4a066d1026b5a6aa629a258c0f9@group.calendar.google.com";
const ADMIN_TOKEN = "admin123"; // Admin paroli

function doGet(e) {
  return ContentService.createTextOutput("API Ishlamoqda. HTML fayldan foydalaning.");
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var result = {};
  
  // "Lock" (Qulf) mexanizmi - Bir vaqtda kelgan so'rovlarni navbatga qo'yish uchun
  var lock = LockService.getScriptLock();
  
  try {
    // Kritik jarayonlar (Bron qilish) uchun 10 sekundlik navbat
    if (data.action === "bookRoom" || data.action === "cancelBooking") {
      lock.waitLock(10000); 
    }

    if (data.action === "login") {
      result = handleLogin(data.login, data.password);
    } else if (data.action === "getRooms") {
      result = getRoomStatus(data.floor);
    } else if (data.action === "bookRoom") {
      result = processBooking(data);
    } else if (data.action === "getMyBooking") {
      result = getUserActiveTicket(data.userId);
    } else if (data.action === "cancelBooking") {
      result = cancelUserBooking(data.userId);
    }

  } catch (err) {
    result = { success: false, message: "Server xatosi: " + err.toString() };
  } finally {
    lock.releaseLock(); // Qulfni ochamiz
  }
  
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

// --- 1. LOGIN ---
function handleLogin(login, password) {
  if (login === "admin" && password === ADMIN_TOKEN) return { success: true, role: "admin", name: "Administrator" };
  if (login.length >= 5) return { success: true, role: "student", name: "Talaba ID: " + login, id: login };
  return { success: false, message: "Login yoki parol xato!" };
}

// --- 2. XONALAR HOLATI ---
function getRoomStatus(floor) {
  var calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  var now = new Date();
  // Hozirgi vaqtdan keyingi 1 soatlik oraliqni tekshiramiz
  var events = calendar.getEvents(now, new Date(now.getTime() + 60 * 60 * 1000));
  
  var rooms = [];
  var startRoom = (floor * 100) + 1;
  
  for (var i = 0; i < 6; i++) {
    var rName = (startRoom + i) + "-xona";
    var status = "active"; // Yashil
    var detail = "Bo'sh";
    
    for (var e = 0; e < events.length; e++) {
      if (events[e].getTitle().includes(rName)) {
        status = "busy"; // Qizil
        var end = events[e].getEndTime();
        var endStr = end.getHours() + ":" + (end.getMinutes()<10?'0':'')+end.getMinutes();
        detail = "Band (" + endStr + " gacha)";
        break;
      }
    }
    rooms.push({ number: rName, status: status, detail: detail });
  }
  return { success: true, rooms: rooms };
}

// --- 3. MUKAMMAL BRON QILISH LOGIKASI ---
function processBooking(data) {
  var calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  var now = new Date();
  var startTime = new Date(data.date + "T" + data.time + ":00");
  var endTime = new Date(startTime.getTime() + data.duration * 60000);

  // A) O'TMISHNI TEKSHIRISH
  if (startTime < now) {
    return { success: false, message: "🚫 O'tib ketgan vaqtga bron qilib bo'lmaydi!" };
  }

  // B) LIMIT TEKSHIRISH (Faqat talaba uchun)
  if (data.role !== 'admin') {
    // Kelgusi 24 soat ichida shu talabaning broni bormi?
    var futureEvents = calendar.getEvents(now, new Date(now.getTime() + 24 * 60 * 60 * 1000));
    for (var k = 0; k < futureEvents.length; k++) {
      if (futureEvents[k].getDescription().includes(data.userId)) {
        return { success: false, message: "⛔️ SIZDA FAOL BRON MAVJUD!\nBitta talaba faqat bitta xonani band qila oladi. Avvalgisini bekor qiling yoki tugashini kuting." };
      }
    }
  }

  // C) KONFLIKT (BANDLIK) TEKSHIRISH
  // Aynan shu vaqt oralig'iga tushadigan tadbirlarni qidiramiz
  var conflicts = calendar.getEvents(startTime, endTime);
  for (var i = 0; i < conflicts.length; i++) {
    if (conflicts[i].getTitle().includes(data.room)) {
      var freeAt = conflicts[i].getEndTime();
      var freeAtStr = freeAt.getHours() + ":" + (freeAt.getMinutes()<10?'0':'')+freeAt.getMinutes();
      return { success: false, message: "🔒 ULGURMADINGIZ! Xona band.\nBu xona soat " + freeAtStr + " da bo'shaydi." };
    }
  }

  // D) BRON YARATISH
  calendar.createEvent(data.room + " | " + data.username, startTime, endTime, {
    description: "ID: " + data.userId // ID orqali keyin topamiz
  });
  
  return { success: true, message: "✅ Muvaffaqiyatli! Xona siz uchun band qilindi." };
}

// --- 4. MENING CHIPTAM ---
function getUserActiveTicket(userId) {
  var calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  var now = new Date();
  var events = calendar.getEvents(now, new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000));
  
  for (var i = 0; i < events.length; i++) {
    if (events[i].getDescription().includes(userId)) {
      var start = events[i].getStartTime();
      var end = events[i].getEndTime();
      return {
        hasTicket: true,
        room: events[i].getTitle().split('|')[0].trim(),
        date: start.getDate() + "." + (start.getMonth()+1) + "." + start.getFullYear(),
        time: start.getHours() + ":" + (start.getMinutes()<10?'0':'') + start.getMinutes() + " - " + end.getHours() + ":" + (end.getMinutes()<10?'0':'') + end.getMinutes()
      };
    }
  }
  return { hasTicket: false };
}

// --- 5. BEKOR QILISH ---
function cancelUserBooking(userId) {
  var calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  var now = new Date();
  var events = calendar.getEvents(now, new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000));
  var found = false;
  
  for (var i = 0; i < events.length; i++) {
    if (events[i].getDescription().includes(userId)) {
      events[i].deleteEvent();
      found = true;
      break;
    }
  }
  
  if(found) return { success: true, message: "✅ Bron bekor qilindi. Endi boshqa xona olishingiz mumkin." };
  return { success: false, message: "Bekor qilish uchun faol bron topilmadi." };
}
