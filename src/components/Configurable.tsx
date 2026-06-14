import { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import type { ButtonConfig, IconConfig, ComponentState } from '@/types';

interface StyleProps {
  config: ButtonConfig | IconConfig;
  forceState?: ComponentState;
}

const getStateStyles = (config: ButtonConfig | IconConfig, state: ComponentState) => {
  const styles = config.styles[state];
  const size = config.size;
  return {
    width: size.width > 0 ? `${size.width}px` : 'auto',
    height: size.height > 0 ? `${size.height}px` : 'auto',
    padding: `${size.paddingY}px ${size.paddingX}px`,
    fontSize: size.fontSize > 0 ? `${size.fontSize}px` : undefined,
    backgroundColor: styles.background,
    color: styles.color,
    borderColor: styles.borderColor,
    borderWidth: `${styles.borderWidth}px`,
    borderStyle: styles.borderWidth > 0 ? 'solid' : 'none',
    borderRadius: `${styles.borderRadius}px`,
    boxShadow: styles.boxShadow,
    opacity: styles.opacity,
    transform: `scale(${styles.scale})`,
    transition: `all ${styles.transition}ms ease`,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: config.type === 'button' && config.iconPosition !== 'none' ? '8px' : undefined,
    userSelect: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    fontWeight: 500,
    lineHeight: 1,
  } as React.CSSProperties;
};

const IconRenderer = ({ name, size }: { name: string; size: number }) => {
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ size: number }>>)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} />;
};

export const ConfigurableButton = ({
  config,
  forceState,
  onClick,
}: StyleProps & { onClick?: () => void }) => {
  const [state, setState] = useState<ComponentState>('default');
  const activeState = forceState || state;

  const handleInteraction = (action: () => void) => {
    if (!forceState) action();
  };

  const handleClick = () => {
    const interaction = config.interaction;
    if (interaction.type === 'navigate' && interaction.navigateUrl) {
      window.open(interaction.navigateUrl, '_blank');
    } else if (interaction.type === 'alert' && interaction.alertMessage) {
      alert(interaction.alertMessage);
    } else if (interaction.type === 'modal' && interaction.modalTitle) {
      const modal = document.getElementById('configurable-modal');
      if (modal) {
        const titleEl = modal.querySelector('[data-modal-title]');
        const contentEl = modal.querySelector('[data-modal-content]');
        if (titleEl) titleEl.textContent = interaction.modalTitle;
        if (contentEl) contentEl.textContent = interaction.modalContent || '';
        (modal as HTMLDialogElement).showModal();
      }
    }
    onClick?.();
  };

  return (
    <button
      type="button"
      style={getStateStyles(config, activeState)}
      onMouseEnter={() => handleInteraction(() => setState('hover'))}
      onMouseLeave={() => handleInteraction(() => setState('default'))}
      onMouseDown={() => handleInteraction(() => setState('active'))}
      onMouseUp={() => handleInteraction(() => setState('hover'))}
      onTouchStart={() => handleInteraction(() => setState('active'))}
      onTouchEnd={() => handleInteraction(() => setState('default'))}
      onClick={handleClick}
    >
      {config.type === 'button' && config.iconPosition === 'left' && config.iconName && (
        <IconRenderer name={config.iconName} size={config.size.iconSize} />
      )}
      {config.type === 'button' && <span>{config.label}</span>}
      {config.type === 'button' && config.iconPosition === 'right' && config.iconName && (
        <IconRenderer name={config.iconName} size={config.size.iconSize} />
      )}
      {config.type === 'icon' && (
        <IconRenderer name={config.iconName} size={config.size.iconSize} />
      )}
    </button>
  );
};

export const ConfigurableIcon = ({
  config,
  forceState,
  onClick,
}: StyleProps & { onClick?: () => void }) => {
  return <ConfigurableButton config={config as IconConfig} forceState={forceState} onClick={onClick} />;
};
