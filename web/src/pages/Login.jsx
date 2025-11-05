import { Button } from "@/components/ui/button"
import Cookies from "js-cookie";

// Base64 URL 安全的编码
const base64UrlEncode = (array) => {
    return btoa(String.fromCharCode.apply(null, array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
};

// 生成随机的 code_verifier (43-128 字符)
const generateCodeVerifier = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return base64UrlEncode(array);
};

// 生成 code_challenge (使用 S256 方法)
const generateCodeChallenge = async (verifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);

    // 使用 Web Crypto API 进行 SHA-256 哈希
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    return base64UrlEncode(new Uint8Array(digest));
};

// 生成随机 state 参数
const generateState = () => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export default function LoginPage() {
    const handleSubmit = async () => {
        // 生成 PKCE 参数
        const codeVerifier = generateCodeVerifier();
        Cookies.set('codeVerifier', codeVerifier)
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        const state = generateState();

        // 本地测试
        const authorizeBase = "http://localhost:8080/realms/master/protocol/openid-connect/auth" 
        // 公司测试
        // const authorizeBase = "rhttp://172.16.30.63:8080/realms/master/protocol/openid-connect/auth" 
        const redirectUri = `http://localhost:5173/api/auth/callback`


        const params = new URLSearchParams({
            response_type: "code",
            client_id: "test",
            redirect_uri: redirectUri,
            scope: 'openid profile email phone address',
            nonce: 'bc4ef110-f076-485a-b492-63f5d1586fef',
            state,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
            response_mode: 'query',
        })
        window.location.href = `${authorizeBase}?${params.toString()}`
    }

    return (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center p-6">
            <div className="w-full max-w-sm border rounded-xl p-6 shadow-sm bg-white/50 dark:bg-neutral-900/50">
                <Button type="submit" onClick={() => handleSubmit()} className="w-full text-black">登录</Button>
            </div>
        </div>
    )
}