{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 export default async function handler(req, res) \{\
  const message = req.body.message;\
\
  const response = await fetch("https://api.openai.com/v1/chat/completions", \{\
    method: "POST",\
    headers: \{\
      "Content-Type": "application/json",\
      "Authorization": `Bearer $\{process.env.OPENAI_API_KEY\}`\
    \},\
    body: JSON.stringify(\{\
      model: "gpt-4.1-mini",\
      messages: [\
        \{ role: "system", content: "Tu es un assistant utile." \},\
        \{ role: "user", content: message \}\
      ]\
    \})\
  \});\
\
  const data = await response.json();\
\
  res.status(200).json(\{\
    reply: data.choices[0].message.content\
  \});\
\}}