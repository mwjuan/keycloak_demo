const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const path = require('path');
require('dotenv').config();
const moment = require('moment');

const keycloakService = require('./services/keycloakService');
const axios = require('axios');
const qs = require('qs');
const crypto = require('crypto');

const app = new Koa();
const router = new Router();

const redirectUri = `http://localhost:5173/api/auth/callback`
const baseUrl = process.env.KEYCLOAK_BASE_URL;
const realm = process.env.KEYCLOAK_REALM;
const clientId = process.env.KEYCLOAK_CLIENT_ID;
const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;

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

router.get('/api/auth/callback', async (ctx) => {
  try {
    const { state, code } = ctx.request.query;
    let codeVerifier = ctx.cookies.get('codeVerifier')
    let data = qs.stringify({
      'grant_type': 'authorization_code',
      'code': code,
      'client_id': clientId,
      'redirect_uri': redirectUri,
      'client_secret': clientSecret,
      'code_verifier': codeVerifier
    });

    let config = {
      method: 'post',
      url: `${baseUrl}/realms/${realm}/protocol/openid-connect/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data
    };

    let result = await axios.request(config)
    let tokenData = result.data;
    let userResult = await axios.get(`${baseUrl}/realms/${realm}/protocol/openid-connect/userinfo`, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    })
    console.log(1111, userResult.data)
    ctx.cookies.set('id_token', tokenData.id_token, { httpOnly: false, expires: moment().add(1, 'day').toDate() });
    ctx.redirect(`http://localhost:5173/#/home?name=${userResult.data.preferred_username}&email=${userResult.data.email}`);
  } catch (error) {
    console.log(error)
    ctx.status = 400;
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
