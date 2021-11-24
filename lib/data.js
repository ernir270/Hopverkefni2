/**
 * Sækir gögn frá data.json
 * 
 * @returns skilar gögnum frá data.json
 */
 async function getData(){
    const res = await fetch('data.json');
    const resjson = res.json();
    return resjson;
}


try{

    // ef localStorage inniheldur ekki 'jsonData', þá bætum við data frá data.json 
    if(localStorage.getItem('jsonData') === null){
        const dataFromJson = await getData();

        localStorage.setItem('jsonData',JSON.stringify(dataFromJson));
    }

    // fjarlægir öll element með class="fetching-text"
    const fetchText = document.querySelectorAll('.fetching-text');
    for (let i = 0; i < fetchText.length; i++) {
        fetchText[i].remove();
    }
}
catch{
    const fetchText = document.querySelectorAll('.fetching-text');
    for (let i = 0; i < fetchText.length; i++) {
        fetchText[i].innerText = 'Villa kom upp';
    }
}

export const data = await JSON.parse(localStorage.getItem('jsonData'));
export const dataItems = await data.items;

/**
 * Uppfærir localStorage með nýju data, þarf alltaf að kalla í þetta fall eftir að það er búið
 * að gera breytingu á taski.
 * 
 * @param {*} newData, Allt data. þarf að innihalda öll items og öll categories
 */
export function updateLocalStorage(newData){
    localStorage.setItem('jsonData',JSON.stringify(newData));
}