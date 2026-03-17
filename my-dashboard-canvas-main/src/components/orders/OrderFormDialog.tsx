import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  COUNTRIES,
  PRODUCTS,
  STATUSES,
  CREATED_BY_OPTIONS,
  type OrderFormData,
  type CustomerOrder,
} from "@/types";

const schema = z.object({
  first_name: z.string().min(1, "Please fill the field"),
  last_name: z.string().min(1, "Please fill the field"),
  email: z.string().min(1, "Please fill the field").email("Invalid email"),
  phone: z.string().min(1, "Please fill the field"),
  street_address: z.string().min(1, "Please fill the field"),
  city: z.string().min(1, "Please fill the field"),
  state: z.string().min(1, "Please fill the field"),
  postal_code: z.string().min(1, "Please fill the field"),
  country: z.string().min(1, "Please fill the field"),
  product: z.string().min(1, "Please fill the field"),
  quantity: z.coerce.number().min(1, "Cannot be less than 1"),
  unit_price: z.coerce.number().min(0, "Please fill the field"),
  total_amount: z.number(),
  status: z.string().min(1, "Please fill the field"),
  created_by: z.string().min(1, "Please fill the field"),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: OrderFormData) => void;
  editOrder?: CustomerOrder | null;
  isLoading?: boolean;
}

export function OrderFormDialog({
  open,
  onOpenChange,
  onSubmit,
  editOrder,
  isLoading,
}: Props) {
  const form = useForm<OrderFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      street_address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      product: "",
      quantity: 1,
      unit_price: 0,
      total_amount: 0,
      status: "Pending",
      created_by: "",
    },
  });

  const quantity = form.watch("quantity");
  const unitPrice = form.watch("unit_price");

  useEffect(() => {
    form.setValue("total_amount", (quantity || 0) * (unitPrice || 0));
  }, [quantity, unitPrice, form]);

  useEffect(() => {
    if (editOrder) {
      form.reset({
        first_name: editOrder.first_name,
        last_name: editOrder.last_name,
        email: editOrder.email,
        phone: editOrder.phone,
        street_address: editOrder.street_address,
        city: editOrder.city,
        state: editOrder.state,
        postal_code: editOrder.postal_code,
        country: editOrder.country,
        product: editOrder.product,
        quantity: editOrder.quantity,
        unit_price: editOrder.unit_price,
        total_amount: editOrder.total_amount,
        status: editOrder.status,
        created_by: editOrder.created_by,
      });
    } else {
      form.reset();
    }
  }, [editOrder, open, form]);

  const handleSubmit = (data: OrderFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editOrder ? "Edit Order" : "Create Order"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="first_name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="last_name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl><Input type="email" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="street_address" render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Street Address *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="state" render={({ field }) => (
                  <FormItem>
                    <FormLabel>State / Province *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="postal_code" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal code *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="country" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COUNTRIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <Separator />

            {/* Order Information */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Order Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="product" render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Choose product *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRODUCTS.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="quantity" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity *</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} onChange={(e) => field.onChange(Math.max(1, Number(e.target.value)))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="unit_price" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit price ($) *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input type="number" step="0.01" className="pl-7" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="total_amount" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input className="pl-7 bg-muted" readOnly value={field.value.toFixed(2)} />
                      </div>
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="created_by" render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Created by *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select creator" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CREATED_BY_OPTIONS.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {editOrder ? "Save Changes" : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
