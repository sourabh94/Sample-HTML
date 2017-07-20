var indexPath = path.resolve( __dirname, '../' + process.env.PUBLIC_FOLDER )

router.get( '/:user/:stream/:slug', function( req, res, next ) {

    if ( req.headers['user-agent'].indexOf( 'facebook' ) != -1 ) {
        // stuff to handle the Facebook crawler
    } else return next()
})

router.get( '/*', function( req, res ) {
    express.static( indexPath )
})