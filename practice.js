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