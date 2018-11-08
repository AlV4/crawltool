//var reportSS_ID = "1jjSlwcFRtgKyhnEWv4ziDSm9E0KSj8621Xy0qX091J0";
//var testId = "1FMyvD0nfRMHq5YYRSX9TfzecuUaaIGM3Atress0ri48";

//var reportSS_ID = "1EHhTqRZHpXXs0qE0topmGLHCKO0FLQw9crNexwG46jM"; //"1COChxDFCta_rzb1u3AVwLdjYQqVBVAtGrZu-_lBSutk";
//var testId = "18Q_QCo72XaCOMys2kjlVk7teqVQCVwR6iYaqHUg1Sco"; //  "1FMyvD0nfRMHq5YYRSX9TfzecuUaaIGM3Atress0ri48";
//var id = "1jQTNigWrP70L_YA1ytUyKhyWfF70rjD5NBlXr-Vuclw";
//var inputSSID = '';
/*
recreateInputSSMgr()
screamingFrogDataComparisongMgr()
onPageSEOReportMngr()
technicalSEOtblReportMngr()
timeSheetAndAgendaMngr()
*/
var email = '4eralval@gmail.com';

function entryPoint( id, reportId ){
  recreateInputSSMgr(id);
  screamingFrogDataComparisongMgr(id);
 // onPageSEOReportMngr(id);
  technicalSEOtblReportMngr(id, reportId);
 // timeSheetAndAgendaMngr(id);

  sendEmail( reportId );
}

function sendEmail( reportId ){
  var file = DriveApp.getFileById(reportId);
  MailApp.sendEmail( email, 'Script job done', 'Report attached.', {
    name: 'Automatic SFrog Report',
    attachments: [file.getAs(MimeType.PDF)]
  });
}

function entryPointTest(){
  var inputSSID = "18Q_QCo72XaCOMys2kjlVk7teqVQCVwR6iYaqHUg1Sco";
  var reportSSID = "1jjSlwcFRtgKyhnEWv4ziDSm9E0KSj8621Xy0qX091J0";
  recreateInputSSMgr(inputSSID);
  screamingFrogDataComparisongMgr(inputSSID);
 // onPageSEOReportMngr(id);
  technicalSEOtblReportMngr(inputSSID, reportSSID);
 // timeSheetAndAgendaMngr(id);
}

function recreateInputSSMgr(inputSSID) {

    //var reportSs = SpreadsheetApp.openById(reportSS_ID);
    //var reportSs = SpreadsheetApp.getActiveSpreadsheet();
//    var inputSSID = reportSs.getSheetByName("ReportPages").getRange("F1").getValues();
  //var inputSSID = id;
    // var inputSSID = "1tW9D_1KZKZtTJg3uaKjK9rJBXwqpJv9kU0MlMkuSe5Q";
    var initSheetNames = ["page_titles_all", "h1_all", "h2_all", "meta_description_all"];

    var sheetsNmsDict = {
        "page_titles_all": ["Pagina_titel_Over_65_characters", "Pagina_titel_Below_30_characters"],
        "h1_all": ["H1_Over_70_characters"],
        "h2_all": ["H2_Over_70_characters"],
        "meta_description_all": ["Meta_beschrijving_Over_155_Characters", "Meta_beschrijving_Below_70_characters"]
    };

    var inputSS = SpreadsheetApp.openById(inputSSID);

    for (i = 0; i < initSheetNames.length; i++) {
        var trr = sheetsNmsDict[initSheetNames[i]];
        for (j = 0; j < sheetsNmsDict[initSheetNames[i]].length; j++) {
            var mySheet = inputSS.getSheetByName(initSheetNames[i]);
            var initArr = mySheet.getRange(3,1, mySheet.getLastRow(), mySheet.getLastColumn()).getValues();
            var newArr = inputDataArrProceed(initArr, sheetsNmsDict[initSheetNames[i]][j]);
            newSheetCreateDataInput(inputSS, sheetsNmsDict[initSheetNames[i]][j], newArr); //create new sheete and input data

            //  Logger.log(initArr[0].length);
        }
        updateTablesHdr(mySheet)//call func to update tables header
    }

    updateTablesHdr(inputSS.getSheetByName("meta_description_duplicate"));
    updateTablesHdr(inputSS.getSheetByName("page_titles_duplicate"));
    updateTablesHdr(inputSS.getSheetByName("images_missing_alt_text"));

}

function updateTablesHdr(sheetObj) {
    var hdr = [];
    hdr[0] = ["Week #", "Hrs", "Done?", "Comments", "Date of data adding", "To report"];

    var columnNum = 100;
    var shName = sheetObj.getName();
    switch(shName) {
        case "page_titles_all":
            columnNum = 6;
            sheetObj.getRange(3,columnNum, sheetObj.getLastRow(), 3).clear()
            break;
        case "h1_all":
            columnNum = 7;
            sheetObj.getRange(3,columnNum, sheetObj.getLastRow(), 3).clear()
            break;
        case "h2_all":
            columnNum = 7;
            sheetObj.getRange(3,columnNum, sheetObj.getLastRow(), 3).clear()
            break;
        case "meta_description_all":
            columnNum = 7;
            sheetObj.getRange(3,columnNum, sheetObj.getLastRow(), 3).clear()
            break;
        case "Pagina_titel_Over_65_characters":
        case "Pagina_titel_Below_30_characters":
        case "Meta_beschrijving_Over_155_Characters":
        case "Meta_beschrijving_Below_70_characters":
            columnNum = 6;
            break;
        case "H1_Over_70_characters":
        case "H2_Over_70_characters":
            columnNum = 7;
            break;
        case "meta_description_duplicate":
        case "page_titles_duplicate":
            columnNum = 6;
            sheetObj.getRange(3,columnNum, sheetObj.getLastRow(), 3).clear()
            break;
        case "images_missing_alt_text":
            columnNum = 5;
            sheetObj.getRange(3,columnNum, sheetObj.getLastRow(), 3).clear()
            break;
        default:
            return;
    }

    sheetObj.getRange(2,columnNum, 1, hdr[0].length).setValues(hdr);

    Logger.log("f");
}

function newSheetCreateDataInput(SS_Object, shName, dataRange) {
    var newSheet = SS_Object.insertSheet();
    try {
      newSheet.setName(shName);
     } catch (err) {
       return;
     }


    //var f = dataRange.lenght;
    //var d1 = dataRange[0];
    if (dataRange == undefined)
        return;
    try {
        newSheet.getRange(3,1, dataRange.length, dataRange[0].length).setValues(dataRange);
    } catch (err) {
        Logger.log(err);
    }
    updateTablesHdr(newSheet);

}

function inputDataArrProceed (myArr, outputSheetName){

    var newArr = [];

    switch(outputSheetName) {
        case "H1_Over_70_characters":
            for each (var line in myArr) {
            if (line[3] > 70 || line[5] > 70) {
                newArr.push(line.slice(0, 6));
            }
        }
            break;
        case "h1_all":
            //remove 2 last columns on all sheet and rename
            break;
        case "H2_Over_70_characters":
            for each (var line in myArr) {
            if (line[3] > 70 || line[5] > 70) {
                newArr.push(line.slice(0, 6));
            }
        }
            break;
        case "h2_all":
            //remove 2 last columns on all sheet and rename
            break;
        case "meta_description_all":

            break;
        case "Meta_beschrijving_Over_155_Characters":
            for each (var line in myArr) {
            if (line[3] > 155) {
                newArr.push(line.slice(0, 4));
            }
        }
            break;
        case "Meta_beschrijving_Below_70_characters":
            for each (var line in myArr) {
            if (line[3] < 70) {
                newArr.push(line.slice(0, 4));
            }
        }
            break;
        case "page_titles_all":

            break;
        case "Pagina_titel_Over_65_characters":
            for each (var line in myArr) {
            if (line[3] > 65) {
                newArr.push(line.slice(0, 4));
            }
        }
            break;
        case "Pagina_titel_Below_30_characters":
            for each (var line in myArr) {
            if (line[3] < 30) {
                newArr.push(line.slice(0, 4));
            }
        }
            break;
        default:
    }
    return newArr;
}




