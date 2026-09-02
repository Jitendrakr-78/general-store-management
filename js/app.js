async function testBackend() {

    try {

        const response = await fetch("http://localhost:5000/");

        const data = await response.json();

        document.getElementById("result").textContent =
            data.message;

    } catch (error) {

        console.error(error);

        document.getElementById("result").textContent =
            "Backend connection failed.";

    }
}
