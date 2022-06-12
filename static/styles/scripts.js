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
  var amount = tx.amount;

  if (receiver == "Withdrawal")
  {
    return "Withdrawal"
  }
  if (input != receiver) {
    return "Transfer";
  }
  if (input == receiver && amount > 0) {
    return "Deposit";
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
    temp = document.createTextNode("Type: " + checkTipologiaTX(tx[i]));
    tipologia.appendChild(temp);
    cellNode2.appendChild(tipologia);
    rowNode.appendChild(cellNode2);

    var ammontare = document.createElement("div");
    temp = document.createTextNode("Amount: " + Math.abs(tx[i].amount));
    ammontare.appendChild(temp);
    cellNode2.appendChild(ammontare);
    rowNode.appendChild(cellNode2);

    if (tx[i].receiver != input) {
      if(!tx[i].receiver == "Withdrawal") {
        var destinatario = document.createElement("div");
        temp = document.createTextNode("Receiver: " + tx[i].receiver);
        destinatario.appendChild(temp);
        cellNode2.appendChild(destinatario);
      }
      var mittente = document.createElement("div");
      temp = document.createTextNode("Sender: " + tx[i].sender);
      mittente.appendChild(temp);
      cellNode2.appendChild(mittente);
    }

    var id = document.createElement("div");
    temp = document.createTextNode("ID: " + tx[i].id);
    id.appendChild(temp);
    cellNode2.appendChild(id);

    var data = document.createElement("div");
    temp = document.createTextNode("Date: " + tx[i].timestamp);
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

  var result = ""
  xmlHttp.onreadystatechange = (function(_this) {
    return function() {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        result = xmlHttp.responseText;
        var parsed = JSON.parse(result)
        if(parsed.Status == "Success") {
          resultPOST("The transaction was completed successfully!", parsed.Status);
        }
        else if(parsed.Status == "Failure") {
          resultPOST(parsed.Error, parsed.Status);
        }
      };
    }
  })(this);

  xmlHttp.send(JSON.stringify({
    from: arr[0],
    to: arr[1],
    amount: arr[2]
  }));
}

function resultPOST(txt, result) {
  // var flip_card = document.getElementById("flip-card");
  var alert = document.getElementById("alert");
  var title = document.getElementById("title");
  alert.innerHTML = txt;
  if (result == "Success")
  {
    title.innerHTML = "All done! 👍🏻"
  }
  else if (result == "Failure")
  {
    title.innerHTML = "Something went wrong! 🤔"
  }
  flipCard("flip-card")
  // flip_card.classList.add("flip-card-flip");
}

function flipCard(id) {
  var flip_card = document.getElementById(id)
  flip_card.classList.toggle("flip-card-flip")
}

function resetTransfer() {
  var sender = document.getElementById("input-id-sender")
  var receiver = document.getElementById("input-id-receiver")
  var amount = document.getElementById("input-amount")
  sender.value = ""
  receiver.value = ""
  amount.value = ""
}

// Chiamato dal pulsante "Cerca", utilizza l'ID inserito per ottenere tutti i dati del
// rispettivo account e inserirli opportunamente nella pagina visibile all'utente
function getInput() {
  if (checkLength("input-id", "notice")) {
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

      var tempText = "Account " + parsed.AccountID + " found ✅"
      showNotice(tempText, "notice", "green")

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
      var tempText = parsed.Error + " ❌"
      showNotice(
        tempText,
        "notice",
        "red"
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
function checkLength(input_id, notice_id) {
  var input = document.getElementById(input_id);
  if (input.value.length != 20) {
    input.classList.add("border-red");
    showNotice(
      "❗The entered ID's length must be 20 characters❗",
      notice_id,
      "red"
    );
    return false;
  } else {
    input.classList.remove("border-red");
    hideNotice(notice_id);
    return true;
  }
}

// Funzione che inserisce una data stringa di testo (l'errore) all'opportuno
// elemento e lo mostra
function showNotice(notice, notice_id, color) {
  var notice_box = document.getElementById(notice_id);
  notice_box.innerHTML = notice;
  notice_box.classList.remove("op0");
  if(notice_box.classList.contains("red") && color == "green"){
    notice_box.classList.remove("red")
    notice_box.classList.add("green")
    setTimeout(function() {
      hideNotice(notice_id);
    }, 5000);
  }
  else if(notice_box.classList.contains("green") && color == "red"){
    notice_box.classList.remove("green")
    notice_box.classList.add("red")
  }
}

// Nasconde l'avviso di errore
function hideNotice(notice_id) {
  var notice_box = document.getElementById(notice_id);
  notice_box.innerHTML = "-------------";
  notice_box.classList.add("op0");
}

// Restituisce il nome del .html attualmente visualizzato
function getPageName() {
  var path = window.location.pathname;
  var page = path.split("/").pop();
  return page;
}

// Invia al sistema i dati mittente, destinatario e ammontare
function sendTransfer() {
  checkLength("input-id-sender", "error-sender")
  checkLength("input-id-receiver", "error-receiver")
  checkPositive("input-amount", "error-amount")
  if(
  (checkLength("input-id-sender", "error-sender")) &&
  (checkLength("input-id-receiver", "error-receiver")) &&
  (checkPositive("input-amount", "error-amount")))
  {
    var arr = [
      document.getElementById("input-id-sender").value,
      document.getElementById("input-id-receiver").value,
      document.getElementById("input-amount").value
    ]
    httpPost("http://127.0.0.1:5000/api/transfer", arr);
  }
}

function checkPositive(input_id, notice_id) {
  var input = document.getElementById(input_id)
  if(input.value > 0){
    input.classList.remove("border-red");
    hideNotice(notice_id)
    return true}
  else
  {
    input.classList.add("border-red");
    showNotice(
      "❗The amount must be higher than zero❗",
      notice_id,
      "red"
    )
    return false
  }
}

if (getPageName() == "") setEnter();
