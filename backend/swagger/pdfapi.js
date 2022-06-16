/**
 * @swagger
 * /pdf/footfallhourbased/{clientId}/{branchId}:
 *  get:
 *   security:
 *    - bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *   summary: Get Hour Based visitor count of client
 *   tags: [Pdf]
 *   description: Get Hour Based visitor count of client
 *   parameters:
 *    - in: path
 *      name: clientId
 *      type: string
 *      required: true
 *      description: clientid
 *      example: '63511cb9-dffc-4cdb-ba8d-91a02178a789'
 *    - in: path
 *      name: branchId
 *      type: string
 *      required: true
 *      description: branchId
 *      example: 'dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *    - in: query
 *      name: camera[]
 *      type: array
 *      required: true
 *      description: camera
 *      example: '0_dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *      items:
 *       type:string
 *    - in: query
 *      name: date
 *      type: string
 *      required: true
 *      description: date
 *      example: '2021-04-17'
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /pdf/footfallweekbased/{clientId}/{branchId}:
 *  get:
 *   summary: Get Week Based visitor count of client
 *   security:
 *    - bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *   tags: [Pdf]
 *   description: Get Week Based visitor count of client
 *   parameters:
 *    - in: path
 *      name: clientId
 *      type: string
 *      required: true
 *      description: client Id
 *      example: '63511cb9-dffc-4cdb-ba8d-91a02178a789'
 *    - in: path
 *      name: branchId
 *      type: string
 *      required: true
 *      description: branch Id
 *      example: 'dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *    - in: query
 *      name: camera[]
 *      type: array
 *      required: true
 *      description: camera
 *      example: '0_dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *      items:
 *       type:string
 *    - in: query
 *      name: date
 *      type: string
 *      required: true
 *      description: date
 *      example: 2021-16th
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /pdf/footfallmonthbased/{clientId}/{branchId}:
 *  get:
 *   security:
 *    - bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *   summary: Get Month Based visitor count of client
 *   tags: [Pdf]
 *   description: Get Month Based visitor count of client
 *   parameters:
 *    - in: path
 *      name: clientId
 *      type: string
 *      required: true
 *      description: clientid
 *      example: '63511cb9-dffc-4cdb-ba8d-91a02178a789'
 *    - in: path
 *      name: branchId
 *      type: string
 *      required: true
 *      description: branchId
 *      example: 'dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *    - in: query
 *      name: camera[]
 *      type: array
 *      required: true
 *      description: camera
 *      example: '0_dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *      items:
 *       type:string
 *    - in: query
 *      name: date
 *      type: string
 *      required: true
 *      description: date
 *      example: 2021-04-17T06:41:48.936Z
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /pdf/dwellTimehourbased/{clientId}/{branchId}:
 *  get:
 *   security:
 *    - bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *   summary: Get Hour Based time Spent in zone
 *   tags: [Pdf]
 *   description: Get Hour Based time Spent in zone
 *   parameters:
 *    - in: path
 *      name: clientId
 *      type: string
 *      required: true
 *      description: clientid
 *      example: '63511cb9-dffc-4cdb-ba8d-91a02178a789'
 *    - in: path
 *      name: branchId
 *      type: string
 *      required: true
 *      description: branchId
 *      example: 'dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *    - in: query
 *      name: camera[]
 *      type: array
 *      required: true
 *      description: camera
 *      example: '0_dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *      items:
 *       type:string
 *    - in: query
 *      name: date
 *      type: string
 *      required: true
 *      description: date
 *      example: '2021-04-17'
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /pdf/dwellTimeweekbased/{clientId}/{branchId}:
 *  get:
 *   security:
 *    - bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *   summary: Get Week Based time Spent in zone
 *   tags: [Pdf]
 *   description: Get Week Based time Spent in zone
 *   parameters:
 *    - in: path
 *      name: clientId
 *      schema:
 *       type: string
 *      required: true
 *      description: clientid
 *      example: '63511cb9-dffc-4cdb-ba8d-91a02178a789'
 *    - in: path
 *      name: branchId
 *      schema:
 *       type: string
 *      required: true
 *      description: branchId
 *      example: 'dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *    - in: query
 *      name: camera[]
 *      type: array
 *      required: true
 *      description: camera
 *      example: '0_dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *      items:
 *       type:string
 *    - in: query
 *      name: date
 *      type: string
 *      required: true
 *      description: date
 *      example: 2021-16th
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /pdf/dwellTimemonthbased/{clientId}/{branchId}:
 *  get:
 *   security:
 *    - bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *   summary: Get Month Based time Spent in zone
 *   tags: [Pdf]
 *   description: Get Month Based time Spent in zone
 *   parameters:
 *    - in: path
 *      name: clientId
 *      type: string
 *      required: true
 *      description: clientid
 *      example: '63511cb9-dffc-4cdb-ba8d-91a02178a789'
 *    - in: path
 *      name: branchId
 *      type: string
 *      required: true
 *      description: branchId
 *      example: 'dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /pdf/heatmap/{branchId}:
 *  post:
 *   summary: branchid and Get Heatmap
 *   tags: [Pdf]
 *   description: Post branchid and Get Heatmap
 *   parameters:
 *    - in: path
 *      name: branchId
 *      schema:
 *       type: string
 *      required: true
 *      description: branchId
 *      example: 'dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *    - in: query
 *      name: camera[]
 *      type: array
 *      required: true
 *      description: camera
 *      example: '0_dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *      items:
 *       type:string
 *    - in: query
 *      name: date
 *      type: string
 *      required: true
 *      description: date
 *      example: 2021-04-17T06:41:48.936Z
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /pdf/pathtracking/{branchId}:
 *  post:
 *   summary: branchid and Get Pathtracking
 *   tags: [Pdf]
 *   description: Post branchid and Get Pathtracking
 *   parameters:
 *    - in: path
 *      name: branchId
 *      schema:
 *       type: string
 *      required: true
 *      description: branchId
 *      example: 'c1234'
 *   responses:
 *    200:
 *     description: success
 */
