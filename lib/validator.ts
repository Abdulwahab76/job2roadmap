const TECH_PATTERNS = {
  frontend: {
    keywords: [
      "react",
      "vue",
      "angular",
      "svelte",
      "next",
      "nuxt",
      "frontend",
      "front end",
      "ui",
      "javascript",
      "typescript",
      "html",
      "css",
      "tailwind",
      "responsive",
      "interface",
      "web",
    ],
    minSkills: 1, // 🎯 Reduced from 2
    category: "Frontend Development",
  },
  backend: {
    keywords: [
      "node",
      "express",
      "django",
      "flask",
      "fastapi",
      "spring",
      "backend",
      "back end",
      "api",
      "server",
      "python",
      "java",
      "go",
      "rust",
      "rest",
      "graphql",
      "microservices",
    ],
    minSkills: 1,
    category: "Backend Development",
  },
  fullstack: {
    keywords: [
      "full stack",
      "fullstack",
      "mern",
      "mean",
      "mevn",
      "frontend and backend",
      "front-end and back-end",
      "web application",
      "web app",
    ],
    minSkills: 1,
    category: "Full Stack Development",
  },
  devops: {
    keywords: [
      "devops",
      "docker",
      "kubernetes",
      "aws",
      "azure",
      "gcp",
      "ci/cd",
      "jenkins",
      "terraform",
      "cloud",
      "linux",
      "deployment",
      "server",
    ],
    minSkills: 1,
    category: "DevOps",
  },
  data: {
    keywords: [
      "data science",
      "machine learning",
      "ml",
      "ai",
      "artificial intelligence",
      "pandas",
      "numpy",
      "tensorflow",
      "pytorch",
      "python",
      "analytics",
    ],
    minSkills: 1,
    category: "Data Science & AI",
  },
  mobile: {
    keywords: [
      "react native",
      "flutter",
      "ios",
      "android",
      "swift",
      "kotlin",
      "mobile",
      "app development",
    ],
    minSkills: 1,
    category: "Mobile Development",
  },
  general: {
    keywords: [
      "developer",
      "software",
      "programmer",
      "engineer",
      "code",
      "coding",
      "programming",
      "develop",
      "web",
      "application",
      "website",
      "database",
      "test",
      "debug",
      "design",
    ],
    minSkills: 1,
    category: "Software Development",
  },
};

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  detectedCategory: string | null;
  requiredSkills: string[];
  confidence: number;
};

export function validateJobInput(jobDescription: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const lowerDesc = jobDescription.toLowerCase().trim();

  // Check 1: Minimum length
  if (lowerDesc.length < 20) {
    errors.push(
      "Description too short. Please provide at least 20 characters."
    );
    return {
      isValid: false,
      errors,
      warnings,
      detectedCategory: null,
      requiredSkills: [],
      confidence: 0,
    };
  }

  // Check 2: Detect category
  let detectedCategory: string | null = null;
  let maxMatches = 0;
  let requiredSkills: string[] = [];

  for (const [key, pattern] of Object.entries(TECH_PATTERNS)) {
    const matches = pattern.keywords.filter((keyword) =>
      lowerDesc.includes(keyword.toLowerCase())
    );

    if (matches.length > maxMatches) {
      maxMatches = matches.length;
      detectedCategory = pattern.category;
      requiredSkills = matches;
    }
  }

  // 🎯 FIX: Generic descriptions ke liye "general" category
  if (!detectedCategory || maxMatches === 0) {
    // Check general keywords
    const generalMatches = TECH_PATTERNS.general.keywords.filter((keyword) =>
      lowerDesc.includes(keyword.toLowerCase())
    );

    if (generalMatches.length > 0) {
      detectedCategory = TECH_PATTERNS.general.category;
      requiredSkills = generalMatches;
      maxMatches = generalMatches.length;
      warnings.push(
        "Generic job description detected. AI will infer specific skills."
      );
    } else {
      // 🎯 Even if nothing matches, allow it (AI will handle)
      detectedCategory = "Software Development";
      requiredSkills = ["web development"];
      warnings.push(
        "No specific skills detected. AI will analyze and suggest skills."
      );
    }
  }

  // Check 3: Minimum skills requirement (REDUCED)
  const pattern = Object.values(TECH_PATTERNS).find(
    (p) => p.category === detectedCategory
  );
  const minSkills = pattern?.minSkills || 1; // 🎯 Changed to 1 minimum

  // 🎯 FIX: Agar koi skills nahi mili, phir bhi allow karo
  if (requiredSkills.length < minSkills) {
    // Instead of error, just warn
    warnings.push(
      `Limited skills detected. AI will infer appropriate learning path.`
    );
    // Add generic skill
    requiredSkills.push("software development");
  }

  // Check 4: Confidence score
  const confidence = Math.min(
    100,
    Math.max(30, (requiredSkills.length / 2) * 100)
  );

  // Check 5: Warnings for short descriptions
  if (lowerDesc.length < 100) {
    warnings.push(
      "Short description. Consider adding more details for better results."
    );
  }

  // 🎯 ALWAYS valid now - AI handle karega
  return {
    isValid: true, // 🎯 Always true - let AI decide
    errors: [],
    warnings,
    detectedCategory,
    requiredSkills,
    confidence,
  };
}

// Real-time analysis while typing
export function analyzeInput(text: string): {
  skillCount: number;
  suggestions: string[];
  category: string | null;
} {
  const lowerText = text.toLowerCase();
  let skillCount = 0;
  const suggestions: string[] = [];
  let category: string | null = null;

  for (const pattern of Object.values(TECH_PATTERNS)) {
    const matches = pattern.keywords.filter((k) => lowerText.includes(k));
    if (matches.length > 0) {
      skillCount += matches.length;
      if (!category) category = pattern.category;
    }
  }

  // 🎯 Better suggestions
  if (lowerText.includes("frontend") || lowerText.includes("ui")) {
    suggestions.push("Include: React, TypeScript, CSS frameworks");
  } else if (lowerText.includes("backend") || lowerText.includes("api")) {
    suggestions.push("Include: Node.js, Python, Database names");
  } else if (lowerText.includes("full") || lowerText.includes("web")) {
    suggestions.push("Include: MERN stack, specific technologies");
  } else if (skillCount === 0) {
    suggestions.push(
      "Add specific skills like React, Python, AWS, etc. for better results"
    );
  }

  return { skillCount, suggestions, category };
}
