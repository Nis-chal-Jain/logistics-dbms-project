# Logistics management using mysql
## Group Members
- Manish R
- Nischal Jain
- Tushar S Jain
- Vinayak

## Setup
### Prerequisite
- node.js
- mysql server

### Steps
- login to your mysql through cmd/terminal.
- create a database named `logisticsDB`
- set your password and username in db.js file.
- create/define a table `Shipments` using the following command for their attributes and their properties 
- 
  `CREATE TABLE Shipments (
    Bill_Number INT PRIMARY KEY,
    LR_Number VARCHAR(50) NOT NULL,
    DateOfShipment DATE NOT NULL,
    Status ENUM('inprogress', 'delivered') NOT NULL,
    Sender_City VARCHAR(100) NOT NULL,
    Receiver_City VARCHAR(100) NOT NULL
);`
- run `npm install` in the root folder
- run `node app.js`
- open `index.html` file

## Objectives 
- `CREATE`To add a shipments with 2 conditions ('inprogress', 'delivered').
- `READ`Read and list the shipments in a table.
- `UPDATE`Alter the status of the shipment.
- `DELETE`Delete any specific shipment using Bill_Number.