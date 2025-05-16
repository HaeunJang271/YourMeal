// script.js
document.getElementById("generate").addEventListener("click", async () => {
  const ingredients = document.getElementById("ingredients").value;
  if (!ingredients) return alert("재료를 입력해주세요!");

  const res = await fetch("https://us-central1-testapp-40923.cloudfunctions.net/gptfree", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients }),
  });

  const data = await res.json();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (data.recipes) {
    data.recipes.forEach((r) => {
      const card = document.createElement("div");
      card.className = "recipe-card";
      card.innerHTML = `
        <h3>${r.title}</h3>
        <p><strong>설명:</strong> ${r.description}</p>
        <p><strong>조리 시간:</strong> ${r.time}</p>
        <p><strong>조리법:</strong> ${r.recipe}</p>
      `;
      resultsDiv.appendChild(card);
    });
  } else {
    resultsDiv.innerText = "추천 결과를 불러오는 데 실패했어요.";
  }
});
