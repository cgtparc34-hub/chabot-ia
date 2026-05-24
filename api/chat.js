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
          model: "mistralai/Mistral-7B-Instruct-v0.2",
          messages: [
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log(data);

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Pas de réponse IA";

    res.status(200).json({
      reply
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      reply: "Erreur IA"
    });
  }
}
