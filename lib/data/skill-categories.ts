import { Category, Skill } from "@/lib/types";

/** @deprecated Use `Category` from `@/lib/types` instead */
export type SkillCategory = Category;

export const SKILL_CATEGORIES: Category[] = [
  {
    slug: "frontend",
    name: "Frontend Development",
    title: "Frontend Development Skills — React, Next.js, UI Components",
    description:
      "Discover Claude Code skills for frontend development. React, Next.js, Angular, Vue, and UI component skills to accelerate your frontend workflow.",
    headline: "Frontend Development Skills",
    intro:
      "Skills for building user interfaces, components, and client-side applications. From React hooks to Next.js patterns, these skills help Claude Code assist with modern frontend development.",
    keywords: [
      "react", "nextjs", "next.js", "angular", "vue", "svelte", "frontend",
      "front-end", "ui-", "ui_", "component", "css", "tailwind", "html",
      "dom", "jsx", "tsx", "widget", "layout", "responsive", "rerender",
      "hooks", "remix", "nuxt", "astro", "webflow",
    ],
    icon: "Layout",
    faq: [
      {
        question: "What are Claude Code frontend skills?",
        answer:
          "Claude Code frontend skills are reusable instructions that teach Claude how to work with frontend frameworks like React, Next.js, and Angular. They help Claude write components, manage state, and follow framework best practices.",
      },
      {
        question: "How do I install a frontend skill for Claude Code?",
        answer:
          "Run the install command shown on each skill card, e.g. `claude skill add owner/repo:skill-name`. The skill is instantly available in your Claude Code sessions.",
      },
      {
        question: "Which frontend frameworks are supported?",
        answer:
          "You'll find skills for React, Next.js, Angular, Vue, Svelte, Astro, Tailwind CSS, and more. The community adds new framework skills regularly.",
      },
    ],
    relatedSlugs: ["testing", "code-review", "backend"],
  },
  {
    slug: "backend",
    name: "Backend & APIs",
    title: "Backend & API Skills — Servers, Databases, REST, GraphQL",
    description:
      "Claude Code skills for backend development. Build APIs, manage databases, design server architecture, and implement authentication with AI assistance.",
    headline: "Backend & API Skills",
    intro:
      "Skills for server-side development, API design, database management, and backend architecture. These skills help Claude Code work with your server framework, ORM, and data layer.",
    keywords: [
      "api", "backend", "back-end", "server", "database", "rest", "graphql",
      "endpoint", "middleware", "auth", "authentication", "postgresql",
      "mysql", "mongo", "redis", "prisma", "drizzle", "orm",
      "supabase", "firebase", "lambda", "worker", "edge", "payload",
      "gateway", "proxy", "grpc", "websocket", "queue",
    ],
    icon: "Server",
    faq: [
      {
        question: "What can backend skills do for my Claude Code workflow?",
        answer:
          "Backend skills teach Claude how to create API endpoints, write database queries, set up authentication, and follow your server framework's conventions. They reduce boilerplate and catch common backend mistakes.",
      },
      {
        question: "Are there skills for specific databases?",
        answer:
          "Yes — you'll find skills for PostgreSQL, MySQL, MongoDB, Redis, Supabase, and Firebase, among others. Database skills help with query optimization, migration generation, and schema design.",
      },
    ],
    relatedSlugs: ["frontend", "devops", "security", "testing"],
  },
  {
    slug: "testing",
    name: "Testing & QA",
    title: "Testing & QA Skills — Unit Tests, E2E, Test Automation",
    description:
      "Claude Code skills for testing and quality assurance. Write unit tests, end-to-end tests, and improve test coverage with AI-powered testing skills.",
    headline: "Testing & QA Skills",
    intro:
      "Skills for writing tests, running quality checks, and ensuring code reliability. From unit tests to end-to-end testing with Playwright and Vitest, these skills help Claude Code produce well-tested code.",
    keywords: [
      "test", "testing", "vitest", "jest", "playwright", "cypress",
      "e2e", "unit-test", "qa", "quality", "assert", "mock", "stub",
      "fixture", "coverage", "spec", "tdd", "bdd", "snapshot",
      "spanner", "thoroughness",
    ],
    icon: "FlaskConical",
    faq: [
      {
        question: "How do testing skills improve Claude Code output?",
        answer:
          "Testing skills teach Claude to write comprehensive test suites alongside your code, catch edge cases, and follow your project's testing conventions. They can generate unit tests, integration tests, and e2e tests.",
      },
      {
        question: "Which testing frameworks are supported?",
        answer:
          "You'll find skills for Vitest, Jest, Playwright, Cypress, and framework-specific testing utilities. Many skills are framework-agnostic and work with any test runner.",
      },
    ],
    relatedSlugs: ["code-review", "debugging", "frontend", "backend"],
  },
  {
    slug: "security",
    name: "Security",
    title: "Security Skills — Auditing, Vulnerability Scanning, Hardening",
    description:
      "Claude Code security skills for code auditing, vulnerability detection, and security hardening. Protect your applications with AI-powered security analysis.",
    headline: "Security Skills",
    intro:
      "Skills for security auditing, vulnerability scanning, and code hardening. These skills help Claude Code identify security issues, follow OWASP best practices, and write secure code by default.",
    keywords: [
      "security", "audit", "vulnerability", "owasp", "xss", "csrf",
      "injection", "auth", "encryption", "credential", "permission",
      "rbac", "sanitize", "redteam", "pentest", "hardening",
    ],
    icon: "Shield",
    faq: [
      {
        question: "Can Claude Code find security vulnerabilities?",
        answer:
          "With security skills installed, Claude can scan your code for common vulnerabilities like XSS, SQL injection, insecure authentication, and missing input validation. Skills teach Claude the specific patterns to look for.",
      },
      {
        question: "Are security skills suitable for production code review?",
        answer:
          "Security skills are a strong first pass — they catch common issues and enforce best practices. For production applications, combine them with dedicated security tools and manual review.",
      },
    ],
    relatedSlugs: ["code-review", "devops", "backend"],
  },
  {
    slug: "devops",
    name: "DevOps & CI/CD",
    title: "DevOps & CI/CD Skills — Deployment, Monitoring, Pipelines",
    description:
      "Claude Code skills for DevOps workflows. Automate CI/CD pipelines, configure monitoring, manage deployments, and troubleshoot infrastructure issues.",
    headline: "DevOps & CI/CD Skills",
    intro:
      "Skills for deployment, continuous integration, monitoring, and infrastructure management. These skills help Claude Code configure pipelines, debug CI failures, and automate DevOps tasks.",
    keywords: [
      "devops", "ci/cd", "ci-", "deploy", "docker", "kubernetes", "k8s",
      "terraform", "ansible", "jenkins", "github-actions", "gitlab",
      "monitor", "monitoring", "observability", "logging", "alerting",
      "apm", "incident", "sre", "infra", "cloudformation", "cfn",
      "localstack", "sandbox", "build", "pipeline",
    ],
    icon: "Rocket",
    faq: [
      {
        question: "How can Claude Code help with DevOps?",
        answer:
          "DevOps skills teach Claude to write CI/CD configurations, debug pipeline failures, set up monitoring, and automate infrastructure tasks. They're especially useful for triaging flaky tests and configuring deployment pipelines.",
      },
    ],
    relatedSlugs: ["infrastructure", "automation", "debugging"],
  },
  {
    slug: "git",
    name: "Git & Pull Requests",
    title: "Git & PR Skills — Commits, Code Review, GitHub Workflows",
    description:
      "Claude Code skills for Git workflows. Write better commits, create pull requests, review code, and manage branches with AI-powered Git skills.",
    headline: "Git & Pull Request Skills",
    intro:
      "Skills for Git operations, pull request creation, code review, and GitHub workflows. These are among the most-installed Claude Code skills — they streamline the entire commit-to-merge cycle.",
    keywords: [
      "git", "commit", "pull-request", "pr-", "pr_", "merge", "branch",
      "rebase", "cherry-pick", "diff", "review", "github", "gitlab",
      "bitbucket", "backport", "changelog", "release-note",
      "issue", "write-pr", "make-pr", "create-pr", "simple-pr",
    ],
    icon: "GitBranch",
    faq: [
      {
        question: "What are the most popular Git skills?",
        answer:
          "Commit helpers, PR creation skills, and code review skills are consistently the most installed. They help Claude write meaningful commit messages, create well-structured PRs, and catch issues during review.",
      },
    ],
    relatedSlugs: ["code-review", "releases", "automation"],
  },
  {
    slug: "docs",
    name: "Documentation",
    title: "Documentation Skills — API Docs, Docstrings, Technical Writing",
    description:
      "Claude Code skills for writing documentation. Generate API docs, docstrings, READMEs, and technical content with consistent style and accuracy.",
    headline: "Documentation Skills",
    intro:
      "Skills for generating and maintaining documentation. From inline docstrings to full API references and blog posts, these skills help Claude Code write clear, consistent technical content.",
    keywords: [
      "doc", "docs", "documentation", "docstring", "readme", "jsdoc",
      "typedoc", "javadoc", "writing", "technical-writing", "blog",
      "learn", "tutorial", "guide", "wiki", "sandpack", "demo",
    ],
    icon: "FileText",
    faq: [
      {
        question: "Can Claude Code write documentation for my project?",
        answer:
          "Yes — documentation skills teach Claude your project's doc style, structure, and conventions. They can generate API references, inline comments, READMEs, and even blog posts from your codebase.",
      },
    ],
    relatedSlugs: ["code-review", "releases", "productivity"],
  },
  {
    slug: "code-review",
    name: "Code Review & Quality",
    title: "Code Review Skills — Linting, Refactoring, Best Practices",
    description:
      "Claude Code skills for code review and quality. Automated code review, linting, refactoring suggestions, and best-practice enforcement.",
    headline: "Code Review & Quality Skills",
    intro:
      "Skills for reviewing code, enforcing quality standards, and suggesting improvements. These skills help Claude Code catch bugs, enforce naming conventions, and suggest refactoring opportunities.",
    keywords: [
      "review", "lint", "refactor", "quality", "clean-code", "best-practice",
      "naming", "convention", "anti-pattern", "code-smell", "typescript-review",
      "clojure-review", "code-quality", "style", "format",
    ],
    icon: "CheckCircle",
    faq: [
      {
        question: "How do code review skills work?",
        answer:
          "Code review skills give Claude specific guidelines for your codebase — naming conventions, architectural patterns, common anti-patterns to flag. When you ask Claude to review code, it applies these rules consistently.",
      },
    ],
    relatedSlugs: ["testing", "security", "git"],
  },
  {
    slug: "ai-agents",
    name: "AI & Agent Building",
    title: "AI Agent Skills — Build Agents, MCP Servers, AI Workflows",
    description:
      "Claude Code skills for building AI agents, MCP servers, and agentic workflows. Accelerate AI development with community-built agent patterns.",
    headline: "AI & Agent Building Skills",
    intro:
      "Skills for building AI agents, MCP servers, and agentic applications. These skills encode patterns for agent architectures, tool integration, and multi-agent workflows.",
    keywords: [
      "agent", "agentic", "mcp", "llm", "ai-", "ai_", "openai",
      "anthropic", "langchain", "langgraph", "crew", "autogen",
      "rag", "embedding", "vector", "prompt", "copilot", "chatbot",
      "tool-use", "function-calling",
    ],
    icon: "Bot",
    faq: [
      {
        question: "Can I use Claude Code to build other AI agents?",
        answer:
          "Absolutely. Agent-building skills teach Claude patterns for designing agent architectures, integrating tools, handling multi-step reasoning, and building MCP servers. They're some of the fastest-growing skills in the directory.",
      },
    ],
    relatedSlugs: ["automation", "backend", "skill-dev"],
  },
  {
    slug: "skill-dev",
    name: "Skill Development",
    title: "Skill Development — Create & Publish Claude Code Skills",
    description:
      "Claude Code skills for creating new skills. Meta-skills that help you write, test, and publish your own Claude Code skills and SKILL.md files.",
    headline: "Skill Development Skills",
    intro:
      "Meta-skills for creating Claude Code skills. If you want to build and publish your own skills, these will help Claude scaffold SKILL.md files, test skill behavior, and follow the skill authoring conventions.",
    keywords: [
      "skill-builder", "skill-creator", "skill-development", "creating-skills",
      "writing-skills", "create-skill", "find-skill", "slash-command",
    ],
    icon: "Wrench",
    faq: [
      {
        question: "How do I create my own Claude Code skill?",
        answer:
          "Install a skill-development skill, then ask Claude to help you write a SKILL.md file. Skills are just markdown instructions stored in your repo's .claude/skills/ directory. These meta-skills guide you through the process.",
      },
    ],
    relatedSlugs: ["ai-agents", "docs"],
  },
  {
    slug: "data-science",
    name: "Data Science & ML",
    title: "Data Science Skills — Python, ML, Visualization, Analytics",
    description:
      "Claude Code skills for data science and machine learning. Work with datasets, build visualizations, and accelerate ML workflows with Claude.",
    headline: "Data Science & ML Skills",
    intro:
      "Skills for data analysis, machine learning, and scientific computing. From loading datasets to building matplotlib visualizations and running ML pipelines, these skills extend Claude Code into the data science workflow.",
    keywords: [
      "data-science", "machine-learning", "ml", "dataset", "pandas",
      "numpy", "matplotlib", "scikit", "tensorflow", "pytorch",
      "jupyter", "notebook", "visualization", "analytics", "statistics",
      "rdkit", "chemistry", "bioinformatics", "arxiv", "research",
      "hypothesis", "matchms",
    ],
    icon: "BarChart3",
    faq: [
      {
        question: "Can Claude Code help with data science workflows?",
        answer:
          "Yes — data science skills help Claude load and clean datasets, create visualizations, write ML pipelines, and even read research papers. They're especially useful for Python-based data workflows.",
      },
    ],
    relatedSlugs: ["python", "automation"],
  },
  {
    slug: "releases",
    name: "Release Management",
    title: "Release Management Skills — Changelogs, Versioning, Shipping",
    description:
      "Claude Code skills for release management. Generate changelogs, manage versions, preview releases, and automate your shipping workflow.",
    headline: "Release Management Skills",
    intro:
      "Skills for managing releases, generating changelogs, and automating the shipping process. These skills help Claude Code prepare release notes, bump versions, and coordinate the release cycle.",
    keywords: [
      "release", "changelog", "version", "semver", "tag", "ship",
      "publish", "npm-publish", "deploy", "release-note", "release-preview",
      "release-manager",
    ],
    icon: "Package",
    faq: [
      {
        question: "How do release skills help with shipping?",
        answer:
          "Release skills automate changelog generation from commit history, help manage semantic versioning, and can prepare release notes. They reduce the manual work of cutting a release.",
      },
    ],
    relatedSlugs: ["git", "devops", "docs"],
  },
  {
    slug: "debugging",
    name: "Debugging",
    title: "Debugging Skills — Bug Finding, Error Handling, Troubleshooting",
    description:
      "Claude Code skills for debugging and troubleshooting. Find bugs faster, improve error handling, and diagnose issues with AI-powered debugging assistance.",
    headline: "Debugging Skills",
    intro:
      "Skills for finding bugs, improving error handling, and diagnosing issues. These skills teach Claude systematic debugging approaches and common error patterns across different frameworks.",
    keywords: [
      "debug", "bug", "error", "exception", "traceback", "stacktrace",
      "troubleshoot", "diagnose", "fix", "crash", "oom", "memory-leak",
      "performance", "profil",
    ],
    icon: "Bug",
    faq: [
      {
        question: "Can Claude Code debug my application?",
        answer:
          "Debugging skills help Claude systematically analyze error messages, trace execution paths, and suggest fixes. They're especially useful for interpreting stack traces and identifying root causes.",
      },
    ],
    relatedSlugs: ["testing", "devops", "code-review"],
  },
  {
    slug: "productivity",
    name: "Productivity & Planning",
    title: "Productivity Skills — Planning, GTD, Sprint Management",
    description:
      "Claude Code skills for productivity and project planning. Manage tasks, plan sprints, make decisions, and organize your development workflow.",
    headline: "Productivity & Planning Skills",
    intro:
      "Skills for project planning, task management, and decision-making. From GTD workflows to sprint planning and architecture decisions, these skills help Claude Code assist beyond just writing code.",
    keywords: [
      "planning", "plan", "prd", "gtd", "sprint", "kanban", "agile",
      "scrum", "decision", "priority", "roadmap", "estimate",
      "sequential-thinking", "confidence", "opportunity", "brainstorm",
      "knowledge-manager", "flashcard",
    ],
    icon: "Target",
    faq: [
      {
        question: "Can Claude Code help with project planning?",
        answer:
          "Yes — productivity skills teach Claude to write PRDs, break work into tasks, plan sprints, and facilitate architectural decisions. They turn Claude into a development planning partner, not just a code generator.",
      },
    ],
    relatedSlugs: ["docs", "git", "automation"],
  },
  {
    slug: "automation",
    name: "Automation & Workflows",
    title: "Automation Skills — Workflow Orchestration, n8n, Scripting",
    description:
      "Claude Code skills for automation and workflow orchestration. Build automated pipelines, integrate tools, and create repeatable workflows.",
    headline: "Automation & Workflow Skills",
    intro:
      "Skills for automating repetitive tasks, orchestrating workflows, and integrating tools. From n8n workflow design to custom scripting, these skills help Claude Code automate your development pipeline.",
    keywords: [
      "automat", "workflow", "orchestrat", "pipeline", "cron", "schedule",
      "n8n", "zapier", "dag", "parallel", "batch", "script", "generator",
      "scaffold", "boilerplate", "translation",
    ],
    icon: "Zap",
    faq: [
      {
        question: "What kind of workflows can be automated?",
        answer:
          "Automation skills can help with CI/CD pipelines, code generation, scaffolding new components, running parallel tasks, translating content, and orchestrating multi-step build processes.",
      },
    ],
    relatedSlugs: ["devops", "ai-agents", "productivity"],
  },
  {
    slug: "python",
    name: "Python",
    title: "Python Skills — Django, Flask, FastAPI, Python Development",
    description:
      "Claude Code skills for Python development. Django, Flask, FastAPI, and general Python skills for writing idiomatic, well-tested Python code.",
    headline: "Python Skills",
    intro:
      "Skills specifically for Python development. Whether you're building a Django app, a FastAPI service, or a data pipeline, these skills help Claude write idiomatic Python that follows your project's conventions.",
    keywords: [
      "python", "django", "flask", "fastapi", "pip", "poetry",
      "pydantic", "sqlalchemy", "celery", "pytest", "mypy",
      "black", "ruff", "pyproject",
    ],
    icon: "Terminal",
    faq: [
      {
        question: "Does Claude Code support Python development?",
        answer:
          "Yes — Python skills teach Claude Python-specific patterns, from web frameworks like Django and FastAPI to tooling like pytest and mypy. Install the skills relevant to your stack.",
      },
    ],
    relatedSlugs: ["data-science", "backend", "testing"],
  },
  {
    slug: "rust",
    name: "Rust",
    title: "Rust Skills — Idiomatic Rust, Systems Programming, Cargo",
    description:
      "Claude Code skills for Rust development. Write idiomatic Rust, manage memory safely, and follow Rust best practices with AI assistance.",
    headline: "Rust Skills",
    intro:
      "Skills for writing idiomatic Rust code. These skills help Claude understand ownership, borrowing, lifetimes, and Rust-specific patterns so it produces code that compiles and follows community conventions.",
    keywords: [
      "rust", "cargo", "crate", "tokio", "async-std", "serde",
      "actix", "axum", "wasm", "ownership", "borrow", "lifetime",
      "unsafe",
    ],
    icon: "Cog",
    faq: [
      {
        question: "Can Claude Code write good Rust code?",
        answer:
          "With Rust skills installed, Claude understands ownership rules, idiomatic patterns, and common crates. The skills significantly improve the quality of generated Rust code.",
      },
    ],
    relatedSlugs: ["backend", "debugging", "testing"],
  },
  {
    slug: "marketing-seo",
    name: "Marketing & SEO",
    title: "Marketing & SEO Skills — Content Strategy, Analytics, Optimization",
    description:
      "Claude Code skills for marketing and SEO. Optimize pages for search engines, analyze content performance, build marketing automation, and grow organic traffic.",
    headline: "Marketing & SEO Skills",
    intro:
      "Skills for search engine optimization, content marketing, analytics, and growth. These skills help Claude Code audit SEO issues, generate meta tags, analyze traffic patterns, and build marketing workflows.",
    keywords: [
      "seo", "marketing", "meta-tag", "sitemap", "canonical", "crawl",
      "index", "search-engine", "keyword", "ranking", "organic",
      "analytics", "conversion", "ctr", "bounce", "traffic",
      "content-strategy", "copywriting", "landing-page", "a/b-test",
      "email-marketing", "newsletter", "social-media", "opengraph",
      "structured-data", "schema.org", "rich-snippet", "lighthouse",
      "core-web-vitals", "page-speed", "brand",
    ],
    icon: "TrendingUp",
    faq: [
      {
        question: "Can Claude Code help with SEO?",
        answer:
          "Yes — SEO skills teach Claude to audit pages for technical SEO issues, generate optimized meta tags, fix structured data, and suggest content improvements. They're especially useful for programmatic SEO across large sites.",
      },
      {
        question: "What marketing tasks can Claude Code automate?",
        answer:
          "Marketing skills can help with content generation, email copy, landing page optimization, analytics interpretation, and building marketing automation workflows. They work best when combined with your existing marketing stack.",
      },
      {
        question: "Do SEO skills work with Next.js and other frameworks?",
        answer:
          "Most SEO skills are framework-agnostic — they analyze HTML output, meta tags, and structured data regardless of your stack. Some are tailored for specific frameworks like Next.js or Astro.",
      },
    ],
    relatedSlugs: ["frontend", "docs", "automation", "productivity"],
  },
];

