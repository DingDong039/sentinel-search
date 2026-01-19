import FirecrawlApp from "firecrawl";

const apiKey = "fc-6c7143609c0643779194826d72797b6e";
const firecrawl = new FirecrawlApp({ apiKey });

async function testSearch() {
  console.log("Testing Firecrawl Search...");
  try {
    const response = await firecrawl.search("bitcoin", {
      limit: 1,
      scrapeOptions: {
        formats: ["markdown"],
      },
    });

    console.log("--- RAW RESPONSE ---");
    console.log(JSON.stringify(response, null, 2));

    if (!response.data || response.data.length === 0) {
      console.error("ERROR: No data returned.");
      // If success is false, maybe success field exists
      if ("success" in response && response.success === false) {
        console.error("API Error Success=False");
      }
    } else {
      console.log("SUCCESS: Found " + response.data.length + " items.");
      console.log("First item:", response.data[0]);
    }
  } catch (error) {
    console.error("CRASH:", error);
  }
}

testSearch();
