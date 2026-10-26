BEGIN;

UPDATE public.ppdb_settings
SET is_active = false
WHERE is_active = true
  AND (period_name, academic_year) <> ('PPDB Gelombang 1', '2026/2027');

INSERT INTO public.ppdb_settings (period_name, academic_year, open_date, close_date, is_active)
VALUES ('PPDB Gelombang 1', '2026/2027', '2026-10-26', '2026-12-25', true)
ON CONFLICT (period_name, academic_year) DO UPDATE SET
  open_date = EXCLUDED.open_date,
  close_date = EXCLUDED.close_date,
  is_active = EXCLUDED.is_active,
  updated_at = now();

COMMIT;
