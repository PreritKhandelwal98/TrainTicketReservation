const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    row: Number,
    seats: [Number],
});

module.exports = mongoose.model('Seat', seatSchema);
