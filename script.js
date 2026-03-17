const i18n = {
  ru: {
    "menu.features": "Функции",
    "menu.workflow": "Как работает",
    "menu.privacy": "Политика",
    "menu.support": "Поддержка",
    "hero.eyebrow": "Для реальной съёмочной площадки",
    "hero.title": "Репорт съёмки без бумажных листов и ночного Excel",
    "hero.lead":
      "Создавай проекты, фиксируй дубли, веди заметки и экспортируй отчёт сразу после смены. Всё аккуратно, быстро и по делу.",
    "hero.appstore": "Открыть в App Store",
    "hero.support": "Связаться с поддержкой",
    "stats.one": "Сцены, кадры и дубли в едином потоке",
    "stats.two": "Экспорт в CSV и XLSX",
    "stats.three": "Передача проекта через .clap",
    "features.eyebrow": "Функции",
    "features.title": "Всё, что нужно помощнику режиссёра в смене",
    "f1.title": "Структура проекта",
    "f1.text": "Проект → День → Сцена → Кадр → Дубли. Без хаоса и лишних экранов.",
    "f2.title": "Таймер действия",
    "f2.text": "Точное измерение хронометража прямо на рабочем экране с привязкой к дублю.",
    "f3.title": "Статусы дубля",
    "f3.text": "DAY/NIGHT, INT/EXT, SYNC/MOS, PickUp и заметки с быстрыми тегами.",
    "f4.title": "Техпараметры камеры",
    "f4.text": "Lens, FPS, Shutter, ISO, WB + расширенные параметры с сохранением последних значений.",
    "f5.title": "MultiCam",
    "f5.text": "До 12 камер в проекте, отдельные roll/file и техпараметры для каждой камеры.",
    "f6.title": "Экспорт и перенос",
    "f6.text": "Готовый отчёт в CSV/XLSX и перенос проекта между устройствами через .clap.",
    "workflow.eyebrow": "Как это выглядит в смене",
    "workflow.title": "4 шага от первого кадра до готового отчёта",
    "w1.title": "Создай проект",
    "w1.text": "Добавь базовую информацию и дефолтные параметры камеры.",
    "w2.title": "Веди дубли в рабочем окне",
    "w2.text": "Таймер, статусы, заметки и техданные фиксируются сразу в процессе съёмки.",
    "w3.title": "Сохраняй без рутины",
    "w3.text": "Take автоинкремент, перенос нужных параметров и чистая структура данных.",
    "w4.title": "Экспортируй в конце смены",
    "w4.text": "Получи готовые таблицы и отправь команде без ручного переписывания.",
    "final.title": "ClapKit помогает держать смену под контролем",
    "final.text": "Меньше ручного ввода, меньше ошибок, больше времени на реальную работу на площадке.",
    "final.button": "Написать в поддержку",
    "footer.privacy": "Политика конфиденциальности",
    "footer.support": "Поддержка"
  },
  en: {
    "menu.features": "Features",
    "menu.workflow": "Workflow",
    "menu.privacy": "Privacy",
    "menu.support": "Support",
    "hero.eyebrow": "Built for real shooting days",
    "hero.title": "Shooting logs without paper sheets and late-night Excel",
    "hero.lead":
      "Create projects, capture takes, keep notes, and export reports right after wrap. Clean, fast, and production-ready.",
    "hero.appstore": "Open in App Store",
    "hero.support": "Contact Support",
    "stats.one": "Scenes, shots, and takes in one flow",
    "stats.two": "Export to CSV and XLSX",
    "stats.three": "Project transfer via .clap",
    "features.eyebrow": "Features",
    "features.title": "Everything an assistant director needs on set",
    "f1.title": "Project Structure",
    "f1.text": "Project → Day → Scene → Shot → Takes. No chaos and no extra screens.",
    "f2.title": "Action Timer",
    "f2.text": "Precise action duration directly on the workspace screen, linked to each take.",
    "f3.title": "Take States",
    "f3.text": "DAY/NIGHT, INT/EXT, SYNC/MOS, PickUp, plus notes with quick tags.",
    "f4.title": "Camera Tech",
    "f4.text": "Lens, FPS, Shutter, ISO, WB and extended parameters with last-value persistence.",
    "f5.title": "MultiCam",
    "f5.text": "Up to 12 cameras per project, each with its own roll/file and tech settings.",
    "f6.title": "Export and Transfer",
    "f6.text": "Ready-to-share CSV/XLSX reports and project transfer between devices using .clap.",
    "workflow.eyebrow": "How it works on set",
    "workflow.title": "4 steps from first shot to final report",
    "w1.title": "Create a project",
    "w1.text": "Add production details and default camera settings.",
    "w2.title": "Log takes live",
    "w2.text": "Timer, states, notes, and technical data are captured in real time.",
    "w3.title": "Save faster",
    "w3.text": "Take auto-increment, carry-over values, and a clean structured data flow.",
    "w4.title": "Export at wrap",
    "w4.text": "Generate clean reports and share with the team with no manual rewrite.",
    "final.title": "ClapKit keeps your shooting day under control",
    "final.text": "Less manual typing, fewer mistakes, and more focus on real set work.",
    "final.button": "Message Support",
    "footer.privacy": "Privacy Policy",
    "footer.support": "Support"
  }
};

const docLang = (lang) => {
  const locale = i18n[lang] ? lang : "en";
  document.documentElement.lang = locale;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = i18n[locale][key];
    if (value) el.textContent = value;
  });

  document.querySelectorAll(".lang-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === locale);
  });

  localStorage.setItem("clapkit-site-lang", locale);
};

const initLanguage = () => {
  const saved = localStorage.getItem("clapkit-site-lang");
  const browser = navigator.language?.toLowerCase().startsWith("ru") ? "ru" : "en";
  const initial = saved || browser || "en";
  docLang(initial);

  document.querySelectorAll(".lang-btn").forEach((button) => {
    button.addEventListener("click", () => docLang(button.dataset.lang));
  });
};

const initFooterYear = () => {
  const yearNode = document.getElementById("year");
  if (yearNode) yearNode.textContent = new Date().getFullYear();
};

initLanguage();
initFooterYear();
