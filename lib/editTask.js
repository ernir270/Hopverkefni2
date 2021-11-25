import { currentTasks, taskSelect } from '../main.js';
import { getCaregoryArray, refreshTaskCounters, getTags } from './gets.js';
import { showTasks, sortTasks } from './tasks.js';
import { data, dataItems, updateLocalStorage } from './data.js' 

function cancelEdit(data){
    data.push(removedData);

    let prevEdit = document.querySelectorAll('.edit-task');
    prevEdit[0].parentNode.removeChild(prevEdit[0]);

    taskSelect(currentTasks[0], currentTasks[1]);
}

function confirmEdit(dataToAdd){
 
    let index = dataItems.indexOf(removedData);
    dataItems.splice(index, 1);

    dataToAdd.tags = dataToAdd.tags.filter(e => e); // fjarlægir empty strings úr lista

    if(Number.isNaN(dataToAdd.due)){ dataToAdd.due = null; }

    dataItems.push(dataToAdd);
    let prevEdit = document.querySelectorAll('.edit-task');
    prevEdit[0].parentNode.removeChild(prevEdit[0]);

    taskSelect(currentTasks[0], currentTasks[1]);

    getTags(); // refreshar tag-in

    refreshTaskCounters();// refreshar tag, flokka og verkefni teljarana

    // raða listanum aftur
    const dropdownValue = document.querySelector('#sort-by').value;
    sortTasks(dropdownValue, dataItems);

    updateLocalStorage(data); //uppfæra localStorage
}

function deleteTask(){

    let index = dataItems.indexOf(removedData);
    dataItems.splice(index, 1);

    let prevEdit = document.querySelectorAll('.edit-task');
    prevEdit[0].parentNode.removeChild(prevEdit[0]);   // fjarlægjum element með class="edit-task"

    getTags();

    refreshTaskCounters()

    updateLocalStorage(data);
}

/**
 * Býr til task út frá gögnunum í dataToAdd;
 * @param {*} dataToAdd 
 */
function confirmCreateTask(dataToAdd){
 

    dataToAdd.tags = dataToAdd.tags.filter(e => e); // fjarlægir empty strings úr lista

    if(Number.isNaN(dataToAdd.due)){ dataToAdd.due = null; }

    dataItems.push(dataToAdd);
    let prevEdit = document.querySelectorAll('.edit-task');
    prevEdit[0].parentNode.removeChild(prevEdit[0]);

    taskSelect(currentTasks[0], currentTasks[1]);

    getTags(); // refreshar tag-in

    refreshTaskCounters();// refreshar tag, flokka og verkefni teljarana

    // raða listanum aftur
    const dropdownValue = document.querySelector('#sort-by').value;
    sortTasks(dropdownValue, dataItems);

    updateLocalStorage(data); //uppfæra localStorage
}


