// 🎯 Expanded keyword matching - More local templates = Less API calls

export type RoadmapTemplate = {
  id: string;
  title: string;
  keywords: string[];
  difficulty: string;
  estimatedDays: number;
  phases: any[];
};

export const ROADMAP_TEMPLATES: RoadmapTemplate[] = [
  {
    id: "mern-stack",
    title: "MERN Stack Developer Roadmap",
    keywords: [
      "mern",
      "mongodb",
      "express",
      "react",
      "node",
      "full stack",
      "mongo",
      "mongoose",
      "express.js",
      "node.js",
      "react.js",
    ],
    difficulty: "intermediate",
    estimatedDays: 90,
    phases: [
      /* your phases */
    ],
  },
  {
    id: "react-frontend",
    title: "React Frontend Developer Roadmap",
    keywords: [
      "react",
      "frontend",
      "ui",
      "redux",
      "next",
      "typescript",
      "react.js",
      "next.js",
      "tailwind",
      "css",
      "html",
      "javascript",
      "js",
    ],
    difficulty: "beginner",
    estimatedDays: 60,
    phases: [
      /* your phases */
    ],
  },
  {
    id: "python-backend",
    title: "Python Backend Developer Roadmap",
    keywords: [
      "python",
      "django",
      "flask",
      "fastapi",
      "backend",
      "api",
      "sql",
      "postgresql",
      "mysql",
      "orm",
    ],
    difficulty: "intermediate",
    estimatedDays: 75,
    phases: [
      /* your phases */
    ],
  },
  {
    id: "devops",
    title: "DevOps Engineer Roadmap",
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
    ],
    difficulty: "advanced",
    estimatedDays: 120,
    phases: [
      /* your phases */
    ],
  },
  {
    id: "data-science",
    title: "Data Science Roadmap",
    keywords: [
      "data science",
      "machine learning",
      "ml",
      "ai",
      "python",
      "pandas",
      "numpy",
      "tensorflow",
      "pytorch",
      "deep learning",
    ],
    difficulty: "advanced",
    estimatedDays: 100,
    phases: [
      /* your phases */
    ],
  },
  {
    id: "mobile-dev",
    title: "Mobile Developer Roadmap",
    keywords: [
      "react native",
      "flutter",
      "ios",
      "android",
      "swift",
      "kotlin",
      "mobile",
      "app",
    ],
    difficulty: "intermediate",
    estimatedDays: 80,
    phases: [
      /* your phases */
    ],
  },
  {
    id: "vue-frontend",
    title: "Vue.js Developer Roadmap",
    keywords: ["vue", "vue.js", "vuex", "nuxt", "nuxt.js", "pinia", "frontend"],
    difficulty: "beginner",
    estimatedDays: 55,
    phases: [
      /* your phases */
    ],
  },
  {
    id: "angular-frontend",
    title: "Angular Developer Roadmap",
    keywords: [
      "angular",
      "angular.js",
      "rxjs",
      "ngrx",
      "typescript",
      "frontend",
    ],
    difficulty: "intermediate",
    estimatedDays: 70,
    phases: [
      /* your phases */
    ],
  },
  {
    id: "go-backend",
    title: "Go Backend Developer Roadmap",
    keywords: [
      "go",
      "golang",
      "gin",
      "echo",
      "fiber",
      "backend",
      "api",
      "microservices",
    ],
    difficulty: "intermediate",
    estimatedDays: 65,
    phases: [
      /* your phases */
    ],
  },
  {
    id: "java-backend",
    title: "Java Backend Developer Roadmap",
    keywords: [
      "java",
      "spring",
      "spring boot",
      "hibernate",
      "jpa",
      "backend",
      "microservices",
      "maven",
      "gradle",
    ],
    difficulty: "intermediate",
    estimatedDays: 80,
    phases: [
      /* your phases */
    ],
  },
  {
    id: "wordpress-dev",
    title: "WordPress Developer Roadmap",
    keywords: [
      "wordpress",
      "word press",
      "wp",
      "woocommerce",
      "elementor",
      "wpbakery",
      "divi",
      "php",
      "mysql",
      "html",
      "css",
      "javascript",
      "bootstrap",
      "cpanel",
      "web developer",
      "website",
      "landing page",
      "seo",
      "figma",
      "adobe xd",
      "psd",
      "theme",
      "plugin",
      "hosting",
    ],
    difficulty: "intermediate",
    estimatedDays: 75,
    phases: [
      {
        phaseTitle: "Phase 1: Web Fundamentals (2 weeks)",
        duration: "2 weeks",
        topics: [
          {
            title: "HTML5 & CSS3 Mastery",
            description:
              "Learn semantic HTML, CSS3, Flexbox, Grid, and responsive design principles",
            resources: [
              {
                name: "freeCodeCamp Responsive Web Design",
                url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
                type: "course",
                isFree: true,
              },
              {
                name: "CSS-Tricks Complete Guide",
                url: "https://css-tricks.com/guides/",
                type: "documentation",
                isFree: true,
              },
              {
                name: "Kevin Powell CSS YouTube",
                url: "https://www.youtube.com/@KevinPowell",
                type: "video",
                isFree: true,
              },
            ],
            project: "Build a responsive portfolio website from scratch",
          },
          {
            title: "JavaScript & Bootstrap",
            description:
              "Master JavaScript ES6+, DOM manipulation, and Bootstrap framework",
            resources: [
              {
                name: "JavaScript.info",
                url: "https://javascript.info/",
                type: "documentation",
                isFree: true,
              },
              {
                name: "Bootstrap 5 Documentation",
                url: "https://getbootstrap.com/docs/5.3/getting-started/introduction/",
                type: "documentation",
                isFree: true,
              },
            ],
            project: "Build a responsive landing page with Bootstrap",
          },
          {
            title: "PHP & MySQL Basics",
            description:
              "Learn server-side programming with PHP and database management",
            resources: [
              {
                name: "PHP Manual",
                url: "https://www.php.net/manual/en/",
                type: "documentation",
                isFree: true,
              },
              {
                name: "MySQL Tutorial",
                url: "https://www.mysqltutorial.org/",
                type: "tutorial",
                isFree: true,
              },
            ],
            project: "Create a simple CMS with PHP & MySQL",
          },
        ],
      },
      {
        phaseTitle: "Phase 2: WordPress Core (3 weeks)",
        duration: "3 weeks",
        topics: [
          {
            title: "WordPress Installation & Setup",
            description:
              "Learn WordPress installation, configuration, dashboard, themes, and plugins",
            resources: [
              {
                name: "WordPress.org Learn",
                url: "https://learn.wordpress.org/",
                type: "course",
                isFree: true,
              },
              {
                name: "WPBeginner Guides",
                url: "https://www.wpbeginner.com/guides/",
                type: "tutorial",
                isFree: true,
              },
            ],
            project: "Set up a complete WordPress site on localhost",
          },
          {
            title: "Custom Theme Development",
            description:
              "Build custom WordPress themes from scratch using PHP, HTML, CSS, and JavaScript",
            resources: [
              {
                name: "WordPress Theme Handbook",
                url: "https://developer.wordpress.org/themes/",
                type: "documentation",
                isFree: true,
              },
              {
                name: "Traversy Media WordPress Theme",
                url: "https://youtu.be/-h7gOJbIpmo",
                type: "video",
                isFree: true,
              },
            ],
            project: "Create a custom WordPress theme from scratch",
          },
          {
            title: "Plugin Development & Customization",
            description:
              "Learn to create custom plugins and customize existing ones",
            resources: [
              {
                name: "WordPress Plugin Handbook",
                url: "https://developer.wordpress.org/plugins/",
                type: "documentation",
                isFree: true,
              },
              {
                name: "WPTuts YouTube",
                url: "https://www.youtube.com/@WPTuts",
                type: "video",
                isFree: true,
              },
            ],
            project: "Build a custom contact form plugin",
          },
        ],
      },
      {
        phaseTitle: "Phase 3: Advanced WordPress (3 weeks)",
        duration: "3 weeks",
        topics: [
          {
            title: "WooCommerce & E-Commerce",
            description:
              "Build and customize e-commerce stores with WooCommerce",
            resources: [
              {
                name: "WooCommerce Documentation",
                url: "https://woocommerce.com/documentation/",
                type: "documentation",
                isFree: true,
              },
              {
                name: "WooCommerce Developer Guide",
                url: "https://developer.woocommerce.com/",
                type: "documentation",
                isFree: true,
              },
            ],
            project: "Build a complete e-commerce store with WooCommerce",
          },
          {
            title: "Page Builders & SEO",
            description:
              "Master Elementor, WPBakery, and WordPress SEO optimization",
            resources: [
              {
                name: "Elementor Tutorials",
                url: "https://elementor.com/academy/",
                type: "course",
                isFree: true,
              },
              {
                name: "Yoast SEO Guide",
                url: "https://yoast.com/wordpress-seo/",
                type: "tutorial",
                isFree: true,
              },
            ],
            project: "Build a landing page with Elementor and optimize for SEO",
          },
          {
            title: "Website Security & Performance",
            description:
              "Implement security best practices, caching, CDN, and speed optimization",
            resources: [
              {
                name: "WordPress Security Guide",
                url: "https://wordpress.org/support/category/security/",
                type: "documentation",
                isFree: true,
              },
              {
                name: "Cloudflare Learning Center",
                url: "https://www.cloudflare.com/learning/",
                type: "documentation",
                isFree: true,
              },
            ],
            project:
              "Secure and optimize a WordPress site to 90+ PageSpeed score",
          },
        ],
      },
      {
        phaseTitle: "Phase 4: Professional Skills (2 weeks)",
        duration: "2 weeks",
        topics: [
          {
            title: "Hosting & Deployment",
            description:
              "Learn cPanel, hosting management, DNS, SSL, and website migration",
            resources: [
              {
                name: "cPanel Documentation",
                url: "https://docs.cpanel.net/",
                type: "documentation",
                isFree: true,
              },
              {
                name: "DNS Guide",
                url: "https://www.cloudflare.com/learning/dns/what-is-dns/",
                type: "documentation",
                isFree: true,
              },
            ],
            project: "Deploy a WordPress site to live hosting with SSL",
          },
          {
            title: "Analytics & Tracking",
            description:
              "Set up Google Analytics, Tag Manager, Search Console, and conversion tracking",
            resources: [
              {
                name: "Google Analytics Academy",
                url: "https://analytics.google.com/analytics/academy/",
                type: "course",
                isFree: true,
              },
              {
                name: "GTM Guide",
                url: "https://support.google.com/tagmanager/",
                type: "documentation",
                isFree: true,
              },
            ],
            project: "Set up complete tracking for a client website",
          },
        ],
      },
    ],
  },
];

