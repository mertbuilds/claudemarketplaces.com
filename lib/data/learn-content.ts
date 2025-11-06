import { Video } from "@/lib/types";

export const videos: Video[] = [
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
