async function login(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector("button[type=submit]");
    
    // 로그인 과정에서 문제 발생 시 안내 문구 출력용
    const message = document.querySelector("#login-message");

    if (button.disabled) {
        return;
    }

    button.disabled = true;
    message.textContent = "로그인 중...";

    const username = form.elements.username.value.trim();
    const password = form.elements.password.value;

    try {
        const tokens = await apiRequest("/user/login", "POST", { username, password });

        // 로그인은 성공했으나 응답에 토큰이 없는 경우
        if (!tokens?.accessToken) {
            throw new Error("액세스 토큰이 없습니다.");
        }

        // 로컬스토리지에 액세스 토큰 저장
        localStorage.setItem("accessToken", tokens.accessToken);
        location.href = "index.html";
    } catch (error) {
        message.textContent = error.message;
    } finally {
        button.disabled = false;
    }
}

document.querySelector("#login-form").addEventListener("submit", login);