// 🎯 Smart matching with scoring
export function findMatchingRoadmap(
  jobDescription: string
): RoadmapTemplate | null {
  const lowerDesc = jobDescription.toLowerCase();

  // Score each template
  const scored = ROADMAP_TEMPLATES.map((template) => {
    let score = 0;
    const matchedKeywords: string[] = [];

    template.keywords.forEach((keyword) => {
      if (lowerDesc.includes(keyword.toLowerCase())) {
        score += keyword.length > 5 ? 3 : 1; // Longer keywords = more specific
        matchedKeywords.push(keyword);
      }
    });

    // Bonus for multiple matches
    if (matchedKeywords.length >= 3) score += 5;
    if (matchedKeywords.length >= 5) score += 10;

    return { template, score, matchedKeywords };
  });

  // Sort by score
  scored.sort((a, b) => b.score - a.score);

  // Return best match if score is high enough
  if (scored[0].score >= 3) {
    console.log(
      `📚 Local match: ${scored[0].template.title} (score: ${scored[0].score})`
    );
    console.log(`🔑 Matched: ${scored[0].matchedKeywords.join(", ")}`);
    return scored[0].template;
  }

  return null;
}

export function extractSkillsFromTemplate(template: RoadmapTemplate): any {
  return {
    jobTitle: template.title,
    requiredSkills: template.keywords.slice(0, 8),
    niceToHaveSkills: [],
    tools: [],
    experienceLevel: template.difficulty,
    keyResponsibilities: template.phases.map((p) => p.phaseTitle),
  };
}
