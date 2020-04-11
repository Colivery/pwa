<property name="hibernate.dialect"  value="org.hibernate.spatial.dialect.postgis.PostgisDialect" />

OrderStatusEnum
 - TO_BE_DELIVERED
 - DELIVERED
 - CONSUMER_CANCELLED
 - ACCEPTED

User
 - uuid 
 - firstName string
 - lastName string 
 - street string
 - streetNo string
 - zipCode string 
 - city string
 - email string
 - location Geometry
 - locationGeoHash string
 - phone string
 - createdAt DateTime
 - updatedAt DateTime

 Order
 - uuid
 - userId 
 - driverUserId?
 - hint? string
 - maxPrice? int
 - status OrderStatusEnum
 - pickUpLocation Geometry
 - pickUpLocationGeoHash: string
 - createdAt DateTime
 - updatedAt DateTime

 OrderItem
 - uuid
 - orderId
 - description String


------

=== ORDERS

PATCH /v1/order/{order-id}/status
BODY
 {
     status
 }
RESPONSE
 empty

GET /v1/user/orders
BODY
 empty
RESPONSE
 [IUserOrderResponse, ...]

interface IUserOrderResponse {
    order: Order
    driver?: User /* only if status OrderStatusEnum.ACCEPTED */
}

GET /v1/user/orders-accepted
BODY
 empty
RESPONSE
 [IUserOrderAcceptedResponse, ...]

interface IUserOrderAcceptedResponse {
    order: Order
    consumer: User 
}

POST /v1/order
BODY
 {
    hint? string
    maxPrice? int
    pickUpLocation Geometry
    pickUpLocationGeoHash String
    items: [{
        description: String
    }, ...]
 }
RESPONSE
 Order

GET /v1/order?lat={lat}&lon={lon}&range={range}
BODY
 empty
RESPONSE
 [IUserOrderAcceptedResponse, ...]

interface IAnonymizedUser {
    zipCode 
    dropOffLocationGeoHash
}

interface IOrderResponse {
    distance: float
    order: Order
    consumer: IAnonymizedUser 
}

=== USERS

DELETE /v1/user
BODY
 empty
RESPONSE
 empty

GET /v1/user
BODY
 empty
RESPONSE
 User

PUT /v1/user
BODY
 User
RESPONSE
 