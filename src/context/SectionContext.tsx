import { createContext, useContext } from 'react';

const SectionContext = createContext<string | null>(null);

export const SectionProvider = SectionContext.Provider;

export function useCurrentSection() {
  return useContext(SectionContext);
}
