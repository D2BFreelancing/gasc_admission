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
// router.post('/date_find',controller.searchAndDateFind);

module.exports = router;