let checkedType,checkedArrange;

// type of data
const typeInputGetAll = document.getElementsByName("type")
const arrangeInputGetAll = document.getElementsByName("arrange")

const createBtn = document.getElementById("createLayoutBtn");
const clearBtn = document.getElementById("clearBtn");

//  output section
const horizontalFlex = document.getElementById ("horFlex");
const verticalFlex = document.getElementById ("verFlex");
const layoutGrid = document.getElementById("layoutGrid");

const clearCurrentOutput = () => {
  document.documentElement.style.setProperty("--rowsInput", 0);
  document.documentElement.style.setProperty("--columnsInput", 0); 
  horizontalFlex.innerHTML = "";
  verticalFlex.innerHTML = "";
  layoutGrid.innerHTML = "";
};

const clearCurrentSideBars = () => {
  horizontalFlex.innerHTML = "";
  verticalFlex.innerHTML = "";
}


const adjustOutputCss = () => { 
  document.documentElement.style.setProperty("--rowsInput", rows);
  document.documentElement.style.setProperty("--columnsInput", columns); 
};

const createHorizontalFlex = () => {
  horizontalFlex.classList.add("output__horizontal-flex");
  
  for (let c=0;c<=columns;c++) {
    let createNewSpan = document.createElement("span");

    createNewSpan.appendChild(document.createTextNode(c));
    createNewSpan.classList.add("output__horizontal-item");
    horizontalFlex.appendChild(createNewSpan);
  };

};

const createVerticalFlex = () => {
  verticalFlex.classList.add("output__vertical-flex")
  
  for (let r=1;r<=rows;r++) {
    let createNewSpan = document.createElement("span");

    createNewSpan.appendChild(document.createTextNode(r));
    createNewSpan.classList.add("output__vertical-item");
    verticalFlex.appendChild(createNewSpan);
  };
};



const getSumInfo = () => {
  let result;
  let gridItems;
  gridItems = Array.from(document.getElementsByClassName("output__layout-item"));
  gridItems = gridItems.map(item => Number(item.innerHTML))
  result = gridItems.reduce((acc,item)=>{
    if (acc[item]) {
      acc[item] = ++acc[item]
    }
    else {
    acc[item] = 1
    }

  return acc
  },{})

  return result
};

let columnIndex = 1
let rowIndex = 3

const getColumnData = (columnIndex) => {
  let arrayOfIndexs = [];
  for (let i=0;i<totalItemsCalc;i++) {
    if (i % columns === columnIndex-1) {arrayOfIndexs.push(i)}}
  return arrayOfIndexs.map(item => currentStateOfArray[item])
}

const getRowData = (rowIndex) => {
    let arrayOfIndexs = []
    for (let i=0;i<totalItemsCalc;i++) {
      if (i < columns*rowIndex && i>=columns*(rowIndex-1)) {
        arrayOfIndexs.push(i)
      }
    }
    return arrayOfIndexs.map(item => currentStateOfArray[item])
}    

clearBtn.addEventListener("click",clearCurrentOutput);

let label, area, object, appear, times;
let rangeTotal;

const updateSetValues = () => {
  rows = rowsInput.value;
  columns = columnsInput.value;
  totalItemsCalc = rows * columns;
}

const checkSetValues = () => {
  if (rows > 50 || columns > 50 || rows < 0 || columns < 0) {
    return alert("Your input is not allowed.")
  }

  else if (rows == 0 || columns == 0) {
    return clearCurrentOutput();
  }

  else {return true}
}

const updateConditionValues = () => {
  label = document.getElementById("cond-name").value
  area = document.getElementById("condGroup").value
  index = Number(document.getElementById("row-col-index-input").value)
  object = Number(document.getElementById("condData").value)
  appear = document.getElementById("condCon").value
  times = Number(document.getElementById("condTimes").value)
};

const updateAllValues = () => {
 updateSetValues();
 updateConditionValues();
}

const newArrayConstructor = (startNum,limitNumber,pushValue) => {
  let arr = [];
  for (let i=startNum;i<limitNumber;i++) {
    arr.push(pushValue !== undefined ? pushValue : i)
  }
  return arr
}

let modifiedArray;
let currentStateOfArray;

const createArrayForTable = () => {
  let nullArray = newArrayConstructor(0,totalItemsCalc,null)

    do {
        modifiedArray = nullArray.reduce((acc,y,index)=>{
          do {
            acc[index] = randNum(10)
            currentStateOfArray = acc
          }
          while (arrayOfConditions.map(item=>item.conflict()).find(x => x===true) === true)
          return acc
        },[...nullArray])
       }

    while (arrayOfConditions.map(item=>item.status()).find(x => x===false) === false)

  return modifiedArray
} 

const createNewArray = () => {
  let newArray = createArrayForTable();
  return newArray
}

const createSidePanels = ()=> {
  createHorizontalFlex();
  createVerticalFlex();
}

const assignArrayToSpan = (array)=> {
  layoutGrid.classList.add("output__layout-grid")
  for (let i = 0; i<totalItemsCalc; i++) {
    let createNewSpan = document.createElement("span");
    createNewSpan.appendChild(document.createTextNode(array[i]));
    createNewSpan.classList.add("output__layout-item");
    layoutGrid.appendChild(createNewSpan)}
  return layoutGrid
} 

const paintColors = () => {
  let currentGrid = layoutGrid
  currentGrid.childNodes.forEach(node => {
    let innerNumber = Number(node.innerHTML);
    node.style.backgroundColor = Array.from(mySquares).find(x=>Number(x.innerHTML) === innerNumber).style.backgroundColor
  })
}

