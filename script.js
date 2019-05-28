// In questo esercizio iniziamo a replicare la logica che sta dietro a tantissimi
// siti che permettono la visione di film e telefilm.
// Milestone 1: Creare un layout base con una searchbar (una input e un button)
// in cui possiamo scrivere completamente o parzialmente il nome di un film.
// Possiamo, cliccando il bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// 1. Titolo 2. Titolo Originale 3. Lingua 4. Voto


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


// Funzione che genera una card con i valori del film e la inserisce nel html
// atraverso l'utilizzo di handlebars
function film_card (info) {
  var source = $("#template_film").html();
  var template = Handlebars.compile(source);
  // Copio nella var risultati il data ottenuto dalla chiamata api
  var risultati = info.results;
  // Scorro tutti i film restituiti dall'api e per ognuno genero una card con i rispettivi valori
  for (var i = 0; i < risultati.length; i++) {
    var voto_medio = risultati[i].vote_average;
    var linguaggio = risultati[i].original_language;
    // Genero l'oggetto da passare al template. Per la lingua e il voto richiamo le funzioni create e gli
    // passo i valori ottenuti dall'api
    var context = {
      titolo: risultati[i].title,
      titolo_originale: risultati[i].original_title,
      lingua: genera_bandiere(linguaggio),
      voto: genera_stelle(voto_medio)
    }
    // Genero l'html del handlebars e lo inserisco nel contenitore delle film-cards
    var html = template(context);
    $('.film_container').append(html);
  }
}


// URL Api base
var url_api = 'https://api.themoviedb.org/3/'
// Funzione che richiama l'API e genera una card con i valori restituiti
function chiamata_api() {
  // Leggo il valore digitato dall'utente
  var digitato = $('input').val();
  // Richiamo l'API
  $.ajax({
    url: url_api + 'search/movie',
    method: 'GET',
    data : {
      api_key : '204fdbaa01b03d5fdaf748fd992c0eb7',
      language : 'it',
      query : digitato
    },
    success: function (data) {
      // Richiamo la funzione e gli passo il risultato ottenuto dell' API
      film_card (data);
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
    $('.film_container').empty();
    chiamata_api();
  })
  // Nel digitare tasto invio parte la ricerca
  $("input").keypress(function(event){
    // Cancello le cards della ricerca precedente
    $('.film_container').empty();
    if (event.which == 13) {
      chiamata_api();
    }
  })

})
