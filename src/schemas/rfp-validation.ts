import { z } from "zod";

// Step 1: Company Information
export const companyInfoSchema = z.object({
  company_name: z.string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(200, "Company name must be less than 200 characters"),
  contact_name: z.string()
    .trim()
    .min(2, "Contact name must be at least 2 characters")
    .max(100, "Contact name must be less than 100 characters"),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z.string()
    .trim()
    .regex(/^[\d\s\-\(\)\+]+$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be less than 20 characters"),
  title: z.string()
    .trim()
    .max(100, "Title must be less than 100 characters")
    .optional(),
});

// Step 2: Project Details
export const projectDetailsSchema = z.object({
  project_name: z.string()
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .max(300, "Project name must be less than 300 characters"),
  project_type: z.enum([
    "Commercial Construction",
    "Multi-Family Residential",
    "Institutional",
    "Industrial",
    "Renovation/Retrofit",
    "Building Envelope Restoration",
    "Other"
  ], { required_error: "Please select a project type" }),
  project_location: z.string()
    .trim()
    .min(3, "Project location must be at least 3 characters")
    .max(500, "Project location must be less than 500 characters"),
  estimated_value_range: z.enum([
    "Under $500K",
    "$500K - $1M",
    "$1M - $5M",
    "$5M - $10M",
    "$10M - $25M",
    "$25M+",
    "To Be Determined"
  ], { required_error: "Please select an estimated value range" }),
});

// Step 3: Timeline & Requirements
export const timelineRequirementsSchema = z.object({
  estimated_timeline: z.string()
    .trim()
    .min(2, "Please specify estimated timeline")
    .max(200, "Timeline must be less than 200 characters"),
  project_start_date: z.string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .optional()
    .or(z.literal("")),
  delivery_method: z.enum([
    "Specialty Contracting",
    "Design-Assist",
    "Multi-Trade Integration",
    "To Be Determined"
  ], { required_error: "Please select a delivery method" }),
  bonding_required: z.boolean().default(false),
  prequalification_complete: z.boolean().default(false),
});

// Step 4: Scope of Work
export const scopeOfWorkSchema = z.object({
  scope_of_work: z.string()
    .trim()
    .min(50, "Please provide at least 50 characters describing the scope of work")
    .max(5000, "Scope of work must be less than 5000 characters"),
  additional_requirements: z.string()
    .trim()
    .max(2000, "Additional requirements must be less than 2000 characters")
    .optional(),
  plans_available: z.boolean().default(false),
  site_visit_required: z.boolean().default(false),
  consent: z.boolean().refine((val) => val === true, { message: "You must consent to be contacted" }),
});

// Combined schema for final submission
export const rfpSubmissionSchema = companyInfoSchema
  .merge(projectDetailsSchema)
  .merge(timelineRequirementsSchema)
  .merge(scopeOfWorkSchema);

export type CompanyInfo = z.infer<typeof companyInfoSchema>;
export type ProjectDetails = z.infer<typeof projectDetailsSchema>;
export type TimelineRequirements = z.infer<typeof timelineRequirementsSchema>;
export type ScopeOfWork = z.infer<typeof scopeOfWorkSchema>;
export type RFPSubmission = z.infer<typeof rfpSubmissionSchema>;
