import { Button } from "@/components/ui/button"
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function Home() {
	const [name, setName] = useState()
	const [email, setEmail] = useState()
	useEffect(() => {
		const hash = window.location.hash;
		if (hash.includes('?')) {
			const queryString = hash.substring(hash.indexOf('?') + 1);
			const params = new URLSearchParams(queryString);
			setName(params.get('name'));
			setEmail(params.get('email'));
		}

	}, [])

	const handleLogout = async () => {
		Cookies.remove('codeVerifier')
		let token = Cookies.get('id_token');
		Cookies.remove('id_token')

		// 本地测试
		const logoutUrl = new URL('http://localhost:8080/realms/master/protocol/openid-connect/logout'); 
		// 公司测试
		// const logoutUrl = new URL('http://172.16.30.63:8080/realms/master/protocol/openid-connect/logout');
		if (token) {
			logoutUrl.searchParams.set('id_token_hint', token);
		}

		window.location.href = logoutUrl.toString();
	}

	return (
		<div className="flex-col fixed  inset-0 w-full h-full flex items-center justify-center p-6">
			name：{name}, email：{email}
			<div className="w-full max-w-sm border rounded-xl p-6 shadow-sm bg-white/50 dark:bg-neutral-900/50">
				<Button
					type="submit"
					onClick={() => handleLogout()}
					className="w-full text-black">
					退出
				</Button>
			</div>
		</div>
	)
}