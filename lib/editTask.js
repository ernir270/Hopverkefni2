import { getCaregoryArray } from './gets.js';
import { showTasks } from './tasks.js';



export function showEditTask(data, index){


    let taskDate = new Date(data[index].due);
    // búum til breytur sem fara inn í inputin
    let dataTitle = data[index].title;
    let dataDesc = data[index].description;
    let dataDue = taskDate.getFullYear() + '-' + (taskDate.getMonth() + 1) + '-' + taskDate.getDate();
    let dataPriority = data[index].priority;
    let dataCat = data[index].category;
    let dataTags = data[index].tags;

    data.splice(index,1); // fjarlægja task


    let editList = document.querySelectorAll('.edit-task');
    for(let i = 0; i < editList.length; i++){   // fjarlægjum öll element með class="edit-task"
        
        // createTask()
        
        editList[i].parentNode.removeChild(editList[i]);
    }

    showTasks(data, index); // refresha tasks


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
    

    let brk = document.createElement('br');

    let desc = document.createTextNode('Lýsing:');

    let descText = document.createElement('textarea');
    descText.classList.add('edit-description');
    descText.rows = '2';
    descText.value = dataDesc;

    let dueDate = document.createTextNode('Hvenær á að klárast:');

    let dueDateText = document.createElement('input');
    dueDateText.type = 'date';
    dueDateText.value = dataDue;

    let flexItems = document.createElement('div');
    flexItems.classList.add('flex-items');

    let priority = document.createTextNode('Er í forgangi:');

    let priorityBox = document.createElement('input');
    priorityBox.type = 'checkbox';
    priorityBox.value = dataPriority;

    flexItems.appendChild(priority, priorityBox);
    flexItems.appendChild(priorityBox);

    
    let category = document.createTextNode('Flokkur:');


    let dropDownCategory = document.createElement('select');
    dropDownCategory.classList.add('choose-category');

    let catArr = getCaregoryArray();

    for(let i = 0; i < catArr.length; i++){
        let catOption = document.createElement('option');
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

    let cancelBtn = document.createElement('button');
    cancelBtn.innerText = 'Hætta við';
    cancelBtn.classList.add('cancel-edit');

    let deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Eyða verkefni';
    deleteBtn.classList.add('delete-task');


    btnFlex.appendChild(submit);
    btnFlex.appendChild(cancelBtn);
    btnFlex.appendChild(deleteBtn);


    editCont.appendChild(legend);
    editCont.appendChild(title);
    editCont.appendChild(titleText);
    editCont.appendChild(brk);
    editCont.appendChild(desc);
    editCont.appendChild(descText);
    editCont.appendChild(dueDate);
    editCont.appendChild(dueDateText);
    editCont.appendChild(brk);
    editCont.appendChild(flexItems);
    editCont.appendChild(category);
    editCont.appendChild(dropDownCategory);
    editCont.appendChild(brk);
    editCont.appendChild(tags);
    editCont.appendChild(tagText);
    editCont.appendChild(btnFlex);


    if(index > 0){
        let taskAbove = document.querySelectorAll('.task')[index-1];
        taskAbove.after(editCont);
    }else{
        let taskAbove = document.querySelector('.sort-container');
        taskAbove.after(editCont);
    }


}