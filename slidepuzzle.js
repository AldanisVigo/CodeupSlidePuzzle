let slots = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
slots.push(null)
//Background music fx from : https://mixkit.co/free-sound-effects/music/ , name: Synth suspense music
let backgroundMusic = new Audio('backgroundmusic.wav')
backgroundMusic.volume = 0.2
let backgroundMusicPlaying = false
let backgroundMusicControlContainer = document.createElement('div')
let backgroundMusicPausePlay = document.createElement('button')
backgroundMusicPausePlay.innerText = 'MUTE MUSIC'
backgroundMusicPausePlay.onclick = e => {
    if(e.target.innerText == 'PLAY MUSIC'){
        e.target.innerText = 'MUTE MUSIC'
        backgroundMusic.play()
    }else if(e.target.innerText == 'MUTE MUSIC'){
        e.target.innerText = 'PLAY MUSIC'
        backgroundMusic.pause()
    }
}

backgroundMusicControlContainer.classList.add('background_music_controls')
backgroundMusicControlContainer.appendChild(backgroundMusicPausePlay)
const canSwap = (indexa,indexb) => {
    if(slots[indexa].innerText !== '' && slots[indexb].innerText !== '') return false
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
        3. Pick the piece and swap with it
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
    return arr
}


const checkWin = () => {
    let currentSlots = document.getElementsByClassName('slot')

    for(let i = 0; i < slots.length; i++){

    }
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
        //Start background music on first move, we need a user click for sound
        if(!backgroundMusicPlaying){
            backgroundMusic.play()
            backgroundMusic.loop = true
            backgroundMusicPlaying = true
            document.body.appendChild(backgroundMusicControlContainer)
        }
        if(selectedSlot == null){
            selectedSlot = newSlot
        }else{
            let indexOfSelected = slots.indexOf(selectedSlot)
            let indexOfCurrent = slots.indexOf(newSlot)
            let swp = canSwap(indexOfSelected,indexOfCurrent) ?? false
            if(swp){
                let selectedLeft = slots[indexOfSelected].style.left
                let selectedTop = slots[indexOfSelected].style.top
                let currentLeft = slots[indexOfCurrent].style.left
                let currentTop = slots[indexOfCurrent].style.top
                slots[indexOfSelected].style.left = currentLeft
                slots[indexOfSelected].style.top = currentTop
                newSlot.style.left = selectedLeft
                newSlot.style.top = selectedTop
                //Slide sound fx from : https://mixkit.co/free-sound-effects/slide/ , name: Cabinet Door Slide
                let slideEffect = new Audio('slide.wav')
                slideEffect.play()
            }
            selectedSlot = null
        }
    }
})
