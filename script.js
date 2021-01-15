
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

// Generic update List funktion to see what was last scanned
// Adds the Last Scanned Item to the top of that list
function update_list(barcode,richtung){
    fetch(''+url+'stock/products/by-barcode/'+barcode+'', {
      method: "GET",
      headers: {"Content-type": "application/json", "GROCY-API-KEY":`${apikey}`}
    })
    .then(
      function(u){ return u.json();}
          )
    .then(
      function(json){
              jsondata = json;
            }
          )
    .then(    
      function (update_list) {
        var div = document.getElementById('list'),
        p = document.createElement("p");
        p.innerHTML = jsondata.product.name
        p.classList.add(richtung)
        div.prepend(p);
      }
    )
    .catch(
        function (err) {
            var div = document.getElementById('list'),
            p = document.createElement("p");
            p.innerHTML = 'Barcode "'+barcode +'" nicht gefunden! Bitte hinzuf&uuml;gen.'
            p.classList.add("warning")
            div.prepend(p);
            return console.log('Request Failed horrible:', err)
        }
        );
      document.getElementById("consume_input").value="";
    }

function consume() {
    var barcode = document.getElementById("consume_input").value;
        fetch(''+url+'stock/products/by-barcode/'+barcode+'/consume', {
            method: "POST",
            body: '{\"amount\":1,\"transaction_type\":\"consume\",\"spoiled\":false}',
            headers: {"Content-type": "application/json", "GROCY-API-KEY":`${apikey}`}
        })
        .then(handleErrors)
        .then(response => response.json())
        .then(update_list(barcode,"secondary"))
        
        document.getElementById("consume_input").value="";

};



// add new grocery to stock

function add() {
      var barcode = document.getElementById("add_input").value;

      //json fetch (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
        fetch(''+url+'stock/products/by-barcode/'+barcode+'/add', {
      method: "POST",
      body: "{\"amount\":1,\"best_before_date\":\"\",\"transaction_type\":\"purchase\",\"price\":\"\"}",
      headers: {"Content-type": "application/json", "GROCY-API-KEY":`${apikey}`}
    })
    .then(handleErrors)
    .then(response => response.json())
    .then(update_list(barcode,"tertiary"))
    
    // resets the input field
      document.getElementById("add_input").value="";
};
    
    
    // waits for "enter" from the respective input boxes
const input_add = document.getElementById('add_input');
input_add.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        add();
    }
});

const input_consume = document.getElementById('consume_input');
input_consume.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        consume();
    }
});
    
    