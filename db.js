import mysql from "mysql2";

const pool = mysql
  .createPool({
    host: "127.0.0.1",
    user: "root",
    password: "Vinayak@1844",
    database: "logisticsDB",
  })
  .promise();

const tableName = "Shipments";

export const getAll = async () => {
  const [rows] = await pool.query(`SELECT * FROM ${tableName}`);
  return rows;
};

export const getWhere = async (condition) => {
  const [rows] = await pool.query(
    `SELECT * FROM ${tableName} WHERE Status="${condition}"`
  );
  return rows;
};

export const addShipment = async (shipment) => {
  const {
    Bill_Number,
    LR_Number,
    DateOfShipment,
    Status,
    Sender_City,
    Receiver_City,
  } = shipment;

  try {
    const [rows] = await pool.query(
      `INSERT INTO ${tableName} (Bill_Number, LR_Number, DateOfShipment, Status, Sender_City, Receiver_City) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        Bill_Number,
        LR_Number,
        DateOfShipment,
        Status,
        Sender_City,
        Receiver_City,
      ]
    );
    return rows;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("A shipment with this Bill Number already exists.");
    } else {
      throw error;
    }
  }
};

export const deleteShipment = async (billNumber) => {
  const [result] = await pool.query(
    `DELETE FROM ${tableName} WHERE Bill_Number = ?`,
    [billNumber]
  );
  return result;
};
