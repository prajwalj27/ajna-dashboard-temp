/** @swagger
 *    components:
 *    schemas:
 *     Branch:
 *      type: object
 *      properties:
 *        branchId:
 *          type: string
 *          description: name of the branch
 *          example: 'unique string'
 *        branchName:
 *          type: string
 *          description: name of branch
 *          example: 'coimbatore'
 *        clientId:
 *          type: string
 *          description: clientId of client
 *          example: 'unique string'
 *        userType:
 *          type: string
 *          description: Type (for a branch type will always remain client)
 *          example: 'client'
 *        Mac_address:
 *          type: [string]
 *          description: device Mac Addresses
 *        isDefaultBranch:
 *          type: bool
 *          description: initially default branch true
 *          example: true
 *        isAdminAccepted:
 *          type: bool
 *          description: initially false on creating branch till admin accepts
 *          example: false
 *        modules:
 *          type: array
 *          description: Every branch will have modules
 *        NoOfCameras:
 *          type: int
 *          decription: Number Of Cameras available for a Particular branch
 *          example: 5
 *        camera:
 *          type: object
 *          description: Camera include camId,camName,camFrame
 *        device:
 *          type: object
 *          description: Devices include in branch
 *        location:
 *          type: string
 *          description: Location of branch
 *        configuration:
 *          type: object
 *          description: Configurations of branch
 *        dates:
 *          type: array
 *          description: Start and end date
 *        amount:
 *          type: int
 *          description: amount paid for branch
 *        subscribed:
 *          type: string
 *          description: Subscription for how many months/year
 *        description:
 *          type: string
 *          description: Description of client
 *
 */

/**
 * @swagger
 * /branch:
 *  post:
 *   summary: Create branch
 *   tags: [Branch]
 *   description: Add new branch
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Branch'
 *   responses:
 *    201:
 *     description: branch created succesfully
 *    500:
 *     description: failure in creating branch
 */

/**
 * @swagger
 * /branch/accept:
 *  get:
 *    summary: Get all branches accepted by admin
 *    tags: [Branch]
 *    description: Get all branches accepted by admin
 *    responses:
 *      '200':
 *        description: Recieved all branches accepted by admin
 */

/**
 * @swagger
 * /branch/{branchId}:
 *  delete:
 *   summary: delete branch by branchId
 *   tags: [Branch]
 *   description: delete branch by branchId
 *   parameters:
 *    - in: path
 *      name: branchId
 *      schema:
 *       type: string
 *      required: true
 *      description: branchId of the branch
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *       application/json:
 *         schema:
 *          $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/me/{id}:
 *  get:
 *   summary: get branch from branchID
 *   tags: [Branch]
 *   description: get branch from branchID
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: branchId of the branch
 *      example: 'dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /branch/{id}:
 *  get:
 *   summary: get branches from clientId
 *   tags: [Branch]
 *   description: Get branches of current client
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: clientId of the branch
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch:
 *  get:
 *   summary: Get branches which are not accepted by admin
 *   tags: [Branch]
 *   description: Get branches which are not accepted by admin
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/allconfigure/{id}:
 *  get:
 *   summary: get branch configurations from branchId
 *   tags: [Branch]
 *   description: get branch configurations from branchId
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: branchId of the branch
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/{id}:
 *  put:
 *   summary: update branch on admin accepted or rejected action
 *   tags: [Branch]
 *   description: update branch on admin accepted or rejected action
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: branchId of the branch
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch:
 *  put:
 *   summary: update mac address in branch
 *   tags: [Branch]
 *   description: update mac address in branch
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/configurezone/{id}:
 *  post:
 *   summary: add zone in camera
 *   tags: [Branch]
 *   description: add zone in camera
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: branchId of the branch
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/configurezone/{id}:
 *  get:
 *   summary: get configurations of zone in camera
 *   tags: [Branch]
 *   description: get configurations of zone in camera
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: branchId of the branch
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/configureSocial/{id}:
 *  post:
 *   summary: add social configurations in camera
 *   tags: [Branch]
 *   description: add social configurations in camera
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: branchId of the branch
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/configureSocial/{id}:
 *  get:
 *   summary: get social configurations of camera
 *   tags: [Branch]
 *   description: get social configurations of camera
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: branchId of the branch
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/configurepath/{id}/{type}:
 *  post:
 *   summary: add path configurations of camera
 *   tags: [Branch]
 *   description: add path configurations of camera
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/configurepath/{id}/{type}/{cameraid}:
 *  get:
 *   summary: get path configurations of camera
 *   tags: [Branch]
 *   description: get path configurations of camera
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/configure-image/{id}/{type}:
 *  get:
 *   summary: add camera images
 *   tags: [Branch]
 *   description: add camera images
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/camera/{id}:
 *  post:
 *   summary: post camera name,rtsp link,id
 *   tags: [Branch]
 *   description: post camera name,rtsp link,id
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/camera/{id}/{c_id}:
 *  delete:
 *   summary: delete camera from branch
 *   tags: [Branch]
 *   description: delete camera from branch
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/updatecamera/{id}/{c_id}:
 *  post:
 *   summary: update camera from branch
 *   tags: [Branch]
 *   description: update camera from branch
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/updatedevice/{id}/{c_id}:
 *  post:
 *   summary: update device from branch
 *   tags: [Branch]
 *   description: update device from branch
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/device/{id}/{device_id}:
 *  delete:
 *   summary: delete device from branch
 *   tags: [Branch]
 *   description: delete device from branch
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/camera/{id}/{type}:
 *  get:
 *   summary: get camera name,link,key
 *   tags: [Branch]
 *   description: get camera name,link,key
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/cameraFrame/{id}/{type}/{camera}:
 *  get:
 *   summary: get camera image
 *   tags: [Branch]
 *   description: get camera image
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/cameraName/{id}:
 *  get:
 *   summary: get camera name
 *   tags: [Branch]
 *   description: get camera name to avoid same camera name
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/device/{id}:
 *  post:
 *   summary: add device in branch table
 *   tags: [Branch]
 *   description: add device in branch table
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/device/{id}:
 *  get:
 *   summary: get device from branch table
 *   tags: [Branch]
 *   description: get device from branch table
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/allcamera/{id}/{type}:
 *  post:
 *   summary: post cameras
 *   tags: [Branch]
 *   description: post cameras
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/getcamera/{id}:
 *  get:
 *   summary: get camera of specific branch without image
 *   tags: [Branch]
 *   description: get camera of specific branch without image
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/mac-address:
 *  get:
 *   summary: update mac-address
 *   tags: [Branch]
 *   description: update mac-address
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/configurepath/{id}/{type}/{cameraid}:
 *  get:
 *   summary: get path configurations of camera
 *   tags: [Branch]
 *   description: get path configurations of camera
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      example: '1234'
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */

/**
 * @swagger
 * /branch/cameraimages/{branchid}:
 *  get:
 *   summary: get camera images of branch
 *   tags: [Branch]
 *   description: get camera images of branch
 *   parameters:
 *    - in: path
 *      name: branchid
 *      schema:
 *       type: string
 *      required: true
 *   responses:
 *    200:
 *     description: success
 *     content:
 *            application/json:
 *              schema:
 *               $ref: '#/components/schemas/Branch'
 */
