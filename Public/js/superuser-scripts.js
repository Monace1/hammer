document.getElementById('registerAdminForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const superuserUsername = document.getElementById('superuserUsername').value;
    const superuserPassword = document.getElementById('superuserPassword').value;
    const newAdminUsername = document.getElementById('newAdminUsername').value;
    const newAdminPassword = document.getElementById('newAdminPassword').value;

    const response = await fetch('/superuser/register-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ superuserUsername, superuserPassword, newAdminUsername, newAdminPassword })
    });

    const message = await response.text();
    document.getElementById('message').innerText = message;
});
