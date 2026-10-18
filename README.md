# CookingRecipe

自己的日常食谱本。React + TypeScript + Material UI，提供中英法界面、菜名/配料搜索、组合筛选、可分享的食谱链接、深浅主题和烹饪进度。

网站完全静态，可部署到 GitHub Pages。食谱内容存放在 `content/`，不需要数据库或后台。

## 启动

使用 Node.js 22.12+（推荐 Node 22 LTS）和 npm：

```sh
npm ci
npm run dev
```

打开终端显示的地址。编辑 `content/` 中的 JSON 后，开发服务器自动校验、重新生成内容并刷新页面。无效数据会显示文件名和错误字段；修正并保存即可恢复。

## 添加一份食谱

```sh
npm run recipe:new -- tomato-soup --title="番茄汤"
```

命令创建 `content/recipes/tomato-soup.json`，默认 `draft: true`，不会覆盖已有文件。填写内容后把 `draft` 改为 `false` 或删除该字段，再运行：

```sh
npm run content:check
```

只需添加这一个文件，**不需要编辑索引、组件、翻译代码或手动注册路由**。可以先仅写中文；其他界面语言会回退到该食谱的 `defaultLanguage`，并显示提示。

英文或法语草稿可用 `--lang=en` 或 `--lang=fr`。也可以直接复制下面的最小完整示例：

```json
{
  "$schema": "../recipe.schema.json",
  "id": "tomato-soup",
  "tags": ["dish"],
  "difficulty": 1,
  "defaultLanguage": "cn",
  "ingredients": [
    {
      "id": "tomato-1",
      "ingredient": "tomato",
      "amount": { "cn": "2个" }
    },
    {
      "id": "water-1",
      "ingredient": "water",
      "amount": { "cn": "500毫升" }
    }
  ],
  "translations": {
    "cn": {
      "title": "番茄汤",
      "steps": ["西红柿洗净切块。", "加水煮熟，按口味调味。"],
      "notes": ["用量可以按个人喜好调整。"]
    }
  }
}
```

字段说明：

| 字段 | 规则 |
| --- | --- |
| `id` | 必须与文件名一致；小写字母、数字和连字符。发布后尽量不改，以保留分享链接。 |
| `draft` | 可选，`true` 时不发布；草稿也检查结构与配料引用。`TODO` 占位符禁止发布。 |
| `hidden` | 可选，`true` 时保留源文件但排除在网站数据和构建产物之外；列表、搜索、筛选和直接链接均不可访问。 |
| `tags` | `dish`、`bakery`、`dessert`，至少一个，可以多选。 |
| `difficulty` | 0–5，允许半级，例如 2.5；表示制作难度，不是评价分数。 |
| `defaultLanguage` | `cn`、`en`、`fr`；对应翻译必须存在。 |
| `ingredients[].id` | 食谱内唯一、稳定的条目 ID；不要随着排序变化重命名。 |
| `ingredients[].ingredient` | 对应配料注册表的 key；同一食谱可重复引用，例如不同阶段用的葱。 |
| `ingredients[].name` | 可选的语言对象，覆盖标准名称，例如 `{"cn":"葱白"}`。 |
| `ingredients[].amount` | 可选的语言对象；保留“适量”“半勺”等原文，不强制数字。 |
| `translations` | 每种语言填写 `title`、非空 `steps`，可选 `notes`。 |
| `videoLink` | 可选的 HTTP(S) 视频来源地址。 |

编辑器会根据 `$schema` 提供字段补全。命令行校验还会检查编辑器无法表达的配料引用、文件 ID、唯一条目 ID 和草稿发布规则。

### 家传隐藏菜单

家传食谱放在 `content/private/`，该目录被 Git 忽略，也不会被网站数据生成器读取。新增家传食谱同样放在此目录，并保留 `hidden: true`；不要移入 `content/recipes/`。

普通开发和生产预览只显示公开食谱。需要在本机查看家传食谱时，运行 `npm run dev:private`。该模式仅向回环地址返回私密内容，数据在内存中生成，不写入 `public/`。直接访问私密源文件的请求会被拒绝；任何模式下的生产构建都只包含公开食谱。

`hidden` 只控制网站发布，不能单独保护 GitHub 源码；私密内容必须放入上述被忽略的目录。不要用 `git add -f` 强制提交。仓库提供 `scripts/check-push-privacy.mjs`，配合本地 pre-push hook 阻止携带旧家传食谱历史的分支重新上传。

### 添加一种新配料

先在 `content/ingredients.json` 添加一个条目，然后在食谱中引用它：

```json
"pumpkin": {
  "category": "veggie",
  "names": { "cn": "南瓜", "en": "Pumpkin", "fr": "Citrouille" }
}
```

分类为 `meat`（肉鱼蛋）、`veggie`（蔬菜与果仁）、`dairy`、`pantry`、`seasoning`。名称至少提供一种语言，其他语言可稍后补。标准名称自动用于筛选和无覆盖的配料条目，毋须另改 TypeScript。

配料行的 `id` 与配料 key 不同：两个阶段都用料酒时，分别写 `wine-marinade` 和 `wine-sauce`，共同引用 `cooking-wine`。不要把它们合并，否则会丢失不同阶段的用量。

### 添加翻译

在同一食谱的 `translations` 中增加语言块，按需要补充配料的 `name` 和 `amount` 对应语言。缺失的食谱语言整体回退到 `defaultLanguage`；配料的局部翻译会回退到已有文本。所有语言的菜名与配料名都可以搜索。

## 检查与发布

```sh
npm run check    # 类型检查、ESLint、内容校验、测试
npm run build    # 类型检查、内容校验/生成、Vite 生产构建
npm run preview  # 检查实际构建产物
npm run deploy   # 先完整检查和构建，再发布 dist 到 gh-pages
```

默认 `base` 为 `/`，兼容现有 Cloudflare Worker；保留 `wrangler.jsonc` 静态资源部署配置。`npm run deploy` 会以 `--base=/CookingRecipe/` 构建并发布到 GitHub Pages。详情链接采用 hash，例如 `/#/recipes/butter-mochi-cake`，适配静态托管和直接刷新。

`public/data/catalog.json` 是自动生成的文件，不提交也不要手改。构建产物包含全部已发布食谱，浏览器只需要一个内容请求。GitHub Actions 对推送和 PR 执行检查与构建；不会自动部署。

## 代码结构

```text
content/
  recipes/                 每份食谱一个 JSON（唯一内容来源）
  ingredients.json         标准配料名称与分类
  *.schema.json            由 Zod 模型生成的编辑器 schema
src/
  app/                     页面壳、主题、hash 导航与 URL 状态
  domain/                  内容模型、翻译、搜索与筛选纯函数
  features/recipes/        列表、筛选面板、详情和内容加载
  shared/                  界面文案、图标、容错的本地存储
scripts/                   内容校验/生成、草稿创建、schema 生成
tests/                     内容流程、筛选语义、语言回退、路由
```

内容模型的唯一校验定义是 `src/domain/schema.ts`。改模型后运行 `npm run content:schema` 更新编辑器 schema，并运行完整检查。网络、URL 状态、内容转换与页面展示分层；无需引入全局状态库。

筛选语义是“包含所有选中的配料”，不代表这些食材足够完成整道菜。URL 保存搜索、类别、配料与排序；本地存储保存主题、语言和各食谱的勾选进度。浏览器禁止存储时，网站仍可使用，只是不持久化偏好。

Material UI 控件与统一主题位于 `src/app/theme.ts`，字体和图标均随构建打包，无运行时 CDN 依赖。打印视图隐藏导航与操作控件。
