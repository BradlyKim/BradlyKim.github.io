const pageSize = 100;
let totalResults = 0;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const category = urlParams.get("category") || "general";
const country = urlParams.get("country") || "kr";
const page = urlParams.get("page") || "1";
const q = urlParams.get("q");
$(".select-country").val(country);
$(".input-q").val(q);
$("#input-country").val(country);
$("#input-category").val(category);

const renderArticle = (article) => {
  const { url, urlToImage, title, description, publishedAt } = article;
  return `
 <li class = "news-item">
 <a href="${url}" >
  <article>
   <img class = "img-article" src = "${urlToImage}"/>
   <div class = "content-article">
   <h2>${title}</h2>
   <div>${description}</div>   
   <p>${publishedAt.substr(0, 16).split("T").join(" ")}</p>
   </div>
  </article>
  </a>
 </li>
`;
};

const renderPagination = () => {
  const startPage = Math.floor((page - 1) / 10) * 10 + 1;
  const totalPage = Math.floor((totalResults - 1) / pageSize) + 1;
  const lastPage = startPage + 9 > totalPage ? totalPage : startPage + 9;

  let html = `<ul class="page-list">`;
  html += startPage > 1 ? "<li class='page-prev'>이전</li>" : "";
  for (let i = startPage; i <= lastPage; i++) {
    const currentPage = i === +page ? " current-page" : "";
    html += `<li class="page-item${currentPage}">${i}</li>`;
  }
  if (page < totalPage) {
    html += "<li class='page-next'>다음</li>";
  }
  html += "</ul>";

  $(".pagination").html(html);
};

$(document).on("click", ".page-item", (e) => {
  const page = $(e.target).text();
  urlParams.set("page", page);
  window.location.search = urlParams.toString();
  getArticles();
});

$(document).on("click", ".page-prev", (e) => {
  urlParams.set("page", page - 1);
  window.location.search = urlParams.toString();
  getArticles();
});

$(document).on("click", ".page-next", (e) => {
  urlParams.set("page", +page + 1);
  window.location.search = urlParams.toString();
  getArticles();
});

const getArticles = () => {
  const data = {
    country,
    q,
    category,
    pageSize,
    page,
  };
  $.ajax({
    url: "https://newsapi.org/v2/top-headlines",
    method: "get",
    headers: {
      "X-Api-Key": "83bffe1b7d3343c29343aaec212cdaf1",
    },
    data,
    success: (result) => {
      console.log(result);
      const articles = result.articles;
      // 리엑트 코드 const { articles } = result;
      // let html = "";
      // for (let i = 0; i < articles.length; i++) {
      //   html += renderArticle(articles[i]);
      // }

      const arr = articles.map((article, i) => renderArticle(article));
      const html = arr.join("");
      $(".news-list").html(html);

      totalResults = result.totalResults;
      renderPagination();
    },
  });
};

$(".select-country").change((e) => {
  const country = e.target.value;

  urlParams.set("country", country);
  window.location.search = urlParams.toString();

  // getArticles();
});

$(".form-search").submit((e) => {
  e.preventDefault();
  q = $(".input-q").val();
  getArticles();
});

$(".category-list").on("click", "a", (e) => {
  e.preventDefault();
  const category = $(e.currentTarget).data("link");
  urlParams.set("category", category);
  window.location.search = urlParams.toString();
});

getArticles();
