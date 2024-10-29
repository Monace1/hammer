// Register user
document.getElementById('registerForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    const result = await response.json();
    document.getElementById('message').innerText = result.message + " Ticket: " + result.ticket;
});

// Place bid
document.getElementById('bidForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const ticket = document.getElementById('ticket').value;
    const bidAmount = document.getElementById('bidAmount').value;
    const response = await fetch('/bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket, bidAmount })
    });
    const message = await response.text();
    document.getElementById('message').innerText = message;
});

// Get highest bidder
async function getHighestBidder() {
    const response = await fetch('/highest-bidder-info');
    const { name, ticket, bidAmount } = await response.json();
    document.getElementById('highestBidderInfo').innerText = 
        `Highest Bidder: ${name} (Ticket: ${ticket}), Bid Amount: $${bidAmount}`;
}
