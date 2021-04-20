const http = require('http');

const hostname = '127.0.0.1';
const port = 3018;

const express = require('express');
const app = express();

const fetch = require('node-fetch');

const es6Renderer = require('express-es6-template-engine');
app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

const server = http.createServer(app);

const db = require('./db');
const { url } = require('inspector');


app.get('/', (req, res) => {
    console.log(req.url);
    res.render('home', {
        locals: {
            title: "Address Book App"
        },
        partials: {
            head:'/partials/head'
        }
    });
});

app.get('/dogs', (req, res) => {
    console.log("request path is: "+ req.path);
    res.render('dogs', {
        locals: {
            dogs: db,
            path: req.path,
            title: "Dogs List"
        },
        partials: {
            head: '/partials/head'
        }
    })
   
});

app.get('/dogs/:slug', async(req, res) => {
    console.log("req params ",  req.params);
    var {slug} = req.params;
    console.log("the breed is" ,slug)
    var dog = db.find(thisDog => thisDog.slug === slug);

    if (dog){
        console.log(dog);
        
        if (dog.subBreed === null){
            var img = await fetch(`https://dog.ceo/api/breed/${dog.breed}/images/random`)

        .then(res => res.json())
        .then(json => json);
        console.log("the image is", img)

        res.render('dog', {
            locals: {
                dog,
                img,
                title: "Dog",
            },
            partials: {
                head: '/partials/head',
                image: '/partials/image'
            }
        })
        } else {

             var img = await fetch(`https://dog.ceo/api/breed/${dog.breed}/${dog.subBreed}/images/random`)

        .then(res => res.json())
        .then(json => json);
        console.log("second fetch the image is", img)
            
        res.render('dog', {
            locals: {
                dog,
                img,
                title: "Dog",
            },
            partials: {
                head: '/partials/head',
                image: '/partials/image'
            }
        })
            
        } 

        
        
    }
})


server.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}`)
});