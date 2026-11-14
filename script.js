
// 1. Les codes météo
const WEATHER_CODES = {
    0:  { label: "Ciel dégagé", icon: "☀️" },
    1:  { label: "Plutôt dégagé", icon: "🌤️" },
    2:  { label: "Partiellement nuageux", icon: "⛅" },
    3:  { label: "Couvert", icon: "☁️" },
    45: { label: "Brouillard", icon: "🌫️" },
    48: { label: "Brouillard givrant", icon: "🌫️" },
    51: { label: "Bruine légère", icon: "🌦️" },
    53: { label: "Bruine", icon: "🌦️" },
    55: { label: "Bruine forte", icon: "🌦️" },
    56: { label: "Bruine verglaçante", icon: "🌧️" },
    57: { label: "Bruine verglaçante", icon: "🌧️" },
    61: { label: "Pluie légère", icon: "🌧️" },
    63: { label: "Pluie", icon: "🌧️" },
    65: { label: "Pluie forte", icon: "🌧️" },
    66: { label: "Pluie verglaçante", icon: "🌧️" },
    67: { label: "Pluie verglaçante", icon: "🌧️" },
    71: { label: "Neige légère", icon: "🌨️" },
    73: { label: "Neige", icon: "🌨️" },
    75: { label: "Neige forte", icon: "❄️" },
    77: { label: "Grains de neige", icon: "🌨️" },
    80: { label: "Averses légères", icon: "🌦️" },
    81: { label: "Averses", icon: "🌧️" },
    82: { label: "Averses violentes", icon: "⛈️" },
    85: { label: "Averses de neige", icon: "🌨️" },
    86: { label: "Fortes averses de neige", icon: "❄️" },
    95: { label: "Orage", icon: "⛈️" },
    96: { label: "Orage avec grêle", icon: "⛈️" },
    99: { label: "Orage avec forte grêle", icon: "⛈️" }
};


// 2. Récupérer les éléments HTML

const url = "https://geocoding-api.open-meteo.com/v1/search?name=";

const forme = document.getElementById("form");
const city = document.getElementById("city");
const button = document.getElementById("btn");
const messagerror = document.getElementById("mesgerror");
const loading = document.getElementById("loading");
const retryBtn = document.getElementById("retryBtn");      //button ressayer
const weatherCard = document.getElementById("weatherCard");
const forecastContainer = document.getElementById("forecastContainer");
const forecastSection = document.getElementById("forecastSection");
// Comparer les noms sans tenir compte des accents et majuscules
function normaliser(texte) {
    return texte
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}


// Fonction pour récupérer la météo

