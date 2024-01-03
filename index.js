const express = require('express')
const app = express()
const db = require('./database.js')
const cors = require('cors')

//middleware
app.use(express.json())
app.use(cors())

app.get('/', function(req, res){
    res.writeHead(200).end("Page d'accueil")
});

app.get('/users', async (req, res) => {
    const result = await db.query('SELECT * FROM users');
    res.status(200).json(result);
});

app.get('/users/:id', async (req, res)=>{
    const idUser = req.params.id
    const connection = await db.getConnection();
    const rows = await connection.query('SELECT * FROM users WHERE id=?', [idUser]);
    res.writeHead(200).end(`Page user n°${idUser}`)
    connection.release();
    // Pour que l'utilisateur modifie ses données
    let html = '<html><head><title>User Page</title></head><body><h1>Profil User</h1><ul>';
    html += '</ul></body></html>';
    html += `<form method="put" action="/users/edit/${user.id}">
                <input type="text" name="firstname" placeholder="Nouveau prénom" />
                <input type="text" name="lastname" placeholder="Nouveau nom de famille" />
                <button type="submit">Modifier</button></form>
                </form>`
    res.send(html);
    res.sendFile(__dirname + '/userform.html');
});



app.put('/users/edit', async (req, res) => {
    const userId = req.params.id;
    const { firstname, lastname } = req.body;
    try {
        const connection = await db.getConnection();
        await connection.query('UPDATE users SET firstname = ?, lastname = ? WHERE id = ?', [firstname, lastname, userId]);
        connection.release();
        res.redirect('/users');
    } catch (error) {
        console.error(error);
        res.status(500).send('Damn');
    }
});

app.post('/users/:id/create-comment', async (req, res) => {
    const { comment_link, description } = req.body;
    const connection = await db.getConnection();
    const result = await connection.query('INSERT INTO comment (description, comment_link) VALUES (?, ?)', [comment_link, description]);
    connection.release();
    res.send('Commentaire créé');
});

app.post('/admin/create-techno', async (req, res) => {
    const { firstname, lastname, email } = req.body;
    const connection = await db.getConnection();
    const result = await connection.query('INSERT INTO users (firstname, lastname, email) VALUES (?, ?, ?)', [firstname, lastname, email]);
    connection.release();
    res.send('Utilisateur créé');
});

app.get('/techno', async (req, res) => {
    const result = await db.query('SELECT techno.*, comment.* FROM techno LEFT JOIN comment ON techno.id = comment.comment_link');
    res.status(200).json(result);
});

app.get('/admin', async (req, res) => {
    const connection = await db.getConnection();
    const result = await connection.query('SELECT * FROM users');
    connection.release();
    // res.sendFile(__dirname + '/adminuser.html');
    // Le HTML avec les données pour afficher tout les users
    let html = '<html><head><title>Admin Page</title></head><body><h1>Liste des Utilisateurs</h1><ul>';

    result.forEach(user => {
        html += `<li>${user.id}</li>`;
        html += `<li>${user.firsname}</li>`;
        html += `<li>${user.lastname}</li>`;
        html += `<li>${user.email}</li>`;
        html += `<li><form method="post" action="/admin/delete/${user.id}"><button type="submit">Supprimer</button></form></li>`;
        html += `<li><form method="put" action="/admin/edit/${user.id}">
                <input type="text" name="firstname" placeholder="Nouveau prénom" />
                <input type="text" name="lastname" placeholder="Nouveau nom de famille" />
                <input type="text" name="email" placeholder="Nouveau email" />
                <button type="submit">Modifier</button></form>
                </form></li>`;
    });
    html += '</ul></body></html>';
    res.send(html);
    res.sendFile(__dirname + '/adminform.html');
});

app.post('/admin/create-user', async (req, res) => {
    const { firstname, lastname, email } = req.body;
    const connection = await db.getConnection();
    const result = await connection.query('INSERT INTO users (firstname, lastname, email) VALUES (?, ?, ?)', [firstname, lastname, email]);
    connection.release();
    res.send('Utilisateur créé');
});

app.post('/admin/create-techno', async (req, res) => {
    const { techno_name } = req.body;
    const connection = await db.getConnection();
    const result = await connection.query('INSERT INTO techo (techno_name) VALUES (?)', [techno_name]);
    connection.release();
    res.send('techo créé');
});

app.delete('/admin/delete/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const connection = await db.getConnection();
        await connection.query('DELETE FROM users WHERE id = ?', [userId]);
        connection.release();
        // Rediriger vers admin après suppression
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Oh fak');
    }
});

app.put('/admin/edit/:id', async (req, res) => {
    const userId = req.params.id;
    const { firstname, lastname, email } = req.body;
    try {
        const connection = await db.getConnection();
        await connection.query('UPDATE users SET firstname = ?, lastname = ?, email = ? WHERE id = ?', [firstname, lastname, email, userId]);
        connection.release();
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Encore ?!');
    }
});















app.listen(8000, function(){
    console.log(" serveur ouvert sur port 8000")
})