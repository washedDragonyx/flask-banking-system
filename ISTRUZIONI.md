# Istruzioni per l'installazione

Il progetto è stato sviluppato e testato su 2 macchine con le seguenti caratteristiche:

 - Cpu AMD Ryzen 9 5900x, con architettura x64 e sistema operativo Windows 11 a 64 bit
 - Cpu Apple M1, con architettura RISC e sistema operativo macOS 12.0 Monterey a 64 bit

# Prerequisiti
Per poter eseguire l'elaborato è necessario aver installato Python sulla macchina, durante lo sviluppo è stato utilizzato Python in versione **3.9.5**.
I package esterni utilizzati sono:

 - Flask in versione **2.0.2**
 - Requests in versione **2.25.1** ( il package in questione viene usato solo nel file testing.py, quindi non è strettamente necessario al funzionamento del progetto stesso )

Per installare i package richiesti è necessario eseguire il comando `'pip install nomepackage'` all'interno del CMD di Windows, `'# pip install nomepackage'`.

Nel caso in cui durante l'installazione di Python non sia stato selezionato il PATH ed il comando pip non venisse rilevato, consultare queste guide per [Windows](https://stackoverflow.com/questions/23708898/pip-is-not-recognized-as-an-internal-or-external-command) oppure per [Linux](https://stackoverflow.com/questions/9780717/bash-pip-command-not-found).

All'interno del progetto è inoltre presente il file requirements.txt nel caso in cui si volessero installare tutti i package con un singolo comando `'pip install -r requirements.txt'`, eseguito all'interno della cartella del progetto.


# Windows
Per eseguire il progetto su un sistema operativo Windows è necessario eseguire i seguenti passaggi: 

 - Spostarsi col terminal all'interno della cartella del progetto
 - Eseguire il comando `'set FLASK_APP=app'`
 - Eseguire il comando `'set FLASK_ENV=development' (passaggio non necessario ma consigliato per poter eseguire eventuali modifiche al codice durante l'esecuzione)`
 - Eseguire il comando `'flask run'`

In caso di successo dovrebbe apparire una schermata di questo genere 
![enter image description here](https://cdn.discordapp.com/attachments/795656559727476796/987108061502119946/unknown.png)

È possibile infine visualizzare il progetto in browser accedendo a http://127.0.0.1:5000/

Per quanto riguarda **Linux** le istruzioni dovrebbero essere le medesime, dove l'unica differenza è l'uso di **export** al posto di **set** .

**IMPORTANTE**
Si prega di utilizzare gli header Content-Type : application/json oppure application/x-www-form-urlencoded, senza i quali il body non verrà letto ed interpretato correttamente.
Inoltre si prega di fare le richieste tramite l'url [http://127.0.0.1:5000/](http://127.0.0.1:5000/) invece di [http://localhost:5000/](http://localhost:5000/) in quanto potrebbero essere presenti problemi di compatibilità.


