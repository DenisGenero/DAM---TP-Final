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

    const query = `
        SELECT 
            d.*, 
            m.medicionId, 
            m.fecha AS ultimaMedicionFecha, 
            m.valor AS ultimaMedicionValor
        FROM 
            Dispositivos d
        LEFT JOIN 
            Mediciones m 
        ON 
            d.dispositivoId = m.dispositivoId
        WHERE 
            d.dispositivoId = ?
        ORDER BY 
            m.fecha DESC
        LIMIT 1;
    `;

    pool.query(query, [dispositivoId], function(err, result) {
        if (err) {
            res.status(400).send(err);
            return;
        }

        // Si no se encuentra el dispositivo
        if (result.length === 0) {
            res.status(404).send({ message: 'Dispositivo no encontrado' });
            return;
        }

        res.send(result[0]); // Enviar solo el primer resultado (el dispositivo con la última medición)
    });
});

routerDispositivo.get('/:id/mediciones', (req, res) => {
    const dispositivoId = parseInt(req.params.id);

    if (isNaN(dispositivoId)) {
        return res.status(400).send('ID de dispositivo no válido');
    }

    pool.query('SELECT * FROM Mediciones WHERE dispositivoId = ?', [dispositivoId], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error al obtener mediciones');
        } else if (results.length === 0) {
            res.status(404).send('No se encontraron mediciones para este dispositivo');
        } else {
            res.status(200).json(results);
        }
    });
});

routerDispositivo.post('/:id/valvula', (req, res) => {
    const electrovalvulaId = parseInt(req.params.id);
    console.log("desde el back:", electrovalvulaId);

    if (isNaN(electrovalvulaId)) {
        return res.status(400).send('ID de electroválvula no válido');
    }

    const apertura = req.body.apertura ? 1 : 0; // Alternar apertura
    const fechaHora = new Date(); // Timestamp actual
    const humedad = String(Math.round(Math.random() * 100)); // Humedad aleatoria entre 0 y 100: se pasa a entero y luego a string
    console.log(apertura, fechaHora, electrovalvulaId, electrovalvulaId, humedad, fechaHora);

    // Inserción en Log_Riegos
    pool.query(
        `INSERT INTO Log_Riegos (apertura, fecha, electrovalvulaId) VALUES (?, ?, ?);`,
        [apertura, fechaHora, electrovalvulaId],
        (error) => {
            if (error) {
                return res.status(500).send('Error al guardar datos en Log_Riegos');
            }

            // Inserción en Mediciones
            pool.query(
                `INSERT INTO Mediciones (fecha, valor, dispositivoId) VALUES (?, ?, ?);`,
                [fechaHora, humedad, electrovalvulaId],
                (error) => {
                    if (error) {
                        return res.status(500).send('Error al guardar datos en Mediciones');
                    }
                    res.status(201).json({ message: 'Log de riego y medición guardados correctamente' });
                }
            );
        }
    );
    
});

module.exports = routerDispositivo