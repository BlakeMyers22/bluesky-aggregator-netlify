console.log("BlueSky Aggregator is running!");

// We'll load data from our Netlify function fetchBlueskyData on page load.
async function loadPositivePosts() {
  try {
    const response = await fetch("/.netlify/functions/fetchBlueskyData");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    renderPosts(data);
  } catch (error) {
    console.error("Error loading posts:", error);
    // Optionally display an error message to the user
  }
}

function renderPosts(posts) {
  const container = document.getElementById("news-list");
  container.innerHTML = "";

  posts.forEach(post => {
    const item = document.createElement("div");
    item.className = "news-item";
    item.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.summary}</p>
      <a href="${post.url}" target="_blank">Read more</a>
    `;
    container.appendChild(item);
  });
}

window.addEventListener("DOMContentLoaded", loadPositivePosts);

