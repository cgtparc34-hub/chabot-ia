export default async function handler(req, res) {

  try {

    const message = req.body.message;

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          model: "Qwen/Qwen2.5-72B-Instruct",

          messages: [
            {
              role: "system",
              content:
                "Tu es un assistant. Quand tu proposes des choix, termine toujours par: CHOIX: option1 | option2 | option3 (max 3 options)"
            },
            {
              role: "user",
              content: message
            }
          ],

          max_tokens: 300,
          temperature: 0.7

        })
      }
    );

    const data = await response.json();

    let reply = "Erreur IA";

    if (data?.choices?.[0]?.message?.content) {
      reply = data.choices[0].message.content;
    }

    res.status(200).json({ reply });

  } catch (error) {

    res.status(500).json({
      reply: "Erreur serveur"
    });

  }
}
