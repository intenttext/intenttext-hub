import connectToDatabase from "./mongodb";
import type { HubTemplate } from "../types/hub";

export async function getTemplates(options: {
  category?: string;
  search?: string;
  limit?: number;
  skip?: number;
}): Promise<HubTemplate[]> {
  const { db } = await connectToDatabase();
  const collection = db.collection<HubTemplate>("templates");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = { status: "approved" };

  if (options.category && options.category !== "all") {
    filter.category = options.category;
  }

  if (options.search) {
    filter.$or = [
      { name: { $regex: options.search, $options: "i" } },
      { description: { $regex: options.search, $options: "i" } },
      { tags: { $in: [new RegExp(options.search, "i")] } },
    ];
  }

  return collection
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(options.limit ?? 50)
    .skip(options.skip ?? 0)
    .toArray();
}

export async function getTemplateCount(options: {
  category?: string;
  search?: string;
}): Promise<number> {
  const { db } = await connectToDatabase();
  const collection = db.collection<HubTemplate>("templates");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = { status: "approved" };

  if (options.category && options.category !== "all") {
    filter.category = options.category;
  }

  if (options.search) {
    filter.$or = [
      { name: { $regex: options.search, $options: "i" } },
      { description: { $regex: options.search, $options: "i" } },
      { tags: { $in: [new RegExp(options.search, "i")] } },
    ];
  }

  return collection.countDocuments(filter);
}

export async function getTemplateBySlug(
  slug: string
): Promise<HubTemplate | null> {
  const { db } = await connectToDatabase();
  const collection = db.collection<HubTemplate>("templates");

  await collection.updateOne({ slug }, { $inc: { views: 1 } });

  return collection.findOne({ slug, status: "approved" });
}

export async function incrementDownloads(slug: string): Promise<void> {
  const { db } = await connectToDatabase();
  await db
    .collection("templates")
    .updateOne({ slug }, { $inc: { downloads: 1 } });
}

export async function submitTemplate(
  template: Omit<
    HubTemplate,
    "_id" | "downloads" | "views" | "createdAt" | "updatedAt"
  >
): Promise<{ success: boolean; slug?: string; error?: string }> {
  const { db } = await connectToDatabase();
  const collection = db.collection<HubTemplate>("templates");

  const existing = await collection.findOne({ slug: template.slug });
  if (existing) {
    return {
      success: false,
      error: "A template with this name already exists.",
    };
  }

  const autoApprove = process.env.REQUIRE_APPROVAL !== "true";

  const doc: HubTemplate = {
    ...template,
    status: autoApprove ? "approved" : "pending",
    autoApproved: autoApprove,
    downloads: 0,
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await collection.insertOne(doc as any);
  return { success: true, slug: template.slug };
}

export async function getPendingTemplates(): Promise<HubTemplate[]> {
  const { db } = await connectToDatabase();
  return db
    .collection<HubTemplate>("templates")
    .find({ status: "pending" })
    .sort({ createdAt: 1 })
    .toArray();
}

export async function approveTemplate(
  slug: string,
  reviewedBy: string
): Promise<void> {
  const { db } = await connectToDatabase();
  await db.collection("templates").updateOne(
    { slug },
    {
      $set: {
        status: "approved",
        reviewedBy,
        updatedAt: new Date(),
      },
    }
  );
}

export async function rejectTemplate(
  slug: string,
  reviewedBy: string,
  reason: string
): Promise<void> {
  const { db } = await connectToDatabase();
  await db.collection("templates").updateOne(
    { slug },
    {
      $set: {
        status: "rejected",
        reviewedBy,
        rejectionReason: reason,
        updatedAt: new Date(),
      },
    }
  );
}
