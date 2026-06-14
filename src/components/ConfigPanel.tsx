import { useStore, useSelectedComponent } from '@/store';
import { ComponentState, ButtonConfig, IconConfig, InteractionType } from '@/types';
import {
  Field,
  NumberInput,
  ColorInput,
  TextInput,
  SelectInput,
  SliderInput,
  Section,
} from './FormFields';
import * as Icons from 'lucide-react';

const stateTabs: { key: ComponentState; label: string; desc: string }[] = [
  { key: 'default', label: '默认', desc: '组件默认显示状态' },
  { key: 'hover', label: '悬浮', desc: '鼠标悬浮时的状态' },
  { key: 'active', label: '点击', desc: '点击按下时的状态' },
];

const shadowPresets = [
  { label: '无阴影', value: 'none' },
  { label: '微小', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
  { label: '小', value: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' },
  { label: '中', value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
  { label: '大', value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
  { label: '超大', value: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' },
];

const iconOptions = Object.keys(Icons)
  .filter((k) => typeof (Icons as Record<string, unknown>)[k] === 'function')
  .slice(0, 100)
  .map((name) => ({ label: name, value: name }));

export const ConfigPanel = () => {
  const selected = useSelectedComponent();
  const selectedState = useStore((s) => s.selectedState);
  const setSelectedState = useStore((s) => s.setSelectedState);
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const setStateStyles = useStore((s) => s.setStateStyles);
  const setSize = useStore((s) => s.setSize);
  const setInteraction = useStore((s) => s.setInteraction);
  const updateComponent = useStore((s) => s.updateComponent);

  if (!selected) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-slate-400 px-8">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 opacity-50">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <p className="text-sm">选择左侧或中间的组件</p>
          <p className="text-xs mt-1">以编辑其样式与交互</p>
        </div>
      </div>
    );
  }

  const currentStyles = selected.styles[selectedState];

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex border-b border-slate-200">
        {(['style', 'interaction'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab === 'style' ? '样式配置' : '交互行为'}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'style' ? (
          <>
            <div className="border-b border-slate-100 p-3">
              <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                {stateTabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setSelectedState(t.key)}
                    className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-all ${
                      selectedState === t.key
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-2 px-1 text-center">
                {stateTabs.find((t) => t.key === selectedState)?.desc}
              </p>
            </div>

            <Section title="基础信息">
              {selected.type === 'button' && (
                <>
                  <Field label="按钮文字">
                    <TextInput
                      value={(selected as ButtonConfig).label}
                      onChange={(v) => updateComponent(selected.id, { label: v } as Partial<ButtonConfig>)}
                      placeholder="输入按钮文字"
                    />
                  </Field>
                  <Field label="图标位置">
                    <SelectInput
                      value={(selected as ButtonConfig).iconPosition}
                      onChange={(v) =>
                        updateComponent(selected.id, { iconPosition: v } as Partial<ButtonConfig>)
                      }
                      options={[
                        { label: '无图标', value: 'none' },
                        { label: '左侧', value: 'left' },
                        { label: '右侧', value: 'right' },
                      ]}
                    />
                  </Field>
                  {(selected as ButtonConfig).iconPosition !== 'none' && (
                    <Field label="图标名称">
                      <SelectInput
                        value={(selected as ButtonConfig).iconName || 'Star'}
                        onChange={(v) =>
                          updateComponent(selected.id, { iconName: v } as Partial<ButtonConfig>)
                        }
                        options={iconOptions}
                      />
                    </Field>
                  )}
                </>
              )}
              {selected.type === 'icon' && (
                <Field label="图标名称">
                  <SelectInput
                    value={(selected as IconConfig).iconName}
                    onChange={(v) =>
                      updateComponent(selected.id, { iconName: v } as Partial<IconConfig>)
                    }
                    options={iconOptions}
                  />
                </Field>
              )}
            </Section>

            <Section title="尺寸" collapsible>
              {selected.type === 'button' && (
                <>
                  <Field label="字体大小">
                    <SliderInput
                      value={selected.size.fontSize}
                      onChange={(v) => setSize(selected.id, { fontSize: v })}
                      min={10}
                      max={32}
                      unit="px"
                    />
                  </Field>
                  <Field label="图标大小">
                    <SliderInput
                      value={selected.size.iconSize}
                      onChange={(v) => setSize(selected.id, { iconSize: v })}
                      min={12}
                      max={48}
                      unit="px"
                    />
                  </Field>
                </>
              )}
              {selected.type === 'icon' && (
                <Field label="图标大小">
                  <SliderInput
                    value={selected.size.iconSize}
                    onChange={(v) => setSize(selected.id, { iconSize: v })}
                    min={12}
                    max={96}
                    unit="px"
                  />
                </Field>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Field label="水平内边距">
                  <NumberInput
                    value={selected.size.paddingX}
                    onChange={(v) => setSize(selected.id, { paddingX: v })}
                    unit="px"
                    min={0}
                    max={80}
                  />
                </Field>
                <Field label="垂直内边距">
                  <NumberInput
                    value={selected.size.paddingY}
                    onChange={(v) => setSize(selected.id, { paddingY: v })}
                    unit="px"
                    min={0}
                    max={60}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="宽度 (0=自适应)">
                  <NumberInput
                    value={selected.size.width}
                    onChange={(v) => setSize(selected.id, { width: v })}
                    unit="px"
                    min={0}
                    max={600}
                  />
                </Field>
                <Field label="高度 (0=自适应)">
                  <NumberInput
                    value={selected.size.height}
                    onChange={(v) => setSize(selected.id, { height: v })}
                    unit="px"
                    min={0}
                    max={200}
                  />
                </Field>
              </div>
            </Section>

            <Section title="配色" collapsible>
              <Field label="背景色">
                <ColorInput
                  value={currentStyles.background}
                  onChange={(v) => setStateStyles(selected.id, selectedState, { background: v })}
                />
              </Field>
              <Field label="文字/图标色">
                <ColorInput
                  value={currentStyles.color}
                  onChange={(v) => setStateStyles(selected.id, selectedState, { color: v })}
                  allowTransparent={false}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="边框色">
                  <ColorInput
                    value={currentStyles.borderColor}
                    onChange={(v) => setStateStyles(selected.id, selectedState, { borderColor: v })}
                  />
                </Field>
                <Field label="边框宽度">
                  <NumberInput
                    value={currentStyles.borderWidth}
                    onChange={(v) => setStateStyles(selected.id, selectedState, { borderWidth: v })}
                    unit="px"
                    min={0}
                    max={10}
                  />
                </Field>
              </div>
            </Section>

            <Section title="圆角与阴影" collapsible>
              <Field label="圆角">
                <SliderInput
                  value={currentStyles.borderRadius}
                  onChange={(v) => setStateStyles(selected.id, selectedState, { borderRadius: v })}
                  min={0}
                  max={100}
                  unit="px"
                />
              </Field>
              <Field label="阴影预设">
                <SelectInput
                  value={shadowPresets.find((p) => p.value === currentStyles.boxShadow)?.value || currentStyles.boxShadow}
                  onChange={(v) => setStateStyles(selected.id, selectedState, { boxShadow: v })}
                  options={
                    shadowPresets.some((p) => p.value === currentStyles.boxShadow)
                      ? shadowPresets
                      : [...shadowPresets, { label: '自定义...', value: currentStyles.boxShadow }]
                  }
                />
              </Field>
              <Field label="阴影 CSS">
                <TextInput
                  value={currentStyles.boxShadow}
                  onChange={(v) => setStateStyles(selected.id, selectedState, { boxShadow: v })}
                  placeholder="例如: 0 4px 6px -1px rgb(0 0 0 / 0.1)"
                />
              </Field>
            </Section>

            <Section title="动效" collapsible>
              <Field label="透明度">
                <SliderInput
                  value={Math.round(currentStyles.opacity * 100)}
                  onChange={(v) => setStateStyles(selected.id, selectedState, { opacity: v / 100 })}
                  min={0}
                  max={100}
                  unit="%"
                />
              </Field>
              <Field label="缩放">
                <SliderInput
                  value={Math.round(currentStyles.scale * 100)}
                  onChange={(v) => setStateStyles(selected.id, selectedState, { scale: v / 100 })}
                  min={50}
                  max={200}
                  unit="%"
                />
              </Field>
              <Field label="过渡时长">
                <SliderInput
                  value={currentStyles.transition}
                  onChange={(v) => setStateStyles(selected.id, selectedState, { transition: v })}
                  min={0}
                  max={1000}
                  unit="ms"
                />
              </Field>
            </Section>
          </>
        ) : (
          <>
            <Section title="交互类型">
              <Field label="点击行为">
                <SelectInput
                  value={selected.interaction.type}
                  onChange={(v) => setInteraction(selected.id, { type: v as InteractionType })}
                  options={[
                    { label: '无行为', value: 'none' },
                    { label: '跳转链接', value: 'navigate' },
                    { label: '弹出提示', value: 'alert' },
                    { label: '弹窗对话框', value: 'modal' },
                  ]}
                />
              </Field>
            </Section>

            {selected.interaction.type === 'navigate' && (
              <Section title="跳转配置">
                <Field label="跳转 URL" hint="点击后在新标签页打开">
                  <TextInput
                    value={selected.interaction.navigateUrl || ''}
                    onChange={(v) => setInteraction(selected.id, { navigateUrl: v })}
                    placeholder="https://example.com"
                  />
                </Field>
              </Section>
            )}

            {selected.interaction.type === 'alert' && (
              <Section title="提示配置">
                <Field label="提示消息">
                  <TextInput
                    value={selected.interaction.alertMessage || ''}
                    onChange={(v) => setInteraction(selected.id, { alertMessage: v })}
                    placeholder="这是一条提示消息"
                    type="textarea"
                  />
                </Field>
              </Section>
            )}

            {selected.interaction.type === 'modal' && (
              <Section title="弹窗配置">
                <Field label="弹窗标题">
                  <TextInput
                    value={selected.interaction.modalTitle || ''}
                    onChange={(v) => setInteraction(selected.id, { modalTitle: v })}
                    placeholder="提示"
                  />
                </Field>
                <Field label="弹窗内容">
                  <TextInput
                    value={selected.interaction.modalContent || ''}
                    onChange={(v) => setInteraction(selected.id, { modalContent: v })}
                    placeholder="这是弹窗内容"
                    type="textarea"
                  />
                </Field>
              </Section>
            )}
          </>
        )}
      </div>
    </div>
  );
};
