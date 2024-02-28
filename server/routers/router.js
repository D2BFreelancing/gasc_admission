const express = require('express')
const router = express.Router();

const controller = require('../controllers/controller');

//const {setCourse} = require("../models/models")

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

// router.post('/cancel_date',controller.report_date);

router.post('/cancel_uid_details',controller.cancel_uid);

router.get('/cancel_update/:dept/:uid',controller.update_uid);

// router.get('/cancel_reports',controller.cancel_report);

router.get('/admission_reports',controller.admission_report);
router.get('/cancel_reports',controller.cancel_reports);
// router.get('/fees_mapping',controller.fees_mapping);
router.get('/cancel_reports_date',controller.cancel_reports_date);
router.get('/cancel_reports_dept',controller.cancel_reports_dept);
router.post('/date_cancel_reports',controller.date_cancel_reports);
router.post('/dept_cancel_reports',controller.dept_cancel_reports);
// router.post('/date_find',controller.searchAndDateFind);

// admin router
// router.get('/admin',controller.admin);
router.post('/update_limit', controller.update_limit)
router.get('/Powered_by', controller.Powered_by);


router.post('/updateAdmin', controller.updateAdmin)
// router.get('/exc',controller.excel)


module.exports = router;



// const feesMapping = {
//     'BA Tamil':11400, 'BA English':12400,'B Com':17400,'B Com CA':17400,'B Com PA':17400,'B Com BI':16400,'B Com BA':16400,'B Com IT':17400,'BBA':15400,'BSC Maths':12400,'BSC Physics':12400,'BSC CS':19400,'BSC IT':19400,'BSC CT':17400,'BCA':19400,'BSC IOT':17400,'BSC CS AIDS':17400,'BSC Physical Education':13400,'MA Tamil':12950,'MA English':12950,'M Com':12950,'MSC CS':12950,'MSC IT':12950,'MSC Physics':14950,'MSC Chemistry':15950,'MBA':28950,'PGDCA':6050,
// };

// const uidMiddleMapping = {
//     'BA Tamil':'TL', 'BA English':'EL','B Com':'CO','B Com CA':'CC','B Com PA':'CP','B Com BI':'BI','B Com BA':'CB','B Com IT':'CI','BBA':'BA','BSC Maths':'MA','BSC Physics':'PH','BSC CS':'CS','BSC IT':'IT','BSC CT':'CT','BCA':'CA','BSC IOT':'OT','BSC CS AIDS':'AI','BSC Physical Education':'PE','MA Tamil':12,'MA English':10,'M Com':'03','MSC CS':'06','MSC IT':'09','MSC Physics':'08','MSC Chemistry':11,'MBA':13,'PGDCA':'05','CA Foundation':'CF'
// };



// const courseArray=[]

//const courseNames=Object.keys(feesMapping)
// courseNames.map((item)=>{
//     new setCourse({
//         "title":item,
//         "key":uidMiddleMapping[item],
//         "fees":feesMapping[item]
//     }).save()
// })

