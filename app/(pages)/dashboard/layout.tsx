import Navbar from "@/components/nav/navbar";
import { NotificationProvider } from "@/context/notification-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <div className="flex h-screen w-screen bg-white text-black overflow-hidden">
        <Navbar />
        <main className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </NotificationProvider>
  );
}