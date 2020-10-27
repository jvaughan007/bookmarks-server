const express = require('express');
const { v4: uuid } = require('uuid');
const bookmarkRouter = express.Router();
const bodyParser = express.json();
const logger = require('../logger');
const { bookmarks } = require('../store');


bookmarkRouter
    .route('/bookmark')
    .get((req, res) => {
        res
            .json(bookmarks);
    })
    .post(bodyParser, (req, res) => {
        const { title, url, desc, rating, expanded } = req.body;

        if (!title) {
            logger.error('Title is required');
            return res
                .status(400)
                .send('Invalid Title');
        }
        
        if (!url) {
            logger.error('URL is required');
            return res
                .status(400)
                .send('Invalid URL');
        }
    
        if (!desc) {
            logger.error('Description is required');
            return res
                .status(400)
                .send('Invalid Description');
        }
    
        if (!rating) {
            logger.error('Rating is required');
            return res
                .status(400)
                .send('Invalid Rating');
        }
    
        if (!expanded) {
            logger.error('Expanded is required');
            return res
                .status(400)
                .send('Expanded was not included in the bookmark');
        }
    
        const id = uuid();
    
        const bookmark = {
            id,
            title,
            url,
            desc,
            rating,
            expanded
        };
    
        bookmarks.push(bookmark);
    
        logger.info(`Card with id ${id} created`);
    
        res
            .status(201)
            .location(`http://localhost:8000/card/${id}`)
            .json({id});
    });

bookmarkRouter
    .route('/bookmark/:id')
    .get((req, res) => {
        const { id } = req.params;
        const bookmark = bookmarks.find(b => b.id === id);
    
        // make sure we find a bookmark
        if (!bookmark) {
            logger.error(`Bookmark with id ${id} not found.`);
            return res
                .status(404)
                .send('Bookmark Not Found');
        }
        res.json(bookmark);
    })
    .delete((req, res) => {
        const { id } = req.params;

        const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id === id);
    
        if (bookmarkIndex < 0) {
            logger.error(`Bookmark with id ${id} not found.`);
            return res
                .status(404)
                .send('Bookmark Not Found');
        }
    
        
    
        bookmarks.splice(bookmarkIndex, 1);
    
        logger.info(`Bookmark with id ${id} deleted`);
        res
            .status(204)
            .end();
    });

module.exports = bookmarkRouter;