const express = require( 'express' )
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 8000
require( 'dotenv' ).config()

let db
let dbConnectionStr = process.env.DB_STRING
let dbName = 'monster-hunter-api'

MongoClient.connect(dbConnectionStr)
	.then( client => {
		console.log( `Welcome to the ${dbName}!` )
		db = client.db(dbName)
	})

// MIDDLEWARE - Manipulates the data as it passes through
app.set( 'view engine', 'ejs' ) // Tells express we will be using ejs as our view engine
app.use( express.static( 'public' ) )
app.use( express.urlencoded( { extended: true } ) )
app.use( express.json() )
// END OF MIDDLEWARE

// READ (cRud)
app.get('/', (request,response) => {
	db.collection( 'monsters' ).find().toArray()
	 .then( data => {
		// let nameList = data.map( x => item.name )
		// console.log(nameList)
		// console.log(data)
		response.render( 'index.ejs', {monsters: data} )
	 })
	 .catch( error => console.log( error ) )
})

// CREATE (Crud)
app.post('/api', (request, response) => {
	console.log( 'Post started' )
	request.body.name = request.body.name.toLowerCase()
	db.collection( 'monsters' ).insertOne(
		request.body
	)
	.then( result => {
		// console.log( result )
		response.redirect( '/' )
	})
})

// UPDATED (crUd)
app.put('/updateEntry', (request,response) => {
	
	// Don't include fields that don't have a value
	Object.keys(request.body).forEach(key => {
		if( request.body[key] === null || request.body[key] === undefined || request.body[key] === "" )
		{
			delete request.body[key]
		}
	})

	db.collection( 'monsters' ).findOneAndUpdate(
		{ name: request.body.name },
		{
			$set: request.body
		}
	)
	.then( result => {
		console.log(request.body)
		response.json('Success')
	})
	.catch( error => console.log(error) )
})

// DELETE (cruD)
app.delete('/deleteEntry', (request,response) => {
	db.collection( 'monsters' ).deleteOne({name: request.body.name})
		.then( result => {
			console.log( 'Entry Deleted' )
			response.json( 'Entry Deleted' )
		})
		.catch( error => console.log( error ))
})

// SET UP LOCALHOST ON PORT
app.listen( process.env.PORT || PORT,  () => {
	console.log( `Server is running on port ${PORT}` );
}) 