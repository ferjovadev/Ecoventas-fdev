const ItemVenta = require('../models/itemVenta.model');

exports.getItemVentas = async (req, res) => {
  try {
    const itemVentas = await ItemVenta.find();
    res.json(itemVentas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createItemVenta = async (req, res) => {
  try {
    const itemVenta = new ItemVenta(req.body);
    await itemVenta.save();
    res.status(201).json(itemVenta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateItemVenta = async (req, res) => {
  try {
    const updatedItemVenta = await ItemVenta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItemVenta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteItemVenta = async (req, res) => {
  try {
    await ItemVenta.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
