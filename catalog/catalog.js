// Fills the catalog from web/tokens.json and wires the scheme and direction switches. The query
// string sets both (?theme=dark&dir=rtl), so CI can screenshot every combination.
const root = document.documentElement;
const params = new URLSearchParams(location.search);

function apply(theme, dir) {
  if (theme === "light" || theme === "dark") root.dataset.theme = theme;
  else delete root.dataset.theme;
  root.dir = dir === "rtl" ? "rtl" : "ltr";
  root.lang = dir === "rtl" ? "ar" : "en";

  const dark = theme === "dark" || (theme !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
  const mark = document.querySelector("[data-scheme-src]");
  mark.dataset.lightSrc ??= mark.getAttribute("src");
  mark.src = dark ? mark.dataset.schemeSrc : mark.dataset.lightSrc;
}

function wireSwitches() {
  const theme = params.get("theme") || "system";
  const dir = params.get("dir") || "ltr";
  document.querySelector(`input[name=theme][value=${theme}]`).checked = true;
  document.querySelector(`input[name=dir][value=${dir}]`).checked = true;
  apply(theme, dir);

  document.querySelector(".switches").addEventListener("change", () => {
    const chosen = name => document.querySelector(`input[name=${name}]:checked`).value;
    apply(chosen("theme"), chosen("dir"));
    params.set("theme", chosen("theme"));
    params.set("dir", chosen("dir"));
    history.replaceState(null, "", `?${params}`);
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => apply(params.get("theme") || "system", root.dir));
}

const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([ key, value ]) => key === "style" ? node.style.cssText = value : node.setAttribute(key, value));
  node.append(...children);
  return node;
};

function swatches(tokens) {
  document.querySelectorAll("[data-swatches]").forEach(container => {
    tokens.filter(token => token.tier === container.dataset.swatches && token.type === "color").forEach(token => {
      const fill = token.tier === "semantic" ? `var(--${token.name})` : token.value;
      const values = token.dark ? `${token.value} · dark ${token.dark}` : token.value;
      container.append(el("figure", { class: "swatch" },
        el("div", { class: "swatch-fill", style: `background: ${fill}` }),
        el("figcaption", {},
          el("code", {}, token.tier === "semantic" ? `--${token.name}` : token.path),
          el("span", { class: "swatch-values" }, values),
          token.description ? el("span", { class: "swatch-description" }, token.description) : "")));
    });
  });
}

function scales(tokens) {
  const named = prefix => tokens.filter(token => token.path.startsWith(`${prefix}.`));

  named("text").forEach(token => document.querySelector("[data-scale=text]").append(
    el("div", { class: "type-row" },
      el("code", {}, `--${token.name}`), el("span", { class: "type-value" }, token.value),
      el("span", { class: "type-sample", style: `font-size: var(--${token.name})` }, "Mudda مدّة"))));

  named("space").forEach(token => document.querySelector("[data-scale=space]").append(
    el("div", { class: "space-row" },
      el("code", {}, `--${token.name}`), el("span", { class: "type-value" }, token.value),
      el("span", { class: "space-bar", style: `inline-size: var(--${token.name})` }))));

  [ ...named("ease"), ...named("dur") ].forEach(token => document.querySelector("[data-scale=motion]").append(
    el("div", { class: "motion-row" }, el("code", {}, `--${token.name}`), el("span", { class: "type-value" }, token.value),
      token.description ? el("span", { class: "swatch-description" }, token.description) : "")));

  document.querySelectorAll("[data-value]").forEach(node => {
    node.textContent = tokens.find(token => token.name === node.dataset.value)?.value ?? "";
  });
}

wireSwitches();
const [ tokens, pkg ] = await Promise.all([ fetch("../web/tokens.json").then(r => r.json()), fetch("../package.json").then(r => r.json()) ]);
document.querySelector("[data-version]").textContent = `v${pkg.version}`;
swatches(tokens);
scales(tokens);
document.body.dataset.ready = "";
