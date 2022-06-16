/**@swagger
 *  components:
 *  schemas:
 *   PathTracking_Analysis:
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
 *     PersonTimestamps:
 *      type: [date]
 *      description: count ->date in an array whenever person visit zone
 *      example: 5
 *     zone:
 *      type:string
 *      description:zone involved in object
 *      example:mens section
 */

/**
 * @swagger
 * /path-tracking:
 *  post:
 *   summary: get Post pathTracking of client
 *   tags: [PathTracking_Analysis]
 *   description: Post pathTracking of client
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /path-tracking/dates/{id}/{type}:
 *  post:
 *   summary: Post camera and get heatmap of client
 *   tags: [PathTracking_Analysis]
 *   description: Post camera and get heatmap of client
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: clientid
 *      example: 'c1234'
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /path-tracking:
 *  patch:
 *   summary: add coordinates or update array with new timestamp
 *   tags: [PathTracking_Analysis]
 *   description: add coordinates or update array with new timestamp
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: clientid
 *      example: 'c1234'
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /path-tracking/month/{id}/{type}:
 *  get:
 *   summary: get monthly impressions
 *   tags: [PathTracking_Analysis]
 *   description: get monthly impressions
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
 *      name: camera
 *      type: array
 *      required: true
 *      description: camera
 *      example: '0_dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *    - in: query
 *      name: month
 *      type: array
 *      required: true
 *      description: month
 *      example: '2021-04-20T06:29:58.860Z'
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /path-tracking/{id}:
 *  delete:
 *   summary: Delete path-tracking object with mongoUniqueId
 *   tags: [PathTracking_Analysis]
 *   description: Delete path-tracking object with mongoUniqueId
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/PathTracking_Analysis'
 *   responses:
 *    200:
 *     description: PathTracking Analysis data deleted
 *    500:
 *     description: Failure in PathTracking Analysis data deletion
 */
