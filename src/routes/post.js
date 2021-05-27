const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('post', '/:data', async (ctx) => {
  if (ctx.session.currentUserID === null) {
    ctx.redirect('/');
  }

  const ide = ctx.params.data;
  const identification = ctx.session.currentUserID;

  const post = await ctx.orm.post.findOne({ where: { id: ide } });
  const ownerRelation = await ctx.orm.owner.findOne({
    where: { id_post: ide },
  });

  const owner = await ctx.orm.usuario.findOne({ where: { id: ownerRelation.id_user } });

  let likes = await ctx.orm.likes.findAll({
    where: {
      id_post: ide,
    },
  });

  if (likes === null) {
    likes = 0;
  } else {
    likes = likes.length;
  }

  const likeState = await ctx.orm.likes.findOne({
    where: {
      id_user: identification,
      id_post: ide,
    },
  });

  const saveState = await ctx.orm.save.findOne({
    where: {
      id_user: identification,
      id_post: ide,
    },
  });

  let likeText = 'LIKE';
  let saveText = 'SAVE';

  if (likeState != null) {
    likeText = 'UNLIKE';
  }

  if (saveState != null) {
    saveText = 'UNSAVE';
  }

  await ctx.render('HTML/post', {
    post,
    owner,
    likes,
    identification,
    likeText,
    saveText,
    edit_state_path: ctx.router.url('post.update'),
  });
});

router.post('post.update', '/', async (ctx) => {
  const identification = ctx.session.currentUserID;
  const ide = ctx.request.body.id_post;

  if (ctx.request.body.stateName === 'like') {
    const likeState = await ctx.orm.likes.findOne({
      where: {
        id_user: identification,
        id_post: ide,
      },
    });

    if (likeState === null) {
      const likeRelation = ctx.orm.likes.build({
        id_user: identification,
        id_post: ide,
      });
      await likeRelation.save();
    } else {
      await ctx.orm.likes.destroy({
        where: {
          id_user: identification,
          id_post: ide,
        },
      });
    }
  }

  if (ctx.request.body.stateName === 'save') {
    const saveState = await ctx.orm.save.findOne({
      where: {
        id_user: identification,
        id_post: ide,
      },
    });

    if (saveState === null) {
      const saveRelation = ctx.orm.save.build({
        id_user: identification,
        id_post: ide,
      });
      await saveRelation.save();
    } else {
      await ctx.orm.save.destroy({
        where: {
          id_user: identification,
          id_post: ide,
        },
      });
    }
  }

  const direction = `/post/${String(ctx.request.body.id_post)}`;
  ctx.redirect(direction);
});

module.exports = router;
