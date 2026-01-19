import FirecrawlApp from "firecrawl";

const apiKey = "fc-6c7143609c0643779194826d72797b6e";
const firecrawl = new FirecrawlApp({ apiKey });

async function verifyFix() {
  console.log("Verifying mapping logic with real API call...");
  try {
    // Basic search, no scrape options initially to maximize hit chance
    const results = await firecrawl.search("artificial intelligence", {
      limit: 1,
      scrapeOptions: {
        formats: ["markdown"],
      },
    });

    console.log(
      "Raw Response Data Length:",
      results.data ? results.data.length : "undefined",
    );

    if (!results.data || results.data.length === 0) {
      console.log("Full Response:", JSON.stringify(results, null, 2));
      return;
    }

    const item = results.data[0];
    const metadata = item.metadata || {}; // This is the key fix

    const job = {
      title: metadata.title || "Untitled",
      url: metadata.url || metadata.sourceURL || "",
    };

    console.log("Mapped Item:", job);

    if (job.title !== "Untitled") {
      console.log("SUCCESS: Mapped correctly via metadata.");
    } else {
      console.log(
        "WARNING: Title is Untitled. Check if metadata is populated.",
      );
      console.log("Item keys:", Object.keys(item));
      console.log("Metadata keys:", Object.keys(metadata));
    }
  } catch (error) {
    console.error("CRASH:", error);
  }
}

verifyFix();
