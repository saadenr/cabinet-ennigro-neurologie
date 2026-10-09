(() => {
  "use strict";
  const key = "cabinet-ad-consent-v1";
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const panel = document.getElementById("consent-panel");
  let accepted = false;
  let loaded = false;
  let returnFocus;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  const consent = (grant) => ({
    ad_storage: grant ? "granted" : "denied",
    ad_user_data: grant ? "granted" : "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  window.gtag("consent", "default", consent(false));
  window.gtag("set", "ads_data_redaction", true);
  window.cabinetPrivacy = { allowed: () => accepted };

  function enable() {
    accepted = true;
    window.gtag("consent", "update", consent(true));
    if (loaded) return;
    loaded = true;
    window.gtag("js", new Date());
    window.gtag("config", "AW-17738408073", {
      allow_enhanced_conversions: false,
      allow_ad_personalization_signals: false,
    });
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=AW-17738408073";
    document.head.append(tag);
  }

  function clearAdCookies() {
    const host = location.hostname.split(".");
    const domains = ["", ...host.map((_, i) => "; domain=" + host.slice(i).join("."))];
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      if (!/^(_gcl_|_gac_)/.test(name)) return;
      domains.forEach((domain) => {
        document.cookie = name + "=; Max-Age=0; path=/" + domain;
      });
    });
  }

  function choose(value) {
    try { localStorage.setItem(key, JSON.stringify({ value, expires: Date.now() + lifetime })); }
    catch { /* Contact remains usable when browser storage is blocked. */ }
    if (value === "accepted") enable();
    else {
      accepted = false;
      clearAdCookies();
      // Remove the already running tag on withdrawal; do not replay old interactions.
      if (loaded) {
        window.gtag("consent", "update", consent(false));
        location.reload();
      }
    }
    panel.hidden = true;
    if (returnFocus) returnFocus.focus({ preventScroll: true });
    else {
      const main = document.querySelector("main");
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }
  }

  const preferences = document.createElement("button");
  preferences.type = "button";
  preferences.className = "privacy-preferences";
  preferences.textContent = "Mes préférences de confidentialité";
  preferences.addEventListener("click", () => {
    returnFocus = preferences;
    panel.hidden = false;
    document.getElementById("consent-reject").focus();
  });
  document.querySelector(".footer-bottom").append(preferences);
  document.getElementById("consent-accept").addEventListener("click", () => choose("accepted"));
  document.getElementById("consent-reject").addEventListener("click", () => choose("rejected"));
  let saved;
  try { saved = JSON.parse(localStorage.getItem(key)); } catch { /* Ask again. */ }
  if (saved?.expires > Date.now() && saved.value === "accepted") enable();
  else if (!(saved?.expires > Date.now() && saved.value === "rejected")) panel.hidden = false;
})();
