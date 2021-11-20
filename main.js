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

const data = await getData();
const dataItems = data.items;


function getTags(){

    const tagArr = [];

    for(let i = 0; i < dataItems.length; i++){
        for(let j = 0; j < dataItems[i].tags.length; j++){
            // ef tag er ekki í listanum
            if(!tagArr.includes(dataItems[i].tags[j])){
                tagArr.push(dataItems[i].tags[j]);
            }
        }
    }

    const tagCont = document.querySelector('.tag-container');
    for(let i = 0; i < tagArr.length; i++){
        let li = document.createElement('li');
        li.innerText = tagArr[i];

        tagCont.appendChild(li);
    }

}


/**
 * Main fallið.
 */
async function main(){

    getTags();


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

// ef klikkað er á '.vefforrit-flokkar'
document.querySelector('.vefforrit-flokkar')
    .addEventListener('click', () => taskSelect('vefforrit','category'));

// ef klikkað er á '.skipulag-flokkar'
document.querySelector('.skipulag-flokkar')
    .addEventListener('click', () => taskSelect('skipulag','category'));

// ef klikkað er á '.vefthjonustur-flokkar'
document.querySelector('.vefthjonustur-flokkar')
    .addEventListener('click', () => taskSelect('vefþjónustur','category'));

// ef klikkað er á '.verkefni'
document.querySelector('.verkefni')
    .addEventListener('click', () => taskSelect('',''));

// ef klikkað er á '.klarud-verkefni'
document.querySelector('.klarud-verkefni')
    .addEventListener('click', () => taskSelect('','finished'));




main();