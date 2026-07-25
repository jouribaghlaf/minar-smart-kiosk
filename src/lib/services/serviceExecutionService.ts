import { SERVICE_CATALOG, type ServiceDefinition } from "@/lib/mock-data/serviceCatalog";
import { generateId } from "@/lib/mock-data/store";

export interface ServiceExecutionResult {
  success: boolean;
  service: string;
  reference: string;
  titleAr: string;
  titleEn: string;
  resultAr: string[];
  resultEn: string[];
  errors?: Record<string, string>;
}

export function getServiceTool(slug: string): ServiceDefinition | null {
  return SERVICE_CATALOG[slug] ?? null;
}

/** Every catalog entry automatically becomes available to self-service and the AI Agent. */
export function listServiceTools(): ServiceDefinition[] {
  return Object.values(SERVICE_CATALOG);
}

export async function executeServiceTool(slug: string, values: Record<string, string>): Promise<ServiceExecutionResult> {
  const definition = getServiceTool(slug);
  if (!definition) throw new Error("SERVICE_NOT_FOUND");

  const missing = definition.fields.filter((field) => field.required && !values[field.id]?.trim());
  if (missing.length) {
    return {
      success: false,
      service: slug,
      reference: "",
      titleAr: definition.titleAr,
      titleEn: definition.titleEn,
      resultAr: [],
      resultEn: [],
      errors: Object.fromEntries(missing.map((field) => [field.id, "هذا الحقل مطلوب"])),
    };
  }

  const prefix = slug === "complaints" ? "CMP" : slug === "lost-items" ? "LF" : slug === "lost-person" ? "MP" : slug === "queue" ? "M" : "MNR";
  const reference = `${prefix}-${generateId("").replaceAll("_", "").slice(0, 6).toUpperCase()}`;
  return {
    success: true,
    service: slug,
    reference,
    titleAr: definition.titleAr,
    titleEn: definition.titleEn,
    resultAr: [`الرقم المرجعي: ${reference}`, ...definition.mockResultAr],
    resultEn: [`Reference: ${reference}`, ...definition.mockResultEn],
  };
}
