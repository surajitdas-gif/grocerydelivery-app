const express = require('express');

const router = express.Router();

const Report =
  require('../models/Report');


// CREATE REPORT

router.post(
  '/create',
  async (req, res) => {

    try {

      const {
        userId,
        userName,
        issue,
      } = req.body;

      const newReport =
        new Report({
          userId,
          userName,
          issue,
        });

      await newReport.save();

      res.json({
        success: true,
        report: newReport,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
      });

    }
  }
);


// GET ALL REPORTS

router.get(
  '/all',
  async (req, res) => {

    try {

      const reports =
        await Report.find().sort({
          createdAt: -1,
        });

      res.json({
        success: true,
        reports,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
      });

    }
  }
);

module.exports = router;