//console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
let pages = [
  { url: '', title: 'Home Page' },
  { url: 'projects/', title: 'Projects Page' },
  { url: 'contact/', title: 'Contact Page' },
  { url: 'cv/', title: 'Resume/CV' },
  { url: 'https://github.com/arcpro00', title: "GitHub Profile"}
];
let nav = document.createElement('nav');
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/portfolio/";         // GitHub Pages repo name

document.body.prepend(nav);
for (let p of pages) {
  let url = p.url;
  if (!url.startsWith('http')) {
    url = BASE_PATH + url;
    }
  let title = p.title;
  let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    if(a.host !== location.host){
        a.target = "_blank"
    }
    nav.append(a);
    if (a.host === location.host && a.pathname === location.pathname) {
  a.classList.add('current');}
};
document.body.insertAdjacentHTML(
  "afterbegin",'<label class="color-scheme">\
    Theme:\
    <select>\
        <option value="light dark">Automatic</option>\
        <option value="light">Light</option>\
        <option value="dark">Dark</option>\
    </select></label>'
)
let select = document.querySelector("select")
if ("colorScheme" in localStorage){
  select.value = localStorage.colorScheme
  document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
}
select.addEventListener('input', function (event) {
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  localStorage.colorScheme = event.target.value;
});


let navLinks = $$("nav a")
let currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname,
);

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
    }
    console.log("The URL being fetched is:", response.url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';
  for (const project of projects){
    const article = document.createElement('article');
    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;
    containerElement.appendChild(article);
  }


  
}
