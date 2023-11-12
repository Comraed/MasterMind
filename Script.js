let colours = ["rgb(0, 0, 255)", "rgb(173, 255, 47)", "rgb(255, 165, 0)", "rgb(255, 255, 0)", "rgb(255, 0, 0)", "rgb(128, 0, 128)"]
let roundCounter = 0;
let tileGrid = document.getElementById("tiles");
let ansColours = [];

const colCount = window.getComputedStyle(tileGrid).gridTemplateColumns.split(" ").length;
const rowCount = window.getComputedStyle(tileGrid).gridTemplateRows.split(" ").length;

CreateGridElements()

function CreateGridElements(){
    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {

            let divEle = document.createElement("div");

            if(i == 0 && (j < (colCount - 2))){
                divEle.className += "anspeghold";
                divEle.id = "ans-" + j
            }
            else if (i == 0 && j == (colCount - 1))
                divEle.className += "buttonGrid";

            if(i < 2) {
                tileGrid.appendChild(divEle);
                continue;
            }
        
            if ( j == (colCount - 1))
            {
                divEle.className += "pinGrid";

                for (let k = 0; k < 4; k++) {
                    let pinEle = document.createElement("div");
                    pinEle.className += "pinhold";
                    pinEle.className += " pinrow" + (i-2);
                    divEle.appendChild(pinEle);
                }
            }           
            else if ( j < (colCount - 2))
            {
                divEle.className += "peghold";
                let id = "peg-" + (i - 2) + "-" + j; 

                divEle.id = id;
                divEle.onclick = function() { ClickPeg(id);};
            }

            tileGrid.appendChild(divEle)
        }
    }
    
    for (const pin of document.getElementsByClassName("pinGrid")) {
        
    }

    for (const pin of document.getElementsByClassName("buttonGrid")) {
        let resetBtn = document.createElement("div");
        resetBtn.className += "btn";
        resetBtn.innerHTML = "Reset";
        resetBtn.onclick = function() { Reset();};
        pin.appendChild(resetBtn);

        let submitBtn = document.createElement("div");
        submitBtn.className += "btn";
        submitBtn.innerHTML = "Submit";
        submitBtn.onclick = function() { Submit();};
        pin.appendChild(submitBtn);
    }



    let ansElements = document.getElementsByClassName("anspeghold");

    //generate answer
    for (let i = 0; i < ansElements.length; i++ ){
        let ind = Math.floor(Math.random() * colours.length);
        ansColours.push(colours[ind]);
    }

    // //show colours
    // for (let i = 0; i < ansElements.length; i++ ){
    //     ansElements[i].style.backgroundColor = ansColours[i];
    // }
}

function ClickPeg(id){
    let row = id.split("-")[1]
    
    if(roundCounter == row){
        let peg = document.getElementById(id)
        let currentColor = window.getComputedStyle(peg).backgroundColor
        let ind = colours.length - 1;

        for (let i = 0; i < colours.length; i++) {
            if(colours[i] == currentColor){
                ind = i;
            }
        }

        ind = (ind + 1)%colours.length;
        peg.style.backgroundColor = colours[ind];
    }
}

function Submit(){

    if(roundCounter < 0) return;
    let lstRowEle = [];

    //check if row is applicable
    for (let peg of document.getElementsByClassName("peghold")){

        //check if on row
        if(peg.id.split("-")[1] == roundCounter)
        {
            let pegColour = window.getComputedStyle(peg).backgroundColor; 
            let isColSet = false;
            for (const colour of colours) 
            {
                if (pegColour == colour){
                    isColSet = true;
                    break;
                }
            }

            if(!isColSet){
                alert("Not all Colours have Been Set for the current row");
                return;
            }       

            lstRowEle.push(peg);
        }
    }

    lstRowEle.sort((a,b) => a.id.split("-")[2] - b.id.split("-")[2] );

    let blackPins = 0;
    let whitePins = 0;

    let lstNonBlack = [];
    let lstNonBlackAns = [];

    //Check for black pins
    for (let i = 0; i < lstRowEle.length; i++ ){
        let guessColor = window.getComputedStyle(lstRowEle[i]).backgroundColor;
        let ansColor = ansColours[i];

        if( guessColor == ansColor )
            blackPins++;
        else
        {
            lstNonBlack.push(guessColor);
            lstNonBlackAns.push(ansColor);
        }
    }

    //check for white pins
    for (let i = 0; i < lstNonBlack.length; i++ )
    {
        for (let j = 0; j < lstNonBlackAns.length; j++ )
        {
            if (lstNonBlack[i] == lstNonBlackAns[j])
            {
                whitePins++;
                lstNonBlackAns.splice(j, 1);
                break;
            }
        }
    }

    // console.log("Black:" + blackPins)
    // console.log("White:" + whitePins)

    let lstPins = document.getElementsByClassName("pinrow" + roundCounter)
    let won = blackPins >= ansColours.length;

    for (let pin of lstPins){
        if(blackPins > 0){
            blackPins--;
            pin.style.backgroundColor = "black"
            continue;
        }

        if(whitePins > 0){
            whitePins--;
            pin.style.backgroundColor = "white"
            continue;
        }
       
        break;
    }

    //check for win condition
    if(won){
        let lstAnsEle = document.getElementsByClassName("anspeghold");
        for (let i = 0; i < lstAnsEle.length; i++ ){
            lstAnsEle[i].style.backgroundColor = ansColours[i];
        }
        alert("You Guessed it");
        roundCounter = -1;
    }
    else
        roundCounter++; 
}

function Reset(){
    console.log("reset")
}

// let board = document.getElementById("board")

// //add first row 
// let topEle = document.createElement("div");
// topEle.id = "topRow";
// topEle.className += "row ";

// for (let i = 0; i < holes; i++) 
// {
//     let colEle = document.createElement("div");
//     colEle.id = "top" + i;
//     colEle.className += "sq ";
//     colEle.className += "col ";
//     colEle.innerHTML = "o";
//     topEle.appendChild(colEle);
// }

// board.appendChild(topEle);

// //add all other rows
// for (let i = 0; i < rows; i++) {
    
//     //create row container
//     let rowEle = document.createElement("div");
//     rowEle.id = "r" + i;
//     rowEle.className += "row ";

//     //create left pin square
//     let pinEleL = document.createElement("div")
//     pinEleL.id = "pin" + i + "-L";
//     pinEleL.className += "pinCon ";
//     pinEleL.innerHTML = "p";
//     rowEle.appendChild(pinEleL);

//     //create all other squares
//     for (let j = 0; j < holes; j++) {
//         let colEle = document.createElement("div");
//         colEle.id = "sq" + i + "-" + j;
//         colEle.className += "sq ";
//         colEle.className += "col ";
//         colEle.innerHTML = "h";
//         rowEle.appendChild(colEle);
//     }

//     //create right pin square
//     let pinEleR = pinEleL.cloneNode(true);
//     pinEleR.id = "pin" + i + "-R";
//     rowEle.appendChild(pinEleR);

//     board.appendChild(rowEle);
// }