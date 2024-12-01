const express = require('express')

const routerDispositivo = express.Router()

var pool = require('../../mysql-connector');

routerDispositivo.get('/', function(req, res) {
    pool.query('SELECT * FROM Dispositivos', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
})

routerDispositivo.get('/:id', function(req, res) {
    const dispositivoId = req.params.id; // Obtener el ID de los parámetros de la URL

    pool.query('SELECT * FROM Dispositivos WHERE dispositivoId = ?', [dispositivoId], function(err, result) {
        if (err) {
            res.status(400).send(err);
            return;
        }

        // Si no se encuentra el dispositivo
        if (result.length === 0) {
            res.status(404).send({ message: 'Dispositivo no encontrado' });
            return;
        }

        res.send(result[0]); // Enviar solo el primer resultado (el dispositivo encontrado)
    });
});

module.exports = routerDispositivo