# MUI 概念 → Lumen 原语

以 [MUI 组件目录](https://mui.com/material-ui/all-components/) 为行为分类参照。下面是设计映射，不承诺完整兼容 MUI props。

| 概念 | Lumen API | 表现和行为 |
| --- | --- | --- |
| Button / IconButton | LumenButton / LumenIconButton | text 是轻动作，outlined 是需要边界的次动作，contained（兼容 solid）是少量主动作。轮廓发光表达交互，蓝色呼吸表达进行中；loading 禁止重复提交并保留名称。 |
| Autocomplete / Combo box | LumenComboBox | 保留已有输入参照及独立下拉面。方向键只移动高亮，Enter 提交，Escape 取消展开；active descendant 与 selected value 分开。宿主筛选并提供分页。 |
| TextField / Select | LumenFormField + LumenInput / LumenPopupSelect | 可见标签、说明、错误分别呈现。保留输入边界和独立可见焦点，程序内选择使用共享浮层。LumenSelect 仍保留明确需要平台表单行为的兼容接口。 |
| List / ListItemButton | LumenList | 文本主次、行尾辅助信息。当前 trailing 位于行按钮内，只放非交互信息；未来扩展独立操作时须放在行按钮之外并单测，不能嵌套按钮。短列表随内容增长，大列表由宿主管理分页。 |
| Chip / Tag | LumenChip | 短标签或过滤条件，透明底面与局部边界，无胶囊外观依赖。可选选择与删除；删除有独立宿主标签，避免让删除同时触发选择。 |
| Badge | LumenBadge | 简短状态或计数，线芯/点与文字组合；可附着到图标旁，提供可访问名称。数值格式、上限和复数由宿主决定。 |
| Tabs / Toggle Button | LumenTabs / LumenSegmentedControl | 选中使用水平/垂直条和字重；方向键、Home/End 跳过禁用项。Tab 对应 panel，单一 roving tab stop。 |
| Switch / Checkbox / Radio | LumenSwitch / LumenCheckBox / LumenRadioGroup | 保留原生表单语义；checked、disabled、focus 均可辨识，颜色不独自承担状态。 |
| Paper / Card / Divider | LumenSurface / LumenPanel / LumenDivider | 基础面依赖宿主背景，现有 Surface 默认半透明 glass；保留参照。以留白组织信息，不给每条正文包装卡片。 |
| Menu / Dialog / Popover | LumenMenu / LumenDialog / LumenPopover | 覆盖层使用可读底色；各自的焦点管理、关闭行为需单独核对，不能因皮肤一致就宣称交互完成。 |

## 扩展边界

新增 MUI 概念先查公开导出、调用方与实际键盘行为。缺失时在基础层增加 Lumen 原语并验证，然后供变体组合；不要从变体直接引入未适配的 MUI 控件。对 Table、Tree、Menu、Dialog 等复杂组件逐个验证，不根据名称或主题覆盖推断可访问性。

任何覆盖记录都应区别“有 API”“有 Lumen 外观”“完整交互已验证”。本技能记录目标语言，不替代运行时审计。
