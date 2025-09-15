// A central place for our application's type definitions.
// This keeps code clean and prevents type definitions from being duplicated.

export interface Variant {
  id: string;
  name: string;
  trafficSplit: number;
  isControl: boolean;
  experimentId: string;
}

export interface Experiment {
  id: string;
  name: string;
  description: string | null;
  status: string;
  variants: Variant[];
}
