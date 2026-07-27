import { Link } from 'wouter';
import { Shield } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg text-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">AsuransiKu</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/" className="text-foreground transition-colors hover:text-foreground">Beranda</Link>
          <a href="#cara-kerja" className="transition-colors hover:text-foreground">Cara Kerja</a>
          <a href="#tentang-ojk" className="transition-colors hover:text-foreground">Tentang OJK</a>
          <a href="#kontak" className="transition-colors hover:text-foreground">Kontak</a>
        </nav>
      </div>
    </header>
  );
}
