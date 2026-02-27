export interface Item {
  id: string | number;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity?: number;
  stock?: number;
  min_price?: number;
  max_price?: number;
  sale_price?: number;
  itemTotal?: number;
  product_type?: string; // Add to support product_type
  [key: string]: unknown;
}

export interface UpdateItemInput {
  name?: string;
  slug?: string;
  image?: string;
  price?: number;
  quantity?: number;
  stock?: number;
  min_price?: number;
  max_price?: number;
  sale_price?: number;
  itemTotal?: number;
  product_type?: string;
  [key: string]: unknown; // Allow additional properties
}

export function addItemWithQuantity(
    items: Item[],
    item: Item,
    quantity: number,
) {
  if (quantity <= 0) throw new Error("cartQuantity can't be zero or less than zero");
  const existingItemIndex = items.findIndex(
      (existingItem) => existingItem.id === item.id,
  );

  if (existingItemIndex > -1) {
    const newItems = [...items];
    newItems[existingItemIndex].quantity = (newItems[existingItemIndex].quantity ?? 0) + quantity;
    return newItems;
  }
  return [...items, { ...item, quantity }];
}

export function removeItemOrQuantity(
    items: Item[],
    id: Item['id'],
    quantity: number,
) {
  return items.reduce((acc: Item[], item) => {
    if (item.id === id) {
      const newQuantity = (item.quantity ?? 0) - quantity;
      return newQuantity > 0
          ? [...acc, { ...item, quantity: newQuantity }]
          : [...acc];
    }
    return [...acc, item];
  }, []);
}

export function addItem(items: Item[], item: Item) {
  return [...items, item];
}

export function getItem(items: Item[], id: Item['id']) {
  return items.find((item) => item.id === id);
}

export function updateItem(
    items: Item[],
    id: Item['id'],
    item: UpdateItemInput,
) {
  return items.map((existingItem) =>
      existingItem.id === id ? { ...existingItem, ...item } : existingItem,
  );
}

export function removeItem(items: Item[], id: Item['id']) {
  return items.filter((existingItem) => existingItem.id !== id);
}

export function inStock(items: Item[], id: Item['id']) {
  const item = getItem(items, id);
  if (item) return (item.quantity ?? 0) < (item.stock ?? 0);
  return false;
}

export const calculateItemTotals = (items: Item[]) =>
    items.map((item) => ({
      ...item,
      itemTotal: item.price * (item.quantity ?? 0),
    }));

export const calculateTotal = (items: Item[]) =>
    items.reduce((total, item) => total + (item.quantity ?? 0) * item.price, 0);

export const calculateTotalItems = (items: Item[]) =>
    items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

export const calculateUniqueItems = (items: Item[]) => items.length;
