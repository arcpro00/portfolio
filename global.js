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
  : "/arcpro00.github.io/portfolio/";         // GitHub Pages repo name

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
        <option value="Automatic">Automatic</option>\
        <option value="Light">Light</option>\
        <option value="Dark">Dark</option>\
    </select></label>'
)

let navLinks = $$("nav a")
let currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname,
);

