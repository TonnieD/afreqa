export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#0B0504]">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="inline-block px-4 py-1.5 rounded-full border border-[#7B2FF7]/40 bg-[#7B2FF7]/10 text-[#16F4D0] text-sm font-semibold tracking-wider uppercase shadow-glow-violet">
          Phase 0 Initialized
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#EDECEC]">
          AFREQA
        </h1>
        <p className="text-xl md:text-2xl text-[#B6B5B5] max-w-xl mx-auto font-light">
          Kenya's Hub for Electronic Dance Music
        </p>
        <p className="text-sm text-[#ADADAC]">
          Awaiting brand theme token confirmation from owner to build the full festival experience.
        </p>
      </div>
    </main>
  );
}

