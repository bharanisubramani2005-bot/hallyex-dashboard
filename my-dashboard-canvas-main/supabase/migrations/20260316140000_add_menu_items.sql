-- Create menu_items table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  category TEXT NOT NULL,
  theme TEXT NOT NULL,
  img TEXT,
  desc_text TEXT,
  tag TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on menu_items" ON public.menu_items;
CREATE POLICY "Allow public read on menu_items" ON public.menu_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on menu_items" ON public.menu_items;
CREATE POLICY "Allow public insert on menu_items" ON public.menu_items FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on menu_items" ON public.menu_items;
CREATE POLICY "Allow public update on menu_items" ON public.menu_items FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete on menu_items" ON public.menu_items;
CREATE POLICY "Allow public delete on menu_items" ON public.menu_items FOR DELETE USING (true);

DROP TRIGGER IF EXISTS update_menu_items_updated_at ON public.menu_items;
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
