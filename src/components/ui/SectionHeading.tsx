export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      {eyebrow ? (
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-gold">{eyebrow}</p>
      ) : null}
      <h2 className="font-display text-4xl leading-tight text-leaf-900 md:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-lg leading-8 text-leaf-700">{description}</p> : null}
    </div>
  );
}
