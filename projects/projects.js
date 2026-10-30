import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');

renderProjects(projects, projectsContainer, 'h2');
projectsTitle.textContent = `${projects.length} Projects`;
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

function setQuery(query) {
  return projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
}

function renderPieChart(projectsGiven) {
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));
  let colors =  d3.scaleOrdinal(d3.schemeTableau10);
  let selectedIndex = -1;
  let newSVG = d3.select('#projects-pie-plot');
  newSVG.selectAll('path').remove();
  newArcs.forEach((arc,i) => {
    newSVG
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(i))
    .on('click', () => {
      selectedIndex = selectedIndex === i ? -1 : i;

      newSVG
        .selectAll('path')
        .attr('class', (_, idx) =>
          selectedIndex === idx ? 'selected' : ''
        );

      if (selectedIndex === -1) {
        renderProjects(projectsGiven, projectsContainer, 'h2');
      } else {
        let selectedYear = newArcData[selectedIndex].data.label;

        let filteredProjects = projectsGiven.filter(
          (project) => project.year === selectedYear
        );

        renderProjects(filteredProjects, projectsContainer, 'h2');
      }
    });
});
  let legend = d3.select('.legend');
  legend.selectAll('li').remove();
  newData.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

renderPieChart(projects);

const searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('change', (event) => {
  let filteredProjects = setQuery(event.target.value);
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});