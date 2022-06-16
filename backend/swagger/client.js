/** @swagger
 *   components:
 *   schemas:
 *    Client:
 *      type: object
 *      properties:
 *       clientId:
 *        type: string
 *        description: clientId of the admin
 *        example: '63511cb9-dffc-4cdb-ba8d-91a02178a789'
 *       name:
 *        type: string
 *        description: name of the client
 *        example: 'client'
 *       email:
 *        type: string
 *        description: email of admin
 *        example: 'newadmin@gmail.com'
 *       password:
 *        type: string
 *        description: password of admin
 *        example: '123456'
 *       userType:
 *        type: string
 *        description: Type (for a admin type will always remain admin)
 *        example: 'client'
 *       contact:
 *        type: int
 *        description: contact number of client
 *        example: '9999999999'
 *       location:
 *        type: string
 *        description: Location of client
 *        example: 'jalandhar'
 *       isActive:
 *        type: bool
 *        description: check status if client is active then only can signin
 *        example: 'client'
 *       subscribed:
 *        type: string
 *        description: Duration of subscription
 *        example: '5 years'
 *       dates:
 *        type: array
 *        description: from - to
 *        example: 'dates'
 *       amount:
 *        type: int
 *        description: amount paid
 *        example: '10000'
 *       country:
 *        type: string
 *        description: client's country
 *        example: 'ohio'
 *       description:
 *        type: string
 *        description: client's description
 *        example: 'description'
 */

/**
 * @swagger
 * /clients:
 *  get:
 *   security:
 *    - bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *   summary: Get all client
 *   tags: [Client]
 *   description: Get all client
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * path:
 *  /client/{id}:
 *    get:
 *      summary: Gets a Profile by id
 *      tags: [Client]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The client id
 *      responses:
 *        "200":
 *          description: The client profile.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Client'
 *        "404":
 *          description: client not found.
 */

/**
 * @swagger
 * /client:
 *  post:
 *   summary: create client
 *   tags: [Client]
 *   requestBody:
 *     required: true
 *     content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/Client'
 *   responses:
 *    "200":
 *     description: Client created succesfully
 *     content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/Client'
 *    "500":
 *     description: Failure in creating client
 */

/**
 * @swagger
 * /{id}:
 *  delete:
 *   summary: delete client by clientid
 *   tags: [Client]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *       required: true
 *       description: id of the client
 *   responses:
 *    "204":
 *     description: Delete was successful.
 *    "404":
 *     description: Client not found.
 */

/**
 * @swagger
 * /client/all:
 *  get:
 *   summary: Lists all the Client of specific Admin
 *   tags: [Client]
 *   description: Clients of Specific Admin
 *   responses:
 *     "200":
 *       description: The list of Client
 */

/**
 * @swagger
 * /client/{id}:
 *  put:
 *   summary: change client password
 *   tags: [Client]
 *   description: change client password
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *   responses:
 *    200:
 *     description: success
 */
