const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('feed', '/', async (ctx) => {
  if (ctx.session.currentUserID === null) {
    ctx.redirect('/');
  }

  // const identification = ctx.session.currentUserID;
  const identification = ctx.session.currentUserID;

  const postList = await ctx.orm.post.findAll();
  const ownerList = await ctx.orm.owner.findAll();
  const userList = await ctx.orm.usuario.findAll();
  const likeList = await ctx.orm.likes.findAll();
  const saveList = await ctx.orm.save.findAll();

  // logica para agregar el nombre del usuario que publico el post

  const test1 = (postList.length > 0) && (userList.length > 0);
  const likeTest = (likeList.length > 0);
  const savedTest = (saveList.length > 0);
  const ownerTest = (ownerList.length > 0);

  let listaFinal = [];
  const listaFinal1 = [];

  if (test1 && ownerTest) {
    postList.forEach((post) => {
      const tempList = [post.description, post.url, post.id];

      ownerList.forEach((ownerRelation) => {
        if (post.id === ownerRelation.id_post) {
          userList.forEach((user) => {
            if (user.id === ownerRelation.id_user) {
              tempList.push(user.name);
              listaFinal1.push(tempList.map((x) => x));
            }
          });
        }
      });
    });

    // logica para agregar la cantidad de likes, y si esta guardado/likeado o no

    const listaFinal2 = [];

    listaFinal1.forEach((post) => {
      let count = 0;
      let liked = false;
      let saved = false;

      if (likeTest) {
        likeList.forEach((likePair) => {
          if (post[2] === likePair.id_post) {
            count += 1;
            if (likePair.id_user === identification) {
              liked = true;
            }
          }
        });
      }

      if (savedTest) {
        saveList.forEach((savePair) => {
          if (post[2] === savePair.id_post) {
            if (savePair.id_user === identification) {
              saved = true;
            }
          }
        });
      }

      post.push(count);
      post.push(JSON.parse(JSON.stringify(liked)));
      post.push(JSON.parse(JSON.stringify(saved)));

      listaFinal2.push(JSON.parse(JSON.stringify(post)));
    });

    listaFinal = listaFinal2;
  }

  await ctx.render('HTML/feed', {
    listaFinal,
  });
});

module.exports = router;
