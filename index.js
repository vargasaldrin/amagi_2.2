let page = 1;

// When beerBtn is clicked, get the values passed by user and pass it to a function composition
beerBtn.addEventListener("click", () => {

  // resetBtn is enabled
  resetBtn.disabled = false;

  // user-chosen values and page numer are passed as arguments
  appendBeers(getData(setURL(alchohol.value, hops.value, page)))
})

// When resetBtn is clicked, all beer data is removed from page
resetBtn.addEventListener("click", () => {
  // resetBtn is disabled
  resetBtn.disabled = true;

  // beerBtn is enabled
  beerBtn.disabled = false;

  // page reset
  page = 1;
  pageNum.innerHTML = `Page: ${page}`;
  beers.innerHTML = "";
})

// Sets the URL to be used for fetching the data
setURL = (abvValue, ibuValue, page) => {
  const urlBase = "https://api.punkapi.com/v2/beers?page=";
  let optionsABV = "";
  let optionsIBU = "";

  beerBtn.disabled = true

  // choose query string needed for finalURL, depending on abvValue
  switch (abvValue) {
    case "all":
      optionsABV = "";
      break;
    case "weak":
      optionsABV = "&abv_lt=4.6";
      break;
    case "medium":
      optionsABV = "&abv_gt=4.5&abv_lt=7.6";
      break;
    case "strong":
      optionsABV = "&abv_gt=7.5";
      break;
  }

   // choose query string needed for finalURL, depending on ibuValue
  switch (ibuValue) {
    case "all":
      optionsIBU = "";
      break;
    case "weak":
      optionsIBU = "&ibu_lt=35";
      break;
    case "medium":
      optionsIBU = "&ibu_gt=34&ibu_lt=75";
      break;
    case "strong":
      optionsIBU = "&ibu_gt=74";
      break;
  }

  const finalURL = urlBase + page + optionsABV + optionsIBU
  return finalURL
}

// returns the data needed using the provided URL
getData =  async (url) => {
  const beersData = await fetch(url)
    .then(response => response.json())
    .catch(err => console.error(err))

    // disables pagination buttons, depending on page number and data length returned by beersData
    if (page === 1) {
      prevPage.disabled = true;
    } else {
      prevPage.disabled = false;
    }
    if (beersData.length < 25) {
      nextPage.disabled = true;
    } else {
      nextPage.disabled = false;
    }
  
  return beersData
}

// Creates beer cards and append it to the DOM
appendBeers = async (beersData) => {
  const list = await beersData;
  let beerHtml = "";
  // iterate through each beer in the beerData, creating a beer card for each
  list.forEach((data) =>
    beerHtml += `
      <div class='beer_card'>
        <img class="beer_img" src="${data.image_url}">
        <div class="beer_info">
          <div class="beer_name">${data.name}</div>
          <div class='beer_tagline'>${data.tagline}</div>
          <div class='beer_description'>${data.description}</div>
          <div class='beer_pairing'>Pair with: ${data.food_pairing.join(", ")}</div>
        </div>
      </div>
      `
  );
  beers.innerHTML = beerHtml
}


/* Add event listeners to the pagination buttons */
prevPage.addEventListener("click", () => {
  page -= 1;
  pageNum.innerHTML = `Page: ${page}`;
  appendBeers(getData(setURL(alchohol.value, hops.value, page)))
});

nextPage.addEventListener("click", () => {
  page += 1;
  pageNum.innerHTML = `Page: ${page}`;
  appendBeers(getData(setURL(alchohol.value, hops.value, page)))
});