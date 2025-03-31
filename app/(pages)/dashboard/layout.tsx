import Navbar from "@/components/nav/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex h-screen w-screen bg-white text-black">
        <Navbar />
        <main className="flex flex-col w-full h-full p-6 bg-white overflow-auto">
          <div className="bg-white rounded-lg h-full transition-all duration-300 ease-in-out">
            {children}
          </div>
        </main>
      </div>
    );
  }