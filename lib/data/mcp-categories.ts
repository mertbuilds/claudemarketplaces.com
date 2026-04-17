import { Category, McpServer } from "@/lib/types";

/** @deprecated Use `Category` from `@/lib/types` instead */
export type McpCategory = Category;

export const MCP_CATEGORIES: Category[] = [
  {
    slug: "web-browser",
    name: "Web & Browser Automation",
    title: "Web & Browser Automation MCP Servers — Chrome, Playwright, Crawling",
    description:
      "MCP servers for web browsing, browser automation, and web scraping. Control Chrome, Playwright, Puppeteer, and crawl the web from your AI workflows.",
    headline: "Web & Browser Automation MCP Servers",
    intro:
      "MCP servers that give your AI agent eyes and hands on the web. From headless browser control with Playwright and Puppeteer to full web scraping pipelines, these servers let Claude interact with websites, fill forms, take screenshots, and extract structured data.",
    keywords: [
      "chrome", "playwright", "puppeteer", "browser", "browserbase",
      "browser-use", "web-scraper", "web-scraping", "headless",
      "selenium", "fetcher", "stealth-browser",
    ],
    icon: "Globe",
    faq: [
      {
        question: "What can browser automation MCP servers do?",
        answer:
          "Browser automation MCP servers let Claude control a web browser — navigate pages, click elements, fill forms, take screenshots, and extract data. They're useful for testing, scraping, and any task that requires interacting with a website.",
      },
      {
        question: "Which browser engines are supported?",
        answer:
          "Most servers use Chromium via Playwright or Puppeteer. Some support Firefox and WebKit as well. Cloud-hosted options like Browserbase provide managed browser instances without local setup.",
      },
    ],
    relatedSlugs: ["search", "automation", "data-analytics"],
  },
  {
    slug: "database",
    name: "Databases",
    title: "Database MCP Servers — PostgreSQL, MySQL, MongoDB, Redis",
    description:
      "MCP servers for database access and management. Connect Claude to PostgreSQL, MySQL, MongoDB, Redis, Supabase, Firebase, and more.",
    headline: "Database MCP Servers",
    intro:
      "MCP servers that connect your AI agent directly to databases. Query PostgreSQL, manage MongoDB collections, interact with Redis caches, or work with managed services like Supabase and Firebase — all through the Model Context Protocol.",
    keywords: [
      "postgres", "postgresql", "mysql", "sqlite", "mongo", "mongodb",
      "redis", "supabase", "firebase", "firestore", "clickhouse",
      "elasticsearch", "dynamodb", "cassandra", "cockroach", "neon",
      "planetscale", "turso", "drizzle", "prisma", "database", "sql",
      "mariadb", "timescale", "influxdb", "neo4j",
    ],
    icon: "Database",
    faq: [
      {
        question: "Can Claude query my database through MCP?",
        answer:
          "Yes — database MCP servers let Claude execute queries, inspect schemas, manage migrations, and interact with your data. Most servers support read and write operations with configurable permissions.",
      },
      {
        question: "Which databases are supported?",
        answer:
          "You'll find servers for PostgreSQL, MySQL, SQLite, MongoDB, Redis, Elasticsearch, ClickHouse, and managed platforms like Supabase, Firebase, Neon, and PlanetScale.",
      },
      {
        question: "Is it safe to connect Claude to my production database?",
        answer:
          "Most database MCP servers support read-only mode and connection scoping. For production use, connect to a read replica or configure the server with restricted credentials.",
      },
    ],
    relatedSlugs: ["cloud-infrastructure", "data-analytics", "developer-tools"],
  },
  {
    slug: "ai-agents",
    name: "AI & LLM Tools",
    title: "AI & LLM MCP Servers — Agents, RAG, Embeddings, Vector Stores",
    description:
      "MCP servers for AI and LLM workflows. Build agents, run RAG pipelines, manage embeddings, and integrate with OpenAI, Anthropic, and other AI providers.",
    headline: "AI & LLM Tool MCP Servers",
    intro:
      "MCP servers for building and orchestrating AI-powered workflows. From RAG pipelines and vector stores to multi-agent coordination and LLM provider integrations, these servers extend Claude's capabilities with specialized AI tooling.",
    keywords: [
      "agent", "llm", "rag", "embedding", "vector", "openai",
      "anthropic", "langchain", "langgraph", "crewai", "autogen",
      "chatbot", "copilot", "gpt", "gemini", "ollama", "huggingface",
      "hugging-face", "pinecone", "weaviate", "chroma", "qdrant",
      "milvus", "prompt", "fine-tune", "finetune", "ai-sdk",
      "model-context", "tool-use", "function-calling",
    ],
    icon: "Bot",
    faq: [
      {
        question: "What are AI & LLM MCP servers?",
        answer:
          "These are MCP servers that provide AI-specific capabilities — connecting to LLM providers, managing vector stores for RAG, running embedding pipelines, and coordinating multi-agent workflows. They let Claude orchestrate other AI tools.",
      },
      {
        question: "Can I use these to build RAG applications?",
        answer:
          "Yes — you'll find servers for vector databases (Pinecone, Weaviate, Chroma, Qdrant), embedding generation, and document chunking. Combine them to build full RAG pipelines that Claude can query.",
      },
    ],
    relatedSlugs: ["search", "data-analytics", "automation"],
  },
  {
    slug: "cloud-infrastructure",
    name: "Cloud & Infrastructure",
    title: "Cloud & Infrastructure MCP Servers — AWS, Azure, Docker, Kubernetes",
    description:
      "MCP servers for cloud platforms and infrastructure management. Control AWS, Azure, GCP, Docker, Kubernetes, Terraform, and Cloudflare from your AI agent.",
    headline: "Cloud & Infrastructure MCP Servers",
    intro:
      "MCP servers for managing cloud resources and infrastructure. Deploy containers, provision cloud services, manage Kubernetes clusters, and run Terraform plans — all orchestrated by Claude through the Model Context Protocol.",
    keywords: [
      "aws", "azure", "gcp", "google-cloud", "docker", "kubernetes",
      "k8s", "terraform", "cloudflare", "cloud-run", "vercel",
      "netlify", "heroku", "digitalocean", "linode", "ec2", "s3",
      "lambda", "ecs", "fargate", "helm", "pulumi", "ansible",
      "vagrant", "infrastructure",
    ],
    icon: "Cloud",
    faq: [
      {
        question: "Can Claude manage my cloud infrastructure through MCP?",
        answer:
          "Yes — cloud MCP servers let Claude interact with AWS, Azure, GCP, and other providers to manage resources, deploy services, and inspect infrastructure state. Always configure appropriate IAM permissions.",
      },
      {
        question: "Which infrastructure tools are supported?",
        answer:
          "You'll find servers for major cloud providers (AWS, Azure, GCP), container platforms (Docker, Kubernetes), IaC tools (Terraform, Pulumi), and edge platforms (Cloudflare, Vercel).",
      },
    ],
    relatedSlugs: ["developer-tools", "monitoring", "security"],
  },
  {
    slug: "communication",
    name: "Communication & Messaging",
    title: "Communication MCP Servers — Slack, Discord, Email, Telegram",
    description:
      "MCP servers for messaging and communication platforms. Connect Claude to Slack, Discord, Gmail, Telegram, WhatsApp, and other messaging services.",
    headline: "Communication & Messaging MCP Servers",
    intro:
      "MCP servers that connect your AI agent to communication platforms. Send and read Slack messages, manage Discord servers, process emails, and integrate with Telegram, WhatsApp, and other messaging services.",
    keywords: [
      "slack", "discord", "email", "gmail", "outlook", "telegram",
      "whatsapp", "chat", "line", "teams", "microsoft-teams",
      "sendgrid", "resend", "postmark", "twilio", "sms",
      "matrix", "irc", "messaging", "notification",
    ],
    icon: "MessageSquare",
    faq: [
      {
        question: "Can Claude send messages through MCP servers?",
        answer:
          "Yes — communication MCP servers let Claude send and read messages on platforms like Slack, Discord, Telegram, and email. They support composing messages, reading threads, managing channels, and processing notifications.",
      },
      {
        question: "Which messaging platforms are supported?",
        answer:
          "You'll find servers for Slack, Discord, Telegram, WhatsApp, Gmail, Outlook, Microsoft Teams, and more. Most support both reading and sending messages with appropriate API credentials.",
      },
    ],
    relatedSlugs: ["automation", "monitoring", "developer-tools"],
  },
  {
    slug: "developer-tools",
    name: "Developer Tools",
    title: "Developer Tool MCP Servers — GitHub, GitLab, Jira, Linear",
    description:
      "MCP servers for developer tools and project management. Integrate Claude with GitHub, GitLab, Bitbucket, Jira, Linear, and other dev platforms.",
    headline: "Developer Tool MCP Servers",
    intro:
      "MCP servers that integrate your AI agent with developer platforms and project management tools. Manage GitHub repos, create Jira tickets, track Linear issues, and automate your development workflow through the Model Context Protocol.",
    keywords: [
      "git", "github", "gitlab", "bitbucket", "jira", "atlassian",
      "linear", "sentry", "sourcegraph", "snyk", "sonarqube",
      "npm", "package", "registry", "ci", "pull-request",
      "issue", "code-review", "linter", "formatter",
    ],
    icon: "Wrench",
    faq: [
      {
        question: "How do developer tool MCP servers work?",
        answer:
          "Developer tool MCP servers connect Claude to platforms like GitHub, GitLab, Jira, and Linear through their APIs. Claude can create issues, review pull requests, manage repositories, and interact with your dev toolchain.",
      },
      {
        question: "Can Claude manage my GitHub repos through MCP?",
        answer:
          "Yes — GitHub MCP servers let Claude create and review PRs, manage issues, search code, configure actions, and interact with the GitHub API. Similar capabilities exist for GitLab and Bitbucket.",
      },
    ],
    relatedSlugs: ["cloud-infrastructure", "automation", "monitoring"],
  },
  {
    slug: "design-creative",
    name: "Design & Creative",
    title: "Design & Creative MCP Servers — Figma, Blender, Unity, 3D",
    description:
      "MCP servers for design and creative tools. Connect Claude to Figma, Blender, Unity, Godot, and other creative platforms for AI-assisted design workflows.",
    headline: "Design & Creative MCP Servers",
    intro:
      "MCP servers for creative tools and design platforms. From reading Figma designs to controlling Blender scenes and game engines, these servers bring AI assistance to the creative workflow.",
    keywords: [
      "figma", "blender", "unity", "godot", "3d", "game",
      "excalidraw", "manim", "animation", "render", "canvas",
      "sketch", "adobe", "photoshop", "illustrator", "design",
      "creative", "image-gen", "dalle", "midjourney", "stable-diffusion",
      "svg", "diagram",
    ],
    icon: "Palette",
    faq: [
      {
        question: "Can Claude work with design tools through MCP?",
        answer:
          "Yes — design MCP servers let Claude read Figma files, generate diagrams, control 3D scenes in Blender, and interact with other creative tools. They're useful for design-to-code workflows and automated asset generation.",
      },
      {
        question: "Which creative tools are supported?",
        answer:
          "You'll find servers for Figma, Blender, Unity, Godot, Excalidraw, and various image generation services. The community regularly adds servers for new creative platforms.",
      },
    ],
    relatedSlugs: ["web-browser", "documents-knowledge", "ai-agents"],
  },
  {
    slug: "documents-knowledge",
    name: "Documents & Knowledge",
    title: "Document & Knowledge MCP Servers — Obsidian, Notion, PDF, Markdown",
    description:
      "MCP servers for document management and knowledge bases. Connect Claude to Obsidian, Notion, Confluence, PDF files, and other knowledge platforms.",
    headline: "Document & Knowledge MCP Servers",
    intro:
      "MCP servers for reading, writing, and managing documents and knowledge bases. Connect Claude to your Obsidian vault, Notion workspace, Confluence pages, or local files to build AI-powered knowledge workflows.",
    keywords: [
      "obsidian", "notion", "confluence", "pdf", "markdown",
      "zotero", "readwise", "pocket", "instapaper", "wiki",
      "note", "notebook", "knowledge", "document", "docx",
      "google-docs", "google-drive", "dropbox", "onedrive",
      "sharepoint", "airtable", "roam", "logseq", "mem",
    ],
    icon: "FileText",
    faq: [
      {
        question: "Can Claude access my notes and documents through MCP?",
        answer:
          "Yes — document MCP servers let Claude read and write to platforms like Obsidian, Notion, and Confluence. They can also process PDFs, parse markdown files, and interact with cloud storage services.",
      },
      {
        question: "Which knowledge management tools are supported?",
        answer:
          "You'll find servers for Obsidian, Notion, Confluence, Google Docs, Zotero, Readwise, and various file formats like PDF and Markdown. These are popular for building AI-powered second brains.",
      },
    ],
    relatedSlugs: ["search", "ai-agents", "data-analytics"],
  },
  {
    slug: "search",
    name: "Search & Web Crawling",
    title: "Search & Web Crawling MCP Servers — Exa, Tavily, Crawl4AI",
    description:
      "MCP servers for web search and crawling. Give Claude access to search engines, web crawlers, and content extraction tools like Exa, Tavily, and Crawl4AI.",
    headline: "Search & Web Crawling MCP Servers",
    intro:
      "MCP servers that give your AI agent access to search engines and web crawling tools. From API-based search with Exa and Tavily to full-site crawling with Crawl4AI, these servers let Claude find and extract information from the web.",
    keywords: [
      "search", "exa", "duckduckgo", "tavily", "searxng", "crawl4ai",
      "crawl", "crawler", "scrape", "scraping", "serp", "google-search",
      "bing", "brave-search", "firecrawl", "jina", "fetch",
      "spider", "sitemap", "index", "extract",
    ],
    icon: "Search",
    faq: [
      {
        question: "How do search MCP servers differ from browser automation?",
        answer:
          "Search MCP servers provide structured search results through APIs — they're faster and more reliable for finding information. Browser automation servers control a full browser for interactive tasks. Use search servers when you need to find information; use browser servers when you need to interact with a specific website.",
      },
      {
        question: "Which search providers are available?",
        answer:
          "You'll find servers for Exa, Tavily, DuckDuckGo, Brave Search, SearXNG, and Google Search API, among others. Crawling tools like Crawl4AI, Firecrawl, and Jina are also available for extracting content from specific URLs.",
      },
      {
        question: "Can Claude crawl entire websites?",
        answer:
          "Yes — crawling MCP servers like Crawl4AI and Firecrawl can traverse websites, follow links, and extract structured content. They're useful for building datasets, monitoring changes, and indexing content.",
      },
    ],
    relatedSlugs: ["web-browser", "ai-agents", "data-analytics"],
  },
  {
    slug: "automation",
    name: "Automation & Workflows",
    title: "Automation & Workflow MCP Servers — n8n, Zapier, Cron, Pipelines",
    description:
      "MCP servers for automation and workflow orchestration. Connect Claude to n8n, Zapier, cron jobs, and workflow engines to automate complex multi-step processes.",
    headline: "Automation & Workflow MCP Servers",
    intro:
      "MCP servers for automating tasks and orchestrating workflows. Trigger n8n workflows, schedule cron jobs, connect to Zapier, and build multi-step automation pipelines — all driven by your AI agent.",
    keywords: [
      "n8n", "workflow", "automation", "cron", "zapier", "make",
      "ifttt", "temporal", "airflow", "prefect", "dagster",
      "schedule", "trigger", "webhook", "orchestrat", "pipeline",
      "automate",
    ],
    icon: "Zap",
    faq: [
      {
        question: "Can Claude trigger automated workflows?",
        answer:
          "Yes — automation MCP servers let Claude trigger and manage workflows on platforms like n8n and Zapier. Claude can start workflows, pass data between steps, and monitor execution status.",
      },
      {
        question: "What kind of automations are possible?",
        answer:
          "Anything from simple cron-based scheduling to complex multi-step pipelines. Common use cases include data sync between services, automated reporting, CI/CD triggers, and event-driven workflows.",
      },
    ],
    relatedSlugs: ["developer-tools", "communication", "cloud-infrastructure"],
  },
  {
    slug: "security",
    name: "Security & Pentesting",
    title: "Security & Pentesting MCP Servers — Vulnerability Scanning, SAST, Auth",
    description:
      "MCP servers for security analysis and penetration testing. Run vulnerability scans, static analysis, and security audits with Semgrep, Metasploit, and more.",
    headline: "Security & Pentesting MCP Servers",
    intro:
      "MCP servers for security analysis, vulnerability scanning, and penetration testing. From static analysis with Semgrep to network scanning and auth testing, these servers let Claude assist with security workflows.",
    keywords: [
      "security", "pentest", "vulnerability", "semgrep", "metasploit",
      "nmap", "owasp", "auth", "encryption", "cve", "exploit",
      "scanner", "firewall", "compliance", "audit",
      "threat", "malware",
    ],
    icon: "Shield",
    faq: [
      {
        question: "Can Claude perform security scans through MCP?",
        answer:
          "Yes — security MCP servers let Claude run vulnerability scans, static analysis, and security audits. They integrate with tools like Semgrep for code analysis and can check for common vulnerabilities like those in the OWASP Top 10.",
      },
      {
        question: "Are pentesting MCP servers safe to use?",
        answer:
          "These servers should only be used on systems you own or have authorization to test. They provide offensive security capabilities that are powerful but must be used responsibly and legally.",
      },
    ],
    relatedSlugs: ["developer-tools", "cloud-infrastructure", "monitoring"],
  },
  {
    slug: "monitoring",
    name: "Monitoring & Observability",
    title: "Monitoring & Observability MCP Servers — Sentry, Logs, Analytics",
    description:
      "MCP servers for monitoring, logging, and observability. Connect Claude to Sentry, log aggregators, APM tools, and analytics platforms.",
    headline: "Monitoring & Observability MCP Servers",
    intro:
      "MCP servers for monitoring applications, analyzing logs, and tracking metrics. Connect Claude to Sentry for error tracking, log aggregators for debugging, and analytics platforms for understanding system behavior.",
    keywords: [
      "monitor", "sentry", "log", "analytics", "observability",
      "datadog", "grafana", "prometheus", "newrelic", "apm",
      "uptime", "alerting", "incident", "trace", "metric",
      "kibana", "splunk",
    ],
    icon: "Activity",
    faq: [
      {
        question: "Can Claude monitor my applications through MCP?",
        answer:
          "Yes — monitoring MCP servers let Claude access error reports from Sentry, query log aggregators, check uptime monitors, and analyze application metrics. They're useful for incident response and proactive monitoring.",
      },
      {
        question: "Which monitoring tools are supported?",
        answer:
          "You'll find servers for Sentry, Datadog, Grafana, Prometheus, New Relic, and various log aggregation tools. Most support querying historical data and setting up alerts.",
      },
    ],
    relatedSlugs: ["cloud-infrastructure", "developer-tools", "security"],
  },
  {
    slug: "data-analytics",
    name: "Data & Analytics",
    title: "Data & Analytics MCP Servers — Excel, CSV, Jupyter, Google Analytics",
    description:
      "MCP servers for data analysis and business intelligence. Work with Excel, CSV, Jupyter notebooks, Google Analytics, and other data tools through Claude.",
    headline: "Data & Analytics MCP Servers",
    intro:
      "MCP servers for working with data, spreadsheets, and analytics platforms. From parsing CSV files and Excel spreadsheets to querying Google Analytics and running Jupyter notebooks, these servers make Claude a capable data analyst.",
    keywords: [
      "data", "excel", "csv", "jupyter", "google-analytics",
      "bigquery", "snowflake", "dbt", "looker", "tableau",
      "powerbi", "spreadsheet", "pandas", "parquet", "json",
      "xml", "etl", "warehouse", "reporting", "dashboard",
      "google-sheets", "sheets",
    ],
    icon: "BarChart3",
    faq: [
      {
        question: "Can Claude analyze data through MCP servers?",
        answer:
          "Yes — data MCP servers let Claude read spreadsheets, parse CSV files, query analytics platforms, and run data transformations. They're useful for ad-hoc analysis, report generation, and data pipeline development.",
      },
      {
        question: "Which analytics platforms are supported?",
        answer:
          "You'll find servers for Google Analytics, BigQuery, Snowflake, Looker, Tableau, and more. File-based servers support Excel, CSV, Parquet, and JSON formats.",
      },
      {
        question: "Can Claude work with Jupyter notebooks?",
        answer:
          "Yes — Jupyter MCP servers let Claude create, execute, and modify notebook cells. This enables interactive data exploration and analysis workflows driven by AI.",
      },
    ],
    relatedSlugs: ["database", "ai-agents", "documents-knowledge"],
  },
  {
    slug: "mobile",
    name: "Mobile Development",
    title: "Mobile Development MCP Servers — iOS, Android, Simulators",
    description:
      "MCP servers for mobile development. Control iOS simulators, interact with Android devices via ADB, and automate mobile testing workflows.",
    headline: "Mobile Development MCP Servers",
    intro:
      "MCP servers for mobile app development and testing. Control iOS simulators, interact with Android devices through ADB, run mobile test suites, and automate mobile development workflows.",
    keywords: [
      "ios", "android", "mobile", "simulator", "adb",
      "xcode", "swift", "kotlin", "react-native", "flutter",
      "expo", "capacitor", "cordova", "appium", "detox",
      "emulator", "iphone", "ipad",
    ],
    icon: "Smartphone",
    faq: [
      {
        question: "Can Claude control mobile simulators?",
        answer:
          "Yes — mobile MCP servers let Claude launch and interact with iOS simulators and Android emulators. This enables automated testing, UI inspection, and development workflow automation.",
      },
      {
        question: "Which mobile platforms are supported?",
        answer:
          "You'll find servers for iOS (Xcode simulators) and Android (ADB). Cross-platform frameworks like React Native, Flutter, and Expo are also supported through dedicated servers.",
      },
    ],
    relatedSlugs: ["developer-tools", "design-creative", "automation"],
  },
  {
    slug: "finance-commerce",
    name: "Finance & Commerce",
    title: "Finance & Commerce MCP Servers — Stripe, Shopify, Ads, CRM",
    description:
      "MCP servers for finance, e-commerce, and advertising platforms. Connect Claude to Stripe, Shopify, Facebook Ads, Salesforce, and other business tools.",
    headline: "Finance & Commerce MCP Servers",
    intro:
      "MCP servers that connect your AI agent to financial, e-commerce, and advertising platforms. Manage Stripe payments, query Shopify orders, run Facebook Ads reports, and interact with CRMs like Salesforce.",
    keywords: [
      "stripe", "shopify", "paypal", "payment", "invoice", "billing",
      "salesforce", "hubspot", "crm", "facebook-ads", "google-ads",
      "ads", "commerce", "checkout", "order", "subscription",
      "quickbooks", "xero", "accounting", "fintech", "banking",
      "crypto", "bitcoin", "ethereum", "solana", "defi", "trading",
      "coinbase", "binance",
    ],
    icon: "DollarSign",
    faq: [
      {
        question: "Can Claude manage payments and commerce through MCP?",
        answer:
          "Yes — finance MCP servers let Claude create Stripe charges, query Shopify orders, pull ad campaign metrics, and interact with CRM platforms. Configure with appropriate API credentials and permissions.",
      },
    ],
    relatedSlugs: ["data-analytics", "automation", "communication"],
  },
  {
    slug: "media-entertainment",
    name: "Media & Entertainment",
    title: "Media & Entertainment MCP Servers — YouTube, Spotify, Music Production",
    description:
      "MCP servers for media platforms and creative tools. Connect Claude to YouTube, Spotify, Ableton, video editors, and other media services.",
    headline: "Media & Entertainment MCP Servers",
    intro:
      "MCP servers for media platforms, music production, and entertainment services. From managing YouTube channels to controlling Ableton Live sessions and processing audio/video, these servers bring AI into the media workflow.",
    keywords: [
      "youtube", "spotify", "music", "audio", "video", "podcast",
      "ableton", "midi", "ffmpeg", "obs", "streaming", "media",
      "entertainment", "tiktok", "instagram", "twitter", "social",
      "photo", "camera", "transcription", "subtitle", "speech",
      "tts", "stt", "whisper", "elevenlabs",
    ],
    icon: "Play",
    faq: [
      {
        question: "Can Claude work with media platforms?",
        answer:
          "Yes — media MCP servers let Claude manage YouTube uploads, process audio/video files, control music production tools like Ableton, and interact with social media platforms.",
      },
    ],
    relatedSlugs: ["design-creative", "automation", "ai-agents"],
  },
  {
    slug: "productivity-tools",
    name: "Productivity & Office",
    title: "Productivity & Office MCP Servers — Calendar, Notes, Task Management",
    description:
      "MCP servers for productivity tools and office applications. Connect Claude to calendar apps, note-taking tools, task managers, and office suites.",
    headline: "Productivity & Office MCP Servers",
    intro:
      "MCP servers for productivity and office applications. Manage calendar events, create notes in Obsidian or Notion, control PowerPoint presentations, and interact with task management tools like Todoist and Linear.",
    keywords: [
      "calendar", "todo", "todoist", "task", "trello", "asana",
      "monday", "clickup", "powerpoint", "pptx", "excel", "word",
      "office", "anki", "flashcard", "apple-notes", "applescript",
      "raycast", "alfred", "shortcut", "remember", "bookmark",
    ],
    icon: "ClipboardList",
    faq: [
      {
        question: "Can Claude manage my tasks and calendar?",
        answer:
          "Yes — productivity MCP servers let Claude create calendar events, manage tasks in Todoist or Trello, generate presentations, and interact with note-taking apps.",
      },
    ],
    relatedSlugs: ["communication", "documents-knowledge", "automation"],
  },
  {
    slug: "reverse-engineering",
    name: "Reverse Engineering",
    title: "Reverse Engineering MCP Servers — Ghidra, IDA, Binary Analysis",
    description:
      "MCP servers for reverse engineering and binary analysis. Connect Claude to Ghidra, IDA Pro, debuggers, and other reverse engineering tools.",
    headline: "Reverse Engineering MCP Servers",
    intro:
      "MCP servers for binary analysis, disassembly, and reverse engineering. Control Ghidra, IDA Pro, WinDbg, and GDB through Claude to analyze binaries, trace execution, and understand compiled code.",
    keywords: [
      "ghidra", "ida", "ida-pro", "binary", "disassembl", "decompil",
      "reverse-eng", "windbg", "gdb", "lldb", "radare", "x64dbg",
      "pe-file", "elf", "macho", "assembly", "asm",
    ],
    icon: "Microscope",
    faq: [
      {
        question: "Can Claude assist with reverse engineering?",
        answer:
          "Yes — reverse engineering MCP servers let Claude interact with disassemblers like Ghidra and IDA, analyze binary files, and assist with debugging sessions in GDB and WinDbg.",
      },
    ],
    relatedSlugs: ["security", "developer-tools"],
  },
];

