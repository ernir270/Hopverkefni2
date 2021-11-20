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

/**
 * Fyrsta fallið sem er kallað í.
 */
async function main(){

    showTasks(data.items);
}

/**
 * Finnur öll task sem hafa (taskType) í (findIn).
 * Setur þau task í lista og svo kallar á fall sem mun birta þau.
 * 
 * @param {String} taskType 
 * @param {'category','tag'} findIn Hvort viltu leita af taskType í category eða tags
 */
async function taskSelect(taskType, findIn){

    const dataItems = data.items;
    const taskArr = [];

    if(findIn === 'category'){ // leitar í category
        for(let i = 0; i < dataItems.length; i++){
            if(dataItems[i].category === taskType){
                taskArr.push(dataItems[i]);
            }
        }
    }
    showTasks(taskArr);
}

// ef klikkað er á '.vefforrit-flokkar'
document.querySelector('.vefforrit-flokkar')
    .addEventListener('click', () => taskSelect('vefforrit','category'));


main();