export function createTask(data){

    /*
    Ef við vorum með Breyta verkefni glugga opinn og við ýtum á
    Bæta við verkefni þá þurfum við að bæta fyrra verkefni aftur í data.
    */
    let prevEdit = document.querySelectorAll('.edit-task');
    if(prevEdit.length > 0){
        data.push(removedData);
        


        prevEdit[0].parentNode.removeChild(prevEdit[0]);   // fjarlægjum element með class="edit-task"
    }
    
    showTasks(data); // refresha tasks

    // fjarlægjum 'Bæta við verkefni' takkann.
    const addTaskOption = document.querySelector('.add-task');
    addTaskOption.parentElement.removeChild(addTaskOption);
    

    let editCont = document.createElement('fieldset'); // búa til fieldset
    editCont.classList.add('edit-task');

    let legend = document.createElement('legend');
    legend.innerText = 'Bæta við verkefni';

    let title = document.createTextNode('Titill:');

    let titleText = document.createElement('input');
    titleText.type = 'text';
    titleText.classList.add('edit-title');
    titleText.required = true;
    titleText.placeholder = 'Titill...';
    



    let desc = document.createTextNode('Lýsing:');

    let descText = document.createElement('textarea');
    descText.classList.add('edit-description');
    descText.rows = '2';
    descText.placeholder = 'Lýsing...';

    let dueDate = document.createTextNode('Hvenær á að klárast:');

    let dueDateText = document.createElement('input');
    dueDateText.type = 'date';
    dueDateText.classList.add('edit-due');

    let flexItems = document.createElement('div');
    flexItems.classList.add('flex-items');

    let priority = document.createTextNode('Er í forgangi:');

    let priorityBox = document.createElement('input');
    priorityBox.type = 'checkbox';
    priorityBox.classList.add('.edit-priority')

    flexItems.appendChild(priority, priorityBox);
    flexItems.appendChild(priorityBox);

    
    let category = document.createTextNode('Flokkur:');


    let dropDownCategory = document.createElement('select');
    dropDownCategory.classList.add('choose-category');

    let catOption = document.createElement('option');
    catOption.innerText = 'Enginn flokkur';
    catOption.value = '';

    dropDownCategory.appendChild(catOption);

    let catArr = getCaregoryArray();

    for(let i = 0; i < catArr.length; i++){
        catOption = document.createElement('option');
        catOption.innerText = catArr[i][0];
        catOption.value = catArr[i][0];

        dropDownCategory.appendChild(catOption);
    }
    
    let tags = document.createTextNode('Tags (aðgreinir með bili):');

    let tagText = document.createElement('input');
    tagText.type = 'text';
    tagText.classList.add('edit-tags');
    tagText.placeholder = 'Tags...'

    let btnFlex = document.createElement('div');
    btnFlex.classList.add('button-flex');

    let submit = document.createElement('input');
    submit.classList.add('confirm-edit');
    submit.type = 'submit';
    submit.value = 'Bæta við verkefni';

    submit.addEventListener('click', function(){  
        let addedId = dataItems.length + 2;

        if(titleText.value.length > 0){ // ef það er title
            confirmCreateTask({
                "id": addedId,
                "title": titleText.value,
                "description": descText.value,
                "category": dropDownCategory.value,
                "tags": tagText.value.split(' '),
                "priority": priorityBox.checked,
                "modified": null,
                "due": new Date(dueDateText.value).getTime(),
                "deleted": false,
                "completed": false
            });
        }else{ // annars þarf að segja notanda að það þarf að vera title
            titleText.placeholder = 'Það þarf að vera titill!';
            titleText.classList.add('require-title');
        }
    });

    let cancelBtn = document.createElement('button');
    cancelBtn.innerText = 'Hætta við';
    cancelBtn.classList.add('cancel-edit');
    cancelBtn.addEventListener('click', function(){
        let prevEdit = document.querySelectorAll('.edit-task');
        prevEdit[0].parentNode.removeChild(prevEdit[0]);
        showTasks(data);
    });


    btnFlex.appendChild(submit);
    btnFlex.appendChild(cancelBtn);

    let brk1 = document.createElement('br');
    let brk2 = document.createElement('br');
    let brk3 = document.createElement('br');


    editCont.appendChild(legend);
    editCont.appendChild(title);
    editCont.appendChild(titleText);
    editCont.appendChild(brk1);
    editCont.appendChild(desc);
    editCont.appendChild(descText);
    editCont.appendChild(dueDate);
    editCont.appendChild(dueDateText);
    editCont.appendChild(brk2);
    editCont.appendChild(flexItems);
    editCont.appendChild(category);
    editCont.appendChild(dropDownCategory);
    editCont.appendChild(brk3);
    editCont.appendChild(tags);
    editCont.appendChild(tagText);
    editCont.appendChild(btnFlex);

    const container = document.querySelector('.right-container');
    container.appendChild(editCont);

}


let removedData;

let prevEditIndex;


