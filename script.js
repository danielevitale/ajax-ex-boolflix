// In questo esercizio iniziamo a replicare la logica che sta dietro a tantissimi
// siti che permettono la visione di film e telefilm.


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
    // Verififco se la chiamata api mi ha restiuto un url di una copertina o se invece la copertina
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
    // Se l'attributo .name di un oggetto resituito dall'api è un indefinito, allora si è nel caso della chiamata
    // api relativa ai film e genero il template con i risultati ottenuti dall'api dei film. Altrimenti si è
    // nel caso della chiamata api per le serie tv
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
  var film_non_trovati = false;
  var serie_non_trovate = false;
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
      // Se la chiamata api non restituisce nessun risultato la var film_non_trovati assume valore true
      if (data.total_results === 0) {
        film_non_trovati = true;
      }
      // Richiamo la funzione e gli passo il risultato ottenuto dell' API
      card (risultati_film);
      // Se non sono stati trovati ne film ne serie, l'utente visualizza tale informazione
      if ((film_non_trovati) && (serie_non_trovate)) {
        $('.container_film').html('<h1>Nessun risultato trovato</h1>');
      }
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
      // Se la chiamata api non restituisce nessun risultato la var serie_non_trovate assume valore true
      if (data.total_results === 0) {
        serie_non_trovate = true;
      }
      // Richiamo la funzione e gli passo il risultato ottenuto dell' API
      card (risultati_serie);
      console.log(film_non_trovati);
      // Se non sono stati trovati ne film ne serie, l'utente visualizza tale informazione
      if ((film_non_trovati) && (serie_non_trovate)) {
        $('.container_film').html('<h1>Nessun risultato trovato</h1>');
      }
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
