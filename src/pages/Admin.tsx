import { useEffect, useState, useRef } from "react";
import {
  isSupabaseReady, supabase,
  signInWithGoogle, signOut, getCurrentUser, isAuthorizedEmail,
  updateSubmissionStatus, getAuthorizedUsers, addAuthorizedUser, removeAuthorizedUser,
  getGalleryPhotos, uploadGalleryPhoto, deleteGalleryPhoto,
  type ContactSubmission, type AuthorizedUser, type GalleryPhoto,
} from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw, Phone, AlertCircle, LogOut, Users, Image,
  Plus, Trash2, Upload, Eye, EyeOff, Mail, Shield,
  CheckCircle2, X, MessageSquare, ChevronDown,
} from "lucide-react";
import logo from "@/assets/logo.png";

type Tab = "submissions" | "gallery" | "team";
type User = { email: string; name?: string; role: string } | null;

// ── Login Screen ──────────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => (
  <div className="min-h-screen bg-[#0a0f2e] flex items-center justify-center p-4">
    <div className="absolute inset-0"
      style={{ background: "radial-gradient(ellipse 60% 60% at 50% 40%, hsla(235,85%,60%,0.15), transparent)" }} />
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="relative bg-card rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-2xl text-center">
      <img src={logo} alt="SSS" className="w-20 h-20 object-contain mx-auto mb-5" />
      <h1 className="text-2xl font-black text-foreground mb-2">Admin Portal</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Sankalp Shiksha Salahkar — Staff Access Only
      </p>
      {isSupabaseReady ? (
        <>
          <button onClick={onLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white border border-border text-foreground font-bold text-sm hover:bg-muted transition-colors shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google (Gmail)
          </button>
          <p className="text-xs text-muted-foreground mt-4">
            Only authorized Gmail accounts can access this portal.
          </p>
        </>
      ) : (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-left">
          <p className="text-amber-800 font-bold text-sm mb-1">⚠️ Supabase Not Configured</p>
          <p className="text-amber-700 text-xs">Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file to enable login.</p>
        </div>
      )}
    </motion.div>
  </div>
);

// ── Not Authorized Screen ─────────────────────────────────────────────────────
const NotAuthorized = ({ email, onLogout }: { email: string; onLogout: () => void }) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <Shield size={28} className="text-red-500" />
      </div>
      <h2 className="text-xl font-black text-foreground mb-2">Access Denied</h2>
      <p className="text-muted-foreground text-sm mb-2">
        <span className="text-foreground font-semibold">{email}</span> is not authorized.
      </p>
      <p className="text-muted-foreground text-xs mb-6">Contact the owner to get access.</p>
      <button onClick={onLogout}
        className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold">
        Sign Out
      </button>
    </div>
  </div>
);

