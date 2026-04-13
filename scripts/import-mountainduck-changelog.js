const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const markdownIt = require("markdown-it");

const projectRoot = path.resolve(__dirname, "..");
const sourcePath = process.argv[2] || "/tmp/mountainduck-changelog.html";
const changelogDir = path.join(projectRoot, "src", "changelog");
const legacyPartialPath = path.join(projectRoot, "src", "_includes", "partials", "legacy-releases.html");
const modernCount = 15;
const md = markdownIt({ html: true });

const html = fs.readFileSync(sourcePath, "utf8");
const tableStart = html.indexOf('<table class="table table-responsive table-striped table-dark changelog">');
const tableEnd = html.indexOf("</table>", tableStart);

if (tableStart === -1 || tableEnd === -1) {
  throw new Error("Changelog table not found");
}

const tableHtml = html.slice(tableStart, tableEnd + "</table>".length);
const rowMatches = [...tableHtml.matchAll(/<tr>([\s\S]*?)(?=<tr>|<\/table>)/g)].map((match) => match[1]);

if (rowMatches.length === 0) {
  throw new Error("No changelog rows found");
}

const modernRows = rowMatches.slice(0, modernCount);
const legacyRows = rowMatches.slice(modernCount);

const months = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12"
};

function decodeHtml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x2192;/gi, "→")
    .replace(/&#8594;/g, "→");
}

