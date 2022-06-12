// Funzione per visualizzare le informazioni dell'utente
function show() {
  var tb_left = document.getElementById("tb-left");
  tb_left.classList.remove("hide");
}

// Funzione per nascondere le informazioni dell'utente (quando vuote)
function hide() {
  var tb_left = document.getElementById("tb-left");
  tb_left.classList.add("hide");
}

// Funzione chiamata da populate() per distinguere la transazione
// da un trasferimento, prelievo o versamento
function checkTipologiaTX(tx) {
  var input = document.getElementById("input-id").value;
  var receiver = tx.receiver;
  var ammontare = tx.amount;

  console.log("my id: " + input + ", " + "destinatario: " + receiver);
  if (receiver == "Withdrawal")
  {
    return "uscita (prelievo)"
  }
  if (input != receiver) {
    return "trasferimento";
  }
  if (input == receiver && ammontare > 0) {
    return "entrata (versamento)";
  }
}

// Funzione che, dato un array di transazioni e l'ID inserito dall'utente, inserisce
// ogni transazione nella propria riga di tabella, omettendo il mittente e destinatario 
// quando l'ID inserito e l'ID della transazione sono uguali
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
    temp = document.createTextNode("Ammontare: " + Math.abs(tx[i].amount));
    ammontare.appendChild(temp);
    cellNode2.appendChild(ammontare);
    rowNode.appendChild(cellNode2);

    if (tx[i].receiver != input) {
      if(!tx[i].receiver == "Withdrawal") {
        var destinatario = document.createElement("div");
        temp = document.createTextNode("Destinatario: " + tx[i].receiver);
        destinatario.appendChild(temp);
        cellNode2.appendChild(destinatario);
      }
      var mittente = document.createElement("div");
      temp = document.createTextNode("Mittente: " + tx[i].sender);
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

// Funzione che permette di recuperare dati da un sito dato l'URL
function httpGet(url) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

// Funzione che invia un array di tre dati (mittente, destinatario, ammontare) ad un url
function httpPost(url, arr) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", url, true);
  xmlHttp.setRequestHeader('Content-Type', 'application/json');
  xmlHttp.send(JSON.stringify({
    from: arr[0],
    to: arr[1],
    amount: arr[2]
  }));
  return xmlHttp.responseText;
}

// Chiamato dal pulsante "Cerca", utilizza l'ID inserito per ottenere tutti i dati del
// rispettivo account e inserirli opportunamente nella pagina visibile all'utente
function getInput() {
  if (checkLength("input-id", "error")) {
    reset();
    var input = document.getElementById("input-id").value;
    var url = "http://127.0.0.1:5000/api/account/" + input;
    var content = httpGet(url);

    var parsed = JSON.parse(content);

    console.log(parsed);

    if (parsed.Status == "Success") {
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
      show();
    }
    else if (parsed.Status == "Failure") {
      hide();
      showError(
        "L'account inserito non esiste",
        "error"
      );
    }
  }
}

// Elimina tutti gli elementi nella tabella delle transazioni
function reset() {
  var transactions_table = document.getElementById("transactions-table");
  transactions_table.innerHTML = "";
}

// Permette all'utente di avviare la ricerca dell'account premendo il tasto "Invio"
function setEnter() {
  var input = document.getElementById("input-id");
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("button").click();
    }
  });
}

// Controlla che l'ID inserito sia lungo 20 caratteri, in caso contrario visualizza
// un bordo rosso al textbox di input e mostra un avviso di errore
function checkLength(input_id, error_id) {
  var input = document.getElementById(input_id);
  if (input.value.length != 20) {
    input.classList.add("border-red");
    showError(
      "L'id inserito non è accettato (lunghezza 20 caratteri)",
      error_id
    );
    return false;
  } else {
    input.classList.remove("border-red");
    hideError(error_id);
    return true;
  }
}

// Funzione che inserisce una data stringa di testo (l'errore) all'opportuno
// elemento e lo mostra
function showError(error, error_id) {
  var err_box = document.getElementById(error_id);
  err_box.innerHTML = error;
  err_box.classList.remove("op0");
}

// Nasconde l'avviso di errore
function hideError(error_id) {
  var err_box = document.getElementById(error_id);
  err_box.innerHTML = "-------------";
  err_box.classList.add("op0");
}

// Restituisce il nome del .html attualmente visualizzato
function getPageName() {
  var path = window.location.pathname;
  var page = path.split("/").pop();
  return page;
}

// Invia al sistema i dati mittente, destinatario e ammontare
function sendTransfer() {
  var arr = [
    document.getElementById("input-id-sender").value,
    document.getElementById("input-id-receiver").value,
    document.getElementById("input-amount").value
  ]
  // if(httpPost("http://127.0.0.1:5000/api/transfer", arr).Status)
  var content = httpPost("http://127.0.0.1:5000/api/transfer", arr);
  var parsed = JSON.parse(content);
  console.log(content);
}

if (getPageName() == "") setEnter();