function screamingFrogDataComparisongMgr(inputSSID) {
//!!!function to compare errors data (for each  category/specification under control from screaming frog with all links list /from screaming frog eaither/
//!!!probably it would be run just 1 time for each website (on the beginning). and worrks with source data file goten by ID (SSID)
//just one function proceedСomparison() to be called from this function

   // id = "18Q_QCo72XaCOMys2kjlVk7teqVQCVwR6iYaqHUg1Sco";
    //var reportSs = SpreadsheetApp.openById(reportSS_ID);
    //var reportSs = SpreadsheetApp.getActiveSpreadsheet();
    //var SSID = reportSs.getSheetByName("ReportPages").getRange("F1").getValues();
    // var SSID = "1dN7MtmIuY2khTtTRK4w4FFro1210v4kQ0XNePnBItVc";
    var chekFlag = checkSourceSSConnection(inputSSID)

    var sourceSS = SpreadsheetApp.openById(inputSSID);

    //var mySheet = outerS.getActiveSheet();
    var sheetAllIntrnlLinks = sourceSS.getSheetByName("internal_all");

    var dataRange = sheetAllIntrnlLinks.getRange(1,1, sheetAllIntrnlLinks.getLastRow(), 1); // sheetAllIntrnlLinks.getLastColumn());
    var ch1 = dataRange.getA1Notation();

    var dataArr = dataRange.getValues();

    var errorsSheetNamesArr = ["page_titles_all", "page_titles_duplicate", "Pagina_titel_Below_30_characters",
        "Pagina_titel_Over_65_characters", "meta_description_all", "meta_description_duplicate", "Meta_beschrijving_Over_155_Characters", "Meta_beschrijving_Below_70_characters",
        "h1_all", "H1_Over_70_characters", "h2_all", "H2_Over_70_characters", "images_missing_alt_text"]

    // var errorsSheetNamesArr = ["images_missing_alt_text"];

    for each (var tabName in errorsSheetNamesArr) {  //main loop to check all errors tabs

        proceedСomparison(sourceSS, tabName, dataArr);
    }
}

function onPageSEOReportMngr(id){

    var sheetName = "OnPageSEO_Below_500_words";

    var reportSs = SpreadsheetApp.openById(reportSS_ID);
    //var reportSs = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = reportSs.getSheetByName("ReportPages");
    var weeksRangeSS = sheet.getRange("C2:D2").getValues();

    var weeksRange = [];
    weeksRange[0] = weeksRangeSS[0][0];
    weeksRange[1] = weeksRangeSS[0][1];

    var SSID = reportSs.getSheetByName("ReportPages").getRange("F1").getValues();
    //var SSID = "1dN7MtmIuY2khTtTRK4w4FFro1210v4kQ0XNePnBItVc";
    var sourceSS = SpreadsheetApp.openById(id);

    var onPageSEORprtArr = [];

    //hourly based table
    onPageSEORprtArr = getOnPageArrDataBasedOnWeeksHours(sourceSS, sheetName, onPageSEORprtArr, weeksRange);
    // proceedSEOonPageArrToSS(onPageSEORprtArr);
    proceedSEOonPageArrToSS(onPageSEORprtArr, "ReportPages");

    //complete table
    onPageSEORprtArr = getOnPageArrData(sourceSS, sheetName, onPageSEORprtArr);

    proceedSEOonPageArrToSS(onPageSEORprtArr, "ReportPages_Annex");
}


function auxFunc(sheet) {

    var myRangeVls = sheet.getRange(2, 1, sheet.getLastRow() -1, sheet.getLastColumn()).getValues();


    var checkNum = -1;
    var flag = false;
    for each (member in myRangeVls[0]) {
      checkNum++;
      if (member.indexOf('Week') > -1) { //find where is week column
          flag = true;
          break;
       }
        //SpreadsheetApp.getUi().alert("f");
    }

    if (flag) {
      var newArr = [[]];
      for (var j = 1; j<myRangeVls.length; j++) { //put as week #1 for all links - just simulation to get whole situation (by Noel request)
        newArr[j-1]= [1];
        //myRangeVls[j][checkNum] = 1;
      }
     var recRange = sheet.getRange(3, checkNum + 1, newArr.length, newArr[0].length);
     Logger.log(recRange.getA1Notation());
     recRange.setValues(newArr);
    }

}

function technicalSEOtblReportMngr(inputSSID, reportSS_ID){

    // id = "1jQTNigWrP70L_YA1ytUyKhyWfF70rjD5NBlXr-Vuclw";
    // return;
    var reportSs = SpreadsheetApp.openById(reportSS_ID);
    // var reportSs = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = reportSs.getSheetByName("ReportPages");
    var weeksRangeSS = sheet.getRange("C2:D2").getValues();

    var weeksRange = [];
    weeksRange[0] = weeksRangeSS[0][0];
    weeksRange[1] = weeksRangeSS[0][1];

    //var SSID = "1dN7MtmIuY2khTtTRK4w4FFro1210v4kQ0XNePnBItVc";
    var SSID = reportSs.getSheetByName("ReportPages").getRange("F1").getValues();
    var sourceSS = SpreadsheetApp.openById(inputSSID);

    auxFunc(sourceSS.getSheetByName("page_titles_all"));//call aux function to push report mark on the first source sheet

    proceedSourceDoneMarks(sourceSS);

    var errorsSheetNamesArr = ["page_titles_all", "page_titles_duplicate", "Pagina_titel_Below_30_characters",
        "Pagina_titel_Over_65_characters", "meta_description_all", "meta_description_duplicate", "Meta_beschrijving_Over_155_Characters", "Meta_beschrijving_Below_70_characters",
        "h1_all", "H1_Over_70_characters", "h2_all", "H2_Over_70_characters", "images_missing_alt_text"]

    var technSEORprtArr = [];
    var periodtechnSEORprtArr = [];
    // technSEORprtArr[0] = [];
    //technSEORprtArr[0][0] = "";

    var technSEOColoringArr = [];

    var timeEstimArr = [];
    var timeRulesArr = getTimeRulesArr(reportSS_ID); //load the table with timerules

    var pageSeqNum = 1;
    var flagCompleteTbl = true; //flag to show when we need complete table or when just by reporting period

    for each (var sheetName in errorsSheetNamesArr) {
        getTechnSEORprtArr(sourceSS, sheetName, technSEORprtArr,weeksRange, pageSeqNum, technSEOColoringArr, flagCompleteTbl, timeRulesArr, timeEstimArr);
        pageSeqNum++;
    }

    proceedSEOTechnRprtArrToSS(technSEORprtArr, technSEOColoringArr, "ReportPages_Annex", reportSS_ID);


    technSEOColoringArr = [];
    flagCompleteTbl = false;
    pageSeqNum = 1;

    for each (var sheetName in errorsSheetNamesArr) {
        //timeEstimArr.push([]);
        getTechnSEORprtArr(sourceSS, sheetName, periodtechnSEORprtArr, weeksRange, pageSeqNum, technSEOColoringArr, flagCompleteTbl, timeRulesArr, timeEstimArr);      //report covered SEO table
        pageSeqNum++;
    }
    //fff
    //to complete timeEstimArr array
    var periodtimeEstimArr = [];
    updateActualDataOfperiodtechnSEORprtArr(periodtechnSEORprtArr, technSEORprtArr, periodtimeEstimArr,timeEstimArr);

    for (var ej = 1; ej <= periodtimeEstimArr[0].length - 1; ej++){  //columns
      // break;//05_11  break added to avoide weeks check, by Noel's request
        var tempTimeVal = 0;
        for (var xi = 0; xi < periodtimeEstimArr.length - 1; xi++) { //search for time value different from 0 for current column
            //var ff = periodtimeEstimArr[xi][ej];
            //var f1 = periodtimeEstimArr[xi][ej] ==0;
            //var f2 = periodtimeEstimArr[xi][ej] == null;
            //var l = !(periodtimeEstimArr[xi][ej] == 0 || periodtimeEstimArr[xi][ej] == null);
            if (periodtimeEstimArr[xi][ej] != 0 && periodtimeEstimArr[xi][ej] != null) {
                tempTimeVal = periodtimeEstimArr[xi][ej];
                break;
            }
        }

        //tempTimeVal = tempTimeVal;

        for (var ei = 0; ei <= periodtimeEstimArr.length - 1; ei++){  //rows
            if (periodtimeEstimArr[ei][ej] != 0) {
                periodtimeEstimArr[ei][ej] = tempTimeVal;// timeEstimArr[ei - 1][ej];
            }
        }
    }

    var timeEstimSumArr = updateTimeEstimateArrAndSum(periodtimeEstimArr);

    proceedSEOTechnRprtArrToSS(periodtechnSEORprtArr, technSEOColoringArr, "ReportPages", reportSS_ID);

    estimationSumTimeTableToSS (timeEstimSumArr, "ReportPages", periodtechnSEORprtArr.length, reportSS_ID);

    testTimeTableToSS(periodtimeEstimArr, "ReportPages", reportSS_ID);

}

