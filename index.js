const { request, response } = require('express')
const express = require('express')
const uuid = require('uuid')

const port = 3001
const server = express()
server.use(express.json())

const ordem = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = ordem.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ mensage: "order not found" })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const checkMethodURL = (request, response, next) => {
    console.log(request.method)
    console.log(request.url)
    next()
}

server.post('/order', checkMethodURL, (request, response) => {
    const { order, nameClient, price, payment } = request.body

    const orders = { id: uuid.v4(), order, nameClient, price, payment, status: "Em preparação" }

    ordem.push(orders)

    return response.status(201).json(orders)
})

server.get('/order', checkMethodURL, (request, response) => {
    return response.json(ordem)
})

server.put('/order/:id', checkOrderId, checkMethodURL, (request, response) => {
    const index = request.orderIndex
    const id = request.orderId
    const { order, nameClient, price, payment } = request.body

    const orderUpdate = { id , order, nameClient, price, payment, status: "Em preparação" }

    ordem[index] = orderUpdate

    return response.json(orderUpdate)
})

server.delete('/order/:id', checkOrderId, checkMethodURL, (request, response) => {
    const index = request.orderIndex

    ordem.splice(index, 1)

    return response.status(204).json()
})

server.get('/order/:id', checkOrderId, checkMethodURL, (request, response) => {
    const index = request.orderIndex

    const orderConsult = ordem[index]

    return response.json(orderConsult)
})

server.patch('/order/:id', checkOrderId, checkMethodURL, (request, response) => {
    const index = request.orderIndex

    const order = ordem[index]
    order.status = "Pronto"

    return response.json(order)
})

server.listen(port, () => {
    console.log(`🟢  server on the port ${port}`)
})