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

router.get('new_user', '/', async (ctx) => {
  await ctx.render('HTML/new_user', {
    new_user_path: ctx.router.url('new_user.post'),
    notice: ' ',
  });
});

router.post('new_user.post', '/', async (ctx) => {
  const { name, password, userpicture } = ctx.request.body;
  try {
    const nameLen = name.length;
    const passLen = password.length;
    const urlLen = userpicture.length;

    const existente = await ctx.orm.usuario.findOne({
      where: { name: ctx.request.body.name },
    });

    let existingStatus = false;

    if (existente === null) {
      existingStatus = true;
    }

    if (nameLen > 0 && passLen > 0 && urlLen > 0 && existingStatus) {
      const user = ctx.orm.usuario.build({
        name,
        password: Hash(password),
        userpicture,
      });
      await user.save();

      ctx.redirect('/');
    } else {
      await ctx.render('HTML/new_user', {
        notice: 'Datos de usuario invalidos',
      });
    }
  } catch (error) {
    await ctx.render('HTML/new_user', {
      notice: 'Datos de usuario invalidos',
      new_user_path: ctx.router.url('new_user.post'),
    });
  }
});

module.exports = router;
