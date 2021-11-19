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


/**
 * Birtir öll task sem eru í inntakinu (data).
 * 
 * @param {*} data 
 */
function showTasks(data){
    // finna .right-container elementið
    const container = document.querySelector('.right-container');

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
    
        let date = document.createElement('p');
        date.classList.add('grey');
        date.innerText = '10 nóv';
        flexItem2.appendChild(date);
    
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


/**
 * Fyrsta fallið sem er kallað í.
 */
async function main(){
    const data = await getData();

    showTasks(data.items);
}


main();