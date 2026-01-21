import express from "express";
import OpenAI from "openai";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate-plan", async (req, res) => {
  try {
    const { stad, dagen, interesses, tempo } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Je bent een professionele reisplanner met 15 jaar ervaring.
Je maakt realistische, rustige en goed gebalanceerde dagplanningen.

Let op:
- Logische volgorde
- Max 3 activiteiten per dag
- Rustmomenten
- Eettijden
- Tempo van de reiziger
`
        },
        {
          role: "user",
          content: `
Maak een persoonlijke citytrip planning.

Stad: ${stad}
Aantal dagen: ${dagen}
Interesses: ${interesses}
Tempo: ${tempo}

Structuur EXACT zo:

Dag 1:
Ochtend:
- ...

Middag:
- ...

Avond:
- ...

Slecht-weer alternatief:
- ...
`
        }
      ],
      temperature: 0.7,
    });

    res.json({ planning: response.choices[0].message.content });

  } catch (error) {
    console.error("OPENAI ERROR:", error);
    res.status(500).json({
      error: error.message || "Onbekende AI fout",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("TripFlow AI backend draait!");
});

app.listen(PORT, () => {
  console.log("Server draait op poort", PORT);
});
