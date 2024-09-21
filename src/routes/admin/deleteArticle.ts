import express from 'express';
import fs from "node:fs/promises";
import path from 'path';

const ARTICLE_FOLDER = "../../../public/articles/";

const deleteArticle = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const articleId = JSON.parse(req.body.articleId);
  // console.log(`Deleting article ${articleId}`);

  const mdFilePath = path.join(__dirname, ARTICLE_FOLDER, articleId + ".md");

  try {
    await fs.unlink(mdFilePath);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: true, articleId }));
  } catch (e) {
    res.status(500).send(`Error deleting article with id=${articleId}`);
  }

  return
};

export default deleteArticle;