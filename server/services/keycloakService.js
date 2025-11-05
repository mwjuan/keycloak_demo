const axios = require('axios');

class KeycloakService {
  constructor() {
    this.baseUrl = process.env.KEYCLOAK_BASE_URL;
    this.realm = process.env.KEYCLOAK_REALM;
    this.clientId = process.env.KEYCLOAK_CLIENT_ID;
    this.clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;
    this.adminUsername = process.env.KEYCLOAK_ADMIN_USERNAME;
    this.adminPassword = process.env.KEYCLOAK_ADMIN_PASSWORD;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // 获取管理员访问令牌
  async getAdminToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      let url = `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`;
      const response = await axios.post(
        `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          grant_type: 'password',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          username: this.adminUsername,
          password: this.adminPassword
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);

      return this.accessToken;
    } catch (error) {
      console.error('获取管理员令牌失败:', error.response?.data || error.message);
      throw new Error('无法获取管理员访问令牌');
    }
  }

  // 用户登录
  async login(username, password) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          grant_type: 'password',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          username: username,
          password: password
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return {
        success: true,
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_in: response.data.expires_in,
        token_type: response.data.token_type
      };
    } catch (error) {
      console.error('用户登录失败:', error.response?.data || error.message);
      throw new Error('用户名或密码错误');
    }
  }

  // 用户登出
  async logout(refreshToken) {
    try {
      await axios.post(
        `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/logout`,
        new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return { success: true, message: '登出成功' };
    } catch (error) {
      console.error('用户登出失败:', error.response?.data || error.message);
      throw new Error('登出失败');
    }
  }

  // 获取所有用户
  async getUsers() {
    try {
      const token = await this.getAdminToken();
      console.log(111, token)
      const response = await axios.get(
        `${this.baseUrl}/admin/realms/${this.realm}/users?email=@shgbit.com`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
      return response.data
    } catch (error) {
      console.error('获取用户列表失败:', error.response?.data || error.message);
      throw new Error('获取用户列表失败');
    }
  }

  // 根据ID获取用户
  async getUserById(userId) {
    try {
      const token = await this.getAdminToken();
      const response = await axios.get(
        `${this.baseUrl}/admin/realms/${this.realm}/users/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const user = response.data;
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        enabled: user.enabled,
        emailVerified: user.emailVerified,
        createdTimestamp: user.createdTimestamp,
        attributes: user.attributes || {}
      };
    } catch (error) {
      console.error('获取用户失败:', error.response?.data || error.message);
      throw new Error('用户不存在');
    }
  }

  // 搜索用户
  async searchUsers(searchTerm) {
    try {
      const token = await this.getAdminToken();
      const response = await axios.get(
        `${this.baseUrl}/admin/realms/${this.realm}/users`,
        {
          params: {
            search: searchTerm
          },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        enabled: user.enabled,
        emailVerified: user.emailVerified,
        createdTimestamp: user.createdTimestamp,
        attributes: user.attributes || {}
      }));
    } catch (error) {
      console.error('搜索用户失败:', error.response?.data || error.message);
      throw new Error('搜索用户失败');
    }
  }

  // 获取用户组
  async getUserGroups(userId) {
    try {
      const token = await this.getAdminToken();
      const response = await axios.get(
        `${this.baseUrl}/admin/realms/${this.realm}/users/${userId}/groups`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('获取用户组失败:', error.response?.data || error.message);
      throw new Error('获取用户组失败');
    }
  }

  // 获取用户角色
  async getUserRoles(userId) {
    try {
      const token = await this.getAdminToken();
      const response = await axios.get(
        `${this.baseUrl}/admin/realms/${this.realm}/users/${userId}/role-mappings/realm`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('获取用户角色失败:', error.response?.data || error.message);
      throw new Error('获取用户角色失败');
    }
  }
}

module.exports = new KeycloakService();
