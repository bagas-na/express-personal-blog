import express from 'express';
import fs from "node:fs/promises";
import path from 'path';

const ARTICLE_FOLDER = "../../../public/articles/";

const editArticle = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(501).send("Not implemented yet");
  return
};

export default editArticle;