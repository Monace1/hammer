const adminPasswordInput = document.getElementById('admin-password');
const adminInfoDiv = document.getElementById('admin-info');

// View all bids
async function viewAllBids() {
    const password = adminPasswordInput.value;
    const response = await fetch('/admin/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
    });
    const bids = await response.json();

    adminInfoDiv.innerHTML = '<h3>All Bids:</h3><ul>' + bids.map(bid => `<li>Ticket: ${bid.ticket}, Bid Amount: $${bid.bidAmount}</li>`).join('') + '</ul>';
}

// Set prize amount
async function setPrizeAmount() {
    const password = adminPasswordInput.value;
    const prizeAmount = prompt('Enter new prize amount:');
    const response = await fetch('/admin/set-prize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, prizeAmount })
    });
    const message = await response.text();

    adminInfoDiv.innerHTML = `<h3>${message}</h3>`;
}

// View winning ticket (without username)
async function viewWinningTicket() {
    const password = adminPasswordInput.value;
    const response = await fetch('/admin/winning-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
    });
    const { winningTicket } = await response.json();

    adminInfoDiv.innerHTML = `<h3>Winning Ticket: ${winningTicket}</h3>`;
}
