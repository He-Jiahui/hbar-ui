---
name: lumen-design-language
description: Design, implement, and review Lumen UI primitives and App UI compositions using dark light strips, light ink strips, flat surfaces, and explicit information hierarchy. Use in the Lumen package and its host previews when adapting MUI component concepts or refining shared controls.
---

# Lumen · 墨光

Lumen 在黑色背景上用灯带指示动作与状态，在白色背景上用清晰的墨条承担同一职责。纯色、留白、文字和短线构成界面；发光是有状态的信息反馈。MUI 提供组件概念与交互契约，Lumen 决定视觉表达。

## 设计判断

| 维度 | 实施准则 |
| --- | --- |
| 至简 | 每个区域突出一个当前动作。先用对齐、字重和间距建立层级，必要时才增加背景、边框或图标。 |
| 光感 | 深色下保留清晰实心线芯，只让线芯周围产生柔和光晕；正文保持锐利。悬停、焦点、选中、运行有明确强弱，静态装饰不持续闪烁。 |
| 无界 | 常规内容共享背景，以标题与间距分组；边界只出现在需要辨识的输入、选择、滚动区域或覆盖层。无界不等于看不见焦点或点击范围。 |
| 扁平 | 不用立体阴影、渐变按钮或层层嵌套卡片表达普通层级。默认表面是纯色；玻璃/磨砂是可选的覆盖层材质。 |
| 信息对比度 | 主信息最清晰，辅助解释次之，装饰最弱。普通文本至少 4.5:1、大文本至少 3:1；必要的控件状态/焦点至少 3:1。不要靠整体透明度降低正文可读性。 |
| 信息呈现 | 连续语句保持同一文本流；标题、正文、元数据按阅读顺序组织。行尾动作归属于原记录，用户消息可在居中阅读列内靠右。Badge 是数量/状态，Chip 是分类/可移除条件，Tab 是视图切换。 |
| 辅助框架 | 使用“稳定导航 + 内容区域 + 按需工具区”。工具栏跟随所属栏目，错误/加载反馈靠近触发动作。一个分隔线或局部条形指示通常足以表达框架。 |
| UI 原语 | 组合 Provider、Surface、Indicator、Text、Button、Field、List、Chip、Badge、Tabs；先修共享原语，再处理独立变体的布局。数据和文案由宿主提供。 |

## 在项目中实施

从 `packages/lumen-app-ui/src/ui/index.ts` 核对实际公开 API。宿主从 `@lumen/app-ui/ui` 导入控件，在 `LumenProvider` 中使用，并加载一次 `@lumen/app-ui/styles.css`。不要依据这份技能假定所有 MUI 组件已经迁移。

- 设计 token、灯带、表面或信息层级：读 [视觉原语](references/primitives.md)。
- 改造基础控件、核对 MUI 行为和覆盖缺口：读 [组件映射](references/components.md)。
- 样式来源：`styles.css`、`primitives.module.css`、`materials.module.css`、`forms.css`、`ui.css`。`theme.ts` 是 MUI 适配层，不应成为应用组件的第二套主题。
- 变体只描述内容与布局；不要在每个变体中重写主题色、光晕或控件状态。保留既有公开 props 的兼容性，新增的文案使用类型化宿主契约。
- 沿用项目的语义图标等级、自然 flex 流和本地化约定。仅实际覆盖层及附着在控件边缘的装饰可以定位；文字和按钮不靠坐标排版。

## 验收依据

在深色和浅色模式检查静止、悬停、键盘焦点、选中、禁用、加载和错误。关闭 glow 后线芯仍清晰；浅色是实心墨条，没有暗色光晕。尊重减少动态效果和强制颜色模式。

检查桌面与窄屏、长中英文内容、空列表及滚动边界。组合框检查方向键移动、Enter 提交、Escape 关闭；列表行内按钮不能同时触发行选择。几何检查和人工截图检查都需要：没有横向溢出不代表内容排列正确。

运行与改动相称的 lint、类型检查、交互测试和构建。设计预览使用同一公开原语；列出本次实现范围和仍未覆盖的 MUI 概念，不把一张效果图称为全量组件支持。
