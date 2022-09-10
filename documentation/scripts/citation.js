const citationCard = document.getElementById("citationCard");
const seasonEl =  document.getElementById("season");
const episodeEl =  document.getElementById("episode");
const citationEl =  document.querySelector("#citation > p");
const actorEl =  document.getElementById("actor");
const persoEl =  document.getElementById("perso");

const btnLoadCitation =  document.getElementById("loadCitation");

const loadAndDisplayCitation = async () => {
	citationCard.setAttribute('aria-busy', "true" );
	await window['sass-swing'].wait(1000);
	const response = await fetch('https://kaamelott.chaudie.re/api/random');
	if (!response.ok) {
		const message = `Il y a eu une erreur dans la reponse : ${response.status}`;
		citationEl.innerText = message;
		citationCard.setAttribute('aria-busy', "false" );
		throw new Error(message);
	}
	const data = await response.json();
  console.log(data);

	if (data.status !== 1) {
		const message = `Il y a eu une erreur avec l'API : (status = ${data.status} - code = ${data.code}) : ${data.error}`;
		citationEl.innerText = message;
		citationCard.setAttribute('aria-busy', "false" );
		throw new Error(message);
	}

	const { acteur, auteur, episode, personnage, saison } = data.citation.infos;
	const citation = data.citation.citation;
	actorEl.innerText = acteur;
	persoEl.innerText = personnage;
	seasonEl.innerText = saison;
	episodeEl.innerText = episode;
	citationEl.innerText = window['sass-swing'].escapeHTML(citation);

	citationCard.setAttribute('aria-busy', "false" );
}

window.addEventListener("DOMContentLoaded", () => {
	const debounceLoadCitation = window['sass-swing'].debounceAsync(loadAndDisplayCitation, 500);
	btnLoadCitation.addEventListener("click", debounceLoadCitation);
})
