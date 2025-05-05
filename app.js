import express from 'express';
import cors from 'cors';
import { getAll, getWhere, addShipment, deleteShipment } from './db.js';

const app = express();
app.use(cors()); 
app.use(express.json());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.get('/shipments', async (req, res) => {
  const shipments = await getAll();
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

  try {
    const result = await addShipment(shipment);
    res.status(201).send(result);
  } catch (error) {
    if (error.message.includes('Bill Number')) {
      res.status(409).send({ error: 'Shipment with this Bill Number already exists.' });
    } 
  }
});

app.delete('/shipment/:billNumber', async (req, res) => {
  const { billNumber } = req.params;
    const result = await deleteShipment(billNumber);
    if (result.affectedRows === 0) {
      res.status(404).send({ message: 'Shipment not found' });
    } else {
      res.send({ message: 'Shipment deleted successfully' });
    }
  
});
