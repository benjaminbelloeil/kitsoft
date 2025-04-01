import Navbar from "@/components/nav/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen bg-white text-black overflow-hidden">
      <Navbar />
      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}