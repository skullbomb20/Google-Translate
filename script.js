const forText = document.querySelector('.from-text');
const toText = document.querySelector('.to-text');
const exchangeIcon = document.querySelector('.exchange');
const selectTg = document.querySelectorAll('select');
const icons = document.querySelectorAll('.row i');
const translateButton = document.querySelector('button');


function selectOptions(){
  selectTg.forEach((selectTag, id) => {
    for (let countryCode in countries) {
      const selected = (id === 0 && countryCode === "en-GB") || (id === 1 && countryCode === "de-DE") ? "selected" : "";
      const option = `<option ${selected} value="${countryCode}">${countries[countryCode]}</option>`;
      selectTag.insertAdjacentHTML("beforeend", option);
    }
  });
}

function exchangeValues(){
  let tempText = forText.value;
  let tempLang = selectTg[0].value;
  forText.value = toText.value;
  toText.value = tempText;
  selectTg[0].value = selectTg[1].value;
  selectTg[1].value = tempLang;
}

function clearToText() {
  if (!forText.value){
    toText.value = ""
  }
}


function textTranslation(){
  const text = forText.value.trim();
  const translateFrom = selectTg[0].value;
  const translateTo = selectTg[1].value;
  if (!text) return;
  toText.setAttribute("placeholder", "Translating...");
  const apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  fetch(apiUrl)
  .then((res) => res.json())
  .then((data) => {
    const translatedText = data.responseData.translatedText;
    data.matches.forEach((match) =>{
      if (match.id === 0){
        toText.value = match.translation;
      }
    });
    toText.value = translatedText;
    toText.setAttribute("placeholder", "Translation");
  });
}


function handleIconClick(target){
  if (!forText.value || !toText.value) return;
  if (target.classList.contains("fa-copy")){
    if (target.id === "from") {
      navigator.clipboard.writeText(forText.value);
    } else{
      navigator.clipboard.writeText(toText.value);
    }
  } else{
    let utterance;
    if(target.id === "from") {
      utterance = new SpeechSynthesisUtterance(forText.value);
      utterance.lang = selectTg[0].value;
    } else {
      utterance = new SpeechSynthesisUtterance(toText.value);
      utterance.lang = selectTg[1].value;
    }
    speechSynthesis.speak(utterance)
  }
}

selectOptions()

exchangeIcon.addEventListener("click", exchangeValues);

forText.addEventListener("keyup", clearToText);

translateButton.addEventListener("click", textTranslation);

icons.forEach((icon) => {
  icon.addEventListener("click", (event) => {
    const target = event.target;
    handleIconClick(target);
  });
});
