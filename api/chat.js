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

          model: "meta-llama/Llama-3.1-8B-Instruct",

          messages: [
            {
              role: "system",
              content: "Tu es un assistant utile. Réponds toujours en français simplement."
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

    console.log("HF RESPONSE:", data);

    let reply = "Erreur ou réponse vide";

    if (data?.choices?.[0]?.message?.content) {
      reply = data.choices[0].message.content;
    }

    res.status(200).json({ reply });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      reply: "Erreur serveur"
    });

  }
}
