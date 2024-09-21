import bodyParser from "body-parser";
import express from "express";
import { body, validationResult } from "express-validator";
import marked from "marked";
import fs from "node:fs/promises";
import path from "path";
import sanitize from "sanitize-html";

const ARTICLE_FOLDER = "../../../public/articles/";

type article = {
  title: string;
  dateTime: string;
  content: string;
};

const editArticle = [
  body("title").isString().notEmpty().withMessage("Article title must be a non-empty string"),
  body("dateTime").isString().notEmpty(),
  body("content").isString().notEmpty(),
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Parse incoming data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const formData: article = req.body;
    const articleId = req.params.articleId;

    const title = formData.title.trim();
    const dateTime = new Date(formData.dateTime.trim()).toISOString();
    const content = sanitize(formData.content.trim());

    let data = "---\n";
    data += `title: ${title}\n`;
    data += `publishDateTime: ${dateTime}\n`;
    data += "---\n";
    data += content;


    try {
      const filePath = path.join(__dirname, ARTICLE_FOLDER, articleId + ".md");

      // Save file to disk
      await fs.writeFile(filePath, data);

      res.status(201).json({ message: "Article created successfully", article: req.body });
      return;
    } catch (err) {
      res.status(500).send(`Error creating new article`);
      return;
    }
  },
];

export default editArticle;
