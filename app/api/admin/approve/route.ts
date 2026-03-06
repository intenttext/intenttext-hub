import { NextRequest, NextResponse } from "next/server";
import {
  getPendingTemplates,
  approveTemplate,
  rejectTemplate,
} from "@/lib/templates";

function isAuthorized(request: NextRequest): boolean {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) return false;
  return token === adminToken;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const templates = await getPendingTemplates();
  return NextResponse.json(templates);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug, action, reason } = await request.json();

    if (!slug || !action) {
      return NextResponse.json(
        { error: "Missing slug or action" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      await approveTemplate(slug, "admin");
      return NextResponse.json({ success: true, action: "approved", slug });
    }

    if (action === "reject") {
      await rejectTemplate(slug, "admin", reason ?? "Does not meet quality standards.");
      return NextResponse.json({ success: true, action: "rejected", slug });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "Admin action failed" },
      { status: 500 }
    );
  }
}
