/**@swagger
 *  components:
 *  schemas:
 *   Heatmap_Analysis:
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
 *     Coordinates:
 *      type: [object]
 *      description: x,y,timestamp
 *      example: 10
 */

/**
 * @swagger
 * /heatmap:
 *  post:
 *   summary: post Heatmap of client
 *   tags: [Heatmap_Analysis]
 *   description: post Heatmap of client
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * /heatmap/dates/{id}/{type}:
 *  post:
 *   summary: Post camera and get heatmap of client based on selected date
 *   tags: [Heatmap_Analysis]
 *   description: Post camera and get heatmap of client based on selected date
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
 * /heatmap/month/{id}/{type}:
 *  get:
 *   summary: get monthly impressions /month/clientID
 *   tags: [Heatmap_Analysis]
 *   description: get monthly impressions /month/clientID
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
