const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dept_schema = new mongoose.Schema({
    date:{
        type:Date,
        require:true
    },
    cname:{
        type:String,
        require:true,
    },
    token:{
        type:Number,
        require:true,
    },
    s_name:{
        type:String,
        require:true
    },
    uid:{
        type:String,
        require:true,
    },
    fees:{
        type:Number,
        require:true,
    },
    in_dept:{
        type:Boolean,
    },
    balance:{
        typeof:Number,
    },
    cancel:{
        type:Boolean,
    }
});



const courseSchema =new Schema({

        title:{
            type:String
        }, 
        key:{
            type:String
        },
        fees:{
            type:Number
        },
        actualLimit:{
            type:Number
        },
        allortedLimit:{
            type:Number
        }
});


// const ba_tamil = mongoose.model('ba_tamil',dept_schema);
// const ba_english = mongoose.model('ba_english',dept_schema);
// const bsc_maths = mongoose.model('bsc_maths',dept_schema);
// const bsc_it = mongoose.model('bsc_it',dept_schema);
// const bsc_physics = mongoose.model('bsc_physics',dept_schema);
// const b_com = mongoose.model('b_com',dept_schema);
// const b_com_ca = mongoose.model('b_com_ca',dept_schema);
// const b_com_pa = mongoose.model('b_com_pa',dept_schema);
// const b_com_bi = mongoose.model('b_com_bi',dept_schema);
// const b_com_ba = mongoose.model('b_com_ba',dept_schema);

// const b_com_it = mongoose.model('b_com_it',dept_schema);
// const bba = mongoose.model('bba',dept_schema);
// const bsc_cs = mongoose.model('bsc_cs',dept_schema);
// const bsc_ct = mongoose.model('bsc_ct',dept_schema);
// const bca = mongoose.model('bca',dept_schema);
// const bsc_iot = mongoose.model('bsc_iot',dept_schema);
// const bsc_cs_aids = mongoose.model('bsc_cs_aids',dept_schema);
// const bsc_physical_education = mongoose.model('bsc_physical_education',dept_schema);
// const ma_tamil = mongoose.model('ma_tamil',dept_schema);
// const ma_english = mongoose.model('ma_english',dept_schema);

// const msc_cs = mongoose.model('msc_cs',dept_schema);
// const m_com = mongoose.model('m_com',dept_schema);
// const msc_it = mongoose.model('msc_it',dept_schema);
// const msc_physics = mongoose.model('msc_physics',dept_schema);
// const msc_chemistry = mongoose.model('msc_chemistry',dept_schema);
// const mba = mongoose.model('mba',dept_schema);
// const pgdca = mongoose.model('pgdca',dept_schema);
// const ca_foundation = mongoose.model('ca_foundation',dept_schema);


const setCourse = mongoose.model('Course',courseSchema);


// const name="ba_tamil";
// const model=mongoose.model(name);





// setCourse.find()
// .then((course_list)=>{

// for (let course of course_list) {
//         const model_name = course.title.toLowerCase().replace(/\s+/g, '_');
  
//         // Check if model already exists to avoid re-compilation error
//         let model;
//         if (mongoose.models[model_name]) {
//           model = mongoose.models[model_name];
//         } else {
//           model = mongoose.model(model_name, dept_schema);
//         }
  
//         console.log(`Model created for: ${model_name}`);
//         // You can do something with 'model' here if needed
//       }
//     })
//     console.log(mongoose.modelNames());


exports.setCourse=setCourse;
exports.dept_schema=dept_schema;