function timeSheetAndAgendaMngr(id){
    var timeSheetArr = [];
    var reportSs = SpreadsheetApp.openById(reportSS_ID);
    //var reportSs = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = reportSs.getSheetByName("ReportPages");

    var timeRulesArr = getTimeRulesArr();

    var weeksRangeSS = sheet.getRange("C2:D2").getValues();

    var sumClmANumber = 21;

    var weeksRange = [];
    weeksRange[0] = weeksRangeSS[0][0];
    weeksRange[1] = weeksRangeSS[0][1];

    // var SSID = "1dN7MtmIuY2khTtTRK4w4FFro1210v4kQ0XNePnBItVc";
    var SSID = reportSs.getSheetByName("ReportPages").getRange("F1").getValues();
    var chekFlag = checkSourceSSConnection(id);
    var sourceSS = SpreadsheetApp.openById(id);

    var errorsSheetNamesArr = ["page_titles_all", "page_titles_duplicate", "Pagina_titel_Below_30_characters",
        "Pagina_titel_Over_65_characters", "meta_description_all", "meta_description_duplicate", "Meta_beschrijving_Over_155_Characters", "Meta_beschrijving_Below_70_characters",
        "h1_all", "H1_Over_70_characters", "h2_all", "H2_Over_70_characters", "images_missing_alt_text", "OnPageSEO_Below_500_words"]

    var pageSeqNum = 1;
    var paginaDuplicatesServiceArr = [];
    var metabeschrijvingDuplicatesServiceArr = [];

    for each (var sheetName in errorsSheetNamesArr) {
        getTimeSheetArr(sourceSS, sheetName, timeSheetArr, weeksRange, pageSeqNum, timeRulesArr, paginaDuplicatesServiceArr, metabeschrijvingDuplicatesServiceArr);
        pageSeqNum++;

    }

    specUpdateDataArr(timeSheetArr); //add additional empty columns
    //  var chf = 0;

    //block to write timeSheetTable into spreadsheet

    sheet.insertRowsAfter(7, timeSheetArr.length + 1);

    var tsRange = sheet.getRange(7, 2, timeSheetArr.length, timeSheetArr[0].length);
    var cc = tsRange.getA1Notation();
    tsRange.setValues(timeSheetArr);

    var updArr = tsRange.getValues();
    for (var ui = 0; ui <= updArr.length -1; ui++) {
        for (var uj = 0; uj <= updArr[ui].length -1; uj++) {
            if( updArr[ui][uj] == "NOT_FOUND") {
                updArr[ui][uj] = " ";
            }
        }
    }

    tsRange.setValues(updArr);
    tsRange.setNumberFormat('0.00');

    var bordersRange = sheet.getRange(7, 2, timeSheetArr.length, 20);
    bordersRange.setBorder(true, true, true, true, true, true, "black", SpreadsheetApp.BorderStyle.SOLID);

    //sum column:
    // =SUM(C7:P7)
    // =SUM(R[0]C[-12]:R[0]C[-1])
    var sumOfClmsleft = "=SUM(R[0]C[-18]:R[0]C[-1])"; //= "=SUM(R[-" + clmnRow1 + "]C[0]:R[-2]C[0])";
    var sumOfClmsleftArr = [];

    for (ix = 0; ix <= timeSheetArr.length -1; ix++){
        sumOfClmsleftArr[ix] = [];
        sumOfClmsleftArr[ix][0] = sumOfClmsleft;
    }


    var sumClmnRange = sheet.getRange(7, sumClmANumber, timeSheetArr.length, 1);
    sumClmnRange.setFormulasR1C1(sumOfClmsleftArr);
    sumClmnRange.setNumberFormat('0.00');
    //sumClmnRange.setFormulasR1C1(formulas)

    var genTableSumCell = sheet.getRange(7 + timeSheetArr.length, sumClmANumber, 1, 1);
    genTableSumCell.setFormulaR1C1("=SUM(R[-" + timeSheetArr.length + "]C[0]:R[-1]C[0])");
    genTableSumCell.setBorder(true, true, true, true, true, true, "black", SpreadsheetApp.BorderStyle.SOLID);
    genTableSumCell.setFontWeight("bold");
    //.fff
    genTableSumCell.setNumberFormat('0.00');



    //timeagenda block
    pageSeqNum = 1;
    var timeAgendaArr = [];

    var t_i = 0;
    //proceed with timeagenda data search process
    for (var i = weeksRange[0]; i<=weeksRange[1] + 2; i++){
        timeAgendaArr[t_i] = [];
        timeAgendaArr[t_i][0] = i;
        t_i++;
    }

    for each (var sheetName in errorsSheetNamesArr) {
        getTimeAgendaArr(sourceSS, sheetName, timeAgendaArr, weeksRange, pageSeqNum, timeRulesArr, paginaDuplicatesServiceArr, metabeschrijvingDuplicatesServiceArr);
        pageSeqNum++;
    }

    specUpdateDataArr(timeAgendaArr);  //add empty columns inside

    //block to writedown timeagenda

    //table header creation

    var tsRange = sheet.getRange(7 + timeSheetArr.length + 6, 2, timeAgendaArr.length, timeAgendaArr[0].length);
    var cc = tsRange.getA1Notation();
    tsRange.setValues(timeAgendaArr);
    tsRange.setNumberFormat('0.00');

    var bordersRange1 = sheet.getRange(7 + timeSheetArr.length + 6, 2, timeAgendaArr.length, 16);
    bordersRange1.setBorder(true, true, true, true, true, true, "black", SpreadsheetApp.BorderStyle.SOLID);

    //block to proceed sum in timeagendatable
    sumOfClmsleft = "=SUM(R[0]C[-18]:R[0]C[-1])"; //= "=SUM(R[-" + clmnRow1 + "]C[0]:R[-2]C[0])";
    sumOfClmsleftArr = [];

    for (ix1 = 0; ix1 <= timeAgendaArr.length -1; ix1++){
        sumOfClmsleftArr[ix1] = [];
        sumOfClmsleftArr[ix1][0] = sumOfClmsleft;
    }

    sumClmnRange = sheet.getRange(7 + timeSheetArr.length + 6, sumClmANumber, timeAgendaArr.length, 1);
    sumClmnRange.setFormulasR1C1(sumOfClmsleftArr);
    sumClmnRange.setNumberFormat('0.00');
    //sumClmnRange.setFormulasR1C1(formulas)

    //total table summ
    // var genTableSumCell = sheet.getRange(7 + timeSheetArr.length + 6 + timeAgendaArr.length, 17, 1, 1);
    // genTableSumCell.setFormulaR1C1("=SUM(R[-" + timeAgendaArr.length + "]C[0]:R[-1]C[0])");
    // genTableSumCell.setBorder(true, true, true, true, true, true, "black", SpreadsheetApp.BorderStyle.SOLID);
    // genTableSumCell.setFontWeight("bold");

}


function specUpdateDataArr(arr) {

    for (var i = 0; i<=arr.length -1; i++) {
        arr[i].splice(14, 0, " ", " ")
        arr[i].splice(17, 0, " ", " ")

    }
    return arr;
}

function getTimeRulesArr(reportSS_ID) {
    var reportSs = SpreadsheetApp.openById(reportSS_ID);
    //var reportSs = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = reportSs.getSheetByName("TimeRules");
    var timeRulesRange = sheet.getRange("A1:D25");

    var timeRulesArr = timeRulesRange.getValues();
    //var weeksRangeSS = sheet.getRange("C2:D2").getValues();
    return timeRulesArr;
}

function proceedTimeRules (pageErrorName, timeRulesArr) {

    var errorNamesArr = pageErrorName.split("_");
    var timeVal = 0;
    for each (var line in timeRulesArr) {
        if (line[0].indexOf("H", 0) != -1 || line[0].indexOf("AFBEELDINGEN", 0) != -1 || line[0].indexOf("OnPageSEO ", 0) != -1) {
            if (line[0].indexOf(errorNamesArr[0],0) != -1 &&  line[1].indexOf(errorNamesArr[1],0) != -1) {
                timeVal = line[2];
                line = line;
            }
        } else {
            if (line[0].indexOf(errorNamesArr[0],0) != -1 && line[0].indexOf(errorNamesArr[1],0) != -1 && line[1].indexOf(errorNamesArr[2],0) != -1) {
                timeVal = line[2];
                line = line;
            }
        }
    }
    return timeVal;
}

