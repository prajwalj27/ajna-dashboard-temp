/**@swagger
 *  components:
 *  schemas:
 *   Dwell-Time_Analysis:
 *    type: object
 *    properties:
 *     ClientID:
 *      type: string
 *      description: clientId of client
 *      example: '123'
 *     BranchID:
 *      type: string
 *      description: client branchID
 *      example: 'branchid'
 *     Timestamp:
 *      type: date
 *      description: timestamp of particular object
 *      example: '09-09-2020T02:02:02.300Z'
 *     CameraID:
 *      type: string
 *      description: camera id
 *      example: 'c123'
 *     TimeSpent:
 *      type: int
 *      description: time spent in zonein ms
 *      example: 10
 *     PersonID:
 *      type: int
 *      description: person id
 *      example: 4
 *     Zone:
 *      type: string
 *      description: 1 camera might involve various zones
 *      example: mens section
 */

/**
 * @swagger
 * /dwell-time-analysis:
 *  post:
 *   summary: add dwell-time data
 *   tags: [Dwell-Time_Analysis]
 *   description: add dwell-time data
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Dwell-Time_Analysis'
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /dwell-time-analysis/{id}:
 *  delete:
 *   summary: Delete dwell-time-analysis object with mongoUniqueId
 *   tags: [Dwell-Time_Analysis]
 *   description: Delete dwell-time-analysis object with mongoUniqueId
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Dwell-Time_Analysis'
 *   responses:
 *    200:
 *     description: Footfall Analysis data
 *    500:
 *     description: failure in recieving obj of Footfall_Analysis
 */

/**
 * @swagger
 * /dwell-time-analysis/:id/:personId:
 *  patch:
 *   summary: update threshold dwell-time data
 *   tags: [Dwell-Time_Analysis]
 *   description:  update threshold dwell-time data
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Dwell-Time_Analysis'
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /dwell-time-analysis/{id}:
 *  delete:
 *   summary: Delete dwell-time-analysis object with mongoUniqueId
 *   tags: [Dwell-Time_Analysis]
 *   description: Delete dwell-time-analysis object with mongoUniqueId
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Dwell-Time_Analysis'
 *   responses:
 *    200:
 *     description: Footfall Analysis data
 *    500:
 *     description: failure in recieving obj of Footfall_Analysis
 */

/**
 * @swagger
 * /dwell-time-analysis/me/{id}:
 *  post:
 *   summary: get dwell-time data by posting branchid and camera
 *   tags: [Dwell-Time_Analysis]
 *   description: get dwell-time data by posting branchid and camera
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: branchId
 *      example: 'b1234'
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /dwell-time-analysis/weekly/{id}/{type}:
 *  get:
 *   summary: get weekly dwell-time data
 *   tags: [Dwell-Time_Analysis]
 *   description: get weekly dwell-time data
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: branchId
 *      example: 'dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *    - in: path
 *      name: type
 *      schema:
 *       type: string
 *      required: true
 *      description: type whether a client or a user
 *      example: 'client'
 *    - in: query
 *      name: camera[]
 *      type: array
 *      required: true
 *      description: camera
 *      example: '0_dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /dwell-time-analysis/todayme/{id}/{type}:
 *  get:
 *   summary: get today's dwell-time data
 *   tags: [Dwell-Time_Analysis]
 *   description: get today's dwell-time data by posting branchid and camera
 *   parameters:
 *    - in: path
 *      name: id
 *      type: string
 *      required: true
 *      description: branchId
 *      example: 'dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *    - in: path
 *      name: type
 *      schema:
 *       type: string
 *      required: true
 *      description: type whether a client or a user
 *      example: 'client'
 *    - in: query
 *      name: camera[]
 *      type: array
 *      required: true
 *      description: camera
 *      example: '0_dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /dwell-time-analysis/todayparserby/{id}/{type}:
 *  get:
 *   summary: get today's dwell-time data .Count denotes parsersby
 *   tags: [Dwell-Time_Analysis]
 *   description: get today's dwell-time data .Count denotes parsersby
 *   parameters:
 *    - in: path
 *      name: id
 *      type: string
 *      required: true
 *      description: branchId
 *      example: 'dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *    - in: path
 *      name: type
 *      schema:
 *       type: string
 *      required: true
 *      description: type whether a client or a user
 *      example: 'client'
 *    - in: query
 *      name: camera[]
 *      type: array
 *      required: true
 *      description: camera
 *      example: '0_dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /dwell-time-analysis/maxmin/{id}/{type}:
 *  get:
 *   summary: Post camera and get dwellTimeAnalysis max min and avg data of client
 *   tags: [Dwell-Time_Analysis]
 *   description: Post camera and get dwellTimeAnalysis max min and avg data of client
 *   parameters:
 *    - in: path
 *      name: id
 *      type: string
 *      required: true
 *      description: branchId
 *      example: 'dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *    - in: path
 *      name: type
 *      schema:
 *       type: string
 *      required: true
 *      description: type whether a client or a user
 *      example: 'client'
 *    - in: query
 *      name: camera[]
 *      type: array
 *      required: true
 *      description: camera
 *      example: '0_dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /dwell-time-analysis/pdf/{id}:
 *  post:
 *   summary: pdf
 *   tags: [Dwell-Time_Analysis]
 *   description: pdf
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: branchId
 *      example: 'b1234'
 *   responses:
 *    200:
 *     description: success
 */
