-- Create customer_orders table
CREATE TABLE IF NOT EXISTS public.customer_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  product TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_by TEXT NOT NULL,
  order_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dashboard_configs table
CREATE TABLE IF NOT EXISTS public.dashboard_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Default Dashboard',
  layout JSONB NOT NULL DEFAULT '[]'::jsonb,
  widgets JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.customer_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_configs ENABLE ROW LEVEL SECURITY;

-- Public access policies for customer_orders
DROP POLICY IF EXISTS "Allow public read on customer_orders" ON public.customer_orders;
CREATE POLICY "Allow public read on customer_orders" ON public.customer_orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on customer_orders" ON public.customer_orders;
CREATE POLICY "Allow public insert on customer_orders" ON public.customer_orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on customer_orders" ON public.customer_orders;
CREATE POLICY "Allow public update on customer_orders" ON public.customer_orders FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete on customer_orders" ON public.customer_orders;
CREATE POLICY "Allow public delete on customer_orders" ON public.customer_orders FOR DELETE USING (true);

-- Public access policies for dashboard_configs
DROP POLICY IF EXISTS "Allow public read on dashboard_configs" ON public.dashboard_configs;
CREATE POLICY "Allow public read on dashboard_configs" ON public.dashboard_configs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on dashboard_configs" ON public.dashboard_configs;
CREATE POLICY "Allow public insert on dashboard_configs" ON public.dashboard_configs FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on dashboard_configs" ON public.dashboard_configs;
CREATE POLICY "Allow public update on dashboard_configs" ON public.dashboard_configs FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete on dashboard_configs" ON public.dashboard_configs;
CREATE POLICY "Allow public delete on dashboard_configs" ON public.dashboard_configs FOR DELETE USING (true);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_customer_orders_updated_at ON public.customer_orders;
CREATE TRIGGER update_customer_orders_updated_at
  BEFORE UPDATE ON public.customer_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_dashboard_configs_updated_at ON public.dashboard_configs;
CREATE TRIGGER update_dashboard_configs_updated_at
  BEFORE UPDATE ON public.dashboard_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for customer_orders
-- (If publication already contains the table, dropping and re-adding handles the error simply,
-- or we can just safely ignore it. A safer way is to check first or just don't try to add if it's there, but standard SQL doesn't have an 'ADD TABLE IF NOT EXISTS' for publications)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'customer_orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_orders;
  END IF;
END $$;