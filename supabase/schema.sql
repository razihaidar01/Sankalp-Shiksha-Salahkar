-- ═══════════════════════════════════════════════════════════════════
-- SANKALP SHIKSHA SALAHKAR — COMPLETE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────────────────────────
-- TABLE 1: authorized_users
-- Gmail accounts allowed to access /admin
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS authorized_users (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  email        TEXT NOT NULL UNIQUE,
  name         TEXT,
  role         TEXT DEFAULT 'staff' CHECK (role IN ('owner', 'staff')),
  added_by     TEXT,
  is_active    BOOLEAN DEFAULT true
);

-- ⚠️ IMPORTANT: Change these emails before running!
-- Add the OWNER Gmail first:
INSERT INTO authorized_users (email, name, role) 
VALUES ('md.sankalpshikshasalahkar@gmail.com', 'Amit Kumar Upadhyay', 'owner')
ON CONFLICT (email) DO NOTHING;

-- Add DEVELOPER/TESTER Gmail (remove this after testing):
INSERT INTO authorized_users (email, name, role) 
VALUES ('razihaidar9342@gmail.com', 'Developer', 'Dev')
ON CONFLICT (email) DO NOTHING;

-- To add more staff later, use the /admin → Team tab in the website

-- ──────────────────────────────────────────────────────────────────
-- TABLE 2: contact_submissions
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_submissions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  name                TEXT NOT NULL,
  phone               TEXT NOT NULL,
  email               TEXT,
  city                TEXT,
  course              TEXT NOT NULL,
  college_preference  TEXT,
  class12_marks       TEXT,
  message             TEXT,
  status              TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','enrolled','closed')),
  notes               TEXT
);

-- ──────────────────────────────────────────────────────────────────
-- TABLE 3: college_inquiries
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS college_inquiries (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  name              TEXT NOT NULL,
  phone             TEXT NOT NULL,
  email             TEXT,
  college_name      TEXT NOT NULL,
  course_interested TEXT NOT NULL,
  message           TEXT,
  status            TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','enrolled','closed')),
  notes             TEXT
);

-- ──────────────────────────────────────────────────────────────────
-- TABLE 4: student_registrations
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS student_registrations (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  full_name          TEXT NOT NULL,
  phone              TEXT NOT NULL,
  email              TEXT,
  date_of_birth      DATE,
  gender             TEXT CHECK (gender IN ('Male','Female','Other')),
  city               TEXT,
  district           TEXT,
  state              TEXT DEFAULT 'Bihar',
  class10_marks      TEXT,
  class12_marks      TEXT,
  stream             TEXT,
  course_preferred   TEXT NOT NULL,
  college_preferred  TEXT,
  budget_range       TEXT,
  credit_card_needed BOOLEAN DEFAULT false,
  scholarship_needed BOOLEAN DEFAULT false,
  guardian_name      TEXT,
  guardian_phone     TEXT,
  status             TEXT DEFAULT 'new' CHECK (status IN ('new','counseling','shortlisted','applied','enrolled','closed')),
  assigned_counselor TEXT,
  notes              TEXT
);

-- ──────────────────────────────────────────────────────────────────
-- TABLE 5: gallery_photos
-- Photos uploaded by owner/staff
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_photos (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  title        TEXT NOT NULL,
  description  TEXT,
  image_url    TEXT NOT NULL,
  category     TEXT DEFAULT 'general',
  uploaded_by  TEXT,
  is_active    BOOLEAN DEFAULT true,
  sort_order   INTEGER DEFAULT 0
);

-- ──────────────────────────────────────────────────────────────────
-- STORAGE BUCKET for gallery photos
-- ──────────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────────
-- INDEXES
-- ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_contact_status  ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_active  ON gallery_photos(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON authorized_users(email);

-- ──────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ──────────────────────────────────────────────────────────────────
ALTER TABLE contact_submissions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_inquiries      ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_registrations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE authorized_users       ENABLE ROW LEVEL SECURITY;

-- Public can INSERT contact forms
CREATE POLICY "public_insert_contact"
  ON contact_submissions FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "public_insert_inquiry"
  ON college_inquiries FOR INSERT TO anon WITH CHECK (true);

-- Public can READ active gallery photos
CREATE POLICY "public_read_gallery"
  ON gallery_photos FOR SELECT TO anon USING (is_active = true);

-- Authenticated (logged-in via Google) can do everything
CREATE POLICY "auth_all_contact"
  ON contact_submissions FOR ALL TO authenticated USING (true);

CREATE POLICY "auth_all_inquiries"
  ON college_inquiries FOR ALL TO authenticated USING (true);

CREATE POLICY "auth_all_registrations"
  ON student_registrations FOR ALL TO authenticated USING (true);

CREATE POLICY "auth_all_gallery"
  ON gallery_photos FOR ALL TO authenticated USING (true);

CREATE POLICY "auth_read_users"
  ON authorized_users FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_insert_users"
  ON authorized_users FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "auth_update_users"
  ON authorized_users FOR UPDATE TO authenticated USING (true);

CREATE POLICY "auth_delete_users"
  ON authorized_users FOR DELETE TO authenticated USING (true);

-- Storage policies
CREATE POLICY "public_read_gallery_storage"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'gallery');

CREATE POLICY "auth_upload_gallery"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "auth_delete_gallery"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'gallery');

-- ──────────────────────────────────────────────────────────────────
-- Enable Google OAuth in Supabase:
-- Go to Authentication → Providers → Google → Enable
-- Add your Google Client ID and Secret
-- ──────────────────────────────────────────────────────────────────
