const KoaRouter = require('koa-router');

const feed = require('./routes/feed');
const landingPage = require('./routes/landing_page');
const perfil = require('./routes/perfil');
const post = require('./routes/post');
const nuevoUsuario = require('./routes/new_user');

const router = new KoaRouter();

router.use('/', landingPage.routes());
router.use('/feed', feed.routes());
router.use('/post', post.routes());
router.use('/perfil', perfil.routes());
router.use('/nuevo_usuario', nuevoUsuario.routes());

module.exports = router;
