 export type RoadmapTemplate = {
  id: string
  title: string
  keywords: string[]
  difficulty: string
  estimatedDays: number
  phases: {
    phaseTitle: string
    duration: string
    topics: {
      title: string
      description: string
      resources: {
        name: string
        url: string
        type: string
        isFree: boolean
      }[]
      project: string
    }[]
  }[]
}

export const ROADMAP_TEMPLATES: RoadmapTemplate[] = [
  {
    id: 'mern-stack',
    title: 'MERN Stack Developer Roadmap',
    keywords: ['mern', 'mongodb', 'express', 'react', 'node', 'full stack', 'mongo'],
    difficulty: 'intermediate',
    estimatedDays: 90,
    phases: [
      {
        phaseTitle: 'Phase 1: Web Fundamentals (2 weeks)',
        duration: '2 weeks',
        topics: [
          {
            title: 'HTML5 & CSS3 Mastery',
            description: 'Learn semantic HTML, CSS Grid, Flexbox, and responsive design',
            resources: [
              { name: 'freeCodeCamp Responsive Web Design', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', type: 'course', isFree: true },
              { name: 'CSS Grid Garden', url: 'https://cssgridgarden.com/', type: 'interactive', isFree: true },
              { name: 'Kevin Powell CSS YouTube', url: 'https://www.youtube.com/@KevinPowell', type: 'video', isFree: true }
            ],
            project: 'Build a responsive portfolio website'
          },
          {
            title: 'JavaScript Fundamentals',
            description: 'Master ES6+, async/await, DOM manipulation, and modern JS',
            resources: [
              { name: 'JavaScript.info', url: 'https://javascript.info/', type: 'documentation', isFree: true },
              { name: 'Traversy Media JS Crash Course', url: 'https://youtu.be/hdI2bqOjy3c', type: 'video', isFree: true }
            ],
            project: 'Build an interactive todo app with local storage'
          }
        ]
      },
      {
        phaseTitle: 'Phase 2: Frontend with React (3 weeks)',
        duration: '3 weeks',
        topics: [
          {
            title: 'React Fundamentals',
            description: 'Components, props, state, hooks, and React Router',
            resources: [
              { name: 'React Official Tutorial', url: 'https://react.dev/learn', type: 'documentation', isFree: true },
              { name: 'Net Ninja React Playlist', url: 'https://youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d', type: 'video', isFree: true }
            ],
            project: 'Build a movie search app using TMDB API'
          },
          {
            title: 'State Management & Advanced React',
            description: 'Context API, Redux Toolkit, custom hooks, and performance optimization',
            resources: [
              { name: 'Redux Toolkit Docs', url: 'https://redux-toolkit.js.org/tutorials/quick-start', type: 'documentation', isFree: true },
              { name: 'Codevolution React Playlist', url: 'https://youtube.com/playlist?list=PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3', type: 'video', isFree: true }
            ],
            project: 'Build an e-commerce frontend with cart functionality'
          }
        ]
      },
      {
        phaseTitle: 'Phase 3: Backend with Node & Express (3 weeks)',
        duration: '3 weeks',
        topics: [
          {
            title: 'Node.js & Express Basics',
            description: 'RESTful APIs, middleware, authentication with JWT',
            resources: [
              { name: 'Node.js Official Docs', url: 'https://nodejs.org/en/docs/', type: 'documentation', isFree: true },
              { name: 'Express.js Guide', url: 'https://expressjs.com/en/guide/routing.html', type: 'documentation', isFree: true }
            ],
            project: 'Build a RESTful API for a blog platform'
          },
          {
            title: 'MongoDB & Mongoose',
            description: 'NoSQL database design, CRUD operations, aggregation',
            resources: [
              { name: 'MongoDB University', url: 'https://learn.mongodb.com/', type: 'course', isFree: true },
              { name: 'Mongoose Docs', url: 'https://mongoosejs.com/docs/guide.html', type: 'documentation', isFree: true }
            ],
            project: 'Add database to your blog API with user authentication'
          }
        ]
      },
      {
        phaseTitle: 'Phase 4: Full Stack Integration (4 weeks)',
        duration: '4 weeks',
        topics: [
          {
            title: 'Connecting Frontend to Backend',
            description: 'API integration, Axios, error handling, loading states',
            resources: [
              { name: 'Axios Docs', url: 'https://axios-http.com/docs/intro', type: 'documentation', isFree: true },
              { name: 'React Query Tutorial', url: 'https://tanstack.com/query/latest/docs/react/overview', type: 'documentation', isFree: true }
            ],
            project: 'Full stack social media app with posts, likes, comments'
          },
          {
            title: 'Deployment & DevOps Basics',
            description: 'Deploy to Vercel/Render, environment variables, Git workflow',
            resources: [
              { name: 'Vercel Deployment Guide', url: 'https://vercel.com/guides', type: 'documentation', isFree: true },
              { name: 'Render Deployment', url: 'https://render.com/docs', type: 'documentation', isFree: true }
            ],
            project: 'Deploy your full stack app with CI/CD'
          }
        ]
      }
    ]
  },
  
  {
    id: 'react-frontend',
    title: 'React Frontend Developer Roadmap',
    keywords: ['react', 'frontend', 'ui', 'redux', 'next', 'typescript'],
    difficulty: 'beginner',
    estimatedDays: 60,
    phases: [
      {
        phaseTitle: 'Phase 1: JavaScript & Web Basics (2 weeks)',
        duration: '2 weeks',
        topics: [
          {
            title: 'Modern JavaScript',
            description: 'ES6+, promises, async/await, array methods',
            resources: [
              { name: 'JavaScript30', url: 'https://javascript30.com/', type: 'course', isFree: true },
              { name: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', type: 'documentation', isFree: true }
            ],
            project: 'Build 30 vanilla JavaScript projects'
          },
          {
            title: 'TypeScript Basics',
            description: 'Types, interfaces, generics, and TypeScript with React',
            resources: [
              { name: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', type: 'documentation', isFree: true },
              { name: 'TypeScript React Guide', url: 'https://react-typescript-cheatsheet.netlify.app/', type: 'documentation', isFree: true }
            ],
            project: 'Convert a JS project to TypeScript'
          }
        ]
      },
      {
        phaseTitle: 'Phase 2: React Core (3 weeks)',
        duration: '3 weeks',
        topics: [
          {
            title: 'React & Next.js',
            description: 'Components, routing, SSR, API routes',
            resources: [
              { name: 'Next.js Tutorial', url: 'https://nextjs.org/learn', type: 'course', isFree: true },
              { name: 'React Beta Docs', url: 'https://react.dev/', type: 'documentation', isFree: true }
            ],
            project: 'Build a blog with Next.js and Markdown'
          },
          {
            title: 'Styling & UI Libraries',
            description: 'TailwindCSS, CSS Modules, component libraries',
            resources: [
              { name: 'TailwindCSS Docs', url: 'https://tailwindcss.com/docs', type: 'documentation', isFree: true },
              { name: 'Tailwind Labs YouTube', url: 'https://www.youtube.com/@TailwindLabs', type: 'video', isFree: true }
            ],
            project: 'Clone a popular website UI with TailwindCSS'
          }
        ]
      }
    ]
  },
  
  {
    id: 'python-backend',
    title: 'Python Backend Developer Roadmap',
    keywords: ['python', 'django', 'flask', 'backend', 'api', 'fastapi', 'sql'],
    difficulty: 'beginner',
    estimatedDays: 75,
    phases: [
      {
        phaseTitle: 'Phase 1: Python Fundamentals (2 weeks)',
        duration: '2 weeks',
        topics: [
          {
            title: 'Python Basics',
            description: 'Syntax, data structures, OOP, file handling',
            resources: [
              { name: 'Python.org Tutorial', url: 'https://docs.python.org/3/tutorial/', type: 'documentation', isFree: true },
              { name: 'Corey Schafer Python', url: 'https://youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU', type: 'video', isFree: true }
            ],
            project: 'Build a CLI task manager app'
          }
        ]
      },
      {
        phaseTitle: 'Phase 2: Web Framework (4 weeks)',
        duration: '4 weeks',
        topics: [
          {
            title: 'Django or FastAPI',
            description: 'Models, views, templates, REST APIs',
            resources: [
              { name: 'Django Girls Tutorial', url: 'https://tutorial.djangogirls.org/', type: 'tutorial', isFree: true },
              { name: 'FastAPI Official Docs', url: 'https://fastapi.tiangolo.com/', type: 'documentation', isFree: true }
            ],
            project: 'Build a REST API for a todo application'
          }
        ]
      }
    ]
  },
  
  {
    id: 'devops',
    title: 'DevOps Engineer Roadmap',
    keywords: ['devops', 'aws', 'docker', 'kubernetes', 'ci/cd', 'jenkins', 'terraform', 'cloud'],
    difficulty: 'advanced',
    estimatedDays: 120,
    phases: [
      {
        phaseTitle: 'Phase 1: Linux & Networking (3 weeks)',
        duration: '3 weeks',
        topics: [
          {
            title: 'Linux Administration',
            description: 'Command line, shell scripting, system administration',
            resources: [
              { name: 'Linux Journey', url: 'https://linuxjourney.com/', type: 'course', isFree: true },
              { name: 'Bash Scripting Tutorial', url: 'https://linuxconfig.org/bash-scripting-tutorial', type: 'tutorial', isFree: true }
            ],
            project: 'Write shell scripts for system automation'
          }
        ]
      }
    ]
  },
  
  {
    id: 'data-science',
    title: 'Data Science Roadmap',
    keywords: ['data science', 'machine learning', 'python', 'pandas', 'numpy', 'tensorflow', 'ai', 'ml'],
    difficulty: 'intermediate',
    estimatedDays: 100,
    phases: [
      {
        phaseTitle: 'Phase 1: Python for Data Science (3 weeks)',
        duration: '3 weeks',
        topics: [
          {
            title: 'NumPy & Pandas',
            description: 'Data manipulation, analysis, and visualization',
            resources: [
              { name: 'Kaggle Pandas Course', url: 'https://www.kaggle.com/learn/pandas', type: 'course', isFree: true },
              { name: 'Data School Pandas', url: 'https://youtube.com/playlist?list=PL5-da3qGB5ICCsgW1MxlZ0Hq8LL5U3u9y', type: 'video', isFree: true }
            ],
            project: 'Analyze a real-world dataset from Kaggle'
          }
        ]
      }
    ]
  }
]

// Function to find matching roadmap
export function findMatchingRoadmap(jobDescription: string): RoadmapTemplate | null {
  const lowerDesc = jobDescription.toLowerCase()
  
  // Score each template based on keyword matches
  const scored = ROADMAP_TEMPLATES.map(template => {
    const matches = template.keywords.filter(keyword => 
      lowerDesc.includes(keyword.toLowerCase())
    )
    return {
      template,
      score: matches.length,
      matches
    }
  })
  
  // Sort by score and return best match
  scored.sort((a, b) => b.score - a.score)
  
  // Only return if we have at least 2 keyword matches
  if (scored[0].score >= 2) {
    console.log('✅ Found local roadmap:', scored[0].template.title)
    console.log('Matched keywords:', scored[0].matches)
    return scored[0].template
  }
  
  console.log('❌ No local match found, will use AI')
  return null
}

// Extract skills from local template
export function extractSkillsFromTemplate(template: RoadmapTemplate): any {
  return {
    jobTitle: template.title,
    requiredSkills: template.keywords,
    niceToHaveSkills: [],
    tools: [],
    experienceLevel: template.difficulty,
    keyResponsibilities: template.phases.map(p => p.phaseTitle)
  }
}
 