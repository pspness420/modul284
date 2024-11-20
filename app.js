// Event-Listener für das Anmeldeformular
document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars (Seitenreload)

    // Holen der Eingabewerte aus den Formularfeldern
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const name = `${firstName} ${lastName}`; // Vor- und Nachname zusammenfügen
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const priority = document.getElementById("priority").value;
    const service = document.getElementById("service").value;

    // Regulärer Ausdruck für die E-Mail-Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Regulärer Ausdruck für Telefonnummer im Format 079 487 80 74
    const phoneRegex = /^\d{3} \d{3} \d{2} \d{2}$/;

    // Validierung der E-Mail-Adresse
    if (!emailRegex.test(email)) {
        alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
        return;
    }

    // Validierung der Telefonnummer
    if (!phoneRegex.test(phone)) {
        alert("Bitte geben Sie die Telefonnummer im Format 079 487 80 74 ein.");
        return;
    }

    // Zusammenstellen der Anmeldedaten
    const registrationData = {
        name: name, // Zusammengesetzter Name
        email: email,
        phone: phone,
        priority: priority,
        service: service,
        create_date: new Date().toISOString(), // Aktuelles Datum in ISO-Format
        pickup_date: calculatePickupDate(priority) // Berechnung des Abholdatums
    };

    // Senden der Daten an die API
    fetch("http://localhost:5000/api/registration", {
        method: "POST", // HTTP-Methode
        headers: {
            "Content-Type": "application/json" // Datenformat
        },
        body: JSON.stringify(registrationData) // Daten in JSON umwandeln
    })
    .then(response => response.json()) // Antwort in JSON umwandeln
    .then(data => {
        alert("Anmeldung erfolgreich!"); // Erfolgsmeldung
        console.log(data); // Debugging-Ausgabe
    })
    .catch(error => console.error("Fehler:", error)); // Fehlerbehandlung
});

// Funktion zur Berechnung des Abholdatums basierend auf der Priorität
function calculatePickupDate(priority) {
    let daysToAdd = 7; // Standardmäßig 7 Tage
    if (priority === "low") daysToAdd = 12; // Niedrige Priorität: 12 Tage
    if (priority === "express") daysToAdd = 5; // Express-Priorität: 5 Tage

    const pickupDate = new Date(); // Aktuelles Datum
    pickupDate.setDate(pickupDate.getDate() + daysToAdd); // Tage hinzufügen
    return pickupDate.toISOString().split("T")[0]; // Rückgabe im Format YYYY-MM-DD
}

// Event-Listener für die Telefonnummer-Eingabe
document.getElementById("phone").addEventListener("input", function(e) {
    const input = e.target; // Aktuelles Eingabefeld
    let value = input.value.replace(/\D/g, ''); // Entfernt alle Nicht-Zahlen
    const maxLength = 10; // Maximale Anzahl von Ziffern
    const cursorPosition = input.selectionStart; // Aktuelle Cursorposition
    const prevLength = input.dataset.prevLength || 0; // Vorherige Länge der Eingabe
    const isDeleting = value.length < prevLength; // Überprüfung, ob der Benutzer löscht

    // Beschränke die Eingabe auf maximal 10 Ziffern
    value = value.slice(0, maxLength);

    // Formatiere die Eingabe in Blöcke von 3 3 2 2
    let formattedValue = value
        .replace(/(\d{3})(\d{0,3})/, '$1 $2') // Fügt den ersten Abstand ein
        .replace(/(\d{3}) (\d{3})(\d{0,2})/, '$1 $2 $3') // Fügt den zweiten Abstand ein
        .replace(/(\d{3}) (\d{3}) (\d{2})(\d{0,2})/, '$1 $2 $3 $4'); // Fügt den dritten Abstand ein

    // Setze den formatierten Wert in das Eingabefeld
    input.value = formattedValue;

    // Korrigiere die Cursorposition, wenn Leerzeichen beim Löschen entstehen
    if (isDeleting && cursorPosition > 0 && formattedValue[cursorPosition - 1] === ' ') {
        input.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
    } else if (!isDeleting) {
        input.setSelectionRange(cursorPosition + (formattedValue.length - prevLength), cursorPosition + (formattedValue.length - prevLength));
    }

    // Speichere die aktuelle Länge der Eingabe
    input.dataset.prevLength = formattedValue.length;
});

