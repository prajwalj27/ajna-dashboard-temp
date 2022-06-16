const mongoose=require('mongoose')
const DummyDataSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    MaskDetection:[
        {userID:{
            type: String

        },
            Timestamp:{
                type: Date,
            },
            gateID:{
                type: String
            },
            Face_detected:{
                type:Boolean
            },
            Mask_detected:{
             type:Boolean
            },
            FaceImage: {
                type: String
            },
            Rtsp_link:{
                type: String
            },
            Gate_opened:{
                type:Boolean
            }
    }],
    FaceRecognition:[
        {
            Timestamp:{
                type: String,
        // default: Date.now()
            },
            gateID:{
                type: String
            },
            Person_Name:{
                type:String
            },
            FaceImage: {
                type: String
            },
            Rtsp_link:{
                type: String
            },
            Gate_opened:{
                type:Boolean
            }
    }],

    EmployeeDatabase:[
        {
        Person_Name:{
        type: String

        },
        Person_ID:{
        type: String,
            },
        Accessible_Gates:{
        type:[String]
            }
    }],
    ContactTracing:[
        {
            ClientID:{
        type: String
        },
        cameraID:{
        type: String,
            },
        Timestamp:{
        type:String
            },
        PersonID:{
        type: String
            },
        img:{
        type: String,
            },
        Contacted_PersonID:{
        type:String
            },
    }],
})
module.exports=Data=mongoose.model('data',DummyDataSchema)