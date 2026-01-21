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
      model: "gpt-4o-mini",
      messages: [
        {
  role: "system",
  content: `
Je bent een professionele reisplanner met 15 jaar ervaring.
Je maakt realistische, rustige en goed gebalanceerde dagplanningen voor reizigers.

Denk altijd aan:
- Logische volgorde (afstand tussen locaties)
- Niet te veel activiteiten per dag
- Rustmomenten
- Eettijden
- Tempo van de reiziger

Schrijf duidelijk, concreet en zonder overbodige tekst.
`
}
        },
         {
  role: "user",
  content: `
Maak een persoonlijke dagplanning voor een citytrip.

Gegevens:
- Stad: ${stad}
- Aantal personen: ${personen}
- Aantal dagen: ${dagen}
- Interesses: ${interesses}
- Tempo: ${tempo}

Regels:
- Maximaal 3 hoofdactiviteiten per dag
- Verdeel per dag in: Ochtend, Middag, Avond
- Voeg per dag 1 rustmoment toe
- Voeg per dag 1 slecht-weer alternatief toe
- Houd rekening met het gekozen tempo
- Gebruik duidelijke kopjes per dag

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

Dag 2:
...
`
}
      ],
      temperature: 0.7
    });

    res.json({ planning: response.choices[0].message.content });
  } catch (error) {
  console.error("OPENAI ERROR:", error);
  res.status(500).json({
    error: error.message || "Onbekende AI fout"
  });
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
