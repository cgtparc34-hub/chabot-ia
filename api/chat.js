export default async function handler(req, res) {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({ reply: "Message vide" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: "Tu es un assistant utile et clair." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    // 🔥 AJOUT IMPORTANT : gestion des erreurs OpenAI
    if (!response.ok) {
      console.log(data);
      return res.status(500).json({
        reply: "Erreur OpenAI: " + (data.error?.message || "inconnue")
      });
    }

    return res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      reply: "Erreur serveur"
    });
  }
}
