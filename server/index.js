require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Seat = require('./models/seat');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.get('/seats', async (req, res) => {
    const seats = await Seat.find();
    res.send(seats);
});

app.post('/reserve', async (req, res) => {
    const { numSeats } = req.body;
    console.log(`Request to reserve ${numSeats} seats received.`);
    const seats = await Seat.find();
    console.log('Current seat map:', JSON.stringify(seats, null, 2));

    let reservedSeats = [];
    for (let row of seats) {
        let consecutiveSeats = [];
        for (let i = 0; i < row.seats.length; i++) {
            if (row.seats[i] === 0) {
                consecutiveSeats.push(i);
                if (consecutiveSeats.length === numSeats) {
                    for (let index of consecutiveSeats) {
                        row.seats[index] = 1;
                    }
                    await row.save();
                    reservedSeats = reservedSeats.concat(
                        consecutiveSeats.map(index => ({ row: row.row, seat: index + 1 }))
                    );
                    console.log('Reserved seats:', reservedSeats);
                    return res.send(reservedSeats);
                }
            } else {
                consecutiveSeats = [];
            }
        }
    }

    // If not enough consecutive seats, find nearby seats
    let availableSeats = [];
    for (let row of seats) {
        for (let i = 0; i < row.seats.length; i++) {
            if (row.seats[i] === 0) {
                availableSeats.push({ row: row.row, seat: i + 1 });
                if (availableSeats.length === numSeats) {
                    for (let seat of availableSeats) {
                        seats[seat.row].seats[seat.seat - 1] = 1;
                    }
                    await Seat.bulkWrite(seats.map(row => ({
                        updateOne: {
                            filter: { _id: row._id },
                            update: { seats: row.seats }
                        }
                    })));
                    console.log('Reserved nearby seats:', availableSeats);
                    return res.send(availableSeats);
                }
            }
        }
    }

    console.error('Not enough seats available');
    res.status(400).send('Not enough seats available');
});


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
