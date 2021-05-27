const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('perfil', '/', async (ctx) => {
  if (ctx.session.currentUserID === null) {
    ctx.redirect('/');
  }

  const state = true;

  if (state) {
    const identification = ctx.session.currentUserID;

    const userList = await ctx.orm.usuario.findAll();
    const ownerList = await ctx.orm.owner.findAll();
    const saveList = await ctx.orm.save.findAll();
    const postList = await ctx.orm.post.findAll();
    const test1 = (postList.length > 0) && (userList.length > 0);
    const savedTest = (saveList.length > 0);
    const ownerTest = (ownerList.length > 0);

    let userInfo;

    if (userList.length > 0) {
      userList.forEach((user) => {
        if (user.id === identification) {
          userInfo = JSON.parse(JSON.stringify(user));
        }
      });
    }

    const postedPosts = [];
    if (test1 && ownerTest) {
      ownerList.forEach((ownerRelation) => {
        if (ownerRelation.id_user === identification) {
          postList.forEach((post) => {
            if (post.id === ownerRelation.id_post) {
              postedPosts.push([post.url, post.id]);
            }
          });
        }
      });
    }

    const savedPosts = [];
    if (test1 && savedTest) {
      saveList.forEach((saveRelation) => {
        if (saveRelation.id_user === identification) {
          postList.forEach((post) => {
            if (post.id === saveRelation.id_post) {
              savedPosts.push([post.url, post.id]);
            }
          });
        }
      });
    }

    await ctx.render('HTML/perfil', {
      userInfo,
      postedPosts,
      savedPosts,
      new_post_path: ctx.router.url('new_post'),
      identification,
    });
  }
});

router.post('new_post', '/', async (ctx) => {
  if (ctx.request.body.type === 'new') {
    const post = ctx.orm.post.build({
      description: ctx.request.body.description,
      url: ctx.request.body.url,
    });
    await post.save();

    const postInstance = await ctx.orm.post.findOne({
      where: {
        description: ctx.request.body.description,
        url: ctx.request.body.url,
      },
    });

    const ownerRelation = await ctx.orm.owner.build({
      id_user: String(ctx.request.body.id),
      id_post: postInstance.id,
    });

    await ownerRelation.save();

    ctx.redirect('/perfil');
    ctx.body = ctx.request.body.id;
  }

  if (ctx.request.body.type === 'delete') {
    const userIdd = ctx.request.body.id;
    const postIdd = ctx.request.body.post_id;

    await ctx.orm.post.destroy({
      where: {
        id: postIdd,
      },
    });

    await ctx.orm.owner.destroy({
      where: {
        id_post: postIdd,
        id_user: userIdd,
      },
    });

    ctx.redirect('/perfil');
    ctx.request.body = ctx.request.body.id;
  }
});

module.exports = router;
