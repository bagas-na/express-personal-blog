async function addArticle(e) {
  e.preventDefault();
  const response = await fetch("/admin/article/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ articleId: articleId })
  })
  location.reload();

  console.log(response)

  return;
}