/**
 * Classify a single skill into matching category slugs.
 * A skill can belong to multiple categories.
 */
export function classifySkill(skill: Skill): string[] {
  const text = `${skill.name} ${skill.description} ${skill.repo}`.toLowerCase();
  const matched: string[] = [];

  for (const cat of SKILL_CATEGORIES) {
    for (const kw of cat.keywords) {
      if (text.includes(kw.toLowerCase())) {
        matched.push(cat.slug);
        break; // One match per category is enough
      }
    }
  }

  return matched;
}

/**
 * Classify all skills and return a map of slug -> skills.
 * Skills are deduplicated by ID and sorted by (voteCount + installs) descending.
 */
export function classifyAllSkills(
  skills: Skill[]
): Record<string, Skill[]> {
  const map: Record<string, Skill[]> = {};
  const seen: Record<string, Set<string>> = {};

  for (const cat of SKILL_CATEGORIES) {
    map[cat.slug] = [];
    seen[cat.slug] = new Set();
  }

  for (const skill of skills) {
    const slugs = classifySkill(skill);
    for (const slug of slugs) {
      if (!seen[slug].has(skill.id)) {
        seen[slug].add(skill.id);
        map[slug].push(skill);
      }
    }
  }

  // Sort each category by engagement signal
  for (const slug of Object.keys(map)) {
    map[slug].sort(
      (a, b) =>
        b.voteCount + b.installs - (a.voteCount + a.installs)
    );
  }

  return map;
}

export function getCategoryBySlug(
  slug: string
): Category | undefined {
  return SKILL_CATEGORIES.find((c) => c.slug === slug);
}
