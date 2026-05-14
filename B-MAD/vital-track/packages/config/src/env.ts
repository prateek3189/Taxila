import { z } from "zod";

const urlOrLocalhost = z.union([
  z.string().url(),
  z.string().regex(/^https?:\/\/localhost(:\d+)?(\/.*)?$/),
]);

const DEV_JWT_FALLBACK = "vital-track-dev-jwt-secret-min-32-chars!!";

export const apiEnvSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  JWT_SECRET: z.preprocess(
    (val) => {
      if (typeof val === "string" && val.length >= 32) return val;
      if (process.env.NODE_ENV !== "production") return DEV_JWT_FALLBACK;
      return val;
    },
    z
      .string()
      .min(
        32,
        "JWT_SECRET must be at least 32 characters (set in .env or env; required in production)",
      ),
  ),
  CORS_ORIGIN: z
    .string()
    .min(1)
    .default("http://localhost:5173")
    .describe("Comma-separated list of allowed origins"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
  RATE_LIMIT_ADMIN_MAX: z.coerce.number().int().positive().default(60),
  SWAGGER_ENABLED: z
    .enum(["true", "false"])
    .default("true")
    .transform((v) => v === "true"),
  MONGODB_URI: z
    .string()
    .min(1)
    .default(
      "mongodb+srv://admin:admin3189@cluster0.pog16.mongodb.net/vital-track",
    ),
  JWT_ACCESS_EXPIRES_MIN: z.coerce.number().int().positive().default(15),
  JWT_REFRESH_EXPIRES_DAYS: z.coerce.number().int().positive().default(7),
  /** Separate secret for password-reset JWTs; falls back to JWT_SECRET if unset (dev only). */
  JWT_RESET_SECRET: z.string().min(32).optional(),
  PASSWORD_RESET_EXPIRES_MIN: z.coerce.number().int().positive().default(60),
});

export type ApiEnv = z.infer<typeof apiEnvSchema>;

export function parseApiEnv(raw: Record<string, string | undefined>): ApiEnv {
  return apiEnvSchema.parse(raw);
}

export const webEnvSchema = z.object({
  VITE_API_URL: urlOrLocalhost.default("http://localhost:3000"),
});

export type WebEnv = z.infer<typeof webEnvSchema>;

/** Validates Vite `import.meta.env` at runtime (keys are only available if prefixed with VITE_). */
export function parseWebEnv(raw: Record<string, string | undefined>): WebEnv {
  return webEnvSchema.parse(raw);
}

export const mobileEnvSchema = z.object({
  EXPO_PUBLIC_API_URL: urlOrLocalhost.default("http://localhost:3000"),
});

export type MobileEnv = z.infer<typeof mobileEnvSchema>;

export function parseMobileEnv(
  raw: Record<string, string | undefined>,
): MobileEnv {
  return mobileEnvSchema.parse(raw);
}
