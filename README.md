# 美柚省钱管理后台原型

纯静态后台原型，可直接用浏览器打开 `index.html`。

> 所有开发和修改均须遵守项目根目录的 [`AGENTS.md`](./AGENTS.md)：模块必须独立维护，样式不得跨模块覆盖，并在每次改动后完成语法与差异校验。

## 目录

- `index.html`：应用入口与资源加载
- `styles/app.css`：全局样式与各模块作用域样式
- `scripts/app.js`：应用启动与页面路由
- `scripts/components/layout.js`：侧边导航、顶栏和面包屑
- `scripts/pages/merchant-list.js`：合作商列表页
- `scripts/pages/category-management.js`：合作商分类管理页与添加分类表单

## 交互约定

- 有 hover 说明的字段，统一使用问号提示图标：`<button class="help-tooltip" data-tooltip="说明内容">?</button>`。
- 说明内容在悬停或键盘聚焦时展示，避免将说明文字长期占用表单布局。

新增页面时，在 `scripts/pages` 创建独立页面文件，并在 `scripts/app.js` 中注册路由；完整模块、样式和验证约束以 `AGENTS.md` 为准。

## GitHub Pages

仓库已包含自动部署工作流：每次推送 `main` 分支都会发布当前目录下的静态站点。

首次启用时，在 GitHub 仓库中进入 `Settings` -> `Pages`，将 `Build and deployment` 的 `Source` 设为 `GitHub Actions`。部署成功后的预览地址会显示在仓库的 `Actions` 页面和 `Settings` -> `Pages` 页面中。
