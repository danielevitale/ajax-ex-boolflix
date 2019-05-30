// In questo esercizio iniziamo a replicare la logica che sta dietro a tantissimi
// siti che permettono la visione di film e telefilm.

// Milestone 1:
// Creare un layout base con una searchbar (una input e un button)
// in cui possiamo scrivere completamente o parzialmente il nome di un film.
// Possiamo, cliccando il bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// 1. Titolo 2. Titolo Originale 3. Lingua 4. Voto

// Milestone 2:
// Trasformiamo il numero da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo
// un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente,
// gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).
// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che
// corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i
// film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)

// Milestone 3:
// In questa milestone come prima cosa aggiungiamo la copertina del film o della serie al nostro elenco.
// Ci viene passata dall’API solo la parte finale dell’URL, questo perché poi potremo generare da quella porzione di
// URL tante dimensioni diverse. Dovremo prendere quindi l’URL base delle immagini di TMDB: https://image.tmdb.org/t/p/​
// per poi aggiungere la dimensione che vogliamo generare (troviamo tutte le dimensioni possibili
// a questo link: https://www.themoviedb.org/talk/53c11d4ec3a3684cf4006400​) per poi aggiungere la parte finale
// dell’URL passata dall’API.


//---------------------------------FUNZIONI------------------------------------

// Funzione che genera il numero di stelle (piene e vuote) dato in input il voto ottenuto dall'API
function genera_stelle(voto) {
  // Trasformo il voto in un umero compreso tra 0 e 5
  var voto_arrotondato = Math.ceil((voto / 2));
  console.log(voto_arrotondato);
  // Inizializzo a 0 la var che conterrà le stringhe delle stelle
  var stelle = '';
  // Creo la stringa che conterrà le stelle piene (concatenando il loro html)
  for (var j = 1; j <= voto_arrotondato; j++) {
    stelle += '<i class="fas fa-star"></i>';
  }
  var voto_massimo = 5;
  // Aggiungo alla stringa delle stelle piene le stelle vuote (concatenando il loro html)
  for (var z = 1; z <= (voto_massimo - voto_arrotondato); z++) {
    stelle += '<i class="far fa-star"></i>';
  }
  return stelle
}


// Funzione che genera la bandiera della nazione dato in input la lingua originale
function genera_bandiere(lingua) {
  // Inizializzo la var flag come stringa vuota
  var flag = '';
  // Assegno l'img della bandiera corrispondente nei casi di lingua italiano, inglese, spagnolo e francese;
  // negli altri casi assegno il la stringa restituitami dall'api
  switch(lingua) {
    case 'it':
      flag = '<img src="imgflag/italy.png" alt="">'
      break;
    case 'en':
      flag = '<img src="imgflag/united-kingdom.png" alt="">'
      break;
    case 'es':
      flag = '<img src="imgflag/spain.png" alt="">'
      break;
    case 'fr':
      flag = '<img src="imgflag/france.png" alt="">'
      break;
    default:
      flag = lingua
  }
  return flag
}


