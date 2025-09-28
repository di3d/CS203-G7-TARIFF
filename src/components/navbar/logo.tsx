export const Logo = () => {
  return (
    <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 group">
      <div className="w-9 h-9 bg-slate-950 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
        <span className="text-white font-black text-sm">T</span>
      </div>
      <span className="font-black text-xl tracking-tight text-slate-950">TARIFFIC</span>
    </a>
  );
};