function stripTags(value) {
  return decodeHtml(String(value || "").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function htmlToMarkdown(value) {
  let output = String(value || "");

  output = output.replace(/<a[^>]*href=([^\s>]+)[^>]*>([\s\S]*?)<\/a>/g, (_, href, text) => {
    const cleanHref = decodeHtml(href.replace(/^['"]|['"]$/g, ""));
    const cleanText = stripTags(text);

    return `[${cleanText}](${cleanHref})`;
  });

  output = output.replace(/<strong>([\s\S]*?)<\/strong>/g, "**$1**");
  output = output.replace(/<em>([\s\S]*?)<\/em>/g, "*$1*");
  output = output.replace(/<br\s*\/?>/g, " ");
  output = output.replace(/<[^>]+>/g, " ");

  return decodeHtml(output)
    .replace(/\s+/g, " ")
    .replace(/\s+([),.:;])/g, "$1")
    .trim();
}

function formatIsoDate(label) {
  const match = String(label || "").trim().match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);

  if (!match) {
    return null;
  }

  const day = match[1].padStart(2, "0");
  const month = months[match[2]];
  const year = match[3];

  return month ? `${year}-${month}-${day}` : null;
}

function slugifyVersion(version) {
  return String(version || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cleanDownloadLabel(label) {
  const normalized = String(label || "").replace(/^Download\s+/i, "").trim();

  return normalized === "(macOS)" ? "macOS" : normalized;
}

function renderMarkdown(value) {
  return md.render(String(value || ""));
}

function renderInlineMarkdown(value) {
  return md.renderInline(String(value || ""));
}

function parseRow(row, index) {
  const secondCellIndex = row.search(/<td[^>]*col-md-8[^>]*>/i);
  const meta = secondCellIndex === -1 ? row : row.slice(0, secondCellIndex);
  const details = secondCellIndex === -1
    ? ""
    : row.slice(secondCellIndex).replace(/^<td[^>]*>/i, "");

  const versionMatch = meta.match(/Version\s+([^<]+)/i);
  const version = versionMatch ? versionMatch[1].trim() : `unknown-${index + 1}`;
  const dateMatch = meta.match(/<em>([^<]+)<\/em>/i);
  const sourceDateLabel = dateMatch ? stripTags(dateMatch[1]) : "";

  let releaseDate = formatIsoDate(sourceDateLabel);
  let releaseDateLabel;

  if (version === "5.0.3" && !releaseDate) {
    releaseDate = "2025-09-28";
    releaseDateLabel = "Date unavailable in source table";
  }

  const dangerLabelMatch = meta.match(/<span class="label label-danger">([\s\S]*?)<\/span>/i);
  let statusLabel = stripTags(dangerLabelMatch ? dangerLabelMatch[1] : "") || undefined;
  let statusTone = statusLabel ? "warning" : undefined;

  const warningCallout = (meta.match(/<p class="alert alert-warning">([\s\S]*?)<\/p>/i) || [])[1];
  const infoCallout = (meta.match(/<p class="alert alert-info">([\s\S]*?)<\/p>/i) || [])[1];
  const callouts = [];

  if (warningCallout) {
    callouts.push({
      title: "Upgrade notice",
      body: htmlToMarkdown(warningCallout),
      tone: "warning"
    });

    if (!statusLabel) {
      statusLabel = "Paid upgrade";
      statusTone = "warning";
    }
  }

  if (infoCallout) {
    const linkMatch = infoCallout.match(/<a[^>]*href=([^\s>]+)[^>]*>([\s\S]*?)<\/a>/i);

    callouts.push({
      title: "Press release",
      body: htmlToMarkdown(infoCallout),
      url: linkMatch ? decodeHtml(linkMatch[1].replace(/^['"]|['"]$/g, "")) : undefined,
      linkText: linkMatch ? stripTags(linkMatch[2]) : undefined,
      tone: "info"
    });
  }

  const requirements = [...meta.matchAll(/<span class="label label-primary">([\s\S]*?)<\/span>/gi)]
    .map((match) => stripTags(match[1]))
    .filter(Boolean);

  const downloads = [...meta.matchAll(/<a[^>]*href=([^\s>]+)[^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({
      url: decodeHtml(match[1].replace(/^['"]|['"]$/g, "")),
      label: stripTags(match[2])
    }))
    .filter((item) => item.label.toLowerCase().startsWith("download"));

  const changes = [...details.matchAll(/<li><span class="label [^"]+">([\s\S]*?)<\/span>([\s\S]*?)(?=<li>|$)/gi)]
    .map((match) => ({
      type: stripTags(match[1]),
      summary: htmlToMarkdown(match[2])
    }))
    .filter((item) => item.type && item.summary);

  const data = {
    version,
    order: 1,
    ...(releaseDate ? { releaseDate } : {}),
    ...(releaseDateLabel ? { releaseDateLabel } : {}),
    ...(statusLabel ? { statusLabel } : {}),
    ...(statusTone ? { statusTone } : {}),
    ...(requirements.length ? { requirements } : {}),
    ...(downloads.length ? { downloads } : {}),
    ...(callouts.length ? { callouts } : {}),
    ...(changes.length ? { changes } : {})
  };

  const fileName = `${releaseDate || "release"}-${slugifyVersion(version)}.md`;

  return { fileName, data };
}

function renderLegacyEntry(entry, index) {
  const releaseDateMarkup = entry.data.releaseDateLabel
    ? `<p data-release-date-label>${escapeHtml(entry.data.releaseDateLabel)}</p>`
    : entry.data.releaseDate
      ? `<time datetime="${escapeHtml(entry.data.releaseDate)}">${escapeHtml(sourceDateLabel(entry.data.releaseDate))}</time>`
      : "";

  const calloutsMarkup = entry.data.callouts && entry.data.callouts.length
    ? `<div data-callouts>${entry.data.callouts.map((callout) => {
        const tone = callout.tone ? ` data-tone="${escapeHtml(callout.tone)}"` : "";
        const title = callout.title ? `<h4>${escapeHtml(callout.title)}</h4>` : "";
        const body = callout.body ? renderMarkdown(callout.body) : "";
        const link = callout.url
          ? `<p><a href="${escapeHtml(callout.url)}">${escapeHtml(callout.linkText || callout.url)}</a></p>`
          : "";

        return `<section data-callout${tone}>${title}${body}${link}</section>`;
      }).join("")}</div>`
    : "";

  const requirementsMarkup = entry.data.requirements && entry.data.requirements.length
    ? `<details data-requirements-disclosure><summary>Requirements</summary><ul aria-label="Requirements for version ${escapeHtml(entry.data.version)}" data-requirements>${entry.data.requirements.map((requirement) => `<li><span data-changelog-chip>${escapeHtml(requirement)}</span></li>`).join("")}</ul></details>`
    : "";

  const downloadsMarkup = entry.data.downloads && entry.data.downloads.length
    ? `<details data-downloads-disclosure><summary>Available downloads</summary><ul aria-label="Downloads for version ${escapeHtml(entry.data.version)}" data-downloads>${entry.data.downloads.map((download) => `<li><a class="btn" data-variant="s" href="${escapeHtml(download.url)}">${escapeHtml(cleanDownloadLabel(download.label))}</a></li>`).join("")}</ul></details>`
    : "";

  const changesMarkup = entry.data.changes && entry.data.changes.length
    ? `<ul aria-label="Changes in version ${escapeHtml(entry.data.version)}" data-change-list>${entry.data.changes.map((change) => `<li><b data-change-type="${escapeHtml(String(change.type || "").trim().toLowerCase())}">${escapeHtml(change.type)}</b><div>${renderMarkdown(change.summary)}</div></li>`).join("")}</ul>`
    : "";

  const statusMarkup = entry.data.statusLabel
    ? `<span data-release-status${entry.data.statusTone ? ` data-tone="${escapeHtml(entry.data.statusTone)}"` : ""}>${escapeHtml(entry.data.statusLabel)}</span>`
    : "";

  return `<article class="item-changelog legacy-release" id="legacy-release-${index + 1}"><div class="layout" data-layout="london"><div><h3>${escapeHtml(entry.data.version)}${statusMarkup ? ` ${statusMarkup}` : ""}</h3>${releaseDateMarkup}${calloutsMarkup}${requirementsMarkup}${downloadsMarkup}</div><div>${changesMarkup}</div></div></article>`;
}

function sourceDateLabel(isoDate) {
  const [year, month, day] = String(isoDate || "").split("-");
  const monthLabel = Object.keys(months).find((key) => months[key] === month);

  return year && monthLabel && day ? `${Number(day)} ${monthLabel} ${year}` : String(isoDate || "");
}

for (const fileName of fs.readdirSync(changelogDir)) {
  if (fileName.endsWith(".md")) {
    fs.unlinkSync(path.join(changelogDir, fileName));
  }
}

const modernEntries = modernRows.map(parseRow);
const legacyEntries = legacyRows.map(parseRow);

for (const entry of modernEntries) {
  const frontMatter = yaml.dump(entry.data, { lineWidth: 0, noRefs: true }).trimEnd();
  fs.writeFileSync(path.join(changelogDir, entry.fileName), `---\n${frontMatter}\n---\n`);
}

const legacyMarkup = `${legacyEntries.map((entry, index) => renderLegacyEntry(entry, index)).join("\n")}\n`;
fs.writeFileSync(legacyPartialPath, legacyMarkup);

console.log(JSON.stringify(modernEntries.map((entry) => entry.fileName), null, 2));
console.log(`Legacy rows: ${legacyRows.length}`);
