Admin:
http://18.224.39.103/#/pages/adminlogin

<!-- Once login with admin ...Create CLient option is there
Add client:
Fill add client form ,onSubmit
Client added (client table)
Default branch created (branch table)
 -->

<!--
name: String,
 email: String,
 password:String,
 userType:String,
 date: Date,
 -->

<!-- Client Table: -->

clientId:String,
name: String,
email: String,
password: String,
userType:String,
contact:Number,
location: String,
isActive:Boolean,
subscribed:String,
dates: [Date],
amount: Number,
country:String,
description: String,
branches:[Object],
users: [Object]

Branch Table:

branchId:String,
branchName:String,
clientId:String,
userType:String,
Mac_address:[String],
isDefaultBranch:Boolean,
isAdminAccepted:Boolean,
modules:[String],
NoOfCameras:Number,
deviceStatus:[Object],
camera: [
{
cameraId: String ,
key: Number ,
cameraName: String ,
deviceId: String ,
cameraStatus: Boolean ,
Link: String ,
deviceName: String ,
cameraFrame: String ,
},
],
device: [
{
deviceName: String ,
deviceId: String ,
macAddress: String ,
cameras: [String] ,
},
],
location:String,
image: String,
configuration: {
zone: [Object] ,
socialDistancing: [Object] ,
pathtracking: [Object] ,
},
dates: [Date],
amount:Number,
subscribed:String,
description: String

DefaultBranch value will be true initially when admin creates a branch . Default Password of all the accounts will be “123456”.

Eg. client@gmail.com account created by admin with password “123456”

Client :
http://18.224.39.103/#/pages/login

Client login with <email:client@gamil.com,pw:123456>
First add device and camera ,Client on top Right section ,Select Configurations->Add device and Camera.
Add device ->after filling form ,click on submit that device will be save in branch table (intially device array was empty on submitting new device,device array updated with new fields).  
Add Camera
Camera array will also be update in Branch table as user add new camera that branch table camera array will be updated.This camera object won’t having attribute cameraFrame.Once you add image into camera that object will be updated.

Add Images into Camera :(configure image inside configurations Page)
Once you add image in respective camera ,that image will be saved as cameraFrame in same camera object as we discussed in Step3.

For Path tracking Module.You can configure path tracking arrows and lines.

     Select configure PathTracking->select camera and then plot arrow and lines on it.   Path Tracking configurations will be saved in branch table under configurations as shown in image below.

Change Password : Client can change password which will be update in client Table.

Client Features

Create Branch:
On filling the form of Create branch .New branch will be created in branch table ,but isAdminAccepted key would remain false till admin accepts the branch with that reason client won’t be able to see the branch.
Once Admin accepts the branch that isAdminAccepted would change,Once it gets true Client would be able to see another branch .That all changes will be made in branch Table.
Create User :
On filling the form of Create User .New User will be created in User table ,having unique employeeId.
USER:

clientId:String,
EmployeeId:String,
modules: [String],
name: String,
email: String,
password:String,
userType: String,
camera: [Object]
notifications:[String],
alertConfig: { Object }
description: String,
editAccess:[String],
branches: [String],

User follow same flow difference is in querying the data based on camera allotted

Structure of FootfallAnalysis :

ClientID: String,
BranchID:String,
Timestamp:Date,
CameraID: String,
Current_Person_Count: Number,
Total_Person_Count:Number,
Zone: String,
PercentValue:Number,
Density: String,

Heatmap:

ClientID:String,
BranchID:String,
Timestamp:Date,
Coordinates: [
{ x: Number , y:Number , Timestamp: Date },
],
CameraID:String,

Path Tracking:

ClientID:String,
BranchID:String,
Timestamp:Date,
CameraID:String,
zone: String,
PersonTimestamps: [Date],

Dwell Time Analysis:
If person exit true,then only show in table and if threshold true then show alert that person crossed threshold.

ClientID: String,
Timestamp: Date,
CameraID: String,
BranchID: String,
passerBy: [{ PersonID: String, TimeSpent: Number, Timestamp: Date,Threshold:Boolean(initially false),IsPersonExit:Boolean(initially false) }],
Zone: String,

Notifications :
Priority for alert footfall, dwelltime...then low.If alert for camera,device then high.
ClientID: String,
BranchID: String,
CameraID: String",
message: String,
priority:String,
read_by: Array,
created_at: { type: Date, default: Date.now },
