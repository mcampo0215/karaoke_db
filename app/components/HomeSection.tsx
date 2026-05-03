export default function HomeSection() {
  return (
    <div className="relative overflow-hidden bg-background w-full">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)`,
        backgroundSize: '24px 24px'
      }} />
      <div className="relative max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight max-w-4xl mx-auto leading-tight">
            Karaoke with Friends Catalog
          </h1>
        </div>
      </div>
    </div>
  );
}