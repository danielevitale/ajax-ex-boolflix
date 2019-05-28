// In questo esercizio iniziamo a replicare la logica che sta dietro a tantissimi
// siti che permettono la visione di film e telefilm.
// Milestone 1: Creare un layout base con una searchbar (una input e un button)
// in cui possiamo scrivere completamente o parzialmente il nome di un film.
// Possiamo, cliccando il bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// 1. Titolo 2. Titolo Originale 3. Lingua 4. Voto


// Funzione che genera una card con i valori del film e la inserisce nel html
// atraverso l'utilizzo di handlebars
function film_card (info) {
  var source = $("#template_film").html();
  var template = Handlebars.compile(source);
  var risultati = info.results;
  var film_trovati = risultati.length;
  for (var i = 0; i < risultati.length; i++) {
    var context = {
      titolo: risultati[i].title,
      titolo_originale: risultati[i].original_title,
      lingua: risultati[i].original_language,
      voto: risultati[i].vote_average
    }
    var html = template(context);
    $('.film_container').append(html);
  }
}

// Funzione che richiama l'API e genera una card con i valori restituiti
function chiamata_api() {
  // Cancello le cards della ricerca precedente
  $('.film').empty();
  // Leggo il valore digitato dall'utente
  var digitato = $('input').val();
  // Richiamo l'API
  $.ajax({
    url: 'https://api.themoviedb.org/3/search/movie',
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


$(document).ready(function() {

  // Al click sul button parte la ricerca
  $("button").click(function(){
    chiamata_api();
  })
  // Nel digitare tasto invio parte la ricerca
  $("input").keyup(function(event){
    if (event.which == 13) {
      chiamata_api();
    }
  })

})
