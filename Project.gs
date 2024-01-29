function fetchQuestionsData(contestName) {
  let myArray = [];
  let category = ["A", "B", "C", "D"];
  for (const cat of category) {
    const apiUrl = `https://www.codechef.com/api/contests/${contestName}${cat}/`;
    try {
      const response = UrlFetchApp.fetch(apiUrl);
      const jsonData = JSON.parse(response.getContentText());
      const data = jsonData.problems;

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const valueToAppend = data[key].code;
          if (!myArray.includes(valueToAppend)) {
            myArray.push(valueToAppend);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching JSON data:", error);
    }
  }
  return myArray;
}

function getUsernameSubmissions(username, contestName, myArray) {
  let problemsSolvedDuringTheContest = [];
  let problemsToBeChecked = [];
  try {
    const url = `https://www.codechef.com/users/${username}`;
    Logger.log(url);
    const response = UrlFetchApp.fetch(url);

    if (response.getResponseCode() === 200) {
      const html = response.getContentText();
      const loaded_html = Cheerio.load(html);
      const contentDiv = loaded_html('div.content:has(a[href*="' + contestName + '"])');

      if (contentDiv !== null) {
        const contentHTML = contentDiv.html();
        myArray.forEach((item) => {
          if (contentHTML !== null && contentHTML.includes(item)) {
            problemsSolvedDuringTheContest.push(item);
          } else {
            problemsToBeChecked.push(item);
          }
        });
      }
    } else {
      console.error(`Failed to fetch the page. Status code: ${response.getResponseCode()}`);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
  return [problemsSolvedDuringTheContest, problemsToBeChecked];
}

function getSubmissionsAfterTheContest(username, problemCode) {
  let problemsUpSolved = [];
  const mainUrl = `https://www.codechef.com/status/${problemCode}?status=Correct&usernames=${username}`;
  try {
    var options = {
      "method": "GET",
    };
    const response = UrlFetchApp.fetch(mainUrl, options);
    if (response.getResponseCode() === 200) {
      const headers = response.getAllHeaders();
      let cookies = headers['Set-Cookie'];
      let csrfToken = response.getContentText().split("csrfToken = \"")[1]?.split("\";")[0];

      if (csrfToken) {
        const apiUrl = `https://www.codechef.com/api/submissions/PRACTICE/${problemCode}?limit=20&page=0&status=Correct&usernames=${username}&language=`;
        const headers = {
          "x-csrf-token": csrfToken,
          "Cookie": cookies
        };

        try {
          const response = UrlFetchApp.fetch(apiUrl, { headers });
          let dataPropertyOfResponse = JSON.parse(response.getContentText()).data;

          if (dataPropertyOfResponse.length !== 0) {
            problemsUpSolved.push(problemCode);
          }
        } catch (error) {
          console.error("Error fetching API data:", error);
        }
      } else {
        console.error("CSRF Token not found in the JavaScript code.");
      }
    } else {
      console.error(`Failed to fetch the page. Status code: ${response.getResponseCode()}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }

  return problemsUpSolved;
}

function getStudentsListTabName() {
  return "students-list"
}

function insertNewTab(name) {
  SpreadsheetApp.flush();
  ss = getActiveSs().insertSheet();
  SpreadsheetApp.flush();
  ss.setName(name);
}

function main() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var contestsSheet = spreadsheet.getSheetByName("contests");
  Logger.log(contestsSheet)
  var columnARange = contestsSheet.getRange("A:A");
  var columnAValues = columnARange.getValues().flat();
  var nonEmptyValues = columnAValues.filter(String);
  var lastContest = nonEmptyValues[nonEmptyValues.length - 1];
  var studentsList = getSheet(getStudentsListTabName())
  var lastRowOfStudentsListTab = studentsList.getLastRow();
  var targetSheet = getSheet(lastContest);
  var flag = true;
  var startRow = 0;
  if (getSheet(lastContest) == null) {
    insertNewTab(lastContest);
    Logger.log("TabAdded");
    addHeaderToNewTab(lastContest);
    flag = false;
  }
  if (flag) {
    var contestTab = getSheet(lastContest);
    var lastRowOfContestTab = contestTab.getLastRow();
    if (lastRowOfContestTab !== lastRowOfStudentsListTab) {
      startRow = lastRowOfContestTab-1;
    }
  }
  var targetColumnARange = studentsList.getDataRange();
  var targetColumnAValues = splitArray(targetColumnARange.getValues().flat()).slice(1,lastRowOfStudentsListTab);
  let length_of_target_column_values = targetColumnAValues.length;
  Logger.log(targetColumnAValues);
  let contestName = lastContest;
  let myArray = fetchQuestionsData(contestName);
  for (var starter = startRow; starter <= length_of_target_column_values; starter += 1) {
    var cellValue = targetColumnAValues[starter][0];
    let username = cellValue;
    let [problemsSolvedDuringTheContest, problemsToBeCheckedForUPSolve] = getUsernameSubmissions(username, contestName, myArray);
    Logger.log(username);
    Logger.log(problemsToBeCheckedForUPSolve);
    if (problemsToBeCheckedForUPSolve !== null) {
      let problemsUpSolved = [];
      problemsToBeCheckedForUPSolve.forEach((item) => {
        problemsUpSolved = problemsUpSolved.concat(getSubmissionsAfterTheContest(username, item));
      });
      let length_of_upsolved = problemsUpSolved.length;
      let cellD = getSheet(lastContest).getRange("A" + (starter + 2) + ":D" + (starter + 2));
      targetColumnAValues[starter].push(String(length_of_upsolved));
      Logger.log(targetColumnAValues[starter]);
      cellD.setValues([targetColumnAValues[starter]]);
    }
  }
}

function splitArray(inputArray) {
  var result = [];
  for (var i = 0; i < inputArray.length; i += 3) {
    var chunk = inputArray.slice(i, i + 3);
    result.push(chunk);
  }
  return result;
}

function addHeaderToNewTab(tab) {
  getSheet(tab).getRange("A1:D1").setValues([["Codechef", "Job Ready", "Campus", "upsolve"]]);
}

function getActiveSs() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getSheet(name) {
  var ss = getActiveSs();
  return ss.getSheetByName(name); //The name of the sheet tab where you are sending the info
}