async function getUserData(cityName) {

    try {

        // Première API : rechercher les coordonnées de la ville

        const response = await fetch(
            `${url}${encodeURIComponent(cityName)}&count=1&language=fr&format=json`
        );
        
        if (response.status === 429) {
    throw new Error("Limite de requêtes atteinte");
            } 
        
        if (response.status === 500 || response.status === 503) {
    throw new Error("Service de géolocalisation indisponible");
            }    

        if (!response.ok) {
            throw new Error("Erreur lors de la recherche de la ville");
        }

        const data = await response.json();

        console.log("Données de la ville :", data);

        // Vérifier si la ville existe

        if (!data.results || data.results.length === 0) {
            throw new Error("Ville introuvable");
        }

        // Récupérer les informations de la ville

        const cityData = data.results[0];

        // Vérifier si le nom saisi correspond au nom complet de la ville
        if (normaliser(cityData.name) !== normaliser(cityName)) {
            throw new Error("Veuillez saisir le nom complet de la ville");
        }

        const latitude = cityData.latitude;
        const longitude = cityData.longitude;
        const cityNameResult = cityData.name;

        console.log("Latitude :", latitude);
        console.log("Longitude :", longitude);


        // 4. Deuxième API : récupérer la météo

        const url2 = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5`;

        const weatherResponse = await fetch(url2);
        
        if (weatherResponse.status === 429) {
    throw new Error("Limite de requêtes atteinte");
}
        if (weatherResponse.status === 500 || weatherResponse.status === 503) {
    throw new Error("Service météo indisponible");
}  

        if (!weatherResponse.ok) {
            throw new Error("Erreur lors de la récupération de la météo");
        }
 

        // Transformer Response en JSON

        const weatherData = await weatherResponse.json();

         console.log("Données météo :", weatherData);

    //     console.log("Dates :", weatherData.daily.time);
    //    console.log("Codes météo :", weatherData.daily.weather_code);
    //    console.log("Températures max :", weatherData.daily.temperature_2m_max);
    //    console.log("Températures min :", weatherData.daily.temperature_2m_min);
    
    // récupérer les provisions des 5 jours
    const daily=weatherData.daily;

    const previsions =daily.time.map((date,index)=>{

        return{
            date:date,
            code:daily.weather_code[index],
            temperatureMax:daily.temperature_2m_max[index],
            temperatureMin:daily.temperature_2m_min[index]
        };
    });
    console.log(previsions)

    const previsionsHTML = previsions.map((jour) => {


    // Récupérer l'icône et la description météo
    const meteo = WEATHER_CODES[jour.code];
   // date sous la forme (expl: mardi 10 novembre)
    const dateFormatee = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long"
   }).format(new Date(jour.date + "T00:00:00"));

      
    // Vérifier les températures disponibles
    const temperatureMin = jour.temperatureMin ?? "Donnée indisponible";
    const temperatureMax = jour.temperatureMax ?? "Donnée indisponible";
     
   //console.log("Température minimale :", temperatureMin);
   //console.log("Température maximale :", temperatureMax);
    return `
        <div class="bg-blue-50 border border-blue-100 rounded-2xl p-4 shadow-sm flex justify-between items-center">

            <div>
                <p class="font-bold text-gray-800">
                   ${dateFormatee}
                </p>

                <p class="text-4xl my-3">
                ${meteo.icon}
                </p>

                <p class="font-semibold text-gray-700">
                ${meteo.label}
                </p>


                <div class="grid grid-cols-2 gap-4 mt-4">

             <!-- Température minimale -->
      <div>
        <p class="text-sm text-gray-500">
            Température minimale
        </p>
        <p class="text-lg font-bold text-blue-700">
            ${temperatureMin} 
        </p>
       </div>

             <!-- Température maximale -->
       <div class="text-right">
        <p class="text-sm text-gray-500">
            Température maximale
        </p>
        <p class="text-lg font-bold text-blue-900">
           ${temperatureMax}
        </p>
         </div>

         </div>
            </div>

        </div>
    `;
});
    // Regrouper toutes les cartes HTML dans une seule chaîne de caractères
    const htmlFinal=previsionsHTML.join("")
    // Afficher les cartes météo sur la page
    forecastContainer.innerHTML=htmlFinal;
    forecastSection.classList.remove("hidden");
    
        //  Récupérer les données actuelles

        const current = weatherData.current;

        const temperature = current.temperature_2m;
        const humidity = current.relative_humidity_2m;
        const wind = current.wind_speed_10m;
        const code = current.weather_code;

        console.log("Température :", temperature);
        console.log("Humidité :", humidity);
        console.log("Vent :", wind);
        console.log("Code météo :", code);


        // 6. Récupérer la description et l'icône

        const weatherInfo = WEATHER_CODES[code] || {
            label: "Conditions inconnues",
            icon: "🌡️"
        };


        // 7. Afficher les informations avec innerHTML

        weatherCard.innerHTML = `

            <h2 class="cityDisplay text-2xl font-bold text-gray-800 mb-4">
                ${cityNameResult}
            </h2>

            <p class="weatherEmoji text-6xl mb-4">
                ${weatherInfo.icon}
            </p>

            <p class="tempDisplay text-5xl font-bold text-blue-700 mb-4">
                ${temperature} °C
            </p>

            <p class="descDisplay text-lg text-gray-600 capitalize mb-3">
                ${weatherInfo.label}
            </p>

            <p class="humidityDisplay text-gray-600 mb-4">
                Humidité : ${humidity} %
            </p>

            <p class="windDisplay text-gray-600 mb-4">
                Vent : ${wind} km/h
            </p>

        `;


    } catch (error) {

        // Afficher les erreurs dans la console

        console.error("Erreur :", error);

        // Afficher le message d'erreur dans HTML

        if (error instanceof TypeError) {
    messagerror.textContent = "Vérifiez votre connexion Internet";
} else {
    messagerror.textContent = error.message;
}
        messagerror.classList.remove("hidden");
        retryBtn.classList.remove("hidden");

    } finally {

        // Cacher le chargement

        loading.hidden = true;
        button.disabled = false;

    }
}



// 8. Écouter la soumission du formulaire

forme.addEventListener("submit", async (event) => {

    event.preventDefault();

    // Récupérer le nom de la ville

    const cityName = city.value.trim();

    // Vérifier si le champ est vide

    if (cityName === "") {

        messagerror.textContent = "Veuillez saisir une ville";
        messagerror.classList.remove("hidden");

        return;
    }

    

    // Vérifier si le nom contient au moins 3 caractères
    if (cityName.length < 3) {

        messagerror.textContent = "Veuillez saisir au moins 3 caractères";
        messagerror.classList.remove("hidden");

        return;
    }

    // Cacher le message d'erreur

    messagerror.classList.add("hidden");

    // Afficher le chargement

    loading.hidden = false;

    // Désactiver le bouton pendant le chargement

    button.disabled = true;

    // Appeler la fonction météo

    await getUserData(cityName);

});

retryBtn.addEventListener("click", async () => {
    const cityName = city.value.trim();

    messagerror.classList.add("hidden");
    retryBtn.classList.add("hidden");

    loading.hidden = false;
    button.disabled = true;

    await getUserData(cityName);
});
