/**@swagger
 *  components:
 *  schemas:
 *   User:
 *    type: object
 *    properties:
 *     clientId:
 *      type: string
 *      description: clientId of the client
 *      example: '63511cb9-dffc-4cdb-ba8d-91a02178a789'
 *     EmployeeId:
 *      type: string
 *      description: employee Id of the user
 *      example: '12345'
 *     name:
 *      type: string
 *      description: name of the client
 *      example: 'client'
 *     email:
 *      type: string
 *      description: email of admin
 *      example: 'user@gmail.com'
 *     password:
 *      type: string
 *      description: password of admin
 *      example: '123456'
 *     userType:
 *      type: string
 *      description: Type (for a admin type will always remain admin)
 *      example: 'client'
 *     modules:
 *      type: array
 *      description: modules involved
 *      example: 'mask detection'
 *     camera:
 *      type: object
 *      description: cameras of user
 *     notifications:
 *      type: array
 *      description: store notifications of user
 *     alertConfig:
 *      type: object
 *      description: alert configurations of user
 *     description:
 *      type: string
 *      description: description
 *     editAccess:
 *      type: array
 *      description: cameras that have edit access
 *     branches:
 *      type: array
 *      description: branches involved
 */

/**
 * @swagger
 * /users:
 *  get:
 *   summary: Get All Users
 *   tags: [User]
 *   description: Get All users
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /users/{id}:
 *  get:
 *   summary: Get users of Specific Client
 *   tags: [User]
 *   description: Get users of Specific Client
 *   parameters:
 *    - in: path
 *      name: id
 *      type: string
 *      required: true
 *      description: clientid
 *      example: '63511cb9-dffc-4cdb-ba8d-91a02178a789'
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /users/me/{id}:
 *  get:
 *   summary: Get data of specific user
 *   tags: [User]
 *   description: Get data of specific user
 *   parameters:
 *    - in: path
 *      name: id
 *      type: string
 *      required: true
 *      description: userId
 *      example: '86ca466a-49ac-4086-a248-586b3c75302a'
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /users/{id}:
 *  delete:
 *   summary: delete specific user
 *   tags: [User]
 *   description: delete specific user
 *   parameters:
 *    - in: path
 *      name: id
 *      type: string
 *      required: true
 *      description: userId
 *      example: '86ca466a-49ac-4086-a248-586b3c75302a'
 *   responses:
 *    200:
 *     description: success
 */
/**
 * @swagger
 * /users:
 *  post:
 *   summary: post user
 *   tags: [User]
 *   description: post user
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /users/edituser:
 *  post:
 *   summary: Update User
 *   tags: [User]
 *   description: Update User
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /users/{id}:
 *  put:
 *   summary: change user password
 *   tags: [User]
 *   description: change user password
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
 */

/**
 * @swagger
 * /users/cameraStatus/{id}:
 *  patch:
 *   summary: change camera status
 *   tags: [User]
 *   description: change camera status
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
 */

/**
 * @swagger
 * /users/getCameraStatus/{id}:
 *  get:
 *   summary: Get camera Status of Specific Client
 *   tags: [User]
 *   description: Get camera Status of Specific Client
 *   parameters:
 *    - in: path
 *      name: id
 *      type: string
 *      required: true
 *      description: clientid
 *      example: '63511cb9-dffc-4cdb-ba8d-91a02178a789'
 *   responses:
 *    200:
 *     description: success
 */
