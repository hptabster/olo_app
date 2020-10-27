import supertest from 'supertest';
const request = supertest('https://jsonplaceholder.typicode.com/');

import pkg from 'chai';
const { should } = pkg.should();


describe('Olo Posts', () => {

  const postKeys = ['userId', 'id', 'title', 'body'];
  const commentKeys = ['email', 'id', 'name', 'body', 'postId'];
  const photoKeys = ['albumId', 'id', 'title', 'url', 'thumbnailUrl'];
  const albumKeys = ['userId', 'id', 'title'];
  const todoKeys = ['userId', 'id', 'title', 'completed'];
  const postHeaders = { 'Content-type': 'application/json; charset=UTF-8' };

  it('GET /posts - all posts', (done) => {
    request.get('posts').end((err, res) => {
      res.status.should.be.equal(200);
      res.body.should.not.be.empty;
      const posts = res.body;
      posts.should.not.be.empty;
      posts.forEach(item => {
        item.should.have.all.keys(postKeys);
        item.userId.should.not.be.null;
        item.id.should.be.a('number');
        item.title.should.be.a('string');
        item.body.should.be.a('string');
      });
      done();
    });
  });

  it('GET /posts/ - valid ids', (done) => {
    const postIds = [ 1, 10, 99 ];
    postIds.forEach(postId => {
      request.get('posts/' + postId).end((err, res) => {
        res.status.should.be.equal(200);
        res.body.should.not.be.empty;
        const post = res.body;
        post.should.not.be.empty;
        post.should.have.all.keys(postKeys);
        post.userId.should.not.be.null;
        post.id.should.be.a('number');
        post.id.should.equal(postId);
        post.title.should.be.a('string');
        post.body.should.be.a('string');
      });
    });
    done();
  });

  it('GET /posts/ - resource filtering', (done) => {
    const userIds = [ 1, 10 ];
    userIds.forEach(userId => {
      request.get('posts/?userId=' + userId).end((err, res) => {
        res.status.should.be.equal(200);
        res.body.should.not.be.empty;
        const posts = res.body;
        posts.should.not.be.empty;
        posts.forEach(post => {
          post.should.have.all.keys(postKeys);
          post.userId.should.not.be.null;
          post.userId.should.equal(userId);
          post.id.should.be.a('number');
          post.title.should.be.a('string');
          post.body.should.be.a('string');
        });
      });
    });
    done();
  });

  it('GET /posts/ - resource filtering, no match', (done) => {
    const userIds = [ 'zzz', 9999, -1 ];
    userIds.forEach(userId => {
      request.get('posts/?userId=' + userId).end((err, res) => {
        res.status.should.be.equal(200);
        res.body.should.be.empty;
      });
    });
    done();
  });

  it('GET /posts/ - invalid ids', (done) => {
    const postIds = [ '-1', '0', '999999', 'non-numeric', '1/1', '/ff' ];
    postIds.forEach(postId => {
      request.get('posts/' + postId).end((err, res) => res.status.should.be.equal(404));
    });
    done();
  });

  it('POST /post - valid', (done) => {
    const myData = [
      {
        title: 'my title',
        body: 'my body',
        userId: 14
      },
      {
        title: 'my title',
        body: 'my body',
        userId: 'non-numeric'
      },
      {
        body: 'my body',
      },
      {
        title: 'my title',
      },
      {
        userId: 'non-numeric'
      },
      {
        new: 'new field'
      },
      {},
    ];
    myData.forEach(data => {
      request.post('posts')
      .set(postHeaders)
      .send(data)
      .end((err, res) => {
        res.status.should.be.equal(201);
        res.body.should.not.be.empty;
        const post = res.body;
        var myPostKeys = Object.keys(data);
        myPostKeys.forEach(postKey => {
          post[postKey].should.equal(data[postKey]);
        });
        post.id.should.be.a('number');
        myPostKeys.push('id');
        post.should.have.all.keys(myPostKeys);
      });
    });
    done();
  });

  it('POST /post - invalid', (done) => {
    const myData = [
      {
        title: 'my title',
        body: 'my body',
        userId: 14,
        id: 14
      },
    ];
    myData.forEach(data => {
      request.post('posts')
      .set(postHeaders)
      .send(data)
      .end((err, res) => {
        res.status.should.be.equal(201);
      });
    });
    done();
  });

  it('PUT /post - valid', (done) => {
    const myData = [
      {
        title: 'my title',
        body: 'my body',
        userId: 14,
        id: 3
      },
      {
        title: 'my title',
        userId: 14,
        id: 3
      },
      {
        new: 'new field',
        id: 5
      },
    ];
    myData.forEach(data => {
      request.put('posts/' + data.id)
      .set(postHeaders)
      .send(data)
      .end((err, res) => {
        res.status.should.be.equal(200);
        res.body.should.not.be.empty;
        const post = res.body;
        var myPostKeys = Object.keys(data);
        myPostKeys.forEach(postKey => {
          post[postKey].should.equal(data[postKey]);
        });
        post.id.should.be.a('number');
        post.should.have.all.keys(myPostKeys);
      });
    });
    done();
  });

  it('PUT /post - invalid', (done) => {
    const myData = [
      {
        title: 'my title',
        body: 'my body',
        userId: 'non-numeric',
        id: 0
      },
      {
        body: 'my body',
        id: 101
      },
      {
        title: 'my title',
        id: 300
      },
      {
        userId: 'non-numeric',
        id: 3000
      },
    ];
    myData.forEach(data => {
      request.put('posts/' + data.id)
      .set(postHeaders)
      .send(data)
      .end((err, res) => {
        res.status.should.be.equal(500);
      });
    });
    done();
  });

  it('PATCH /post - valid', (done) => {
    const myData = [
      {
        title: 'my title',
        body: 'my body',
        userId: 14,
        id: 3
      },
      {
        title: 'my title',
        userId: 14,
        id: 3
      },
    ];
    myData.forEach(data => {
      request.patch('posts/' + data.id)
      .set(postHeaders)
      .send(data)
      .end((err, res) => {
        res.status.should.be.equal(200);
        res.body.should.not.be.empty;
        const post = res.body;
        var myPostKeys = Object.keys(data);
        myPostKeys.forEach(postKey => {
          post[postKey].should.equal(data[postKey]);
        });
        post.id.should.be.a('number');
        post.should.have.all.keys(postKeys);
      });
    });
    done();
  });


  it('PATCH /post - invalid', (done) => {
    const myData = [
      {
        title: 'my title',
        body: 'my body',
        userId: 'non-numeric',
        id: 0
      },
      {
        body: 'my body',
        id: 101
      },
      {
        new: 'new field',
        id: 500
      },
    ];
    myData.forEach(data => {
      request.patch('posts/' + data.id)
      .set(postHeaders)
      .send(data)
      .end((err, res) => {
        res.status.should.be.equal(200);
      });
    });
    done();
  });

  it('DELETE /post - valid', (done) => {
    const ids = [ 1, 99, 0, 101 ];
    ids.forEach(id => {
      request.delete('posts/' + id)
      .end((err, res) => {
        res.status.should.be.equal(200);
      });
    });
    done();
  });


  it('DELETE /post - invalid', (done) => {
    const ids = [ 'non-id', 999999 ];
    ids.forEach(id => {
      request.delete('posts/' + id)
      .end((err, res) => {
        res.status.should.be.equal(200);
      });
    });
    done();
  });

  it('GET /posts/<id>/comments - nested resources', (done) => {
    const postIds = [ 3, 7, 99 ];
    postIds.forEach(postId => {
      request.get('posts/' + postId + '/comments').end((err, res) => {
        res.status.should.be.equal(200);
        const comments = res.body;
        comments.should.not.be.empty;
        comments.forEach(item => {
          item.should.have.all.keys(commentKeys);
          item.postId.should.equal(postId);
          item.id.should.be.a('number');
          item.email.should.be.a('string');
          item.body.should.be.a('string');
        });
      });
    });
    done();
  });

  it('GET /posts/<id>/comments - nested resources invalid id', (done) => {
    const postIds = [ -1, 9999, 'abc' ];
    postIds.forEach(postId => {
      request.get('posts/' + postId + '/comments').end((err, res) => {
        res.status.should.be.equal(200);
        res.body.should.be.empty;
      });
    });
    done();
  });

  it('GET /albums/<id>/photos - nested resources', (done) => {
    const albumIds = [ 3, 7, 99 ];
    albumIds.forEach(albumId => {
      request.get('albums/' + albumId + '/photos').end((err, res) => {
        res.status.should.be.equal(200);
        const photos = res.body;
        photos.should.not.be.empty;
        photos.forEach(item => {
          item.should.have.all.keys(photoKeys);
          item.albumId.should.be.equal(albumId);
          item.id.should.be.a('number');
          item.title.should.be.a('string');
          item.url.should.be.a('string');
          item.thumbnailUrl.should.be.a('string');
        });
      });
    });
    done();
  });

  it('GET /albums/<id>/photos - nested resources invalid id', (done) => {
    const albumIds = [ -1, 9999, 'abc' ];
    albumIds.forEach(albumId => {
      request.get('albums/' + albumId + '/photos').end((err, res) => {
        res.status.should.be.equal(200);
        res.body.should.be.empty;
      });
    });
    done();
  });

  it('GET /users/<id>/albums - nested resources', (done) => {
    const userIds = [ 3, 7, 10 ];
    userIds.forEach(userId => {
      request.get('users/' + userId + '/albums').end((err, res) => {
        res.status.should.be.equal(200);
        const albums = res.body;
        albums.should.not.be.empty;
        albums.forEach(item => {
          item.should.have.all.keys(albumKeys);
          item.userId.should.be.a('number');
          item.id.should.be.a('number');
          item.title.should.be.a('string');
        });
      });
    });
    done();
  });

  it('GET /users/<id>/albums - nested resource invalid id', (done) => {
    const userIds = [ -1, 999909, 'xyz' ];
    userIds.forEach(userId => {
      request.get('users/' + userId + '/albums').end((err, res) => {
        res.status.should.be.equal(200);
        res.body.should.be.empty;
      });
    });
    done();
  });

  it('GET /users/<id>/todos - nested resources', (done) => {
    const userIds = [ 3, 7, 10 ];
    userIds.forEach(userId => {
      request.get('users/' + userId + '/todos').end((err, res) => {
        res.status.should.be.equal(200);
        const todos = res.body;
        todos.should.not.be.empty;
        todos.forEach(item => {
          item.should.have.all.keys(todoKeys);
          item.userId.should.equal(userId);
          item.id.should.be.a('number');
          item.title.should.be.a('string');
          item.completed.should.be.a('boolean');
        });
      });
    });
    done();
  });

  it('GET /users/<id>/todos - nested resources invalid id', (done) => {
    const userIds = [ -1, 999909, 'xyz' ];
    userIds.forEach(userId => {
      request.get('users/' + userId + '/todos').end((err, res) => {
        res.status.should.be.equal(200);
        res.body.should.be.empty;
      });
    });
    done();
  });

  it('GET /users/<id>/posts - nested resources', (done) => {
    const userIds = [ 3, 7, 10 ];
    userIds.forEach(userId => {
      request.get('users/' + userId + '/posts').end((err, res) => {
        res.status.should.be.equal(200);
        const posts = res.body;
        posts.should.not.be.empty;
        posts.forEach(item => {
          item.should.have.all.keys(postKeys);
          item.userId.should.be.equal(userId);
          item.id.should.be.a('number');
          item.title.should.be.a('string');
          item.body.should.be.a('string');
        });
      });
    });
    done();
  });

  it('GET /users/<id>/posts - nested resources invalid id', (done) => {
    const userIds = [ -1, 999909, 'xyz' ];
    userIds.forEach(userId => {
      request.get('users/' + userId + '/posts').end((err, res) => {
        res.status.should.be.equal(200);
        res.body.should.be.empty;
      });
    });
    done();
  });

});
