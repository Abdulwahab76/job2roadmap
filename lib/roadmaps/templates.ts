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
    ],
    difficulty: "intermediate",
    estimatedDays: 90,
    phases: [
      {
        phaseTitle: "Phase 1: Web Fundamentals (2 weeks)",
        duration: "2 weeks",
        topics: [
          {
            title: "HTML5 & CSS3 Mastery",
            description:
              "Learn semantic HTML, CSS Grid, Flexbox, and responsive design",
            resources: [
              {
                name: "freeCodeCamp",
                url: "https://www.freecodecamp.org/",
                type: "course",
                isFree: true,
              },
              {
                name: "CSS Grid Garden",
                url: "https://cssgridgarden.com/",
                type: "interactive",
                isFree: true,
              },
            ],
            project: "Build a responsive portfolio website",
          },
          {
            title: "JavaScript Fundamentals",
            description: "Master ES6+, async/await, DOM manipulation",
            resources: [
              {
                name: "JavaScript.info",
                url: "https://javascript.info/",
                type: "documentation",
                isFree: true,
              },
              {
                name: "Traversy Media JS Course",
                url: "https://youtu.be/hdI2bqOjy3c",
                type: "video",
                isFree: true,
              },
            ],
            project: "Build an interactive todo app",
          },
        ],
      },
      {
        phaseTitle: "Phase 2: React Frontend (3 weeks)",
        duration: "3 weeks",
        topics: [
          {
            title: "React Fundamentals",
            description: "Components, props, state, hooks, React Router",
            resources: [
              {
                name: "React Official Tutorial",
                url: "https://react.dev/learn",
                type: "documentation",
                isFree: true,
              },
              {
                name: "Net Ninja React Playlist",
                url: "https://youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d",
                type: "video",
                isFree: true,
              },
            ],
            project: "Build a movie search app using TMDB API",
          },
          {
            title: "State Management",
            description: "Context API, Redux Toolkit, Zustand",
            resources: [
              {
                name: "Redux Toolkit Docs",
                url: "https://redux-toolkit.js.org/tutorials/quick-start",
                type: "documentation",
                isFree: true,
              },
              {
                name: "Zustand Docs",
                url: "https://docs.pmnd.rs/zustand",
                type: "documentation",
                isFree: true,
              },
            ],
            project: "Add cart functionality with Redux",
          },
        ],
      },
      {
        phaseTitle: "Phase 3: Backend (3 weeks)",
        duration: "3 weeks",
        topics: [
          {
            title: "Node.js & Express",
            description: "RESTful APIs, middleware, JWT authentication",
            resources: [
              {
                name: "Node.js Docs",
                url: "https://nodejs.org/en/docs/",
                type: "documentation",
                isFree: true,
              },
              {
                name: "Express.js Guide",
                url: "https://expressjs.com/en/guide/routing.html",
                type: "documentation",
                isFree: true,
              },
            ],
            project: "Build a RESTful API for a blog",
          },
          {
            title: "MongoDB & Mongoose",
            description: "NoSQL database, CRUD operations, aggregation",
            resources: [
              {
                name: "MongoDB University",
                url: "https://learn.mongodb.com/",
                type: "course",
                isFree: true,
              },
              {
                name: "Mongoose Docs",
                url: "https://mongoosejs.com/docs/guide.html",
                type: "documentation",
                isFree: true,
              },
            ],
            project: "Add database to your blog API",
          },
        ],
      },
    ],
  },

  // =============================================
  // 2. REACT FRONTEND
  // =============================================
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
      "tailwind",
      "css",
    ],
    difficulty: "beginner",
    estimatedDays: 60,
    phases: [
      {
        phaseTitle: "Phase 1: JavaScript & TypeScript (2 weeks)",
        duration: "2 weeks",
        topics: [
          {
            title: "Modern JavaScript (ES6+)",
            description:
              "Arrow functions, destructuring, promises, async/await",
            resources: [
              {
                name: "JavaScript30",
                url: "https://javascript30.com/",
                type: "course",
                isFree: true,
              },
              {
                name: "MDN JavaScript Guide",
                url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
                type: "documentation",
                isFree: true,
              },
            ],
            project: "Build 5 vanilla JS mini-projects",
          },
          {
            title: "TypeScript Fundamentals",
            description: "Types, interfaces, generics, utility types",
            resources: [
              {
                name: "TypeScript Handbook",
                url: "https://www.typescriptlang.org/docs/handbook/intro.html",
                type: "documentation",
                isFree: true,
              },
              {
                name: "Total TypeScript",
                url: "https://www.totaltypescript.com/tutorials",
                type: "tutorial",
                isFree: true,
              },
            ],
            project: "Convert a JS project to TypeScript",
          },
        ],
      },
      {
        phaseTitle: "Phase 2: React Core (3 weeks)",
        duration: "3 weeks",
        topics: [
          {
            title: "React & Hooks",
            description: "JSX, components, useState, useEffect, custom hooks",
            resources: [
              {
                name: "React Official Tutorial",
                url: "https://react.dev/learn",
                type: "documentation",
                isFree: true,
              },
              {
                name: "Scrimba React Course",
                url: "https://scrimba.com/learn/learnreact",
                type: "course",
                isFree: true,
              },
            ],
            project: "Build a weather dashboard",
          },
          {
            title: "Next.js App Router",
            description: "SSR, ISR, server components, API routes",
            resources: [
              {
                name: "Next.js Tutorial",
                url: "https://nextjs.org/learn",
                type: "course",
                isFree: true,
              },
              {
                name: "Next.js Examples",
                url: "https://github.com/vercel/next.js/tree/canary/examples",
                type: "examples",
                isFree: true,
              },
            ],
            project: "Build a blog with Next.js",
          },
        ],
      },
    ],
  },

  // =============================================
  // 3. PYTHON BACKEND
  // =============================================
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
    ],
    difficulty: "intermediate",
    estimatedDays: 75,
    phases: [
      {
        phaseTitle: "Phase 1: Python Fundamentals (2 weeks)",
        duration: "2 weeks",
        topics: [
          {
            title: "Python Basics & OOP",
            description:
              "Data types, functions, classes, inheritance, decorators",
            resources: [
              {
                name: "Python.org Tutorial",
                url: "https://docs.python.org/3/tutorial/",
                type: "documentation",
                isFree: true,
              },
              {
                name: "Corey Schafer Python",
                url: "https://youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU",
                type: "video",
                isFree: true,
              },
            ],
            project: "Build a CLI task manager",
          },
          {
            title: "Advanced Python",
            description: "Generators, context managers, async/await",
            resources: [
              {
                name: "Real Python",
                url: "https://realpython.com/",
                type: "tutorial",
                isFree: true,
              },
              {
                name: "Python Type Hints",
                url: "https://mypy.readthedocs.io/",
                type: "documentation",
                isFree: true,
              },
            ],
            project: "Build an async web scraper",
          },
        ],
      },
      {
        phaseTitle: "Phase 2: Web Frameworks (4 weeks)",
        duration: "4 weeks",
        topics: [
          {
            title: "Django Framework",
            description: "MVT architecture, ORM, admin panel, auth",
            resources: [
              {
                name: "Django Girls Tutorial",
                url: "https://tutorial.djangogirls.org/",
                type: "tutorial",
                isFree: true,
              },
              {
                name: "Django Official Tutorial",
                url: "https://docs.djangoproject.com/en/stable/intro/tutorial01/",
                type: "documentation",
                isFree: true,
              },
            ],
            project: "Build a blog with Django",
          },
          {
            title: "FastAPI & REST APIs",
            description: "FastAPI, Pydantic, Swagger, async endpoints",
            resources: [
              {
                name: "FastAPI Docs",
                url: "https://fastapi.tiangolo.com/",
                type: "documentation",
                isFree: true,
              },
              {
                name: "FastAPI Tutorial",
                url: "https://fastapi.tiangolo.com/tutorial/",
                type: "tutorial",
                isFree: true,
              },
            ],
            project: "Build a REST API with FastAPI",
          },
        ],
      },
    ],
  },

  // =============================================
  // 4. DEVOPS ENGINEER
  // =============================================
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
      {
        phaseTitle: "Phase 1: Linux & Networking (3 weeks)",
        duration: "3 weeks",
        topics: [
          {
            title: "Linux Administration",
            description: "Command line, shell scripting, permissions",
            resources: [
              {
                name: "Linux Journey",
                url: "https://linuxjourney.com/",
                type: "course",
                isFree: true,
              },
              {
                name: "Bash Scripting Tutorial",
                url: "https://linuxconfig.org/bash-scripting-tutorial",
                type: "tutorial",
                isFree: true,
              },
            ],
            project: "Write automation scripts for system tasks",
          },
          {
            title: "Networking Fundamentals",
            description: "TCP/IP, DNS, HTTP/HTTPS, load balancing",
            resources: [
              {
                name: "Cloudflare Learning Center",
                url: "https://www.cloudflare.com/learning/",
                type: "documentation",
                isFree: true,
              },
              {
                name: "Networking Basics",
                url: "https://youtu.be/IPvYjXCsTg8",
                type: "video",
                isFree: true,
              },
            ],
            project: "Set up a home lab network",
          },
        ],
      },
      {
        phaseTitle: "Phase 2: Containers (4 weeks)",
        duration: "4 weeks",
        topics: [
          {
            title: "Docker Mastery",
            description: "Images, containers, Dockerfile, Docker Compose",
            resources: [
              {
                name: "Docker Tutorial",
                url: "https://docs.docker.com/get-started/",
                type: "documentation",
                isFree: true,
              },
              {
                name: "Play with Docker",
                url: "https://labs.play-with-docker.com/",
                type: "interactive",
                isFree: true,
              },
            ],
            project: "Containerize a multi-service app",
          },
          {
            title: "Kubernetes (K8s)",
            description: "Pods, services, deployments, ingress",
            resources: [
              {
                name: "Kubernetes Basics",
                url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
                type: "tutorial",
                isFree: true,
              },
              {
                name: "K8s the Hard Way",
                url: "https://github.com/kelseyhightower/kubernetes-the-hard-way",
                type: "tutorial",
                isFree: true,
              },
            ],
            project: "Deploy microservices on K8s",
          },
        ],
      },
    ],
  },

  // =============================================
  // 5. DATA SCIENCE
  // =============================================
  {
    id: "data-science",
    title: "Data Science & AI Roadmap",
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
    ],
    difficulty: "advanced",
    estimatedDays: 100,
    phases: [
      {
        phaseTitle: "Phase 1: Python for Data (3 weeks)",
        duration: "3 weeks",
        topics: [
          {
            title: "NumPy & Pandas",
            description: "Data manipulation, analysis, cleaning",
            resources: [
              {
                name: "Kaggle Pandas Course",
                url: "https://www.kaggle.com/learn/pandas",
                type: "course",
                isFree: true,
              },
              {
                name: "Data School Pandas",
                url: "https://youtube.com/playlist?list=PL5-da3qGB5ICCsgW1MxlZ0Hq8LL5U3u9y",
                type: "video",
                isFree: true,
              },
            ],
            project: "Analyze a Kaggle dataset",
          },
          {
            title: "Data Visualization",
            description: "Matplotlib, Seaborn, Plotly",
            resources: [
              {
                name: "Matplotlib Tutorials",
                url: "https://matplotlib.org/stable/tutorials/",
                type: "documentation",
                isFree: true,
              },
              {
                name: "Seaborn Gallery",
                url: "https://seaborn.pydata.org/examples/",
                type: "examples",
                isFree: true,
              },
            ],
            project: "Create an interactive dashboard",
          },
        ],
      },
      {
        phaseTitle: "Phase 2: Machine Learning (4 weeks)",
        duration: "4 weeks",
        topics: [
          {
            title: "ML Fundamentals",
            description: "Regression, classification, clustering",
            resources: [
              {
                name: "Andrew Ng ML Course",
                url: "https://www.coursera.org/learn/machine-learning",
                type: "course",
                isFree: true,
              },
              {
                name: "Scikit-learn Docs",
                url: "https://scikit-learn.org/stable/tutorial/",
                type: "documentation",
                isFree: true,
              },
            ],
            project: "Build a house price predictor",
          },
          {
            title: "Deep Learning",
            description: "TensorFlow/PyTorch, CNNs, RNNs",
            resources: [
              {
                name: "TensorFlow Tutorials",
                url: "https://www.tensorflow.org/tutorials",
                type: "tutorial",
                isFree: true,
              },
              {
                name: "Fast.ai Course",
                url: "https://course.fast.ai/",
                type: "course",
                isFree: true,
              },
            ],
            project: "Build an image classifier",
          },
        ],
      },
    ],
  },

  // =============================================
  // 6. MOBILE DEVELOPER
  // =============================================
  {
    id: "mobile-dev",
    title: "Mobile Developer Roadmap (React Native)",
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
      {
        phaseTitle: "Phase 1: React Native Fundamentals (3 weeks)",
        duration: "3 weeks",
        topics: [
          {
            title: "React Native Basics",
            description: "Components, navigation, state management",
            resources: [
              {
                name: "React Native Docs",
                url: "https://reactnative.dev/docs/getting-started",
                type: "documentation",
                isFree: true,
              },
              {
                name: "Expo Tutorial",
                url: "https://docs.expo.dev/tutorial/introduction/",
                type: "tutorial",
                isFree: true,
              },
            ],
            project: "Build a todo app",
          },
          {
            title: "Navigation & APIs",
            description: "React Navigation, REST APIs, AsyncStorage",
            resources: [
              {
                name: "React Navigation Docs",
                url: "https://reactnavigation.org/docs/getting-started",
                type: "documentation",
                isFree: true,
              },
              {
                name: "Axios Docs",
                url: "https://axios-http.com/docs/intro",
                type: "documentation",
                isFree: true,
              },
            ],
            project: "Build a weather app",
          },
        ],
      },
      {
        phaseTitle: "Phase 2: Advanced (3 weeks)",
        duration: "3 weeks",
        topics: [
          {
            title: "Native Features & Publishing",
            description: "Camera, location, push notifications, App Store",
            resources: [
              {
                name: "Expo SDK Docs",
                url: "https://docs.expo.dev/versions/latest/",
                type: "documentation",
                isFree: true,
              },
              {
                name: "App Store Connect",
                url: "https://developer.apple.com/app-store-connect/",
                type: "documentation",
                isFree: true,
              },
            ],
            project: "Build and publish a complete app",
          },
        ],
      },
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
  const lowerDesc = jobDescription.toLowerCase().trim();

  console.log("🔍 Matching for:", lowerDesc.substring(0, 80));

  // Score each template
  const scored = ROADMAP_TEMPLATES.map((template) => {
    let score = 0;
    const matchedKeywords: string[] = [];

    template.keywords.forEach((keyword) => {
      const keywordLower = keyword.toLowerCase();
      if (lowerDesc.includes(keywordLower)) {
        // 🎯 Longer keywords = higher score
        score += keywordLower.length >= 5 ? 3 : 1;
        matchedKeywords.push(keyword);
      }
    });

    // 🎯 Bonus: Check if template name is in description
    if (lowerDesc.includes(template.title.toLowerCase())) {
      score += 10;
    }

    // 🎯 Bonus for multiple keyword matches
    if (matchedKeywords.length >= 2) score += 3;
    if (matchedKeywords.length >= 4) score += 5;

    return { template, score, matchedKeywords };
  });

  // Sort by score (highest first)
  scored.sort((a, b) => b.score - a.score);

  // 🎯 DEBUG: Log top matches
  console.log("📊 Top matches:");
  scored.slice(0, 3).forEach((s) => {
    console.log(
      `  ${s.template.title}: score=${
        s.score
      }, matched=${s.matchedKeywords.join(", ")}`
    );
  });

  // 🎯 Lower threshold for match (was 3, now 1)
  if (scored[0].score >= 1) {
    console.log("✅ MATCHED:", scored[0].template.title);
    return scored[0].template;
  }

  console.log("❌ No match found");
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
