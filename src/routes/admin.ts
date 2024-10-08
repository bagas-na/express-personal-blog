import express from "express";
import matter from "gray-matter";
import { marked } from "marked";
import fs from "node:fs/promises";
import path from "path";
import sanitize from "sanitize-html";
import { authMiddleware } from "../utils/auth";
import newArticleHandler from "./admin/createArticle";
import deleteArticleHandler from "./admin/deleteArticle";
import editArticleHandler from "./admin/editArticle";

const router = express.Router();
const ARTICLE_FOLDER = "../../public/articles/";

const TITLE = "Blog Entries";

// Basic auth middleware
router.use(authMiddleware);

router.post("/article/new", ...newArticleHandler);
router.put("/article/:articleId", editArticleHandler);
router.delete("/article/:articleId", deleteArticleHandler);

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

    res.render("admin", { title: TITLE, posts: frontMatters });
  } catch (e) {
    res.status(500).send(`Error reading files from ${mdPath}`);
  }
});

router.get("/edit/:articleId", async (req, res) => {
  const fileName = req.params.articleId;

  const mdFilePath = path.join(__dirname, ARTICLE_FOLDER, fileName + ".md");

  try {
    const data = await fs.readFile(mdFilePath, "utf8");
    const { data: frontMatter, content: articleContent } = matter(data);

    const currentArticleTitle = frontMatter.title;
    const currentArticleDateTime = new Date(Date.parse(frontMatter.publishDateTime)).toISOString().slice(0, -8);
    
    const rawHtml = await marked.parse(articleContent);
    const currentArticleText = sanitize(rawHtml);
    // console.log({currentArticleDateTime, currentArticleTitle, currentArticleText})

    res.render("editArticle", { title: "Edit Article", currentArticleTitle, currentArticleDateTime, currentArticleText });
  } catch (e) {
    res.status(500).send(`Error reading markdown from ${mdFilePath}`);
  }
});




router.get("/new", (req, res) => {
  res.render("createArticle", { title: "New Article" });
});

export default router;
