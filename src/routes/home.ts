import express from "express";
import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "path";

const router = express.Router();

/* GET /home page. */
const ARTICLE_FOLDER = "../../public/articles/";

const title = "Blog Entries";

router.get("/", async function (req, res, next) {
  const dateTimeFormat = new Intl.DateTimeFormat("en-UK", {
    dateStyle: "long",
    timeZone: "UTC",
  });
  const mdPath = path.join(__dirname, ARTICLE_FOLDER);

  console.log(`path=${req.baseUrl}${req.url}`);

  // Read all markdown files in the articles folder, excluding index.md
  let fileNames = await fs.readdir(mdPath);
  fileNames = fileNames.filter((name) => name !== "index.md");

  try {
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
      front.publishDateTime = dateTimeFormat.format(
        Date.parse(front.publishDateTime)
      );
      return front;
    });

    res.render("home", {
      title,
      posts: frontMatters,
      referrer: `${req.baseUrl}${req.path}`,
    });
  } catch (e) {
    res.status(500).send(`Error reading files from ${mdPath}`);
  }
});

export default router;