function checkDoneStatusPageOccur() { //run only after getting fresh screming frog report
    var reportSs = SpreadsheetApp.openById(reportSS_ID);
    // var reportSs = SpreadsheetApp.getActiveSpreadsheet();
    var SSID = reportSs.getSheetByName("ReportPages").getRange("F1").getValues();

    //var SSID = "1dN7MtmIuY2khTtTRK4w4FFro1210v4kQ0XNePnBItVc";
    var sourceSS = SpreadsheetApp.openById(SSID);
    var errorsSheetNamesArr = ["page_titles_all", "meta_description_all",
        "h1_all", "h2_all"]

    for each (var sheetName in errorsSheetNamesArr) {
//      var sheetName = "page_titles_all";

        var errorsSheet = sourceSS.getSheetByName(sheetName);
        var errorsActualDataArrRng = errorsSheet.getRange(1,1, errorsSheet.getLastRow(), errorsSheet.getLastColumn()); // errorsSheet.getLastColumn());
        var errorsActualDataArr = errorsActualDataArrRng.getValues();

        var occurPos = 0;
        var donePos = 0;
        for (var i = 0; i <= (errorsActualDataArr[0].length -1); i++) {
            if (errorsActualDataArr[1][i].indexOf("Occurrences", 0) != -1) {
                occurPos = i;
            }
            if (errorsActualDataArr[1][i].indexOf("Done", 0) != -1) {
                donePos = i;
            }
        }

        var newDoneArrClmn = [];
        var d_i = 0;

        for each (var line in errorsActualDataArr) {
            newDoneArrClmn[d_i] = [];
            newDoneArrClmn[d_i][donePos] = line[donePos];
            if ((line[0].indexOf("ttp", 0) != -1) && (line[occurPos] == 1)) {
                newDoneArrClmn[d_i][donePos] = 1;
            }
            d_i++;
        }

        // donePos = donePos;


        saveToRprtClmToSS(donePos, sheetName, newDoneArrClmn, sourceSS);

    }
}



function proceedSourceDoneMarks (sourceSS) {
    var errorsSheetNamesArr = ["page_titles_all", "page_titles_duplicate", "Pagina_titel_Below_30_characters",
        "Pagina_titel_Over_65_characters", "meta_description_all", "meta_description_duplicate", "Meta_beschrijving_Over_155_Characters", "Meta_beschrijving_Below_70_characters",
        "h1_all", "H1_Over_70_characters", "h2_all", "H2_Over_70_characters", "images_missing_alt_text"]


    for (var over_i = 0; over_i <= 1; over_i++) {
        for (var sn_i = 1; sn_i <= errorsSheetNamesArr.length -1; sn_i++) {

            var firstSheetIndex = sn_i - 1 - over_i;
            if ((firstSheetIndex) == -1) {
                firstSheetIndex = errorsSheetNamesArr.length - 1;
            }

            var errorsSheet = sourceSS.getSheetByName(errorsSheetNamesArr[firstSheetIndex]);
            var errorsActualDataArrRange = errorsSheet.getRange(1,1, errorsSheet.getLastRow(), errorsSheet.getLastColumn()); // errorsSheet.getLastColumn());
            var firstErrorsSheetArr = errorsActualDataArrRange.getValues();  //базовый массив с которым все будем сравнивать и в него возвращать
//  firstErrorsSheetArr = firstErrorsSheetArr;


            //for (var s_i = 1; s_i <= errorsSheetNamesArr.length - 1; s_i++) {  //loop for comparison

            errorsSheet = sourceSS.getSheetByName(errorsSheetNamesArr[sn_i - over_i]);
            var errorsToCompareDataArrRange = errorsSheet.getRange(1,1, errorsSheet.getLastRow(), errorsSheet.getLastColumn()); // errorsSheet.getLastColumn());
            var compareErrorsSheetArr = errorsToCompareDataArrRange.getValues();

            var toRprtPosArray = compareRprtArrays(firstErrorsSheetArr,compareErrorsSheetArr); //сравним массивы и обновим второй массив
            //сохраним колонку репорт второго массива в лист
            saveToRprtClmToSS(toRprtPosArray[1], errorsSheetNamesArr[sn_i - over_i], compareErrorsSheetArr, sourceSS);
            //}
        }
    }

    //здесь конец функции
}

function saveToRprtClmToSS(toRprtClmnPos, sheetName, array, sourceSS) {
    var errorsSheet = sourceSS.getSheetByName(sheetName);
    var rprtClmRng = errorsSheet.getRange(1, toRprtClmnPos + 1, array.length ,1);
    var ch1 = rprtClmRng.getA1Notation();

    var clmnArr = [];
    var i = 0;
    for each (var memb in array) {
        clmnArr[i] = [];
        clmnArr[i][0] = memb[toRprtClmnPos];
        i++;
    }
    ch1 = ch1
    rprtClmRng.setValues(clmnArr);

}

function compareRprtArrays(firstErrorsSheetArr,compareErrorsSheetArr ) {
    var firstSheetToRprtPos = 0;
    var firstSheetWeeksPos = 0;
    for (var i = 0; i <= (firstErrorsSheetArr[0].length -1); i++) {
        if (firstErrorsSheetArr[1][i].indexOf("To report", 0) != -1) {
            firstSheetToRprtPos = i;
        }
        if (firstErrorsSheetArr[1][i].indexOf("Week #", 0) != -1) {
            firstSheetWeeksPos = i;
        }
    }

    var compareSheetToRprtPos = 0; //define To report column pos.
    for (var i = 0; i <= (compareErrorsSheetArr[0].length -1); i++) {
        if (compareErrorsSheetArr[1][i].indexOf("To report", 0) != -1) {
            compareSheetToRprtPos = i;
        }
    }

    for (var line_i = 0; line_i <= firstErrorsSheetArr.length - 1; line_i++) {   //пройдемся по первому массиву и рассмотрим все ссылки
        if((firstErrorsSheetArr[line_i][0].indexOf("ttp", 0) != -1) && (firstErrorsSheetArr[line_i][firstSheetToRprtPos] == 1 | firstErrorsSheetArr[line_i][firstSheetWeeksPos] > 0) ) { //если это линк и его надо репортировать

            for (var i = 0; i <= compareErrorsSheetArr.length - 1; i++) {  //найдем этот линк во втором массиве
                if((compareErrorsSheetArr[i][0].indexOf("ttp", 0) != -1) && (compareErrorsSheetArr[i][0] == firstErrorsSheetArr[line_i][0])) {
                    var flag = true;
                    compareErrorsSheetArr[i][compareSheetToRprtPos] = 1;
                }
            }
        }
    }

    var toRprtPosArray = [firstSheetToRprtPos, compareSheetToRprtPos]

    return toRprtPosArray;
}


function updateActualDataOfperiodtechnSEORprtArr(periodtechnSEORprtArr, technSEORprtArr, periodtimeEstimArr,timeEstimArr) {
//this function takes actual XV data from complete SEO rpt table and add to the lines of periodSEO techn rprt

    for (var p_i = 0; p_i <= periodtechnSEORprtArr.length - 1; p_i++) {
        var t_i = 0;
        for each (var tSEOline in  technSEORprtArr) {
            if (periodtechnSEORprtArr[p_i][0] == tSEOline[0]) {
                periodtechnSEORprtArr[p_i] = [];
                periodtechnSEORprtArr[p_i] = tSEOline;

                periodtimeEstimArr[p_i] = [];
                periodtimeEstimArr[p_i] = timeEstimArr[t_i];
            }
            t_i++;
        }
    }
}

function estimationSumTimeTableToSS (timeEstimSumArr, reportSheetName, technSEORprtLength, reportSS_ID) {
    var reportSs = SpreadsheetApp.openById(reportSS_ID);
    //var reportSs = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = reportSs.getSheetByName(reportSheetName);

    var myRangeValsArr = sheet.getRange(1, 2, sheet.getLastRow() ,1).getValues();

    var posNum = 0;

    for (var i = 0; i <= myRangeValsArr.length -1; i++)
        if (myRangeValsArr[i].indexOf("Technical SEO Report") != -1){
            posNum = i;
            break;
        }

    var myRange = sheet.getRange(posNum + technSEORprtLength + 4, 2, 1, timeEstimSumArr[0].length);
    var ch1 = myRange.getA1Notation();

    myRange.setValues(timeEstimSumArr);
    myRange.setNumberFormat('0.00');
    sheet.getRange(posNum + technSEORprtLength + 4, 2, 1, timeEstimSumArr[0].length-1).setBorder(true, true, true, true, true, true, "black", SpreadsheetApp.BorderStyle.SOLID);

    sheet.getRange(posNum + technSEORprtLength + 4, 2, 1, 1).setValue("Techn SEO Time Estimation (Hrs):");
    //sheet.getRange(posNum + technSEORprtLength + 4, 2 + timeEstimSumArr[0].length-1, 1, 1).setValue("");
    sheet.getRange(posNum + technSEORprtLength + 5, 2 + timeEstimSumArr[0].length-1, 1, 1).setValue("Total Sum");
    sheet.getRange(posNum + technSEORprtLength + 4, 2 + timeEstimSumArr[0].length-1, 2, 1).setFontWeight("bold");

}

