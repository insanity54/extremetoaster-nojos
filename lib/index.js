import express from 'express';
import hbs from 'hbs';
import Sequelize from 'Sequelize';

const app = express();


var database_username = process.env.PGUSER;
var database_password = process.env.PGPASSWORD;
var database_host = process.env.PGHOST;
var database = process.env.PGDATABASE;

if (typeof database_username === 'undefined') throw new Error('PGUSER is undefined in environment');
if (typeof database_password === 'undefined') throw new Error('PGPASSWORD is undefined in environment');
if (typeof database_host === 'undefined') throw new Error('PGHOST is undefined in environment');
if (typeof database === 'undefined') throw new Error('PGDATABASE is undefined in environment');


const sequelize = new Sequelize('nojos', database_username, database_password, {
  host: database_host,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false
});

const Student = sequelize.define('student', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    birthday: {
        type: Sequelize.DATE,
        allowNull: true,
    }
});

//const Inventory = sequelize.define('inventory', {
//    items: Sequelize.ARRAY(Sequelize.TEXT)
//});

sequelize.sync()
         .then(() => Student.create({
             username: 'janedoe',
             birthday: new Date(1980, 6, 20)
         }))
         .then(jane => {
             console.log(jane.toJSON());
         });



app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/inventory', function(req, res) {
    res.render('inventory');
});

app.listen(8888, function () {
    console.log('Ready');
});
