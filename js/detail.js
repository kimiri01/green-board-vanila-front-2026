const params = new URLSearchParams(location.search);
const postId = Number(params.get("id"));

// posts 배열에서 사용자가 누른 게시글 찾기
async function loadPost() {
    const message = document.querySelector("#post-message");
    message.textContent = "게시글을 불러오는 중...";
    const reloadButton = document.querySelector("#retry-post")
    try {
        // 게시글 상세 조회 API 호출
        const post = await apiRequest(`/board/${postId}`);
        renderPost(post);
        message.textContent = "";
        reloadButton.hidden = true;
        return true;
    } catch (error) {
        document.querySelector("#post-title").textContent = "게시글 조회 실패";
        document.querySelector("#post-content").textContent = "";
        message.textContent = error.message;
        reloadButton.hidden = false;
        return false;
    }
}

async function loadComments() {
    try {
        const comments = await apiRequest(`/board/${postId}/comment`);
        renderComments(comments)
    } catch (error) {
        document.querySelector("#comment-message").textContent = error.message;
    }
}

document.querySelector("#comments-section").hidden = true;


if (requireLogin()) {
    if (Number.isSafeInteger(postId) && postId > 0) {
        // 비동기 작업을 위한 방법
        // 1. async / await
        // 2. Promise -> then() / catch()

        // 게시글 상세 정보 조회
        loadPost().then(function (success){
            if (success) {
                // 댓글 영역 표시
                document.querySelector("#comments-section").hidden = false;
                loadComments();
            }
        });


        // // 지금 postId에 해당하는 댓글만 출력하도록 필터링
        // let filteredComments = comments.filter(
        //     (comment) => comment.boardId === postId,
        // );
        // renderComments(filteredComments);
    } else {
        document.querySelector("#post-title").textContent = "잘못된 게시글 번호입니다.";
        document.querySelector("#post-content").textContent = "";
    }
}

// 댓글 작성 폼 submit 시 댓글 추가
document.querySelector("#comment-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const input = document.querySelector("#comment-content");
    const content = input.value.trim();
    const message = document.querySelector("#comment-message")


    // 현재 페이지에 해당하는 게시글이 없거나
    // 댓글 내용이 비어있거나 255자를 넘는 경우 예외 처리
    if (!content || content.length > 255) {
          message.textContent = "댓글은 1 ~ 255자로 입력하세요.";
         return;
    }

    try {
        //댓글 생성(저장) API 호출
        await apiRequest(`/board/${postId}/comment`, "POST", { content });
        input.value = "";
        await loadComments();
    } catch (error) {
        message.textContent = error.message;
    }
})

document.querySelector("#retry-post").addEventListener("click", () => {
    // 재로드 방법 1. 게시글 불러오는 함수 재호출
    loadPost();

    // 재로드 방법 2. 새로고침 방법
    location.reload();
})