# Istruzioni per l'installazione

Il progetto e' stato sviluppato e testato su 2 macchine con le seguienti caratteristiche :

 - Cpu AMD Ryzen 9 5900x, con architettura x64 e sistema operativo Windows 11 a 64 bit
 - Cpu Apple M1, con architettura RISC e sistema operativo macOS 12.0 Monterey a 64 bit

# Prerequisiti
Per poter eseguire l'elaborato e' necessario aver installato Python sulla macchina, durante lo sviluppo e' stato utilizzato Python in versione **3.9.5**.
I package esterni utilizzati sono:

 - flask in versione **2.0.2**
 - requests in versione **2.25.1** ( il package in questione viene usato solo nel file testing.py, quindi non strettamente necessario al funzionamento del progetto stesso )

Per installare i package richiesti e' necessario eseguire il comando `'pip install nomepackage'` all'interno del CMD di Windows, `'# pip install nomepackage'`.

Nel caso in cui durante l'installazione di Python non e' stato selezionato il PATH ed il comando pip non venisse rilevato, consultare queste guide per [Windows](https://stackoverflow.com/questions/23708898/pip-is-not-recognized-as-an-internal-or-external-command) oppure per [Linux](https://stackoverflow.com/questions/9780717/bash-pip-command-not-found).

All'interno del progetto e' inoltre presente il file requirements.txt nel caso in cui si volessero installare tutti i package con un singolo comando `'pip install -r requirements.txt'`, eseguito all'interno della cartella del progetto.


# Windows
Per eseguire il progetto su un sistema operativo Windows è necessario eseguire i seguenti passaggi: 

 - Spostarsi con CMD all'interno della cartella del progetto
 - Eseguire il comando `'set FLASK_APP=app'`
 - Eseguire il comando `'set FLASK_ENV=development' (passaggio non necessario, ma consigliato per poter eseguire eventuali modifiche al codice durante l'esecuzione)`
 - Eseguire il comando `'flask run'`

In caso di successo dovrebbe apparire una schermata di questo genere 
![enter image description here](https://cdn.discordapp.com/attachments/795656559727476796/987108061502119946/unknown.png)

E' possibile infine visualizzare il progetto in browser accedendo a http://127.0.0.1:5000/

Per quanto riguarda **Linux** le istruzioni dovrebbero essere le medesime, dove l'unica differenza e' l'uso di **export** al posto di **set** .

