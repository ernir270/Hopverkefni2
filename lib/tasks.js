/**
 * raðar (data) eftir (sortBy)
 * 
 * @param {dagsetning} sortBy strengur sem segir til um hvernig gögnin verða röðuð
 * @param {*} data Gögn
 */
 function sortTasks(sortBy, data){

    if(sortBy === 'dagsetning'){ // raða eftir dagsetningu
        data.sort(function(x, y){
            if(x.due !== null){
                return x.due - y.due;
            }
        })
    }
}


/**
 * Fjarlægir öll element sem eru með class="task" og 
 * svo birtir öll task sem eru í inntakinu (data).
 * 
 * @param {*} data 
 */
export function showTasks(data){
    // finna .right-container elementið
    const container = document.querySelector('.right-container');


    // deleta öllum .task elementum
    const tasks = document.querySelectorAll('.task');
    console.log(tasks);

    for(let i = 0; i < tasks.length; i++){
        tasks[i].parentNode.removeChild(tasks[i]);
    }

    const dropdownValue = document.querySelector('#sort-by').value;
    
    sortTasks(dropdownValue, data); // raða listanum

    for(let i = 0; i < data.length; i++){
        let section = document.createElement('section');  // búa til <section>
        section.classList.add('task');                    // bæta við class="task"
    
        let flexItem1 = document.createElement('div');
        flexItem1.classList.add('flex-items');
    
        section.appendChild(flexItem1); // láta flexItem1 vera child af section
    
        let input = document.createElement('input'); // búa til <input>
        input.type = 'radio';
        input.name = 'title';
        input.value = '';
    
        let taskTitle = document.createElement('p'); // búa til <p>
        taskTitle.innerText = data[i].title; // textinn á <p>
    
        // láta input og taskTitle vera 'börn' af flexItem1
        flexItem1.appendChild(input);
        flexItem1.appendChild(taskTitle);
    
        // description
        let description = document.createElement('p');
        description.classList.add('grey');
        description.innerText = data[i].description;
        section.appendChild(description);
    
        let flexItem2 = document.createElement('div');
        flexItem2.classList.add('flex-items');
    
        // dagsetning
        if(data[i].due !== null){ // ef dagsetning er ekki null
            let time = new Date(data[i].due);

            // replacea til að fá íslenskt útlit af dagsetningunni
            let timeStr = String(time).replace("o","ó").replace("Dec","Des").replace(" 0"," ").replace("Oct","okt").replace("May","Maí").replace("Ju","jú").replace("Aug","Ágúst").toLowerCase();

            let timeArr = timeStr.split(" ");
            let date = document.createElement('p');
            date.classList.add('grey');
            date.innerText = timeArr[2] + " " + timeArr[1];
            flexItem2.appendChild(date);
        }
    
        // búa til tags
        for(let j = 0; j < data[i].tags.length; j++){
            let tag = document.createElement('div');
            tag.classList.add('tag');
            tag.innerText = data[i].tags[j];
            flexItem2.appendChild(tag);
        }
    
        let category = document.createElement('p');
        category.classList.add('category-text');
        category.innerText = data[i].category;
        flexItem2.appendChild(category);
    
        section.appendChild(flexItem2);
    
        container.appendChild(section);
    
    }
}