export default async function handler(req, res) {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({ reply: "Message vide" });
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
          model: "microsoft/DialoGPT-medium",
          messages: [
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();

    console.log(data);

    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.generated_text ||
      data?.error ||
      "Pas de réponse IA";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ reply: "Erreur serveur" });
  }
}
