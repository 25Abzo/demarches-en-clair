const PROCEDURE_URL = "./data/procedures.json";
const CHECKLIST_KEY = "demarches-en-clair-checklist-v1";
const $ = (selector) => document.querySelector(selector);
const modeButtons = [...document.querySelectorAll("[data-mode]")];
let procedure;
let activeMode = "standard";

function renderList(target, items, className) {
  target.replaceChildren();
  for (const item of items) {
    const element = document.createElement("li");
    element.textContent = item;
    if (className) element.className = className;
    target.append(element);
  }
}

function readChecklist() {
  try {
    return JSON.parse(localStorage.getItem(CHECKLIST_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveChecklist() {
  const saved = readChecklist();
  saved[activeMode] = [...$("#personalChecklist").querySelectorAll("input[type=checkbox]")]
    .filter((input) => input.checked)
    .map((input) => input.value);
  try {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(saved));
  } catch {
    // The guide still works if browser storage is unavailable.
  }
}

function renderChecklist(items) {
  const container = $("#personalChecklist");
  const saved = readChecklist()[activeMode] || [];
  container.replaceChildren();
  for (const item of items) {
    const label = document.createElement("label");
    label.className = "memo-item";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = item.id;
    checkbox.checked = saved.includes(item.id);
    const text = document.createElement("span");
    text.textContent = item.label;
    label.append(checkbox, text);
    container.append(label);
  }
}

function renderMode(mode) {
  if (!procedure?.modes?.[mode]) return;
  activeMode = mode;
  const content = procedure.modes[mode];
  for (const button of modeButtons) {
    const selected = button.dataset.mode === mode;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  }

  $("#answerKicker").textContent = content.kicker;
  $("#answerTitle").textContent = content.title;
  $("#answerSummary").textContent = content.summary;
  $("#answerPlaces").textContent = procedure.shared.places;
  $("#helpNumber").textContent = procedure.shared.contact;
  $("#sourceDate").textContent = `Vérifié le ${procedure.source.checkedAtLabel}`;
  $("#sourceLink").href = procedure.source.url;
  $("#sourceLink").textContent = `Ministère de l’Intérieur — ${procedure.source.title}`;
  $("#sourceMeta").textContent = ` · page consultée le ${procedure.source.checkedAtLabel}`;
  renderList($("#answerDocuments"), content.documents);
  renderList($("#answerSteps"), content.steps);
  renderList($("#specialCases"), content.notes, "special-case");
  renderChecklist(content.checklist);
}

function updateConnectionStatus() {
  const status = $("#connectionStatus");
  const offline = !navigator.onLine;
  status.classList.toggle("is-offline", offline);
  if (offline) {
    status.lastChild.textContent = "Hors connexion · fiche locale";
  } else if (navigator.serviceWorker?.controller) {
    status.lastChild.textContent = "Fiche prête hors ligne";
  } else {
    status.lastChild.textContent = "Connexion active";
  }
}

async function start() {
  try {
    const response = await fetch(PROCEDURE_URL, { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    procedure = await response.json();
    renderMode(activeMode);
  } catch {
    $("#answerTitle").textContent = "La fiche n’a pas pu être chargée.";
    $("#answerSummary").textContent = "Connectez-vous une première fois pour enregistrer cette page et la consulter ensuite hors ligne.";
    $("#connectionStatus").classList.add("is-offline");
    $("#connectionStatus").lastChild.textContent = "Fiche non chargée";
  }

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => renderMode(button.dataset.mode));
  });
  $("#personalChecklist").addEventListener("change", saveChecklist);

  const languageButton = $("#languageToggle");
  const languageNotice = $("#languageNotice");
  languageButton.addEventListener("click", () => {
    const open = languageButton.getAttribute("aria-expanded") !== "true";
    languageButton.setAttribute("aria-expanded", String(open));
    languageNotice.hidden = !open;
    if (open) languageNotice.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  window.addEventListener("online", updateConnectionStatus);
  window.addEventListener("offline", updateConnectionStatus);
  navigator.serviceWorker?.addEventListener("controllerchange", updateConnectionStatus);
  updateConnectionStatus();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").then(updateConnectionStatus).catch(() => {});
  }
}

start();
