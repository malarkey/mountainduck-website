const markdownIt = require("markdown-it");
const features = require("./features.json");

// Filters
const dateFilter = require("./src/filters/date-filter.js");
const md = markdownIt({ html: true });

function sortProtocols(left, right) {
  return (left.data.name || "").localeCompare(right.data.name || "", undefined, {
    sensitivity: "base"
  });
}

function sortTestimonials(left, right) {
  const leftOrder = Number(left.data.order || 0);
  const rightOrder = Number(right.data.order || 0);
  const orderDifference = leftOrder - rightOrder;

  if (orderDifference !== 0) {
    return orderDifference;
  }

  return (left.data.name || "").localeCompare(right.data.name || "", undefined, {
    sensitivity: "base"
  });
}

function sortBenefits(left, right) {
  return (left.inputPath || "").localeCompare(right.inputPath || "", undefined, {
    sensitivity: "base"
  });
}

function sortFeatures(left, right) {
  return (left.inputPath || "").localeCompare(right.inputPath || "", undefined, {
    sensitivity: "base"
  });
}

module.exports = function(eleventyConfig) {
  // Filters
  eleventyConfig.addFilter("dateFilter", dateFilter);
  eleventyConfig.addFilter("markdown", (content) => {
    if (!content) {
      return "";
    }

    return md.render(content);
  });

  // Passthrough copy
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");

  eleventyConfig.addCollection("protocols", (collection) => {
    return collection.getFilteredByGlob("./src/protocols/*.md").sort(sortProtocols);
  });

  eleventyConfig.addCollection("testimonials", (collection) => {
    return collection.getFilteredByGlob("./src/testimonials/*.md").sort(sortTestimonials);
  });

  eleventyConfig.addCollection("benefits", (collection) => {
    return collection.getFilteredByGlob("./src/benefits/*.md").sort(sortBenefits);
  });

  eleventyConfig.addCollection("features", (collection) => {
    return collection.getFilteredByGlob("./src/features/*.md").sort(sortFeatures);
  });

  if (features.blog) {
    const blogPlugin = require("./feature-packs/blog/plugin.js");
    blogPlugin(eleventyConfig);
  }

  if (features.changelog) {
    const changelogPlugin = require("./feature-packs/changelog/plugin.js");
    changelogPlugin(eleventyConfig);
  }

  if (features.faqs) {
    const faqsPlugin = require("./feature-packs/faqs/plugin.js");
    faqsPlugin(eleventyConfig);
  }

  if (features.portfolio) {
    const portfolioPlugin = require("./feature-packs/portfolio/plugin.js");
    portfolioPlugin(eleventyConfig);
  }

  if (features.team) {
    const teamPlugin = require("./feature-packs/team/plugin.js");
    teamPlugin(eleventyConfig);
  }

  // Use .eleventyignore, not .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Directory structure
  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "dist"
    }
  };
};
