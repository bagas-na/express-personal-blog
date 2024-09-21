import express from "express";
import matter from "gray-matter";
import marked from "marked";
import fs from "node:fs/promises";
import path from "path";
import sanitize from "sanitize-html";

const router = express.Router();

const ARTICLE_FOLDER = "../../public/articles/";

router.get("/:articleId", async function (req, res, next) {
  const fileName = req.params.articleId;

  const dateTimeFormat = new Intl.DateTimeFormat("en-UK", {
    dateStyle: "long",
    timeStyle: "short",
    hourCycle: "h23",
    timeZone: "UTC",
  });
  const mdFilePath = path.join(__dirname, ARTICLE_FOLDER, fileName + ".md");

  try {
    const data = await fs.readFile(mdFilePath, "utf8");
    const { data: frontMatter, content: articleContent } = matter(data);

    const title = frontMatter.title;
    const publishDateTime = dateTimeFormat.format(Date.parse(frontMatter.publishDateTime));

    const rawHtml = await marked.parse(articleContent);
    const sanitizedHtml = sanitize(rawHtml);

    res.render("article", { title, subtitle: publishDateTime, text: sanitizedHtml });
  } catch (e) {
    res.status(500).send(`Error reading markdown from ${mdFilePath}`);
  }
});

export default router;
