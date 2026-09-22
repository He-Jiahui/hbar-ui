# 视觉原语

## 黑底灯带 / 白底墨条

两种模式共享位置、长度、状态与文字语义。深色以近黑背景、近白正文和白色线芯构成；浅色以白色背景、近黑正文和黑色线芯构成。浅色光晕为零，靠实心条与字重提供强调。成功、警告、错误、信息色只表达语义，并始终搭配文本、图标或控件状态。

使用共享变量：`--lumen-canvas`、`--lumen-ink`、`--lumen-muted`、`--lumen-subtle`、`--lumen-line`、`--lumen-edge`、`--lumen-selection`、`--lumen-beam-shadow`。宿主的 `--lumen-glow` 控制深色光晕强度，`--lumen-motion` 通过 appearance 控制动态效果。没有光晕时仍须可识别选中和焦点。

`LumenIndicator` 的结构是线芯加可选光晕。水平条适合动作、页签、输入边界；垂直条适合列表/导航选择。idle 微弱，hover 增强，selected 明确，running 可缓慢呼吸，failed 使用语义色与错误文字，disabled 停止动态。灯带本身 `aria-hidden`，真实状态由按钮、输入或宿主状态文本提供。

## 表面与框架

默认 `LumenSurface` 是纯色、无抬升的承载面。结构已有标题和间距时无需再画一层边框；覆盖层需要可辨识的不透明/高不透明底色和边缘。保留 opt-in glass/frost 以适配既有场景，不能让背景透出而破坏阅读对比度。

主视图优先单一连续背景；导航/工具区用分隔线划分。阅读内容可使用有最大宽度的居中列；工作台数据区使用剩余宽度。固定表头、工具条与拥有滚动的列表各自有明确归属。

## 文字与尺寸

沿用 `LumenText` 的 title / heading / body / label / supporting / code，控件尺寸 s / m / l，图标 xs / sm / md / lg / xl。正文不发光。辅文案用 muted；subtle 仅用于低优先级元数据，必要说明仍需满足文本对比度。

控件高度是最小命中尺寸，长标签允许增高；不固定内容区域高度以隐藏溢出。选中不改变边框厚度导致位移。焦点使用独立清晰轮廓，不能只给鼠标 hover 添加反馈。
