import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const SYSTEM_PROMPT = `Tu es un assistant médical spécialisé en dermatologie, expert en cancer de la peau, mélanome, et lésions cutanées.

Règles strictes:
- Réponds uniquement aux questions liées à la dermatologie (cancer de la peau, mélanome, naevi, lésions, grains de beauté, photoprotection, règle ABCDE, etc.). Si la question est hors-sujet, dis-le poliment.
- Fournis des informations claires, prudentes, basées sur des connaissances médicales générales.
- Ne pose JAMAIS de diagnostic définitif.
- Termine TOUJOURS ta réponse par une recommandation explicite de consulter un dermatologue qualifié pour un examen clinique, surtout en cas de doute, lésion suspecte, évolution rapide, saignement ou démangeaison.
- Réponds en français, de manière structurée (markdown autorisé).`;

export const askDermato = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ question: z.string().trim().min(3).max(2000) }).parse(input),
  )
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    try {
      const { text } = await generateText({
        model,
        system: SYSTEM_PROMPT,
        prompt: data.question,
      });
      return { answer: text };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      if (message.includes("429")) {
        return { answer: "", error: "Trop de requêtes. Merci de réessayer dans un instant." };
      }
      if (message.includes("402")) {
        return { answer: "", error: "Crédits IA épuisés. Ajoutez des crédits dans les paramètres de l'espace de travail." };
      }
      return { answer: "", error: "Une erreur est survenue lors de la génération de la réponse." };
    }
  });
