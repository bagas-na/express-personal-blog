import express from "express";
import matter from "gray-matter";
import marked from "marked";
import fs from "node:fs/promises";
import path from "path";
import sanitize from "sanitize-html";

const router = express.Router();

const title = "Log In";
const subtitle = "Welcome back! Let's take you to your account.";

router.get("/login", async function (req, res, next) {
  let referrer: unknown = req.query.referrer;
  
  if (typeof referrer !== "string" && typeof referrer !== "number") {
    referrer = "/"; // Default to home page if invalid referrer
  }

  try {
    res.render("login", { title, subtitle, referrer });
  } catch (e) {
    res.status(500).send(`Error reading displaying login page}`);
  }
});

router.post("/login", async function (req, res, next) {
  let referrer: unknown = req.query.referrer;
  
  if (typeof referrer !== "string" && typeof referrer !== "number") {
    referrer = "/"; // Default to home page if invalid referrer
  }

  try {
    res.render("login", { title: "Login Successful", subtitle: "Welcome back!", referrer });
  } catch (e) {
    res.status(500).send(`Error reading displaying login page}`);
  }
});

export default router;
