import Sequelize from 'sequelize';
import _ from 'lodash';
import Faker from 'faker';

//DB config
const Conn = new Sequelize(
  'd9rq5jkab1r8j4',
  'aclcxznqrlsrie',
  'ZVzw126UCwKMKPYxcA4PM45ekh',
    {
      dialect : 'postgres',
      host : 'ec2-174-129-29-118.compute-1.amazonaws.com',
      dialectOptions: {
        ssl: true
      }
    }
  );

//check the connection
Conn
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });


var Post = Conn.define('post',{
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false
  },

});

var Comment = Conn.define('comment',{
  content: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Post.hasMany(Comment);
Comment.belongsTo(Post);

Conn.sync({ force: true }).then(()=> {
  _.times(10, ()=> {
    return Post.create({
      title: Faker.random.word(),
      content: Faker.lorem.word(),
    }).then(post => {
      return post.createComment({
        content: Faker.random.word()
      });
    });
  });
});

export default Conn;

