const TestDrive = require('../models/TestDrive');
const { ensureAuthenticatedUser } = require('../library/authHelper');

const createTestDrive = async (req, res) => {
  try {
    const { firstName, lastName, mobile, email, pincode, model, variant, dealership } = req.body;

    const userId = ensureAuthenticatedUser(req, res);
    if (!userId) return;

    // Create test drive
    const testDrive = new TestDrive({
      userId,
      firstName,
      lastName,
      mobile,
      email,
      pincode,
      model,
      variant,
      dealership,
    });

    const savedTestDrive = await testDrive.save();

    res.status(201).json({ message: 'Test drive created successfully', testDrive: savedTestDrive });
  } catch (error) {
    console.error('Error saving test drive:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTestDrives = async (req, res) => {
  try {
    const userId = ensureAuthenticatedUser(req, res);
    if (!userId) return;

    const testDrives = await TestDrive.find({ userId });
    res.json(testDrives);
  } catch (error) {
    console.error('Error fetching test drives:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const cancelTestDrive = async (req, res) => {
  try {
    const userId = ensureAuthenticatedUser(req, res);
    if (!userId) return;
    const { id } = req.params;

    const deletedTestDrive = await TestDrive.findOneAndDelete({ _id: id, userId });

    if (!deletedTestDrive) {
      return res.status(404).json({ message: 'Test drive not found' });
    }

    return res.json({ message: 'Test drive cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling test drive:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createTestDrive, getTestDrives, cancelTestDrive };
