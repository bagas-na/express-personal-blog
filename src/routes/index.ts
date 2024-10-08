import express from "express";
import marked from "marked";
import fs from "node:fs/promises";
import path from "path";
import sanitize from "sanitize-html";

const router = express.Router();

/* GET root page. */
const ARTICLE_FOLDER = "../../public/articles/";
const FILENAME = "index.md";
const TITLE = "Welcome to My Personal Blog";
const SUBTITLE = "Unbelievable shenanigans awaits!";

router.get("/", async function (req, res, next) {
  const mdFilePath = path.join(__dirname, ARTICLE_FOLDER, FILENAME);

  try {
    const data = await fs.readFile(mdFilePath, "utf8");
    const rawHtml = await marked.parse(data);
    const html = sanitize(rawHtml);
    res.render("index", { title: TITLE, subtitle: SUBTITLE, text: html });
  } catch (e) {
    res.status(500).send(`Error reading markdown from ${mdFilePath}`);
  }
});

export default router;
