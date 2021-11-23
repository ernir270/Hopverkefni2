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
export const data = await getData();
export const dataItems = data.items;

//console.log(JSON.stringify(data));
/*
localStorage.setItem('jsonData',JSON.stringify(data));          // Fatta ekki hvernig á að geyma gögnin í localStorage
console.log("localstorage: ");
console.log(localStorage.getItem('jsonData'));
*/