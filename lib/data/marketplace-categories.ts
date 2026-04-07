import { Category, Marketplace } from "@/lib/types";

/** @deprecated Use `Category` from `@/lib/types` instead */
export type MarketplaceCategory = Category;

export const MARKETPLACE_CATEGORIES: Category[] = [
  {
    slug: "ai-agents",
    name: "AI Agents & Orchestration",
    title: "AI Agent Marketplaces — Multi-Agent Frameworks, Autonomous Agents, Orchestration",
    description:
      "Discover Claude Code plugin marketplaces for AI agents and orchestration. Browse collections of multi-agent frameworks, autonomous agent tools, and agentic workflow plugins.",
    headline: "AI Agent & Orchestration Marketplaces",
    intro:
      "Plugin collections for building and running AI agents. These marketplaces aggregate multi-agent frameworks, autonomous agent toolkits, and orchestration layers that let you compose agents into complex workflows — the largest category in the directory.",
    keywords: [
      "agent", "agentic", "multi-agent", "multiagent", "autonomous",
      "orchestration",
    ],
    icon: "Bot",
    faq: [
      {
        question: "What kinds of AI agent plugins can I find?",
        answer:
          "Agent marketplaces include multi-agent orchestration frameworks, autonomous task runners, tool-use integrations, and agent observability plugins. They cover everything from single-agent loops to complex multi-agent topologies.",
      },
      {
        question: "How do agent marketplaces differ from LLM integration marketplaces?",
        answer:
          "Agent marketplaces focus on the runtime — orchestrating agents, managing tool calls, and coordinating multi-step tasks. LLM integration marketplaces focus on the model layer — connecting to providers, managing embeddings, and building RAG pipelines.",
      },
    ],
    relatedSlugs: ["llm-integration", "automation", "memory-context"],
  },
  {
    slug: "llm-integration",
    name: "LLM Integration",
    title: "LLM Integration Marketplaces — Model Providers, RAG, Embeddings, Prompt Engineering",
    description:
      "Claude Code plugin marketplaces for LLM integration. Browse collections of model provider connectors, RAG pipelines, embedding tools, and prompt engineering utilities.",
    headline: "LLM Integration Marketplaces",
    intro:
      "Plugin collections for connecting to large language models, building retrieval-augmented generation pipelines, and managing embeddings. These marketplaces aggregate the model-layer tools that power AI applications — from OpenAI and Anthropic connectors to vector stores and prompt optimization.",
    keywords: [
      "llm", "gpt", "openai", "anthropic", "embedding", "vector", "rag",
      "prompt", "inference", "fine-tune", "transformer", "gemini", "ollama",
      "hugging", "langchain",
    ],
    icon: "Brain",
    faq: [
      {
        question: "What are LLM integration plugins?",
        answer:
          "LLM integration plugins connect Claude Code to model providers, vector databases, and inference pipelines. They handle tasks like embedding generation, RAG retrieval, prompt templating, and multi-model routing.",
      },
      {
        question: "Which LLM providers are supported?",
        answer:
          "You'll find plugins for OpenAI, Anthropic, Google Gemini, Ollama, Hugging Face, and many more. Most LLM marketplaces are provider-agnostic with adapters for specific APIs.",
      },
    ],
    relatedSlugs: ["ai-agents", "memory-context", "data-analytics"],
  },
  {
    slug: "development",
    name: "Development Tools",
    title: "Development Tool Marketplaces — IDEs, SDKs, and Developer Plugins",
    description:
      "Browse Claude Code plugin marketplaces for development tools. Find collections of IDE integrations, SDKs, language tooling, and developer productivity plugins.",
    headline: "Development Tool Marketplaces",
    intro:
      "Plugin collections for software development — IDEs, language tooling, SDKs, and code generation. These marketplaces help you find the right development plugins for your stack, from scaffolding to debugging.",
    keywords: [
      "sdk", "ide", "coding", "programming", "boilerplate", "scaffold",
    ],
    icon: "Code",
    faq: [
      {
        question: "What development tools are available in these marketplaces?",
        answer:
          "Development tool marketplaces include IDE extensions, language-specific SDKs, code generators, framework integrations, and build tooling. They cover the full development lifecycle from scaffolding to deployment.",
      },
      {
        question: "Which programming languages are covered?",
        answer:
          "You'll find plugins for TypeScript, Python, Rust, Go, Java, and many more. Most development marketplaces are language-agnostic with specialized plugins for specific ecosystems.",
      },
    ],
    relatedSlugs: ["testing-quality", "frontend", "backend-api"],
  },
  {
    slug: "frontend",
    name: "Frontend & UI",
    title: "Frontend & UI Marketplaces — React, Vue, Tailwind, Component Libraries",
    description:
      "Claude Code plugin marketplaces for frontend development. Browse collections of React, Vue, CSS, Tailwind, and component library plugins.",
    headline: "Frontend & UI Marketplaces",
    intro:
      "Plugin collections for building user interfaces — React, Vue, Svelte, CSS frameworks, and component libraries. These marketplaces aggregate frontend-specific tools that help you ship polished UIs faster.",
    keywords: [
      "react", "vue", "angular", "svelte", "nextjs", "next.js", "css",
      "tailwind", "html", "frontend", "component", "responsive",
    ],
    icon: "Layout",
    faq: [
      {
        question: "Which frontend frameworks are covered?",
        answer:
          "Frontend marketplaces include plugins for React, Vue, Angular, Svelte, Next.js, Nuxt, Astro, and CSS frameworks like Tailwind. You'll also find component library integrations and responsive design utilities.",
      },
      {
        question: "Are there component library plugins?",
        answer:
          "Yes — many frontend marketplaces include plugins for Shadcn UI, Radix, Material UI, and other component systems, plus tools for building and maintaining your own design system.",
      },
    ],
    relatedSlugs: ["design-creative", "development", "testing-quality"],
  },
  {
    slug: "backend-api",
    name: "Backend & APIs",
    title: "Backend & API Marketplaces — REST, GraphQL, Server Frameworks",
    description:
      "Browse Claude Code plugin marketplaces for backend development. Find collections of REST, GraphQL, Express, FastAPI, Django, and NestJS plugins.",
    headline: "Backend & API Marketplaces",
    intro:
      "Plugin collections for server-side development and API design. These marketplaces aggregate tools for building REST and GraphQL APIs, setting up server frameworks, and managing the backend layer of your application.",
    keywords: [
      "api", "rest", "graphql", "grpc", "backend", "endpoint", "express",
      "fastapi", "django", "flask", "nestjs",
    ],
    icon: "Server",
    faq: [
      {
        question: "Which server frameworks are covered?",
        answer:
          "Backend marketplaces include plugins for Express, FastAPI, Django, Flask, NestJS, and many more. You'll find API scaffolding tools, middleware plugins, and framework-specific utilities.",
      },
      {
        question: "Are there GraphQL-specific plugins?",
        answer:
          "Yes — many backend marketplaces include GraphQL schema generators, resolver helpers, and client integration tools alongside REST API utilities.",
      },
    ],
    relatedSlugs: ["database", "frontend", "devops-cloud"],
  },
  {
    slug: "database",
    name: "Databases",
    title: "Database Marketplaces — SQL, PostgreSQL, MongoDB, Redis, ORMs",
    description:
      "Claude Code plugin marketplaces for databases. Browse collections of SQL, PostgreSQL, MongoDB, Redis, Supabase, Firebase, and ORM plugins.",
    headline: "Database Marketplaces",
    intro:
      "Plugin collections for working with databases — SQL and NoSQL engines, ORMs, and managed database services. These marketplaces aggregate tools for schema design, query optimization, migrations, and database management.",
    keywords: [
      "database", "sql", "postgres", "mysql", "mongo", "redis", "supabase",
      "firebase", "dynamodb", "sqlite", "prisma", "drizzle",
    ],
    icon: "Database",
    faq: [
      {
        question: "Which databases are supported?",
        answer:
          "Database marketplaces include plugins for PostgreSQL, MySQL, MongoDB, Redis, SQLite, DynamoDB, Supabase, and Firebase. You'll also find ORM integrations for Prisma, Drizzle, and others.",
      },
      {
        question: "Are there schema migration plugins?",
        answer:
          "Yes — many database marketplaces include migration generators, schema diff tools, and version-controlled database management utilities that work with popular ORMs.",
      },
    ],
    relatedSlugs: ["backend-api", "data-analytics", "devops-cloud"],
  },
  {
    slug: "testing-quality",
    name: "Testing & Code Quality",
    title: "Testing & Quality Marketplaces — Jest, Vitest, Cypress, Linting, Code Review",
    description:
      "Claude Code plugin marketplaces for testing and code quality. Find collections of test frameworks, linters, code review tools, and debugging plugins.",
    headline: "Testing & Code Quality Marketplaces",
    intro:
      "Plugin collections for testing, linting, and code quality. These marketplaces aggregate test frameworks, code review tools, coverage analyzers, and debugging utilities that help teams ship reliable software.",
    keywords: [
      "test", "testing", "jest", "vitest", "cypress", "e2e", "coverage",
      "lint", "eslint", "prettier", "benchmark",
    ],
    icon: "TestTube",
    faq: [
      {
        question: "Which testing frameworks are supported?",
        answer:
          "Testing marketplaces include plugins for Jest, Vitest, Cypress, Playwright, and framework-specific testing utilities. You'll find tools for unit, integration, and end-to-end testing.",
      },
      {
        question: "Are there code review and linting plugins?",
        answer:
          "Yes — many testing marketplaces include ESLint configurations, Prettier integrations, automated code review tools, and static analysis plugins that catch issues before they reach production.",
      },
    ],
    relatedSlugs: ["development", "security", "git-version-control"],
  },
  {
    slug: "devops-cloud",
    name: "DevOps & Cloud",
    title: "DevOps & Cloud Marketplaces — Docker, Kubernetes, Terraform, AWS, CI/CD",
    description:
      "Browse Claude Code plugin marketplaces for DevOps and cloud infrastructure. Find collections of Docker, Kubernetes, Terraform, AWS, and CI/CD plugins.",
    headline: "DevOps & Cloud Marketplaces",
    intro:
      "Plugin collections for DevOps engineers and platform teams. These marketplaces aggregate CI/CD pipeline tools, container orchestration plugins, infrastructure-as-code integrations, and cloud provider utilities for AWS, GCP, and Azure.",
    keywords: [
      "docker", "kubernetes", "terraform", "ansible", "aws", "gcp", "azure",
      "cloud", "ci-cd", "ci/cd", "deploy", "container", "helm", "nginx",
      "grafana", "prometheus", "sentry", "logging",
    ],
    icon: "Cloud",
    faq: [
      {
        question: "What DevOps plugins can I find in these marketplaces?",
        answer:
          "DevOps marketplaces include CI/CD pipeline integrations, Docker and Kubernetes management tools, Terraform modules, monitoring dashboards, and cloud provider utilities for AWS, GCP, and Azure.",
      },
      {
        question: "Are there plugins for Kubernetes and Docker?",
        answer:
          "Yes — many DevOps marketplaces include plugins for container orchestration with Kubernetes, Docker image management, Helm chart tools, and related infrastructure automation.",
      },
    ],
    relatedSlugs: ["security", "automation", "backend-api"],
  },
  {
    slug: "security",
    name: "Security & Compliance",
    title: "Security Marketplaces — Vulnerability Scanning, Auth, Encryption, Compliance",
    description:
      "Claude Code plugin marketplaces for security and compliance. Discover collections of vulnerability scanners, authentication tools, encryption libraries, and compliance automation.",
    headline: "Security & Compliance Marketplaces",
    intro:
      "Plugin collections for application security, vulnerability management, and regulatory compliance. These marketplaces help development teams integrate security scanning, authentication, encryption, and compliance checks into their workflow.",
    keywords: [
      "security", "vulnerability", "pentest", "encryption", "oauth",
      "compliance", "threat", "malware", "firewall",
    ],
    icon: "Shield",
    faq: [
      {
        question: "What types of security scanning plugins are available?",
        answer:
          "Security marketplaces include dependency vulnerability scanners, secret detection tools, SAST/DAST analyzers, and container image scanners. They help catch security issues early in the development lifecycle.",
      },
      {
        question: "Are there compliance automation plugins?",
        answer:
          "Yes — many security marketplaces include plugins for SOC 2, GDPR, HIPAA, and PCI compliance that automate audit trails, access controls, and data handling policies.",
      },
    ],
    relatedSlugs: ["devops-cloud", "testing-quality", "backend-api"],
  },
  {
    slug: "git-version-control",
    name: "Git & Version Control",
    title: "Git & Version Control Marketplaces — Git Workflows, GitHub, GitLab, Branching",
    description:
      "Browse Claude Code plugin marketplaces for Git and version control. Find collections of Git workflow tools, GitHub/GitLab integrations, and branching strategy plugins.",
    headline: "Git & Version Control Marketplaces",
    intro:
      "Plugin collections for Git workflows, commit management, and repository integrations. These marketplaces aggregate tools for better commits, branching strategies, pull request automation, and GitHub/GitLab integrations.",
    keywords: [
      "git", "commit", "branch", "merge", "github", "gitlab", "bitbucket",
      "pull-request", "diff", "worktree",
    ],
    icon: "GitBranch",
    faq: [
      {
        question: "What Git workflow plugins are available?",
        answer:
          "Git marketplaces include commit message helpers, branching strategy enforcers, PR automation tools, merge conflict resolvers, and changelog generators. They streamline the entire commit-to-merge cycle.",
      },
      {
        question: "Are there GitHub and GitLab integration plugins?",
        answer:
          "Yes — many Git marketplaces include plugins for GitHub Actions, GitLab CI, issue management, PR templates, and repository automation across both platforms.",
      },
    ],
    relatedSlugs: ["development", "testing-quality", "documentation"],
  },
  {
    slug: "documentation",
    name: "Documentation & Learning",
    title: "Documentation Marketplaces — Docs Generation, READMEs, Wikis, Tutorials",
    description:
      "Claude Code plugin marketplaces for documentation and learning. Discover collections of doc generators, README tools, wiki integrations, and tutorial builders.",
    headline: "Documentation & Learning Marketplaces",
    intro:
      "Plugin collections for documentation, knowledge management, and learning resources. These marketplaces aggregate doc generators, wiki tools, tutorial platforms, and educational content plugins that help teams build and share knowledge.",
    keywords: [
      "documentation", "docs", "readme", "wiki", "knowledge-base", "tutorial",
      "guide", "jsdoc",
    ],
    icon: "BookOpen",
    faq: [
      {
        question: "Can these plugins generate API documentation automatically?",
        answer:
          "Several documentation marketplace plugins auto-generate API references from code, OpenAPI specs, or TypeScript types — keeping docs in sync with your codebase.",
      },
      {
        question: "Are there knowledge base and wiki plugins?",
        answer:
          "Yes — documentation marketplaces include wiki builders, knowledge base integrations, and internal doc platforms that help teams maintain a single source of truth.",
      },
    ],
    relatedSlugs: ["development", "git-version-control", "productivity"],
  },
  {
    slug: "productivity",
    name: "Productivity & Planning",
    title: "Productivity Marketplaces — Task Management, Notion, Linear, Jira, Calendars",
    description:
      "Claude Code plugin marketplaces for productivity and planning. Find collections of task management, project planning, calendar, and organizational plugins.",
    headline: "Productivity & Planning Marketplaces",
    intro:
      "Plugin collections for getting things done — task management, project planning, calendar integrations, and organizational tools. These marketplaces help teams and individuals stay productive with AI-powered planning plugins that connect with Notion, Linear, Jira, and more.",
    keywords: [
      "productivity", "project-management", "task", "todo", "kanban",
      "notion", "linear", "jira", "obsidian", "calendar",
    ],
    icon: "CheckSquare",
    faq: [
      {
        question: "Which project management tools are supported?",
        answer:
          "Productivity marketplaces include plugins for Notion, Linear, Jira, Obsidian, Trello, and many others. You'll find task syncing, sprint management, and cross-tool integrations.",
      },
      {
        question: "Are there calendar and scheduling plugins?",
        answer:
          "Yes — many productivity marketplaces include calendar integrations, scheduling assistants, and time-blocking tools that connect your project management workflow to your calendar.",
      },
    ],
    relatedSlugs: ["automation", "communication", "documentation"],
  },
  {
    slug: "memory-context",
    name: "Memory & Context",
    title: "Memory & Context Marketplaces — Session Persistence, Knowledge Graphs, Long-Term Memory",
    description:
      "Claude Code plugin marketplaces for memory and context management. Browse collections of session persistence, knowledge graph, and long-term memory plugins.",
    headline: "Memory & Context Marketplaces",
    intro:
      "Plugin collections for managing AI memory and context. These marketplaces aggregate tools for session persistence, long-term memory, knowledge graphs, and context window optimization — enabling agents to remember across conversations and build up knowledge over time.",
    keywords: [
      "memory", "context", "session", "persistent", "recall", "long-term",
      "subconscious",
    ],
    icon: "HardDrive",
    faq: [
      {
        question: "What are memory and context plugins?",
        answer:
          "Memory plugins give AI agents persistent state — they can recall past conversations, store learned preferences, and build knowledge graphs. Context plugins optimize how information is retrieved and presented within the context window.",
      },
      {
        question: "How do memory plugins differ from RAG tools?",
        answer:
          "Memory plugins focus on the agent's own state — what it has learned and experienced. RAG tools retrieve external documents. In practice, many systems combine both for comprehensive knowledge access.",
      },
    ],
    relatedSlugs: ["ai-agents", "llm-integration", "documentation"],
  },
  {
    slug: "web-browser",
    name: "Web & Browser",
    title: "Web & Browser Marketplaces — Browser Automation, Playwright, Puppeteer, Scraping",
    description:
      "Claude Code plugin marketplaces for web and browser automation. Discover collections of Playwright, Puppeteer, web scraping, and headless browser plugins.",
    headline: "Web & Browser Marketplaces",
    intro:
      "Plugin collections for browser automation, web scraping, and headless browser workflows. These marketplaces aggregate tools for Playwright, Puppeteer, Selenium, and other browser automation frameworks that let agents interact with the web.",
    keywords: [
      "browser", "chrome", "playwright", "puppeteer", "selenium", "scraping",
      "crawl", "web-scraping", "headless",
    ],
    icon: "Globe",
    faq: [
      {
        question: "Which browser automation frameworks are supported?",
        answer:
          "Web marketplaces include plugins for Playwright, Puppeteer, Selenium, and custom headless browser tools. You'll find scraping utilities, screenshot tools, and full browser interaction frameworks.",
      },
      {
        question: "Can these plugins handle JavaScript-heavy sites?",
        answer:
          "Yes — most browser automation plugins use headless browsers that fully render JavaScript, handle SPAs, and can interact with dynamic content just like a real user would.",
      },
    ],
    relatedSlugs: ["automation", "data-analytics", "testing-quality"],
  },
  {
    slug: "mobile",
    name: "Mobile Development",
    title: "Mobile Development Marketplaces — iOS, Android, React Native, Flutter",
    description:
      "Browse Claude Code plugin marketplaces for mobile development. Find collections of iOS, Android, React Native, Flutter, and cross-platform mobile plugins.",
    headline: "Mobile Development Marketplaces",
    intro:
      "Plugin collections for building mobile applications. These marketplaces aggregate tools for iOS and Android development, cross-platform frameworks like React Native and Flutter, and mobile-specific utilities for testing, deployment, and app store management.",
    keywords: [
      "mobile", "ios", "android", "react-native", "flutter", "swift",
      "kotlin", "expo",
    ],
    icon: "Smartphone",
    faq: [
      {
        question: "Which mobile frameworks are covered?",
        answer:
          "Mobile marketplaces include plugins for React Native, Flutter, SwiftUI, Kotlin Multiplatform, and Expo. You'll find tools for both native and cross-platform mobile development.",
      },
      {
        question: "Are there app store deployment plugins?",
        answer:
          "Yes — some mobile marketplaces include plugins for managing app store submissions, generating screenshots, handling code signing, and automating the release process for iOS and Android.",
      },
    ],
    relatedSlugs: ["frontend", "design-creative", "testing-quality"],
  },
  {
    slug: "design-creative",
    name: "Design & Creative",
    title: "Design & Creative Marketplaces — Figma, Animation, 3D, Game Dev, Creative Tools",
    description:
      "Claude Code plugin marketplaces for design and creative work. Browse collections of Figma integrations, animation tools, 3D/game development, and creative automation plugins.",
    headline: "Design & Creative Marketplaces",
    intro:
      "Plugin collections for designers, game developers, and creative teams. These marketplaces aggregate Figma integrations, animation tools, 3D engines, game development frameworks, and creative automation plugins.",
    keywords: [
      "design", "figma", "animation", "3d", "blender", "unity", "game",
      "creative", "illustration",
    ],
    icon: "Palette",
    faq: [
      {
        question: "Are there Figma integration plugins?",
        answer:
          "Yes — design marketplaces include Figma plugins for design token extraction, component code generation, and design-to-code workflows that bridge the gap between design and development.",
      },
      {
        question: "What game development plugins are available?",
        answer:
          "Design marketplaces include plugins for Unity, Blender, Godot, and other game engines, plus tools for 3D asset management, animation, and game logic scripting.",
      },
    ],
    relatedSlugs: ["frontend", "media", "mobile"],
  },
  {
    slug: "communication",
    name: "Communication",
    title: "Communication Marketplaces — Slack, Discord, Email, Telegram, Messaging",
    description:
      "Claude Code plugin marketplaces for communication. Discover collections of Slack, Discord, email, Telegram, and messaging integration plugins.",
    headline: "Communication Marketplaces",
    intro:
      "Plugin collections for team communication and messaging integrations. These marketplaces aggregate tools for Slack, Discord, email, Telegram, and other messaging platforms — enabling AI agents to participate in conversations and automate notifications.",
    keywords: [
      "slack", "discord", "email", "telegram", "teams", "messaging", "chat",
      "sms",
    ],
    icon: "MessageSquare",
    faq: [
      {
        question: "Which messaging platforms are supported?",
        answer:
          "Communication marketplaces include plugins for Slack, Discord, Microsoft Teams, Telegram, email, and SMS. You'll find both notification senders and full conversational agent integrations.",
      },
      {
        question: "Can agents respond to messages automatically?",
        answer:
          "Yes — many communication plugins support bidirectional messaging, letting agents listen for incoming messages, process them, and respond within the same platform.",
      },
    ],
    relatedSlugs: ["automation", "productivity", "ai-agents"],
  },
  {
    slug: "automation",
    name: "Automation & Workflows",
    title: "Automation Marketplaces — Workflow Automation, n8n, Zapier, Hooks, Integrations",
    description:
      "Browse Claude Code plugin marketplaces for automation and workflows. Find collections of workflow automation, webhook, scheduler, and integration plugins.",
    headline: "Automation & Workflow Marketplaces",
    intro:
      "Plugin collections for automating repetitive tasks, orchestrating workflows, and connecting services. These marketplaces aggregate integration platforms, webhook handlers, schedulers, and workflow engines that reduce manual work across your development pipeline.",
    keywords: [
      "automation", "automate", "bot", "cron", "scheduler", "n8n", "zapier",
      "hooks", "pre-commit",
    ],
    icon: "Zap",
    faq: [
      {
        question: "What automation plugins are available?",
        answer:
          "Automation marketplaces include workflow orchestration tools (n8n, Zapier), webhook handlers, cron job managers, pre-commit hooks, and integration utilities that connect disparate services.",
      },
      {
        question: "Can I automate multi-step workflows?",
        answer:
          "Yes — many automation marketplaces include visual workflow builders, event-driven pipeline plugins, and DAG-based orchestration tools that chain multiple steps into automated processes.",
      },
    ],
    relatedSlugs: ["ai-agents", "devops-cloud", "productivity"],
  },
  {
    slug: "business-finance",
    name: "Business & Finance",
    title: "Business & Finance Marketplaces — Marketing, SEO, CRM, Payments, Stripe, Shopify",
    description:
      "Claude Code plugin marketplaces for business and finance. Browse collections of marketing, SEO, CRM, payment processing, and e-commerce plugins.",
    headline: "Business & Finance Marketplaces",
    intro:
      "Plugin collections for business operations — marketing automation, SEO tools, CRM integrations, payment processing, and e-commerce platforms. These marketplaces help businesses find plugins that connect their tech stack to revenue-driving workflows.",
    keywords: [
      "business", "marketing", "seo", "stripe", "shopify", "crm",
      "salesforce", "hubspot", "invoice", "accounting", "fintech",
      "ecommerce",
    ],
    icon: "TrendingUp",
    faq: [
      {
        question: "Which payment and e-commerce platforms are supported?",
        answer:
          "Business marketplaces include plugins for Stripe, Shopify, PayPal, and other payment processors, plus e-commerce connectors, invoicing tools, and financial reporting utilities.",
      },
      {
        question: "Are there CRM integration plugins?",
        answer:
          "Yes — many business marketplaces include plugins for Salesforce, HubSpot, Pipedrive, and other CRMs, with features for contact syncing, pipeline management, and lead tracking.",
      },
    ],
    relatedSlugs: ["data-analytics", "communication", "automation"],
  },
  {
    slug: "blockchain-web3",
    name: "Blockchain & Web3",
    title: "Blockchain & Web3 Marketplaces — Ethereum, Solidity, DeFi, Smart Contracts",
    description:
      "Claude Code plugin marketplaces for blockchain and Web3. Discover collections of Ethereum, Solidity, DeFi, smart contract, and crypto development plugins.",
    headline: "Blockchain & Web3 Marketplaces",
    intro:
      "Plugin collections for blockchain development and Web3 applications. These marketplaces aggregate tools for Ethereum, Solidity, smart contract development, DeFi protocols, and crypto tooling.",
    keywords: [
      "blockchain", "web3", "ethereum", "solidity", "defi", "crypto",
      "smart-contract", "nft",
    ],
    icon: "Link",
    faq: [
      {
        question: "Which blockchains are supported?",
        answer:
          "Web3 marketplaces include plugins for Ethereum, Solana, Polygon, and other EVM-compatible chains. You'll find Solidity tools, smart contract auditors, and multi-chain deployment utilities.",
      },
      {
        question: "Are there smart contract development plugins?",
        answer:
          "Yes — blockchain marketplaces include Solidity linters, contract testing frameworks, ABI generators, and deployment automation for popular smart contract platforms.",
      },
    ],
    relatedSlugs: ["security", "backend-api", "testing-quality"],
  },
  {
    slug: "data-analytics",
    name: "Data & Analytics",
    title: "Data & Analytics Marketplaces — Dashboards, Visualization, ETL, Data Pipelines",
    description:
      "Browse Claude Code plugin marketplaces for data and analytics. Find collections of dashboard tools, data visualization, ETL pipelines, and analytics plugins.",
    headline: "Data & Analytics Marketplaces",
    intro:
      "Plugin collections for working with data — dashboards, visualization, ETL pipelines, and analytics platforms. These marketplaces help data teams find the right plugins for data ingestion, transformation, querying, and reporting.",
    keywords: [
      "analytics", "dashboard", "visualization", "chart", "bigquery",
      "snowflake", "etl", "pipeline", "pandas",
    ],
    icon: "BarChart",
    faq: [
      {
        question: "Which analytics platforms are supported?",
        answer:
          "Data marketplaces include plugins for BigQuery, Snowflake, Redshift, Databricks, and other warehouses, plus visualization tools, dashboard builders, and ETL pipeline connectors.",
      },
      {
        question: "Are there data visualization plugins?",
        answer:
          "Yes — many data marketplaces include charting libraries, dashboard generators, and visualization tools that work with D3, Chart.js, Plotly, and other popular frameworks.",
      },
    ],
    relatedSlugs: ["database", "llm-integration", "business-finance"],
  },
  {
    slug: "mcp-servers",
    name: "MCP Servers",
    title: "MCP Server Marketplaces — Model Context Protocol Servers and Integrations",
    description:
      "Claude Code plugin marketplaces for MCP servers. Browse collections of Model Context Protocol servers, integrations, and tooling plugins.",
    headline: "MCP Server Marketplaces",
    intro:
      "Plugin collections for Model Context Protocol (MCP) servers and integrations. These marketplaces aggregate MCP server implementations, client libraries, and tooling that extends Claude Code's capabilities through the standard protocol for AI tool use.",
    keywords: [
      "mcp", "model-context-protocol", "mcp-server",
    ],
    icon: "Plug",
    faq: [
      {
        question: "What are MCP server plugins?",
        answer:
          "MCP (Model Context Protocol) server plugins provide standardized tool integrations for Claude Code. Each MCP server exposes tools, resources, or prompts that Claude can use — from database access to file management to API calls.",
      },
      {
        question: "How do MCP servers differ from regular plugins?",
        answer:
          "MCP servers follow Anthropic's open protocol for AI tool use, making them interoperable across different AI clients. Regular plugins may use proprietary formats specific to a single marketplace.",
      },
    ],
    relatedSlugs: ["ai-agents", "automation", "llm-integration"],
  },
  {
    slug: "scientific-research",
    name: "Scientific Research",
    title: "Scientific Research Marketplaces — Academic Papers, Citations, Experiments",
    description:
      "Claude Code plugin marketplaces for scientific research. Discover collections of academic paper tools, citation managers, experiment tracking, and research automation plugins.",
    headline: "Scientific Research Marketplaces",
    intro:
      "Plugin collections for academic research, scientific computing, and experiment management. These marketplaces aggregate tools for paper discovery, citation management, experiment tracking, and research workflow automation.",
    keywords: [
      "research", "scientific", "academic", "paper", "citation", "science",
      "experiment",
    ],
    icon: "Microscope",
    faq: [
      {
        question: "What research tools are available?",
        answer:
          "Research marketplaces include paper search and summarization tools, citation managers, experiment trackers, lab notebook integrations, and research data management plugins.",
      },
      {
        question: "Can these plugins help with literature reviews?",
        answer:
          "Yes — many research marketplaces include plugins for discovering papers, extracting key findings, managing bibliographies, and synthesizing literature across multiple sources.",
      },
    ],
    relatedSlugs: ["data-analytics", "documentation", "llm-integration"],
  },
  {
    slug: "media",
    name: "Media & Audio/Video",
    title: "Media Marketplaces — Audio, Video, Images, Transcription, FFmpeg, Podcasts",
    description:
      "Claude Code plugin marketplaces for media processing. Browse collections of audio, video, image, transcription, and podcast production plugins.",
    headline: "Media & Audio/Video Marketplaces",
    intro:
      "Plugin collections for media processing — audio, video, images, transcription, and podcast production. These marketplaces aggregate tools for FFmpeg workflows, speech-to-text, text-to-speech, and multimedia content pipelines.",
    keywords: [
      "audio", "video", "image", "speech", "transcription", "ffmpeg",
      "podcast", "tts", "stt",
    ],
    icon: "Film",
    faq: [
      {
        question: "What media processing plugins are available?",
        answer:
          "Media marketplaces include FFmpeg wrappers, transcription services, text-to-speech engines, image processing tools, video editing utilities, and podcast production plugins.",
      },
      {
        question: "Are there transcription and speech plugins?",
        answer:
          "Yes — many media marketplaces include speech-to-text (STT) and text-to-speech (TTS) plugins, supporting Whisper, ElevenLabs, and other providers for real-time and batch transcription.",
      },
    ],
    relatedSlugs: ["design-creative", "ai-agents", "automation"],
  },
];

