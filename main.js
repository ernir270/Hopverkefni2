import { showTasks } from './lib/tasks.js';

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
const data = await getData();
const dataItems = data.items;

/**
 * Birtir öll tög-in sem eru til.
 */
function getTags(){

    const tagArr = []; // tómt array sem við munum bæta tags og tag teljara í. (verður tvívítt fylki)
    let containsIt;

    // bætir öllum tags sem eru til í tagArr
    for(let i = 0; i < dataItems.length; i++){
        for(let j = 0; j < dataItems[i].tags.length; j++){
            containsIt = false; // reset í false
            
            // finnur hvort tag er núþegar í listanum 
            for(let g = 0; g < tagArr.length; g++){
                // ef tagArr[g] er með dataItems[i].tags[j] í listanum 
                if(tagArr[g].includes(dataItems[i].tags[j])){
                    containsIt = true;
                    tagArr[g][1]++; // bætir 1 við teljarann sem telur hversu mörg task eru með þetta tag
                    break;
                }
            }

            // ef tag er ekki í listanum
            if(!containsIt){
                tagArr.push([dataItems[i].tags[j],1]); // bæta tag-i við í listann
            }
        }
    }

    
    const tagCont = document.querySelector('.tag-container');
    for(let i = 0; i < tagArr.length; i++){ // búum til element og birtum tag-in

        let liCont = document.createElement('div'); // búa til div
        liCont.classList.add('li-container') // bæta við class="li-container"

        // búum til <li>
        let li = document.createElement('li');
        li.innerText = tagArr[i][0]; // textinn
        li.classList.add(`${tagArr[i][0]}-tag`);
        liCont.appendChild(li); // höfum li sem 'barn' af liCont

        // búum til p 
        let num = document.createElement('p');
        num.innerText = tagArr[i][1];
        num.classList.add('grey');
        num.classList.add('right-num');
        liCont.appendChild(num);

        tagCont.appendChild(liCont);

        // ef klikkað er á '.${tagArr[i]}-tag'
        document.querySelector(`.${tagArr[i][0]}-tag`)
            .addEventListener('click', () => taskSelect(`${tagArr[i][0]}`,'tag'));
    }

}

/**
 *  Birtir alla flokka sem eru til.
 */
function getCategories(){

    const category = data.categories;
    const categoryArray = []; // tvívítt fylki [flokkur][hversu mörg task eru með flokkinn]

    let categoryCount;
    // bætum við öllum flokkum í categoryArray og líka hversu mörg task eru af þeim flokki
    for(let i = 0; i < category.length; i++){
        categoryCount = 0;

        // teljum hversu mörg task eru í flokki category[i].title.toLowerCase()
        for(let j = 0; j < dataItems.length; j++){
            if(category[i].title.toLowerCase() === dataItems[j].category){
                if(!dataItems[j].deleted && !dataItems[j].completed){
                    categoryCount++;
                }
            }
        }

        categoryArray.push([category[i].title.toLowerCase(), categoryCount]);
    }

    const categoryContainer = document.querySelector('.category-container');
    for(let i = 0; i < categoryArray.length; i++){

        let liCont = document.createElement('div'); // búa til div
        liCont.classList.add('li-container') // bæta við class="li-container"

        let li = document.createElement('li');
        let categoryTitle = categoryArray[i][0];
        li.innerText = categoryTitle;
        li.classList.add(`${categoryTitle}-flokkar`);
        liCont.appendChild(li); // höfum li sem 'barn' af liCont

        // búum til p 
        let num = document.createElement('p');
        num.innerText = categoryArray[i][1];
        num.classList.add('grey');
        num.classList.add('right-num');
        liCont.appendChild(num);

        categoryContainer.appendChild(liCont);

        // ef klikkað er á '.${categoryTitle}-flokkar'
        document.querySelector(`.${categoryTitle}-flokkar`)
            .addEventListener('click', () => taskSelect(`${categoryTitle}`,'category'));
    }
}
/**
 * Birtir hversu mörg Verkefni og Kláruð verkefni eru til (sem eru ekki deleted).
 */
function showTaskCount(){

    let taskCount = 0;
    let finishedTaskCount = 0;

    for(let i = 0; i < dataItems.length; i++){
        // ef task er ekki deletað né klárað
        if(!dataItems[i].deleted && !dataItems[i].completed){
            taskCount++;
        }
        // ef task er klárað og task er ekki deletað
        if(dataItems[i].completed && !dataItems[i].deleted){
            finishedTaskCount++;
        }
    }

    const parent = document.querySelector('.taskbuttons-container');
    const liCont = parent.querySelectorAll('.li-container');


    // búum til p fyrir Verkefni
    let num = document.createElement('p');
    num.innerText = taskCount;
    num.classList.add('grey');
    num.classList.add('right-num');
    liCont[0].appendChild(num);

    // búum til p fyrir Kláruð verkefni
    num = document.createElement('p');
    num.innerText = finishedTaskCount;
    num.classList.add('grey');
    num.classList.add('right-num');
    liCont[1].appendChild(num);    
}

/**
 * Main fallið.
 */
async function main(){

    getCategories();
    getTags();
    showTaskCount();

    // kallar í taskSelect sem mun svo kalla í annað fall sem birtir öll task (nema completed eða deleted task).
    taskSelect('',''); 
}

/**
 * Finnur öll task sem hafa (taskType) í (findIn).
 * Setur þau task í lista og svo kallar á fall sem mun birta þau. (birtir ekki completed né deleted tasks)
 * 
 * @param {String} taskType 
 * @param {'category','tag','finished',''} findIn Hvort viltu leita af taskType í category eða tags, eða birta þau task sem eru kláruð.
 *                              Ef '' þá birtir það öll task (nema completed eða deleted task).
 */
async function taskSelect(taskType, findIn){

    const taskArr = [];

    if(findIn === 'category'){ // leitar í category
        for(let i = 0; i < dataItems.length; i++){
            // ef task er ekki klárað og task er ekki deletað
            if(!dataItems[i].completed && !dataItems[i].deleted){
                if(dataItems[i].category === taskType){

                    taskArr.push(dataItems[i]);
                }
            }
        }
    }
    else if(findIn === 'tag'){
        for(let i = 0; i < dataItems.length; i++){
            // ef task er ekki klárað og task er ekki deletað
            if(!dataItems[i].completed && !dataItems[i].deleted){
                if(dataItems[i].tags.includes(taskType)){

                    taskArr.push(dataItems[i]);
                }
            }
        }
    }
    else if(findIn === 'finished'){
        for(let i = 0; i < dataItems.length; i++){
            // ef task er klárað og task er ekki deletað
            if(dataItems[i].completed && !dataItems[i].deleted){

                taskArr.push(dataItems[i]);
            }
        }
    }
    else if(findIn === ''){ // birta öll task
        for(let i = 0; i < dataItems.length; i++){
            // ef task er ekki klárað og task er ekki deletað
            if(!dataItems[i].completed && !dataItems[i].deleted){

                taskArr.push(dataItems[i]);
            }
        }
    }

    showTasks(taskArr);
}

// ef klikkað er á '.verkefni'
document.querySelector('.verkefni')
    .addEventListener('click', () => taskSelect('',''));

// ef klikkað er á '.klarud-verkefni'
document.querySelector('.klarud-verkefni')
    .addEventListener('click', () => taskSelect('','finished'));




main();