const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const Port = process.env.PORT || 5001;

const app = express();

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rqwof3p.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

console.log("Database connected");

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const appointmentCollectionOptions = client
      .db("doctorsPortal")
      .collection("appointmentOptions");

    const bookingsCollection = client
      .db("doctorsPortal")
      .collection("bookings");

    app.get("/appointmentOptions", async (req, res) => {
      const date = req.query.date;
      const query = {};
      const bookingQuery = {
        appointmentDate: date,
      };
      const options = await appointmentCollectionOptions.find(query).toArray();
      const alreadyBooked = await bookingsCollection
        .find(bookingQuery)
        .toArray();
      options.forEach((option) => {
        const optionBooked = alreadyBooked.filter(
          (book) => book.treatmentName === option.name
        );
        const bookedSlot = optionBooked.map((book) => book.slot);
        const remainingSlots = option.slots.filter(
          (slot) => !bookedSlot.includes(slot)
        );
        option.slots = remainingSlots;
      });
      res.send(options);
    });

    app.get('/bookings', async(req,res) => {
      const email = req.query.email;
      const query = {
        email : email
      }
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    })

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const query = {
        appointmentDate: booking.appointmentDate,
        email: booking.email,
        treatmentName: booking.treatmentName,
      };

      const alreadyBooked = await bookingsCollection.find(query).toArray();

      if (alreadyBooked.length) {
        const message = `You already have booked on ${booking.appointmentDate}`;
        return res.send({ acknowledged: false, message });
      }
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.log);

app.listen(Port, () => {
  console.log(`Server Running on Port ${Port}`);
});
