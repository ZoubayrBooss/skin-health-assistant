import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { askDermato } from "@/lib/dermato.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DermAssist — Assistant médical en dermatologie" },
      {
        name: "description",
        content:
          "Assistant IA pour vos questions sur le cancer de la peau, le mélanome et les lésions cutanées. Ne remplace pas un dermatologue.",
      },
      { property: "og:title", content: "DermAssist — Assistant dermatologie" },
      {
        property: "og:description",
        content:
          "Posez vos questions sur les lésions cutanées et le mélanome. Réponses informatives — consultez toujours un dermatologue.",
      },
    ],
  }),
  component: Index,
});

const EXAMPLES = [
  "Qu'est-ce que la règle ABCDE pour repérer un mélanome ?",
  "Quels sont les signes d'un grain de beauté suspect ?",
  "Comment me protéger du cancer de la peau au quotidien ?",
];

function Index() {
  const ask = useServerFn(askDermato);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (question.trim().length < 3 || loading) return;
    setLoading(true);
    setError("");
    setAnswer("");
    try {
      const res = await ask({ data: { question: question.trim() } });
      if (res.error) setError(res.error);
      else setAnswer(res.answer);
    } catch {
      setError("Impossible de contacter l'assistant. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Assistant IA — Dermatologie
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            DermAssist
          </h1>
          <p className="mt-2 text-muted-foreground">
            Posez vos questions sur le cancer de la peau, le mélanome et les lésions cutanées.
          </p>
        </header>

        <div
          role="note"
          className="mb-6 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning-foreground"
        >
          <strong>Avertissement :</strong> cet assistant fournit des informations générales et
          ne pose aucun diagnostic. Consultez toujours un dermatologue qualifié.
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="question" className="block text-sm font-medium">
            Votre question
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex : Comment reconnaître un mélanome ?"
            rows={4}
            maxLength={2000}
            className="w-full resize-y rounded-lg border border-input bg-card px-4 py-3 text-base text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setQuestion(ex)}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-foreground"
                >
                  {ex}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading || question.trim().length < 3}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Analyse en cours…" : "Envoyer"}
            </button>
          </div>
        </form>

        <section aria-live="polite" className="mt-8">
          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {loading && !answer && (
            <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
              L'assistant rédige votre réponse…
            </div>
          )}

          {answer && (
            <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Réponse
              </h2>
              <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary">
                <ReactMarkdown>{answer}</ReactMarkdown>
              </div>
            </article>
          )}
        </section>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          Information à but éducatif uniquement — ne remplace pas une consultation médicale.
        </footer>
      </div>
    </main>
  );
}
