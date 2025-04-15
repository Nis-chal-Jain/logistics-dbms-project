import express from 'express';
import { getAll, getWhere, addShipment } from './db.js';
const app = express();
app.use(express.json());
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.get('/shipments', async (req, res) => {
    const shipments = await getAll();
    // const shipments = "hello"
    res.send(shipments);
});

app.get('/shipments/:status', async (req, res) => {
    const { status } = req.params;
    const shipments = await getWhere(status);
    res.send(shipments);
});

app.post("/newShipment", async (req, res) => {
    const { Bill_Number, LR_Number, DateOfShipment, Status, Sender_City, Receiver_City } = req.body;
    const shipment = { Bill_Number, LR_Number, DateOfShipment, Status, Sender_City, Receiver_City };
    const result = await addShipment(shipment);
    res.send(result);
});