const express =
  require('express');

const router =
  express.Router();

const Address =
  require('../models/Address');


// ==========================================
// GET USER ADDRESS
// ==========================================

router.get('/:userId', async (req, res) => {

  try {

    const address =
      await Address.findOne({

        userId:
          req.params.userId,

        isDefault: true,
      });

    if (!address) {

      return res.json(null);
    }

    res.json(address);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });
  }
});


// ==========================================
// SAVE ADDRESS
// ==========================================

router.post('/save', async (req, res) => {

  try {

    const {

      userId,

      name,

      phone,

      altPhone,

      address,

      lat,

      lng,

    } = req.body;

    // REMOVE OLD DEFAULT

    await Address.updateMany(
      { userId },

      {
        isDefault: false,
      }
    );

    // CREATE NEW

    const newAddress =
      new Address({

        userId,

        name,

        phone,

        altPhone,

        address,

        lat,

        lng,

        isDefault: true,
      });

    await newAddress.save();

    res.json({
      success: true,
      address: newAddress,
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;