// ── Main Admin ────────────────────────────────────────────────────────────────
const Admin = () => {
  const [authState, setAuthState] = useState<"loading" | "login" | "unauthorized" | "authorized">("loading");
  const [currentUser, setCurrentUser] = useState<User>(null);
  const [tab, setTab] = useState<Tab>("submissions");
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [subFilter, setSubFilter] = useState<"all" | "new" | "contacted" | "enrolled">("all");
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [team, setTeam] = useState<AuthorizedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Upload state
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadCat, setUploadCat] = useState("general");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Team state
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"staff" | "owner">("staff");
  const [addingUser, setAddingUser] = useState(false);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
    if (isSupabaseReady) {
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) verifyUser(session.user.email!, session.user.user_metadata?.full_name);
        else setAuthState("login");
      });
    }
  }, []);

  const checkAuth = async () => {
    if (!isSupabaseReady) { setAuthState("login"); return; }
    const user = await getCurrentUser();
    if (!user) { setAuthState("login"); return; }
    await verifyUser(user.email!, user.user_metadata?.full_name);
  };

  const verifyUser = async (email: string, name?: string) => {
    const { authorized, role } = await isAuthorizedEmail(email);
    if (!authorized) { setCurrentUser({ email, name, role: "" }); setAuthState("unauthorized"); return; }
    setCurrentUser({ email, name, role });
    setAuthState("authorized");
    loadAll();
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [subs, gal, tm] = await Promise.all([
        supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
        getGalleryPhotos(true),
        getAuthorizedUsers(),
      ]);
      if (subs.data) setSubmissions(subs.data);
      setGallery(gal);
      setTeam(tm);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleLogin = () => signInWithGoogle();
  const handleLogout = async () => { await signOut(); setAuthState("login"); setCurrentUser(null); };

  const handleStatusChange = async (id: string, status: ContactSubmission["status"]) => {
    await updateSubmissionStatus(id, status);
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle.trim()) return;
    setUploading(true);
    try {
      const photo = await uploadGalleryPhoto(uploadFile, uploadTitle, uploadDesc, uploadCat, currentUser!.email);
      setGallery(prev => [photo, ...prev]);
      setUploadTitle(""); setUploadDesc(""); setUploadFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (e: any) {
      alert("Upload failed: " + e.message);
    } finally { setUploading(false); }
  };

  const handleDeletePhoto = async (id: string, url: string) => {
    if (!confirm("Delete this photo?")) return;
    await deleteGalleryPhoto(id, url);
    setGallery(prev => prev.filter(p => p.id !== id));
  };

  const handleAddUser = async () => {
    if (!newEmail.trim()) return;
    setAddingUser(true);
    try {
      const user = await addAuthorizedUser({
        email: newEmail.trim().toLowerCase(),
        name: newName.trim(),
        role: newRole,
        added_by: currentUser!.email,
        is_active: true,
      });
      setTeam(prev => [...prev, user]);
      setNewEmail(""); setNewName("");
    } catch (e: any) {
      alert("Error: " + (e.message || "Could not add user"));
    } finally { setAddingUser(false); }
  };

  const handleRemoveUser = async (id: string, email: string) => {
    if (email === currentUser?.email) { alert("You cannot remove yourself!"); return; }
    if (!confirm(`Remove ${email}?`)) return;
    await removeAuthorizedUser(id);
    setTeam(prev => prev.map(u => u.id === id ? { ...u, is_active: false } : u));
  };

  const filteredSubs = subFilter === "all" ? submissions : submissions.filter(s => s.status === subFilter);
  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    enrolled: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-500",
  };

  // ── Render states ──
  if (authState === "loading") return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  if (authState === "login") return <LoginScreen onLogin={handleLogin} />;

  if (authState === "unauthorized") return (
    <NotAuthorized email={currentUser?.email || ""} onLogout={handleLogout} />
  );

  // ── Authorized admin UI ──
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="container-narrow px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SSS" className="w-9 h-9 object-contain" />
            <div>
              <p className="text-sm font-black text-foreground">Admin Portal</p>
              <p className="text-[10px] text-muted-foreground">Sankalp Shiksha Salahkar</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary">
                {currentUser?.name?.charAt(0) || currentUser?.email?.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{currentUser?.name || currentUser?.email}</p>
                <p className="text-[10px] text-accent capitalize">{currentUser?.role}</p>
              </div>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:text-foreground transition-colors">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="container-narrow px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { n: submissions.length, l: "Total Leads", icon: <MessageSquare size={18}/>, color: "text-blue-600 bg-blue-50" },
            { n: submissions.filter(s => s.status === "new").length, l: "New Today", icon: <AlertCircle size={18}/>, color: "text-orange-600 bg-orange-50" },
            { n: submissions.filter(s => s.status === "enrolled").length, l: "Enrolled", icon: <CheckCircle2 size={18}/>, color: "text-green-600 bg-green-50" },
            { n: gallery.length, l: "Gallery Photos", icon: <Image size={18}/>, color: "text-purple-600 bg-purple-50" },
          ].map((s, i) => (
            <div key={i} className="glass-card rounded-2xl p-5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
              <div className="text-2xl font-black text-foreground">{s.n}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-muted p-1 rounded-xl w-fit">
          {([
            { id: "submissions", label: "Contact Submissions", icon: <MessageSquare size={14}/> },
            { id: "gallery", label: "Gallery", icon: <Image size={14}/> },
            { id: "team", label: "Team Access", icon: <Users size={14}/> },
          ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── SUBMISSIONS TAB ── */}
        <AnimatePresence mode="wait">
          {tab === "submissions" && (
            <motion.div key="submissions" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
              {/* Filter pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {(["all","new","contacted","enrolled","closed"] as const).map(f => (
                  <button key={f} onClick={() => setSubFilter(f as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${subFilter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                    {f === "all" ? `All (${submissions.length})` : `${f} (${submissions.filter(s=>s.status===f).length})`}
                  </button>
                ))}
                <button onClick={loadAll}
                  className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted text-xs font-bold text-muted-foreground hover:text-foreground">
                  <RefreshCw size={13} className={refreshing ? "animate-spin" : ""}/> Refresh
                </button>
              </div>

              <div className="glass-card rounded-2xl overflow-hidden">
                {filteredSubs.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="font-bold text-foreground mb-1">No submissions yet</p>
                    <p className="text-muted-foreground text-sm">Form submissions will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted border-b border-border">
                          {["Student","Course / College","City","Date","Status","Update"].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-bold text-foreground whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSubs.map((row, i) => (
                          <tr key={row.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary shrink-0">
                                  {row.name?.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-foreground text-xs">{row.name}</p>
                                  <a href={`tel:${row.phone}`} className="text-primary text-[10px] hover:text-accent flex items-center gap-0.5">
                                    <Phone size={9}/> {row.phone}
                                  </a>
                                  {row.email && <p className="text-muted-foreground text-[10px]">{row.email}</p>}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-foreground text-xs font-medium">{row.course}</p>
                              {row.college_preference && <p className="text-muted-foreground text-[10px]">{row.college_preference}</p>}
                              {row.class12_marks && <p className="text-accent text-[10px]">12th: {row.class12_marks}</p>}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground text-xs">{row.city || "—"}</td>
                            <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                              {row.created_at ? new Date(row.created_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short"}) : "—"}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize ${statusColors[row.status||"new"]}`}>
                                {row.status || "new"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <select value={row.status || "new"}
                                onChange={e => handleStatusChange(row.id!, e.target.value as any)}
                                className="text-[10px] px-2 py-1.5 rounded-lg bg-muted border-0 outline-none font-medium">
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="enrolled">Enrolled</option>
                                <option value="closed">Closed</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── GALLERY TAB ── */}
          {tab === "gallery" && (
            <motion.div key="gallery" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
              {/* Upload form */}
              <div className="glass-card rounded-2xl p-6 mb-6">
                <h3 className="text-sm font-black text-foreground mb-4 flex items-center gap-2">
                  <Upload size={16} className="text-primary"/> Upload New Photo
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1.5">Photo Title *</label>
                    <input value={uploadTitle} onChange={e => setUploadTitle(e.target.value)}
                      placeholder="e.g. Career Counseling Session, Patna"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1.5">Category</label>
                    <select value={uploadCat} onChange={e => setUploadCat(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/20">
                      {["general","counseling","college-visit","event","team","students"].map(c => (
                        <option key={c} value={c} className="capitalize">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-foreground block mb-1.5">Description</label>
                    <input value={uploadDesc} onChange={e => setUploadDesc(e.target.value)}
                      placeholder="Short description (optional)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors text-sm text-muted-foreground hover:text-foreground">
                    <Upload size={16} />
                    {uploadFile ? uploadFile.name : "Choose Photo (JPG/PNG)"}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden"
                      onChange={e => setUploadFile(e.target.files?.[0] || null)} />
                  </label>
                  <button onClick={handleUpload}
                    disabled={!uploadFile || !uploadTitle.trim() || uploading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground font-bold text-sm disabled:opacity-50 transition-opacity">
                    {uploading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Plus size={16}/>}
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>

              {/* Gallery grid */}
              {gallery.length === 0 ? (
                <div className="text-center py-16 glass-card rounded-2xl">
                  <p className="text-4xl mb-3">🖼️</p>
                  <p className="font-bold text-foreground mb-1">No photos yet</p>
                  <p className="text-muted-foreground text-sm">Upload your first photo above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gallery.map(photo => (
                    <div key={photo.id} className="glass-card rounded-2xl overflow-hidden group relative">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img src={photo.image_url} alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-bold text-foreground truncate">{photo.title}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">{photo.category}</p>
                        {photo.uploaded_by && <p className="text-[10px] text-primary/70 truncate">{photo.uploaded_by}</p>}
                      </div>
                      <button onClick={() => handleDeletePhoto(photo.id!, photo.image_url)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                        <Trash2 size={12} />
                      </button>
                      <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold ${photo.is_active ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}>
                        {photo.is_active ? "Live" : "Hidden"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── TEAM TAB ── */}
          {tab === "team" && (
            <motion.div key="team" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
              {currentUser?.role === "owner" && (
                <div className="glass-card rounded-2xl p-6 mb-6">
                  <h3 className="text-sm font-black text-foreground mb-4 flex items-center gap-2">
                    <Plus size={16} className="text-primary"/> Add Staff Member
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1.5">Gmail Address *</label>
                      <input value={newEmail} onChange={e => setNewEmail(e.target.value)}
                        placeholder="staff@gmail.com" type="email"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1.5">Full Name</label>
                      <input value={newName} onChange={e => setNewName(e.target.value)}
                        placeholder="Staff member name"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1.5">Role</label>
                      <select value={newRole} onChange={e => setNewRole(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/20">
                        <option value="staff">Staff</option>
                        <option value="owner">Owner</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={handleAddUser} disabled={!newEmail.trim() || addingUser}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50">
                    {addingUser ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Plus size={16}/>}
                    Add Member
                  </button>
                  <p className="text-xs text-muted-foreground mt-3">
                    ⚠️ The person must sign in with the exact Gmail address you add here.
                  </p>
                </div>
              )}

              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border bg-muted/50">
                  <h3 className="text-sm font-bold text-foreground">Authorized Team Members ({team.filter(t=>t.is_active).length})</h3>
                </div>
                {team.filter(t => t.is_active).length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground text-sm">No team members added yet.</div>
                ) : (
                  <div className="divide-y divide-border">
                    {team.filter(t => t.is_active !== false).map(member => (
                      <div key={member.id} className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-black text-primary">
                            {(member.name || member.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm">{member.name || "—"}</p>
                            <p className="text-muted-foreground text-xs flex items-center gap-1">
                              <Mail size={11}/> {member.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${member.role === "owner" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                            {member.role}
                          </span>
                          {currentUser?.role === "owner" && member.email !== currentUser.email && (
                            <button onClick={() => handleRemoveUser(member.id!, member.email)}
                              className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                              <X size={14}/>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
