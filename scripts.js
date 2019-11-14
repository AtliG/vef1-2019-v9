const API_URL = 'https://apis.is/company?name=';

/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */
const program = (() => {
  let companies;

  function displayError(error) {
    const container = companies.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(document.createTextNode(error));
  }

  function displayCompanies(companyList) {
    if (companyList.length === 0) {
      displayError('Ekkert fyrirtæki fannst fyrir leitarstreng.');
      return;
    }

    const container = companies.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    companyList.forEach((obj) => {
      const companyElement = document.createElement('div');
      companyElement.classList.add('company');
      const listElement = document.createElement('dl');
      const nameT = document.createElement('dt');
      const nameD = document.createElement('dd');
      const snT = document.createElement('dt');
      const snD = document.createElement('dd');

      nameT.innerHTML = 'Nafn:';
      nameD.innerHTML = obj.name;
      snT.innerHTML = 'Kennitala:';
      snD.innerHTML = obj.sn;

      listElement.appendChild(nameT);
      listElement.appendChild(nameD);
      listElement.appendChild(snT);
      listElement.appendChild(snD);
      if (obj.active === 1) {
        companyElement.classList.add('company--active');
        const addressT = document.createElement('dt');
        addressT.innerHTML = 'Heimilisfang:';
        const addressD = document.createElement('dd');
        addressD.innerHTML = obj.address;
        listElement.appendChild(addressT);
        listElement.appendChild(addressD);
      } else {
        companyElement.classList.add('company--inactive');
      }
      companyElement.appendChild(listElement);
      container.appendChild(companyElement);
    });
  }

  function loadResults() {
    const container = companies.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const loadElement = document.createElement('div');
    loadElement.classList.add('loading');
    const loadImg = document.createElement('img');
    loadImg.src = 'loading.gif';
    const loadText = document.createElement('p');
    loadText.innerHTML = 'Leita að fyrirtækjum...';

    loadElement.appendChild(loadImg);
    loadElement.appendChild(loadText);

    container.appendChild(loadElement);
  }

  function fetchData(company) {
    const searchString = API_URL + company;
    fetch(searchString)
      .then((result) => {
        if (result.ok) {
          return result.json();
        }
        throw new Error('Villa!');
      })
      .then((data) => {
        displayCompanies(data.results);
      })
      .catch(() => {
        displayError('Villa við að sækja gögn.');
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    loadResults();
    const companySearch = e.target.querySelector('input');
    if (companySearch.value.length > 0
      && !companySearch.value.replace(/\s/g, '').length !== 0) {
      fetchData(companySearch.value);
    } else {
      displayError('Lén verður að vera strengur.');
    }
  }

  function init(_companies) {
    companies = _companies;
    const form = companies.querySelector('form');

    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('section');
  program.init(companies);
});
