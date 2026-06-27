export default {
  async fetch(request, env) {
    const url = new URL(request.url);   // ←これが必要

    // CORSプリフライト対応
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method === "POST" && url.pathname === "/api/chat") {
      const { message } = await request.json();

      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          input: message,
        }),
      });

      const data = await response.json();
      const aiReply = data.output[0].content[0].text;

      return new Response(JSON.stringify({ reply: aiReply }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response("NN AI Worker is running", {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  },
};
