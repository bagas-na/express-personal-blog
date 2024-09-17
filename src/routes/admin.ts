import express from "express";
import matter from "gray-matter";
import marked from "marked";
import fs from "node:fs/promises";
import path from "path";
import sanitize from "sanitize-html";
import { authMiddleware } from "../utils/auth";

const router = express.Router();
const ARTICLE_FOLDER = "../../public/articles/";

const TITLE = "Blog Entries";

router.use(authMiddleware);

router.get("/", async function (req, res, next) {
  const dateTimeFormat = new Intl.DateTimeFormat("en-UK", {
    dateStyle: "long",
    timeZone: "UTC",
  });
  const mdPath = path.join(__dirname, ARTICLE_FOLDER);

  try {
    // Read all markdown files in the articles folder, excluding index.md
    let fileNames = await fs.readdir(mdPath);
    fileNames = fileNames.filter((name) => name !== "index.md");

    // Parse their front matter
    let frontMatters: Array<{ [key: string]: string }> = await Promise.all(
      fileNames.map(async (name) => {
        const filePath = path.join(mdPath, name);
        const fileData = await fs.readFile(filePath, "utf8");

        // Get articleId from the name of the article md file, without the extension (.md)
        const articleId = name.split(".").slice(0, -1).join();

        return { ...matter(fileData).data, id: articleId };
      })
    );

    // Sort by publishDateTime in ascending order (earliest to latest)
    frontMatters.sort((a, b) => {
      const aDate = Date.parse(a.publishDateTime);
      const bDate = Date.parse(b.publishDateTime);
      return aDate - bDate;
    });

    // Format the date to dd-MMMM-yyyy
    frontMatters = frontMatters.map((front) => {
      front.publishDateTime = dateTimeFormat.format(Date.parse(front.publishDateTime));
      return front;
    });

    res.render("admin", { title, posts: frontMatters });
  } catch (e) {
    res.status(500).send(`Error reading files from ${mdPath}`);
  }
});

router.get("/edit/:articleId", (req, res) => {
  res.status(400).send("Page unavailable");
});

router.get("/article/new", (req, res) => {
  res.status(400).send("Page unavailable");
});

router.delete("/article/:articleId", async (req, res) => {
  const articleId = JSON.parse(req.body.articleId);
  console.log(`Deleting article ${articleId}`);

  const mdFilePath = path.join(__dirname, ARTICLE_FOLDER, articleId + ".md");

  try {
    await fs.unlink(mdFilePath);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: true, articleId }));
  } catch (e) {
    res.status(500).send(`Error deleting article with id=${articleId}`);
  }
});

export default router;
