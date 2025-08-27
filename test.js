const axios = require('axios');

// 测试配置
const BASE_URL = 'http://localhost:3000';

// 测试函数
async function testAPI() {
  console.log('🧪 开始测试 Keycloak LDAP Demo API...\n');

  try {
    // 测试1: 检查API根路径
    console.log('1. 测试API根路径...');
    const rootResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ API根路径正常:', rootResponse.data.message);
    console.log('可用端点:', Object.keys(rootResponse.data.endpoints).length, '个\n');

    // 测试2: 测试用户列表API（不需要认证）
    console.log('2. 测试获取用户列表...');
    try {
      const usersResponse = await axios.get(`${BASE_URL}/api/users`);
      console.log('✅ 用户列表API正常');
      console.log('用户数量:', usersResponse.data.length || 0, '\n');
    } catch (error) {
      console.log('⚠️  用户列表API需要认证或配置:', error.response?.data?.error || error.message, '\n');
    }

    // 测试3: 测试用户组API
    console.log('3. 测试用户组API...');
    try {
      const groupsResponse = await axios.get(`${BASE_URL}/api/users/test-id/groups`);
      console.log('✅ 用户组API正常');
      console.log('用户组数量:', groupsResponse.data.length || 0, '\n');
    } catch (error) {
      console.log('⚠️  用户组API需要认证或配置:', error.response?.data?.error || error.message, '\n');
    }

    // 测试4: 测试搜索API
    console.log('4. 测试用户搜索API...');
    try {
      const searchResponse = await axios.get(`${BASE_URL}/api/users/search?q=test`);
      console.log('✅ 用户搜索API正常');
      console.log('搜索结果数量:', searchResponse.data.length || 0, '\n');
    } catch (error) {
      console.log('⚠️  用户搜索API需要认证或配置:', error.response?.data?.error || error.message, '\n');
    }

    console.log('🎉 基础API测试完成！');
    console.log('\n📝 注意事项:');
    console.log('- 某些API需要Keycloak认证才能正常工作');
    console.log('- 请确保Keycloak服务正在运行');
    console.log('- 请配置正确的环境变量');
    console.log('- 访问 http://localhost:3000 查看Web界面');
    console.log('- 用户组和角色API需要有效的用户ID');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 请确保应用正在运行: npm start');
    }
  }
}

// 运行测试
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
