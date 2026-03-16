export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-background w-full">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)`,
        backgroundSize: '24px 24px'
      }} />
      <div className="relative max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight max-w-4xl mx-auto leading-tight">
            Discover Amazing
            <span className="block text-primary">Karaoke Performers</span>
          </h1>
          <p className="text-muted text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium mb-12">
            Connect with talented singers, explore their signature songs, and find your next karaoke inspiration
          </p>
        </div>
      </div>
    </div>
  );
}