const createFullLayout = () => {
  clearCurrentOutput();
  adjustOutputCss();
  createSidePanels();
  let array = createNewArray()
  assignArrayToSpan(array)
  paintColors()
}

const markSpan = (objectName) => {
  let gridItems;
  gridItems = Array.from(document.getElementsByClassName("output__layout-item"));
  gridItems.filter(item => item.innerHTML == objectName).forEach(x => x.classList.toggle("output_find-item")
  )
}

const getTableData = () => {
  let gridItems;
  gridItems = Array.from(document.getElementsByClassName("output__layout-item"));
  gridItems = gridItems.map(item => Number(item.innerHTML));
  return gridItems
};


class Condition {
  constructor() {
    this.label = label;
    this.area = area;
    this.index = index;
    this.appear = appear;
    this.object = object;
    this.times = times;
  }

checkConditions (array) {
  let count = array.filter(item => item === this.object).length

  if (this.appear === "min") {
    return this.times <= count
  }
  else if (this.appear === "max") {

    return this.times >= count
  }
  else if (this.appear === "exact") {
    return this.times === count
  }
}

  status () {
    if (this.area === "table") {
      return this.checkConditions(modifiedArray);
    }
    else if (this.area === "row") {
      return this.checkConditions(getRowData(this.index))
    }
    else if (this.area === "column") {
      return this.checkConditions(getColumnData(this.index))
    }
    else if (this.area === "all-rows") {
      for (let i =0;i<=rows;i++) {
        console.log(`test`,this.times < getRowData(i).filter(item => item === this.object).length);
      }
    }
    else if (this.area === "all-columns") {
      for (let i =0;i<=columns;i++) {
        getColumnData(i)
      }
    }
  }

  checkconflict (array) {
    // conflict > true
    //no conflict > false
    let count = array.filter(item => item === this.object).length

  if (this.appear === "min") {
    return false //set
  }
  else if (this.appear === "max") {

    return this.times < count // set
  }
  else if (this.appear === "exact") {
    return this.times < count //set
  }
  }

  conflict() {
    if (this.area === "table") {
      return this.checkconflict(currentStateOfArray);
    }
    else if (this.area === "row") {
      getRowData(this.index)
      return this.checkconflict(getRowData(this.index))
    }
    else if (this.area === "column") {
      return this.checkconflict(getColumnData(this.index))
    }
    else if (this.area === "all-rows") {
      for (let i =0;i<=rows;i++) {
        console.log(`test`,this.times < getColumnData(i).filter(item => item === this.object).length);
      }
    }
    else if (this.area === "all-columns") {
      for (let i =0;i<=columns;i++) {
        getColumnData(i)
      }
    }
  }

}

const resetFillForCond = () => {
  document.getElementById("cond-name").value = "cond-" + String(arrayOfConditions.length+1)
}

function replacer(key, value) {
  return value.replace(/[^\w\s]/gi, '');
}

let arrayOfConditions = []
const addCondButton = document.getElementById("add-con-btn")
const createNewCondition = () => {
  updateConditionValues();
  
  if (label === "") {
    return console.log("label not filled");
  }
  
  else if (arrayOfConditions.map(x=>x.label === label).includes(true)) {
    return console.log("label is taken");
  }
  
  else {
    let newCondition = new Condition()
    arrayOfConditions.push(newCondition)
    const divOfConditions = document.getElementById("my-condition")
    let newContainer = document.createElement("div");
    let newLabelSpan = document.createElement("span");
    newLabelSpan.appendChild(document.createTextNode(newCondition.label))
    newContainer.appendChild(newLabelSpan)
      let newSpan = document.createElement("span");
      newSpan.appendChild(document.createTextNode(JSON.stringify(newCondition)))
      newContainer.appendChild(newSpan)
      // box for find btn and delete btn
      let newDivCon = document.createElement("div")
      // find button
      let findButton = document.createElement("button");
      findButton.appendChild(document.createTextNode("Find"))
      findButton.classList.add("find-object")
      findButton.addEventListener("click", () => markSpan(newCondition.object))
      newDivCon.appendChild(findButton)
      // delete button 
      let deleteButton = document.createElement("button");
      deleteButton.appendChild(document.createTextNode("Delete"))
      deleteButton.classList.add("remove-con")
      deleteButton.addEventListener("click", ()=> {
        let targetLabel = deleteButton.parentElement.parentElement.firstChild.innerHTML;
        arrayOfConditions.splice(arrayOfConditions.findIndex(item=>item.label === targetLabel),1)
        deleteButton.parentElement.parentElement.remove()
        if (arrayOfConditions.length === 0) {
          document.getElementById("cond-name").value = "cond-1"
        }
      })
      newDivCon.appendChild(deleteButton)
      newContainer.appendChild(newDivCon)
      // container
      newContainer.classList.add("cond-container")
      divOfConditions.appendChild(newContainer)
      resetFillForCond()
    }
}

addCondButton.addEventListener("click",createNewCondition);

// create Button
const newButtonCreate = document.getElementById("createBtn")

function createTable () {
  updateAllValues();
  if (checkSetValues () === true) {
    return createFullLayout()
  }
  else {
    return console.log("Input is above limit.")
  }
}

newButtonCreate.addEventListener("click",createTable)
document.addEventListener("keypress", function (event) {
  if (event.key === `Enter`) {
    createTable() 
  }
 })