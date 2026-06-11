import { logger } from "@/utils/logger";
import { z } from "zod";

const successResponseShape = z.object({
  status: z.literal(200).optional(),
  data: z.any(),
});

const badDataResponseShape = z.object({
  status: z.literal(400),
  message: z.literal("Failed to create record."),
  data: z.record(
    z.string(),
    z.object({
      code: z.string(),
      message: z.string(),
    })
  ),
});

const ideaREsponseShape = z.object({
  status: z.literal(403),
  message: z.string(),
  data: z.any(),
});

const allResponseShape = z.union([successResponseShape, badDataResponseShape, ideaREsponseShape]);

export async function pbResponeErrorTrap<T>(response: Response) {
  if (response instanceof Error) {
    throw response;
  }

  const responseData = (await response.json()) as z.infer<typeof allResponseShape>;

  if (responseData.status === 400) {
    const fieldErrors = Object.entries(responseData.data)
      .map(([field, error]) => `${field}: ${error.message}`)
      .join(", ");
    throw new Error(`Validation failed - ${fieldErrors}`);
  }

  if (responseData.status === 403) {
    throw new Error(responseData.message);
  }

  return responseData as T
}
