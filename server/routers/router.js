const express = require('express')
const router = express.Router();

const controller = require('../controllers/controller');

router.get('/',controller.home);
router.get('/new-admission',controller.new);
router.get('/new_student/:id',controller.new2);
router.get('/transfer-admission',controller.transfer)
router.get('/cancel',controller.cancel);
router.get('/report',controller.report);
router.post('/form_submit',controller.dept);
router.get('/get-collection-count', controller.getCollectionCount);
router.post('/get_uid_details',controller.get_uid);
router.post('/transfer-submit',controller.transfer_admission);
// router.post('/report_id',controller.report_id)
router.post('/report_dept',controller.searchAndDateFind);
router.post('/cancel_uid_details',controller.cancel_uid);
router.get('/cancel_update/:dept/:uid',controller.update_uid);
router.get('/admission_cancel',controller.cancel_admission);
router.get('/cancel_reports',controller.cancel_reports);
router.get('/cancel_reports_date',controller.cancel_reports_date);
router.get('/cancel_reports_dept',controller.cancel_reports_dept);
router.post('/date_cancel_reports',controller.date_cancel_reports);
router.post('/dept_cancel_reports',controller.dept_cancel_reports);

// router.post('/date_find',controller.searchAndDateFind);

// admin router
router.get('/admin',controller.admin)
router.post('/update_limit',controller.update_limit)


module.exports = router;