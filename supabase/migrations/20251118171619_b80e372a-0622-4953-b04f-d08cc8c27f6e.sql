-- Create resume_submissions table
CREATE TABLE public.resume_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT NOT NULL,
  cover_letter TEXT,
  position_applied TEXT,
  status TEXT DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id)
);

-- Enable RLS
ALTER TABLE public.resume_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit resumes
CREATE POLICY "Anyone can submit resumes"
ON public.resume_submissions
FOR INSERT
WITH CHECK (true);

-- Allow admins to view and manage all resumes
CREATE POLICY "Admins full access to resumes"
ON public.resume_submissions
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Create trigger to notify admins of new resume submissions
CREATE OR REPLACE FUNCTION public.notify_new_resume()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM notify_admins(
    'resume',
    NEW.id,
    'New Resume Submission',
    'New resume from ' || NEW.applicant_name || ' for ' || COALESCE(NEW.position_applied, 'general position')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_resume_submission
  AFTER INSERT ON public.resume_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_resume();