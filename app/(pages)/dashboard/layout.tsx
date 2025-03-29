import Navbar from "@/components/nav/navbar";
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex h-screen w-screen">
        <Navbar/>
        <div className="flex flex-col w-full h-full pt-[5vh] pr-[10vh] pl-[5vh] pb-[5vh]">
          {children}
        </div>
      </div>
    );
  }