// Funzione che genera una card con i valori del film o delle serie e la inserisce nel html
// atraverso l'utilizzo di handlebars
function card (info) {
  var source = $("#template_film").html();
  var template = Handlebars.compile(source);
  // Scorro tutti i film restituiti dall'api e per ognuno genero una card con i rispettivi valori
  for (var i = 0; i < info.length; i++) {
    var voto_medio = info[i].vote_average;
    var linguaggio = info[i].original_language;
    // Genero l'url per ottenere la copertina aggiungendo all'url di base (più la dimensione w154)
    // ciò che mi restituisce l'api
    var url_copertina = 'https://image.tmdb.org/t/p/w342' + info[i].poster_path;
    // Verififco se la chiamata api mi abbia restiuto un url di una copertina o se invece la copertina
    // non è disponibile (.poster_path = null). Se non lo è verrà visualizzata un img che indica all'utente
    // che la copertia non è disponibile
    var copertina;
    if (info[i].poster_path === null) {
      copertina = '<img src="imgcopertina/copertina_non_disponibile.jpg" alt="">';
    }else {
      copertina = '<img src="'+ url_copertina + '" alt="">';
    }
    // Effettuo la stessa verifica per l'overview. Nel caso in cui l'api mi restituisce una overview vuota
    // l'utente legge "Non disponibile"
    if (info[i].overview === '') {
      overview = 'Non disponibile';
    }else {
      overview = info[i].overview;
    }
    // Genero l'oggetto da passare al template. Per la lingua e il voto richiamo le funzioni create e gli
    // passo i valori ottenuti dall'api.
    // Se l'attributo .name di un oggetto resituito dall'api è un indefinito, allora siamo nel caso della chiamata
    // api relativa ai film e generiamo il template con i risultati ottenuti dall'api dei film. Altrimenti siamo
    // nel caso della chiamati api per le serie tv
    if (typeof info[i].name === 'undefined') {
      console.log('film');
      var context = {
        titolo: info[i].title,
        titolo_originale: info[i].original_title,
        lingua: genera_bandiere(linguaggio),
        voto: genera_stelle(voto_medio),
        tipo: 'Film',
        img: copertina,
        overview : overview
      }
    }else {
      console.log('serie');
      var context = {
        titolo: info[i].name,
        titolo_originale: info[i].original_name,
        lingua: genera_bandiere(linguaggio),
        voto: genera_stelle(voto_medio),
        tipo: 'Serie tv',
        img: copertina,
        overview : overview
      }
    }
    // Genero l'html del handlebars e lo inserisco nel contenitore delle film-cards
    var html = template(context);
    $('.container_film').append(html);
  }
}


// URL Api base
var url_api = 'https://api.themoviedb.org/3/'
// Funzione che richiama l'API e genera una card con i valori restituiti
function chiamata_api() {
  // Leggo il valore digitato dall'utente
  var digitato = $('input').val();
  // Richiamo l'API relativa ai film
  $.ajax({
    url: url_api + 'search/movie',
    method: 'GET',
    data : {
      api_key : '204fdbaa01b03d5fdaf748fd992c0eb7',
      language : 'it',
      query : digitato
    },
    success: function (data) {
      // Copio nella var risultati il data ottenuto dalla chiamata api
      var risultati_film = data.results;
      // Richiamo la funzione e gli passo il risultato ottenuto dell' API
      card (risultati_film);
    },
    error : function (richiesta,stato,errori) {
    alert("E' avvenuto un errore. " + errori);
    }
  })
  // Richiamo l'API relativa alle serie tv
  $.ajax({
    url: url_api + 'search/tv',
    method: 'GET',
    data : {
      api_key : '204fdbaa01b03d5fdaf748fd992c0eb7',
      language : 'it',
      query : digitato
    },
    success: function (data) {
      // Copio nella var risultati il data ottenuto dalla chiamata api
      var risultati_serie = data.results;
      // Richiamo la funzione e gli passo il risultato ottenuto dell' API
      card (risultati_serie);
    },
    error : function (richiesta,stato,errori) {
    alert("E' avvenuto un errore. " + errori);
    }
  })

}



//------------------------------MAIN----------------------------------------

$(document).ready(function() {

  // Al click sul button parte la ricerca
  $("button").click(function(){
    // Cancello le cards della ricerca precedente
    $('.container_film').empty();
    chiamata_api();
  })
  // Nel digitare tasto invio parte la ricerca
  $("input").keypress(function(event){
    // Cancello le cards della ricerca precedente
    $('.container_film').empty();
    if (event.which == 13) {
      chiamata_api();
    }
  })

  // Quando il mouse entra sulla copertina di un film compare la card con le
  // caratteristiche del film
  $(document).on('mouseenter', '.card', function () {
    $(this).find('.card_valori').slideDown(1000);
    $(this).find('.card_copertina').hide();
  // Quando il mouse esce dalla di un film compare la copertina del film
  })
  $(document).on('mouseleave', '.card', function () {
    $(this).find('.card_valori').hide();
    $(this).find('.card_copertina').fadeIn(1000);
  })

})
