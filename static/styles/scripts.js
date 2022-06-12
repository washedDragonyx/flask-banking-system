function show() {
  var tb_left = document.getElementById("tb-left");
  tb_left.classList.remove("hide");
}
function checkTipologiaTX(tx) {
  var input = document.getElementById("input-id").value;
  var receiver = tx.receiver;
  var ammontare = tx.amount;
  // ammontare < 0 e id uguale -> uscita (prelievo)
  // ammontare < 0 e id diverso -> uscita
  // ammontare > 0 e id diverso -> uscita
  console.log("my id: " + input + ", " + "destinatario: " + receiver);
  if (input != receiver) {
    return "trasferimento";
  }
  if (input == receiver && ammontare < 0) {
    return "uscita (prelievo)";
  }
  if (input == receiver && ammontare > 0) {
    return "entrata (versamento)";
  }
}
function populate(tx, input) {
  var table = document.getElementById("transactions-table");

  var rowNode = document.createElement("tr");
  var cellNode = document.createElement("td");
  var cellNode2 = document.createElement("td");

  console.log(tx);

  let x = 1;
  for (let i = tx.length - 1; i >= 0; i--) {
    console.log(tx[i]);

    var rowNode = document.createElement("tr");
    if (i == tx.length - 1) rowNode.classList.add("bold");
    var cellNode = document.createElement("td");
    var cellNode2 = document.createElement("td");

    temp = document.createTextNode("[ TX N°" + x + " ]");
    cellNode.appendChild(temp);
    rowNode.appendChild(cellNode);
    x++;

    var tipologia = document.createElement("div");
    temp = document.createTextNode("Tipologia: " + checkTipologiaTX(tx[i]));
    tipologia.appendChild(temp);
    cellNode2.appendChild(tipologia);
    rowNode.appendChild(cellNode2);

    var ammontare = document.createElement("div");
    temp = document.createTextNode("Ammontare: " + tx[i].amount);
    ammontare.appendChild(temp);
    cellNode2.appendChild(ammontare);
    rowNode.appendChild(cellNode2);

    if (tx[i].receiver != input) {
      var destinatario = document.createElement("div");
      temp = document.createTextNode("Destinatario: " + tx[i].receiver);
      destinatario.appendChild(temp);
      cellNode2.appendChild(destinatario);

      var mittente = document.createElement("div");
      if (tx[i].sender == input)
        temp = document.createTextNode("Mittente: " + tx[i].sender + " (Io)");
      else temp = document.createTextNode("Mittente: " + tx[i].sender);
      mittente.appendChild(temp);
      cellNode2.appendChild(mittente);
    }

    var id = document.createElement("div");
    temp = document.createTextNode("Id: " + tx[i].id);
    id.appendChild(temp);
    cellNode2.appendChild(id);

    var data = document.createElement("div");
    temp = document.createTextNode("Data: " + tx[i].timestamp);
    data.appendChild(temp);
    cellNode2.appendChild(data);

    console.log(rowNode);
    table.appendChild(rowNode);
  }
}
function httpGet(theurl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theurl, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}
function getInput() {
  if (checkLength("input-id", "error")) {
    show();
    reset();
    var input = document.getElementById("input-id").value;
    var url = "http://127.0.0.1:5000/api/account/" + input;
    var content = httpGet(url);

    var parsed = JSON.parse(content);

    console.log(parsed);

    var id = document.getElementById("acc-id");
    var balance = document.getElementById("acc-balance");
    var createdAt = document.getElementById("acc-createdAt");
    var name = document.getElementById("acc-name");
    var surname = document.getElementById("acc-surname");

    id.innerHTML = "";
    balance.innerHTML = "";
    createdAt.innerHTML = "";
    name.innerHTML = "";
    surname.innerHTML = "";

    var temp = document.createTextNode(parsed.AccountID);
    id.appendChild(temp);

    temp = document.createTextNode(parsed.Balance);
    balance.appendChild(temp);

    temp = document.createTextNode(parsed.CreatedAt);
    createdAt.appendChild(temp);

    temp = document.createTextNode(parsed.Name);
    name.appendChild(temp);

    temp = document.createTextNode(parsed.Surname);
    surname.appendChild(temp);

    populate(parsed.Transactions, input);
  } else {
  }
}
function reset() {
  var transactions_table = document.getElementById("transactions-table");
  transactions_table.innerHTML = "";
}
function setEnter() {
  var input = document.getElementById("input-id");
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("button").click();
    }
  });
}
function checkLength(input_id, error_id) {
  var input = document.getElementById(input_id);
  if (input.value.length != 20) {
    input.classList.add("border-red");
    showError("L'id inserito non è accettato (lunghezza 20 caratteri)", error_id);
    return false;
  } else {
    input.classList.remove("border-red");
    hideError(error_id);
    return true;
  }
}
function showError(error, error_id) {
  var err_box = document.getElementById(error_id);
  err_box.innerHTML = error;
  err_box.classList.remove("op0");
}
function hideError(error_id) {
  var err_box = document.getElementById(error_id);
  err_box.innerHTML = "-------------";
  err_box.classList.add("op0");
}
function getPageName() {
  var path = window.location.pathname;
  var page = path.split("/").pop()
  return page
}
if(getPageName() == "")
  setEnter();


