import { create } from "zustand";

type GenerationMode = "auto" | "local-only" | "ai-only";

type RoadmapStore = {
  currentStep: "input" | "roadmap";
  jobDescription: string;
  extractedSkills: any;
  roadmap: any;
  source: "local" | "ai" | null;
  mode: GenerationMode;
  loading: boolean;
  error: string | null;

  setJobDescription: (desc: string) => void;
  setSkills: (skills: any) => void;
  setRoadmap: (roadmap: any, source?: "local" | "ai") => void;
  setStep: (step: "input" | "roadmap") => void;
  setMode: (mode: GenerationMode) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

export const useRoadmapStore = create<RoadmapStore>((set) => ({
  currentStep: "input",
  jobDescription: "",
  extractedSkills: null,
  roadmap: null,
  source: null,
  mode: "auto",
  loading: false,
  error: null,

  setJobDescription: (desc) => set({ jobDescription: desc }),
  setSkills: (skills) => set({ extractedSkills: skills }),
  setRoadmap: (roadmap, source) => set({ roadmap, source: source || null }),
  setStep: (step) => set({ currentStep: step }),
  setMode: (mode) => set({ mode }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      currentStep: "input",
      jobDescription: "",
      extractedSkills: null,
      roadmap: null,
      source: null,
      loading: false,
      error: null,
    }),
}));
