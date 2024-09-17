import express from "express";
import matter from "gray-matter";
import marked from "marked";
import fs from "node:fs/promises";
import path from "path";
import sanitize from "sanitize-html";
import { authMiddleware } from "../utils/auth";
import deleteArticleRouter from "./admin/deleteArticle";
import editArticleRouter from "./admin/editArticle";
import newArticleRouter from "./admin/newArticle";

const router = express.Router();
const ARTICLE_FOLDER = "../../public/articles/";

const TITLE = "Blog Entries";

// Basic auth middleware
router.use(authMiddleware);

router.post("/article/new", newArticleRouter); // Article content in post body, id chosen on the server
router.put("/article/:articleId", editArticleRouter); // Edited article content in post body, id chosen from path params
router.delete("/article/delete", deleteArticleRouter); // Chosen Id to be deleted chosen in the delete body

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

router.get("/edit/:articleId", (req, res) => {
  res.render("editArticle", { title: "Edit Article" });
});

router.get("/new", (req, res) => {
  res.render("newArticle", { title: "New Article" });
});

export default router;
