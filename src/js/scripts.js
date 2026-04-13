const netlifyIdentityHashKeys = [
"access_token",
"confirmation_token",
"email_change_token",
"expires_in",
"invite_token",
"recovery_token",
"refresh_token",
"token_type",
"type",
];

const redirectNetlifyIdentityCallbacksToAdmin = () => {
if (!window.location.hash || window.location.pathname.startsWith("/admin")) {
return;
}

const hashParameters = new URLSearchParams(window.location.hash.slice(1));
const hasIdentityCallback = netlifyIdentityHashKeys.some((key) => hashParameters.has(key));

if (!hasIdentityCallback) {
return;
}

const adminUrl = new URL("/admin/", window.location.origin);

adminUrl.hash = window.location.hash;
window.location.replace(adminUrl.toString());
};

redirectNetlifyIdentityCallbacksToAdmin();

const disclosureToggles = document.querySelectorAll("[data-disclosure-toggle]");

for (const toggle of disclosureToggles) {
const targetId = toggle.dataset.toggleTarget;

if (!targetId) {
continue;
}

const target = document.getElementById(targetId);

if (!target) {
continue;
}

const showText = toggle.dataset.showText || "Show";
const hideText = toggle.dataset.hideText || "Hide";

const updateToggle = () => {
const isExpanded = !target.hidden;

toggle.setAttribute("aria-expanded", String(isExpanded));
toggle.textContent = isExpanded ? hideText : showText;
};

toggle.addEventListener("click", () => {
target.hidden = !target.hidden;
updateToggle();
});

updateToggle();
}

const faqTriggers = document.querySelectorAll("[data-faq-trigger]");
const faqPanels = document.querySelectorAll("[data-faq-answer-panel]");

if (faqTriggers.length && faqPanels.length) {
const setActiveFaq = (activeTrigger) => {
const targetId = activeTrigger.dataset.target;

for (const trigger of faqTriggers) {
const isActive = trigger === activeTrigger;

trigger.setAttribute("aria-pressed", String(isActive));

if (isActive) {
trigger.setAttribute("data-active", "true");
} else {
trigger.removeAttribute("data-active");
}
}

for (const panel of faqPanels) {
panel.hidden = panel.id !== targetId;
}
};

for (const trigger of faqTriggers) {
trigger.addEventListener("click", () => {
setActiveFaq(trigger);
});
}
}

const tabGroups = document.querySelectorAll("[data-tabs]");

for (const group of tabGroups) {
const tabButtons = group.querySelectorAll("[data-tab-button]");
const tabPanels = group.querySelectorAll("[data-tab-panel]");

if (!tabButtons.length || !tabPanels.length) {
continue;
}

const setActiveTab = (activeButton) => {
const targetId = activeButton.dataset.target;

for (const button of tabButtons) {
const isActive = button === activeButton;

button.setAttribute("aria-selected", String(isActive));

if (isActive) {
button.setAttribute("data-active", "true");
} else {
button.removeAttribute("data-active");
}
}

for (const panel of tabPanels) {
panel.hidden = panel.id !== targetId;
}
};

for (const button of tabButtons) {
button.addEventListener("click", () => {
setActiveTab(button);
});
}
}

const protocolJumpLinks = document.querySelectorAll("[data-protocol-jump-link]");

