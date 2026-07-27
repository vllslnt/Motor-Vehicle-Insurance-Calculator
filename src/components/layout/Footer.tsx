import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg tracking-tight">AsuransiKu Calculator</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Platform kalkulasi premi asuransi kendaraan bermotor terpercaya. Perhitungan dijamin akurat mengikuti regulasi Otoritas Jasa Keuangan (OJK).
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Asuransi Mobil</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Klaim Asuransi</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Bengkel Rekanan</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Bantuan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Pusat Bantuan</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AsuransiKu. Hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
            <span className="font-medium text-foreground">Terdaftar dan diawasi oleh Otoritas Jasa Keuangan (OJK)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
