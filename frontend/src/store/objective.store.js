import { create } from 'zustand';

export const useObjectiveStore = create((set) => ({
  objectives: [],
  selectedObjective: null,
  filters: {
    teamId: null,
    status: null,
    ownerId: null,
  },
  
  setObjectives: (objectives) => set({ objectives }),
  
  setSelectedObjective: (objective) => set({ selectedObjective: objective }),
  
  addObjective: (objective) =>
    set((state) => ({ objectives: [objective, ...state.objectives] })),
  
  updateObjective: (id, updatedObjective) =>
    set((state) => ({
      objectives: state.objectives.map((obj) =>
        obj.id === id ? { ...obj, ...updatedObjective } : obj
      ),
      selectedObjective:
        state.selectedObjective?.id === id
          ? { ...state.selectedObjective, ...updatedObjective }
          : state.selectedObjective,
    })),
  
  deleteObjective: (id) =>
    set((state) => ({
      objectives: state.objectives.filter((obj) => obj.id !== id),
      selectedObjective: state.selectedObjective?.id === id ? null : state.selectedObjective,
    })),
  
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  
  clearFilters: () =>
    set({
      filters: {
        teamId: null,
        status: null,
        ownerId: null,
      },
    }),
}));