export function showEditTask(data, index){

    let taskDate = new Date(data[index].due);
    // búum til breytur sem fara inn í input-in
    let dataTitle = data[index].title;
    let dataDesc = data[index].description;
    let day = taskDate.getDate();
    if(day < 10){
        day = '0' + taskDate.getDate();
    }
    let month = (taskDate.getMonth() + 1)
    if(month < 10){
        month = '0' + month;
    }
    let dataDue = taskDate.getFullYear() + '-' + month + '-' + day;
    if(dataDue.split('-')[0] === '1970'){
        dataDue = null;
    }
    let dataPriority = data[index].priority;
    let dataCat = data[index].category;
    let dataTags = data[index].tags;

    /*
        Ef við vorum með Breyta verkefni glugga opinn og við ýtum á
        annað verkefni þá þurfum við að bæta fyrra verkefni aftur í data.
    */
    let prevEdit = document.querySelectorAll('.edit-task');
    if(prevEdit.length > 0){
        if(removedData !== undefined){
            if(!data.includes(removedData)){
                data.push(removedData);
            }
        }
        if(prevEdit[0].querySelector('legend').innerText === 'Bæta við verkefni'){
            prevEditIndex = undefined;
        }
        prevEdit[0].parentNode.removeChild(prevEdit[0]);   // fjarlægjum element með class="edit-task"
    }else{
        prevEditIndex = undefined;
    }
          

    removedData = data[index]; // geyma task í breytu
    data.splice(index,1); // fjarlægja task

    showTasks(data); // refresha tasks

    if(typeof prevEditIndex !== 'undefined'){
        if(prevEditIndex <= index){
            index++;
        }
    }

    let editCont = document.createElement('fieldset'); // búa til fieldset
    editCont.classList.add('edit-task');

    let legend = document.createElement('legend');
    legend.innerText = 'Breyta verkefni';

    let title = document.createTextNode('Titill:');

    let titleText = document.createElement('input');
    titleText.type = 'text';
    titleText.classList.add('edit-title');
    titleText.required = true;
    titleText.value = dataTitle;
    



    let desc = document.createTextNode('Lýsing:');

    let descText = document.createElement('textarea');
    descText.classList.add('edit-description');
    descText.rows = '2';
    descText.value = dataDesc;

    let dueDate = document.createTextNode('Hvenær á að klárast:');

    let dueDateText = document.createElement('input');
    dueDateText.type = 'date';
    dueDateText.value = dataDue;
    dueDateText.classList.add('edit-due');

    let flexItems = document.createElement('div');
    flexItems.classList.add('flex-items');

    let priority = document.createTextNode('Er í forgangi:');

    let priorityBox = document.createElement('input');
    priorityBox.type = 'checkbox';
    if(dataPriority === true){ priorityBox.checked = true };
    priorityBox.classList.add('.edit-priority')

    flexItems.appendChild(priority, priorityBox);
    flexItems.appendChild(priorityBox);

    
    let category = document.createTextNode('Flokkur:');


    let dropDownCategory = document.createElement('select');
    dropDownCategory.classList.add('choose-category');

    let catOption = document.createElement('option');
    catOption.innerText = 'Enginn flokkur';
    catOption.value = '';

    dropDownCategory.appendChild(catOption);

    let catArr = getCaregoryArray();

    for(let i = 0; i < catArr.length; i++){
        catOption = document.createElement('option');
        catOption.innerText = catArr[i][0];
        catOption.value = catArr[i][0];

        dropDownCategory.appendChild(catOption);
    }

    dropDownCategory.value = dataCat;
    
    let tags = document.createTextNode('Tags (aðgreinir með bili):');
    let tagStr = "";
    for(let i = 0; i < dataTags.length; i++){
        tagStr += dataTags[i] + " ";
    }

    let tagText = document.createElement('input');
    tagText.type = 'text';
    tagText.classList.add('edit-tags');
    tagText.value = tagStr;

    let btnFlex = document.createElement('div');
    btnFlex.classList.add('button-flex');

    let submit = document.createElement('input');
    submit.classList.add('confirm-edit');
    submit.type = 'submit';
    submit.value = 'Breyta verkefni';

    submit.addEventListener('click', function(){
        if(titleText.value.length > 0){ // ef það er title
            confirmEdit({
            "id": removedData.id,
            "title": titleText.value,
            "description": descText.value,
            "category": dropDownCategory.value,
            "tags": tagText.value.split(' '),
            "priority": priorityBox.checked,
            "modified": removedData.modified,
            "due": new Date(dueDateText.value).getTime(),
            "deleted": removedData.deleted,
            "completed": removedData.completed
            });
        }else{ // annars þarf að segja notanda að það þarf að vera title
            titleText.placeholder = 'Það þarf að vera titill!';
            titleText.classList.add('require-title');
        }
    });

    let cancelBtn = document.createElement('button');
    cancelBtn.innerText = 'Hætta við';
    cancelBtn.classList.add('cancel-edit');
    cancelBtn.addEventListener('click', () => cancelEdit(data));

    let deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Eyða verkefni';
    deleteBtn.classList.add('delete-task');
    deleteBtn.addEventListener('click', () => deleteTask());



    btnFlex.appendChild(submit);
    btnFlex.appendChild(cancelBtn);
    btnFlex.appendChild(deleteBtn);

    let brk1 = document.createElement('br');
    let brk2 = document.createElement('br');
    let brk3 = document.createElement('br');


    editCont.appendChild(legend);
    editCont.appendChild(title);
    editCont.appendChild(titleText);
    editCont.appendChild(brk1);
    editCont.appendChild(desc);
    editCont.appendChild(descText);
    editCont.appendChild(dueDate);
    editCont.appendChild(dueDateText);
    editCont.appendChild(brk2);
    editCont.appendChild(flexItems);
    editCont.appendChild(category);
    editCont.appendChild(dropDownCategory);
    editCont.appendChild(brk3);
    editCont.appendChild(tags);
    editCont.appendChild(tagText);
    editCont.appendChild(btnFlex);

    if(index > 0){
        try{
            let taskAbove = document.querySelectorAll('.task')[index-1];
            taskAbove.after(editCont);
        }catch{
            let taskAbove = document.querySelector('.sort-container');
            taskAbove.after(editCont);
        }
    }else{
        let taskAbove = document.querySelector('.sort-container');
        taskAbove.after(editCont);
    }

    prevEditIndex = index;
}