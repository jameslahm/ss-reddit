# SS-Reddit

> production deploy: https://ss-reddit.vercel.app/

## 实验说明

项目使用`create-react-app`初始化项目，使用`chakra-ui`作为 UI 库，使用`@reach/router`进行路由管理，使用`react-query`以及`fetch`进行接口请求，使用`editorjs`支持富文本编辑，使用`remark`支持`markdown`编辑，同时支持富文本和`markdown`渲染展示帖子，使用`localStorage`实现持久化登录

## 开发说明

```bash
# install dependencies
yarn

# develop
# 为方便评测，在develop中将分页大小均设为了1，方便评测分页功能
yarn start

# build
yarn build

# lint
yarn lint
```

## 功能实现

> 说明：点击帖子右上方的编辑按钮可以编辑自己发过的帖子或者回帖，点击右上方的收藏按钮可以收藏该帖子，点击右上方的回复按钮可对该帖子或者回帖进行回复，所有展示帖子列表页面均有分页，编辑及回复帖子均支持富文本模式和`markdown`模式

### `Login`路由进行登录

> 可点击登录后 Header 中的`LogOut`进行登出

#### 登录页面 `/login`

![](./screenshots/login.png)

#### 登录成功页面

![](./screenshots/login-success.jpg)

#### 登录失败页面

![](./screenshots/login-failure.jpg)

### `Home`首页浏览帖子列表 `/`

![](./screenshots/home.png)

### 帖子详情页 `/post/:id`

> 点击帖子右上方的进入箭头可查看帖子详情页，帖子回复显示采用`Reddit`楼中楼的设计
> 可以切换上方的`Only See Author`来实现是否只看楼主

![](./screenshots/post-detail.png)

#### 编辑帖子页面 `/edit/:id`

![](./screenshots/edit-post.jpg)

#### 回复帖子页面

![](./screenshots/reply-post.jpg)

#### 回复嵌套帖子

![](./screenshots/reply-nested.jpg)

#### 编辑已回复帖子

![](./screenshots/edit-reply.jpg)

### `Post`路由进行发帖 `/edit`

#### 富文本编辑模式

![](./screenshots/edit-rich-text.png)

#### `markdown`编辑模式

##### `markdown`编辑

![](./screenshots/edit-markdown.png)

##### `markdown`预览

![](./screenshots/edit-markdown-preview.png)

### `Profile`用户详情页面 `/user/:id`

> 点击帖子左上方发帖人的头像或者名字可以进入发帖人详情页,用户详情页面`Posts Tab`显示用户发过的所有帖子，`History Tab`显示用户浏览过的帖子，`BookMarks Tab`显示用户收藏过的帖子，只有用户本人可以查看`History Tab`和`BookMarks Tab`

![](./screenshots/profile.jpg)

### 登录凭证过期页面

![](./screenshots/expired-login.jpg)

### 编辑无权限页面

> 编辑他人帖子会自动跳回该帖子详情页

![](./screenshots/permission-error.jpg)

### 404错误界面
![](./screenshots/404.jpg)

### 网络错误或其他错误页面

![](./screenshots/network-error.jpg)

## 功能亮点

- 实现了富文本编辑以及`markdown`编辑模式，同时富文本编辑模式支持嵌入，比如`codepen.io`，`youtube`等(可通过直接粘贴链接实现嵌入)，支持通过上传本地文件、粘贴图片链接，拖拽文件等方式输入图片，且富文本编辑模式的帖子在渲染时，长图及宽图会自动缩小，点击该图片即可放大查看，再次点击可缩小，支持`Todo checkList`，支持添加`table`，`code`以及`link`等，输入时可使用 tab 键添加相应输入块，点击块后右上方出现的四点按钮可以进行块的变换、设置、删除等；`markdown`编辑模式支持`GitHub Flavored Markdown Spec`，另外也支持`latex`公式渲染；两种编辑模式均支持自定义表情的插入，点击编辑界面右上角表情按钮选择自定义表情即可，目前添加了`Github`的`octocat`表情和百度贴吧的滑稽表情
- UI 支持`dark`和`light`两种主题

## 样例

### `Markdown`模式帖子样例 URL

http://localhost:3000/post/10
https://ss-reddit.vercel.app/post/10

### 富文本模式帖子样例 URL

http://localhost:3000/post/3
https://ss-reddit.vercel.app/post/3

### 回复帖子样例 URL

> 其中每层最后一个回帖都有嵌套回帖，共有 10 层

http://localhost:3000/post/3
https://ss-reddit.vercel.app/post/3


## 其他说明
`development`模式中浏览器开发者工具控制台界面会报`controlled components`以及`Invalid DOM property 'for'`的警告，原因是使用第三方包中的组件错误，已提`pull request`
