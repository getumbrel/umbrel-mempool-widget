import { serve } from "bun";

const UPSTREAM_API = process.env.MEMPOOL_API_URL;

async function fetchFees() {
  try {
    const response = await fetch(UPSTREAM_API);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    return {
      economyFee: data.economyFee || '-',
      hourFee: data.hourFee || '-',
      halfHourFee: data.halfHourFee || '-',
      fastestFee: data.fastestFee || '-'
    };
  } catch (error) {
    console.error("Error fetching fees:", error);
    return {
      economyFee: '-',
      hourFee: '-',
      halfHourFee: '-',
      fastestFee: '-'
    };
  }
}

function formatResponse(fees) {
  return {
    type: "four-stats",
    refresh: "5s",
    link: "",
    items: [
      {
        title: "No priority",
        text: fees.economyFee,
        subtext: "sat/vB"
      },
      {
        title: "Low priority",
        text: fees.hourFee,
        subtext: "sat/vB"
      },
      {
        title: "Medium priority",
        text: fees.halfHourFee,
        subtext: "sat/vB"
      },
      {
        title: "High priority",
        text: fees.fastestFee,
        subtext: "sat/vB"
      }
    ]
  };
}

console.log("Running Mempool Widget API server...");

serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/widgets/fees") {
      const fees = await fetchFees();
      const formattedResponse = formatResponse(fees);
      return new Response(JSON.stringify(formattedResponse), {
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response("Not Found", { status: 404 });
  }
});