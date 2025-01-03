// Netlify Function: fetchBlueskyData
// This uses the TILED_API_KEY from Netlify's environment variables.
// We'll call Tiled's /api/v1/metadata/ or relevant endpoint to retrieve data.

const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  try {
    // 1. Get the Tiled API key from environment variables
    const TILED_API_KEY = process.env.TILED_API_KEY;
    if (!TILED_API_KEY) {
      throw new Error("Missing TILED_API_KEY in environment variables!");
    }

    // 2. Define your Tiled server endpoint
    // For example, to get top-level metadata
    // or some specific data route that has the "posts" data.
    const TILED_URL = "http://localhost:8000/api/v1/metadata/";

    // 3. Make the request to Tiled with the API key
    // The recommended approach is to pass `Authorization: Apikey <key>`
    const response = await fetch(TILED_URL, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Apikey ${TILED_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Tiled fetch failed: ${response.status} ${response.statusText}`);
    }

    const rawData = await response.json();
    // rawData structure depends on Tiled’s data. This is hypothetical.

    // 4. Filter or transform data to match our positivity / uplifting criteria.
    // We'll assume rawData might have items with fields like 'title', 'tags', 'url'.
    // This is just an example. Adapt as needed.
    let items = rawData.items || []; 
    // If your Tiled data is nested differently, you'll have to adjust.

    // Filter for topics: technology, science, geopolitics, historical, positivity
    // We do a simple keyword search. You might do advanced logic or an AI approach.
    const allowedKeywords = ["technology", "tech", "science", "research", "geopolitics", "history", "peace", "breakthrough", "innovation", "positive"];
    
    items = items.filter(item => {
      const title = (item.title || "").toLowerCase();
      return allowedKeywords.some(keyword => title.includes(keyword));
    });

    // Transform data so the front end can easily display it
    const finalData = items.map(item => ({
      title: item.title || "Untitled",
      summary: item.description || "No summary available",
      url: item.url || "#"
    }));

    // Return the curated data
    return {
      statusCode: 200,
      body: JSON.stringify(finalData)
    };
  } 
  catch (error) {
    console.error("Error in fetchBlueskyData function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

