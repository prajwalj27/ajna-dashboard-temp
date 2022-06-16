/**@swagger
 *  components:
 *  schemas:
 *   Footfall_Analysis:
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
 *     Current_Person_Count:
 *      type: int
 *      description: current count
 *      example: 10
 *     Total_Person_Count:
 *      type: int
 *      description: 21
 *      example: total count in particular zone
 *     Zone:
 *      type: string
 *      description: 1 camera might involve various zones
 *      example: mens section
 *     PercentValue:
 *      type: int
 *      description: Percent value of footfall analysis
 *      example: 3
 *     Density:
 *      type: string
 *      description: high/low
 *      example: high
 */

/**
 * @swagger
 * /footfall-analysis:
 *  post:
 *   summary: Footfall analysis new data
 *   tags: [Footfall_Analysis]
 *   description: new obj for the Footfall
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Footfall_Analysis'
 *   responses:
 *    201:
 *     description: Footfall Analysis new obj added succesfully
 *    500:
 *     description: failure in addming new obj of Footfall_Analysis
 */

/**
 * @swagger
 * /footfall-analysis/{id}:
 *  patch:
 *   summary: update  today's data of footfall
 *   tags: [Footfall_Analysis]
 *   description: update  today's data of footfall
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Footfall_Analysis'
 *   responses:
 *    201:
 *     description: Footfall Analysis data updated
 *    500:
 *     description: failure in updating obj of Footfall_Analysis
 */

/**
 * @swagger
 * /footfall-analysis/metoday/{id}/{type}:
 *  get:
 *   summary: Get footfallAnalysis of client
 *   tags: [Footfall_Analysis]
 *   description: Get footfallAnalysis of client
 *   parameters:
 *    - in: path
 *      name: id
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
 *      schema:
 *       $ref: '#/components/schemas/Footfall_Analysis'
 *   responses:
 *    200:
 *     description: Footfall Analysis data
 *    500:
 *     description: failure in recieving obj of Footfall_Analysis
 */

/**
 * @swagger
 * /footfall-analysis/all/{id}/{type}:
 *  get:
 *   summary: Get all footfallAnalysis data of client
 *   tags: [Footfall_Analysis]
 *   description: Get all footfallAnalysis data of client
 *   parameters:
 *    - in: path
 *      name: id
 *      type: string
 *      required: true
 *      description: branchId
 *      example: 'dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *    - in: path
 *      name: type
 *      type: string
 *      required: true
 *      description: user Type
 *      example: 'client'
 *    - in: query
 *      name: dates[]
 *      type: array
 *      required: true
 *      description: dates
 *      example: '[]'
 *    - in: query
 *      name: camera[]
 *      type: array
 *      required: true
 *      description: camera
 *      example: '0_dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *    - in: query
 *      name: page
 *      type: integer
 *      required: true
 *      description: page
 *      example: 0
 *      items:
 *       type:string
 *      schema:
 *       $ref: '#/components/schemas/Footfall_Analysis'
 *   responses:
 *    200:
 *     description: Footfall Analysis data
 *    500:
 *     description: failure in recieving obj of Footfall_Analysis
 */

/**
 * @swagger
 * /footfall-analysis/{id}:
 *  delete:
 *   summary: Delete footfall analysis object with mongoUniqueId
 *   tags: [Footfall_Analysis]
 *   description: Delete footfall analysis object with mongoUniqueId
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Footfall_Analysis'
 *   responses:
 *    200:
 *     description: Footfall Analysis data
 *    500:
 *     description: failure in recieving obj of Footfall_Analysis
 */

/**
 * @swagger
 * /footfall-analysis/weekly/{id}/{type}:
 *  get:
 *   summary: Get footfall-analysis weekly cordinates of client zone based
 *   tags: [Footfall_Analysis]
 *   description: Get footfall-analysis weekly cordinates of client zone based
 *   parameters:
 *    - in: path
 *      name: id
 *      type: string
 *      required: true
 *      description: branchId
 *      example: 'dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *    - in: path
 *      name: type
 *      type: string
 *      required: true
 *      description: user Type
 *      example: 'client'
 *    - in: query
 *      name: camera[]
 *      type: array
 *      required: true
 *      description: camera
 *      example: '0_dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *      schema:
 *       $ref: '#/components/schemas/Footfall_Analysis'
 *   responses:
 *    200:
 *     description: Footfall Analysis data
 *    500:
 *     description: failure in recieving obj of Footfall_Analysis
 */

/**
 * @swagger
 * /footfall-analysis/today/{id}/{type}:
 *  get:
 *   summary: Get footfall-analysis today coordinates based on zones of client
 *   tags: [Footfall_Analysis]
 *   description: Get footfall-analysis today coordinates based on zones of client
 *   parameters:
 *    - in: path
 *      name: id
 *      type: string
 *      required: true
 *      description: branchId
 *      example: 'dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *    - in: path
 *      name: userType
 *      type: string
 *      required: true
 *      description: user Type
 *      example: 'client'
 *    - in: query
 *      name: camera[]
 *      type: array
 *      required: true
 *      description: camera
 *      example: '0_dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *      schema:
 *       $ref: '#/components/schemas/Footfall_Analysis'
 *   responses:
 *    200:
 *     description: Footfall Analysis data
 *    500:
 *     description: failure in recieving obj of Footfall_Analysis
 */

/**
 * @swagger
 * /footfall-analysis/dates/{id}/{type}:
 *  post:
 *   summary: Get footfall-analysis data acc to range selected
 *   tags: [Footfall_Analysis]
 *   description: Get footfall-analysis data acc to range selected
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Footfall_Analysis'
 *   responses:
 *    200:
 *     description: Footfall Analysis data
 *    500:
 *     description: failure in recieving obj of Footfall_Analysis
 */
