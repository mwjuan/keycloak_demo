const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const path = require('path');
require('dotenv').config();

const keycloakService = require('./services/keycloakService');

const app = new Koa();
const router = new Router();

// 中间件
app.use(bodyParser());

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      error: err.message,
      status: ctx.status
    };
    console.error('Error:', err);
  }
});

// 路由
router.get('/', async (ctx) => {
  ctx.body = {
    message: 'Keycloak User Management Demo API',
    endpoints: {
      '/api/auth/login': 'POST - 用户登录',
      '/api/auth/logout': 'POST - 用户登出',
      '/api/users': 'GET - 获取所有用户',
      '/api/users/:id': 'GET - 获取特定用户',
      '/api/users/search': 'GET - 搜索用户',
      '/api/users/:id/groups': 'GET - 获取用户组',
      '/api/users/:id/roles': 'GET - 获取用户角色'
    }
  };
});

// 认证相关路由
router.post('/api/auth/login', async (ctx) => {
  const { username, password } = ctx.request.body;
  
  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { error: '用户名和密码不能为空' };
    return;
  }

  try {
    const result = await keycloakService.login(username, password);
    ctx.body = result;
  } catch (error) {
    ctx.status = 401;
    ctx.body = { error: '登录失败', details: error.message };
  }
});

router.post('/api/auth/logout', async (ctx) => {
  const { refreshToken } = ctx.request.body;
  
  try {
    const result = await keycloakService.logout(refreshToken);
    ctx.body = result;
  } catch (error) {
    ctx.status = 400;
    ctx.body = { error: '登出失败', details: error.message };
  }
});

// 用户管理路由
router.get('/api/users', async (ctx) => {
  try {
    const users = await keycloakService.getUsers();
    ctx.body = users;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '获取用户列表失败', details: error.message };
  }
});

router.get('/api/users/:id', async (ctx) => {
  const { id } = ctx.params;
  
  try {
    const user = await keycloakService.getUserById(id);
    ctx.body = user;
  } catch (error) {
    ctx.status = 404;
    ctx.body = { error: '用户不存在', details: error.message };
  }
});

router.get('/api/users/search', async (ctx) => {
  const { q } = ctx.query;
  
  if (!q) {
    ctx.status = 400;
    ctx.body = { error: '搜索关键词不能为空' };
    return;
  }

  try {
    const users = await keycloakService.searchUsers(q);
    ctx.body = users;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '搜索用户失败', details: error.message };
  }
});

router.get('/api/users/:id/groups', async (ctx) => {
  const { id } = ctx.params;
  
  try {
    const groups = await keycloakService.getUserGroups(id);
    ctx.body = groups;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '获取用户组失败', details: error.message };
  }
});

router.get('/api/users/:id/roles', async (ctx) => {
  const { id } = ctx.params;
  
  try {
    const roles = await keycloakService.getUserRoles(id);
    ctx.body = roles;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: '获取用户角色失败', details: error.message };
  }
});



// 使用路由
app.use(router.routes());
app.use(router.allowedMethods());

// 静态文件中间件（放在路由之后）
app.use(serve(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📖 API Documentation available at http://localhost:${PORT}`);
});
