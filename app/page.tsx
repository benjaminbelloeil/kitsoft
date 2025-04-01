"use client";

export default function Home() {


  // Show a loading state while checking auth
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accenture"></div>
    </div>
  );
}
