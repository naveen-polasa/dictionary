const input = document.querySelector(".input");
const search = document.querySelector(".search");
const resultContainer = document.querySelector(".results");

const fetchResults = (word) => {
  resultContainer.innerHTML = `<div class="flex justify-center items-center gap-6 h-44">
                  <div class="h-12 w-12 border-4 rounded-full border-t-red-500 animate-spin"></div>
                  <h2 class="text-2xl font-semibold">Loading...</h2>
              </div>`;

  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  const http = new XMLHttpRequest();
  http.onreadystatechange = () => {
    if (http.readyState === 4 && http.status == 200) {
      renderResult(JSON.parse(http.responseText));
    }
    if (http.status == 404) {
      console.log(http);
      resultContainer.innerHTML = `<div class="h-52 flex justify-center items-center text-center">
          <h2 class=" text-3xl font-mono"> No Definitions Found... </h2>
        </div>`;
    }
  };
  http.open("GET", url);
  http.send();
  input.value = ''
};

function renderResult(res) {
  const { word, meanings } = res[0];

  const result = meanings
    .map((meaning) => {
      const { partOfSpeech, definitions } = meaning;
      const { definition, example } = definitions[0];
      return `<div>
  <h3 class='font-mono text-xl my-2 mx-1.5'>
  ${word} <span class='lowercase'> (${partOfSpeech}) </span>
  </h3>
  <h4>
      ${definition}
      </h4>
  </div>`;
    })
    .join(" ");

  resultContainer.innerHTML = `<div class="border-2 rounded-xl border-red-400 bg-red-50 flex flex-col w-[80%] sm:w-[33rem] mx-auto text-center flex-wrap justify-center gap-6 py-6 mt-4 p-2"> 
  <h3 class="font-mono text-2xl inline-block mx-auto border-b-2 pb-1 border-red-500 capitalize word">${word} <i class="fa-solid fa-volume-high fa-sm"></i> </h3> ${result} </div> `;

  document.querySelector(".word").addEventListener("click", () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(word);
    synth.speak(utter);
  });
}

search.addEventListener("click", (e) => {
  e.preventDefault();
  if (!input.value) return;
  fetchResults(input.value);
});
