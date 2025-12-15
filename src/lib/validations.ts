import { z } from "zod"

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").optional(),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const billUploadSchema = z.object({
  // Step 1: Basic Information
  sessionId: z.string().min(1, "Please select a session"),
  jurisdictionId: z.string().min(1, "Please select a jurisdiction"),
  billNumber: z.string().min(1, "Bill number is required"),
  title: z.string().min(1, "Title is required"),
  introducedDate: z.string().optional(),
  
  // Step 2: Document Upload
  file: z.instanceof(File).refine(
    (file) => file.size <= 10 * 1024 * 1024,
    "File size must be less than 10MB"
  ).refine(
    (file) => ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type),
    "Only PDF and DOCX files are allowed"
  ),
  
  // Step 3: Additional Details
  summary: z.string().optional(),
  primarySponsor: z.string().optional(),
  sponsors: z.string().optional(),
  committees: z.string().optional(),
  topics: z.string().optional(),
  status: z.enum(["INTRODUCED", "IN_COMMITTEE", "PASSED_COMMITTEE", "ON_FLOOR", "PASSED", "VETOED", "ENACTED", "FAILED", "WITHDRAWN"]).default("INTRODUCED"),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  assignedTo: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  relatedBillIds: z.array(z.string()).optional(),
})

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type BillUploadInput = z.infer<typeof billUploadSchema>

