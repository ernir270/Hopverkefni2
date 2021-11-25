import { currentTasks, taskSelect } from '../main.js';
import { getTags, refreshTaskCounters } from './gets.js';
import { createTask, showEditTask } from './editTask.js';
import { data, updateLocalStorage } from './data.js';

/**
 * raðar (data) eftir (sortBy)
 * 
 * @param {dagsetning} sortBy strengur sem segir til um hvernig gögnin verða röðuð
 * @param {*} sortData Gögn
 */
 export function sortTasks(sortBy, sortData){
    if(sortBy === 'dagsetning' || sortBy === 'forgangi'){ // raða eftir dagsetningu
        sortData.sort(function(a,b){
            if(a.due !== null){
                if(b.due === null){ return -1 }
                if(a.due < b.due){ return -1; }
                if(a.due > b.due){ return  1; }
            }
            return 0;
          });
    }
    else if(sortBy === 'titli'){ // raða eftir titli, í stafrófsröð
        sortData.sort(function(a, b){
            const icelandicLetters = {'á':'a','ð':'d','é':'e','í':'i','ó':'o',
                                    'ú':'u','ý':'y','þ':'th','æ':'ae','ö':'o'};
            // breytum íslenskum stöfum í enska svo hægt er að raða í stafrófsröð
            const compareA = a.title.toLowerCase()
                                .replace(/[áðéíóúýþæö]/g, m => icelandicLetters[m]);
            const compareB = b.title.toLowerCase()
                                .replace(/[áðéíóúýþæö]/g, m => icelandicLetters[m]);;

            if(compareA < compareB) { return -1; }
            if(compareA > compareB) { return 1; }
            return 0;
        })
    }
    if(sortBy === 'forgangi'){ // raða fyrst eftir forgangi, svo eftir dagsetningu
        sortData.sort(function(a,b){
            if(a.priority && !b.priority){ return -1; }
            if(!a.priority && b.priority){ return 1; }
            return 0;
        })
    }
}

function completeTask(completedTask){

    completedTask.completed = true;
    refreshTaskCounters();

    getTags();

    taskSelect(currentTasks[0], currentTasks[1]) // refreshar listann

    updateLocalStorage(data);

}


/**
 * Fjarlægir öll element sem eru með class='task' og 
 * svo birtir öll task sem eru í inntakinu (data).
 * 
 * @param {*} taskData, gögn
 */
export function showTasks(taskData){

    // finna .right-container elementið
    const container = document.querySelector('.right-container');


    // deleta öllum .task elementum og .edit-task elementi
    const tasks = document.querySelectorAll('.task');
    const editTask = document.querySelectorAll('.edit-task');
    if(editTask.length > 0){
        editTask[0].parentNode.removeChild(editTask[0]);
    }
    // fjarlægjum 'Bæta við verkefni' takkann, ef hann er til.
    const addTaskOption = document.querySelector('.add-task');
    if(addTaskOption !== null){
        addTaskOption.parentElement.removeChild(addTaskOption);
    }


    for(let i = 0; i < tasks.length; i++){
        tasks[i].parentNode.removeChild(tasks[i]);
    }

    const dropdownValue = document.querySelector('#sort-by').value;
    
    sortTasks(dropdownValue, taskData); // raða listanum


    for(let i = 0; i < taskData.length; i++){
        const section = document.createElement('section');  // búa til <section>
        section.classList.add('task');                    // bæta við class='task'
    
        const flexItem1 = document.createElement('div');
        flexItem1.classList.add('flex-items');
    
        section.appendChild(flexItem1); // láta flexItem1 vera child af section
    
        const input = document.createElement('input'); // búa til <input>
        input.type = 'radio';
        input.name = 'title';
        input.value = false;
        input.classList.add('radio-btn')
        let inputClicked = false;

        // ef klikkað er á input
        input.addEventListener('click',function(){
            completeTask(taskData[i]);
            inputClicked = true;
        });
    
        const taskTitle = document.createElement('p'); // búa til <p>
        taskTitle.innerText = taskData[i].title; // textinn á <p>

    
        // láta input og taskTitle vera 'börn' af flexItem1
        flexItem1.appendChild(input);
        flexItem1.appendChild(taskTitle);
    
        // description
        const description = document.createElement('p');
        description.classList.add('grey');
        description.innerText = taskData[i].description;
        section.appendChild(description);
    
        const flexItem2 = document.createElement('div');
        flexItem2.classList.add('flex-items');
    
        // dagsetning
        if(taskData[i].due !== null){ // ef dagsetning er ekki null
            const time = new Date(taskData[i].due);

            // replacea til að fá íslenskt útlit af dagsetningunni
            const timeStr = String(time).replace('o','ó').replace('Dec','Des')
                            .replace(' 0',' ').replace('Oct','okt').replace('May','Maí')
                            .replace('Ju','jú').replace('Aug','Ágúst').toLowerCase();

            const timeArr = timeStr.split(' ');
            const date = document.createElement('p');
            date.classList.add('grey');
            date.innerText = `${timeArr[2]}. ${timeArr[1]}`;
            flexItem2.appendChild(date);
        }
    
        // búa til tags
        for(let j = 0; j < taskData[i].tags.length; j++){
            const tag = document.createElement('div');
            tag.classList.add('tag');
            tag.innerText = taskData[i].tags[j];
            flexItem2.appendChild(tag);
        }
    
        const category = document.createElement('p');
        category.classList.add('category-text');
        category.innerText = taskData[i].category;
        flexItem2.appendChild(category);
    
        section.appendChild(flexItem2);

        // ef klikkað er á taskið
        section.addEventListener('click', function(){ 
            if(!inputClicked){
                showEditTask(taskData,i);
            }
        });
    
        container.appendChild(section);
    
    }

    // Bætum svo valmöguleika til að bæta við verkefni

    const section = document.createElement('section');  // búa til <section>
    section.classList.add('add-task');                    // bæta við class='add-task'

    const flexItem = document.createElement('div');
    flexItem.classList.add('flex-items');

    section.appendChild(flexItem); // láta flexItem vera child af section

    const input = document.createElement('input'); // búa til <input>
    input.type = 'radio';
    input.name = 'title';
    input.value = false;
    input.classList.add('radio-btn')

    // ef klikkað er á 'Bæta við verkefni' textann
    section.addEventListener('click', () => createTask(taskData));

    const addText = document.createElement('p'); // búa til <p>
    addText.innerText = 'Bæta við verkefni'; // textinn á <p>


    // láta input og taskTitle vera 'börn' af flexItem
    flexItem.appendChild(input);
    flexItem.appendChild(addText);

    container.appendChild(section);
}

