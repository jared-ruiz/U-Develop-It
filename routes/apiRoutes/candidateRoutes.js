const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

//GET ALL candidates api call
router.get('/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
    AS party_name
    FROM candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            //error 500 is server error
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    })
})

//GET a SINGLE candidate api call
router.get('/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
    AS party_name
    FROM candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id
    WHERE candidates.id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            //error 400 request wasnt accepted and try a different request
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    })
})

//CREATE candidate api call
router.post('/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    //prepared statement is one less since the id param isnt necessary. it auto populates
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
        VALUES (?, ?, ?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    })
})

//updates chosen candidate's party affiliation
router.put('/candidate/:id', (req, res) => {
    
    //check if a party_id was provided from the beginning
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `UPDATE candidates SET party_id = ?
                WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        }
        //check if a record was found
        else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        }
        else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    })
})

//DELETE candidate api call
router.delete('/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        }
        else if (!result.affectedRows) {
            res.json({
                message: 'Candidate note found'
            });
        }
        else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    })
})

module.exports = router;