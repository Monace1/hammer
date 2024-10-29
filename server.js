const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

// In-memory storage
let auction = {
    prizeAmount: 1000,
    bids: [],
    users: {}
};

let superuser = {
    username: "superuser",
    password: "superpassword" // Replace with secure storage and hashing
};

let admins = {}; // Store admin accounts as { username: password }

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Generate unique ticket function
function generateTicket() {
    return crypto.randomBytes(4).toString('hex');
}

// Serve the main HTML pages
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.get('/register', (req, res) => res.sendFile(__dirname + '/public/register.html'));
app.get('/bid', (req, res) => res.sendFile(__dirname + '/public/bid.html'));
app.get('/highest-bidder', (req, res) => res.sendFile(__dirname + '/public/highest-bidder.html'));
app.get('/admin', (req, res) => res.sendFile(__dirname + '/public/admin.html'));
app.get('/admin-login', (req, res) => res.sendFile(__dirname + '/public/admin-login.html'));
app.get('/superuser', (req, res) => res.sendFile(__dirname + '/public/superuser.html'));

// Register as a regular user
app.post('/register', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).send('Name is required.');
    const ticket = generateTicket();
    auction.users[ticket] = { name, ticket };
    res.status(200).json({ message: `Registered successfully!`, ticket });
});

// Superuser: Register a new admin
app.post('/superuser/register-admin', (req, res) => {
    const { superuserUsername, superuserPassword, newAdminUsername, newAdminPassword } = req.body;
    if (superuser.username !== superuserUsername || superuser.password !== superuserPassword) {
        return res.status(401).send('Unauthorized: Invalid superuser credentials.');
    }
    if (admins[newAdminUsername]) {
        return res.status(400).send('Admin username already exists.');
    }
    admins[newAdminUsername] = newAdminPassword;
    res.status(200).send(`Admin ${newAdminUsername} registered successfully.`);
});

// Admin: Log in
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (admins[username] !== password) {
        return res.status(401).send('Unauthorized: Invalid admin credentials.');
    }
    res.status(200).send('Admin login successful.');
});

// Get the highest bidder info (without user name)
app.get('/highest-bidder-info', (req, res) => {
    if (auction.bids.length === 0) return res.send('No bids have been placed.');
    const highestBid = auction.bids.reduce((max, bid) => (bid.bidAmount > max.bidAmount ? bid : max));
    res.json({ ticket: highestBid.ticket, bidAmount: highestBid.bidAmount });
});

// Admin: View all bids
app.post('/admin/bids', (req, res) => {
    const { password } = req.body;
    if (password !== superuser.password) return res.status(401).send('Unauthorized');
    res.json(auction.bids);
});

// Admin: Set prize amount
app.post('/admin/set-prize', (req, res) => {
    const { password, prizeAmount } = req.body;
    if (password !== superuser.password) return res.status(401).send('Unauthorized');
    auction.prizeAmount = parseFloat(prizeAmount);
    res.status(200).send(`Prize amount set to ${auction.prizeAmount}`);
});

// Admin: Get winning ticket (without user name)
app.post('/admin/winning-ticket', (req, res) => {
    const { password } = req.body;
    if (password !== superuser.password) return res.status(401).send('Unauthorized');
    if (auction.bids.length === 0) return res.send('No bids placed.');
    const highestBid = auction.bids.reduce((max, bid) => (bid.bidAmount > max.bidAmount ? bid : max));
    res.json({ winningTicket: highestBid.ticket });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
