import Navbar from '@/components/Navbar';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {

  return (
    <div className="flex flex-col min-h-screen">
        <div className="flex flex-col min-h-screen bg-[#F2F2F2]">
            <Navbar />
            {children}
        </div>
    </div>
  );
}