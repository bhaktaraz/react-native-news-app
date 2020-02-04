const API_BASE_BASE_URL = "https://www.dhangadhikhabar.com/api/";

export async function getNews() {
    let result = await fetch(API_BASE_BASE_URL+'news').then(response => response.json());
    return result.data;
}

export async function getBreakingNews() {
    let result = await fetch(API_BASE_BASE_URL+'news?breaking=1').then(response => response.json());
    return result.data;
}

export async function getFeaturedNews() {
    let result = await fetch(API_BASE_BASE_URL+'news?featured=1').then(response => response.json());
    return result.data;
}

export async function getNewsByCategory(categoryId) {
    let result = await fetch(API_BASE_BASE_URL+'news?category='+categoryId).then(response => response.json());
    return result.data;
}

export async function getNewsByAuthor(authorId) {
    let result = await fetch(API_BASE_BASE_URL+'news?author='+authorId).then(response => response.json());
    return result.data;
}

export async function getNewsByTag(tagId) {
    let result = await fetch(API_BASE_BASE_URL+'news?tag='+tagId).then(response => response.json());
    return result.data;
}

export async function getNewsDetail(id) {
    let result = await fetch(API_BASE_BASE_URL+'news/'+id).then(response => response.json());
    return result.data;
}

export async function getTrendingTags() {
    let result = await fetch(API_BASE_BASE_URL+'tags').then(response => response.json());
    return result.data;
}

export async function getCategories() {
    let result = await fetch(API_BASE_BASE_URL+'categories').then(response => response.json());
    return result.data;
}