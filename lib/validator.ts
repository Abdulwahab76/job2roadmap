// Skill requirement patterns for different tech stacks
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
    ],
    minSkills: 2,
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
    ],
    minSkills: 2,
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
    ],
    minSkills: 3,
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
    ],
    minSkills: 2,
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
    minSkills: 2,
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
    minSkills: 2,
    category: "Mobile Development",
  },
};

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  detectedCategory: string | null;
  requiredSkills: string[];
  confidence: number; // 0-100
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

  // Check 3: Category detection
  if (!detectedCategory) {
    errors.push(
      "Could not identify a tech role. Include specific technologies (e.g., React, Python, AWS)."
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

  // Check 4: Minimum skills requirement
  const pattern = Object.values(TECH_PATTERNS).find(
    (p) => p.category === detectedCategory
  );
  const minSkills = pattern?.minSkills || 2;

  if (requiredSkills.length < minSkills) {
    errors.push(
      `Not enough technical skills detected. Found ${requiredSkills.length}, need at least ${minSkills}.`
    );
  }

  // Check 5: Confidence score
  const confidence = Math.min(100, (requiredSkills.length / minSkills) * 100);

  // Check 6: Warnings
  if (lowerDesc.length < 100) {
    warnings.push(
      "Short description may miss important details. Consider adding more requirements."
    );
  }

  if (requiredSkills.length < 3) {
    warnings.push(
      "Limited skills detected. A more detailed job description gives better roadmaps."
    );
  }

  // Check 7: Contains only company name or generic text
  const genericWords = [
    "company",
    "looking for",
    "seeking",
    "hiring",
    "join",
    "team",
  ];
  const hasSpecificTech =
    TECH_PATTERNS.frontend.keywords.some((k) => lowerDesc.includes(k)) ||
    TECH_PATTERNS.backend.keywords.some((k) => lowerDesc.includes(k));

  if (!hasSpecificTech && lowerDesc.length < 200) {
    errors.push(
      "No specific technologies mentioned. Include technical skills like React, Python, Docker, etc."
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
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

  // Count detected skills
  for (const pattern of Object.values(TECH_PATTERNS)) {
    const matches = pattern.keywords.filter((k) => lowerText.includes(k));
    if (matches.length > 0) {
      skillCount += matches.length;
      if (!category) category = pattern.category;
    }
  }

  // Generate suggestions based on partial input
  if (lowerText.includes("react")) {
    suggestions.push("Add: TypeScript, Next.js, Redux, Testing");
  } else if (lowerText.includes("python")) {
    suggestions.push("Add: Django, Flask, FastAPI, PostgreSQL");
  } else if (lowerText.includes("node")) {
    suggestions.push("Add: Express, MongoDB, TypeScript, GraphQL");
  }

  return { skillCount, suggestions, category };
}
