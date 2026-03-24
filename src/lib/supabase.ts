import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const isSupabaseReady = !!(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  SUPABASE_URL !== "https://pertweivyzgfjknmmzoj.supabase.co" &&
  SUPABASE_ANON_KEY !== "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlcnR3ZWl2eXpnZmprbm1tem9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjM1NjUsImV4cCI6MjA4OTgzOTU2NX0.-HvOXZe594X8Vce18NpFQQIrWMqCLY-p6OrWj1mhxC8"
);

export const supabase = isSupabaseReady
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : (null as any);

// ── Types ────────────────────────────────────────────────────────────────────

export type ContactSubmission = {
  id?: string;
  created_at?: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  course: string;
  college_preference?: string;
  class12_marks?: string;
  message?: string;
  status?: "new" | "contacted" | "enrolled" | "closed";
  notes?: string;
};

export type AuthorizedUser = {
  id?: string;
  email: string;
  name?: string;
  role: "owner" | "staff";
  added_by?: string;
  is_active?: boolean;
};

export type GalleryPhoto = {
  id?: string;
  created_at?: string;
  title: string;
  description?: string;
  image_url: string;
  category?: string;
  uploaded_by?: string;
  is_active?: boolean;
  sort_order?: number;
};

// ── Auth ─────────────────────────────────────────────────────────────────────

export const signInWithGoogle = async () => {
  if (!isSupabaseReady) throw new Error("Supabase not configured");
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/admin`,
    },
  });
  if (error) throw error;
};

export const signOut = async () => {
  if (!isSupabaseReady) return;
  await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  if (!isSupabaseReady) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const isAuthorizedEmail = async (email: string): Promise<{ authorized: boolean; role: string }> => {
  if (!isSupabaseReady) return { authorized: false, role: "" };
  const { data } = await supabase
    .from("authorized_users")
    .select("role, is_active")
    .eq("email", email)
    .eq("is_active", true)
    .single();
  if (!data) return { authorized: false, role: "" };
  return { authorized: true, role: data.role };
};

// ── Contact Submissions ──────────────────────────────────────────────────────

export const submitContactForm = async (
  data: Omit<ContactSubmission, "id" | "created_at" | "status">
) => {
  if (!isSupabaseReady) { console.warn("Supabase not configured"); return null; }
  const { data: result, error } = await supabase
    .from("contact_submissions")
    .insert([{ ...data, status: "new" }])
    .select()
    .single();
  if (error) throw error;
  return result;
};

export const updateSubmissionStatus = async (id: string, status: ContactSubmission["status"]) => {
  if (!isSupabaseReady) return;
  const { error } = await supabase
    .from("contact_submissions")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
};

// ── Authorized Users ─────────────────────────────────────────────────────────

export const getAuthorizedUsers = async () => {
  if (!isSupabaseReady) return [];
  const { data, error } = await supabase
    .from("authorized_users")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
};

export const addAuthorizedUser = async (user: Omit<AuthorizedUser, "id">) => {
  const { data, error } = await supabase
    .from("authorized_users")
    .insert([user])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const removeAuthorizedUser = async (id: string) => {
  const { error } = await supabase
    .from("authorized_users")
    .update({ is_active: false })
    .eq("id", id);
  if (error) throw error;
};

// ── Gallery ──────────────────────────────────────────────────────────────────

export const getGalleryPhotos = async (includeInactive = false) => {
  if (!isSupabaseReady) return [];
  let query = supabase
    .from("gallery_photos")
    .select("*")
    .order("sort_order", { ascending: true });
  if (!includeInactive) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const uploadGalleryPhoto = async (
  file: File,
  title: string,
  description: string,
  category: string,
  uploaderEmail: string
) => {
  if (!isSupabaseReady) throw new Error("Supabase not configured");
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const { error: uploadError } = await supabase.storage
    .from("gallery")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });
  if (uploadError) throw uploadError;
  const { data: { publicUrl } } = supabase.storage
    .from("gallery")
    .getPublicUrl(fileName);
  const { data, error } = await supabase
    .from("gallery_photos")
    .insert([{
      title, description, image_url: publicUrl,
      category, uploaded_by: uploaderEmail, is_active: true
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteGalleryPhoto = async (id: string, imageUrl: string) => {
  const fileName = imageUrl.split("/").pop();
  if (fileName) {
    await supabase.storage.from("gallery").remove([fileName]);
  }
  const { error } = await supabase
    .from("gallery_photos")
    .delete()
    .eq("id", id);
  if (error) throw error;
};
