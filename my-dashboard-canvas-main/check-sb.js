import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ppolrmntxvpkmoffqxmv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_hbAgnUPAaANpVewJnaaXYA_-KD9knUv';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('menu_items').select('*').limit(1);
  console.log('menu_items:', { data, error });

  const { data: oData, error: oError } = await supabase.from('customer_orders').select('*').limit(1);
  console.log('customer_orders:', { data: oData, error: oError });
}

check();
