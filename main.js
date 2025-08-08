const form = document.getElementById("feh-contact-form");
const msg = document.getElementById("feh-form-message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    msg.textContent = ""; // clear old messages
    msg.style.color = "";

    const formData = {
        name: form.name.value,
        email: form.email.value,
        message: form.message.value,
    };

    const button = form.querySelector("button");
    button.disabled = true;
    button.textContent = "Sending...";

    try {
        const res = await fetch("https://notion-contact-form-six.vercel.app/api/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error();

        msg.textContent = "Thanks! Your message has been sent.";
        msg.style.color = "green";
        form.reset();
    } catch (err) {
        msg.textContent = "Something went wrong. Please try again.";
        msg.style.color = "red";
    } finally {
        button.disabled = false;
        button.textContent = "Send";
    }
});