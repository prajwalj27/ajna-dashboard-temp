/** @swagger
 * components:
 *   schemas:
 *     Admin:
 *      type: object
 *      required:
 *       email
 *       password
 *       name
 *       userType
 *      properties:
 *       name:
 *        type: string
 *        description: name of the admin
 *       email:
 *        type: string
 *        description: email of admin
 *       password:
 *        type: string
 *        description: password of admin
 *       userType:
 *        type: string
 *        description: Type (for a admin type will always remain admin)
 *      example:
 *       name: 'newAdmin'
 *       email: 'newadmin@gmail.com'
 *       password: '123456'
 *       userType: 'admin'
 */
/**
@swagger
tags:
  name: Admin
  description: API to manage your Admin.
 */

/**
 * @swagger
 * /admin:
 *  get:
 *   security:
 *    - bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *   summary: Lists all the Admin
 *   tags: [Admin]
 *   description: Admin
 *   responses:
 *     "200":
 *       description: The list of Admin
 */

/**
 * @swagger
 * /admin:
 *  post:
 *   summary: create admin
 *   tags: [Admin]
 *   requestBody:
 *     required: true
 *     content:
 *      application/json:
 *        schema:
 *          $ref: '#/definitions/Admin'
 *   responses:
 *    "200":
 *     description: Admin created succesfully
 *     content:
 *      application/json:
 *        schema:
 *          $ref: '#/definitions/Admin'
 *    "500":
 *     description: Failure in creating admin
 */

/**
 * @swagger
 * /{email}:
 *  delete:
 *   summary: delete admin by email
 *   tags: [Admin]
 *   parameters:
 *    - in: path
 *      name: email
 *      schema:
 *       type: string
 *       required: true
 *       description: email of the admin
 *       example: 'admin@gmail.com'
 *   responses:
 *    "204":
 *     description: Delete was successful.
 *    "404":
 *     description: Admin not found.
 */
