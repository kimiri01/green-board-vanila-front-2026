// Spirng Board API 응답 규칙
// { success, message, data }
const API_SERVER = "http://127.0.0.1:8080/api";

// API 요청 보내는 코드 분리
async function apiRequest(path, method = "GET", body = null) {
    const headers = {};

    // 로그인 외의 모든 요청은 헤더에 Authrization : {token} 발생
    if (path !== "/user/login") {
        Object.assign(headers, getAuthHeaders());
    }

    // 요청에 Body 내요이 있는 경우 content-type 헤더 설정
    if(body !== null) {
        headers["Content-Type"] = "application/json";
    }

    // 삼항연산자
    // 조건식 ? {값1} : {값2}
    // 만약 조건식이 참이라면 값1을 반환하고,
    // 그렇지 않다면 값2를 반환한다.

    let response;
    try {
        response = await fetch(`${API_SERVER}${path}`, {method, headers, 
            // 매개 변수로 받은 body값이 null인 경우에는 undefined를,
            // 그렇지 않은 경우에는 body 값을 stringify(직렬화)하여 적재
            body: body === null ? undefined: JSON.stringify(body)});
    } catch {
        throw new Error("서버에 연결할 수 없습니다.")
    }

    const result = await response.json().catch((err) => {
        console.log(err);
        return null;
    });
    
    // ? -> 해당 변수가 비어있는지 먼저 체크 후, 나머지 코드 실행
    if (!response.ok || !result?.success) {

        // 엑세스 토큰 만료 등으로 401코드 반환될 시
        // 재로그인 유도
        // /user/login 요처은 제외하는 이유
        // - 이미 로그인 화면에서 로그인 요청을
        // - 시도 중이기 때문에 다시 로그인 화면으로 보낼 필요 X
        if (response.status === 401 && path !== "/user/login") {
            localStorage.removeItem("accessToken");
            requireLogin();
            throw new Error("로그인 정보가 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.");
        }
        throw new Error(
            result?.message || `요청 실패 (${response.status})`
        )
}
    return result. data;
}