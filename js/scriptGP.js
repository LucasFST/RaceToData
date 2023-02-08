//Requete API pour avoir des infos sur les GP
async function recupererInfosGpAPI() {
  let response = await fetch("http://localhost:3000/infosGpAPI");
  response = await response.json();
  return response["MRData"]["CircuitTable"]["Circuits"];
}

async function recupererInfosGpJSON() {
  let response = await fetch("http://localhost:3000/infosGpJSON");
  response = await response.json();
  return response["Circuits"];
}

//! window.localStorage

let tabGlobalDataGpAPI;
let tabGlobalDataGpJSON;
let tabGlobalDataGP = [];

tabGlobalDataGpAPI = await recupererInfosGpAPI();
tabGlobalDataGpJSON = await recupererInfosGpJSON();

// 0: Melbourne
// 1: Austin
// 2: Bahrain
// 3: Baku
// 4: Barcelone
// 5: Hungaroring
// 6: Imola
// 7: Bresil
// 8: Jeddah
// 9: Singapour
// 10: Miami
// 11: Monaco
// 12: Monza
// 13: Red Bull Ring
// 14: Castellet
// 15: Mexique
// 16: Silverstone
// 17: Spa Francorchamps
// 18: Suzuka
// 19: Canada
// 20: Abu Dhabi
// 21: Zandvoort

//Fusionner les deux fichiers JSON
for (let i = 0; i < tabGlobalDataGpAPI.length; i++) {
  tabGlobalDataGP[i] = Object.assign(
    {},
    tabGlobalDataGpAPI[i],
    tabGlobalDataGpJSON[i]
  );
}
console.log(tabGlobalDataGP);

//---------------------------------GESTION DE LA MAP--------------------------------------

function afficherMapGP() {
  //Création des div nécessaires
  const sectionStats = document.querySelector("#stats");
  const divMapEtInfosGP = document.createElement("div");
  divMapEtInfosGP.id = "map-et-infos-gp";
  sectionStats.appendChild(divMapEtInfosGP);
  const divMapGP = document.createElement("div");
  divMapEtInfosGP.appendChild(divMapGP);
  divMapGP.id = "mapGP";
  //Création de la map
  var mapGP = L.map("mapGP", {
    center: [48.866667, 2.333333],
    zoom: 1.5,
  });
  const layerPrincipale = L.tileLayer(
    "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 8,
      minZoom: 1.5,

      attribution:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
    }
  );
  layerPrincipale.addTo(mapGP);
  //Création des limites de la map
  var sudOuest = L.latLng(-90, -180),
    nordEst = L.latLng(90, 180),
    limiteMap = L.latLngBounds(sudOuest, nordEst);
  mapGP.setMaxBounds(limiteMap);
  mapGP.on("drag", function () {
    mapGP.panInsideBounds(limiteMap, { animate: false });
  });

  const markerGP = L.icon({
    iconUrl: "data/markerPneu.png",
    iconSize: [30, 30],
  });

  //Création des markers

  for (let i = 0; i < tabGlobalDataGP.length; i++) {
    L.marker(
      [tabGlobalDataGP[i].Location.lat, tabGlobalDataGP[i].Location.long],
      {
        icon: markerGP,
      }
    )
      .addTo(mapGP)
      .on("click", function () {
        mapGP.flyTo(
          [tabGlobalDataGP[i].Location.lat, tabGlobalDataGP[i].Location.long],
          mapGP.getMaxZoom()
        );
        const existeDivInfosGP = document.querySelector("#divInfosGP");
        if (existeDivInfosGP) {
          existeDivInfosGP.remove();
        }
        const divInfosGP = document.createElement("div");
        divInfosGP.id = "divInfosGP";
        divMapEtInfosGP.appendChild(divInfosGP);
        const titreGP = document.createElement("h2");
        divInfosGP.appendChild(titreGP);
        titreGP.textContent = tabGlobalDataGP[i].circuitName;
        const imgGP = document.createElement("img");
        const imgBG = document.createElement("img");
        divInfosGP.appendChild(imgGP);
        imgGP.src = tabGlobalDataGP[i].Image;
      });
  }
}

//-------------------------------Gestion du click sur le bouton de la carte des grands-prix--------------------------------------------------

const boutonDecouvrirStatsGrandsPrix = document.querySelector(
  ".btn-decouvrir-stats-grands-prix"
);
boutonDecouvrirStatsGrandsPrix.addEventListener("click", function () {
  document.querySelector("#stats").innerHTML = "";
  afficherMapGP();
});