function updateTimeEstimateArrAndSum(periodtimeEstimArr) {
    for (ri = 0; ri <= periodtimeEstimArr.length - 1; ri++) { //apply *combination rule to the estimation array
        if(periodtimeEstimArr[ri][2] > 0) {  //pagina title work
            periodtimeEstimArr[ri][3] = 0;
            periodtimeEstimArr[ri][4] = 0;
        } else if (periodtimeEstimArr[ri][2] == 0) {
            if (periodtimeEstimArr[ri][3] > 0) {
                periodtimeEstimArr[ri][4] = 0;
            } else if (periodtimeEstimArr[ri][3] == 0) {
                periodtimeEstimArr[ri][4] = 0;
            }
        }

        if(periodtimeEstimArr[ri][6] > 0) { //meta description work
            periodtimeEstimArr[ri][7] = 0;
            periodtimeEstimArr[ri][8] = 0;
        } else if (periodtimeEstimArr[ri][6] == 0) {
            if (periodtimeEstimArr[ri][7] > 0) {
                periodtimeEstimArr[ri][8] = 0;
            } else if (periodtimeEstimArr[ri][7] == 0) {
                periodtimeEstimArr[ri][8] = 0;
            }
        }
    }

    //create summ arr
    var timeEstimSumArr = [];
    timeEstimSumArr[0] = [];
    for each (var line in periodtimeEstimArr) {      //rows
        for (var si = 1; si <= line.length; si++) {    //columns
            if (timeEstimSumArr[0][si] != null) {
                timeEstimSumArr[0][si] = timeEstimSumArr[0][si] + line[si];
            } else {
                timeEstimSumArr[0][si] = 0 + line[si];
            }
        }
    }
//   timeEstimSumArr = timeEstimSumArr;
    //create sum of sums
    var ssum = 0;
    for (var ssi = 1; ssi < timeEstimSumArr[0].length -1; ssi++) {
        ssum = ssum + timeEstimSumArr[0][ssi];
    }
    timeEstimSumArr[0][timeEstimSumArr[0].length -1] = ssum;

    timeEstimSumArr = timeEstimSumArr;
    return timeEstimSumArr;
}

function testTimeTableToSS(periodtimeEstimArr, reportSheetName, reportSS_ID) {
    var reportSs = SpreadsheetApp.openById(reportSS_ID);
    //var reportSs = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = reportSs.getSheetByName(reportSheetName);

    var myRange = sheet.getRange(65, 17, periodtimeEstimArr.length, periodtimeEstimArr[0].length);
    myRange.setValues(periodtimeEstimArr);
}

function proceedSEOTechnRprtArrToSS(technSEORprtArr, technSEOColoringArr, reportSheetName, reportSS_ID){
    var reportSs = SpreadsheetApp.openById(reportSS_ID);
    //var reportSs = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = reportSs.getSheetByName(reportSheetName);

    var weeksRangeSS = sheet.getRange("C2:D2").getValues();

    //get AREA: On Page SEO row num in 2nd column
    var checkFrase = "Technical SEO Report";
    var myCheckClmnArr = sheet.getRange(1, 2, sheet.getLastRow()).getValues();

    var m_i = 0;
    for each (var memb_i in myCheckClmnArr) {
        if(memb_i[0].toString().indexOf(checkFrase, 0) != -1) {
            break;
        }
        m_i++;
    }
    var checkRow = m_i + 3;


    sheet.insertRowsAfter(checkRow, technSEORprtArr.length);
    // var l = technSEORprtArr.length;
    var maxArrLength = getArrMaxLength(technSEORprtArr);

    var myRange = sheet.getRange(checkRow, 2, technSEORprtArr.length, maxArrLength);
    var cc = myRange.getA1Notation();


    myRange.setValues(technSEORprtArr);

    var updArr = myRange.getValues();
    for (var ui = 0; ui <= updArr.length -1; ui++) {
        for (var uj = 0; uj <= updArr[ui].length -1; uj++) {
            if( updArr[ui][uj] == "NOT_FOUND") {
                updArr[ui][uj] = " ";
            }
        }
    }

    myRange.setValues(updArr);
    myRange.setBorder(true, true, true, true, true, true, "black", SpreadsheetApp.BorderStyle.SOLID);
    try {
      myRange.setFontColors(technSEOColoringArr);
    } catch (err) {
      Logger.log(err);
    }



    var myTechnSEOStyleRange = sheet.getRange(checkRow, 3, technSEORprtArr.length, maxArrLength -1);
    myTechnSEOStyleRange.setHorizontalAlignment("center");
    myTechnSEOStyleRange.setFontWeight("bold");

}

function getTechnSEORprtArr( sourceSS, sheetName, technSEORprtArr, weeksRange, pageSeqNum, technSEOColoringArr, flagCompleteTbl, timeRulesArr, timeEstimArr) {

    var errorsSheet = sourceSS.getSheetByName(sheetName);
    var errorsActualDataRange = errorsSheet.getRange(1,1, errorsSheet.getLastRow(), errorsSheet.getLastColumn()); // errorsSheet.getLastColumn());
    //var ch1 = errorsActualDataRange.getA1Notation();
    var controlArr = errorsActualDataRange.getValues();

    //get index num of week# column
    var ToRprtPos = 0;
    var weekPos = 0;
    var donePos = 0;
    for (var i = 0; i <= (controlArr[0].length -1); i++) {
        if (controlArr[1][i].indexOf("To report", 0) != -1) {
            ToRprtPos = i;
        }
        if (controlArr[1][i].indexOf("Week", 0) != -1) {
            weekPos = i;
        }
        if (controlArr[1][i].indexOf("Done", 0) != -1) {
            donePos = i;
        }
    }

    if (technSEORprtArr.length ==0) {
        technSEORprtArr.push([]);
        technSEOColoringArr.push([]);
    }

    for (var t_i = 0; t_i<= technSEORprtArr.length - 1; t_i++) {
        technSEORprtArr[t_i].push(" ");
        technSEOColoringArr[t_i].push("black");
    }

    var i1 = 0;

    for (var line_i = 0; line_i <= controlArr.length - 1; line_i++) {

        //  if((controlArr[line_i][0].indexOf("ttp", 0) != -1) && (controlArr[line_i][weekPos]>=weeksRange[0] & controlArr[line_i][weekPos]<=(weeksRange[1]+2))) {


       // if((flagCompleteTbl && (controlArr[line_i][0].indexOf("ttp", 0) != -1) && (controlArr[line_i][ToRprtPos] == 1)) | ((flagCompleteTbl == false) && (controlArr[line_i][0].indexOf("ttp", 0) != -1) && (controlArr[line_i][weekPos]>=weeksRange[0] && controlArr[line_i][weekPos]<=weeksRange[1] ))) { //если это линк и его надо репортировать
        if((flagCompleteTbl && (controlArr[line_i][0].indexOf("ttp", 0) != -1) && (controlArr[line_i][ToRprtPos] == 1)) | ((flagCompleteTbl == false) && (controlArr[line_i][0].indexOf("ttp", 0) != -1))) { //если это линк и его надо репортировать
            if(controlArr[line_i][0].indexOf("http://www.sywebs.nl/?team=mir-johnson", 0) != -1) {
                var f = 0;
            }

            var mark = "";
            if (controlArr[line_i][donePos] == 1) {
                mark = "V";
            } else {
                mark = "X";
            }

            var markColor = defineTechnSEOColors(mark, controlArr[line_i], technSEOColoringArr, weeksRange, weekPos)

            var flag = false;
            var arrPos = 0;
            for (var ts_i = 0; ts_i<= technSEORprtArr.length - 1; ts_i++) {
                if(technSEORprtArr[ts_i][0] == controlArr[line_i][0]) {   //если линки совпали то запомним этот индекс массива
                    flag = true;
                    arrPos = ts_i;
                    break;
                }
            }
            //here
            var flagProceed = false;
            if (technSEORprtArr.length == 1 & technSEORprtArr[0][0] == " ") {
                technSEORprtArr[technSEORprtArr.length - 1][0] = controlArr[line_i][0]; //url
                technSEORprtArr[technSEORprtArr.length - 1][1] = mark;
                technSEOColoringArr[technSEORprtArr.length - 1][1] = markColor;
                flagProceed = true;
            }


            if (flag) {
                technSEORprtArr[arrPos][technSEORprtArr[arrPos].length - 1] = mark
                technSEOColoringArr[arrPos][technSEORprtArr[arrPos].length - 1] = markColor;
            } else if (!flagProceed){
                technSEORprtArr.push([]);
                technSEOColoringArr.push([]);
                //var temp = controlArr[line_i][0]; //url

                technSEORprtArr[technSEORprtArr.length - 1][0] = controlArr[line_i][0]; //url
                technSEORprtArr[technSEORprtArr.length - 1][technSEORprtArr[0].length -1] = mark;
                technSEOColoringArr[technSEORprtArr.length - 1][technSEORprtArr[0].length -1] = markColor;
            }

            //technSEOColoringArr = technSEOColoringArr;

            //!!!надо тут пушить массив на количество ссылок или просто уравнивать его с technSEORprtArr массивом
            if(timeEstimArr.length < technSEORprtArr.length ) {
                timeEstimArr.push([]);
                var ch1 = timeEstimArr.length;
            }

        }     //end if
    }


    if (flagCompleteTbl) { //do it as a first step for whole SEO ( complete table)

        //
        //  for (var t_i = 0; t_i<= technSEORprtArr.length - 1; t_i++) {  //проверим есть ли незаполненные элементы массива и заменим их на Х (это актуально для "новой" таблицы технического СЕО отчета)
        //    for (var t_j = 0; t_j <= technSEORprtArr[t_i].length - 1; t_j++) {
        //      if ((technSEORprtArr[t_i][t_j] == " ") || (technSEORprtArr[t_i][t_j] == null)) {
        //        technSEORprtArr[t_i][t_j] = "X";
        //      }
        //    }
        //  }

        //proceed with time estimation arr:
        var timeVal = proceedTimeRules (sheetName, timeRulesArr) / 60;

        for (var tm_j = 0; tm_j <= technSEORprtArr.length - 1; tm_j++) {
            if (technSEORprtArr[tm_j][pageSeqNum] == "X"){  //time array filling
                timeEstimArr[tm_j][pageSeqNum] = timeVal;
            } else {
              try {
                timeEstimArr[tm_j][pageSeqNum] = 0; }
                catch (err) {
                    Logger.log("err");
                }
            }
        }

    }

    technSEORprtArr = technSEORprtArr;
    return technSEORprtArr;
}

