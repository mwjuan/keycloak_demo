# Keycloak User Management Demo

这是一个使用 Node.js 和 Koa 框架开发的演示应用，用于连接 Keycloak 并管理用户信息。

## 功能特性

- 🔐 **用户认证**: 支持用户登录和登出
- 👥 **用户管理**: 获取所有用户、搜索用户、获取特定用户信息
- 🏷️ **用户组管理**: 获取用户组信息
- 🔑 **角色管理**: 获取用户角色信息
- 🌐 **Web 界面**: 提供友好的 Web 界面进行 API 测试
- 🔧 **RESTful API**: 完整的 REST API 接口

## 技术栈

- **后端**: Node.js + Koa + Koa Router
- **前端**: HTML5 + CSS3 + JavaScript (原生)
- **认证**: Keycloak OpenID Connect
- **用户管理**: Keycloak Admin API

## 项目结构

```
keycloak-user-management-demo/
├── app.js                 # 主应用文件
├── package.json           # 项目依赖配置
├── env.example           # 环境变量示例
├── README.md             # 项目说明文档
├── services/             # 服务层
│   └── keycloakService.js # Keycloak 服务
└── public/               # 静态文件
    └── index.html        # Web 界面
```

## 安装和配置

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制环境变量示例文件并配置：

```bash
cp env.example .env
```

编辑 `.env` 文件，配置以下参数：

```env
# Keycloak Configuration
KEYCLOAK_BASE_URL=http://localhost:8080
KEYCLOAK_REALM=master
KEYCLOAK_CLIENT_ID=admin-cli
KEYCLOAK_CLIENT_SECRET=your-client-secret
KEYCLOAK_ADMIN_USERNAME=admin
KEYCLOAK_ADMIN_PASSWORD=admin

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Keycloak 配置

确保你的 Keycloak 实例正常运行：

1. 登录 Keycloak 管理控制台
2. 选择相应的 Realm
3. 确保管理员用户有足够的权限
4. 配置正确的客户端密钥

### 4. 启动应用

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

应用将在 `http://localhost:3000` 启动。

## API 接口

### 认证相关

#### 用户登录
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password"
}
```

#### 用户登出
```
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}
```

### 用户管理

#### 获取所有用户
```
GET /api/users
```

#### 获取特定用户
```
GET /api/users/:id
```

#### 搜索用户
```
GET /api/users/search?q=search_term
```

#### 获取用户组
```
GET /api/users/:id/groups
```

#### 获取用户角色
```
GET /api/users/:id/roles
```

## Web 界面

访问 `http://localhost:3000` 可以使用 Web 界面：

- **连接状态**: 测试 Keycloak 连接
- **用户认证**: 用户登录和登出
- **用户管理**: 获取、搜索用户信息
- **用户组管理**: 获取用户组信息
- **角色管理**: 获取用户角色信息

## 使用示例

### 1. 测试连接

首先测试 Keycloak 连接是否正常：

```bash
curl http://localhost:3000/
```

### 2. 用户登录

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin"
  }'
```

### 3. 获取用户组

```bash
curl http://localhost:3000/api/users/{user-id}/groups
```

### 4. 获取用户角色

```bash
curl http://localhost:3000/api/users/{user-id}/roles
```

## 错误处理

应用包含完整的错误处理机制：

- 网络连接错误
- 认证失败
- LDAP 配置错误
- 用户不存在
- 权限不足

所有错误都会返回适当的 HTTP 状态码和错误信息。

## 开发说明

### 添加新的 API 端点

1. 在 `app.js` 中添加新的路由
2. 在相应的服务文件中实现业务逻辑
3. 更新前端界面（如需要）

### 扩展 LDAP 功能

1. 在 `services/ldapService.js` 中添加新的方法
2. 在 `app.js` 中添加对应的路由
3. 更新前端界面

### 环境变量

所有配置都通过环境变量管理，确保：

- 不同环境使用不同配置
- 敏感信息不被提交到代码库
- 便于部署和配置管理

## 故障排除

### 常见问题

1. **Keycloak 连接失败**
   - 检查 Keycloak 是否正在运行
   - 验证 URL 和端口配置
   - 确认网络连接

2. **用户组/角色获取失败**
   - 检查用户ID是否正确
   - 验证用户是否存在
   - 确认管理员权限

3. **认证失败**
   - 检查用户名和密码
   - 验证客户端配置
   - 确认用户状态

### 日志查看

应用会输出详细的日志信息，包括：

- 连接状态
- API 调用结果
- 错误详情

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
