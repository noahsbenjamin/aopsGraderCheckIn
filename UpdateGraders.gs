const checkinSheet = SpreadsheetApp.openById('1P6zePMqCGSBxmLiv3sgIidoTKOF61vTV6-wXX5t_psg').getSheetByName('GraderData')
const contractorsUniversal = SpreadsheetApp.openById('1QFD2-76RIHwd_WEe5HooOKDkggiMuS5gR3iA7mCv8rc').getSheetByName('Master List')

// Returns 2D array of grader IDs from Contractor's Universal - used by updateTrackingSheet
function getGraders() {
  const lastRow = contractorsUniversal.getLastRow()
  const graderColumn = findColumnNumber(contractorsUniversal, 'Grade')
  const data = contractorsUniversal.getRange(2, 1, lastRow, graderColumn).getDisplayValues(); // User ID is index 0 and Grade index is graderColumn - 1
  const graderIds = []

  data.forEach((datum) => {
    if (datum[graderColumn - 1] ==='Y') {
      graderIds.push([datum[2]])
    }
  })
  return graderIds
}


// Main Function: Updates username column with all graders
function updateGraders() {
  const graderIds = getGraders()
  const allGradersCol = findColumnNumber(checkinSheet, 'Graders')

  checkinSheet.getRange(3, allGradersCol, checkinSheet.getLastRow()).clear()
  checkinSheet.getRange(3, allGradersCol, graderIds.length).setValues(graderIds)
}


// Helper function to find column number of 'Grade' column in Contractor's Universal
function findColumnNumber (sheet, columnName) {
  const columnHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()

  return columnHeaders[0].indexOf(columnName) + 1
}


function messingAround() {
  const date = checkinSheet.getRange(1,1,1,checkinSheet.getLastColumn()).getDisplayValues()
  Logger.log(date)
  const today = new Date()
  const months = []

  for (let i = 0; i < 12; i++) {
    today.setMonth(i)
    months.push(today.toLocaleString('default', {month: 'long'}))
  }
  Logger.log(months)

  const recentCheckin = checkinSheet.getRange(3, 3).getDisplayValue()
  Logger.log(recentCheckin)

  const month = recentCheckin.split('/')[0]
  Logger.log(month)
  const newMonth = parseInt(month, 10) - 1
  Logger.log(newMonth)
  const newMonthAsDate = new Date()
  newMonthAsDate.setMonth(newMonth)
  Logger.log(newMonthAsDate.getMonth())
}
