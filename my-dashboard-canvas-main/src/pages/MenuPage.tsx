import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MenuItem } from "@/types";

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<MenuItem>({
    name: "",
    price: "",
    category: "milkshake",
    theme: "default",
    img: "",
    desc: "",
    tag: "",
  });

  const fetchItems = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error("Failed to fetch menu items from Supabase", error);
      toast.error("Failed to load menu items");
    } else if (data) {
      setItems(data as MenuItem[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenNew = () => {
    setFormData({
      name: "",
      price: "",
      category: "milkshake",
      theme: "default",
      img: "",
      desc: "",
      tag: "",
    });
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setFormData(item);
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
        
      if (error) {
        toast.error("Failed to delete item: " + error.message);
      } else {
        toast.success("Item deleted successfully");
        fetchItems();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem && editingItem.id) {
      const { id, created_at, ...updateData } = formData as any;
      const { error } = await supabase
        .from('menu_items')
        .update(updateData)
        .eq('id', editingItem.id);
        
      if (error) {
        toast.error("Failed to update item: " + error.message);
      } else {
        toast.success("Item updated successfully");
        fetchItems();
        setDialogOpen(false);
      }
    } else {
      const { id, created_at, ...insertData } = formData as any;
      const { error } = await supabase
        .from('menu_items')
        .insert([insertData]);
        
      if (error) {
        toast.error("Failed to add item: " + error.message);
      } else {
        toast.success("Item added successfully");
        fetchItems();
        setDialogOpen(false);
      }
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto bg-slate-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage your digital menu items and categories.
          </p>
        </div>
        <Button onClick={handleOpenNew} className="bg-pink-500 hover:bg-pink-600">
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price (₹)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading menu items...
                  </div>
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No menu items found. Click "Add Item" to create one.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="h-10 w-10 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center">
                      {item.img ? (
                        <img src={item.img} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs text-muted-foreground">No img</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="capitalize">{item.category}</TableCell>
                  <TableCell>₹{item.price}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Edit2 className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => item.id && handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingItem !== null ? "Edit Item" : "Add New Item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Mango Magic"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  required
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="180"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="milkshake">Milkshake</SelectItem>
                    <SelectItem value="juice">Juice</SelectItem>
                    <SelectItem value="nutdrink">Nut Drink</SelectItem>
                    <SelectItem value="smoothie">Smoothie</SelectItem>
                    <SelectItem value="mojito">Mojito/Soda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                placeholder="Brief description..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="img">Image URL</Label>
              <Input
                id="img"
                type="url"
                value={formData.img}
                onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Theme Color</Label>
                <Select
                  value={formData.theme}
                  onValueChange={(val) => setFormData({ ...formData, theme: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mango">Mango (Amber)</SelectItem>
                    <SelectItem value="strawberry">Strawberry (Pink)</SelectItem>
                    <SelectItem value="choco">Chocolate (Brown)</SelectItem>
                    <SelectItem value="pista">Pistachio (Green)</SelectItem>
                    <SelectItem value="lagoon">Lagoon (Blue)</SelectItem>
                    <SelectItem value="mojito">Mint (Emerald)</SelectItem>
                    <SelectItem value="watermelon">Watermelon (Rose)</SelectItem>
                    <SelectItem value="berry">Berry (Purple)</SelectItem>
                    <SelectItem value="banana">Banana (Yellow)</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="apple">Apple (Green)</SelectItem>
                    <SelectItem value="pineapple">Pineapple (Yellow)</SelectItem>
                    <SelectItem value="lemon">Lemon (Yellow)</SelectItem>
                    <SelectItem value="coconut">Coconut (White)</SelectItem>
                    <SelectItem value="guava">Guava (Green)</SelectItem>
                    <SelectItem value="unicorn">Unicorn (Multi)</SelectItem>
                    <SelectItem value="default">Default (Yellow)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag">Tag (Optional)</Label>
                <Input
                  id="tag"
                  value={formData.tag || ""}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  placeholder="e.g. ⭐ Best Seller"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
                Save Item
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
