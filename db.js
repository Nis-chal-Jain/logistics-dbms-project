import e from 'express';
import mysql from 'mysql2';

const pool = mysql.createPool({
    host: '127.0.0.1',
    user:'root',
    password:'root',
    database:'logisticsDB',
}).promise();

const tableName = 'Shipments';

export const getAll = async () => {
    const [rows] = await pool.query(`SELECT * FROM ${tableName}`);
    return rows;
}

export const getWhere = async (condition) => {
    const [rows] = await pool.query(`SELECT * FROM ${tableName} WHERE Status="${condition}"`);
    return rows;
}

export const addShipment = async (shipment) => {
    const { Bill_Number, LR_Number, DateOfShipment, Status, Sender_City, Receiver_City } = shipment;
    const [rows] = await pool.query(`INSERT INTO ${tableName} (Bill_Number, LR_Number, DateOfShipment, Status, Sender_City, Receiver_City) VALUES (?, ?, ?, ?, ?, ?)`, [Bill_Number, LR_Number, DateOfShipment, Status, Sender_City, Receiver_City]);
    return rows;
}

export const deleteShipment = async (billNumber) => {
    const [result] = await pool.query(`DELETE FROM ${tableName} WHERE Bill_Number = ?`, [billNumber]);
    return result;
}
