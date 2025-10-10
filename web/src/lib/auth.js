export function setCookie(name, value, options = {}) {
	const { days, hours, minutes, path = "/", sameSite = "Lax", secure = false } = options
	let expires = ""
	if (days || hours || minutes) {
		const date = new Date()
		const totalMs = (days || 0) * 24 * 60 * 60 * 1000 + (hours || 0) * 60 * 60 * 1000 + (minutes || 0) * 60 * 1000
		date.setTime(date.getTime() + totalMs)
		expires = "; expires=" + date.toUTCString()
	}
	const secureAttr = secure ? "; Secure" : ""
	document.cookie = `${name}=${encodeURIComponent(value || "")}${expires}; path=${path}; SameSite=${sameSite}${secureAttr}`
}

export function getCookie(name) {
	const match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"))
	return match ? decodeURIComponent(match[1]) : ""
}

export function deleteCookie(name, path = "/") {
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`
}

export function clearAuthCookies() {
	deleteCookie("access_token")
	deleteCookie("refresh_token")
}

export function getAccessToken() {
	return getCookie("access_token")
}

export function getRefreshToken() {
	return getCookie("refresh_token")
}


