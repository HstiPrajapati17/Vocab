import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ContentDataModel from "../model/contentData.model.js";

const backendDir = path.dirname(fileURLToPath(import.meta.url));
const seedKeys = [
  "achievements", "levelThresholds", "homeFeatures", "homeSteps", "homeStats", "quests", "shopItems",
  "leagues", "blogPosts", "blogFilters", "featuredPost", "alphabets", "teamMembers",
  "aboutFeatures", "aboutStats", "timeline", "insightSkills", "insightAchievements",
  "lessonMeta", "blogHeroStats",
];

export async function seedFrontendContent() {
  try {
    const legacyData = JSON.parse(await readFile(path.resolve(backendDir, "../../db.json"), "utf8"));
    let inserted = 0;
    for (const key of seedKeys) {
      const items = legacyData[key];
      if (items == null || (Array.isArray(items) && items.length === 0)) continue;
      const result = await ContentDataModel.updateOne(
        { key },
        { $setOnInsert: { key, items } },
        { upsert: true },
      );
      if (result.upsertedCount) inserted += 1;
    }
    // Existing installations already have this content group. Refresh only
    // the placeholder-length articles so expanded seeded blog posts reach them
    // without overwriting longer content edited by an administrator.
    const blogContent = await ContentDataModel.findOne({ key: "blogPosts" });
    if (blogContent && Array.isArray(blogContent.items)) {
      const seededById = new Map((legacyData.blogPosts || []).map((post) => [String(post.id), post]));
      let changed = false;
      blogContent.items = blogContent.items.map((post) => {
        const expanded = seededById.get(String(post.id));
        if (expanded?.content && String(post.content || "").trim().length < 250) {
          changed = true;
          return {
            ...(typeof post.toObject === "function" ? post.toObject() : post),
            content: expanded.content,
          };
        }
        return post;
      });
      if (changed) await blogContent.save();
    }
    if (inserted) console.log(`Seeded ${inserted} frontend content groups into MongoDB.`);
  } catch (error) {
    console.error("Could not seed frontend content:", error.message);
  }
}
