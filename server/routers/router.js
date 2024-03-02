const express = require('express')
const router = express.Router();

const controller = require('../controllers/controller');



router.get('/',controller.login);//home page
router.get('/home',controller.home);//home page
router.post('/login',controller.login_fill);//login form 
router.get('/sign_up',controller.sign_form);//signup form
router.post('/signup_data',controller.signdata);//data for login find
router.get('/home',controller.home);//defalut home page
router.get('/new-admission',controller.new);//new admission 
router.get('/new_student/:id/:s_name',controller.new2);//redirct the new admission page
router.get('/transfer-admission',controller.transfer);//transfer-admission page 
router.get('/cancel',controller.cancel);//cancel page
router.get('/report',controller.report);//report page
router.post('/form_submit',controller.dept);//
router.get('/get-collection-count', controller.getCollectionCount);

router.post('/get_uid_details',controller.get_uid);

router.post('/transfer-submit',controller.transfer_admission);

router.post('/add_course',controller.courseAdd)

router.post('/report_dept', controller.searchAndDateFind);
router.post('/report_date',controller.report_date)



router.post('/cancel_uid_details',controller.cancel_uid);

router.get('/cancel_update/:dept/:uid',controller.update_uid);


router.get('/admission_reports',controller.admission_report);
router.get('/cancel_reports',controller.cancel_reports);
router.get('/cancel_reports_date',controller.cancel_reports_date);
router.get('/cancel_reports_dept',controller.cancel_reports_dept);
router.post('/date_cancel_reports',controller.date_cancel_reports);
router.post('/dept_cancel_reports',controller.dept_cancel_reports);

// admin router
// router.get('/admin',controller.admin);

router.get('/Powered_by', controller.Powered_by);


router.post('/updateAdmin', controller.updateAdmin)
// router.get('/exc',controller.excel)


router.post('/date_admission_reports',controller.date_admission_reports);
router.post('/dept_admission_reports',controller.dept_admission_report);

module.exports = router;





