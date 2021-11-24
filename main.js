import { dataItems } from './lib/data.js';
import { showTasks } from './lib/tasks.js';
import { showTaskCount, getCategories, getTags } from './lib/gets.js';


// breyta sem heldur um hvaða tasks við erum að birta
export let currentTasks = ['',''];

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
export async function taskSelect(taskType, findIn){

    const taskArr = [];

    currentTasks = [taskType, findIn]; // höldum um havað task við erum að sjá.

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


let dropdown = document.querySelector('#sort-by');
// þegar það er breytt dropdown value
// kalla í taskSelect() sem mun svo kalla showTasks() sem mun svo kalla í fallið sem sortar listann.
dropdown.addEventListener('change', () => taskSelect(currentTasks[0], currentTasks[1]));





main();