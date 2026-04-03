const TestDrive = require('../models/TestDrive');

const createTestDrive = async (req, res) => {
  try {
    console.log('Received test drive data:', req.body);
    const { firstName, lastName, mobile, email, pincode, model, variant, dealership } = req.body;

    // Create test drive
    const testDrive = new TestDrive({
      userId: req.user.id,
      firstName,
      lastName,
      mobile,
      email,
      pincode,
      model,
      variant,
      dealership,
    });

    console.log('Saving test drive...');
    const savedTestDrive = await testDrive.save();
    console.log('Test drive saved:', savedTestDrive);

    res.status(201).json({ message: 'Test drive created successfully', testDrive: savedTestDrive });
  } catch (error) {
    console.error('Error saving test drive:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTestDrives = async (req, res) => {
  try {
    const testDrives = await TestDrive.find({ userId: req.user.id });
    res.json(testDrives);
  } catch (error) {
    console.error('Error fetching test drives:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createTestDrive, getTestDrives };
