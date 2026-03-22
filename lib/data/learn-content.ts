import { Video, Article, LearnLink } from "@/lib/types";

export const videos: Video[] = [
  {
    url: "https://www.youtube.com/embed/hX7yG1KVYhI",
    title: "Building a REAL feature with Claude Code: every step explained",
    description:
      "Matt Pocock walks through the complete process of building a real feature with Claude Code, explaining every step from start to finish. A practical, hands-on look at how to leverage Claude Code for real-world development work.",
    author: {
      name: "Matt Pocock",
      image:
        "https://yt3.googleusercontent.com/pSHatpqJ1olaZiyikhjdx3nbSJNdo71kzFYyyBpNhFAeK6v-zmfJPIp7HMtkWQ4bt0DRkU8X_-8=s160-c-k-c0x00ffffff-no-rj",
    },
  },
  {
    url: "https://www.youtube.com/embed/kZ-zzHVUrO4",
    title: "How I use Claude Code for real engineering",
    description:
      "In this video, I walk through my complete workflow for tackling large coding projects using Claude Code's plan mode. I demonstrate how to start with a rough dictated prompt, use plan mode to explore the codebase and generate clarifying questions, and break complex work into multi-phase plans that can span multiple context windows. I show my custom rules configuration that keeps plans concise and adds unresolved questions, how to monitor context usage throughout implementation, and my strategy of storing plans as GitHub issues to preserve them across context resets. This approach combines upfront planning with aggressive auto-accept during implementation phases, allowing AI to handle substantial features while maintaining control and code quality. I share practical tips including my favorite concision rule, the benefits of multi-phase planning, and how to effectively manage context windows for large projects.",
    author: {
      name: "Matt Pocock",
      image:
        "https://yt3.googleusercontent.com/pSHatpqJ1olaZiyikhjdx3nbSJNdo71kzFYyyBpNhFAeK6v-zmfJPIp7HMtkWQ4bt0DRkU8X_-8=s160-c-k-c0x00ffffff-no-rj",
    },
  },
  {
    url: "https://www.youtube.com/embed/gNR3XI5Eb0k",
    title: "I was wrong about Claude Code (UPDATED AI workflow tutorial)",
    description:
      "In this video I talk about my UPDATED AI coding workflow (using Claude Code, why I switched from Cursor, thoughts on the AI coding space) and how it makes me 20x faster as a developer.",
    author: {
      name: "Chris Raroque",
      image:
        "https://yt3.googleusercontent.com/8lU3h1nLUeI6paldg8cvclJ5YwK_N3UyzARPS3xqy88lc6ltmnZKR_5TOQB1pJeVB9__8h_GxA=s160-c-k-c0x00ffffff-no-rj",
    },
  },
  {
    url: "https://www.youtube.com/embed/-uW5-TaVXu4",
    title: "Most devs don’t understand how context windows work",
    description:
      "A deep dive into the context window - the most important constraint when using AI coding agents. Learn what makes up a context window (input and output tokens), why models have limits, and the critical 'lost-in-the-middle' problem that causes models to deprioritize information buried in long conversations. Discover practical strategies for managing context effectively in Claude Code, including when to clear vs. compact conversations, why bigger context windows aren't always better, and how MCP servers can bloat your context. Understanding context windows is the key skill that separates developers who get great results from coding agents versus those who struggle. Includes real examples and best practices for maintaining lean, focused contexts that maximize AI coding performance.",
    author: {
      name: "Matt Pocock",
      image:
        "https://yt3.googleusercontent.com/pSHatpqJ1olaZiyikhjdx3nbSJNdo71kzFYyyBpNhFAeK6v-zmfJPIp7HMtkWQ4bt0DRkU8X_-8=s160-c-k-c0x00ffffff-no-rj",
    },
  },
  {
    url: "https://www.youtube.com/embed/18V3lFePdWU",
    title: "How I Get AI To Follow My Designs (In-Depth Walkthrough)",
    description:
      "In this video I talk about how I get AI coding tools to follow my designs. This 40 mins of REAL thought process that goes on when trying to work with AI to go from design to working code :)",
    author: {
      name: "Chris Raroque",
      image:
        "https://yt3.googleusercontent.com/8lU3h1nLUeI6paldg8cvclJ5YwK_N3UyzARPS3xqy88lc6ltmnZKR_5TOQB1pJeVB9__8h_GxA=s160-c-k-c0x00ffffff-no-rj",
    },
  },
];

export const articles: Article[] = [
  {
    url: "https://x.com/trq212/status/2033949937936085378",
    title: "Lessons from using Claude Code skills at Anthropic",
    description:
      "Skills have become one of the most used extension points in Claude Code. They're flexible, easy to make, and simple to distribute. Lessons learned from hundreds of skills in active use at Anthropic — what types are worth making, how to write good ones, and when to share them.",
    image:
      "https://pbs.twimg.com/media/HDl2jn9a0AAZkyz?format=jpg&name=medium",
    author: {
      name: "Thariq",
      image:
        "https://pbs.twimg.com/profile_images/1976939058741039104/r3GgzqRh_400x400.jpg",
    },
    date: "2026-03-22",
  },
  {
    url: "https://x.com/trq212/status/2024574133011673516",
    title: "Lessons from Building Claude Code: Prompt Caching Is Everything",
    description:
      "Long running agentic products like Claude Code are made feasible by prompt caching which allows us to reuse computation from previous roundtrips and significantly decrease latency and cost. At Claude Code, the entire harness is built around prompt caching — a high cache hit rate decreases costs and enables more generous rate limits.",
    image:
      "https://pbs.twimg.com/media/HBixJgAbsAAM61V?format=jpg&name=4096x4096",
    author: {
      name: "Thariq",
      image:
        "https://pbs.twimg.com/profile_images/1976939058741039104/r3GgzqRh_400x400.jpg",
    },
    date: "2026-03-06",
  },
];

export const links: LearnLink[] = [
  {
    url: "https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf",
    title: "The Complete Guide to Building Skills for Claude",
    description:
      "Official Anthropic guide covering everything you need to know about building skills for Claude Code — from getting started to advanced patterns and distribution.",
    source: "Anthropic",
  },
];
