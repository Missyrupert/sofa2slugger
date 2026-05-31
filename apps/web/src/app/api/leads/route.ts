import { NextResponse } from "next/server";
import {
  normalizeEmail,
  normalizeAttribution,
  normalizeLeadPage,
  normalizeLeadSource,
  saveLead,
} from "@/lib/leads";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const data = body as {
    email?: unknown;
    source?: unknown;
    page?: unknown;
    attribution?: Record<string, unknown>;
  };
  const email = normalizeEmail(data.email);

  if (!email) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  let result: Awaited<ReturnType<typeof saveLead>>;

  try {
    result = await saveLead({
      email,
      source: normalizeLeadSource(data.source),
      page: normalizeLeadPage(data.page),
      attribution: normalizeAttribution(data.attribution),
      createdAt: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") ?? undefined,
    });
  } catch {
    return NextResponse.json(
      { error: "Email could not be saved. Please try again.", mode: [] },
      { status: 502 }
    );
  }

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "Email could not be saved.", mode: result.mode },
      { status: result.mode === "not_configured" ? 503 : 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    mode: result.mode,
    message:
      Array.isArray(result.mode) && result.mode.includes("development_log")
        ? "Saved in local development mode. Production still needs Resend email notifications."
        : "Done. You are on the list.",
    warnings: result.warnings,
  });
}