if (protocolJumpLinks.length) {
const updateActiveProtocolJumpLink = () => {
const hash = window.location.hash.replace(/^#/, "");

for (const link of protocolJumpLinks) {
const isActive = hash && link.dataset.target === hash;

if (isActive) {
link.setAttribute("data-active", "true");
link.setAttribute("aria-current", "location");
} else {
link.removeAttribute("data-active");
link.removeAttribute("aria-current");
}
}
};

window.addEventListener("hashchange", updateActiveProtocolJumpLink);
updateActiveProtocolJumpLink();
}

const downloadLinks = document.querySelectorAll("[data-downloads] a, [data-download-link]");

if (downloadLinks.length) {
const detectPlatform = () => {
const userAgent = navigator.userAgent || "";
const platform = navigator.userAgentData?.platform || navigator.platform || "";
const combined = `${platform} ${userAgent}`.toLowerCase();
const isTouchMac = platform === "MacIntel" && navigator.maxTouchPoints > 1;

if (/android/.test(combined)) {
return "android";
}

if (/(iphone|ipad|ipod)/.test(combined) || isTouchMac) {
return "ios";
}

if (/win/.test(combined)) {
return "windows";
}

if (/mac/.test(combined)) {
return "macos";
}

return "other";
};

const classifyDownloadLink = (link) => {
const declaredPlatform = link.dataset.downloadPlatform;

if (declaredPlatform) {
return declaredPlatform;
}

const text = (link.textContent || "").trim().toLowerCase();
const href = (link.getAttribute("href") || "").toLowerCase();

if (text.includes("macos") || href.endsWith(".pkg") || (href.endsWith(".zip") && href.includes("mountain%20duck-"))) {
return "macos";
}

if (text.includes("windows") || text.includes("msi") || text.includes("msix") || href.endsWith(".exe") || href.endsWith(".msi") || href.endsWith(".msix")) {
return "windows";
}

return "";
};

const setDisabledState = (link, disabled) => {
if (disabled) {
link.setAttribute("aria-disabled", "true");
link.setAttribute("tabindex", "-1");

if (link instanceof HTMLButtonElement) {
link.disabled = true;
}

return;
}

link.removeAttribute("aria-disabled");
link.removeAttribute("tabindex");

if (link instanceof HTMLButtonElement) {
link.disabled = false;
}
};

const platform = detectPlatform();

document.body.dataset.os = platform;

for (const link of downloadLinks) {
const downloadPlatform = classifyDownloadLink(link);
let shouldDisable = false;

if (platform === "macos" && downloadPlatform === "windows") {
shouldDisable = true;
}

if (platform === "windows" && downloadPlatform === "macos") {
shouldDisable = true;
}

if ((platform === "android" || platform === "ios") && downloadPlatform) {
shouldDisable = true;
}

setDisabledState(link, shouldDisable);
}
}

const buyAmountInput = document.getElementById("buy-amount");
const buyCustomInput = document.getElementById("buy-custom");
const buyCustomRadio = document.getElementById("buy-qty-custom");
const buyQuantityRadios = Array.from(document.querySelectorAll('input[name="buy-qty"]'));

if (buyAmountInput && buyQuantityRadios.length) {
const updateBuyAmount = (amount) => {
buyAmountInput.value = amount;
};

const updateCustomBuyAmount = (quantity) => {
updateBuyAmount((quantity * 20).toFixed(2));
};

const syncBuyCalculator = () => {
const checkedRadio = document.querySelector('input[name="buy-qty"]:checked');

if (!checkedRadio) {
buyAmountInput.value = "";
return;
}

if (checkedRadio !== buyCustomRadio) {
if (buyCustomInput) {
buyCustomInput.setCustomValidity("");
}

updateBuyAmount(checkedRadio.dataset.buyAmount || checkedRadio.value);
return;
}

if (!buyCustomInput) {
buyAmountInput.value = "";
return;
}

const sanitizedValue = buyCustomInput.value.replace(/[^\d]/g, "");

if (buyCustomInput.value !== sanitizedValue) {
buyCustomInput.value = sanitizedValue;
}

if (!sanitizedValue) {
buyCustomInput.setCustomValidity("Enter a value over 50.");
buyAmountInput.value = "";
return;
}

const customQuantity = Number.parseInt(sanitizedValue, 10);

if (!Number.isFinite(customQuantity) || customQuantity <= 50) {
buyCustomInput.setCustomValidity("Enter a value over 50.");
buyAmountInput.value = "";
return;
}

buyCustomInput.setCustomValidity("");
updateCustomBuyAmount(customQuantity);
};

for (const radio of buyQuantityRadios) {
radio.addEventListener("change", () => {
if (radio.checked) {
syncBuyCalculator();
}
});
}

if (buyCustomInput) {
buyCustomInput.addEventListener("focus", () => {
if (buyCustomRadio) {
buyCustomRadio.checked = true;
}

syncBuyCalculator();
});

buyCustomInput.addEventListener("input", () => {
if (buyCustomRadio) {
buyCustomRadio.checked = true;
}

syncBuyCalculator();
});
}

syncBuyCalculator();
}

const indexBanner = document.getElementById("index-banner");
const indexBannerSvg = document.getElementById("banner-index-svg");
const indexBubbleGroup = indexBannerSvg?.querySelector(".index-bubbles");
const indexBubbleSeeds = indexBubbleGroup ? Array.from(indexBubbleGroup.querySelectorAll("circle")).map((bubble) => ({
cx: bubble.getAttribute("cx") || "0",
cy: bubble.getAttribute("cy") || "0",
fill: bubble.getAttribute("fill") || "#92b6db",
r: bubble.getAttribute("r") || "3",
})) : [];
const indexBubbleParticles = [];
const indexInputMask = indexBannerSvg?.querySelector(".img-input-mask");
const indexOutputMask = indexBannerSvg?.querySelector(".img-output-mask");
const indexOutputMask2 = indexBannerSvg?.querySelector(".img-output-mask-2");
const indexOutputMask3 = indexBannerSvg?.querySelector(".img-output-mask-3");
const indexOutputFileSeeds = indexBannerSvg ? Array.from(indexBannerSvg.querySelectorAll(".img-output-file")).map((fileSeed) => ({
file: fileSeed.dataset.file || "",
fillRule: fileSeed.getAttribute("fill-rule") || "",
markup: fileSeed.innerHTML,
})) : [];
const indexInputParticles = [];
const indexOutputParticles = [];
const indexOutputFallParticles = [];
const indexOutputLeftParticles = [];
const indexDialFaces = indexBannerSvg ? Array.from(indexBannerSvg.querySelectorAll(".index-dial-face")) : [];
const indexKnobs = Array.from(document.querySelectorAll("#index-banner .index-knob-rotator"));
const indexAnimationToggle = indexBannerSvg?.querySelector("[data-animation-toggle]");
const indexSliders = Array.from(document.querySelectorAll("#index-banner .index-slider"));

if (indexBanner && indexBannerSvg && indexAnimationToggle) {
const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let indexOutputStream = null;
let indexOutputFallStream = null;
let indexOutputLeftStream = null;
let indexInputStream = null;

const setIndexBannerAnimationState = (isRunning) => {
const animationState = isRunning ? "on" : "off";
const toggleLabel = isRunning ? "Turn illustration animation off" : "Turn illustration animation on";

indexBanner.dataset.animation = animationState;
indexBannerSvg.dataset.animation = animationState;
indexAnimationToggle.setAttribute("aria-label", toggleLabel);
indexAnimationToggle.setAttribute("aria-pressed", String(isRunning));

if (!isRunning) {
for (const bubble of indexBubbleParticles) {
bubble.removeAttribute("data-rise-active");
}

for (const inputFile of indexInputParticles) {
inputFile.removeAttribute("data-run-active");
}

for (const outputFile of indexOutputParticles) {
outputFile.removeAttribute("data-rise-active");
}

for (const outputFile of indexOutputFallParticles) {
outputFile.removeAttribute("data-fall-active");
}

for (const outputFile of indexOutputLeftParticles) {
outputFile.removeAttribute("data-run-active");
}

for (const dialFace of indexDialFaces) {
dialFace.style.rotate = "0deg";
}

for (const knob of indexKnobs) {
knob.style.rotate = "0deg";
delete knob.dataset.rotation;
}

for (const slider of indexSliders) {
slider.removeAttribute("data-slide-active");
}
}
};

const syncIndexBannerAnimationState = () => {
if (indexBanner.dataset.animationOverride === "true") {
return;
}

setIndexBannerAnimationState(!reducedMotionPreference.matches);
};

const toggleIndexBannerAnimationState = () => {
const isRunning = indexBanner.dataset.animation === "on";

indexBanner.dataset.animationOverride = "true";
setIndexBannerAnimationState(!isRunning);
};

indexAnimationToggle.addEventListener("click", () => {
toggleIndexBannerAnimationState();
});

indexAnimationToggle.addEventListener("keydown", (event) => {
if (event.key !== "Enter" && event.key !== " ") {
return;
}

event.preventDefault();
toggleIndexBannerAnimationState();
});

if (typeof reducedMotionPreference.addEventListener === "function") {
reducedMotionPreference.addEventListener("change", syncIndexBannerAnimationState);
} else if (typeof reducedMotionPreference.addListener === "function") {
reducedMotionPreference.addListener(syncIndexBannerAnimationState);
}

const getRandomIndexNumber = (minimum, maximum) => {
return Math.random() * (maximum - minimum) + minimum;
};

const getRandomIndexSliderDelay = (minimum, maximum) => {
return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
};

const indexOutputFallHorizontalPadding = 16;
const indexOutputFileHeight = 105;
const indexOutputFileWidth = 105;
const indexOutputLeftEndOffset = 20;
const indexOutputLeftStartOffset = 14;
const indexOutputHorizontalPadding = 54;
const indexInputStartOffset = 14;

const createIndexOutputClipPath = (mask, clipPathId, streamClassName) => {
if (!mask || !indexOutputFileSeeds.length) {
return null;
}

const outputMaskBounds = mask.getBBox();
const indexBannerDefs = indexBannerSvg.querySelector("defs");

if (!indexBannerDefs || !outputMaskBounds.width || !outputMaskBounds.height) {
return null;
}

let indexOutputClipPath = indexBannerDefs.querySelector(`#${clipPathId}`);
let indexOutputClipRect = indexOutputClipPath?.querySelector("rect");

if (!indexOutputClipPath) {
indexOutputClipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
indexOutputClipPath.setAttribute("id", clipPathId);
indexBannerDefs.append(indexOutputClipPath);
}

indexOutputClipPath.setAttribute("clipPathUnits", "userSpaceOnUse");

if (!indexOutputClipRect) {
indexOutputClipRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
indexOutputClipPath.append(indexOutputClipRect);
}

indexOutputClipRect.setAttribute("height", String(outputMaskBounds.height));
indexOutputClipRect.setAttribute("width", String(outputMaskBounds.width));
indexOutputClipRect.setAttribute("x", String(outputMaskBounds.x));
indexOutputClipRect.setAttribute("y", String(outputMaskBounds.y));

let indexOutputTargetStream = null;

if (streamClassName === "index-input-stream") {
indexOutputTargetStream = indexInputStream;
} else if (streamClassName === "index-output-stream-3") {
indexOutputTargetStream = indexOutputLeftStream;
} else if (streamClassName === "index-output-stream") {
indexOutputTargetStream = indexOutputStream;
} else {
indexOutputTargetStream = indexOutputFallStream;
}

if (!indexOutputTargetStream) {
indexOutputTargetStream = document.createElementNS("http://www.w3.org/2000/svg", "g");
indexOutputTargetStream.classList.add(streamClassName);
mask.before(indexOutputTargetStream);
}

if (streamClassName === "index-output-stream") {
indexOutputStream = indexOutputTargetStream;
} else if (streamClassName === "index-input-stream") {
indexInputStream = indexOutputTargetStream;
} else if (streamClassName === "index-output-stream-3") {
indexOutputLeftStream = indexOutputTargetStream;
} else {
indexOutputFallStream = indexOutputTargetStream;
}

indexOutputTargetStream.setAttribute("clip-path", `url(#${clipPathId})`);
indexBannerSvg.dataset.outputReady = "true";

return outputMaskBounds;
};

const createIndexBubbleParticle = (seed) => {
const bubble = document.createElementNS("http://www.w3.org/2000/svg", "circle");

bubble.classList.add("index-bubble-particle");
bubble.setAttribute("cx", seed.cx);
bubble.setAttribute("cy", seed.cy);
bubble.setAttribute("fill", seed.fill);
bubble.setAttribute("r", seed.r);

indexBubbleGroup?.append(bubble);

return bubble;
};

const createIndexOutputParticle = () => {
const outputFile = document.createElementNS("http://www.w3.org/2000/svg", "g");

outputFile.classList.add("img-output-file-particle");
indexOutputStream?.append(outputFile);

return outputFile;
};

const createIndexOutputLeftParticle = () => {
const outputFile = document.createElementNS("http://www.w3.org/2000/svg", "g");

outputFile.classList.add("img-output-file-left-particle");
indexOutputLeftStream?.append(outputFile);

return outputFile;
};

const createIndexInputParticle = () => {
const inputFile = document.createElementNS("http://www.w3.org/2000/svg", "g");

inputFile.classList.add("img-input-file-particle");
indexInputStream?.append(inputFile);

return inputFile;
};

const createIndexOutputFallParticle = () => {
const outputFile = document.createElementNS("http://www.w3.org/2000/svg", "g");

outputFile.classList.add("img-output-file-fall-particle");
indexOutputFallStream?.append(outputFile);

return outputFile;
};

const refreshIndexBubbleParticle = (bubble, duration) => {
bubble.style.setProperty("--index-bubble-drift-end", `${getRandomIndexSliderDelay(-18, 18)}px`);
bubble.style.setProperty("--index-bubble-drift-mid", `${getRandomIndexSliderDelay(-10, 10)}px`);
bubble.style.setProperty("--index-bubble-duration", `${duration}ms`);
bubble.style.setProperty("--index-bubble-opacity-peak", getRandomIndexNumber(.45, .9).toFixed(2));
bubble.style.setProperty("--index-bubble-rise", `${getRandomIndexSliderDelay(90, 175)}px`);
bubble.style.setProperty("--index-bubble-scale-end", getRandomIndexNumber(1, 1.3).toFixed(2));
bubble.style.setProperty("--index-bubble-scale-mid", getRandomIndexNumber(.88, 1.06).toFixed(2));
bubble.style.setProperty("--index-bubble-scale-start", getRandomIndexNumber(.45, .78).toFixed(2));
};

const refreshIndexOutputParticle = (outputFile, outputMaskBounds, duration) => {
const outputTemplate = indexOutputFileSeeds[getRandomIndexSliderDelay(0, indexOutputFileSeeds.length - 1)];
const outputRotationDirection = Math.random() < .5 ? -1 : 1;
const outputRotationStart = getRandomIndexSliderDelay(-6, 6);
const outputRotationMid = outputRotationStart + (outputRotationDirection * getRandomIndexSliderDelay(16, 34));
const outputRotationEnd = outputRotationStart + (outputRotationDirection * getRandomIndexSliderDelay(32, 64));
const outputStartMinX = Math.round(outputMaskBounds.x + indexOutputHorizontalPadding);
const outputStartMaxX = Math.round(outputMaskBounds.x + outputMaskBounds.width - indexOutputFileWidth - indexOutputHorizontalPadding);
const outputStartX = outputStartMinX < outputStartMaxX ? getRandomIndexSliderDelay(outputStartMinX, outputStartMaxX) : Math.round(outputMaskBounds.x + ((outputMaskBounds.width - indexOutputFileWidth) / 2));
const outputStartY = Math.round(outputMaskBounds.y + outputMaskBounds.height + getRandomIndexSliderDelay(16, 130));

outputFile.dataset.file = outputTemplate.file;
outputFile.innerHTML = outputTemplate.markup;
outputFile.removeAttribute("data-rise-active");

if (outputTemplate.fillRule) {
outputFile.setAttribute("fill-rule", outputTemplate.fillRule);
} else {
outputFile.removeAttribute("fill-rule");
}

outputFile.style.setProperty("--index-output-drift-end", `${getRandomIndexSliderDelay(-24, 24)}px`);
outputFile.style.setProperty("--index-output-drift-mid", `${getRandomIndexSliderDelay(-14, 14)}px`);
outputFile.style.setProperty("--index-output-duration", `${duration}ms`);
outputFile.style.setProperty("--index-output-opacity-late", getRandomIndexNumber(.18, .38).toFixed(2));
outputFile.style.setProperty("--index-output-opacity-peak", getRandomIndexNumber(.68, .94).toFixed(2));
outputFile.style.setProperty("--index-output-position-x", `${outputStartX}px`);
outputFile.style.setProperty("--index-output-position-y", `${outputStartY}px`);
outputFile.style.setProperty("--index-output-rise", `${getRandomIndexSliderDelay(Math.round(outputMaskBounds.height + 120), Math.round(outputMaskBounds.height + 240))}px`);
outputFile.style.setProperty("--index-output-rotate-end", `${outputRotationEnd}deg`);
outputFile.style.setProperty("--index-output-rotate-mid", `${outputRotationMid}deg`);
outputFile.style.setProperty("--index-output-rotate-start", `${outputRotationStart}deg`);
outputFile.style.setProperty("--index-output-scale-end", getRandomIndexNumber(.78, .9).toFixed(2));
outputFile.style.setProperty("--index-output-scale-mid", getRandomIndexNumber(.88, .97).toFixed(2));
outputFile.style.setProperty("--index-output-scale-start", getRandomIndexNumber(.94, 1).toFixed(2));
};

const getIndexInputMotionConfig = (inputMaskBounds) => {
const inputDuration = 7800;
const inputRun = Math.round(inputMaskBounds.width + 150);
const inputSpacing = indexOutputFileWidth + 20;
const inputInterval = Math.max(1850, Math.ceil((inputSpacing / inputRun) * inputDuration));
const inputParticleTotal = Math.max(3, Math.ceil(inputDuration / inputInterval) + 1);

return {
duration: inputDuration,
interval: inputInterval,
particleTotal: inputParticleTotal,
positionX: Math.round(inputMaskBounds.x - indexInputStartOffset),
positionY: Math.round(inputMaskBounds.y + Math.max((inputMaskBounds.height - indexOutputFileHeight) / 2, 0)),
run: inputRun,
};
};

const getIndexOutputLeftMotionConfig = (outputMaskBounds) => {
const outputDuration = 8200;
const outputRun = Math.round(outputMaskBounds.width - indexOutputFileWidth + indexOutputLeftStartOffset + indexOutputLeftEndOffset);
const outputSpacing = indexOutputFileWidth + 20;
const outputInterval = Math.max(1200, Math.ceil((outputSpacing / outputRun) * outputDuration));
const outputParticleTotal = Math.max(4, Math.ceil(outputDuration / outputInterval) + 1);

return {
duration: outputDuration,
interval: outputInterval,
particleTotal: outputParticleTotal,
positionX: Math.round(outputMaskBounds.x + outputMaskBounds.width - indexOutputFileWidth + indexOutputLeftStartOffset),
positionY: Math.round(outputMaskBounds.y + Math.max((outputMaskBounds.height - indexOutputFileHeight) / 2, 0)),
run: outputRun + indexOutputLeftEndOffset,
};
};

const refreshIndexInputParticle = (inputFile, inputMotionConfig) => {
const inputTemplate = indexOutputFileSeeds[getRandomIndexSliderDelay(0, indexOutputFileSeeds.length - 1)];

inputFile.dataset.file = inputTemplate.file;
inputFile.innerHTML = inputTemplate.markup;
inputFile.removeAttribute("data-run-active");

if (inputTemplate.fillRule) {
inputFile.setAttribute("fill-rule", inputTemplate.fillRule);
} else {
inputFile.removeAttribute("fill-rule");
}

inputFile.style.setProperty("--index-input-duration", `${inputMotionConfig.duration}ms`);
inputFile.style.setProperty("--index-input-position-x", `${inputMotionConfig.positionX}px`);
inputFile.style.setProperty("--index-input-position-y", `${inputMotionConfig.positionY}px`);
inputFile.style.setProperty("--index-input-run", `${inputMotionConfig.run}px`);
inputFile.style.setProperty("--index-input-scale-start", getRandomIndexNumber(.08, .14).toFixed(2));
};

const refreshIndexOutputLeftParticle = (outputFile, outputMotionConfig) => {
const outputTemplate = indexOutputFileSeeds[getRandomIndexSliderDelay(0, indexOutputFileSeeds.length - 1)];

outputFile.dataset.file = outputTemplate.file;
outputFile.innerHTML = outputTemplate.markup;
outputFile.removeAttribute("data-run-active");

if (outputTemplate.fillRule) {
outputFile.setAttribute("fill-rule", outputTemplate.fillRule);
} else {
outputFile.removeAttribute("fill-rule");
}

outputFile.style.setProperty("--index-output-left-duration", `${outputMotionConfig.duration}ms`);
outputFile.style.setProperty("--index-output-left-position-x", `${outputMotionConfig.positionX}px`);
outputFile.style.setProperty("--index-output-left-position-y", `${outputMotionConfig.positionY}px`);
outputFile.style.setProperty("--index-output-left-run", `${outputMotionConfig.run}px`);
outputFile.style.setProperty("--index-output-left-scale-start", getRandomIndexNumber(.08, .14).toFixed(2));
};

const refreshIndexOutputFallParticle = (outputFile, outputMaskBounds, duration) => {
const outputTemplate = indexOutputFileSeeds[getRandomIndexSliderDelay(0, indexOutputFileSeeds.length - 1)];
const outputRotationDirection = Math.random() < .5 ? -1 : 1;
const outputRotationStart = getRandomIndexSliderDelay(-8, 8);
const outputRotationMid = outputRotationStart + (outputRotationDirection * getRandomIndexSliderDelay(18, 38));
const outputRotationEnd = outputRotationStart + (outputRotationDirection * getRandomIndexSliderDelay(30, 68));
const outputStartMinX = Math.round(outputMaskBounds.x + indexOutputFallHorizontalPadding);
const outputStartMaxX = Math.round(outputMaskBounds.x + outputMaskBounds.width - indexOutputFileWidth - indexOutputFallHorizontalPadding);
const outputStartX = outputStartMinX < outputStartMaxX ? getRandomIndexSliderDelay(outputStartMinX, outputStartMaxX) : Math.round(outputMaskBounds.x + ((outputMaskBounds.width - indexOutputFileWidth) / 2));
const outputStartY = Math.round(outputMaskBounds.y + getRandomIndexSliderDelay(-6, 24));

outputFile.dataset.file = outputTemplate.file;
outputFile.innerHTML = outputTemplate.markup;
outputFile.removeAttribute("data-fall-active");

if (outputTemplate.fillRule) {
outputFile.setAttribute("fill-rule", outputTemplate.fillRule);
} else {
outputFile.removeAttribute("fill-rule");
}

outputFile.style.setProperty("--index-output-fall-drift-end", `${getRandomIndexSliderDelay(-14, 14)}px`);
outputFile.style.setProperty("--index-output-fall-drift-mid", `${getRandomIndexSliderDelay(-8, 8)}px`);
outputFile.style.setProperty("--index-output-fall-drop", `${getRandomIndexSliderDelay(Math.round(outputMaskBounds.height + 70), Math.round(outputMaskBounds.height + 150))}px`);
outputFile.style.setProperty("--index-output-fall-duration", `${duration}ms`);
outputFile.style.setProperty("--index-output-fall-opacity-late", getRandomIndexNumber(.16, .28).toFixed(2));
outputFile.style.setProperty("--index-output-fall-opacity-peak", getRandomIndexNumber(.56, .78).toFixed(2));
outputFile.style.setProperty("--index-output-fall-position-x", `${outputStartX}px`);
outputFile.style.setProperty("--index-output-fall-position-y", `${outputStartY}px`);
outputFile.style.setProperty("--index-output-fall-rotate-end", `${outputRotationEnd}deg`);
outputFile.style.setProperty("--index-output-fall-rotate-mid", `${outputRotationMid}deg`);
outputFile.style.setProperty("--index-output-fall-rotate-start", `${outputRotationStart}deg`);
outputFile.style.setProperty("--index-output-fall-scale-end", getRandomIndexNumber(.68, .82).toFixed(2));
outputFile.style.setProperty("--index-output-fall-scale-mid", getRandomIndexNumber(.82, .92).toFixed(2));
outputFile.style.setProperty("--index-output-fall-scale-start", getRandomIndexNumber(.96, 1.02).toFixed(2));
};

const scheduleIndexBubbleMotion = (bubble, delay) => {
window.setTimeout(() => {
const duration = getRandomIndexSliderDelay(3200, 5600);

if (indexBanner.dataset.animation === "on") {
refreshIndexBubbleParticle(bubble, duration);
bubble.removeAttribute("data-rise-active");
void bubble.getBoundingClientRect();
bubble.dataset.riseActive = "true";
} else {
bubble.removeAttribute("data-rise-active");
}

scheduleIndexBubbleMotion(bubble, duration + getRandomIndexSliderDelay(300, 1800));
}, delay);
};

const scheduleIndexOutputMotion = (outputFile, outputMaskBounds, delay) => {
window.setTimeout(() => {
const duration = getRandomIndexSliderDelay(8600, 12800);

if (indexBanner.dataset.animation === "on") {
refreshIndexOutputParticle(outputFile, outputMaskBounds, duration);
void outputFile.getBoundingClientRect();
outputFile.dataset.riseActive = "true";
} else {
outputFile.removeAttribute("data-rise-active");
}

scheduleIndexOutputMotion(outputFile, outputMaskBounds, duration + getRandomIndexSliderDelay(1400, 3600));
}, delay);
};

const scheduleIndexOutputLeftMotion = (outputFile, outputMotionConfig, delay) => {
window.setTimeout(() => {
if (indexBanner.dataset.animation === "on") {
refreshIndexOutputLeftParticle(outputFile, outputMotionConfig);
void outputFile.getBoundingClientRect();
outputFile.dataset.runActive = "true";
} else {
outputFile.removeAttribute("data-run-active");
}

scheduleIndexOutputLeftMotion(outputFile, outputMotionConfig, outputMotionConfig.interval * outputMotionConfig.particleTotal);
}, delay);
};

const scheduleIndexInputMotion = (inputFile, inputMotionConfig, delay) => {
window.setTimeout(() => {
if (indexBanner.dataset.animation === "on") {
refreshIndexInputParticle(inputFile, inputMotionConfig);
void inputFile.getBoundingClientRect();
inputFile.dataset.runActive = "true";
} else {
inputFile.removeAttribute("data-run-active");
}

scheduleIndexInputMotion(inputFile, inputMotionConfig, inputMotionConfig.interval * inputMotionConfig.particleTotal);
}, delay);
};

const scheduleIndexOutputFallMotion = (outputFile, outputMaskBounds, delay) => {
window.setTimeout(() => {
const duration = getRandomIndexSliderDelay(7600, 11600);

if (indexBanner.dataset.animation === "on") {
refreshIndexOutputFallParticle(outputFile, outputMaskBounds, duration);
void outputFile.getBoundingClientRect();
outputFile.dataset.fallActive = "true";
} else {
outputFile.removeAttribute("data-fall-active");
}

scheduleIndexOutputFallMotion(outputFile, outputMaskBounds, duration + getRandomIndexSliderDelay(2600, 5200));
}, delay);
};

const scheduleIndexSliderMotion = (slider) => {
const nextDelay = getRandomIndexSliderDelay(1400, 4200);

window.setTimeout(() => {
if (indexBanner.dataset.animation === "on") {
slider.dataset.slideActive = "true";

window.setTimeout(() => {
slider.removeAttribute("data-slide-active");
}, 700);
} else {
slider.removeAttribute("data-slide-active");
}

scheduleIndexSliderMotion(slider);
}, nextDelay);
};

for (const slider of indexSliders) {
scheduleIndexSliderMotion(slider);
}

const indexInputMaskBounds = createIndexOutputClipPath(indexInputMask, "index-input-stream-clip", "index-input-stream");
const indexOutputMaskBounds = createIndexOutputClipPath(indexOutputMask, "index-output-stream-clip", "index-output-stream");
const indexOutputMaskBounds2 = createIndexOutputClipPath(indexOutputMask2, "index-output-stream-clip-2", "index-output-stream-2");
const indexOutputMaskBounds3 = createIndexOutputClipPath(indexOutputMask3, "index-output-stream-clip-3", "index-output-stream-3");

if (indexInputMaskBounds) {
const indexInputMotionConfig = getIndexInputMotionConfig(indexInputMaskBounds);

for (let inputParticleIndex = 0; inputParticleIndex < indexInputMotionConfig.particleTotal; inputParticleIndex += 1) {
const inputFile = createIndexInputParticle();

indexInputParticles.push(inputFile);
scheduleIndexInputMotion(inputFile, indexInputMotionConfig, inputParticleIndex * indexInputMotionConfig.interval);
}
}

if (indexOutputMaskBounds) {
const indexOutputParticleTotal = Math.max(indexOutputFileSeeds.length - 1, 6);

for (let outputParticleIndex = 0; outputParticleIndex < indexOutputParticleTotal; outputParticleIndex += 1) {
const outputFile = createIndexOutputParticle();

indexOutputParticles.push(outputFile);
scheduleIndexOutputMotion(outputFile, indexOutputMaskBounds, getRandomIndexSliderDelay(250, 5600));
}
}

if (indexOutputMaskBounds2) {
const indexOutputFallParticleTotal = Math.max(indexOutputFileSeeds.length - 6, 3);

for (let outputParticleIndex = 0; outputParticleIndex < indexOutputFallParticleTotal; outputParticleIndex += 1) {
const outputFile = createIndexOutputFallParticle();

indexOutputFallParticles.push(outputFile);
scheduleIndexOutputFallMotion(outputFile, indexOutputMaskBounds2, getRandomIndexSliderDelay(900, 5600));
}
}

if (indexOutputMaskBounds3) {
const indexOutputLeftMotionConfig = getIndexOutputLeftMotionConfig(indexOutputMaskBounds3);

for (let outputParticleIndex = 0; outputParticleIndex < indexOutputLeftMotionConfig.particleTotal; outputParticleIndex += 1) {
const outputFile = createIndexOutputLeftParticle();

indexOutputLeftParticles.push(outputFile);
scheduleIndexOutputLeftMotion(outputFile, indexOutputLeftMotionConfig, outputParticleIndex * indexOutputLeftMotionConfig.interval);
}
}

if (indexBubbleGroup && indexBubbleSeeds.length) {
indexBubbleGroup.dataset.bubblesReady = "true";

for (const seed of indexBubbleSeeds) {
const bubble = createIndexBubbleParticle(seed);

indexBubbleParticles.push(bubble);
scheduleIndexBubbleMotion(bubble, getRandomIndexSliderDelay(200, 2200));
}
}

const scheduleIndexDialMotion = (dialFace) => {
const nextDelay = getRandomIndexSliderDelay(2200, 5600);

window.setTimeout(() => {
if (indexBanner.dataset.animation === "on") {
const nextRotation = getRandomIndexSliderDelay(-90, 90);

dialFace.style.rotate = `${nextRotation}deg`;
}

scheduleIndexDialMotion(dialFace);
}, nextDelay);
};

for (const dialFace of indexDialFaces) {
scheduleIndexDialMotion(dialFace);
}

const scheduleIndexKnobMotion = (knob) => {
const nextDelay = getRandomIndexSliderDelay(1800, 5200);

window.setTimeout(() => {
if (indexBanner.dataset.animation === "on") {
const currentRotation = Number.parseInt(knob.dataset.rotation || "0", 10);
const nextRotation = currentRotation + 90;

knob.dataset.rotation = String(nextRotation);
knob.style.rotate = `${nextRotation}deg`;
}

scheduleIndexKnobMotion(knob);
}, nextDelay);
};

for (const knob of indexKnobs) {
scheduleIndexKnobMotion(knob);
}

syncIndexBannerAnimationState();
}

const usingBannerSvg = document.getElementById("banner-using-svg");
const usingBubbleGroup = usingBannerSvg?.querySelector(".using-bubbles");
const usingFileLanesGroup = usingBannerSvg?.querySelector("#using-file-lanes");
const usingBubbleLaneBounds = {
height: 113,
width: 60,
x: 661,
y: 782,
};
const usingFileLaneBounds = {
height: 241,
width: 238,
x: 705,
y: 290,
};
const usingBannerDefs = usingBannerSvg?.querySelector("defs");
const usingFileStreamAnchor = usingBannerSvg?.querySelector('ellipse[id="#using-files-glass"]');
const usingLaneFamilySymbols = usingBannerDefs ? {
coding: Array.from(usingBannerDefs.querySelectorAll('symbol[id^="using-file-coding-"]')).map((symbol) => `#${symbol.id}`),
design: Array.from(usingBannerDefs.querySelectorAll('symbol[id^="using-file-design-"]')).map((symbol) => `#${symbol.id}`),
general: Array.from(usingBannerDefs.querySelectorAll('symbol[id^="using-file-general-"]')).map((symbol) => `#${symbol.id}`),
office: Array.from(usingBannerDefs.querySelectorAll('symbol[id^="using-file-office-"]')).map((symbol) => `#${symbol.id}`),
} : {
coding: [],
design: [],
general: [],
office: [],
};
const usingFileLaneConfigs = [
{
bounds: {
height: 170,
width: 403,
x: -122,
y: 185,
},
clipIndex: 1,
direction: "in",
family: "general",
particles: [],
stream: null,
},
{
bounds: {
height: 170,
width: 403,
x: -122,
y: 357,
},
clipIndex: 2,
direction: "in",
family: "coding",
particles: [],
stream: null,
},
{
bounds: {
height: 170,
width: 403,
x: -122,
y: 527,
},
clipIndex: 3,
direction: "in",
family: "office",
particles: [],
stream: null,
},
{
bounds: {
height: 170,
width: 403,
x: -122,
y: 699,
},
clipIndex: 4,
direction: "in",
family: "design",
particles: [],
stream: null,
},
{
bounds: {
height: 170,
width: 427,
x: 1428,
y: 185,
},
clipIndex: 5,
direction: "out",
family: "general",
particles: [],
stream: null,
},
{
bounds: {
height: 170,
width: 427,
x: 1428,
y: 357,
},
clipIndex: 6,
direction: "out",
family: "coding",
particles: [],
stream: null,
},
{
bounds: {
height: 170,
width: 427,
x: 1428,
y: 527,
},
clipIndex: 7,
direction: "out",
family: "office",
particles: [],
stream: null,
},
{
bounds: {
height: 170,
width: 427,
x: 1428,
y: 699,
},
clipIndex: 8,
direction: "out",
family: "design",
particles: [],
stream: null,
},
];
const usingBubbleSeeds = usingBubbleGroup ? Array.from(usingBubbleGroup.querySelectorAll("circle")).map((bubble) => ({
cx: bubble.getAttribute("cx") || "0",
cy: bubble.getAttribute("cy") || "0",
fill: bubble.getAttribute("fill") || "#fff",
r: bubble.getAttribute("r") || "3",
})) : [];
const usingBubbleParticles = [];
const usingFileParticles = [];
const usingDialFaces = usingBannerSvg ? Array.from(usingBannerSvg.querySelectorAll(".using-dial-face")) : [];
const usingDialHands = usingBannerSvg ? Array.from(usingBannerSvg.querySelectorAll(".using-dial-hand, .user-dial-hand")) : [];

if (usingBannerSvg) {
const usingReducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const usingAnimationTimeoutIds = new Set();
let usingBubbleStream = null;
let usingFileStream = null;

const getRandomUsingDelay = (minimum, maximum) => {
return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
};

const getRandomUsingNumber = (minimum, maximum) => {
return Math.random() * (maximum - minimum) + minimum;
};

const queueUsingAnimation = (callback, delay) => {
const timeoutId = window.setTimeout(() => {
usingAnimationTimeoutIds.delete(timeoutId);
callback();
}, delay);

usingAnimationTimeoutIds.add(timeoutId);
};

const clearUsingAnimationQueue = () => {
for (const timeoutId of usingAnimationTimeoutIds) {
window.clearTimeout(timeoutId);
}

usingAnimationTimeoutIds.clear();
};

const resetUsingBannerMotion = () => {
delete usingBannerSvg.dataset.bubblesActive;

for (const bubble of usingBubbleParticles) {
bubble.removeAttribute("data-rise-active");
}

for (const file of usingFileParticles) {
file.removeAttribute("data-run-active");
}

for (const lane of usingFileLaneConfigs) {
for (const particle of lane.particles) {
particle.removeAttribute("data-run-active");
}
}

for (const dialFace of usingDialFaces) {
dialFace.style.rotate = "0deg";
}

for (const dialHand of usingDialHands) {
dialHand.style.rotate = "0deg";
}
};

const getUsingFileLaneBounds = (lane) => {
if (!lane.bounds) {
return null;
}

if (!lane.bounds.height || !lane.bounds.width) {
return null;
}

return {
height: lane.bounds.height,
width: lane.bounds.width,
x: lane.bounds.x,
y: lane.bounds.y,
};
};

const createUsingBubbleClipPath = () => {
if (!usingBubbleSeeds.length) {
return null;
}

const usingBannerDefs = usingBannerSvg.querySelector("defs");

if (!usingBannerDefs || !usingBubbleLaneBounds.width || !usingBubbleLaneBounds.height) {
return null;
}

let usingBubbleClipPath = usingBannerDefs.querySelector("#using-bubble-stream-clip");
let usingBubbleClipRect = usingBubbleClipPath?.querySelector("rect");

if (!usingBubbleClipPath) {
usingBubbleClipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
usingBubbleClipPath.setAttribute("id", "using-bubble-stream-clip");
usingBannerDefs.append(usingBubbleClipPath);
}

usingBubbleClipPath.setAttribute("clipPathUnits", "userSpaceOnUse");

if (!usingBubbleClipRect) {
usingBubbleClipRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
usingBubbleClipPath.append(usingBubbleClipRect);
}

usingBubbleClipRect.setAttribute("height", String(usingBubbleLaneBounds.height));
usingBubbleClipRect.setAttribute("width", String(usingBubbleLaneBounds.width));
usingBubbleClipRect.setAttribute("x", String(usingBubbleLaneBounds.x));
usingBubbleClipRect.setAttribute("y", String(usingBubbleLaneBounds.y));

if (!usingBubbleStream) {
usingBubbleStream = document.createElementNS("http://www.w3.org/2000/svg", "g");
usingBubbleStream.classList.add("using-bubble-stream");

if (usingBubbleGroup) {
usingBubbleGroup.before(usingBubbleStream);
} else {
usingBannerSvg.append(usingBubbleStream);
}
}

usingBubbleStream.setAttribute("clip-path", "url(#using-bubble-stream-clip)");

return usingBubbleLaneBounds;
};

const createUsingFileClipPath = () => {
const usingBannerDefs = usingBannerSvg.querySelector("defs");

if (!usingBannerDefs || !usingFileLaneBounds.height || !usingFileLaneBounds.width) {
return null;
}

let usingFileClipPath = usingBannerDefs.querySelector("#using-file-stream-clip");
let usingFileClipRect = usingFileClipPath?.querySelector("rect");

if (!usingFileClipPath) {
usingFileClipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
usingFileClipPath.setAttribute("id", "using-file-stream-clip");
usingBannerDefs.append(usingFileClipPath);
}

usingFileClipPath.setAttribute("clipPathUnits", "userSpaceOnUse");

if (!usingFileClipRect) {
usingFileClipRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
usingFileClipPath.append(usingFileClipRect);
}

usingFileClipRect.setAttribute("height", String(usingFileLaneBounds.height));
usingFileClipRect.setAttribute("width", String(usingFileLaneBounds.width));
usingFileClipRect.setAttribute("x", String(usingFileLaneBounds.x));
usingFileClipRect.setAttribute("y", String(usingFileLaneBounds.y));

if (!usingFileStream) {
usingFileStream = document.createElementNS("http://www.w3.org/2000/svg", "g");
usingFileStream.classList.add("using-file-stream");

if (usingFileStreamAnchor) {
usingFileStreamAnchor.before(usingFileStream);
} else {
usingBannerSvg.append(usingFileStream);
}
}

usingFileStream.setAttribute("clip-path", "url(#using-file-stream-clip)");

return usingFileLaneBounds;
};

const createUsingBubbleParticle = () => {
const bubble = document.createElementNS("http://www.w3.org/2000/svg", "circle");

bubble.classList.add("using-bubble-particle");
usingBubbleStream?.append(bubble);

return bubble;
};

const createUsingFileParticle = () => {
const file = document.createElementNS("http://www.w3.org/2000/svg", "use");

file.classList.add("using-file-particle");
file.setAttribute("height", "140");
file.setAttribute("href", "#using-file-blank");
file.setAttribute("width", "140");
usingFileStream?.append(file);

return file;
};

const createUsingFileLaneStream = (lane, maskBounds) => {
if (!usingBannerDefs) {
return null;
}

const usingLaneClipId = `using-file-lane-clip-${lane.clipIndex}`;
let usingLaneClipPath = usingBannerDefs.querySelector(`#${usingLaneClipId}`);
let usingLaneClipRect = usingLaneClipPath?.querySelector("rect");

if (!usingLaneClipPath) {
usingLaneClipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
usingLaneClipPath.setAttribute("id", usingLaneClipId);
usingBannerDefs.append(usingLaneClipPath);
}

usingLaneClipPath.setAttribute("clipPathUnits", "userSpaceOnUse");

if (!usingLaneClipRect) {
usingLaneClipRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
usingLaneClipPath.append(usingLaneClipRect);
}

usingLaneClipRect.setAttribute("height", String(maskBounds.height));
usingLaneClipRect.setAttribute("width", String(maskBounds.width));
usingLaneClipRect.setAttribute("x", String(maskBounds.x));
usingLaneClipRect.setAttribute("y", String(maskBounds.y));

if (!lane.stream) {
lane.stream = document.createElementNS("http://www.w3.org/2000/svg", "g");
lane.stream.classList.add("using-file-lane-stream");
lane.stream.dataset.direction = lane.direction;
lane.stream.dataset.family = lane.family;

if (usingFileLanesGroup) {
usingFileLanesGroup.append(lane.stream);
} else {
usingBannerSvg.append(lane.stream);
}
}

lane.stream.setAttribute("clip-path", `url(#${usingLaneClipId})`);

return lane.stream;
};

const createUsingFileLaneParticle = (lane) => {
const file = document.createElementNS("http://www.w3.org/2000/svg", "use");

file.classList.add("using-file-lane-particle");
file.dataset.direction = lane.direction;
lane.stream?.append(file);

return file;
};

const getUsingFileLaneMotionConfig = (lane, maskBounds) => {
const usingLaneFileDuration = lane.direction === "in" ? getRandomUsingDelay(6200, 8200) : getRandomUsingDelay(6400, 8600);
const usingLaneFileInterval = getRandomUsingDelay(1700, 2600);
const usingLaneFileParticleTotal = 3;
const usingLaneFileRun = Math.round(maskBounds.width + 96 + 36);

return {
cycleDuration: (usingLaneFileInterval * usingLaneFileParticleTotal) + getRandomUsingDelay(160, 920),
duration: usingLaneFileDuration,
initialDelay: getRandomUsingDelay(120, 1800),
interval: usingLaneFileInterval,
particleTotal: usingLaneFileParticleTotal,
run: usingLaneFileRun,
size: 96,
};
};

const refreshUsingFileLaneParticle = (file, lane, maskBounds, motionConfig) => {
const laneFamilySymbols = usingLaneFamilySymbols[lane.family];
const laneRotationDirection = Math.random() < .5 ? -1 : 1;
const laneEdgePadding = 16;
const laneStartX = lane.direction === "in" ? Math.round(maskBounds.x + laneEdgePadding) : Math.round(maskBounds.x + maskBounds.width - motionConfig.size - laneEdgePadding);
const laneStartYMin = Math.round(maskBounds.y + 14);
const laneStartYMax = Math.round(maskBounds.y + maskBounds.height - motionConfig.size - 14);
const laneStartY = laneStartYMin < laneStartYMax ? getRandomUsingDelay(laneStartYMin, laneStartYMax) : Math.round(maskBounds.y + ((maskBounds.height - motionConfig.size) / 2));
const laneSymbolHref = laneFamilySymbols.length ? laneFamilySymbols[getRandomUsingDelay(0, laneFamilySymbols.length - 1)] : "#using-file-blank";

file.removeAttribute("data-run-active");
file.setAttribute("height", String(motionConfig.size));
file.setAttribute("href", laneSymbolHref);
file.setAttribute("width", String(motionConfig.size));
file.style.setProperty("--using-lane-file-drift-end", `${getRandomUsingDelay(-12, 12)}px`);
file.style.setProperty("--using-lane-file-drift-mid", `${getRandomUsingDelay(-8, 8)}px`);
file.style.setProperty("--using-lane-file-duration", `${motionConfig.duration}ms`);
file.style.setProperty("--using-lane-file-opacity-peak", getRandomUsingNumber(.68, .92).toFixed(2));
file.style.setProperty("--using-lane-file-position-x", `${laneStartX}px`);
file.style.setProperty("--using-lane-file-position-y", `${laneStartY}px`);
file.style.setProperty("--using-lane-file-rotate-start", `${getRandomUsingDelay(-10, 10)}deg`);
file.style.setProperty("--using-lane-file-rotate-travel", `${laneRotationDirection * getRandomUsingDelay(16, 34)}deg`);
file.style.setProperty("--using-lane-file-run", `${lane.direction === "in" ? motionConfig.run : motionConfig.run * -1}px`);
file.style.setProperty("--using-lane-file-scale-end", getRandomUsingNumber(.92, .98).toFixed(2));
file.style.setProperty("--using-lane-file-scale-mid", getRandomUsingNumber(.97, 1.02).toFixed(2));
file.style.setProperty("--using-lane-file-scale-start", getRandomUsingNumber(.96, 1.01).toFixed(2));
};

const refreshUsingBubbleParticle = (bubble, maskBounds, duration) => {
const bubbleSeed = usingBubbleSeeds[getRandomUsingDelay(0, usingBubbleSeeds.length - 1)];
const bubbleStartMinX = Math.round(maskBounds.x + 6);
const bubbleStartMaxX = Math.round(maskBounds.x + maskBounds.width - 6);
const bubbleStartX = bubbleStartMinX < bubbleStartMaxX ? getRandomUsingDelay(bubbleStartMinX, bubbleStartMaxX) : Math.round(maskBounds.x + (maskBounds.width / 2));
const bubbleStartY = Math.round(maskBounds.y + maskBounds.height - getRandomUsingDelay(8, 28));

bubble.setAttribute("cx", String(bubbleStartX));
bubble.setAttribute("cy", String(bubbleStartY));
bubble.setAttribute("fill", bubbleSeed.fill);
bubble.setAttribute("r", bubbleSeed.r);
bubble.removeAttribute("data-rise-active");
bubble.style.setProperty("--using-bubble-drift-end", `${getRandomUsingDelay(-18, 18)}px`);
bubble.style.setProperty("--using-bubble-drift-mid", `${getRandomUsingDelay(-10, 10)}px`);
bubble.style.setProperty("--using-bubble-duration", `${duration}ms`);
bubble.style.setProperty("--using-bubble-opacity-peak", getRandomUsingNumber(.45, .9).toFixed(2));
bubble.style.setProperty("--using-bubble-rise", `${getRandomUsingDelay(Math.round(maskBounds.height - 18), Math.round(maskBounds.height + 30))}px`);
bubble.style.setProperty("--using-bubble-scale-end", getRandomUsingNumber(1, 1.3).toFixed(2));
bubble.style.setProperty("--using-bubble-scale-mid", getRandomUsingNumber(.88, 1.06).toFixed(2));
bubble.style.setProperty("--using-bubble-scale-start", getRandomUsingNumber(.45, .78).toFixed(2));
};

const getUsingFileMotionConfig = (maskBounds) => {
const usingFileHeight = 140;
const usingFileWidth = 140;
const usingFileRun = Math.round(maskBounds.width + usingFileWidth + 28);
const usingFileDuration = 5600;
const usingFileSpacing = usingFileWidth + 36;
const usingFileInterval = Math.max(1000, Math.ceil((usingFileSpacing / usingFileRun) * usingFileDuration));
const usingFileParticleTotal = Math.max(4, Math.ceil(usingFileDuration / usingFileInterval) + 1);

return {
duration: usingFileDuration,
height: usingFileHeight,
interval: usingFileInterval,
particleTotal: usingFileParticleTotal,
run: usingFileRun,
width: usingFileWidth,
};
};

const refreshUsingFileParticle = (file, maskBounds, fileMotionConfig) => {
const fileRotationDirection = Math.random() < .5 ? -1 : 1;
const fileStartYMin = Math.round(maskBounds.y + 12);
const fileStartYMax = Math.round(maskBounds.y + maskBounds.height - fileMotionConfig.height - 12);
const fileStartY = fileStartYMin < fileStartYMax ? getRandomUsingDelay(fileStartYMin, fileStartYMax) : Math.round(maskBounds.y + ((maskBounds.height - fileMotionConfig.height) / 2));

file.removeAttribute("data-run-active");
file.style.setProperty("--using-file-drift-end", `${getRandomUsingDelay(-12, 12)}px`);
file.style.setProperty("--using-file-drift-mid", `${getRandomUsingDelay(-8, 8)}px`);
file.style.setProperty("--using-file-duration", `${fileMotionConfig.duration}ms`);
file.style.setProperty("--using-file-opacity-peak", getRandomUsingNumber(.64, .9).toFixed(2));
file.style.setProperty("--using-file-position-x", `${Math.round(maskBounds.x - fileMotionConfig.width + 10)}px`);
file.style.setProperty("--using-file-position-y", `${fileStartY}px`);
file.style.setProperty("--using-file-rotate-start", `${getRandomUsingDelay(-18, 18)}deg`);
file.style.setProperty("--using-file-rotate-travel", `${fileRotationDirection * getRandomUsingDelay(32, 58)}deg`);
file.style.setProperty("--using-file-run", `${fileMotionConfig.run}px`);
file.style.setProperty("--using-file-scale-end", getRandomUsingNumber(.95, 1).toFixed(2));
file.style.setProperty("--using-file-scale-mid", getRandomUsingNumber(.97, 1.02).toFixed(2));
file.style.setProperty("--using-file-scale-start", getRandomUsingNumber(.98, 1.03).toFixed(2));
};

const scheduleUsingBubbleMotion = (bubble, maskBounds, delay) => {
queueUsingAnimation(() => {
const duration = getRandomUsingDelay(3200, 5600);

if (usingReducedMotionPreference.matches) {
bubble.removeAttribute("data-rise-active");
return;
}

refreshUsingBubbleParticle(bubble, maskBounds, duration);
void bubble.getBoundingClientRect();
bubble.dataset.riseActive = "true";
scheduleUsingBubbleMotion(bubble, maskBounds, duration + getRandomUsingDelay(300, 1800));
}, delay);
};

const scheduleUsingFileMotion = (file, maskBounds, fileMotionConfig, delay) => {
queueUsingAnimation(() => {
if (usingReducedMotionPreference.matches) {
file.removeAttribute("data-run-active");
return;
}

refreshUsingFileParticle(file, maskBounds, fileMotionConfig);
void file.getBoundingClientRect();
file.dataset.runActive = "true";
scheduleUsingFileMotion(file, maskBounds, fileMotionConfig, fileMotionConfig.interval * fileMotionConfig.particleTotal);
}, delay);
};

const scheduleUsingFileLaneMotion = (lane, file, maskBounds, motionConfig, delay) => {
queueUsingAnimation(() => {
if (usingReducedMotionPreference.matches) {
file.removeAttribute("data-run-active");
return;
}

refreshUsingFileLaneParticle(file, lane, maskBounds, motionConfig);
void file.getBoundingClientRect();
file.dataset.runActive = "true";
scheduleUsingFileLaneMotion(lane, file, maskBounds, motionConfig, motionConfig.cycleDuration + getRandomUsingDelay(0, motionConfig.interval));
}, delay);
};

const scheduleUsingDialFaceMotion = (dialFace) => {
queueUsingAnimation(() => {
if (usingReducedMotionPreference.matches) {
dialFace.style.rotate = "0deg";
return;
}

const nextRotation = getRandomUsingDelay(-90, 90);

dialFace.style.rotate = `${nextRotation}deg`;
scheduleUsingDialFaceMotion(dialFace);
}, getRandomUsingDelay(2200, 5600));
};

const scheduleUsingDialHandMotion = (dialHand) => {
queueUsingAnimation(() => {
if (usingReducedMotionPreference.matches) {
dialHand.style.rotate = "0deg";
return;
}

const nextRotation = getRandomUsingDelay(-90, 90);

dialHand.style.rotate = `${nextRotation}deg`;
scheduleUsingDialHandMotion(dialHand);
}, getRandomUsingDelay(1800, 5200));
};

const syncUsingBannerMotion = () => {
clearUsingAnimationQueue();
resetUsingBannerMotion();

if (usingReducedMotionPreference.matches) {
return;
}

const usingFileMaskBounds = createUsingFileClipPath();

if (usingFileMaskBounds) {
const usingFileMotionConfig = getUsingFileMotionConfig(usingFileMaskBounds);

if (!usingFileParticles.length) {
for (let fileIndex = 0; fileIndex < usingFileMotionConfig.particleTotal; fileIndex += 1) {
usingFileParticles.push(createUsingFileParticle());
}
}

for (const [fileIndex, file] of usingFileParticles.entries()) {
scheduleUsingFileMotion(file, usingFileMaskBounds, usingFileMotionConfig, fileIndex * usingFileMotionConfig.interval);
}
}

for (const lane of usingFileLaneConfigs) {
const usingLaneMaskBounds = getUsingFileLaneBounds(lane);

if (!usingLaneMaskBounds || !createUsingFileLaneStream(lane, usingLaneMaskBounds)) {
continue;
}

const usingLaneMotionConfig = getUsingFileLaneMotionConfig(lane, usingLaneMaskBounds);

if (lane.particles.length < usingLaneMotionConfig.particleTotal) {
for (let laneParticleIndex = lane.particles.length; laneParticleIndex < usingLaneMotionConfig.particleTotal; laneParticleIndex += 1) {
lane.particles.push(createUsingFileLaneParticle(lane));
}
}

for (const [laneParticleIndex, laneParticle] of lane.particles.entries()) {
scheduleUsingFileLaneMotion(
lane,
laneParticle,
usingLaneMaskBounds,
usingLaneMotionConfig,
usingLaneMotionConfig.initialDelay + (laneParticleIndex * usingLaneMotionConfig.interval) + getRandomUsingDelay(0, Math.round(usingLaneMotionConfig.interval * .35)),
);
}
}

if (usingBubbleSeeds.length) {
const usingBubbleMaskBounds = createUsingBubbleClipPath();

if (usingBubbleMaskBounds) {
usingBannerSvg.dataset.bubblesActive = "true";
usingBannerSvg.dataset.bubblesReady = "true";

if (!usingBubbleParticles.length) {
for (let bubbleIndex = 0; bubbleIndex < Math.max(usingBubbleSeeds.length, 6); bubbleIndex += 1) {
usingBubbleParticles.push(createUsingBubbleParticle());
}
}

for (const bubble of usingBubbleParticles) {
scheduleUsingBubbleMotion(bubble, usingBubbleMaskBounds, getRandomUsingDelay(200, 2200));
}
}
}

for (const dialFace of usingDialFaces) {
scheduleUsingDialFaceMotion(dialFace);
}

for (const dialHand of usingDialHands) {
scheduleUsingDialHandMotion(dialHand);
}
};

if (typeof usingReducedMotionPreference.addEventListener === "function") {
usingReducedMotionPreference.addEventListener("change", syncUsingBannerMotion);
} else if (typeof usingReducedMotionPreference.addListener === "function") {
usingReducedMotionPreference.addListener(syncUsingBannerMotion);
}

syncUsingBannerMotion();
}

const enterpriseAnimationSpeedMultipliers = [.82, 1.08, .94, 1.22, 1];
const enterprisePiles = Array.from(document.querySelectorAll(".enterprise-pile"));

if (enterprisePiles.length) {
const enterpriseReducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const enterpriseInitialPileCounts = [3, 5, 7, 4, 6];
const enterpriseMaximumFileCount = 9;
const enterpriseMinimumPileCount = 2;
const enterprisePileStates = enterprisePiles.map((pile, pileIndex) => ({
count: 0,
files: Array.from(pile.querySelectorAll('use[href^="#enterprise-file-"]')),
lastLowCount: enterpriseInitialPileCounts[pileIndex % enterpriseInitialPileCounts.length],
nextLowCount: null,
speedMultiplier: enterpriseAnimationSpeedMultipliers[pileIndex % enterpriseAnimationSpeedMultipliers.length],
timeoutId: 0,
}));

const getRandomEnterpriseDelay = (minimum, maximum) => {
return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
};

const getRandomEnterprisePileDelay = (pileState, minimum, maximum) => {
return Math.round(getRandomEnterpriseDelay(minimum, maximum) * pileState.speedMultiplier);
};

const setEnterprisePileFileCount = (pileState, nextCount) => {
pileState.count = nextCount;

for (const [fileIndex, file] of pileState.files.entries()) {
if (fileIndex < nextCount) {
file.dataset.stackVisible = "true";
} else {
file.dataset.stackVisible = "false";
}
}
};

const clearEnterprisePileTimers = () => {
for (const pileState of enterprisePileStates) {
window.clearTimeout(pileState.timeoutId);
pileState.timeoutId = 0;
pileState.nextLowCount = null;
}
};

const getNextEnterpriseLowCount = (pileState) => {
let nextLowCount = pileState.lastLowCount;

while (nextLowCount === pileState.lastLowCount) {
nextLowCount = getRandomEnterpriseDelay(enterpriseMinimumPileCount, enterpriseMaximumFileCount - 1);
}

return nextLowCount;
};

const scheduleEnterprisePileGrowth = (pileState, delay) => {
pileState.timeoutId = window.setTimeout(() => {
if (pileState.count < enterpriseMaximumFileCount) {
setEnterprisePileFileCount(pileState, pileState.count + 1);
scheduleEnterprisePileGrowth(pileState, getRandomEnterprisePileDelay(pileState, 220, 360));
return;
}

pileState.nextLowCount = getNextEnterpriseLowCount(pileState);
scheduleEnterprisePileShrink(pileState, getRandomEnterprisePileDelay(pileState, 1300, 2400));
}, delay);
};

const scheduleEnterprisePileShrink = (pileState, delay) => {
pileState.timeoutId = window.setTimeout(() => {
const nextLowCount = pileState.nextLowCount ?? getNextEnterpriseLowCount(pileState);

pileState.nextLowCount = nextLowCount;

if (pileState.count > nextLowCount) {
setEnterprisePileFileCount(pileState, pileState.count - 1);
scheduleEnterprisePileShrink(pileState, getRandomEnterprisePileDelay(pileState, 220, 340));
return;
}

pileState.lastLowCount = nextLowCount;
pileState.nextLowCount = null;
scheduleEnterprisePileGrowth(pileState, getRandomEnterprisePileDelay(pileState, 1200, 2200));
}, delay);
};

const applyEnterprisePileStaticState = () => {
clearEnterprisePileTimers();

for (const [pileIndex, pileState] of enterprisePileStates.entries()) {
const initialCount = enterpriseInitialPileCounts[pileIndex % enterpriseInitialPileCounts.length];

pileState.lastLowCount = initialCount;
setEnterprisePileFileCount(pileState, initialCount);
}
};

const startEnterprisePileAnimation = () => {
clearEnterprisePileTimers();

for (const [pileIndex, pileState] of enterprisePileStates.entries()) {
const initialCount = enterpriseInitialPileCounts[pileIndex % enterpriseInitialPileCounts.length];

pileState.lastLowCount = initialCount;
setEnterprisePileFileCount(pileState, initialCount);
scheduleEnterprisePileGrowth(pileState, getRandomEnterprisePileDelay(pileState, 900, 2200) + Math.round(pileIndex * 220 * pileState.speedMultiplier));
}
};

const syncEnterprisePileAnimationState = () => {
if (enterpriseReducedMotionPreference.matches) {
applyEnterprisePileStaticState();
return;
}

startEnterprisePileAnimation();
};

if (typeof enterpriseReducedMotionPreference.addEventListener === "function") {
enterpriseReducedMotionPreference.addEventListener("change", syncEnterprisePileAnimationState);
} else if (typeof enterpriseReducedMotionPreference.addListener === "function") {
enterpriseReducedMotionPreference.addListener(syncEnterprisePileAnimationState);
}

syncEnterprisePileAnimationState();
}

const enterpriseBannerSvg = document.getElementById("banner-enterprise-svg");

if (enterpriseBannerSvg) {
const enterpriseBannerDefs = enterpriseBannerSvg.querySelector("defs");
const enterpriseCodingFileHeight = 98;
const enterpriseCodingFileWidth = 98;
const enterpriseCodingHorizontalPadding = 0;
const enterpriseFileLanes = [];
const enterpriseReducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const enterpriseStreamAnchor = enterpriseBannerSvg.querySelector(".enterprise-pile") || enterpriseBannerSvg.querySelector("#enterprise-static");

const getRandomEnterpriseFileDelay = (minimum, maximum) => {
return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
};

const getRandomEnterpriseFileNumber = (minimum, maximum) => {
return (Math.random() * (maximum - minimum)) + minimum;
};

const getScaledEnterpriseFileDelay = (minimum, maximum, speedMultiplier) => {
return Math.round(getRandomEnterpriseFileDelay(minimum, maximum) * speedMultiplier);
};

const getEnterpriseSymbolIds = (prefix) => {
return Array.from(enterpriseBannerSvg.querySelectorAll(`symbol[id^="${prefix}"]`)).map((symbol) => symbol.id);
};

const createEnterpriseFileStream = (bounds, clipPathId, streamClassName) => {
if (!enterpriseBannerDefs || !bounds) {
return null;
}

if (!bounds.width || !bounds.height) {
return null;
}

let enterpriseStreamClipPath = enterpriseBannerDefs.querySelector(`#${clipPathId}`);
let enterpriseStreamClipRect = enterpriseStreamClipPath?.querySelector("rect");

if (!enterpriseStreamClipPath) {
enterpriseStreamClipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
enterpriseStreamClipPath.setAttribute("id", clipPathId);
enterpriseBannerDefs.append(enterpriseStreamClipPath);
}

enterpriseStreamClipPath.setAttribute("clipPathUnits", "userSpaceOnUse");

if (!enterpriseStreamClipRect) {
enterpriseStreamClipRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
enterpriseStreamClipPath.append(enterpriseStreamClipRect);
}

enterpriseStreamClipRect.setAttribute("height", String(bounds.height));
enterpriseStreamClipRect.setAttribute("width", String(bounds.width));
enterpriseStreamClipRect.setAttribute("x", String(bounds.x));
enterpriseStreamClipRect.setAttribute("y", String(bounds.y));

let enterpriseTargetStream = enterpriseBannerSvg.querySelector(`.${streamClassName}`);

if (!enterpriseTargetStream) {
enterpriseTargetStream = document.createElementNS("http://www.w3.org/2000/svg", "g");
enterpriseTargetStream.classList.add(streamClassName);
enterpriseStreamAnchor?.before(enterpriseTargetStream);
}

enterpriseTargetStream.setAttribute("clip-path", `url(#${clipPathId})`);

return {
bounds,
stream: enterpriseTargetStream,
};
};

const createEnterpriseRiseParticle = (stream) => {
const particle = document.createElementNS("http://www.w3.org/2000/svg", "use");

particle.classList.add("enterprise-file-rise-particle");
stream.append(particle);

return particle;
};

const createEnterpriseFallParticle = (stream) => {
const particle = document.createElementNS("http://www.w3.org/2000/svg", "use");

particle.classList.add("enterprise-file-fall-particle");
stream.append(particle);

return particle;
};

const refreshEnterpriseRiseParticle = (particle, lane, duration) => {
const symbolId = lane.symbolIds[getRandomEnterpriseFileDelay(0, lane.symbolIds.length - 1)];
const rotationDirection = Math.random() < .5 ? -1 : 1;
const rotationStart = getRandomEnterpriseFileDelay(-10, 10);
const rotationMid = rotationStart + (rotationDirection * getRandomEnterpriseFileDelay(12, 24));
const rotationEnd = rotationStart + (rotationDirection * getRandomEnterpriseFileDelay(24, 42));
const startMinimumX = Math.round(lane.bounds.x + enterpriseCodingHorizontalPadding);
const startMaximumX = Math.round(lane.bounds.x + lane.bounds.width - enterpriseCodingFileWidth - enterpriseCodingHorizontalPadding);
const startX = startMinimumX < startMaximumX ? getRandomEnterpriseFileDelay(startMinimumX, startMaximumX) : Math.round(lane.bounds.x + ((lane.bounds.width - enterpriseCodingFileWidth) / 2));
const startY = Math.round(lane.bounds.y + lane.bounds.height - enterpriseCodingFileHeight - getRandomEnterpriseFileDelay(12, 64));

particle.setAttribute("height", String(enterpriseCodingFileHeight));
particle.setAttribute("href", `#${symbolId}`);
particle.setAttribute("width", String(enterpriseCodingFileWidth));
particle.removeAttribute("data-rise-active");

particle.style.setProperty("--enterprise-file-drift-end", `${getRandomEnterpriseFileDelay(-36, 36)}px`);
particle.style.setProperty("--enterprise-file-drift-mid", `${getRandomEnterpriseFileDelay(-24, 24)}px`);
particle.style.setProperty("--enterprise-file-duration", `${duration}ms`);
particle.style.setProperty("--enterprise-file-opacity-mid", getRandomEnterpriseFileNumber(.22, .44).toFixed(2));
particle.style.setProperty("--enterprise-file-opacity-peak", getRandomEnterpriseFileNumber(.68, .9).toFixed(2));
particle.style.setProperty("--enterprise-file-position-x", `${startX}px`);
particle.style.setProperty("--enterprise-file-position-y", `${startY}px`);
particle.style.setProperty("--enterprise-file-rise", `${getRandomEnterpriseFileDelay(Math.round(lane.bounds.height + 110), Math.round(lane.bounds.height + 210))}px`);
particle.style.setProperty("--enterprise-file-rotate-end", `${rotationEnd}deg`);
particle.style.setProperty("--enterprise-file-rotate-mid", `${rotationMid}deg`);
particle.style.setProperty("--enterprise-file-rotate-start", `${rotationStart}deg`);
particle.style.setProperty("--enterprise-file-scale-end", getRandomEnterpriseFileNumber(.68, .82).toFixed(2));
particle.style.setProperty("--enterprise-file-scale-mid", getRandomEnterpriseFileNumber(.82, .92).toFixed(2));
particle.style.setProperty("--enterprise-file-scale-start", getRandomEnterpriseFileNumber(.92, 1).toFixed(2));
};

const refreshEnterpriseFallParticle = (particle, lane, duration) => {
const symbolId = lane.symbolIds[getRandomEnterpriseFileDelay(0, lane.symbolIds.length - 1)];
const rotationDirection = Math.random() < .5 ? -1 : 1;
const rotationStart = getRandomEnterpriseFileDelay(-10, 10);
const rotationMid = rotationStart + (rotationDirection * getRandomEnterpriseFileDelay(12, 24));
const rotationEnd = rotationStart + (rotationDirection * getRandomEnterpriseFileDelay(24, 42));
const startMinimumX = Math.round(lane.bounds.x + enterpriseCodingHorizontalPadding);
const startMaximumX = Math.round(lane.bounds.x + lane.bounds.width - enterpriseCodingFileWidth - enterpriseCodingHorizontalPadding);
const startX = startMinimumX < startMaximumX ? getRandomEnterpriseFileDelay(startMinimumX, startMaximumX) : Math.round(lane.bounds.x + ((lane.bounds.width - enterpriseCodingFileWidth) / 2));
const startY = Math.round(lane.bounds.y + getRandomEnterpriseFileDelay(-26, 18));

particle.setAttribute("height", String(enterpriseCodingFileHeight));
particle.setAttribute("href", `#${symbolId}`);
particle.setAttribute("width", String(enterpriseCodingFileWidth));
particle.removeAttribute("data-fall-active");

particle.style.setProperty("--enterprise-file-fall-drift-end", `${getRandomEnterpriseFileDelay(-36, 36)}px`);
particle.style.setProperty("--enterprise-file-fall-drift-mid", `${getRandomEnterpriseFileDelay(-24, 24)}px`);
particle.style.setProperty("--enterprise-file-fall-drop", `${getRandomEnterpriseFileDelay(Math.round(lane.bounds.height + 110), Math.round(lane.bounds.height + 210))}px`);
particle.style.setProperty("--enterprise-file-fall-duration", `${duration}ms`);
particle.style.setProperty("--enterprise-file-fall-opacity-mid", getRandomEnterpriseFileNumber(.22, .44).toFixed(2));
particle.style.setProperty("--enterprise-file-fall-opacity-peak", getRandomEnterpriseFileNumber(.68, .9).toFixed(2));
particle.style.setProperty("--enterprise-file-fall-position-x", `${startX}px`);
particle.style.setProperty("--enterprise-file-fall-position-y", `${startY}px`);
particle.style.setProperty("--enterprise-file-fall-rotate-end", `${rotationEnd}deg`);
particle.style.setProperty("--enterprise-file-fall-rotate-mid", `${rotationMid}deg`);
particle.style.setProperty("--enterprise-file-fall-rotate-start", `${rotationStart}deg`);
particle.style.setProperty("--enterprise-file-fall-scale-end", getRandomEnterpriseFileNumber(.68, .82).toFixed(2));
particle.style.setProperty("--enterprise-file-fall-scale-mid", getRandomEnterpriseFileNumber(.82, .92).toFixed(2));
particle.style.setProperty("--enterprise-file-fall-scale-start", getRandomEnterpriseFileNumber(.92, 1).toFixed(2));
};

const clearEnterpriseFileParticles = () => {
for (const lane of enterpriseFileLanes) {
for (const particle of lane.particles) {
particle.removeAttribute("data-fall-active");
particle.removeAttribute("data-rise-active");
}
}
};

const scheduleEnterpriseLaneParticleMotion = (lane, particle, delay) => {
window.setTimeout(() => {
const duration = lane.direction === "fall" ? getScaledEnterpriseFileDelay(9000, 12400, lane.speedMultiplier) : getScaledEnterpriseFileDelay(8800, 12400, lane.speedMultiplier);

if (!enterpriseReducedMotionPreference.matches) {
if (lane.direction === "fall") {
refreshEnterpriseFallParticle(particle, lane, duration);
void particle.getBoundingClientRect();
particle.dataset.fallActive = "true";
particle.removeAttribute("data-rise-active");
} else {
refreshEnterpriseRiseParticle(particle, lane, duration);
void particle.getBoundingClientRect();
particle.dataset.riseActive = "true";
particle.removeAttribute("data-fall-active");
}
} else {
particle.removeAttribute("data-fall-active");
particle.removeAttribute("data-rise-active");
}

scheduleEnterpriseLaneParticleMotion(lane, particle, duration + getScaledEnterpriseFileDelay(1800, 3000, lane.speedMultiplier));
}, delay);
};

const syncEnterpriseFileAnimationState = () => {
if (enterpriseReducedMotionPreference.matches) {
clearEnterpriseFileParticles();
}
};

const enterpriseFileLaneConfigs = [
{ bounds: { height: 500, width: 250, x: 59, y: 9 }, direction: "rise", streamClassName: "enterprise-file-stream-1", symbolPrefix: "enterprise-file-coding-", speedMultiplier: enterpriseAnimationSpeedMultipliers[0] },
{ bounds: { height: 500, width: 250, x: 341, y: 9 }, direction: "fall", streamClassName: "enterprise-file-stream-2", symbolPrefix: "enterprise-file-general-", speedMultiplier: enterpriseAnimationSpeedMultipliers[1] },
{ bounds: { height: 500, width: 250, x: 624, y: 9 }, direction: "rise", streamClassName: "enterprise-file-stream-3", symbolPrefix: "enterprise-file-office-", speedMultiplier: enterpriseAnimationSpeedMultipliers[2] },
{ bounds: { height: 500, width: 250, x: 906, y: 9 }, direction: "rise", streamClassName: "enterprise-file-stream-4", symbolPrefix: "enterprise-file-design-", speedMultiplier: enterpriseAnimationSpeedMultipliers[3] },
{ bounds: { height: 500, width: 250, x: 1188, y: 9 }, direction: "fall", streamClassName: "enterprise-file-stream-5", symbolPrefix: "enterprise-file-music-", speedMultiplier: enterpriseAnimationSpeedMultipliers[4] },
];

for (const [laneIndex, laneConfig] of enterpriseFileLaneConfigs.entries()) {
const symbolIds = getEnterpriseSymbolIds(laneConfig.symbolPrefix);

if (!symbolIds.length) {
continue;
}

const laneStream = createEnterpriseFileStream(laneConfig.bounds, `enterprise-file-stream-clip-${laneIndex + 1}`, laneConfig.streamClassName);

if (!laneStream) {
continue;
}

const lane = {
bounds: laneStream.bounds,
direction: laneConfig.direction,
particles: [],
speedMultiplier: laneConfig.speedMultiplier,
stream: laneStream.stream,
symbolIds,
};

enterpriseFileLanes.push(lane);

for (let enterpriseParticleIndex = 0; enterpriseParticleIndex < 4; enterpriseParticleIndex += 1) {
const particle = lane.direction === "fall" ? createEnterpriseFallParticle(lane.stream) : createEnterpriseRiseParticle(lane.stream);

lane.particles.push(particle);
scheduleEnterpriseLaneParticleMotion(lane, particle, getScaledEnterpriseFileDelay(250, 3200, lane.speedMultiplier) + Math.round(enterpriseParticleIndex * 680 * lane.speedMultiplier));
}
}

if (typeof enterpriseReducedMotionPreference.addEventListener === "function") {
enterpriseReducedMotionPreference.addEventListener("change", syncEnterpriseFileAnimationState);
} else if (typeof enterpriseReducedMotionPreference.addListener === "function") {
enterpriseReducedMotionPreference.addListener(syncEnterpriseFileAnimationState);
}

syncEnterpriseFileAnimationState();
}
