import express from "express";
import matter from "gray-matter";
import marked from "marked";
import fs from "node:fs/promises";
import path from "path";
import sanitize from "sanitize-html";

const router = express.Router();

const title = "Log In";
const subtitle = "Welcome back! Let's take you to your account.";

router.get("/", async function (req, res, next) {
  try {
    res.render("admin", { title, subtitle });
  } catch (e) {
    res.status(500).send(`Error reading displaying admin page}`);
  }
});

router.post("/", async function (req, res, next) {
  try {
    res.render("admin", { title: "Login Successful", subtitle: "Welcome back!" });
  } catch (e) {
    res.status(500).send(`Error reading displaying admin page}`);
  }
});

export default router;
