/* =========================================
   ELEMENTS
========================================= */

const myform = document.querySelector("#search-form");
const myInput = document.querySelector("#country-input");
const clearButton = document.querySelector("#clear-button");
const facts = document.querySelector("#facts");
const themeToggle = document.querySelector("#theme-toggle");

const API_KEY = "rc_live_7dd3840ff4004c8abedb2457f49d46de"; 


/* =========================================
   UI STATES (LOADING & ERROR)
========================================= */

function showLoading() {
  facts.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Exploring country information...</p>
    </div>
  `;
}

function showError(message) {
  facts.innerHTML = `
    <div class="error-box">
      <div class="error-icon">🌍</div>
      <h3>Something went wrong</h3>
      <p>${message}</p>
    </div>
  `;
}


/* =========================================
   HELPERS & STAT RENDERER
========================================= */

function createStat(icon, label, value) {
  return `
    <div class="stat">
      <div class="stat-icon">${icon}</div>
      <span class="stat-label">${label}</span>
      <span class="stat-value">${value}</span>
    </div>
  `;
}

function getCapital(country) {
  if (!country.capitals || country.capitals.length === 0) {
    return "N/A";
  }
  return country.capitals[0].name || "N/A";
}

function getCurrency(country) {
  if (!country.currencies || country.currencies.length === 0) {
    return "N/A";
  }
  const curr = country.currencies[0];
  return `${curr.code || ""} — ${curr.name || ""}`;
}


/* =========================================
   RENDER COUNTRY (MATCHES STYLE.CSS)
========================================= */

function renderCountry(country) {
  const commonName = country.names?.common || "Unknown";
  const officialName = country.names?.official || commonName;
  const capital = getCapital(country);
  const population = country.population ? country.population.toLocaleString() : "N/A";
  const region = country.region || "N/A";
  const subregion = country.subregion || "N/A";
  const currency = getCurrency(country);
  const flagSvg = country.flag?.url_svg || country.flag?.url_png || "";
  const flagEmoji = country.flag?.emoji || "🌍";

  facts.innerHTML = `
    <!-- COUNTRY TOP -->
    <div class="country-top">
      <div class="country-info">
        <div class="country-location">
          📍 ${region}
        </div>

        <div class="country-heading">
          ${
            flagSvg
              ? `<img class="small-flag" src="${flagSvg}" alt="Flag of ${commonName}">`
              : `<div class="small-flag emoji-flag">${flagEmoji}</div>`
          }
          <div>
            <h2>${commonName}</h2>
          </div>
        </div>

        <p class="country-description">
          ${officialName}
        </p>
      </div>

      <!-- PHOTO PREVIEW -->
      <div class="country-photo">
        <div class="photo-label">
          📍 ${capital}, ${commonName}
        </div>
      </div>
    </div>

    <!-- COUNTRY BOTTOM (STATS & BIG FLAG) -->
    <div class="country-bottom">
      <div class="stats-grid">
        ${createStat("🏛", "Capital", capital)}
        ${createStat("👥", "Population", population)}
        ${createStat("🌎", "Region", region)}
        ${createStat("🧭", "Subregion", subregion)}
        ${createStat("💰", "Currency", currency)}
        ${createStat(flagEmoji, "Country Code", country.codes?.alpha_2 || commonName)}
      </div>

      <div class="big-flag-container">
        ${
          flagSvg
            ? `<img class="big-flag" src="${flagSvg}" alt="Flag of ${commonName}">`
            : `<div style="font-size: 100px;">${flagEmoji}</div>`
        }
      </div>
    </div>
  `;
}


/* =========================================
   FETCH DATA
========================================= */

async function dataFetching(countryName) {
  const cleanName = countryName.trim();
  if (!cleanName) return;

  showLoading();

  try {
    const res = await fetch(
      `https://api.restcountries.com/countries/v5?q=${encodeURIComponent(cleanName)}&api-key=${API_KEY}`
    );

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`We couldn't find "${cleanName}". Please check the spelling.`);
      }
      if (res.status === 403) {
        throw new Error("Access forbidden (403). Make sure 'localhost' is allowed in your API key dashboard.");
      }
      throw new Error(`Request failed with status ${res.status}`);
    }

    const data = await res.json();
    const country = data?.data?.objects?.[0];

    if (!country) {
      throw new Error(`No country found matching "${cleanName}".`);
    }

    renderCountry(country);
  } catch (error) {
    console.error("Fetching error:", error);
    showError(error.message);
  }
}


/* =========================================
   EVENT LISTENERS
========================================= */

myform.addEventListener("submit", (e) => {
  e.preventDefault();
  const country = myInput.value.trim();
  if (country) {
    dataFetching(country);
  }
});

if (clearButton) {
  clearButton.addEventListener("click", () => {
    myInput.value = "";
    myInput.focus();
  });
}


/* =========================================
   THEME TOGGLE (DARK / LIGHT MODE)
========================================= */

function updateThemeButton() {
  const isLight = document.body.classList.contains("light");
  const icon = document.querySelector("#theme-icon");
  const text = document.querySelector("#theme-text");

  if (icon) icon.textContent = isLight ? "☀" : "☾";
  if (text) text.textContent = isLight ? "Light Mode" : "Dark Mode";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    localStorage.setItem("countryTheme", isLight ? "light" : "dark");
    updateThemeButton();
  });
}

// Load saved theme
const savedTheme = localStorage.getItem("countryTheme");
if (savedTheme === "light") {
  document.body.classList.add("light");
}
updateThemeButton();


/* =========================================
   INITIAL FETCH
========================================= */

dataFetching("Ethiopia");



