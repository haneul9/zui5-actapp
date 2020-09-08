// Export an excel sheet from a table with JavaScript (in IE):
// Usage: CreateExcelSheet("myid");

function CreateExcelSheet( el ) {

  var x= document.getElementById( el ).rows;
  
  var xls = new ActiveXObject("Excel.Application");

  xls.visible = true;
  xls.Workbooks.Add
  for (i = 0; i < x.length; i++)
  {
  var y = x[i].cells;
  
  for (j = 0; j < y.length; j++)
  {
  xls.Cells( i+1, j+1).Value = y[j].innerText;
  }
  }
  xls.Visible = true;
  xls.UserControl = true;

  return xls;
}