function defineTechnSEOColors(mark, myLine, technSEOColoringArr, weekRange, weekPos){


    if (mark == "V") {
        if(typeof(myLine[weekPos]) == "number") {//если число
            if(myLine[weekPos] >= weekRange[0] && myLine[weekPos] <= weekRange[1]) {  //если в репортируемый период
                return "Blue";
            } else {
                if (myLine[weekPos] >= weekRange[0] -4) {
                    return "Red";
                } else {
                    return "Green";   //сделано за пределами -4 недели
                }
            }
        } else { //если не число - значит не известно кто и когда сделал
            return "Green";
        }
    } else if (mark == "X"){  //if X
        if(myLine[weekPos] > weekRange[1])
            return "Orange";
    }


    mark = mark;
    return "black";
}



function proceedSEOonPageArrToSS(onPageSEORprtArr, reportSheetName) {
    var reportSs = SpreadsheetApp.openById(reportSS_ID);
    //var reportSs = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = reportSs.getSheetByName(reportSheetName);

    var weeksRangeSS = sheet.getRange("C2:D2").getValues();

    //get AREA: On Page SEO row num in 2nd column
    var checkFrase = "On Page SEO";
    var myCheckClmnArr = sheet.getRange(1, 2, sheet.getLastRow(), 1).getValues();

    var m_i = 0;
    for each (var memb_i in myCheckClmnArr) {
        if(memb_i[0].toString().indexOf(checkFrase, 0) != -1) {
            break;
        }
        m_i++;
    }
    var checkRow = m_i + 5;

    var mySEOonPageRange = sheet.getRange(checkRow, 2, onPageSEORprtArr.length, onPageSEORprtArr[0].length);
    mySEOonPageRange.setValues(onPageSEORprtArr);

    //mySEOonPageRange.setFontWeight("bold");


    //   var myRange = sheet.getRange(row, column);
    //   myRange.setFontColors(colors);
    //   myRange.setFontWeights(fontWeights);
    var tempVal = 0;

    //proceed with coloring and borders
    var fontColorsArr = [];
    var fontWeightsArr = [];
    var ci = 0;
    for each (var line in onPageSEORprtArr) {
        fontColorsArr[ci] = ["", "black", "grey"];

        //tempVal = line[2];
//       var cf = typeof(tempVal);// == "undefined"// isNaN(tempVal);

        if (line[1] == "V") {
            if (typeof(line[2]) == "number") { //если число
                if(line[2] >= weeksRangeSS[0][0] && line[2] <= weeksRangeSS[0][1]) {  //если в репортируемый период
                    fontColorsArr[ci][1] = "Blue"
                } else {
                    if (line[2] >= weeksRangeSS[0][0] -4)
                        fontColorsArr[ci][1] = "Red"
                }
            } else {  //если не число - значит не известно кто и когда сделал
                fontColorsArr[ci][1] = "Green"
            }
        } else {
            if(line[2] > weeksRangeSS[0][1])
                fontColorsArr[ci][1] = "Orange";
        }

        line = line;
        ci++;
    }

    var mySEOonPageColoringRange = sheet.getRange(checkRow, 2, onPageSEORprtArr.length, 3);
    mySEOonPageColoringRange.setFontColors(fontColorsArr);

    var mySEOonPageStyleRange = sheet.getRange(checkRow, 3, onPageSEORprtArr.length, 1);
    mySEOonPageStyleRange.setHorizontalAlignment("center");
    mySEOonPageStyleRange.setFontWeight("bold");

    var mySEOonPageBorderRange = sheet.getRange(checkRow, 2, onPageSEORprtArr.length, 2);
    mySEOonPageBorderRange.setBorder(true, true, true, true, true, true, "black", SpreadsheetApp.BorderStyle.SOLID);

    mySEOonPageRange = mySEOonPageRange;

}

function getOnPageArrData (sourceSS, sheetName, onPageSEORprtArr) {
    var errorsSheet = sourceSS.getSheetByName(sheetName);
    var errorsActualDataRange = errorsSheet.getRange(1,1, errorsSheet.getLastRow(), errorsSheet.getLastColumn()); // errorsSheet.getLastColumn());
    //var ch1 = errorsActualDataRange.getA1Notation();
    var controlArr = errorsActualDataRange.getValues();

    //get index num of To Report column
    var ToRprtPos = 0;
    var weekPos = 0;
    for (var i = 0; i <= (controlArr[0].length -1); i++) {
        if (controlArr[1][i].indexOf("To report", 0) != -1) {
            ToRprtPos = i;
        }
        if (controlArr[1][i].indexOf("Week", 0) != -1) {
            weekPos = i;
        }
    }

    var ops_i = 0;
    for (var line_i = 0; line_i <= controlArr.length - 1; line_i++) {
        if((controlArr[line_i][0].indexOf("ttp", 0) != -1) && (controlArr[line_i][ToRprtPos] == 1)) {
            onPageSEORprtArr[ops_i] = [];
            onPageSEORprtArr[ops_i][0] = controlArr[line_i][0]; //page
            if (controlArr[line_i][1] >= 500){
                onPageSEORprtArr[ops_i][1] = "V"
            } else {
                onPageSEORprtArr[ops_i][1] = "X"
            }
            onPageSEORprtArr[ops_i][2] = controlArr[line_i][weekPos];
            //onPageSEORprtArr[ops_i][1] = controlArr[line_i][1];  //number of words
            ops_i++;
        }
    }
    //onPageSEORprtArr = onPageSEORprtArr;
    return onPageSEORprtArr;
}

function getOnPageArrDataBasedOnWeeksHours (sourceSS, sheetName, onPageSEORprtArr, weekRange) {
    var errorsSheet = sourceSS.getSheetByName(sheetName);
    var errorsActualDataRange = errorsSheet.getRange(1,1, errorsSheet.getLastRow(), errorsSheet.getLastColumn()); // errorsSheet.getLastColumn());
    //var ch1 = errorsActualDataRange.getA1Notation();
    var controlArr = errorsActualDataRange.getValues();

    //get index num of To Report column
    // var hrsPos = 0;
    var weekPos = 0;
    for (var i = 0; i <= (controlArr[0].length -1); i++) {
        //  if (controlArr[1][i].indexOf("Hrs", 0) != -1) {
        //    hrsPos = i;
        //  }
        if (controlArr[1][i].indexOf("Week", 0) != -1) {
            weekPos = i;
        }
    }

    var ops_i = 0;
    for (var line_i = 0; line_i <= controlArr.length - 1; line_i++) {

        //(myLine[weekPos] >= weekRange[0] && myLine[weekPos] <= weekRange[1]) {  //если в репортируемый период
        // if((controlArr[line_i][0].indexOf("ttp", 0) != -1) && (controlArr[line_i][hrsPos] > 0) && (controlArr[line_i][weekPos] >= weekRange[0] && controlArr[line_i][weekPos] <= weekRange[1])) {
        if((controlArr[line_i][0].indexOf("ttp", 0) != -1) && (controlArr[line_i][weekPos] >= weekRange[0] && controlArr[line_i][weekPos] <= weekRange[1])) {
            onPageSEORprtArr[ops_i] = [];
            onPageSEORprtArr[ops_i][0] = controlArr[line_i][0]; //page
            if (controlArr[line_i][1] >= 500){
                onPageSEORprtArr[ops_i][1] = "V"
            } else {
                onPageSEORprtArr[ops_i][1] = "X"
            }
            onPageSEORprtArr[ops_i][2] = controlArr[line_i][weekPos];
            //onPageSEORprtArr[ops_i][1] = controlArr[line_i][1];  //number of words
            ops_i++;
        }
    }

    onPageSEORprtArr = onPageSEORprtArr;
    return onPageSEORprtArr;
}


