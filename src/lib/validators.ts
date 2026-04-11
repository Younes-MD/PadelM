import { z } from "zod";

export const racketSchema = z.object({
  title: z.string().min(3).max(200),
  brand: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  condition: z.enum(["new", "like_new", "good", "fair"]),
  price: z.number().positive().max(10000),
  description: z.string().min(10).max(5000),
  images: z.array(z.string().url()).default([]),
  weight: z.string().max(20).optional(),
  shape: z.enum(["round", "diamond", "teardrop"]).optional(),
  featured: z.boolean().default(false),
  sold: z.boolean().default(false),
});

export const submissionSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  phone: z.string().max(30).optional(),
  brand: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  condition: z.enum(["new", "like_new", "good", "fair"]),
  askingPrice: z.number().positive().max(10000).optional(),
  description: z.string().min(10).max(3000),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  phone: z.string().max(30).optional(),
  racketId: z.string().optional(),
  message: z.string().min(5).max(3000),
});

export const loginSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(1).max(100),
});

export const BRANDS = [
  "Adidas",
  "Babolat",
  "Bullpadel",
  "Head",
  "Nox",
  "StarVie",
  "Varlion",
  "Wilson",
  "Other",
] as const;

export const CONDITIONS = {
  new: "New",
  like_new: "Like New",
  good: "Good",
  fair: "Fair",
} as const;

export const SHAPES = {
  round: "Round (Control)",
  diamond: "Diamond (Power)",
  teardrop: "Teardrop (Hybrid)",
} as const;

export type RacketInput = z.infer<typeof racketSchema>;
export type SubmissionInput = z.infer<typeof submissionSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
