## 1. 架构设计

```mermaid
flowchart TB
    subgraph "前端层"
        "编辑界面 (3769端口)" --> "WebSocket通信"
        "预览界面 (8769端口)" --> "WebSocket通信"
    end
    subgraph "服务层"
        "WebSocket通信" --> "样式状态管理"
        "WebSocket通信" --> "交互行为管理"
    end
    subgraph "数据层"
        "样式状态管理" --> "内存数据存储"
        "交互行为管理" --> "内存数据存储"
    end
```

## 2. 技术说明

- 前端：React@18 + tailwindcss@3 + vite
- 初始化工具：vite-init
- 后端：Express@4（提供双端口服务 + WebSocket 实时同步）
- 数据库：无，纯内存状态管理
- 通信：WebSocket（ws 库），编辑界面修改即时推送到预览界面

## 3. 路由定义

| 路由 | 端口 | 用途 |
|------|------|------|
| / | 3769 | 编辑界面主页面 |
| / | 8769 | 纯净预览界面 |

## 4. API 定义

### 4.1 WebSocket 消息协议

```typescript
interface StyleConfig {
  width: number
  height: number
  fontSize: number
  borderRadius: number
  backgroundColor: string
  textColor: string
  borderColor: string
  borderWidth: number
  boxShadow: {
    x: number
    y: number
    blur: number
    spread: number
    color: string
  }
}

interface InteractionConfig {
  type: 'none' | 'navigate' | 'popup'
  url?: string
  popupContent?: string
}

interface ComponentState {
  default: StyleConfig
  hover: StyleConfig
  active: StyleConfig
}

interface ComponentConfig {
  type: 'button' | 'icon'
  label: string
  icon?: string
  states: ComponentState
  interaction: InteractionConfig
}

interface WSMessage {
  action: 'update' | 'select'
  payload: ComponentConfig
}
```

## 5. 服务器架构

```mermaid
flowchart LR
    "编辑界面浏览器" -->|"WebSocket"| "Express服务器"
    "Express服务器" -->|"WebSocket"| "预览界面浏览器"
    "Express服务器" --> "内存状态存储"
```

## 6. 数据模型

采用纯内存数据存储，无需数据库。组件配置对象在服务器内存中维护，通过 WebSocket 在编辑端和预览端之间实时同步。
