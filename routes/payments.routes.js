const express = require("express");
const Stripe = require("stripe");
const stripe = new Stripe('pk_test_51ME06zKXiVVeS2LSw6TEQkp9XbkiUqtvM6ooAL5RsTIhG9C0tmk3N3ni4YSAXObq1zwx0KC67oEYRqesc9LAyWeH00wSg2n0TA');
const router = require("express").Router()
const cors = require("cors");


const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

router.post("/", async (req, res) => {
  // you can get more data to find in a database, and so on
  const { id, amount } = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      payment_method: id,
      confirm: true, //confirm the payment at the same time
    });

    console.log(payment);

    return res.status(200).json({ message: "Successful Payment" });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.raw.message });
  }
});

app.listen(5005, () => {
  console.log("Server on port", 5005);
});
