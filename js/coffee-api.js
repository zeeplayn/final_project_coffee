// API: https://api.sampleapis.com/coffee/hot
// The API is public and many people can edit it, so some records are broken or duplicated.

const COFFEE_API_URL = "https://api.sampleapis.com/coffee/hot";
const REQUEST_TIMEOUT = 10000;

let allCoffees = [];

const listEl = document.querySelector("#coffee-list");
const statusEl = document.querySelector("#coffee-status");
const searchEl = document.querySelector("#coffee-search");
const filterEl = document.querySelector("#ingredient-filter");
const countEl = document.querySelector("#coffee-count");


function cleanIngredient(text) {
  return String(text).replace(/\*+$/, "").trim();
}

function normalizeCoffee(raw) {
  if (!raw || typeof raw !== "object") return null;

  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const description = typeof raw.description === "string" ? raw.description.trim() : "";
  if (title === "" || description.length < 10) return null;   // too short = test data

  const ingredients = Array.isArray(raw.ingredients)
    ? raw.ingredients.map(cleanIngredient).filter(function (i) { return i !== ""; })
    : [];

  const image = typeof raw.image === "string" && raw.image.startsWith("https://") ? raw.image : "";

  return { id: raw.id, title: title, description: description, ingredients: ingredients, image: image };
}

function prepareData(data) {
  const seen = new Set();
  const result = [];
  data.forEach(function (raw) {
    const coffee = normalizeCoffee(raw);
    if (!coffee) return;
    if (coffee.id !== undefined) {
      if (seen.has(coffee.id)) return;
      seen.add(coffee.id);
    }
    result.push(coffee);
  });
  return result;
}


function showLoading() {
  statusEl.textContent = "";
  const spinner = document.createElement("div");
  spinner.className = "spinner-border spinner-border-sm me-2";
  spinner.setAttribute("aria-hidden", "true");
  statusEl.appendChild(spinner);
  statusEl.appendChild(document.createTextNode("Loading coffee..."));
  statusEl.hidden = false;
  listEl.textContent = "";
  countEl.textContent = "";
}

function showError(message) {
  statusEl.textContent = "";
  const box = document.createElement("div");
  box.className = "alert alert-danger";
  box.textContent = message;

  const retry = document.createElement("button");
  retry.type = "button";
  retry.className = "btn btn-brown btn-sm ms-3";
  retry.textContent = "Try again";
  retry.addEventListener("click", loadHotCoffee);
  box.appendChild(retry);

  statusEl.appendChild(box);
  statusEl.hidden = false;
  listEl.textContent = "";
  countEl.textContent = "";
}

function hideStatus() {
  statusEl.textContent = "";
  statusEl.hidden = true;
}


async function loadHotCoffee() {
  if (!listEl) return;

  showLoading();


  const controller = new AbortController();
  const timer = setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT);

  try {
    const response = await fetch(COFFEE_API_URL, { signal: controller.signal });

    if (!response.ok) {                       
      throw new Error("HTTP error: " + response.status);
    }

    const data = await response.json(); 

    if (!Array.isArray(data)) {
      throw new Error("Unexpected API response format.");
    }

    allCoffees = prepareData(data);
    fillIngredientFilter();
    hideStatus();
    applyFilters();
  } catch (error) {
    console.error("Unable to load hot coffee:", error);
    showError("Coffee data is temporarily unavailable. Please try again later.");
  } finally {
    clearTimeout(timer);
  }
}


function createCard(coffee) {
  const card = document.createElement("article");
  card.className = "coffee-card";

  if (coffee.image) {
    const img = document.createElement("img");
    img.src = coffee.image;
    img.alt = coffee.title;
    img.loading = "lazy";
    img.addEventListener("error", function () {
      const placeholder = document.createElement("div");
      placeholder.className = "coffee-img-placeholder";
      placeholder.textContent = "☕";
      img.replaceWith(placeholder);
    });
    card.appendChild(img);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "coffee-img-placeholder";
    placeholder.textContent = "☕";
    card.appendChild(placeholder);
  }

  const body = document.createElement("div");
  body.className = "coffee-card-body";

  const title = document.createElement("h3");
  title.textContent = coffee.title;
  body.appendChild(title);

  const desc = document.createElement("p");
  desc.textContent = coffee.description;
  body.appendChild(desc);

  if (coffee.ingredients.length > 0) {
    const label = document.createElement("p");
    label.className = "ingredients-label";
    label.textContent = "Ingredients:";
    body.appendChild(label);

    const chips = document.createElement("ul");
    chips.className = "chips";
    coffee.ingredients.forEach(function (name) {
      const li = document.createElement("li");
      li.className = "chip";
      li.textContent = name;
      chips.appendChild(li);
    });
    body.appendChild(chips);
  }

  card.appendChild(body);
  return card;
}

function renderCoffee(list) {
  listEl.textContent = "";

  if (list.length === 0) {                     
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No drinks found. Try another name or choose \"All ingredients\".";
    listEl.appendChild(empty);
    return;
  }

  list.forEach(function (coffee) {
    listEl.appendChild(createCard(coffee));
  });
}




function fillIngredientFilter() {
  const found = new Map();                    
  allCoffees.forEach(function (coffee) {
    coffee.ingredients.forEach(function (name) {
      const key = name.toLowerCase();
      if (!found.has(key)) found.set(key, name);
    });
  });

  filterEl.textContent = "";
  const all = document.createElement("option");
  all.value = "";
  all.textContent = "All ingredients";
  filterEl.appendChild(all);

  Array.from(found.entries())
    .sort(function (a, b) { return a[1].localeCompare(b[1]); })
    .forEach(function (entry) {
      const option = document.createElement("option");
      option.value = entry[0];
      option.textContent = entry[1];
      filterEl.appendChild(option);
    });
}

function applyFilters() {
  const query = searchEl.value.toLowerCase().trim();
  const ingredient = filterEl.value;

  const result = allCoffees.filter(function (coffee) {
    const nameMatch = coffee.title.toLowerCase().includes(query);
    const ingredientMatch = ingredient === "" || coffee.ingredients.some(function (i) {
      return i.toLowerCase() === ingredient;
    });
    return nameMatch && ingredientMatch;
  });

  renderCoffee(result);
  countEl.textContent = "Showing " + result.length + " of " + allCoffees.length + " drinks";
}

if (listEl) {
  searchEl.addEventListener("input", applyFilters);
  filterEl.addEventListener("change", applyFilters);
  loadHotCoffee();
}
