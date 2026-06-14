import { useStore } from '@/store';
import { useWebSocket } from '@/hooks/useWebSocket';
import { ConfigurableButton, ConfigurableIcon } from '@/components/Configurable';
import { ConfigPanel } from '@/components/ConfigPanel';
import { GlobalModal } from '@/components/GlobalModal';
import { ButtonConfig, IconConfig, createDefaultButton, createDefaultIcon } from '@/types';
import * as Icons from 'lucide-react';

export default function EditorPage() {
  useWebSocket(true);
  const components = useStore((s) => s.components);
  const selectedId = useStore((s) => s.selectedId);
  const selectComponent = useStore((s) => s.selectComponent);
  const selectedState = useStore((s) => s.selectedState);
  const addComponent = useStore((s) => s.addComponent);
  const removeComponent = useStore((s) => s.removeComponent);

  const handleAddButton = () => {
    const id = `btn-${Date.now()}`;
    addComponent(createDefaultButton(id));
  };

  const handleAddIcon = () => {
    const id = `icon-${Date.now()}`;
    addComponent(createDefaultIcon(id));
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">组件样式调试器</h1>
            <p className="text-[11px] text-slate-500">编辑界面 · 端口 3769 · 预览端口 8769</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            实时同步
          </span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">添加组件</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddButton}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-md bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                  <Icons.MousePointer2 size={16} className="text-slate-500 group-hover:text-blue-600" />
                </div>
                <span className="text-xs font-medium text-slate-600 group-hover:text-blue-700">按钮</span>
              </button>
              <button
                onClick={handleAddIcon}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-md bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                  <Icons.Star size={16} className="text-slate-500 group-hover:text-blue-600" />
                </div>
                <span className="text-xs font-medium text-slate-600 group-hover:text-blue-700">图标</span>
              </button>
            </div>
          </div>

          <div className="p-3 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">组件列表</p>
            <div className="space-y-1">
              {components.map((comp) => {
                const isSelected = comp.id === selectedId;
                const IconComp =
                  comp.type === 'icon'
                    ? ((Icons as unknown as Record<string, React.ComponentType<{ size: number; className?: string }>>)[
                        (comp as IconConfig).iconName
                      ] || Icons.Star)
                    : Icons.MousePointer2;
                return (
                  <div
                    key={comp.id}
                    onClick={() => selectComponent(comp.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 ring-1 ring-blue-200'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-blue-100' : 'bg-slate-100'
                      }`}
                    >
                      <IconComp size={14} className={isSelected ? 'text-blue-600' : 'text-slate-500'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          isSelected ? 'text-blue-700' : 'text-slate-700'
                        }`}
                      >
                        {comp.type === 'button' ? (comp as ButtonConfig).label : (comp as IconConfig).iconName}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {comp.type === 'button' ? '按钮' : '图标'}
                      </p>
                    </div>
                    {components.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeComponent(comp.id);
                        }}
                        className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        style={{ opacity: isSelected ? 1 : undefined }}
                      >
                        <Icons.X size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 mt-auto border-t border-slate-100 bg-slate-50/50">
            <div className="text-[11px] text-slate-500 space-y-1">
              <p className="flex items-center gap-1.5">
                <Icons.Info size={12} />
                修改即时生效
              </p>
              <p className="flex items-center gap-1.5">
                <Icons.Link size={12} />
                预览端口: http://localhost:8769
              </p>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="px-5 py-2.5 border-b border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons.Eye size={14} className="text-slate-400" />
              <span className="text-xs font-medium text-slate-700">预览区域</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="px-1.5 py-0.5 rounded bg-slate-100">
                当前状态: <span className="font-semibold text-slate-700">{selectedState === 'default' ? '默认' : selectedState === 'hover' ? '悬浮' : '点击'}</span>
              </span>
              <span className="text-slate-300">·</span>
              <span>点击组件进行选中</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-12 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
            <div className="min-h-full flex items-center justify-center">
              <div
                className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-16"
                style={{ minWidth: 480, minHeight: 320 }}
                onClick={() => selectComponent(null)}
              >
                <div className="flex flex-wrap gap-10 items-center justify-center" onClick={(e) => e.stopPropagation()}>
                  {components.map((comp) => {
                    const isSelected = comp.id === selectedId;
                    return (
                      <div
                        key={comp.id}
                        onClick={() => selectComponent(comp.id)}
                        className={`relative p-2 -m-2 rounded-xl transition-all cursor-pointer ${
                          isSelected ? 'ring-2 ring-blue-400 ring-offset-2 bg-blue-50/30' : 'hover:ring-1 hover:ring-slate-300'
                        }`}
                      >
                        {comp.type === 'button' ? (
                          <ConfigurableButton config={comp as ButtonConfig} forceState={isSelected ? selectedState : undefined} />
                        ) : (
                          <ConfigurableIcon config={comp as IconConfig} forceState={isSelected ? selectedState : undefined} />
                        )}
                        {isSelected && (
                          <div className="absolute -top-2.5 -left-2.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                            <Icons.Check size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside className="w-80 border-l border-slate-200 bg-white flex flex-col shrink-0">
          <ConfigPanel />
        </aside>
      </div>

      <GlobalModal />
    </div>
  );
}
