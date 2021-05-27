const KoaRouter = require('koa-router');

const router = new KoaRouter();

function Hash(password) {
  let hash = 0;
  if (password.length === 0) {
    return hash;
  }

  for (let i = 0; i < password.length; i += 1) {
    const char = password.charCodeAt(i);
    hash = hash * 31 + char + char;
    hash += hash;
  }
  return hash;
}

router.get('landing_page', '/', async (ctx) => {
  ctx.session.currentUserID = null;

  await ctx.render('HTML/landing_page', {
    login_user_path: ctx.router.url('landing_page.post'),
    notice: ' ',
  });
});

router.post('landing_page.post', '/', async (ctx) => {
  const { name, password } = ctx.request.body;
  const user = await ctx.orm.usuario.findOne({ where: { name } });

  try {
    if (user.name === name && String(Hash(password)) === user.password) {
      ctx.session.currentUserID = user.id;
      const route = '/perfil';
      ctx.redirect(route);
    } else {
      const notice = 'Datos de usuario invalidos';
      await ctx.render('HTML/landing_page', {
        login_user_path: ctx.router.url('login.post'),
        notice,
      });
    }
  } catch (error) {
    const notice = 'Datos de usuario invalidos';
    await ctx.render('HTML/landing_page', {
      login_user_path: ctx.router.url('login.post'),
      notice,
    });
  }
});

module.exports = router;
