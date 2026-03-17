-- Create menu_items table
CREATE TABLE public.menu_items (
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

-- Insert initial menu seed data
INSERT INTO public.menu_items (name, price, category, theme, img, "desc", tag) VALUES 
('Rosemilk', '150', 'milkshake', 'strawberry', 'https://i.pinimg.com/1200x/49/e9/0c/49e90c3e7a08474e057912b5e5a6ce3e.jpg', 'Rich chocolate blending with thick vanilla ice cream.', NULL),
('Strawberry Bliss', '160', 'milkshake', 'strawberry', 'https://i.pinimg.com/736x/02/9d/7d/029d7d0ad24b28f8effba1da2a093442.jpg', 'Real strawberries, sweet cream.', NULL),
('Oreo Overload', '190', 'milkshake', 'choco', 'https://i.pinimg.com/736x/0f/0d/24/0f0d24fa75d2c4cc73945be745f9d314.jpg', 'Crunchy cookie crumbles in a milk base.', NULL),
('Mango Madness', '170', 'milkshake', 'mango', 'https://i.pinimg.com/736x/72/5d/12/725d1227c954edc01e48fb85b94acd35.jpg', 'Fresh Alphonso pulp, creamy delight.', NULL),
('Banana Classic', '130', 'milkshake', 'banana', 'https://i.pinimg.com/736x/5d/34/3b/5d343b333d2e0a87c7b115fa70897c24.jpg', 'Classic sweet banana and milk blend.', NULL),
('Blueberry Burst', '180', 'milkshake', 'berry', 'https://i.pinimg.com/736x/ef/7d/0d/ef7d0d3dff62bd9bda2ff8216e72f1b9.jpg', 'Tangy blueberries with sweet cream.', NULL),
('Peanut Butter Shake', '190', 'milkshake', 'choco', 'https://i.pinimg.com/1200x/a1/57/20/a15720c5701158b982ef452104e7f157.jpg', 'Thick peanut butter fusion.', NULL),
('Badam Milk', '140', 'nutdrink', 'pista', 'https://images.pexels.com/photos/2113915/pexels-photo-2113915.jpeg', 'Warm almond milk with saffron.', '🛡️ Immunity Boost'),
('Pista Shake', '160', 'nutdrink', 'pista', 'https://i.pinimg.com/736x/e2/58/06/e258060b0f6e4664820b52990e8e2b5b.jpg', 'Rich roasted pistachios blended thick.', '💪 Protein Rich'),
('Dates & Walnut', '210', 'nutdrink', 'choco', 'https://i.pinimg.com/1200x/34/27/10/342710d0af4358d61322329c09cbc494.jpg', 'Natural sugar strings and crunch.', '⚡ Energy Booster'),
('Dry Fruit Special', '250', 'nutdrink', 'mango', 'https://i.pinimg.com/736x/fb/a0/bc/fba0bcbf553d18b190f8c1d4a68e2ada.jpg', 'The ultimate nut collection in a glass.', '👑 Premium Choice'),
('Fresh Orange', '120', 'juice', 'orange', 'https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg', 'Cold-pressed Nagpur oranges.', NULL),
('Fresh Apple', '130', 'juice', 'apple', 'https://i.pinimg.com/736x/7d/0b/4e/7d0b4ebbb876ac69a112ecc0d4fb9e9e.jpg', 'Sweet Shimla apples pressed fresh.', NULL),
('Watermelon Chill', '100', 'juice', 'watermelon', 'https://i.pinimg.com/736x/16/16/30/161630d2788574a0434cefb14fc43fd4.jpg', 'Ice-cold hydrating watermelon juice.', NULL),
('Pineapple Punch', '110', 'juice', 'pineapple', 'https://i.pinimg.com/736x/96/84/db/9684db93d77b3819d899303c909cf806.jpg', 'Tropical sweet and sour fruit juice.', NULL),
('Mint Mojito', '110', 'mojito', 'mojito', 'https://images.pexels.com/photos/7259042/pexels-photo-7259042.jpeg', 'Classic mint and lime refreshing splash.', NULL),
('Blue Lagoon', '150', 'mojito', 'lagoon', 'https://i.pinimg.com/736x/27/8c/ff/278cff54998b3a790f4be858df2c7ffd.jpg', 'The ultimate blue citrus refresher.', NULL),
('Lemon Soda', '80', 'mojito', 'lemon', 'https://i.pinimg.com/736x/f2/3c/bd/f23cbdd8ef4dbea21ff7d4857422994f.jpg', 'Salt sweet fizz of lemon.', NULL),
('Green Apple Soda', '120', 'mojito', 'apple', 'https://i.pinimg.com/1200x/f7/01/1b/f7011b8ec27d98698e0d3dbfec17a754.jpg', 'Tangy green apple sparkling fizz.', NULL),
('Cosmic Coconut Smoothie', '190', 'smoothie', 'coconut', 'https://i.pinimg.com/736x/17/fb/d8/17fbd809f70dbd5bf7b26450d58f52a4.jpg', 'Thick creamy coconut and banana blend.', '🥥 Tropical'),
('Raspberry Smoothie', '210', 'smoothie', 'berry', 'https://i.pinimg.com/736x/68/02/02/680202948b013ae47a4f7ce5c3102136.jpg', 'Mixed berries loaded with antioxidants.', '✨ Fresh'),
('Velvet Tropica Smoothie', '200', 'smoothie', 'mango', 'https://i.pinimg.com/736x/98/a6/97/98a697fd2edc0ce8a2e097125c324edf.jpg', 'Mango, pineapple and passion fruit velvet.', '🌴 Exotic'),
('Frosted Sunrise Smoothie', '180', 'smoothie', 'orange', 'https://i.pinimg.com/736x/43/81/e3/4381e3db535e05997e88f3e4fe420678.jpg', 'Orange, peach and icy yogurt sunrise.', '🌅 Morning Boost'),
('Emerald Energy Smoothie', '220', 'smoothie', 'guava', 'https://i.pinimg.com/736x/e6/63/16/e66316f55a796ccc9f7cbf337372b328.jpg', 'Spinach, kiwi, and green apple detox.', '🌿 Detox'),
('Unicorn Smoothie', '200', 'smoothie', 'unicorn', 'https://i.pinimg.com/736x/a9/e6/e1/a9e6e14026787f6735507a1c9ddd10fb.jpg', 'Thick golden mango glowing smoothie.', '⭐ Energy Boost');

-- Create admin_sessions table to replace local storage for login status
CREATE TABLE public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Public access policies for menu_items
CREATE POLICY "Allow public read on menu_items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert on menu_items" ON public.menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on menu_items" ON public.menu_items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on menu_items" ON public.menu_items FOR DELETE USING (true);

-- Public access policies for admin_sessions
CREATE POLICY "Allow public read on admin_sessions" ON public.admin_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on admin_sessions" ON public.admin_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on admin_sessions" ON public.admin_sessions FOR DELETE USING (true);
