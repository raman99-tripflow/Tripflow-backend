import express from "express";
import OpenAI from "openai";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/generate-plan", async (req, res) => {
  try {
    const { stad, dagen, interesses, tempo } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-40-mini",
      messages: [
        {
          role: "system",
          content: "Je bent een professionele reisplanner die realistische dagplanningen maakt."
        },
        {
          role: "user",
          content: `
Maak een dagplanning voor een reiziger.

Stad: ${stad}
Aantal dagen: ${dagen}
Interesses: ${interesses}
Tempo: ${tempo}

Regels:
- Maximaal 3 hoofdactiviteiten per dag
- Ochtend / Middag / Avond
- Voeg rustmomenten toe
- Geef 1 alternatief bij slecht weer
`
        }
      ],
      temperature: 0.7
    });

    res.json({ planning: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "AI fout" });
  }
});

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("TripFlow AI backend draait!");
});

app.listen(PORT, () => {
  console.log("Server draait op poort",PORT);
});
app.on('error',(err) => {
  console.error('Server error;', err);
});
