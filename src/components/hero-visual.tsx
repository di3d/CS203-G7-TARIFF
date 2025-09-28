const HeroVisual = () => {
  return (
    <div className="relative">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-16 w-12 h-12 bg-accent/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-secondary/15 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      </div>
      
      {/* Main Visual Grid */}
      <div className="relative z-10 grid grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className={`h-16 rounded-lg ${
              i === 4 ? 'bg-primary shadow-lg' : 'bg-card border'
            } transition-all duration-500 hover:scale-105`}
            style={{
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
      
      {/* Decorative Lines */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary/20 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
    </div>
  );
};

export default HeroVisual;
