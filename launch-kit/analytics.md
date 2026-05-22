# PostHog Analytics

## Create A PostHog Account

1. Go to https://posthog.com/ and create a free PostHog Cloud account.
2. Create a new project for Sofa2Slugger.
3. Choose the region you want to use. If most users are in Europe, choose EU hosting.
4. Open Project settings and copy the project API key.
5. Copy the matching ingestion host:
   - US: `https://us.i.posthog.com`
   - EU: `https://eu.i.posthog.com`

## Where To Place API Keys

For local development, put these variables in the repo-root `.env.local` file:

```text
sofa2slugger/.env.local
```

The web app also loads environment variables from the repo root because this is a workspace project. In production, set the same variables in the hosting environment.

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_key
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

Use the US host instead if the PostHog project is in the US region.

The EU host is:

```env
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

These keys are public browser-side analytics keys. Do not put a personal API key in `NEXT_PUBLIC_` variables.

## Development Debug Check

In development only, the app logs whether the browser bundle can see:

- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

It never prints the actual key value.

To send a manual test event, start the local app and visit:

```text
http://127.0.0.1:3000/?debugPostHog=1
```

That sends an event named `PostHog debug test`.

## What Is Tracked

The app tracks:

- `$pageview`
- `Start Round 1 clicked`
- `Audio play started`
- `Unlock full course clicked`
- `FAQ opened`
- `Progress page visited`

Session recordings are enabled with privacy-minded defaults:

- Autocapture is off.
- Pageviews are sent manually.
- Person profiles are only created for identified users.
- Do-not-track is respected.
- IP capture is disabled.
- Input fields are masked in recordings.
- Request and response headers/bodies are not recorded.
- Query strings are stripped from recorded URLs.

## How To View Recordings

1. Open PostHog.
2. Go to Replay or Session replay.
3. Filter by recent recordings.
4. Open a recording and watch where the user lands, clicks, hesitates, or exits.
5. Use event filters such as `Start Round 1 clicked`, `Audio play started`, and `Unlock full course clicked` to find relevant sessions.

Recordings usually need a short real visit before they appear. Visit the site, click around for at least 10 seconds, and then check PostHog.

## How To Identify Drop-Off Points

Use a simple funnel first:

1. `$pageview` where path is `/`
2. `Start Round 1 clicked`
3. `$pageview` where path is `/session/1`
4. `Audio play started`
5. `Unlock full course clicked`

Then inspect recordings for users who dropped between steps:

- Homepage view but no Round 1 click: the hero or promise may not be clear enough.
- Round 1 click but no audio play: the session page or player may be confusing.
- Audio play but no unlock click: the course may need clearer value, trust, or next-step copy.
- Unlock click but no completed checkout: review payment-page handoff, price hesitation, or checkout friction.

Keep the first review practical. Look for repeated confusion, not one-off odd behavior.
