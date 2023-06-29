//This addresses some initialization problem that I still don't understand.
/**
* @type {FormApp.Form}
*/
var form
/**
* @type {SpreadsheetApp.Sheet}
*/
var sheet


//loads ops data
function loadOpsData() {
   form = FormApp.openById('1eFkhQjHxgu5wR9g6DCXQCDM8EUU4vh69OfWmJ3LJk2Q')
   sheet = SpreadsheetApp.openById('1P6zePMqCGSBxmLiv3sgIidoTKOF61vTV6-wXX5t_psg').getSheetByName('GraderData')
}


//loads testing data
function loadTestData() {
  form = FormApp.openById('1hzKtf2JqItoCy6EF8AA3R1yE6ROQw7d52pr17a5eraM')
  sheet = SpreadsheetApp.openById('16ULr8qHyQ0uceIqgZ7rnSqvCqOTMHoOanT988ti3RKs').getSheetByName('GraderData')
}


//This finds column headers by number
function findColumnNumber (sheet, columnName) {

  const columnHeaders = sheet.getRange(1, 1, 2, sheet.getLastColumn()).getDisplayValues()
  if (columnHeaders[0].includes(columnName)) {
    return columnHeaders[0].indexOf(columnName) + 1
  } else if(columnHeaders[1].includes(columnName)) {
    return columnHeaders[1].indexOf(columnName) + 1
  } else {
    throw(new Error(`Column "${columnName}" not found.`))
  }
}

//This updates the next and last check-in columns based on the form
function updateCheckIns() {

  loadOpsData()     //this loads the goods  


//initialization party
  const formResponses = form.getResponses() ;                   
  const date = new Date();
  const latestResponse = formResponses[formResponses.length - 1]
  const usernameItem = form.getItems()[0]
  const username = latestResponse.getResponseForItem(usernameItem).getResponse()
  const data = sheet.getDataRange().getValues()
  const gradersCol = findColumnNumber(sheet,"Graders") - 1;
  var numMatchingUsers = 0
  var userMatchIdx 
  var nextDate = new Date();
  nextDate.setMonth(nextDate.getMonth() + 3)


//Loop through the columns in the grader row and count how many matches we have and where they are up to case.
  for (i = 0; i<data.length; i++) {
    if (data[i][gradersCol].toLowerCase() === username.toLowerCase()) {
      numMatchingUsers++  
      userMatchIdx = i
    }
  }


//Throw errors if the username is bogus or there is capitalization nonsense
  if (numMatchingUsers == 0){
    throw(new Error(`No users found with name ${username}`))
  }

  if (numMatchingUsers > 1){
    throw(new Error(`Multiple instances of ${username} found.`))
  }


  //This is the case where numMatchingUsers == 1 so we do the stuff:
  sheet.getRange(userMatchIdx + 1, findColumnNumber(sheet, 'Last')).setValue(date)
  sheet.getRange(userMatchIdx + 1, findColumnNumber(sheet, 'Next')).setValue(nextDate)
}

//Run it
updateCheckIns()