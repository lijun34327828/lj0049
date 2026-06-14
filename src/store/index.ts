import { create } from 'zustand';
import {
  AppState,
  AppActions,
  ComponentConfig,
  ComponentState,
  ColorConfig,
  EffectConfig,
  SizeConfig,
  InteractionConfig,
  createDefaultButton,
  createDefaultIcon,
} from '@/types';

type Store = AppState & AppActions;

const initialComponents: ComponentConfig[] = [
  createDefaultButton('btn-1'),
  createDefaultIcon('icon-1'),
];

export const useStore = create<Store>((set, get) => ({
  selectedId: 'btn-1',
  components: initialComponents,
  selectedState: 'default',
  activeTab: 'style',

  selectComponent: (id) => set({ selectedId: id }),

  updateComponent: (id, updates) =>
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, ...updates } as ComponentConfig : c
      ),
    })),

  addComponent: (component) =>
    set((state) => ({
      components: [...state.components, component],
      selectedId: component.id,
    })),

  removeComponent: (id) =>
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),

  setSelectedState: (state) => set({ selectedState: state }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setStateStyles: (id, componentState, updates) =>
    set((state) => ({
      components: state.components.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          styles: {
            ...c.styles,
            [componentState]: {
              ...c.styles[componentState],
              ...updates,
            },
          },
        } as ComponentConfig;
      }),
    })),

  setSize: (id, updates) =>
    set((state) => ({
      components: state.components.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          size: {
            ...c.size,
            ...updates,
          },
        } as ComponentConfig;
      }),
    })),

  setInteraction: (id, updates) =>
    set((state) => ({
      components: state.components.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          interaction: {
            ...c.interaction,
            ...updates,
          },
        } as ComponentConfig;
      }),
    })),

  setComponents: (components) => set({ components }),
}));

export const useSelectedComponent = () => {
  const { selectedId, components } = useStore();
  return components.find((c) => c.id === selectedId) || null;
};

export const broadcastState = (ws: WebSocket | null) => {
  const state = useStore.getState();
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        type: 'state_sync',
        payload: {
          components: state.components,
          selectedId: state.selectedId,
        },
      })
    );
  }
};
