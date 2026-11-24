export function QuestionCard({ number, total, question }) {
  return (
    <section className="relative overflow-hidden rounded-[1.5rem] bg-foreground p-5 text-background sm:rounded-[2rem] sm:p-8">
      {/* Big faded number */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 -top-6 select-none text-[9rem] font-semibold leading-none tracking-[-0.06em] text-background/10 sm:text-[11rem]"
      >
        {String(number).padStart(2, "0")}
      </span>

      <div className="relative space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold tabular-nums tracking-tight text-background/60">
            Question {number} of {total}
          </p>

          {question?.questionType ? (
            <span className="rounded-full bg-background/10 px-3 py-1 text-xs font-medium text-background/80">
              {question.questionType}
            </span>
          ) : null}
        </div>

        <h2 className="break-words text-[1.625rem] font-semibold leading-[1.15] tracking-[-0.03em] sm:text-4xl">
          {question?.question}
        </h2>
      </div>
    </section>
  );
}