/**
 * DB categories that map to each marketplace category slug.
 * Used for matching a marketplace's `categories` array field.
 *
 * "community" is intentionally excluded — it's a generic catch-all present
 * on most repos that would contaminate every category. Repos tagged only with
 * "community" rely on keyword matching instead.
 */
const DB_CATEGORY_MAP: Record<string, string[]> = {
  "ai-agents": ["agents", "ai-tools", "ai-security"],
  "llm-integration": ["ai", "ai-ml", "machine-learning"],
  development: [
    "development", "developer-tools", "dev", "development-tools",
    "developer tools", "devtools", "dev-tools", "tooling",
  ],
  frontend: ["frontend", "ui", "ux", "styling", "design-frontend"],
  "backend-api": ["backend", "api"],
  database: ["database", "databases", "data-science"],
  "testing-quality": [
    "testing", "quality", "code-quality", "code-review", "debugging",
    "performance",
  ],
  "devops-cloud": [
    "devops", "infrastructure", "deployment", "ci-cd", "monitoring",
    "observability",
  ],
  security: [
    "security", "compliance", "authentication", "auth", "security-testing",
  ],
  "git-version-control": ["git", "version-control"],
  documentation: ["documentation", "docs", "learning"],
  productivity: [
    "productivity", "productivity-organization", "project-management",
    "calendar", "pm", "tasks", "planning",
  ],
  "memory-context": ["memory"],
  "web-browser": [],
  mobile: ["mobile", "mobile-development"],
  "design-creative": [
    "design", "creative", "creative-media", "gaming", "design-tools",
    "game-development",
  ],
  communication: [
    "communication", "communication-writing", "email", "social-media",
    "support",
  ],
  automation: [
    "automation", "workflow", "workflows", "integration", "orchestration",
    "hooks", "utilities",
  ],
  "business-finance": [
    "business", "business-growth", "business-marketing", "marketing", "crm",
    "finance", "payments", "ecommerce", "hr", "leadership", "sales",
  ],
  "blockchain-web3": ["blockchain"],
  "data-analytics": [
    "data", "analytics", "spreadsheets", "storage-docs", "data analytics",
  ],
  "mcp-servers": ["mcp", "mcp-servers"],
  "scientific-research": ["research"],
  media: ["media", "media-creation", "media-automation"],
};

