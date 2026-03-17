const { Client } = require('pg');

const client = new Client({
  host: '2406:da1a:6b0:f60c:bbda:3776:3532:e135',
  port: 5432,
  user: 'postgres',
  password: 'Bharani@301005',
  database: 'postgres',
});

async function main() {
  await client.connect();
  
  try {
    // Create menu_items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        price TEXT NOT NULL,
        category TEXT NOT NULL,
        theme TEXT,
        img TEXT,
        "desc" TEXT,
        tag TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('menu_items table created or already exists');

    // Create a simple admin_sessions table to replace local storage for login
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        token TEXT UNIQUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('admin_sessions table created or already exists');

    // Seed data if empty
    const res = await client.query('SELECT COUNT(*) FROM menu_items');
    if (parseInt(res.rows[0].count) === 0) {
      const seedData = [
            // Milkshakes
            { name: "Rosemilk", price: "150", category: "milkshake", theme: "strawberry", img: "https://i.pinimg.com/1200x/49/e9/0c/49e90c3e7a08474e057912b5e5a6ce3e.jpg", desc: "Rich chocolate blending with thick vanilla ice cream." },
            { name: "Strawberry Bliss", price: "160", category: "milkshake", theme: "strawberry", img: "https://i.pinimg.com/736x/02/9d/7d/029d7d0ad24b28f8effba1da2a093442.jpg", desc: "Real strawberries, sweet cream." },
            { name: "Oreo Overload", price: "190", category: "milkshake", theme: "choco", img: "https://i.pinimg.com/736x/0f/0d/24/0f0d24fa75d2c4cc73945be745f9d314.jpg", desc: "Crunchy cookie crumbles in a milk base." },
            { name: "Mango Madness", price: "170", category: "milkshake", theme: "mango", img: "https://i.pinimg.com/736x/72/5d/12/725d1227c954edc01e48fb85b94acd35.jpg", desc: "Fresh Alphonso pulp, creamy delight." },
            { name: "Banana Classic", price: "130", category: "milkshake", theme: "banana", img: "https://i.pinimg.com/736x/5d/34/3b/5d343b333d2e0a87c7b115fa70897c24.jpg", desc: "Classic sweet banana and milk blend." },
            { name: "Blueberry Burst", price: "180", category: "milkshake", theme: "berry", img: "https://i.pinimg.com/736x/ef/7d/0d/ef7d0d3dff62bd9bda2ff8216e72f1b9.jpg", desc: "Tangy blueberries with sweet cream." },
            { name: "Peanut Butter Shake", price: "190", category: "milkshake", theme: "choco", img: "https://i.pinimg.com/1200x/a1/57/20/a15720c5701158b982ef452104e7f157.jpg", desc: "Thick peanut butter fusion." },
            // Nut Drinks
            { name: "Badam Milk", price: "140", category: "nutdrink", theme: "pista", img: "https://images.pexels.com/photos/2113915/pexels-photo-2113915.jpeg", desc: "Warm almond milk with saffron.", tag: "🛡️ Immunity Boost" },
            { name: "Pista Shake", price: "160", category: "nutdrink", theme: "pista", img: "https://i.pinimg.com/736x/e2/58/06/e258060b0f6e4664820b52990e8e2b5b.jpg", desc: "Rich roasted pistachios blended thick.", tag: "💪 Protein Rich" },
            { name: "Dates & Walnut", price: "210", category: "nutdrink", theme: "choco", img: "https://i.pinimg.com/1200x/34/27/10/342710d0af4358d61322329c09cbc494.jpg", desc: "Natural sugar strings and crunch.", tag: "⚡ Energy Booster" },
            { name: "Dry Fruit Special", price: "250", category: "nutdrink", theme: "mango", img: "https://i.pinimg.com/736x/fb/a0/bc/fba0bcbf553d18b190f8c1d4a68e2ada.jpg", desc: "The ultimate nut collection in a glass.", tag: "👑 Premium Choice" },
            // Juices
            { name: "Fresh Orange", price: "120", category: "juice", theme: "orange", img: "https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg", desc: "Cold-pressed Nagpur oranges." },
            { name: "Fresh Apple", price: "130", category: "juice", theme: "apple", img: "https://i.pinimg.com/736x/7d/0b/4e/7d0b4ebbb876ac69a112ecc0d4fb9e9e.jpg", desc: "Sweet Shimla apples pressed fresh." },
            { name: "Watermelon Chill", price: "100", category: "juice", theme: "watermelon", img: "https://i.pinimg.com/736x/16/16/30/161630d2788574a0434cefb14fc43fd4.jpg", desc: "Ice-cold hydrating watermelon juice." },
            { name: "Pineapple Punch", price: "110", category: "juice", theme: "pineapple", img: "https://i.pinimg.com/736x/96/84/db/9684db93d77b3819d899303c909cf806.jpg", desc: "Tropical sweet and sour fruit juice." },
            // Soda & Mojitos
            { name: "Mint Mojito", price: "110", category: "mojito", theme: "mojito", img: "https://images.pexels.com/photos/7259042/pexels-photo-7259042.jpeg", desc: "Classic mint and lime refreshing splash." },
            { name: "Blue Lagoon", price: "150", category: "mojito", theme: "lagoon", img: "https://i.pinimg.com/736x/27/8c/ff/278cff54998b3a790f4be858df2c7ffd.jpg", desc: "The ultimate blue citrus refresher." },
            { name: "Lemon Soda", price: "80", category: "mojito", theme: "lemon", img: "https://i.pinimg.com/736x/f2/3c/bd/f23cbdd8ef4dbea21ff7d4857422994f.jpg", desc: "Salt sweet fizz of lemon." },
            { name: "Green Apple Soda", price: "120", category: "mojito", theme: "apple", img: "https://i.pinimg.com/1200x/f7/01/1b/f7011b8ec27d98698e0d3dbfec17a754.jpg", desc: "Tangy green apple sparkling fizz." },
            // Smoothies
            { name: "Cosmic Coconut Smoothie", price: "190", category: "smoothie", theme: "coconut", img: "https://i.pinimg.com/736x/17/fb/d8/17fbd809f70dbd5bf7b26450d58f52a4.jpg", desc: "Thick creamy coconut and banana blend.", tag: "🥥 Tropical" },
            { name: "Raspberry Smoothie", price: "210", category: "smoothie", theme: "berry", img: "https://i.pinimg.com/736x/68/02/02/680202948b013ae47a4f7ce5c3102136.jpg", desc: "Mixed berries loaded with antioxidants.", tag: "✨ Fresh" },
            { name: "Velvet Tropica Smoothie", price: "200", category: "smoothie", theme: "mango", img: "https://i.pinimg.com/736x/98/a6/97/98a697fd2edc0ce8a2e097125c324edf.jpg", desc: "Mango, pineapple and passion fruit velvet.", tag: "🌴 Exotic" },
            { name: "Frosted Sunrise Smoothie", price: "180", category: "smoothie", theme: "orange", img: "https://i.pinimg.com/736x/43/81/e3/4381e3db535e05997e88f3e4fe420678.jpg", desc: "Orange, peach and icy yogurt sunrise.", tag: "🌅 Morning Boost" },
            { name: "Emerald Energy Smoothie", price: "220", category: "smoothie", theme: "guava", img: "https://i.pinimg.com/736x/e6/63/16/e66316f55a796ccc9f7cbf337372b328.jpg", desc: "Spinach, kiwi, and green apple detox.", tag: "🌿 Detox" },
            { name: "Unicorn Smoothie", price: "200", category: "smoothie", theme: "unicorn", img: "https://i.pinimg.com/736x/a9/e6/e1/a9e6e14026787f6735507a1c9ddd10fb.jpg", desc: "Thick golden mango glowing smoothie.", tag: "⭐ Energy Boost" }
        ];

      for (const item of seedData) {
        await client.query(
          'INSERT INTO menu_items (name, price, category, theme, img, "desc", tag) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [item.name, item.price, item.category, item.theme, item.img, item.desc, item.tag || null]
        );
      }
      console.log('Seed data inserted');
    }

    // Set policies
    await client.query(`
      ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Public can view menu_items" ON menu_items;
      CREATE POLICY "Public can view menu_items" ON menu_items FOR SELECT USING (true);
      
      DROP POLICY IF EXISTS "Public can insert menu_items" ON menu_items;
      CREATE POLICY "Public can insert menu_items" ON menu_items FOR INSERT WITH CHECK (true);
      
      DROP POLICY IF EXISTS "Public can update menu_items" ON menu_items;
      CREATE POLICY "Public can update menu_items" ON menu_items FOR UPDATE USING (true);
      
      DROP POLICY IF EXISTS "Public can delete menu_items" ON menu_items;
      CREATE POLICY "Public can delete menu_items" ON menu_items FOR DELETE USING (true);
    `);
    
    await client.query(`
      ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Public can manage admin_sessions" ON admin_sessions;
      CREATE POLICY "Public can manage admin_sessions" ON admin_sessions FOR ALL USING (true);
    `);

    console.log('Policies set');
  } catch (err) {
    console.error('Error', err);
  } finally {
    await client.end();
  }
}

main();
