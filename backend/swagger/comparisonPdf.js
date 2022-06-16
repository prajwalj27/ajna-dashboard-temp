/**
 * @swagger
 * /compare/footfallWeekVsWeenkend/{clientId}/{branchId}:
 *  post:
 *   summary: Post clientid and branchid and Get Visitor count week vs weekend
 *   tags: [Comparison]
 *   description: Post clientid and branchid and Get Visitor count week vs weekend
 *   parameters:
 *    - in: path
 *      name: clientId
 *      schema:
 *       type: string
 *      required: true
 *      description: clientid
 *      example: 'c1234'
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

/**
 * @swagger
 * /compare/footfallZones/{clientId}/{branchId}:
 *  post:
 *   summary: Post clientid and branchid and Get Zones
 *   tags: [Comparison]
 *   description: Post clientid and branchid and Get Zones
 *   parameters:
 *    - in: path
 *      name: clientId
 *      schema:
 *       type: string
 *      required: true
 *      description: clientid
 *      example: 'c1234'
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

/**
 * @swagger
 * /compare/zoneBased/{clientId}/{firstbranch}/{secondbranch}:
 *  get:
 *   summary: Compare Different Zones,branches
 *   tags: [Comparison]
 *   description: Compare Different Zones
 *   parameters:
 *    - in: path
 *      name: clientId
 *      schema:
 *       type: string
 *      required: true
 *      description: clientid
 *      example: '63511cb9-dffc-4cdb-ba8d-91a02178a789'
 *    - in: path
 *      name: firstbranch
 *      schema:
 *       type: string
 *      required: true
 *      description: First branchId
 *      example: 'dafc1b55-30d6-4a3f-b205-1214659f4b00'
 *    - in: path
 *      name: secondbranch
 *      schema:
 *       type: string
 *      required: true
 *      description: Second branchId
 *      example: '16db4b87-f7dd-4a16-86fd-d69d36bd139b'
 *    - in: query
 *      name: firstZone
 *      schema:
 *       type: string
 *      required: true
 *      description: firstZone
 *      example: 'first'
 *    - in: query
 *      name: secondZone
 *      schema:
 *       type: string
 *      required: true
 *      description: second zone
 *      example: 'top'
 *    - in: query
 *      name: month
 *      schema:
 *       type: string
 *      required: true
 *      description: month
 *      example: '2021-04-20T06:49:03.244Z'
 *   responses:
 *    200:
 *     description: success
 */
