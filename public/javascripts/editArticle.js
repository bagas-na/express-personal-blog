const form = document.getElementById('createArticleForm');
form.addEventListener('submit', function (event) {
  submitHandler(event, this);
});

async function submitHandler(e, form) {
  e.preventDefault();

  const formData = new FormData(form);
  const jsonData = Object.fromEntries(formData);

  const urlPath = location.pathname.split('/');
  const articleId = urlPath[urlPath.length - 1];

  try {
    const response = await fetch(`/admin/article/${articleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(jsonData)
    })

    console.log(response)

    if (response.ok) {
      window.location.href = "/admin"
    } else {
      const errorData = await response.json(); // Parse the error data (if applicable)
      alert(`Error: ${errorData.message || 'Something went wrong!'}`);
    }

    return;
  } catch (error) {
    alert('An unexpected error occurred. Please try again later.');
  }
}
