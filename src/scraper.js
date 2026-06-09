export async function scrapeUrl(url) {
  try {
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url: url,
        formats: ["markdown"],
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error("Firecrawl could not access this URL");
    }

    const text = result.data?.markdown || "";

    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 20 && line.length < 300)
      .filter((line) => !line.startsWith("#"))
      .filter((line) => !line.startsWith("!"))
      .filter((line) => !line.includes("http"))
      .slice(0, 10);

    return {
      success: true,
      messages: lines,
    };
  } catch (error) {
    return {
      success: false,
      error:
        "Could not fetch content from this URL. Please use manual paste instead.",
      messages: [],
    };
  }
}