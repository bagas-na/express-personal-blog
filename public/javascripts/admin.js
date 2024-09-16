const deleteButtons = document.querySelectorAll('button[data-id]')

deleteButtons.forEach(button =>
  button.addEventListener('click', (e) => deleteArticle(e)));

async function deleteArticle(e) {
  e.preventDefault();
  const articleId = e.target.dataset.id;
  let response = "";

  if (confirm(`Do you really want to delete article ${articleId}?`)) {
    response = await fetch("/admin/article/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ articleId: articleId })
    })
    location.reload();
  } else {
    response = `Cancel delete article ${articleId}`;
  }

  console.log(response)

  return;
}