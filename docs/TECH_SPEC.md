# 项目技术规格说明书

## 1. 技术栈概述

### 1.1 核心技术
| 技术 | 版本 | 用途 |
|------|------|------|
| SvelteKit | 2.50.2 | Web应用框架 |
| Svelte | 5.51.0 | UI组件框架 |
| TypeScript | 5.9.3 | 类型系统 |
| Tailwind CSS | 4.1.18 | CSS框架 |
| DaisyUI | 5.5.19 | UI组件库 |
| Vitest | 4.0.18 | 单元测试框架 |

### 1.2 开发工具
| 工具 | 用途 |
|------|------|
| pnpm | 包管理器 |
| Volta | Node.js版本管理 |
| Vite | 构建工具 |
| ESLint | 代码检查 |
| Prettier | 代码格式化 |

## 2. 项目结构

### 2.1 目录结构
```
dsq/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   └── ItemGrid.svelte      # 物品网格组件
│   │   ├── utils/
│   │   │   ├── calc.ts             # 材料计算逻辑
│   │   │   └── calc.test.ts         # 计算逻辑测试
│   │   ├── types.ts                # 类型定义
│   │   └── index.ts
│   ├── routes/
│   │   ├── +page.svelte            # 主页面
│   │   ├── +layout.svelte          # 布局组件
│   │   └── layout.css               # 全局样式
│   ├── data/
│   │   ├── items.json               # 物品数据
│   │   ├── recipes.json             # 配方数据
│   │   └── Vanilla.json             # 物品分类数据
│   ├── app.html
│   └── app.d.ts
├── static/
│   ├── data/
│   │   ├── items.json               # 物品数据（前端访问）
│   │   └── recipes.json             # 配方数据（前端访问）
│   └── icon/
│       ├── Vanilla/                  # 物品图标
│       ├── GenesisBook/              # DLC图标
│       └── FractionateEverything/   # 配方图标
├── docs/
│   ├── SPEC.md                      # 软件规格
│   ├── TEST_SPEC.md                 # 测试规格
│   └── TECH_SPEC.md                 # 技术规格
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── vitest.config.ts
```

## 3. 核心模块设计

### 3.2 材料计算模块（calc.ts）

#### 功能说明

使用深度优先搜索（DFS）算法遍历配方树，计算目标物品所需的原材料和设备。

#### 核心逻辑

1. 初始化栈，将目标物品作为起始节点
2. 弹出栈顶元素，检查是否为原材料或设备
3. 如果有配方，则计算所需原材料数量
4. 考虑配方的产出数量（ResultCounts），按比例计算
5. 递归处理所有原材料
6. 最终汇总材料和设备需求

#### 关键算法

```typescript
// 计算比例：所需数量 / 产出数量
const ratio = cnt / resultCount;
// 计算实际需要的原材料数量
const matCount = matCountPerResult * ratio;
```

### 3.2 组件规划

1. ItemGrid组件
2. 结果表格展示组件

## 4. 页面设计

1. 样式统一：使用Tailwind CSS和DaisyUI组件库，保持一致的布局和样式。

## 5 环境要求

- Node.js: 22 LTS（通过Volta管理）
- pnpm: 最新版本

---

*文档版本：1.0*
*创建日期：2026-03-06*