/**
 * Classify a single MCP server into matching category slugs.
 * A server can belong to multiple categories.
 */
export function classifyMcpServer(server: McpServer): string[] {
  const text =
    `${server.name} ${server.description} ${server.sourceRepo} ${server.tags.join(" ")} ${server.summary ?? ""}`.toLowerCase();
  const matched: string[] = [];

  for (const cat of MCP_CATEGORIES) {
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
 * Classify all MCP servers and return a map of slug -> servers.
 * Servers are deduplicated by slug and sorted by stars descending.
 */
export function classifyAllMcpServers(
  servers: McpServer[]
): Record<string, McpServer[]> {
  const map: Record<string, McpServer[]> = {};
  const seen: Record<string, Set<string>> = {};

  for (const cat of MCP_CATEGORIES) {
    map[cat.slug] = [];
    seen[cat.slug] = new Set();
  }

  for (const server of servers) {
    const slugs = classifyMcpServer(server);
    for (const slug of slugs) {
      if (!seen[slug].has(server.slug)) {
        seen[slug].add(server.slug);
        map[slug].push(server);
      }
    }
  }

  // Sort each category by stars descending
  for (const slug of Object.keys(map)) {
    map[slug].sort(
      (a, b) =>
        (b.stars ?? 0) + b.voteCount - ((a.stars ?? 0) + a.voteCount)
    );
  }

  return map;
}

export function getMcpCategoryBySlug(
  slug: string
): Category | undefined {
  return MCP_CATEGORIES.find((c) => c.slug === slug);
}
