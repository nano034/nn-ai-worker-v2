export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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
      console.log("OpenAI raw response:", data);

      // 安全にテキストを取り出す
      let aiReply = "⚠️ AI応答が取得できませんでした";
      if (data.output && data.output[0] && data.output[0].content) {
        aiReply = data.output[0].content[0].text;
      } else if (data.choices && data.choices[0].message) {
        aiReply = data.choices[0].message.content;
      }

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