function getTimeAgendaArr(sourceSS, sheetName, timeAgendaArr, weeksRange, pageSeqNum, timeRulesArr, paginaDuplicatesServiceArr, metabeschrijvingDuplicatesServiceArr) {

    var combFlagTrigger = false;
    if (sheetName.indexOf("Pagina_titel_Over_65_characters", 0) != -1 || sheetName.indexOf("Pagina_titel_Below_30_characters", 0) != -1 || sheetName.indexOf("Meta_beschrijving_Over_155_Characters", 0) != -1 || sheetName.indexOf("Meta_beschrijving_Below_70_characters", 0) != -1) {
        combFlagTrigger = true;
    }

    var timeVal = proceedTimeRules (sheetName, timeRulesArr) / 60;

    var errorsSheet = sourceSS.getSheetByName(sheetName);
    var errorsActualDataRange = errorsSheet.getRange(1,1, errorsSheet.getLastRow(), errorsSheet.getLastColumn()); // errorsSheet.getLastColumn());
    //var ch1 = errorsActualDataRange.getA1Notation();
    var controlArr = errorsActualDataRange.getValues();

    //get index num of week# column
    var weekPos = 0;
    for (var week_i = 0; week_i <= (controlArr[0].length -1); week_i++) {
        if (controlArr[1][week_i].indexOf("Week", 0) != -1) {
            //var c = 0;
            //done_i = done_i;
            weekPos = week_i;
            break;
        }
    }
    //var timeAgendaArr = [];

    for (var ag_i = 0; ag_i<= timeAgendaArr.length - 1; ag_i++) {
        timeAgendaArr[ag_i].push(" ");
    }

    var i1 = 0;

    for (var line_i = 0; line_i <= controlArr.length - 1; line_i++) {

        if((controlArr[line_i][0].indexOf("ttp", 0) != -1) && (controlArr[line_i][weekPos]>=weeksRange[0] & controlArr[line_i][weekPos]<=(weeksRange[1]+2))) {
            //var flag = false;

            //запишем время согласно правилам времени
            controlArr[line_i][weekPos +1] = timeVal;

            if (combFlagTrigger && sheetName.indexOf("Pagina", 0) != -1) { //если флаг есть то проверим есть ли этот линк в списке дупликейшн
                for each (var duplLine in paginaDuplicatesServiceArr) {
                    if (duplLine[0] == controlArr[line_i][0]) {
                        controlArr[line_i][weekPos +1] = 0;
                    }
                }
            }

            if (combFlagTrigger && sheetName.indexOf("Meta_beschrijving", 0) != -1) { //если флаг есть то проверим есть ли этот линк в списке дупликейшн
                for each (var duplLine1 in metabeschrijvingDuplicatesServiceArr) {
                    if (duplLine1[0] == controlArr[line_i][0]) {
                        controlArr[line_i][weekPos +1] = 0;
                    }
                }
            }



            // if (sheetName.indexOf("Duplicate", 0) != -1) {
            //   duplicatesServiceArr.push(controlArr[line_i]);
            //  }


            for (var ag_i = 0; ag_i<= timeAgendaArr.length - 1; ag_i++) {
                if(timeAgendaArr[ag_i][0] == controlArr[line_i][weekPos]) {
                    //flag = true;

                    if (timeAgendaArr[ag_i][timeAgendaArr[ag_i].length - 1] == " " || timeAgendaArr[ag_i][timeAgendaArr[ag_i].length - 1] == "") {  //признак необходимости накопления суммы
                        timeAgendaArr[ag_i][timeAgendaArr[ag_i].length - 1] = controlArr[line_i][weekPos +1];
                    } else {
                        timeAgendaArr[ag_i][timeAgendaArr[ag_i].length - 1] = timeAgendaArr[ag_i][timeAgendaArr[ag_i].length - 1] + controlArr[line_i][weekPos +1]; //накопление суммы
                    }


                    break;
                }
            }
        }
    }
    //timeAgendaArr = timeAgendaArr;
    return timeAgendaArr;
}

function getTimeSheetArr(sourceSS, sheetName, timeSheetArr, weeksRange, pageSeqNum, timeRulesArr, paginaDuplicatesServiceArr, metabeschrijvingDuplicatesServiceArr) {

    var combFlagTrigger = false;
    if (sheetName.indexOf("Pagina_titel_Over_65_characters", 0) != -1 || sheetName.indexOf("Pagina_titel_Below_30_characters", 0) != -1 || sheetName.indexOf("Meta_beschrijving_Over_155_Characters", 0) != -1 || sheetName.indexOf("Meta_beschrijving_Below_70_characters", 0) != -1) {
        combFlagTrigger = true;
    }

    var timeVal = proceedTimeRules (sheetName, timeRulesArr) / 60;

    var errorsSheet = sourceSS.getSheetByName(sheetName);
    var errorsActualDataRange = errorsSheet.getRange(1,1, errorsSheet.getLastRow(), errorsSheet.getLastColumn()); // errorsSheet.getLastColumn());
    var ch1 = errorsActualDataRange.getA1Notation();

    //var pageSeqNum = 0;
    // if (timeSheetArr[0] == null) {
    //  pageSeqNum = 1;
    //} else {
    //  var pageSeqNum = timeSheetArr[0].length;
    // }


    var controlArr = errorsActualDataRange.getValues();

    //get index num of week# column
    var weekPos = 0;
    for (var week_i = 0; week_i <= (controlArr[0].length -1); week_i++) {
        if (controlArr[1][week_i].indexOf("Week", 0) != -1) {
            //var c = 0;
            //done_i = done_i;
            weekPos = week_i;
            break;
        }
    }
    weekPos = weekPos;

    //proceed with timesheet data search process
    var i1 = 0;

    for (var line_i = 0; line_i <= controlArr.length - 1; line_i++) {

        if((controlArr[line_i][0].indexOf("ttp", 0) != -1) && (controlArr[line_i][weekPos]>=weeksRange[0] & controlArr[line_i][weekPos]<=weeksRange[1])){

            //запишем время согласно правилам времени fff
            controlArr[line_i][weekPos +1] = timeVal;

            //для комбинации работ по звездочке в правилах создадим массив с данными которые будут дублироваться
            if (sheetName.indexOf("Duplicate", 0) != -1 && sheetName.indexOf("Pagina", 0) != -1) {
                paginaDuplicatesServiceArr.push(controlArr[line_i]);
            } else if(sheetName.indexOf("Duplicate", 0) != -1 && sheetName.indexOf("Meta_beschrijving", 0) != -1) {
                metabeschrijvingDuplicatesServiceArr.push(controlArr[line_i]);
            }

            if (combFlagTrigger && sheetName.indexOf("Pagina", 0) != -1) { //если флаг есть то проверим есть ли этот линк в списке дупликейшн
                for each (var duplLine in paginaDuplicatesServiceArr) {
                    if (duplLine[0] == controlArr[line_i][0]) {
                        controlArr[line_i][weekPos +1] = 0;
                    }
                }
            }

            if (combFlagTrigger && sheetName.indexOf("Meta_beschrijving", 0) != -1) { //если флаг есть то проверим есть ли этот линк в списке дупликейшн
                for each (var duplLine1 in metabeschrijvingDuplicatesServiceArr) {
                    if (duplLine1[0] == controlArr[line_i][0]) {
                        controlArr[line_i][weekPos +1] = 0;
                    }
                }
            }


            //check if such link is in array already
            var flag = false;
            for (var i2 = 0; i2 <= timeSheetArr.length-1; i2++) {
                if (timeSheetArr[i2].indexOf(controlArr[line_i][0], 0) != -1) {
                    flag = true;
                    i1 = i2;
                    break;
                }
            }

            if(!flag) { //if such link is not in array
                timeSheetArr.push([]);
                //timeSheetArr[timeSheetArr.length - 1].push(line[0],line[weekPos +1]);//, line[weekPos] );
                timeSheetArr[timeSheetArr.length - 1][0] = controlArr[line_i][0];
                timeSheetArr[timeSheetArr.length - 1][pageSeqNum] = controlArr[line_i][weekPos +1];
                //add empty cells
                for (var ch = pageSeqNum - 1; ch > 0; ch--) {
                    timeSheetArr[timeSheetArr.length - 1][ch] = " ";
                }
                i1++;
            } else { //if such link is in array already
                // timeSheetArr[i1] = [];
                //timeSheetArr[i1] = line[0];   //URI
                //timeSheetArr[i1].push(line[weekPos +1]); //hrs
                timeSheetArr[i1][0] = controlArr[line_i][0];
                //timeSheetArr[i1].push(line[weekPos]);    //weeks num
                timeSheetArr[i1][pageSeqNum] = controlArr[line_i][weekPos +1];
            }
        }
    }
    var c = 0;

    var maxArrLength = getArrMaxLength(timeSheetArr);
    var minArrLength = getArrMinLength(timeSheetArr);

    //var lastElemLength = timeSheetArr[timeSheetArr.length - 1].length;
    //if (maxArrLength != timeSheetArr[0].length) { //add "" to absent members
    while(maxArrLength != minArrLength){ //if (maxArrLength != minArrLength) { //add "" to absent members
        for (var m_i = 0; m_i <= timeSheetArr.length -1; m_i++) {
            var c1 = timeSheetArr[m_i].length;
            if (timeSheetArr[m_i].length < maxArrLength ) {
                timeSheetArr[m_i][timeSheetArr[m_i].length] = " ";
            }
        }
        maxArrLength = getArrMaxLength(timeSheetArr);
        minArrLength = getArrMinLength(timeSheetArr);
    }

    maxArrLength = getArrMaxLength(timeSheetArr);
    minArrLength = getArrMinLength(timeSheetArr);
    minArrLength = minArrLength;

    return timeSheetArr;
}

