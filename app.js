const express = require('express')
const expressGraphql = require("express-graphql")
const {GraphQLList,GraphQLSchema,GraphQLObjectType,GraphQLString,GraphQLInt,GraphQLNonNull, GraphQLInputObjectType, GraphQLFloat}=require('graphql')
const app= express();


const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const AuthorType= new GraphQLObjectType({
    name:"author",
    description:"This represents a written by a author ", 
    fields:()=>({
        id: {type:GraphQLNonNull(GraphQLInt)},
        name:{type:GraphQLNonNull(GraphQLString)},
        book:{type:new GraphQLList(BookType),
        resolve:(authors)=>{
            return books.filter(book=>book.authorId===authors.id)
        }}

    })
})


const BookType= new GraphQLObjectType({
    name:"book",
    description:"This represents a written by a author ",
    fields:()=>({
        id: {type:GraphQLNonNull(GraphQLInt)},
        name:{type:GraphQLNonNull(GraphQLString)},
        authorId:{type:GraphQLNonNull(GraphQLInt)},
        authors:{type:AuthorType,resolve:(book)=>{
            return authors.find(author=>author.id===book.authorId)
        }}

    })
})

const RootQueryType= new GraphQLObjectType({
    name:"query",
    description:"Root query",
    fields:()=>({

        book:{type:BookType,
            description:"Book",
            args:{
               id:{type:GraphQLInt}
            },
            resolve:(parents,args)=>books.find(book=>book.id===args.id) 
        },
        books:{type:new GraphQLList(BookType),
            description:"A list of books with authors",
            resolve:()=>books 
        },
        authors:{type:new GraphQLList(AuthorType),
            description:"A list of authors",
            resolve:()=>authors
        },
        author:{type:AuthorType,
            description:"A list of authors",
            args:{id:{type:GraphQLInt}},
            resolve:(parent,args)=>authors.find(author=>author.id===args.id)
        }
    })
})

const RootMutation= new GraphQLObjectType({
    name:"Mutation",
    description:"Root Mutation",
    fields:()=>({
        addBook:{
            type:BookType,
            description:"Add book",
            args:{
                name:{type:GraphQLNonNull(GraphQLString)},
                authorId:{type:GraphQLNonNull(GraphQLInt)}
            },
            resolve:(parents,args)=>{
                const book={
                    id:books.length+1,
                    name:args.name,
                    authorId:args.authorId
                }
                books.push(book)
                return book
            } 
        },
        addAuthor:{
            type:AuthorType,
            description:"Add Author",
            args:{
                name:{type:GraphQLNonNull(GraphQLString)}
            },
            resolve:(parents,args)=>{
                const author={
                    id:authors.length+1,
                    name:args.name,
                }
                authors.push(author)
                return author
            }
        }
    })
})

const schema =new GraphQLSchema ({
    query:RootQueryType ,
    mutation:RootMutation
})
app.use('/graphql',expressGraphql({
    graphiql:true
    ,schema:schema
}))
app.listen(5000,()=>console.log('Server is running'))