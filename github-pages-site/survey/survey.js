(function () {
  "use strict";

  const LOCAL_RESULTS_KEY = "clapkit-crew-survey-responses-v1";

  const ui = {
    ru: {
      requiredMark: "*",
      requiredHint: "Обязательный вопрос",
      fillRequired: "Пожалуйста, заполните обязательные поля.",
      submitPending: "Отправляем...",
      submitIdle: "Отправить анонимно",
      successRemote: "Спасибо, что поделились опытом. Хорошего дня!",
      successLocal: "Спасибо, что поделились опытом. Хорошего дня! Ответ временно сохранён локально.",
      successFallback: "Спасибо, что поделились опытом. Хорошего дня! Ответ временно сохранён локально.",
      errorGeneric: "Не удалось отправить ответ. Попробуйте ещё раз.",
      modeSupabase: "Хранилище: защищённая база (Supabase)",
      modeWebhook: "Хранилище: webhook endpoint",
      modeLocal: "Хранилище: локальный режим (только этот браузер)",
      modeUnknown: "Хранилище: не настроено, используется локальный режим"
    },
    en: {
      requiredMark: "*",
      requiredHint: "Required",
      fillRequired: "Please complete required fields.",
      submitPending: "Submitting...",
      submitIdle: "Submit Anonymously",
      successRemote: "Thanks for sharing your experience. Have a great day!",
      successLocal: "Thanks for sharing your experience. Have a great day! Saved locally for now.",
      successFallback: "Thanks for sharing your experience. Have a great day! Saved locally for now.",
      errorGeneric: "Could not send your response. Please try again.",
      modeSupabase: "Storage: secure database (Supabase)",
      modeWebhook: "Storage: webhook endpoint",
      modeLocal: "Storage: local mode (this browser only)",
      modeUnknown: "Storage: not configured, using local mode"
    }
  };

  const universalQuestions = [
    {
      id: "role_in_cinema",
      type: "text",
      required: true,
      label: {
        ru: "Кем вы работаете в кино?",
        en: "What is your role in film production?"
      },
      placeholder: {
        ru: "Например: script supervisor, фокус-пуллер, реквизитор",
        en: "For example: script supervisor, focus puller, prop master"
      }
    },
    {
      id: "apps_on_phone",
      type: "textarea",
      required: true,
      label: {
        ru: "Какие приложения вы используете на телефоне в работе?",
        en: "Which apps do you use on your phone for work?"
      },
      placeholder: {
        ru: "Перечислите приложения и зачем каждое нужно",
        en: "List the apps and what each one is used for"
      }
    },
    {
      id: "work_sequence_on_set",
      type: "textarea",
      required: true,
      label: {
        ru: "Опишите последовательность ваших действий при работе на площадке.",
        en: "Describe the sequence of your actions while working on set."
      },
      placeholder: {
        ru: "Коротко по шагам",
        en: "Short step-by-step answer"
      }
    },
    {
      id: "phone_tasks",
      type: "textarea",
      required: true,
      label: {
        ru: "Что чаще всего делаете на телефоне во время работы?",
        en: "What do you do most often on your phone during work?"
      },
      placeholder: {
        ru: "Опишите основные действия в телефоне в течение смены",
        en: "Describe your main phone actions during the shoot day"
      }
    },
    {
      id: "data_storage_places",
      type: "textarea",
      required: true,
      label: {
        ru: "Где сейчас хранятся рабочие данные с телефона?",
        en: "Where is your phone work data currently stored?"
      },
      placeholder: {
        ru: "Например: заметки, чаты, галерея, таблицы, облако",
        en: "For example: notes, chats, gallery, spreadsheets, cloud"
      }
    },
    {
      id: "time_consuming_data_actions",
      type: "textarea",
      required: true,
      label: {
        ru: "Какие действия, связанные с передачей, хранением и обработкой информации с площадки, занимают больше всего времени?",
        en: "Which actions related to transferring, storing, and processing set data take the most time?"
      }
    },
    {
      id: "data_loss_points",
      type: "textarea",
      required: true,
      label: {
        ru: "Где чаще всего теряется информация или появляются ошибки при передаче данных?",
        en: "Where does information most often get lost, or where do errors appear in data handoff?"
      }
    },
    {
      id: "hard_to_find_data",
      type: "textarea",
      required: true,
      label: {
        ru: "Какие данные вам сложнее всего быстро найти в течение смены?",
        en: "Which data is hardest for you to find quickly during a shoot day?"
      }
    },
    {
      id: "automation_wishlist",
      type: "textarea",
      required: true,
      label: {
        ru: "Что бы вы хотели автоматизировать в первую очередь?",
        en: "What would you like to automate first?"
      }
    },
    {
      id: "open_ideas",
      type: "textarea",
      required: false,
      label: {
        ru: "Свободное поле: любые идеи, пожелания и боли, которые мы не спросили.",
        en: "Open field: any ideas, requests, or pain points we did not ask about."
      },
      placeholder: {
        ru: "Пишите свободно",
        en: "Write anything useful"
      }
    }
  ];

  const form = document.getElementById("crew-survey-form");
  const questionsWrap = document.getElementById("survey-questions-wrap");
  const questionsRoot = document.getElementById("survey-questions");
  const statusNode = document.getElementById("survey-status");
  const submitButton = document.getElementById("survey-submit");
  const storageNode = document.getElementById("survey-storage-mode");

  if (!form || !questionsWrap || !questionsRoot || !statusNode || !submitButton) {
    return;
  }

  function lang() {
    return document.documentElement.lang === "ru" ? "ru" : "en";
  }

  function text(messageByLang) {
    return messageByLang[lang()] || messageByLang.en;
  }

  function getConfig() {
    return typeof window.CK_SURVEY_CONFIG === "object" && window.CK_SURVEY_CONFIG ? window.CK_SURVEY_CONFIG : {};
  }

  function getMode() {
    const config = getConfig();
    const mode = typeof config.mode === "string" ? config.mode.toLowerCase().trim() : "";
    if (mode === "supabase" || mode === "webhook" || mode === "local") return mode;
    return "local";
  }

  function applyStatusType(type) {
    statusNode.classList.remove("is-error", "is-success", "is-info");
    if (type === "error") statusNode.classList.add("is-error");
    if (type === "success") statusNode.classList.add("is-success");
    if (type === "info") statusNode.classList.add("is-info");
  }

  function setStatus(message, type) {
    statusNode.textContent = message;
    applyStatusType(type);
  }

  function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? ui[lang()].submitPending : ui[lang()].submitIdle;
  }

  function renderStorageMode() {
    if (!storageNode) return;

    const config = getConfig();
    const mode = getMode();

    if (mode === "supabase" && config.supabaseUrl && config.supabaseAnonKey && config.supabaseTable) {
      storageNode.textContent = ui[lang()].modeSupabase;
      return;
    }

    if (mode === "webhook" && config.webhookUrl) {
      storageNode.textContent = ui[lang()].modeWebhook;
      return;
    }

    if (mode === "local") {
      storageNode.textContent = ui[lang()].modeLocal;
      return;
    }

    storageNode.textContent = ui[lang()].modeUnknown;
  }

  function createQuestionTitle(question, index) {
    const title = document.createElement("p");
    title.className = "survey-question-title";

    const label = document.createElement("span");
    label.className = "survey-question-index";
    label.textContent = `${index + 1}.`;

    const textNode = document.createElement("span");
    textNode.textContent = text(question.label);

    title.append(label, textNode);

    if (question.required) {
      const required = document.createElement("span");
      required.className = "survey-required-mark";
      required.textContent = ` ${ui[lang()].requiredMark}`;
      required.title = ui[lang()].requiredHint;
      title.append(required);
    }

    return title;
  }

  function createOptionInput(question, option, name) {
    const labelNode = document.createElement("label");
    labelNode.className = "survey-option";

    const input = document.createElement("input");
    input.type = question.type === "multi" ? "checkbox" : "radio";
    input.name = name;
    input.value = option.value;

    const textNode = document.createElement("span");
    textNode.textContent = text(option.label);

    labelNode.append(input, textNode);
    return labelNode;
  }

  function createQuestionNode(question, index) {
    const wrapper = document.createElement("fieldset");
    wrapper.className = "survey-question";
    wrapper.dataset.questionId = question.id;

    const legend = createQuestionTitle(question, index);
    wrapper.appendChild(legend);

    const name = `q_${question.id}`;

    if (question.type === "text") {
      const input = document.createElement("input");
      input.className = "survey-input";
      input.name = name;
      input.type = "text";
      input.maxLength = 140;
      input.autocomplete = "off";
      if (question.placeholder) {
        input.placeholder = text(question.placeholder);
      }
      wrapper.appendChild(input);
      return wrapper;
    }

    if (question.type === "textarea") {
      const area = document.createElement("textarea");
      area.className = "survey-textarea";
      area.name = name;
      area.rows = 4;
      area.maxLength = 2000;
      if (question.placeholder) {
        area.placeholder = text(question.placeholder);
      }
      wrapper.appendChild(area);
      return wrapper;
    }

    if (question.type === "single" || question.type === "multi") {
      const options = document.createElement("div");
      options.className = "survey-options";

      question.options.forEach((option) => {
        options.appendChild(createOptionInput(question, option, name));
      });

      wrapper.appendChild(options);
      return wrapper;
    }

    return wrapper;
  }

  function captureDraft() {
    const answers = {};

    universalQuestions.forEach((question) => {
      const name = `q_${question.id}`;

      if (question.type === "text" || question.type === "textarea") {
        const node = form.elements[name];
        answers[question.id] = node && typeof node.value === "string" ? node.value : "";
        return;
      }

      if (question.type === "single") {
        const checked = questionsRoot.querySelector(`input[name="${name}"]:checked`);
        answers[question.id] = checked ? checked.value : "";
        return;
      }

      if (question.type === "multi") {
        const checked = questionsRoot.querySelectorAll(`input[name="${name}"]:checked`);
        answers[question.id] = Array.from(checked).map((node) => node.value);
      }
    });

    return { answers };
  }

  function restoreDraft(draft) {
    if (!draft) return;

    universalQuestions.forEach((question) => {
      const value = draft.answers[question.id];
      const name = `q_${question.id}`;

      if (question.type === "text" || question.type === "textarea") {
        const node = form.elements[name];
        if (node && typeof value === "string") node.value = value;
        return;
      }

      if (question.type === "single" && typeof value === "string" && value) {
        const node = Array.from(questionsRoot.querySelectorAll(`input[name="${name}"]`)).find(
          (input) => input.value === value
        );
        if (node) node.checked = true;
        return;
      }

      if (question.type === "multi" && Array.isArray(value)) {
        value.forEach((entry) => {
          const node = Array.from(questionsRoot.querySelectorAll(`input[name="${name}"]`)).find(
            (input) => input.value === entry
          );
          if (node) node.checked = true;
        });
      }
    });
  }

  function renderQuestions() {
    questionsRoot.innerHTML = "";

    universalQuestions.forEach((question, index) => {
      questionsRoot.appendChild(createQuestionNode(question, index));
    });

    questionsWrap.hidden = false;
  }

  function markQuestionInvalid(questionId, invalid) {
    const questionNode = questionsRoot.querySelector(`[data-question-id="${questionId}"]`);
    if (!questionNode) return;
    questionNode.classList.toggle("is-invalid", invalid);
  }

  function clearInvalidFromEvent(target) {
    if (!(target instanceof HTMLElement)) return;
    const questionNode = target.closest(".survey-question");
    if (!questionNode) return;
    questionNode.classList.remove("is-invalid");
  }

  function readQuestionAnswer(question) {
    const name = `q_${question.id}`;

    if (question.type === "text" || question.type === "textarea") {
      const node = form.elements[name];
      return node && typeof node.value === "string" ? node.value.trim() : "";
    }

    if (question.type === "single") {
      const checked = questionsRoot.querySelector(`input[name="${name}"]:checked`);
      return checked ? checked.value : "";
    }

    if (question.type === "multi") {
      const checked = questionsRoot.querySelectorAll(`input[name="${name}"]:checked`);
      return Array.from(checked).map((node) => node.value);
    }

    return "";
  }

  function collectAnswers() {
    const answers = {};
    const invalid = [];

    universalQuestions.forEach((question) => {
      const answer = readQuestionAnswer(question);
      answers[question.id] = answer;

      let hasValue = false;
      if (question.type === "multi") {
        hasValue = Array.isArray(answer) && answer.length > 0;
      } else {
        hasValue = typeof answer === "string" ? answer.length > 0 : !!answer;
      }

      const questionInvalid = question.required && !hasValue;
      markQuestionInvalid(question.id, questionInvalid);
      if (questionInvalid) invalid.push(question.id);
    });

    return { answers, invalid };
  }

  function generateResponseId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return `resp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }

  function storeLocal(payload) {
    const raw = localStorage.getItem(LOCAL_RESULTS_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    existing.push(payload);

    if (existing.length > 500) {
      existing.splice(0, existing.length - 500);
    }

    localStorage.setItem(LOCAL_RESULTS_KEY, JSON.stringify(existing));
  }

  async function storeWebhook(payload, config) {
    const baseUrl = typeof config.webhookUrl === "string" ? config.webhookUrl.trim() : "";
    if (!baseUrl) throw new Error("Webhook URL is missing.");

    const token = typeof config.webhookToken === "string" ? config.webhookToken.trim() : "";
    const useNoCors = config.webhookNoCors === true;

    const url = token
      ? `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}`
      : baseUrl;

    const response = await fetch(url, {
      method: "POST",
      mode: useNoCors ? "no-cors" : "cors",
      headers: {
        "Content-Type": useNoCors ? "text/plain;charset=utf-8" : "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (useNoCors) return;

    if (!response.ok) {
      throw new Error(`Webhook request failed (${response.status}).`);
    }
  }

  async function storeSupabase(payload, config) {
    const baseUrl = typeof config.supabaseUrl === "string" ? config.supabaseUrl.trim().replace(/\/$/, "") : "";
    const anonKey = typeof config.supabaseAnonKey === "string" ? config.supabaseAnonKey.trim() : "";
    const table = typeof config.supabaseTable === "string" ? config.supabaseTable.trim() : "";

    if (!baseUrl || !anonKey || !table) {
      throw new Error("Supabase config is incomplete.");
    }

    const response = await fetch(`${baseUrl}/rest/v1/${encodeURIComponent(table)}`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        response_id: payload.responseId,
        submitted_at: payload.submittedAt,
        department: payload.department,
        custom_department: payload.customDepartment,
        locale: payload.locale,
        answers: payload.answers,
        source: payload.source
      })
    });

    if (!response.ok) {
      throw new Error(`Supabase insert failed (${response.status}).`);
    }
  }

  async function saveResponse(payload) {
    const config = getConfig();
    const mode = getMode();

    if (mode === "local") {
      storeLocal(payload);
      return { mode: "local" };
    }

    try {
      if (mode === "supabase") {
        await storeSupabase(payload, config);
        return { mode: "remote" };
      }

      if (mode === "webhook") {
        await storeWebhook(payload, config);
        return { mode: "remote" };
      }

      storeLocal(payload);
      return { mode: "local" };
    } catch {
      storeLocal(payload);
      return { mode: "fallback" };
    }
  }

  function resetFormState() {
    form.reset();
    renderQuestions();
  }

  async function onSubmit(event) {
    event.preventDefault();

    const { answers, invalid } = collectAnswers();
    if (invalid.length > 0) {
      setStatus(ui[lang()].fillRequired, "error");
      const firstInvalid = questionsRoot.querySelector(`[data-question-id="${invalid[0]}"]`);
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const roleTitle = typeof answers.role_in_cinema === "string" ? answers.role_in_cinema : "";
    const payload = {
      responseId: generateResponseId(),
      submittedAt: new Date().toISOString(),
      department: roleTitle || "unspecified",
      customDepartment: null,
      locale: lang(),
      answers,
      source: "clapkit_site_survey_v3_phone_workflow"
    };

    setLoading(true);
    setStatus("", "info");

    try {
      const result = await saveResponse(payload);

      let statusMessage = ui[lang()].successRemote;
      let statusType = "success";

      if (result.mode === "remote") {
        statusMessage = ui[lang()].successRemote;
        statusType = "success";
      } else if (result.mode === "fallback") {
        statusMessage = ui[lang()].successFallback;
        statusType = "info";
      } else {
        statusMessage = ui[lang()].successLocal;
        statusType = "info";
      }
      setStatus(statusMessage, statusType);

      resetFormState();
      renderStorageMode();
    } catch {
      setStatus(ui[lang()].errorGeneric, "error");
    } finally {
      setLoading(false);
    }
  }

  function onLanguageChange() {
    const draft = captureDraft();

    renderStorageMode();
    setLoading(false);
    renderQuestions();
    restoreDraft(draft);
  }

  form.addEventListener("submit", onSubmit);
  questionsRoot.addEventListener("input", (event) => clearInvalidFromEvent(event.target));
  questionsRoot.addEventListener("change", (event) => clearInvalidFromEvent(event.target));
  document.addEventListener("clapkit:languagechange", onLanguageChange);

  renderQuestions();
  renderStorageMode();
})();
