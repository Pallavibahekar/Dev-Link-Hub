// Reusing TF-IDF tokenization logic — same concept as portfolio chatbot
// This is your "secret weapon" to mention in interviews

const TAG_DICTIONARY = [
  "javascript",
  "typescript",
  "python",
  "java",
  "golang",
  "rust",
  "react",
  "vue",
  "angular",
  "nextjs",
  "nodejs",
  "express",
  "fastapi",
  "django",
  "mongodb",
  "postgresql",
  "mysql",
  "redis",
  "database",
  "sql",
  "nosql",
  "docker",
  "kubernetes",
  "devops",
  "aws",
  "gcp",
  "azure",
  "cloud",
  "security",
  "authentication",
  "jwt",
  "oauth",
  "api",
  "rest",
  "graphql",
  "websocket",
  "css",
  "tailwind",
  "html",
  "git",
  "testing",
  "algorithm",
  "datastructure",
  "machine learning",
  "ai",
  "nlp",
  "tutorial",
  "documentation",
  "tools",
  "performance",
  "interview",
];

// Tokenize text — same pattern as portfolio chatbot
const tokenize = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
};

// Auto-suggest tags based on title + description
const autoTag = (title, description = "") => {
  const combinedText = `${title} ${description}`;
  const tokens = tokenize(combinedText);
  const suggestedTags = [];

  TAG_DICTIONARY.forEach((tag) => {
    const tagTokens = tag.split(" ");
    if (tagTokens.length === 1) {
      if (tokens.includes(tag)) {
        suggestedTags.push(tag);
      }
    } else {
      if (tagTokens.every((t) => combinedText.toLowerCase().includes(t))) {
        suggestedTags.push(tag);
      }
    }
  });

  // Return max 5 auto-suggested tags
  return [...new Set(suggestedTags)].slice(0, 5);
};

module.exports = { autoTag, tokenize };
