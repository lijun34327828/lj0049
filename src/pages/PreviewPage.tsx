import { useStore } from '@/store';
import { useWebSocket } from '@/hooks/useWebSocket';
import { ConfigurableButton, ConfigurableIcon } from '@/components/Configurable';
import { GlobalModal } from '@/components/GlobalModal';
import { ButtonConfig, IconConfig } from '@/types';

export default function PreviewPage() {
  useWebSocket(true);
  const components = useStore((s) => s.components);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900">组件预览</h1>
            <p className="text-xs text-slate-500">样式与交互逻辑运行中 · 端口 8769</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            WebSocket 已连接
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-12">
        <div className="flex flex-wrap gap-8 items-center justify-center max-w-4xl">
          {components.map((comp) =>
            comp.type === 'button' ? (
              <ConfigurableButton key={comp.id} config={comp as ButtonConfig} />
            ) : (
              <ConfigurableIcon key={comp.id} config={comp as IconConfig} />
            )
          )}
        </div>
      </div>

      <div className="bg-white/60 border-t border-slate-200 px-6 py-2">
        <p className="text-xs text-slate-500 text-center">
          在编辑界面修改配置，此处将实时同步更新
        </p>
      </div>

      <GlobalModal />
    </div>
  );
}
