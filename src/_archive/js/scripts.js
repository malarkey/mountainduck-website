/* Archived illustration animation scripts removed from `src/js/scripts.js`. */

const indexBannerLayers = Array.from(document.querySelectorAll("[data-banner-layer]"));

if (indexBannerLayers.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
const maxActiveIcons = 5;
const accentDuration = 3000;
const holdDuration = 3000;
const baseDuration = 3000;
const lowDuration = 5000;
const activationCadence = 2850;
const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

indexBannerLayers.forEach((layer, layerIndex) => {
const layerIcons = Array.from(layer.querySelectorAll(".banner-icon"));
const activeIcons = new Set();

if (!layerIcons.length) {
return;
}

const activateRandomLayerIcon = () => {
if (activeIcons.size >= maxActiveIcons) {
return;
}

const availableIcons = layerIcons.filter((icon) => !activeIcons.has(icon));

if (!availableIcons.length) {
return;
}

const icon = pickRandom(availableIcons);

activeIcons.add(icon);
icon.dataset.phase = "active";

window.setTimeout(() => {
icon.dataset.phase = "hold";
}, accentDuration);

window.setTimeout(() => {
icon.dataset.phase = "base";
}, accentDuration + holdDuration);

window.setTimeout(() => {
icon.dataset.phase = "low";
}, accentDuration + holdDuration + baseDuration);

window.setTimeout(() => {
icon.dataset.phase = "base";
activeIcons.delete(icon);
}, accentDuration + holdDuration + baseDuration + lowDuration);
};

const scheduleLayerIconActivation = () => {
const hasPoppingIcon = layerIcons.some((icon) => icon.dataset.phase === "active");

if (!hasPoppingIcon && activeIcons.size < maxActiveIcons) {
activateRandomLayerIcon();
}

activateRandomLayerIcon();
window.setTimeout(scheduleLayerIconActivation, activationCadence);
};

window.setTimeout(() => {
activateRandomLayerIcon();
window.setTimeout(scheduleLayerIconActivation, activationCadence);
}, layerIndex * 500);
});
}

const indexDuck = document.getElementById("img-index-duck");
const indexDuckTail = indexDuck?.querySelector(".tail");

if (indexDuck && indexDuckTail) {
indexDuckTail.addEventListener("click", () => {
if (indexDuck.dataset.wild === "true") {
delete indexDuck.dataset.wild;
} else {
indexDuck.dataset.wild = "true";
}
});
}

const contactForm = document.querySelector(".contact-form");
const spaceDuck = document.getElementById("img-space");
const spaceDuckScene = spaceDuck?.querySelector(".space-scene");

if (contactForm && spaceDuck && spaceDuckScene && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
let isSpaceDuckSpinning = false;

const triggerSpaceDuckSpin = () => {
if (isSpaceDuckSpinning) {
return;
}

isSpaceDuckSpinning = true;
spaceDuck.removeAttribute("data-spin");
void spaceDuck.getBoundingClientRect();
spaceDuck.dataset.spin = "true";
};

spaceDuckScene.addEventListener("animationend", (event) => {
if (event.animationName !== "svg-space-spin") {
return;
}

spaceDuck.removeAttribute("data-spin");
isSpaceDuckSpinning = false;
});

contactForm.addEventListener("invalid", () => {
triggerSpaceDuckSpin();
}, true);
}
