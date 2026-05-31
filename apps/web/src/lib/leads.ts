type LeadSource = "homepage" | "round_1_complete";

export type LeadPayload = {
  email: string;
  source: LeadSource;
  page: string;
  attribution: Record<string, unknown>;
  createdAt: string;
  userAgent?: string;
};

type LeadDestination = "resend_email" | "webhook" | "development_log";

type SaveLeadResult = {
  ok: boolean;
  mode: LeadDestination[] | "not_configured";
  error?: string;
  warnings?: string[];
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const email = input.trim().toLowerCase();
  if (!EMAIL_REGEX.test(email)) return null;
  return email;
}

export function normalizeLeadSource(input: unknown): LeadSource {
  return input === "round_1_complete" ? "round_1_complete" : "homepage";
}

export function normalizeLeadPage(input: unknown): string {
  if (typeof input !== "string") return "unknown";
  const page = input.trim();
  if (!page.startsWith("/") || page.length > 200) return "unknown";
  return page;
}

export function normalizeAttribution(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};

  const source = input as Record<string, unknown>;
  const output: Record<string, unknown> = {};
  const allowed = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "initial_referrer",
  ];

  for (const key of allowed) {
    if (typeof source[key] === "string") {
      output[key] = source[key];
    }
  }

  return output;
}

export async function saveLead(payload: LeadPayload): Promise<SaveLeadResult> {
  const destinations: LeadDestination[] = [];
  const warnings: string[] = [];
  const resendConfigured = Boolean(
    process.env.RESEND_API_KEY && process.env.LEADS_NOTIFY_EMAIL
  );
  const webhookConfigured = Boolean(process.env.LEADS_WEBHOOK_URL);

  if (!resendConfigured && !webhookConfigured) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[Sofa2Slugger lead capture]", {
        ...payload,
        email: maskEmail(payload.email),
      });
      return { ok: true, mode: ["development_log"] };
    }

    return {
      ok: false,
      mode: "not_configured",
      error:
        "Email capture is not configured yet. Add RESEND_API_KEY and LEADS_NOTIFY_EMAIL.",
    };
  }

  if (resendConfigured) {
    const result = await sendLeadNotification(payload);
    if (result.ok) {
      destinations.push("resend_email");
    } else if (!webhookConfigured) {
      return {
        ok: false,
        mode: destinations,
        error: result.error,
      };
    } else {
      warnings.push(result.error ?? "Resend email notification failed.");
    }
  }

  if (webhookConfigured) {
    const result = await sendLeadWebhook(payload);
    if (result.ok) {
      destinations.push("webhook");
    } else if (!resendConfigured || destinations.length === 0) {
      return {
        ok: false,
        mode: destinations,
        error: result.error,
      };
    } else {
      warnings.push(result.error ?? "Optional lead webhook failed.");
    }
  }

  return { ok: destinations.length > 0, mode: destinations, warnings };
}

async function sendLeadNotification(
  payload: LeadPayload
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.LEADS_NOTIFY_EMAIL;

  if (!apiKey || !notifyEmail) {
    return { ok: false, error: "Resend is not configured." };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Sofa2Slugger <onboarding@resend.dev>",
      to: [notifyEmail],
      subject: "New Sofa2Slugger email signup",
      text: buildLeadEmailText(payload),
    }),
  });

  if (!response.ok) {
    console.error("[Sofa2Slugger lead capture] Resend failed", {
      status: response.status,
      source: payload.source,
      page: payload.page,
    });
    return {
      ok: false,
      error: "Email notification could not be sent. Please try again.",
    };
  }

  return { ok: true };
}

async function sendLeadWebhook(
  payload: LeadPayload
): Promise<{ ok: boolean; error?: string }> {
  const webhookUrl = process.env.LEADS_WEBHOOK_URL;
  if (!webhookUrl) return { ok: false, error: "Lead webhook is not configured." };

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (process.env.LEADS_WEBHOOK_SECRET) {
    headers.Authorization = `Bearer ${process.env.LEADS_WEBHOOK_SECRET}`;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error("[Sofa2Slugger lead capture] Webhook failed", {
      status: response.status,
      source: payload.source,
      page: payload.page,
    });
    return {
      ok: false,
      error: "Optional lead webhook could not save the email.",
    };
  }

  return { ok: true };
}

function buildLeadEmailText(payload: LeadPayload): string {
  const attribution = payload.attribution;

  return [
    "New Sofa2Slugger email signup",
    "",
    `email: ${payload.email}`,
    `source: ${payload.source}`,
    `page: ${payload.page}`,
    `createdAt: ${payload.createdAt}`,
    `utm_source: ${stringValue(attribution.utm_source)}`,
    `utm_medium: ${stringValue(attribution.utm_medium)}`,
    `utm_campaign: ${stringValue(attribution.utm_campaign)}`,
    `referrer: ${stringValue(attribution.initial_referrer)}`,
  ].join("\n");
}

function stringValue(value: unknown): string {
  return typeof value === "string" && value ? value : "(none)";
}

function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!name || !domain) return "[invalid]";
  return `${name.slice(0, 2)}***@${domain}`;
}
