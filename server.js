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
    const {
      stad,
      dagen,
      personen,
      interesses,
      tempo,
      budget
    } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `
Je bent een professionele reisplanner met meer dan 15 jaar ervaring.
Je maakt realistische en comfortabele citytrip-planningen.

Je bepaalt zelf het beste vervoermiddel tussen activiteiten, op basis van:
- Afstand
- Budget
- Tempo van de reiziger

Gebruik realistische vervoerswijzen zoals lopen, openbaar vervoer of taxi/Uber.
Geef duidelijk aan per verplaatsing welk vervoersmiddel wordt aangeraden.

Houd rekening met:
- Logische volgorde van locaties
- Gemiddelde duur van activiteiten
- Tempo van de reiziger
- Budgetniveau
- Aantal personen

Schrijf concreet, overzichtelijk en uitvoerbaar.
`
        },
        {
          role: "user",
          content: `
Maak een persoonlijke citytrip planning.

Gegevens:
Stad: ${stad}
Aantal dagen: ${dagen}
Aantal personen: ${personen}
Interesses: ${interesses}
Tempo: ${tempo}
Budget: ${budget}

Regels:
- Maximaal 3 hoofdactiviteiten per dag
- Cluster activiteiten per wijk/buurt
- Vermeld per activiteit:
  • gemiddelde duur
  • geschatte reistijd
  • aanbevolen vervoerswijze (door jou bepaald)
- Voeg rustmomenten toe
- Voeg per dag 1 slecht-weer alternatief toe

Structuur EXACT zo:

Dag 1 – [Buurt/Wijk]:
Ochtend:
- Activiteit (duur: ±X uur, reistijd: ±X min, vervoer: ...)

Middag:
- ...

Avond:
- ...

Rustmoment:
- ...

Slecht-weer alternatief:
- ...
`
        }
      ]
    });

    res.json({
      planning: response.choices[0].message.content
    });

  } catch (error) {
    console.error("OPENAI ERROR:", error);
    res.status(500).json({
      error: error.message || "AI fout"
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