function getArrMaxLength(myArray) {
    var mxLength = 0;
    for each (var line in myArray) {
        mxLength = line.length > mxLength ? line.length: mxLength;
    }
    return mxLength;
}

function getArrMinLength(myArray) {
    var mnLength = 1000000;
    for each (var line in myArray) {
        mnLength = line.length < mnLength ? line.length: mnLength;
    }
    return mnLength;
}

function proceedСomparison(sourceSS, sheetNameToCompare,  allLinksArr) {
    //получим данные со страницы отчета с категорией/ошибкой
    //var sheetNameToCompare = "page_titles_duplicate"; //TODO: go to list/array of errors tab names
    var errorsSheet = sourceSS.getSheetByName(sheetNameToCompare);
    var errorsActualDataRange = errorsSheet.getRange(1,1, errorsSheet.getLastRow(), 1); // errorsSheet.getLastColumn());
    var ch1 = errorsActualDataRange.getA1Notation();

    var errorsActualDataArr = errorsActualDataRange.getValues();

    var linksFreeFromErrorsArr = [];
    var e_i = 0;

    //вставим выполненные ошибки на страницу сверху, доработав массив.
    //определим в какой колонке должен стоять знак сделано
    var chRange = errorsSheet.getRange(2, 1, 1, errorsSheet.getLastColumn())
    var mch = chRange.getA1Notation();
    var controlArr = chRange.getValues();
    var donePos = 0;

    for (var done_i = 0; done_i <= (controlArr[0].length -1); done_i++) {
        if (controlArr[0][done_i].indexOf("Done", 0) != -1) {
            //var c = 0;
            //done_i = done_i;
            donePos = done_i;
            break;
        }
    }

    //пройдемся по циклу всех ссылок и заодно добавим пункт сделано = 1 - там где наайдем
    for each(var member in allLinksArr) {
        if (member[0].indexOf("http", 0) != -1) {
            var flag = false;

            for each (var errorMember in errorsActualDataArr) { //пройдемся по массиву отчета с ошибками и вдруг есть совпадающая ссылка (если есть то ничего не надо делать, если нет, то добавляем искомую ссылку в массив - выполненных)
                if (member[0] == errorMember[0]) {
                    flag = true;
                    break;
                }
            }
            //если не найдено совпадений, значит линк - выполнен и добавим его в новый массив.
            if (!flag) {
                linksFreeFromErrorsArr[e_i] = [];
                linksFreeFromErrorsArr[e_i][0] = member[0];
                linksFreeFromErrorsArr[e_i][donePos] = "1";
                linksFreeFromErrorsArr[e_i][donePos + 1] = "auto generated";
                for (ci = 1; ci < donePos; ci++){
                    linksFreeFromErrorsArr[e_i][ci] = "";
                }
                e_i++;
            }
        }
    }

    try {
     errorsSheet.insertRowsBefore(3, linksFreeFromErrorsArr.length);
     var insertRange = errorsSheet.getRange(3, 1, linksFreeFromErrorsArr.length, linksFreeFromErrorsArr[0].length)
     var check = insertRange.getA1Notation();
     insertRange.setValues(linksFreeFromErrorsArr);

     return linksFreeFromErrorsArr;
    } catch (e) {
      return linksFreeFromErrorsArr;
    }

}


function treeFunction() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("allUrls");

    var dataRange = sheet.getRange(1,1, sheet.getLastRow(), 1);;//sheet.getLastColumn());
    var ch1 = dataRange.getA1Notation();

    var dataArr = dataRange.getValues();

    var catsArr = [];
    var j = 0;
    for each (var i in dataArr) {
        //Logger.log(i);
        //i = i;

        if (i[0].indexOf("http", 0) >=0) {

            if (i[0].slice(-1) =="\/") {
                var temp1 = i[0].slice(0, -1);
                var lastIndx = i[0].slice(0, -1).lastIndexOf("\/");
                if ((i[0].substring(0, lastIndx) != "http:/") && (i[0].substring(0, lastIndx).length > 8) && !(~catsArr.indexOf(i[0].substring(0, lastIndx)))) {
                    catsArr[j] = i[0].substring(0, lastIndx);
                    j++;
                }
            } else{
                var lastIndx = i[0].lastIndexOf("\/");
                if (!(~catsArr.indexOf(i[0].substring(0, lastIndx)))) {
                    catsArr[j] = i[0].substring(0, lastIndx);
                    j++;
                }
            }
        }
    } //end of loope

    var rangeArr = [];
    for (ij = 0; ij <= (catsArr.length -1); ij++) {
        rangeArr[ij] = [];
        rangeArr[ij][0] = catsArr[ij];
    }

    var sheetStp = ss.getSheetByName("setUp");
    var catsRng = sheetStp.getRange(2,1, catsArr.length, 1)
    var ch1 = catsRng.getA1Notation();
    catsRng.setValues(rangeArr);
}


function myFunction() {

    //var ss = SpreadsheetApp.getActiveSpreadsheet();
    //var sheet = ss.getSheetByName(sheetName);
    var reportSs = SpreadsheetApp.openById(reportSS_ID);
    //var reportSs = SpreadsheetApp.getActiveSpreadsheet();
    var SSID = reportSs.getSheetByName("ReportPages").getRange("F1").getValues();

    // var SSID = "1dN7MtmIuY2khTtTRK4w4FFro1210v4kQ0XNePnBItVc";
    var chekFlag = checkSourceSSConnection(SSID)

    var sourceSS = SpreadsheetApp.openById(SSID);

    //var mySheet = outerS.getActiveSheet();
    var PtOccurSheet = sourceSS.getSheetByName("page_titles_all");

    var initDataArr = getInitDataArr(PtOccurSheet);
    //PtOccurSheet.getMaxRows()

    //PtOccurSheet.getLastRow()

    //mySheet= mySheet;

    var myRange = PtOccurSheet.getRange("A1");
//  myRange.getA1Notation()
    var ch = myRange.getValue();

    ch = ch;

    //var outerS1 = SpreadsheetApp.openById("1NRnA2_hnesBqJrk_GMAW_sAg3AujB25wu_g0aChAqqo");

    //var mySheet1 = outerS1.getSheetByName("Sheet2");

    //mySheet= mySheet;

    //var myRange1 = mySheet1.getRange("A1:B3");
    //var ch1 = myRange1.getValues();
    //ch1 = ch1;

}

function checkSourceSSConnection(mySourceSSID) {
    try {
        var sourceSS = SpreadsheetApp.openById(mySourceSSID);
        if (sourceSS != null) {
            return true;
        }
    } catch (e) {
        return  false;
    }
}

function createRprtTmplt(){
    var rprtSS = SpreadsheetApp.openById(reportSS_ID);
    //var rprtSS = SpreadsheetApp.getActiveSpreadsheet();
    var rprtS = rprtSS.getActiveSheet();
}

function getInitDataArr(actualS) {

    var dataRange = actualS.getRange(1,1, actualS.getLastRow(), actualS.getLastColumn());
    var ch1 = dataRange.getA1Notation();

    var dataArr = dataRange.values();

    var crntWeek = Utilities.formatDate(new Date(), "GMT+1", "ww");

    //сравним строки в массиве по колонке недели с текущей и закинем в новый массив те строки которые подпадают под временной фильтр
    var reportTimeCoveringWeeks = 2; //can be 4
    var reportTechnCoveringWeeks = reportTimeCoveringWeeks * 3;

    var weekColumnIndex
    for (var i = 0; i <= dataArr; i++) {
        if (dataArr[1][i].indexOf("week") >=0){

        }
    }

    return dataRange.getValues();

}