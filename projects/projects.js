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
  let newSVG = d3.select('#projects-pie-plot');
  newSVG.selectAll('path').remove();
  newArcs.forEach((arc, i) => {
  newSVG
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(i))
    .attr('class',
      selectedYear === newArcData[i].data.label ? 'selected' : ''
    )
    .on('click', () => {
      let clickedYear = newArcData[i].data.label;
      selectedYear = selectedYear === clickedYear ? null : clickedYear;

      newSVG
        .selectAll('path')
        .attr('class', (_, idx) =>
          selectedYear === newArcData[idx].data.label ? 'selected' : ''
        );

      if (selectedYear === null) {
        renderProjects(projectsGiven, projectsContainer, 'h2');
      } else {
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
let selectedYear = null;
renderPieChart(projects);

const searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
  let filteredProjects = setQuery(event.target.value);
  renderPieChart(filteredProjects);
  if (selectedYear === null) {
    renderProjects(filteredProjects, projectsContainer, 'h2');
  } else {
    let yearFilteredProjects = filteredProjects.filter(
      (project) => project.year === selectedYear
    );
    renderProjects(yearFilteredProjects, projectsContainer, 'h2');
  }
});