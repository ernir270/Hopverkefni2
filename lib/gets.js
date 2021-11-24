import { data, dataItems } from './data.js'
import { taskSelect } from '../main.js';

/**
 * Býr til og skilar tvívíðu fylki [nafn á tag][hversu mörg task eru með það tag].
 * 
 * @returns tvívítt fylki með öllum tags sem eru í data.json.
 */
function getTagArray(){
    const tagArr = []; // tómt array sem við munum bæta tags og tag teljara í. (verður tvívítt fylki)
    let containsIt;

    // bætir öllum tags sem eru til í tagArr
    for(let i = 0; i < dataItems.length; i++){
        for(let j = 0; j < dataItems[i].tags.length; j++){
            containsIt = false; // reset í false
            
            // finnur hvort tag er núþegar í listanum 
            for(let g = 0; g < tagArr.length; g++){
                // ef tagArr[g] er með dataItems[i].tags[j] í listanum  && !dataItems[i].deleted && !dataItems[i].completed
                if(tagArr[g].includes(dataItems[i].tags[j]) && !dataItems[i].deleted && !dataItems[i].completed){
                    containsIt = true;
                    tagArr[g][1]++; // bætir 1 við teljarann sem telur hversu mörg task eru með þetta tag
                    break;
                }
            }

            // ef tag er ekki í listanum
            if(!containsIt && !dataItems[i].deleted && !dataItems[i].completed){
                tagArr.push([dataItems[i].tags[j],1]); // bæta tag-i við í listann
            }
        }
    }
    return tagArr;
}


/**
 * Birtir öll tög-in sem eru til.
 */
 export function getTags(){

    let tagArr = getTagArray();
    
    const tagCont = document.querySelector('.tag-container');
    for(let i = 0; i < tagArr.length; i++){ // búum til element og birtum tag-in

        let liCont = document.createElement('div'); // búa til div
        liCont.classList.add('li-container') // bæta við class="li-container"

        // búum til <li>
        let li = document.createElement('li');
        li.innerText = tagArr[i][0]; // textinn
        li.classList.add(`${tagArr[i][0]}-tag`);
        li.classList.add('tagName');
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
 * Býr til og skilar tvívíðu fylki [nafn á category][hversu mörg task eru með það category].
 * 
 * @returns tvívítt fylki með öllum categories sem eru í data.json.
 */
export function getCaregoryArray(){
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
    return categoryArray;
}

/**
 *  Birtir alla flokka sem eru til.
 */
export function getCategories(){

    let categoryArray = getCaregoryArray();

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
export function showTaskCount(){

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
    num.classList.add('topCounters');        
    liCont[0].appendChild(num);

    // búum til p fyrir Kláruð verkefni
    num = document.createElement('p');
    num.innerText = finishedTaskCount;
    num.classList.add('grey');
    num.classList.add('right-num');
    num.classList.add('topCounters');     
    liCont[1].appendChild(num);    
    
}

/**
 * Uppfærir tölurnar sem telja hversu mörg verkefni, flokkar, og tags eru til.
 * Notast t.d. þegar búið er að klára task, þá þarf að uppfæra tölurnar.
 */
export function refreshTaskCounters(){

    //// refreshar fyrir Verkefni og Kláruð verkefni
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


    const rightNums = document.querySelectorAll('.topCounters');
    rightNums[0].innerText = taskCount;       
    rightNums[1].innerText = finishedTaskCount;
    ////

    //// refreshar fyrir Flokka
    let categoryArray = getCaregoryArray();

    const categoryContainer = document.querySelector('.category-container');
    const nums = categoryContainer.querySelectorAll('.right-num');

    for(let i = 0; i < categoryArray.length; i++){
        nums[i].innerText = categoryArray[i][1];
    }
    ////

    //// refreshar fyrir Tags
    let tagArr = getTagArray();

    const tagCont = document.querySelector('.tag-container');
    const tagNums = tagCont.querySelectorAll('.right-num');
    const tagNames = tagCont.querySelectorAll('.tagName');

    const tagNamesInTagArr = [];

    for(let i = 0; i < tagArr.length; i++){
        tagNamesInTagArr.push(tagArr[i][0]);
    }

    for(let i = 0; i < tagNums.length; i++){

        if(!tagNamesInTagArr.includes(tagNames[i].innerText)){
            tagNums[i].innerText = '0';

        }
        else if(i < tagArr.length){
            tagNums[i].innerText = tagArr[i][1];
        }
    }


}