import { Client } from 'pg';

const connectionString = 'postgresql://postgres:Bharani@301005@db.ppolrmntxvpkmoffqxmv.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

async function setup() {
  await client.connect();

  console.log('Creating menu_items table...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      price TEXT NOT NULL,
      category TEXT NOT NULL,
      theme TEXT NOT NULL,
      img TEXT,
      desc_text TEXT,
      tag TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  console.log('Creating cart_items table...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id TEXT NOT NULL,
      name TEXT NOT NULL,
      price NUMERIC NOT NULL,
      img TEXT,
      quantity INTEGER DEFAULT 1,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  console.log('Creating wishlist_items table...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS wishlist_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id TEXT NOT NULL,
      name TEXT NOT NULL,
      price NUMERIC NOT NULL,
      img TEXT,
      category TEXT,
      theme TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  console.log('Creating profiles table...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id TEXT UNIQUE NOT NULL,
      name TEXT,
      email TEXT,
      phone TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
  
  console.log('Creating addresses table...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS addresses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id TEXT UNIQUE NOT NULL,
      address_line1 TEXT,
      address_line2 TEXT,
      city TEXT,
      state TEXT,
      pincode TEXT,
      landmark TEXT,
      type TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  console.log('Tables created successfully!');
  await client.end();
}

setup().catch(console.error);
