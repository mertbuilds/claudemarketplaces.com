# GitHub Marketplace Crawler

This project includes an automated crawler that discovers Claude Code plugin marketplaces from GitHub hourly.

## How It Works

The crawler:
1. **Searches GitHub** for repositories containing `.claude-plugin/marketplace.json` files
2. **Fetches** each marketplace.json file from discovered repositories
3. **Validates** each marketplace file against the Claude marketplace schema
4. **Checks** that repositories are publicly accessible and plugins have required fields
5. **Fetches GitHub stars** for all validated repositories to track popularity
6. **Merges** discovered marketplaces with existing ones in `lib/data/marketplaces.json`
7. **Runs hourly** via Vercel Cron

## Setup Instructions

### 1. Create a GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a descriptive name: "Claude Marketplaces Crawler"
4. Select scopes:
   - `public_repo` (for accessing public repositories)
5. Click "Generate token" and copy it

### 2. Set Environment Variables

#### Local Development

Create a `.env.local` file:

```bash
# Required: GitHub token for API access
GITHUB_TOKEN=ghp_your_actual_github_token_here

# Optional: Secret for protecting manual endpoint triggers
# Generate with: openssl rand -base64 32
# Note: Not needed for Vercel Cron (automatically authenticated)
CRON_SECRET=your_random_secret_here

# Optional: Vercel Blob token (auto-provided by Vercel in production)
# BLOB_READ_WRITE_TOKEN=vercel_blob_token_here
```

#### Production (Vercel)

1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add the following variables:
   - `GITHUB_TOKEN`: Your GitHub Personal Access Token (mark as **secret**) - **Required**
   - `CRON_SECRET`: A random secret string (mark as **secret**) - **Optional** (only for manual triggers)
   - `BLOB_READ_WRITE_TOKEN`: Auto-provided by Vercel Blob (if using) - **Optional**

### 3. Deploy to Vercel

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy
vercel

# Or connect via GitHub and push to main branch
git push origin main
```

The cron job will automatically start running hourly once deployed.

## Manual Trigger

You can manually trigger the crawler by making a GET or POST request:

```bash
# Without authentication (if endpoint is publicly accessible)
curl -X GET https://your-domain.vercel.app/api/crawl

# Or with authentication (recommended for security)
curl -X GET https://your-domain.vercel.app/api/crawl \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# POST method also works
curl -X POST https://your-domain.vercel.app/api/crawl \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Note:** Vercel Cron Jobs are automatically authenticated by Vercel's infrastructure and don't need the Authorization header. The CRON_SECRET is optional and only used for manual triggers to prevent unauthorized access.

## API Response

The crawler endpoint returns JSON with detailed statistics:

```json
{
  "success": true,
  "discovered": 15,
  "fetched": 12,
  "validated": 10,
  "added": 3,
  "updated": 7,
  "total": 20,
  "failed": 2,
  "errors": [...],
  "duration": 5234,
  "timestamp": "2025-10-10T12:00:00.000Z"
}
```

## Architecture

```
┌─────────────────────────────────────────┐
│      Vercel Cron (Runs Hourly)          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      /api/crawl (API Route)              │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────────┐
        │                 │
        ▼                 ▼
┌────────────┐      ┌────────────┐
│  GitHub    │      │ Validator  │
│  Search    │      │  Service   │
└────────────┘      └────────────┘
        │                 │
        └────────┬────────┘
                 │
                 ▼
        ┌────────────────┐
        │  GitHub Stars  │
        │    Fetcher     │
        └────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │    Storage     │
        │    Service     │
        └────────────────┘
                 │
          ┌──────┴──────┐
          │             │
          ▼             ▼
  ┌─────────────┐ ┌─────────────┐
  │ Vercel Blob │ │ Local JSON  │
  │  (Runtime)  │ │  (Builds)   │
  └─────────────┘ └─────────────┘
```

## Files Structure

```
lib/
├── crawler/
│   ├── github-search.ts    # GitHub API integration & repo access
│   ├── github-stars.ts     # GitHub stars fetcher (batch & individual)
│   ├── validator.ts        # Marketplace validation logic
│   └── storage.ts          # Data persistence (Blob + JSON)
├── schemas/
│   └── marketplace.schema.ts  # Zod validation schemas
└── types.ts                # Updated with metadata fields

app/api/crawl/
└── route.ts                # Main crawler endpoint (GET & POST)

vercel.json                 # Cron configuration (runs hourly)
```

## Validation Rules

The crawler validates:

1. **JSON Structure**: Valid JSON format
2. **Schema Compliance**: Matches Claude marketplace.json schema
   - Required: `name`, `owner`, `plugins` array
   - Each plugin must have: `id`, `name`, `source`
3. **Repository Access**: Repo is publicly accessible on GitHub
4. **Plugin Fields**: All plugins have required fields

## GitHub Stars Integration

The crawler automatically fetches GitHub star counts for all validated marketplaces:

- **Batch Processing**: Uses `batchFetchStars()` to fetch stars for multiple repos concurrently
- **Graceful Failures**: Individual star fetch failures don't block the entire crawl process
- **Timestamp Tracking**: Records when stars were last fetched via `starsFetchedAt`
- **Incremental Updates**: Updates existing marketplace star counts on each crawl
- **Popularity Metric**: Star counts help users identify popular and well-maintained plugins

## Metadata Tracking

Each discovered marketplace includes:

```typescript
{
  repo: string;           // "owner/repo"
  description: string;    // From marketplace or repo
  pluginCount: number;    // Number of plugins
  categories: string[];   // Extracted from plugins
  discoveredAt?: string;  // ISO timestamp of first discovery
  lastUpdated?: string;   // ISO timestamp of last check
  source?: 'manual' | 'auto';  // Discovery source
  stars?: number;         // GitHub star count
  starsFetchedAt?: string;  // ISO timestamp of last stars fetch
}
```

## Rate Limits

- **GitHub Code Search API**: 30 requests/minute
- **GitHub REST API**: 5,000 requests/hour (authenticated)

The crawler is designed to stay well under these limits with hourly runs. The batch star fetching uses `Promise.allSettled` to handle failures gracefully without blocking the entire crawl.

## Troubleshooting

### Crawler not running

Check Vercel logs:
```bash
vercel logs --follow
```

### Missing GITHUB_TOKEN error

Ensure the environment variable is set in Vercel project settings.

### Validation failures

Check the API response `errors` array for specific validation issues.

### Build failing locally

Set a dummy token for builds:
```bash
GITHUB_TOKEN=dummy bun run build
```

## Future Enhancements

- [ ] Search functionality for discovered marketplaces
- [ ] Admin dashboard for manual approval
- [ ] Webhook notifications for new discoveries
- [x] Basic popularity tracking via GitHub stars
- [ ] Advanced plugin health scoring (last commit, issues, etc.)
- [ ] Duplicate marketplace detection
- [ ] Incremental crawling (only check updated repos)
- [ ] Star trend tracking (growth over time)
