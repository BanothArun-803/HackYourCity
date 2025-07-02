let selectedLocation = null;

const map = L.map("map").setView([17.385, 78.4867], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

map.on("click", function (e) {
    selectedLocation = e.latlng;
    L.marker(selectedLocation).addTo(map).bindPopup("Selected Location").openPopup();
});

document.getElementById("issueForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!selectedLocation) {
        alert("Select a location on the map first.");
        return;
    }

    const type = document.getElementById("type").value;
    const description = document.getElementById("description").value;

    const issue = {
        type,
        description,
        location: {
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
        },
    };

    await fetch("http://localhost:5000/api/issues", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(issue),
    });

    alert("Issue submitted!");
    location.reload();
});

async function loadIssues() {
    const res = await fetch("http://localhost:5000/api/issues");
    const data = await res.json();

    data.forEach((issue) => {
        L.marker([issue.location.lat, issue.location.lng])
            .addTo(map)
            .bindPopup(`<strong>${issue.type}</strong><br>${issue.description}`);
    });
}

loadIssues();

//reset logic 
document.getElementById("resetBtn").addEventListener("click", function () {
  // Reset form fields
  document.getElementById("issueForm").reset();

  // Clear selectedLocation
  selectedLocation = null;

  // Remove marker if placed
  if (window.temporaryMarker) {
    map.removeLayer(window.temporaryMarker);
    window.temporaryMarker = null;
  }

  alert("Form and marker have been reset.");
});

