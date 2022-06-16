/**
 * @swagger
 * /auth:
 *  get:
 *   security:
 *    - bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *   summary: Provide Authentication
 *   tags: [Auth]
 *   description: Provide Authentication
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /auth/admin:
 *  post:
 *   summary: Login Admin
 *   tags: [Auth]
 *   description: Login Admin
 *   requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          email:
 *           type: string
 *           example: "admin@gmail.com"
 *          password:
 *           type: string
 *           example: "123456"
 *          userType:
 *           type: string
 *           example: "admin"
 *   responses:
 *    200:
 *     description: success
 *    400:
 *     description :Failure Occur
 */

/**
 * @swagger
 * /auth/client:
 *  post:
 *   summary: Login Client
 *   tags: [Auth]
 *   description: Login Client
 *   requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          email:
 *           type: string
 *           example: "client@gmail.com"
 *          password:
 *           type: string
 *           example: "123456"
 *          userType:
 *           type: string
 *           example: "client"
 *   responses:
 *    200:
 *     description: success
 *    400:
 *     description :Failure Occur
 */

/**
 * @swagger
 * /auth:
 *  post:
 *   summary: Login User
 *   tags: [Auth]
 *   description: Login User
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *         $ref: '#/components/schema/User'
 *         properties:
 *           email:
 *             type: string
 *           password:
 *             type: string
 *             format: password
 *      required:
 *           - email
 *           - password
 *   responses:
 *    200:
 *     description: User Login succesfully
 *    404:
 *     description: User not found
 *    500:
 *     description: Invalid Credential
 */
