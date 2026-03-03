export const Card = ({
  children,
  className = "",
  testId,
}: {
  children: React.ReactNode;
  className?: string;
  testId?: string;
}) => {
  return (
    <section
      data-testid={testId}
      className={`border border-zinc-800 bg-zinc-950/90 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] ${className}`}
    >
      {children}
    </section>
  );
};
