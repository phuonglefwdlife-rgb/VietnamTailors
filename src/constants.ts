import { ClothingCategory, StyleOption } from "./types";

export const CATEGORIES: ClothingCategory[] = ['Blazer', 'Pants', 'Skirt', 'Shirt', 'Dress', 'Shorts', 'Maxi dress', 'Evening dress'];

export const MATERIALS = [
  { id: 'wool', name: 'Premium Wool', description: 'Classic, breathable, and elegant', colors: ['#1e293b', '#0f172a', '#334155'], buttons: ['Horn', 'Metal'] },
  { id: 'silk', name: 'Italian Silk', description: 'Smooth, luxurious, and lightweight', colors: ['#7f1d1d', '#581c87', '#1e1b4b'], buttons: ['Mother of Pearl', 'Cloth'] },
  { id: 'linen', name: 'Pure Linen', description: 'Crisp, airy, and relaxed', colors: ['#f8fafc', '#cbd5e1', '#94a3b8'], buttons: ['Wood', 'Ivory-tone'] },
  { id: 'cotton', name: 'Egyptian Cotton', description: 'Soft, durable, and versatile', colors: ['#ffffff', '#f1f5f9', '#e2e8f0'], buttons: ['Plastic', 'Metal'] },
];

export const COLORS = [
  { name: 'Midnight Navy', hex: '#1e293b' },
  { name: 'Charcoal Grey', hex: '#334155' },
  { name: 'Burgundy', hex: '#7f1d1d' },
  { name: 'Champagne', hex: '#fdf4ff' },
  { name: 'Forest Green', hex: '#064e3b' },
  { name: 'Classic Black', hex: '#0a0a0a' },
];

export const BUTTONS = [
  { name: 'Classic Horn', description: 'Natural texture, timeless' },
  { name: 'Polished Brass', description: 'Military style, bold' },
  { name: 'Mother of Pearl', description: 'Iridescent, formal' },
  { name: 'Matte Resin', description: 'Subtle, modern' },
];

export const INITIAL_STYLES: StyleOption[] = [
  { id: 'b1', name: 'Classic Blazer', category: 'Blazer', gender: 'Man', image: 'https://images.unsplash.com/photo-1594932224828-b4b059b6f68e?auto=format&fit=crop&q=80&w=800' },
  { id: 'b2', name: 'Chic Blazer', category: 'Blazer', gender: 'Woman', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800' },
  { id: 'p1', name: 'Slim Trousers', category: 'Pants', gender: 'Man', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800' },
  { id: 'p2', name: 'Wide Leg Pants', category: 'Pants', gender: 'Woman', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800' },
  { id: 's1', name: 'A-Line Skirt', category: 'Skirt', gender: 'Woman', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800' },
  { id: 'sh1', name: 'Oxford Shirt', category: 'Shirt', gender: 'Man', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800' },
  { id: 'sh2', name: 'Silk Blouse', category: 'Shirt', gender: 'Woman', image: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=800' },
  { id: 'd1', name: 'Cocktail Dress', category: 'Dress', gender: 'Woman', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800' },
  { id: 'sho1', name: 'Bermuda Shorts', category: 'Shorts', gender: 'Man', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800' },
  { id: 'm1', name: 'Silk Maxi', category: 'Maxi dress', gender: 'Woman', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800' },
  { id: 'e1', name: 'Gala Evening', category: 'Evening dress', gender: 'Woman', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800' },
];
