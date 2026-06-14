export type ComponentState = 'default' | 'hover' | 'active';

export type ComponentType = 'button' | 'icon';

export type InteractionType = 'none' | 'navigate' | 'modal' | 'alert';

export interface SizeConfig {
  width: number;
  height: number;
  paddingX: number;
  paddingY: number;
  fontSize: number;
  iconSize: number;
}

export interface ColorConfig {
  background: string;
  color: string;
  borderColor: string;
  borderWidth: number;
}

export interface EffectConfig {
  borderRadius: number;
  boxShadow: string;
  opacity: number;
  scale: number;
  transition: number;
}

export interface StateStyles {
  default: ColorConfig & EffectConfig;
  hover: ColorConfig & EffectConfig;
  active: ColorConfig & EffectConfig;
}

export interface InteractionConfig {
  type: InteractionType;
  navigateUrl?: string;
  modalTitle?: string;
  modalContent?: string;
  alertMessage?: string;
}

export interface ButtonConfig {
  id: string;
  type: 'button';
  label: string;
  size: SizeConfig;
  styles: StateStyles;
  interaction: InteractionConfig;
  iconName?: string;
  iconPosition: 'left' | 'right' | 'none';
}

export interface IconConfig {
  id: string;
  type: 'icon';
  iconName: string;
  size: SizeConfig;
  styles: StateStyles;
  interaction: InteractionConfig;
}

export type ComponentConfig = ButtonConfig | IconConfig;

export interface AppState {
  selectedId: string | null;
  components: ComponentConfig[];
  selectedState: ComponentState;
  activeTab: 'style' | 'interaction';
}

export interface AppActions {
  selectComponent: (id: string | null) => void;
  updateComponent: (id: string, updates: Partial<ComponentConfig>) => void;
  addComponent: (component: ComponentConfig) => void;
  removeComponent: (id: string) => void;
  setSelectedState: (state: ComponentState) => void;
  setActiveTab: (tab: 'style' | 'interaction') => void;
  setStateStyles: (id: string, state: ComponentState, updates: Partial<ColorConfig & EffectConfig>) => void;
  setSize: (id: string, updates: Partial<SizeConfig>) => void;
  setInteraction: (id: string, updates: Partial<InteractionConfig>) => void;
  setComponents: (components: ComponentConfig[]) => void;
}

export const createDefaultButton = (id: string): ButtonConfig => ({
  id,
  type: 'button',
  label: '按钮',
  iconPosition: 'none',
  size: {
    width: 0,
    height: 0,
    paddingX: 24,
    paddingY: 12,
    fontSize: 14,
    iconSize: 16,
  },
  styles: {
    default: {
      background: '#3b82f6',
      color: '#ffffff',
      borderColor: 'transparent',
      borderWidth: 0,
      borderRadius: 8,
      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      opacity: 1,
      scale: 1,
      transition: 150,
    },
    hover: {
      background: '#2563eb',
      color: '#ffffff',
      borderColor: 'transparent',
      borderWidth: 0,
      borderRadius: 8,
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      opacity: 1,
      scale: 1.02,
      transition: 150,
    },
    active: {
      background: '#1d4ed8',
      color: '#ffffff',
      borderColor: 'transparent',
      borderWidth: 0,
      borderRadius: 8,
      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      opacity: 0.95,
      scale: 0.98,
      transition: 150,
    },
  },
  interaction: {
    type: 'none',
  },
});

export const createDefaultIcon = (id: string): IconConfig => ({
  id,
  type: 'icon',
  iconName: 'Star',
  size: {
    width: 0,
    height: 0,
    paddingX: 8,
    paddingY: 8,
    fontSize: 0,
    iconSize: 24,
  },
  styles: {
    default: {
      background: 'transparent',
      color: '#3b82f6',
      borderColor: 'transparent',
      borderWidth: 0,
      borderRadius: 8,
      boxShadow: 'none',
      opacity: 1,
      scale: 1,
      transition: 150,
    },
    hover: {
      background: '#eff6ff',
      color: '#2563eb',
      borderColor: 'transparent',
      borderWidth: 0,
      borderRadius: 8,
      boxShadow: 'none',
      opacity: 1,
      scale: 1.1,
      transition: 150,
    },
    active: {
      background: '#dbeafe',
      color: '#1d4ed8',
      borderColor: 'transparent',
      borderWidth: 0,
      borderRadius: 8,
      boxShadow: 'none',
      opacity: 0.9,
      scale: 0.95,
      transition: 150,
    },
  },
  interaction: {
    type: 'none',
  },
});
