let chatHistory = [];

export default async function handler(req, res) {

  try {

    const message = req.body.message;

    // ajoute message user
    chatHistory.push({
      role: "user",
      content: message
    });

    // limite mémoire (évite explosion)
    if (chatHistory.length > 10) {
      chatHistory.shift();
    }

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
                "Tu es un assistant intelligent. Tu te souviens du contexte précédent de la conversation."
            },

            ...chatHistory

          ],

          max_tokens: 300,
          temperature: 0.7

        })
      }
    );

    const data = await response.json();

    let reply = "";

    if (data?.choices?.[0]?.message?.content) {
      reply = data.choices[0].message.content;
    }

    else {
      reply = "Erreur ou réponse vide";
    }

    // ajoute réponse IA à la mémoire
    chatHistory.push({
      role: "assistant",
      content: reply
    });

    res.status(200).json({ reply });

  } catch (error) {

    res.status(500).json({
      reply: "Erreur serveur"
    });

  }
}