/**
 * Classify a single marketplace into matching category slugs.
 * A marketplace can belong to multiple categories.
 *
 * Matches against:
 * 1. The marketplace's DB `categories` field (via DB_CATEGORY_MAP)
 * 2. Keyword search in repo + description + categories + pluginKeywords
 */
export function classifyMarketplace(marketplace: Marketplace): string[] {
  const text =
    `${marketplace.repo} ${marketplace.description} ${marketplace.categories.join(" ")} ${(marketplace.pluginKeywords || []).join(" ")}`.toLowerCase();
  const matched: string[] = [];

  for (const cat of MARKETPLACE_CATEGORIES) {
    // Check DB category mapping first
    const dbCats = DB_CATEGORY_MAP[cat.slug] || [];
    let found = false;
    for (const dbCat of dbCats) {
      if (marketplace.categories.includes(dbCat)) {
        matched.push(cat.slug);
        found = true;
        break;
      }
    }
    if (found) continue;

    // Fall back to keyword matching
    for (const kw of cat.keywords) {
      if (text.includes(kw.toLowerCase())) {
        matched.push(cat.slug);
        break;
      }
    }
  }

  return matched;
}

/**
 * Classify all marketplaces and return a map of slug -> marketplaces.
 * Marketplaces are deduplicated by slug and sorted by stars + voteCount descending.
 */
export function classifyAllMarketplaces(
  marketplaces: Marketplace[]
): Record<string, Marketplace[]> {
  const map: Record<string, Marketplace[]> = {};
  const seen: Record<string, Set<string>> = {};

  for (const cat of MARKETPLACE_CATEGORIES) {
    map[cat.slug] = [];
    seen[cat.slug] = new Set();
  }

  for (const marketplace of marketplaces) {
    const slugs = classifyMarketplace(marketplace);
    for (const slug of slugs) {
      if (!seen[slug].has(marketplace.slug)) {
        seen[slug].add(marketplace.slug);
        map[slug].push(marketplace);
      }
    }
  }

  // Sort each category by stars + voteCount descending
  for (const slug of Object.keys(map)) {
    map[slug].sort(
      (a, b) => (b.stars ?? 0) + b.voteCount - ((a.stars ?? 0) + a.voteCount)
    );
  }

  return map;
}

export function getMarketplaceCategoryBySlug(
  slug: string
): Category | undefined {
  return MARKETPLACE_CATEGORIES.find((c) => c.slug === slug);
}
