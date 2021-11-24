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

// kallar á getData() til að sækja gögn
export const dataFromJson = await getData();
//export const dataItems = data.items;

export function setStorage(){
    localStorage.setItem('jsonData',JSON.stringify(dataFromJson));


}

// ef localStorage er tómt, þá bætum við data frá data.json 
if(localStorage.length < 1){
    setStorage();
}


export const data = JSON.parse(localStorage.getItem('jsonData'));
export const dataItems = data.items;


/**
 * Uppfærir localStorage með nýju data, þarf alltaf að kalla í þetta fall eftir að það er búið
 * að gera breytingu á taski.
 * 
 * @param {*} newData, Allt data. þarf að innihalda öll items og öll categories
 */
export function updateLocalStorage(newData){
    localStorage.setItem('jsonData',JSON.stringify(newData));
}