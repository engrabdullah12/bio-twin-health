
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- DNA uploads table
CREATE TABLE public.dna_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  status TEXT NOT NULL DEFAULT 'processing',
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.dna_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own dna uploads" ON public.dna_uploads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own dna uploads" ON public.dna_uploads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own dna uploads" ON public.dna_uploads FOR DELETE USING (auth.uid() = user_id);

-- Wearable data table
CREATE TABLE public.wearable_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_type TEXT NOT NULL,
  heart_rate NUMERIC,
  glucose NUMERIC,
  sleep_score NUMERIC,
  cortisol NUMERIC,
  steps INTEGER,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wearable_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wearable data" ON public.wearable_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wearable data" ON public.wearable_data FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Medication history table
CREATE TABLE public.medication_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  drug_name TEXT NOT NULL,
  compatibility_score INTEGER NOT NULL,
  risks JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  interactions JSONB DEFAULT '[]'::jsonb,
  simulated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.medication_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own medication history" ON public.medication_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own medication history" ON public.medication_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own medication history" ON public.medication_history FOR DELETE USING (auth.uid() = user_id);

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for DNA files
INSERT INTO storage.buckets (id, name, public) VALUES ('dna-files', 'dna-files', false);

CREATE POLICY "Users can upload own dna files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'dna-files' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own dna files" ON storage.objects FOR SELECT USING (bucket_id = 'dna-files' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own dna files" ON storage.objects FOR DELETE USING (bucket_id = 'dna-files' AND auth.uid()::text = (storage.foldername(name))[1]);
