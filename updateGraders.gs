// Global Variables
const CHECKINSHEET = SpreadsheetApp.openById('1P6zePMqCGSBxmLiv3sgIidoTKOF61vTV6-wXX5t_psg').getSheetByName('GraderData')
const CONTRACTORSUNIVERAL = SpreadsheetApp.openById('1QFD2-76RIHwd_WEe5HooOKDkggiMuS5gR3iA7mCv8rc').getSheetByName('Master List')

// Returns 2D array of grader usernames from Contractor's Universal - used by Grader Tracking
function getGraders() {
  const lastRow = CONTRACTORSUNIVERAL.getLastRow()
  const graderColumn = findColumnNumber(CONTRACTORSUNIVERAL, 'Grade')
  const data = CONTRACTORSUNIVERAL.getRange(2, 1, lastRow, graderColumn).getDisplayValues(); // User ID is index 0 and Grade index is graderColumn - 1
  const graderUsernames = []

  data.forEach((datum) => {
    if (datum[graderColumn - 1] ==='Y') {
      graderUsernames.push([datum[2]])
    }
  })

  return graderUsernames
}

// Main Function: Updates username column with all graders
function updateGraders() {
  const graderUsernames = getGraders()
  const allGradersCol = findColumnNumber(CHECKINSHEET, 'Graders')

  CHECKINSHEET.getRange(3, allGradersCol, CHECKINSHEET.getLastRow()).clear()
  CHECKINSHEET.getRange(3, allGradersCol, graderUsernames.length).setValues(graderUsernames)
}


// Helper function to find column number based on column name
function findColumnNumber (sheet, columnName) {
  const columnHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()

  return columnHeaders[0].indexOf(columnName) + 1
}


function messingAround() {
  // Grab all headings
  const date = CHECKINSHEET.getRange(1,1,1,CHECKINSHEET.getLastColumn()).getDisplayValues()
  Logger.log(date)
  const today = new Date()
  const months = []

  // Add an object for each month with full month name and JS month number (Jan = 0, Feb = 1, etc.)
  for (let i = 0; i < 12; i++) {
    today.setMonth(i)
    months.push(
      {
        monthName: today.toLocaleString('default', {month: 'long'}),
        monthNum: i
      })
  }
  Logger.log(months)

  // Exploring grabbing check in date to use for averages since that month
  const recentCheckin = CHECKINSHEET.getRange(3, 3).getDisplayValue()
  Logger.log(recentCheckin)
  const month = recentCheckin.split('/')[0]
  Logger.log(month)

  // Change month from checkin to a number, then find the long month name, year in the headings.
  const newMonth = parseInt(month, 10) - 1
  Logger.log(newMonth)
  const newMonthAsDate = new Date()
  newMonthAsDate.setMonth(newMonth)
  Logger.log(newMonthAsDate.getMonth())

  // Find month object that matches the most recent heading
  const thisMonth = months.filter((obj) => obj.monthNum === newMonth - 1)
  // Find the position in the headings array so we know the column. All of this will probably be unnecssary if the sheet remains consistent.
  Logger.log(date[0].indexOf(`${thisMonth[0].monthName} ${newMonthAsDate.getFullYear()}`))

}
