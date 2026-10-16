function renderPosts (posts){
    const list = document.querySelector("#post-list");
    if(posts.length === 0){
        list.textContent = "아직 게시글이 없습니다.";
    }

    for(const post of posts) {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = `detail.html?id=${post.id}`;
        link.textContent = post.title;

        const meta = document.createElement("div");
        meta.className = "meta";
        meta.textContent = `${post.author} | ${post.createdDatetime}`;

        item.append(link, meta);
        list.append(item);
    }
}