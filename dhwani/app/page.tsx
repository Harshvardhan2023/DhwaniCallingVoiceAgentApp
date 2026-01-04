"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { RetellWebClient } from "retell-client-js-sdk";
import services from "../firebase/services";
import { User } from "firebase/auth";
import { 
  Phone, 
  PhoneOff, 
  LogOut, 
  ShieldCheck, 
  BellRing, 
  User as UserIcon, 
  Activity, 
  History 
} from "lucide-react";

const retellClient = new RetellWebClient();

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [incomingRing, setIncomingRing] = useState(false);
  const [status, setStatus] = useState("System Online");
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const unsubscribe = services.auth.onAuthStateChanged((u) => setUser(u));
    
    ringtoneRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg");
    if(ringtoneRef.current) ringtoneRef.current.loop = true;

    retellClient.on("call_started", () => {
      setIsCalling(true);
      setIncomingRing(false);
      ringtoneRef.current?.pause();
      setStatus("Secure Line Connected");
    });

    retellClient.on("call_ended", () => {
      setIsCalling(false);
      setStatus("Call Ended");
      setTimeout(() => setStatus("System Online"), 2000);
    });

    retellClient.on("error", (err) => {
      console.error(err);
      setStatus("Connection Error");
      setIsCalling(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    await services.loginWithGooglePopUp();
  };

  const startCall = async () => {
    if (!user) return;
    setStatus("Establishing Secure Link...");
    try {
      const response = await fetch("http://localhost:8000/create-web-call");
      const data = await response.json();
      await retellClient.startCall({ accessToken: data.access_token });
    } catch (err) {
      console.error(err);
      setStatus("Server Offline");
    }
  };

  const requestCallback = () => {
    setStatus("Callback Scheduled...");
    setTimeout(() => {
        setIncomingRing(true);
        ringtoneRef.current?.play().catch(() => {});
    }, 4000);
  };

  const acceptIncomingCall = async () => {
      ringtoneRef.current?.pause();
      await startCall();
  };

  const declineIncomingCall = () => {
      setIncomingRing(false);
      ringtoneRef.current?.pause();
      setStatus("Callback Declined");
      setTimeout(() => setStatus("System Online"), 2000);
  };

  const endCall = () => {
    retellClient.stopCall();
  };

  return (
    <main className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 font-sans text-slate-900 selection:bg-emerald-100">
      
      {/* --- LEFT SIDE: 3D-STYLE BACKGROUND (STABLE) --- */}
      <div className="relative h-96 lg:h-auto w-full bg-slate-900 overflow-hidden flex items-center justify-center">
        
        {/* Background Image (Replaces Spline) */}
        <div className="absolute inset-0 z-0">
           {/* High-Res 'Digital Earth' Image from Unsplash */}
           <Image 
             src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
             alt="Digital Network Background"
             fill
             className="object-cover opacity-60"
             priority
           />
           {/* Gradient Overlay for Text Readability */}
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>
        
        {/* Overlay Content */}
        <div className="relative z-10 p-12 flex flex-col items-start justify-center h-full w-full lg:w-auto">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-2xl shadow-emerald-500/30">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 drop-shadow-lg">
            Welcome to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Central Citizen Services
            </span>
          </h1>
          <p className="text-lg text-slate-300 font-medium tracking-wide max-w-md drop-shadow-md">
            Your secure gateway to government services. Bridging the gap with next-gen AI technology.
          </p>
          <div className="mt-8 flex items-center gap-2 text-emerald-400 font-semibold bg-slate-900/50 px-4 py-2 rounded-full backdrop-blur-md border border-emerald-500/30">
             <Activity size={20} />
             <span>SATYAMEVA JAYATE</span>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN & CALL INTERFACE --- */}
      <div className="flex flex-col items-center justify-center p-6 lg:p-12 bg-slate-50 relative">
        
        {incomingRing && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300 p-4">
              <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl animate-bounce">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-pulse">
                      <Phone size={48} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Incoming Call</h2>
                  <p className="mb-8 text-slate-500 font-medium">District Officer • Central Services</p>
                  <div className="flex justify-center gap-8">
                      <button 
                        onClick={declineIncomingCall} 
                        aria-label="Decline Call"
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-200 transition hover:scale-110"
                      >
                          <PhoneOff size={28} />
                      </button>
                      <button 
                        onClick={acceptIncomingCall} 
                        aria-label="Accept Call"
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-200 transition hover:scale-110 hover:bg-emerald-600"
                      >
                          <Phone size={28} />
                      </button>
                  </div>
              </div>
          </div>
        )}

        <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-900/5 z-10">
          <div className="relative bg-slate-900 p-8 text-center text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:16px_16px]" />
            <div className="relative z-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-lg shadow-emerald-500/20">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Citizen Login</h2>
            <p className="mt-2 text-sm text-slate-400 font-medium tracking-wide">Secure Access Point</p>
          </div>

          <div className="flex flex-col items-center p-8 bg-white min-h-[400px]">
            {!user ? (
              <div className="flex flex-col items-center justify-center h-full w-full py-8 space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-slate-800">Welcome Back</h3>
                  <p className="text-sm text-slate-500 max-w-[260px]">Please authenticate to continue.</p>
                </div>
                <button
                  onClick={handleLogin}
                  className="group relative flex w-full items-center justify-center gap-3 rounded-xl bg-slate-900 px-6 py-4 font-semibold text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 hover:-translate-y-0.5"
                >
                  <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">G</div>
                  <span>Sign in with Google</span>
                </button>
                <div className="text-xs text-slate-400 pt-4 flex items-center gap-2">
                  <ShieldCheck size={12} />
                  <span>256-bit Secure Encryption</span>
                </div>
              </div>
            ) : (
              <div className="flex w-full flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`mb-10 flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide uppercase transition-colors ${
                    isCalling 
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}>
                  <span className={`h-2 w-2 rounded-full ${isCalling ? "animate-pulse bg-emerald-500" : "bg-slate-400"}`} />
                  <span>{status}</span>
                </div>

                {!isCalling ? (
                  <div className="flex flex-col items-center space-y-6">
                      <div className="relative group">
                          <div className="absolute inset-0 rounded-full bg-emerald-400 blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                          <button
                              onClick={startCall}
                              aria-label="Start Call"
                              className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-xl shadow-emerald-200 transition-transform duration-300 hover:scale-105 active:scale-95"
                          >
                              <Phone size={40} className="drop-shadow-md" />
                          </button>
                      </div>
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Tap to Call</span>
                      <button 
                          onClick={requestCallback}
                          className="mt-4 flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
                      >
                          <BellRing size={14} />
                          <span>Request Callback Demo</span>
                      </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-6">
                     <div className="relative">
                          <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20"></span>
                          <button
                              onClick={endCall}
                              aria-label="End Call"
                              className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-b from-red-500 to-red-600 text-white shadow-xl shadow-red-200 transition-transform hover:scale-105 active:scale-95"
                          >
                              <PhoneOff size={40} className="drop-shadow-md" />
                          </button>
                     </div>
                     <div className="flex items-center gap-1 h-8">
                        <div className="w-1 bg-slate-300 h-3 animate-[pulse_1s_ease-in-out_infinite]"></div>
                        <div className="w-1 bg-slate-300 h-6 animate-[pulse_1.2s_ease-in-out_infinite]"></div>
                        <div className="w-1 bg-slate-300 h-4 animate-[pulse_0.8s_ease-in-out_infinite]"></div>
                        <div className="w-1 bg-slate-300 h-7 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                        <div className="w-1 bg-slate-300 h-3 animate-[pulse_1s_ease-in-out_infinite]"></div>
                     </div>
                     <span className="text-sm font-bold text-red-500 uppercase tracking-widest">End Call</span>
                  </div>
                )}

                <div className="mt-12 w-full border-t border-slate-100 pt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-sm bg-slate-100">
                       {user.photoURL ? (
                           <Image 
                              src={user.photoURL} 
                              alt="User Profile" 
                              width={40} 
                              height={40}
                              className="h-full w-full object-cover"
                           />
                       ) : <div className="h-full w-full flex items-center justify-center text-slate-400"><UserIcon size={20}/></div>}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">{user.displayName}</span>
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Citizen ID: {user.uid.slice(0,6)}</span>
                    </div>
                  </div>
                  <button 
                      onClick={() => services.logout()}
                      aria-label="Logout"
                      className="group flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                  >
                      <LogOut size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 flex items-center gap-6 text-slate-400 opacity-60 z-10">
          <div className="flex items-center gap-1.5"><ShieldCheck size={14} /><span className="text-[10px] font-semibold uppercase tracking-wider">Secure</span></div>
          <div className="flex items-center gap-1.5"><Activity size={14} /><span className="text-[10px] font-semibold uppercase tracking-wider">Live</span></div>
          <div className="flex items-center gap-1.5"><History size={14} /><span className="text-[10px] font-semibold uppercase tracking-wider">24/7 AI</span></div>
        </div>
      </div>
    </main>
  );
}