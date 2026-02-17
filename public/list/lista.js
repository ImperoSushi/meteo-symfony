const form = document.getElementById("form");

form.addEventListener("submit", function(ev) {
    ev.preventDefault();

    let nome = document.getElementById("listName").value;

    if (nome.trim() === "") {
        alert("Inserisci un nome per la lista");
        return;
    }

    let selezionati = [];
    let check = document.querySelectorAll(".ingredient:checked");

    check.forEach(c => selezionati.push(c.value));

    if (selezionati.length === 0) {
        alert("Seleziona almeno un ingrediente");
        return;
    }

    let dati = {
        listName: nome,
        ingredient: selezionati
    };

    fetch("/lista/api", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dati)
    })
    .then(r => r.json())
    .then(result => {
        document.getElementById("risposta").innerText = result.messaggio;
    })
    .catch(err => console.error("Errore:", err));
});
