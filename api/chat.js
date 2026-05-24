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
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 100
        })
      }
    );

    const data = await response.json();

    console.log(JSON.stringify(data));

    let reply = "Pas de réponse IA";

    if (
      data &&
      data.choices &&
      data.choices[0] &&
      data.choices[0].message
    ) {
      reply = data.choices[0].message.content;
    }

    else if (data && data.error) {
      reply = "Erreur HF : " + JSON.stringify(data.error);
    }

    res.status(200).json({ reply });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      reply: "Erreur serveur"
    });
  }
}
