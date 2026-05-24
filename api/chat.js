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
              content:
                "Tu es un assistant clair. Tu réponds toujours en français. Quand tu proposes des options, termine par: CHOIX: option1 | option2 | option3"
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

    console.log("HF RESPONSE:", JSON.stringify(data));

    let reply = "Erreur IA";

    if (data?.choices?.[0]?.message?.content) {
      reply = data.choices[0].message.content;
    }

    else if (data?.error) {
      reply = "Erreur HF : " + JSON.stringify(data.error);
    }

    else {
      reply = "Aucune réponse du modèle";
    }

    res.status(200).json({ reply });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      reply: "Erreur serveur"
    });

  }
}
