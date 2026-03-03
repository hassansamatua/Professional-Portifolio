import EmailPasswordDemo from "./EmailPasswordDemo";

export default function EmailPasswordPage() {
  return (
      <div className="min-h-screen bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] text-slate-100">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-16">
          <header className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/90"> 
            Supabase × Next.js
          </p>
                  <h1 className="text-4xl font-semibold text-white drop-shadow-sm">   
            Email & Password Auth
          </h1>
                  <p className="text-base text-slate-400">  
            A classic email and password authentication flow with session listeners to keep the UI in sync.
          </p>
          </header>
             
        </div>
      </div>
  );
}       