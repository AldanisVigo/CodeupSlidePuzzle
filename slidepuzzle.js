let slots = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
slots.push(null)
console.log(slots)

const canSwap = (indexa,indexb) => {
    if(slots[indexa].innerText !== '' && slots[indexb].innerText !== '') return false

    // if(Math.abs(indexa-indexb) === 4) return true
    // if(Math.abs(indexa-indexb) === 1) return true
    let allowSwap = false   
    let aleft = Number(slots[indexa].style.left.split('px')[0])
    let atop = Number(slots[indexa].style.top.split('px')[0])

    let bleft = Number(slots[indexb].style.left.split('px')[0])
    let btop = Number(slots[indexb].style.top.split('px')[0])

    if(Math.abs(aleft - bleft) == 100 && atop == btop){
        allowSwap = true
    }

    if(Math.abs(btop - atop) == 100 && aleft == bleft){
    
        allowSwap = true
    }

    return allowSwap
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

/*
    I was going to use the algorithm on David's code, but I think I am going to take a different approach now. 
    Let's think about how shuffling a slide puzzle works. When we begin
        1. We find the empty slot
        2. Decide which pice we want to fill the empty slot, only choosing from the adjacent pieces that are perpendicular to the empty slot
        3. Pick the pice and swap with it
        4. Do this n times to "shuffle" the puzzle.

    This is analogous to doing it by hand.
*/
let shuffleMoveCount = 10
let emptySlotIndex = slots.length - 1
const shuffleTruffle = (board) => {
    let arr = board
    for(let i = 0; i < shuffleMoveCount; i++){ //Do this n times
        //calculate which indexes are adjacent and store them in an array
        let adjacent = []
        if(emptySlotIndex - 4 >= 0){
            adjacent.push(emptySlotIndex - 4)
        }
        if(emptySlotIndex + 4 <= 15){
            adjacent.push(emptySlotIndex + 4)
        }
        
        if(emptySlotIndex - 1 >= 0){
            adjacent.push(emptySlotIndex - 1)
        }
        if(emptySlotIndex + 1 <= 15){
            adjacent.push(emptySlotIndex + 1)
        }

        //choose a random one in the array
        let randomAdjacent = adjacent[getRandomInt(0,adjacent.length)]
        
        //swap with the emptySlotIndex 
        arr[emptySlotIndex] = arr[randomAdjacent]
        arr[randomAdjacent] = null

        //update the emptySlotIndex
        emptySlotIndex = randomAdjacent
    }
    console.log(arr)
    return arr
}


let selectedSlot = null
slots = shuffleTruffle(slots)

slots.forEach((slot,index)=>{
    
    let newSlot = document.createElement('div')
    if(slot !== null){
        newSlot.classList.add('slot')

        // calculate y position
        let t = Math.floor(index / 4) * 100
        //calculate x position 
        let l = (index % 4) * 100

        newSlot.style.position = 'absolute'
        newSlot.style.left = l + 'px'
        newSlot.style.top = t + 'px'

        document.getElementById('container').appendChild(newSlot)
    }else{
        newSlot.classList.add('empty_slot')
                
        //calculate y position
        let t = Math.floor(index / 4) * 100 
        //calculate y position 
        let l = (index % 4) * 100 

        newSlot.style.position = 'absolute'
        newSlot.style.left = l + 'px'
        newSlot.style.top = t + 'px'

        document.getElementById('container').appendChild(newSlot)
    }
    newSlot.innerText = slot

    slots[index] = newSlot

    newSlot.onclick = () => {
        if(selectedSlot == null){
            selectedSlot = newSlot
        }else{
            let indexOfSelected = slots.indexOf(selectedSlot)
            let indexOfCurrent = slots.indexOf(newSlot)

            let swp = canSwap(indexOfSelected,indexOfCurrent) ?? false
            console.log("Can swap : " + swp)

            if(swp){
                let selectedLeft = slots[indexOfSelected].style.left
                let selectedTop = slots[indexOfSelected].style.top

                let currentLeft = slots[indexOfCurrent].style.left
                let currentTop = slots[indexOfCurrent].style.top

                slots[indexOfSelected].style.left = currentLeft
                slots[indexOfSelected].style.top = currentTop

                newSlot.style.left = selectedLeft
                newSlot.style.top = selectedTop
            }

            selectedSlot = null
        }
    }
})



//Swap Method 
// const init = () => {
//     Array.from(slot_elems).forEach((slot_box,index)=>{
//         slot_box.innerText = slots[index] ?? ''
//         console.log(slot_box)
//         console.log(index)
//         slot_box.onclick = e => {
//             let contents = e.target.innerHTML
//             console.log("Selected box" + selectedBox)
//             console.log("Contents of clicked box: " + contents)
//             if(selectedBox != null && contents === '' && canSwap(index,selectedBox)){
//                 console.log("Swapping")
//                 // let selectedStyle = window.getComputedStyle(slot_elems[selectedBox])
//                 // let selectedBoxLeft = selectedStyle.left
//                 // let selectedBoxTop = selectedStyle.top

//                 // let emptySlotStyle = window.getComputedStyle(slot_elems[index])
//                 // let emptySlotLeft = emptySlotStyle.left
//                 // let emptySlotTop = emptySlotStyle.top

//                 // slot_elems[index].style.left = selectedBoxLeft
//                 // slot_elems[index].style.top = selectedBoxTop

//                 let selectedRect = slot_elems[selectedBox].getBoundingClientRect()
//                 let selectedBoxLeft = selectedRect.left
//                 let selectedBoxTop = selectedRect.top

//                 let emptySlotRect = slot_elems[index].getBoundingClientRect()
//                 let emptySlotLeft = emptySlotRect.left
//                 let emptySlotTop = emptySlotRect.top

//                 let selectedBoxTransform, emptySlotTransform
//                 if(selectedBox < index){
//                     selectedBoxTransform = 'translateX(' + Number(Number(emptySlotLeft) - Number(selectedBoxLeft)) + 'px) translateY(' + Number(Number(emptySlotTop) - Number(selectedBoxTop)) + 'px)'
//                     console.log(selectedBoxTransform)

//                     emptySlotTransform = 'translateX(' + Number(Number(selectedBoxLeft) - Number(emptySlotLeft)) + 'px) translateY(' + Number(Number(selectedBoxTop) - Number(emptySlotTop))  +'px)'
//                     console.log(emptySlotTransform)
//                 }else{
//                     selectedBoxTransform = 'translateX(' + Number(Number(selectedBoxLeft) - Number(emptySlotLeft)) + 'px) translateY(' + Number(Number(selectedBoxTop) - Number(emptySlotTop)) + 'px)'
//                     console.log(selectedBoxTransform)

//                     emptySlotTransform = 'translateX(' + Number(Number(emptySlotLeft) - Number(selectedBoxLeft)) + 'px) translateY(' + Number(Number(emptySlotTop) - Number(selectedBoxTop))  +'px)'
//                     console.log(emptySlotTransform)
//                 }

//                 slot_elems[selectedBox].style.transform = selectedBoxTransform
//                 slot_elems[index].style.transform = emptySlotTransform

//                 //perform swap in array
//                 let selectedCpy = Object.assign({},slot_elems[selectedBox])
//                 let emptyCpy = Object.assign({},slot_elems[index])
//                 slot_elems[selectedBox] = emptyCpy
//                 slot_elems[index] = selectedCpy

//                 selectedBox = null
//             }else{
//                 unselectAllBoxes()
//                 slot_elems[index].classList.add('selected')
//                 selectedBox = index
//             }
//         }
//     })
// }

// init()

