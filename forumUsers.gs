/**
* @type {FormApp.Form}
*/

var form

/**
* @type {SpreadsheetApp.Sheet}
*/
var sheet

//loads opps data

function loadOpsData() {
   form = FormApp.openById('1eFkhQjHxgu5wR9g6DCXQCDM8EUU4vh69OfWmJ3LJk2Q')
   sheet = SpreadsheetApp.openById('1P6zePMqCGSBxmLiv3sgIidoTKOF61vTV6-wXX5t_psg').getSheetByName('GraderData')
}

//loads test data
function loadTestData() {
  form = FormApp.openById('1hzKtf2JqItoCy6EF8AA3R1yE6ROQw7d52pr17a5eraM')
  sheet = SpreadsheetApp.openById('16ULr8qHyQ0uceIqgZ7rnSqvCqOTMHoOanT988ti3RKs').getSheetByName('GraderData')
}


function recentCheckUpdate() {
  
  loadTestData()
  const formResponses = form.getResponses() ;
  const date = new Date();
  const latestResponse = formResponses[formResponses.length - 1]
  const usernameItem = form.getItems()[0]
  const username = latestResponse.getResponseForItem(usernameItem).getResponse()
  const data = sheet.getDataRange().getValues()

  for (i = 0; i<data.length; i++) {
    if (data[i][0] === username) {
      sheet.getRange(i+1, 3).setValue(date);
      break;
    }
  }
  }

recentCheckUpdate()
