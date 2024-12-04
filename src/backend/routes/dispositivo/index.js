const express = require('express')

const routerDispositivo = express.Router()

var pool = require('../../mysql-connector');

// Consulta por todos los dispositivos
routerDispositivo.get('/', function(req, res) {
    pool.query('SELECT * FROM Dispositivos', function(err, result) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
})

// Consulta por un sensor en particular y la última medición asociada
routerDispositivo.get('/:id', function(req, res) {
    // Obtener el ID de los parámetros de la URL
    const dispositivoId = req.params.id;

    const query = `
        SELECT 
            d.*, 
            m.medicionId, 
            m.fecha AS fecha, 
            m.valor AS humedad
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

        const dispositivo = {
            dispositivoId: result[0].dispositivoId,
            nombre: result[0].nombre,
            ubicacion: result[0].ubicacion,
            electrovalvulaId: result[0].electrovalvulaId,
        };

        const medicion = {
            medicionId: result[0].medicionId,
            fecha: result[0].fecha,
            humedad: result[0].humedad,
        };

        res.send({
            dispositivo: dispositivo,
            medicion: medicion
        });
    });
});

// Consultar las mediciones asociadas a un sensor
routerDispositivo.get('/:id/mediciones', (req, res) => {
    const dispositivoId = parseInt(req.params.id);

    if (isNaN(dispositivoId)) {
        return res.status(400).send('ID de dispositivo no válido');
    }

    pool.query('SELECT * FROM Mediciones WHERE dispositivoId = ? ORDER BY fecha DESC', [dispositivoId], (error, results) => {
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

// Registrar apertura de válvula y la medición del sensor
routerDispositivo.post('/:id/valvula', (req, res) => {
    const electrovalvulaId = parseInt(req.params.id);

    if (isNaN(electrovalvulaId)) {
        return res.status(400).send('ID de electroválvula no válido');
    }
    const apertura = req.body.apertura ? 1 : 0;
    // Timestamp actual
    const fechaHora = new Date();
    // Humedad aleatoria entre 0 y 100: se pasa a entero y luego a string
    const humedad = String(Math.round(Math.random() * 100)); 

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

// Consultar el estado de la electroválvula
routerDispositivo.get('/:id/valvula/:id', (req, res) => {
    const electrovalvulaId = parseInt(req.params.id);
    if (isNaN(electrovalvulaId)) {
      return res.status(400).send('ID de electroválvula no válido');
    }

    pool.query(
      'SELECT apertura FROM Log_Riegos WHERE electrovalvulaId = ? ORDER BY fecha DESC LIMIT 1',
      [electrovalvulaId],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send('Error al obtener el estado de la electroválvula');
        } else {
            // Si no hay registros, se asume que está cerrada (false)
            if (results.length === 0) {
                return res.status(200).json({ apertura: 0 });
            }
            // Devuelve el estado actual
            res.status(200).json({ apertura: results[0].apertura });
        }
      }
    );
  });

module.exports = routerDispositivo